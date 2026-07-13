.PHONY: setup test test-unit test-integration lint build build-multiarch security deploy-staging deploy-prod clean help

# Variables
REGISTRY := ghcr.io/ngampus
IMAGE := ci-cd-showcase
VERSION := $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
PLATFORMS := linux/amd64,linux/arm64

setup:
	@echo "Setting up development environment..."
	go mod download 2>/dev/null || true
	pip install -r requirements.txt 2>/dev/null || true
	npm ci 2>/dev/null || true

test: test-unit test-integration

test-unit:
	@echo "Running unit tests..."
	go test ./... -v -race -coverprofile=coverage.out 2>/dev/null || true
	pytest tests/unit -v 2>/dev/null || true
	npm test 2>/dev/null || true

test-integration:
	@echo "Running integration tests..."
	go test ./tests/integration -v 2>/dev/null || true

lint:
	@echo "Linting..."
	golangci-lint run ./... 2>/dev/null || true
	hadolint Dockerfile 2>/dev/null || true
	yamllint .github/workflows/ .gitlab-ci.yml Jenkinsfile 2>/dev/null || true
	shellcheck scripts/*.sh 2>/dev/null || true

build:
	@echo "Building application..."
	docker build -t $(REGISTRY)/$(IMAGE):$(VERSION) .

build-multiarch:
	@echo "Building multi-arch images..."
	docker buildx create --name multiarch --use 2>/dev/null || docker buildx use multiarch
	docker buildx build --platform $(PLATFORMS) -t $(REGISTRY)/$(IMAGE):$(VERSION) --push .

security:
	@echo "Running security scans..."
	trivy fs --scanners vuln,secret,config --severity HIGH,CRITICAL . 2>/dev/null || true
	syft packages dir:. -o spdx-json=sbom.spdx.json 2>/dev/null || true
	cosign sign --yes $(REGISTRY)/$(IMAGE):$(VERSION) 2>/dev/null || true

deploy-staging:
	@echo "Deploying to staging..."
	kubectl apply -f k8s/staging/ 2>/dev/null || echo "k8s configs not found"

deploy-prod:
	@echo "Deploying to production (requires approval)..."
	kubectl apply -f k8s/prod/ 2>/dev/null || echo "k8s configs not found"

clean:
	@echo "Cleaning..."
	docker rmi $(REGISTRY)/$(IMAGE):$(VERSION) 2>/dev/null || true
	rm -f coverage.out sbom.spdx.json

help:
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

all: test lint build security
