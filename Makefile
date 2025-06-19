# Load environment variables from .env file
-include .env
ifneq ("$(wildcard .env)","")
export $(shell sed 's/=.*//' .env)
endif

CONTEXT_DIR := $(shell pwd)

.PHONY: install
install:
	@echo "Install the dependencies" && \ \
	bun install && \
	echo "Dependencies installed successfully"

.PHONY: start
start:
	echo "Start all services" && \
	docker compose up -d --build && \
	echo "All services started successfully"

.PHONY: stop
stop:
	echo "Stop all services" && \
	docker compose down && \
	echo "All services stopped successfully"