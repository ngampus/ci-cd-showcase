package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/ngampus/ci-cd-showcase/internal/handler"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	version := os.Getenv("VERSION")
	if version == "" {
		version = "dev"
	}
	
	http.HandleFunc("/healthz", handler.HealthHandler(version))
	
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "CI/CD Showcase v%s\n", version)
	})
	
	server := &http.Server{
		Addr:         ":" + port,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	
	fmt.Printf("Starting server on port %s (version %s)\n", port, version)
	if err := server.ListenAndServe(); err != nil {
		fmt.Fprintf(os.Stderr, "Server error: %v\n", err)
		os.Exit(1)
	}
}
