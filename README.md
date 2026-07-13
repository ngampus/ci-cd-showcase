# CI/CD Showcase

Multi-platform CI/CD pipeline comparison: GitHub Actions, GitLab CI, and Jenkins.

## Overview

This project demonstrates equivalent CI/CD pipelines across three major platforms:
- **GitHub Actions** (`.github/workflows/ci.yml`)
- **GitLab CI** (`.gitlab-ci.yml`)
- **Jenkins** (`Jenkinsfile`)

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Source    │────▶│   Lint      │────▶│   Test      │
│   Code      │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Security   │     │  Build      │
                    │  (Trivy)    │     │  (Docker)   │
                    └─────────────┘     └─────────────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────────────────────────┐
                    │       Deploy Staging            │
                    │    (Manual Approval)            │
                    └─────────────────────────────────┘
                           │
                           ▼
                    ┌─────────────────────────────────┐
                    │       Deploy Production         │
                    │    (Tag-based, Manual)          │
                    └─────────────────────────────────┘
```

## Pipeline Stages

| Stage | GitHub Actions | GitLab CI | Jenkins |
|-------|----------------|-----------|---------|
| Lint | `golangci-lint`, `hadolint`, `yamllint` | `golangci-lint` | Parallel: Go, Docker, YAML |
| Test | `go test -race -cover` | `go test` with coverage | `go test` with coverage |
| Security | Trivy FS scan + SARIF upload | Trivy SARIF report | Trivy + Nancy + CodeQL |
| Build | Docker multi-stage build | Docker build/push | Docker withRegistry |
| Deploy Staging | Manual approval | Manual approval | Input approval |
| Deploy Production | Tag-based manual | Tag-based manual | Tag-based with submitters |

## Quick Start

```bash
# Run locally
make dev

# Run tests
make test

# Build image
make build

# Run container
docker run -p 8080:8080 ghcr.io/ngampus/ci-cd-showcase:latest
```

## Deployment

### Staging
- Trigger: Push to `main` branch
- Approval: Manual
- Environment: `staging`

### Production
- Trigger: Git tag `v*`
- Approval: Manual (with submitter restrictions)
- Environment: `production`

## Security

- Supply chain: Cosign keyless signing
- SBOM: Syft (CycloneDX/SPDX)
- Vulnerability scanning: Trivy
- Policy: Kyverno/Gatekeeper

## Local Development

```bash
# Install tools
make setup

# Run all checks
make all

# Generate SBOM
make sbom
```

## Links

- [GitHub Actions Workflow](.github/workflows/ci.yml)
- [GitLab CI Pipeline](.gitlab-ci.yml)
- [Jenkins Pipeline](Jenkinsfile)
