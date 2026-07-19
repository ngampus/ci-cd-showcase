# CI/CD Showcase

[![Live Demo](https://img.shields.io/badge/demo-showcase.letssee.my.id-00C7B7?style=for-the-badge&logo=cloudflare&logoColor=white)](https://showcase.letssee.my.id)

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

### Cloudflare Workers (Live)
The application is deployed as a [Cloudflare Worker](https://workers.cloudflare.com/) at:

- **URL**: [https://showcase.letssee.my.id](https://showcase.letssee.my.id)
- **Health**: [https://showcase.letssee.my.id/healthz](https://showcase.letssee.my.id/healthz)
- **Source**: [`src/worker.ts`](src/worker.ts)
- **Config**: [`wrangler.toml`](wrangler.toml)

### Staging
- Trigger: Push to `main` branch
- Approval: Manual
- Target: Cloudflare Workers (edge)

### Production
- Trigger: Git tag `v*`
- Approval: Manual (with submitter restrictions)
- Target: Cloudflare Workers `--env production`

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

- **Live Demo**: [https://showcase.letssee.my.id](https://showcase.letssee.my.id)
- [GitHub Actions Workflow](.github/workflows/ci.yml)
- [GitLab CI Pipeline](.gitlab-ci.yml)
- [Jenkins Pipeline](Jenkinsfile)
- [Cloudflare Worker Source](src/worker.ts)
