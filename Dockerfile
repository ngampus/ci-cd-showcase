# Multi-stage build for Go application
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server ./cmd/server

FROM alpine:3.20 AS runtime

RUN apk --no-cache add ca-certificates curl

WORKDIR /app
COPY --from=builder /app/server .

EXPOSE 8080

USER 1000:1000

ENTRYPOINT ["./server"]
