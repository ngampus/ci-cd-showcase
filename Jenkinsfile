pipeline {
    agent any
    
    environment {
        REGISTRY = 'ghcr.io'
        IMAGE = "${REGISTRY}/${GITHUB_REPOSITORY_OWNER}/${GITHUB_REPOSITORY}"
        VERSION = "${GITHUB_SHA?.take(7) ?: 'local'}"
    }
    
    tools {
        maven 'Maven 3.9'
        jdk 'JDK 17'
        docker 'Docker'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Lint') {
            parallel {
                stage('Go Lint') {
                    agent { label 'golang' }
                    steps {
                        sh 'golangci-lint run ./...'
                    }
                }
                stage('Docker Lint') {
                    agent { label 'docker' }
                    steps {
                        sh 'hadolint Dockerfile'
                    }
                }
                stage('YAML Lint') {
                    agent any
                    steps {
                        sh 'yamllint .'
                    }
                }
            }
        }
        
        stage('Test') {
            agent { label 'golang' }
            steps {
                sh 'go test ./... -v -race -coverprofile=coverage.out'
            }
            post {
                always {
                    publishCoverage adapters: [coberturaAdapter('coverage.xml')], target: 'coverage.xml'
                }
            }
        }
        
        stage('Security') {
            parallel {
                stage('Trivy FS') {
                    agent { label 'docker' }
                    steps {
                        sh '''
                            trivy fs --scanners vuln,secret,config \
                                --severity HIGH,CRITICAL \
                                --format sarif --output trivy.sarif .
                        '''
                    }
                }
                stage('Dependency Check') {
                    agent { label 'golang' }
                    steps {
                        sh 'go list -json -m all | nancy sleuth'
                    }
                }
                stage('CodeQL') {
                    agent { label 'codeql' }
                    steps {
                        // CodeQL analysis runs via GitHub Actions
                        echo 'CodeQL runs in GitHub Actions'
                    }
                }
            }
        }
        
        stage('Build') {
            agent { label 'docker' }
            when {
                anyOf {
                    branch 'main'
                    tag 'v*'
                }
            }
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY}", 'github-packages') {
                        def img = docker.build("${IMAGE}:${VERSION}")
                        img.push()
                        if (env.GITHUB_REF?.startsWith('refs/tags/')) {
                            img.push('latest')
                        }
                    }
                }
            }
        }
        
        stage('Deploy Staging') {
            agent { label 'cloudflare' }
            when {
                branch 'main'
            }
            input {
                message 'Deploy to Cloudflare Workers Staging?'
                ok 'Deploy'
            }
            steps {
                withEnv(['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID']) {
                    sh 'npx wrangler deploy --name ci-cd-showcase'
                }
            }
        }
        
        stage('Deploy Production') {
            agent { label 'cloudflare' }
            when {
                tag 'v*'
            }
            input {
                message 'Deploy to Cloudflare Workers Production?'
                ok 'Deploy'
                submitter 'ngampus,platform-team'
            }
            steps {
                withEnv(['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID']) {
                    sh 'npx wrangler deploy --name ci-cd-showcase --env production'
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
            archiveArtifacts artifacts: 'coverage.out,trivy.sarif', allowEmptyArchive: true
        }
        failure {
            slackSend channel: '#deployments', message: "❌ Pipeline failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        }
        success {
            slackSend channel: '#deployments', message: "✅ Pipeline succeeded: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        }
    }
}
