![CI Status](https://github.com/BryanC05/E-Commerce-Order-Log-System/actions/workflows/main.yml/badge.svg)
````markdown
# Hybrid E-Commerce Order & Log System 🚀

![CI Status](https://github.com/BryanC05/E-Commerce-Order-Log-System/actions/workflows/main.yml/badge.svg)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)
![Laravel](https://img.shields.io/badge/laravel-%23FF2D20.svg?style=flat&logo=laravel&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F.svg?style=flat&logo=node.js&logoColor=white)
![k6](https://img.shields.io/badge/k6-load%20testing-purple)

A production-ready backend system demonstrating a **Hybrid Microservices Architecture**.

This project integrates **Laravel (MySQL)** for transactional integrity and **Node.js (MongoDB)** for high-volume asynchronous logging. The infrastructure is containerized via Docker Compose and features an automated **CI/CD Pipeline** with **k6 Load Testing**.

---

## 🏗 Architecture Overview

The system consists of two distinct services communicating via an internal Docker network:

1.  **Main Service (Laravel + MySQL):** Handles User Checkout. Ensures ACID compliance for financial data.
2.  **Log Service (Node.js + MongoDB):** Handles Activity Logging. Captures high-volume system events asynchronously via HTTP requests.

**Data Flow:**
```mermaid
[ Client ] ──(POST /checkout)──▶ [ Laravel API ] ────(SQL Transaction)───▶ [ MySQL ]
                                      │
                                      ▼
                               (Async HTTP Call)
                                      │
                                      ▼
                                [ Node.js Service ] ──(Write Log)──▶ [ MongoDB ]
````

-----

## 🛠 Tech Stack

  * **Core Backend:** Laravel 11 (PHP 8.2)
  * **Microservice:** Express.js (Node.js 18)
  * **Databases:** MySQL 8.0 & MongoDB
  * **DevOps:** Docker & Docker Compose
  * **Testing:** k6 (Performance), Postman (API Automation)
  * **CI/CD:** GitHub Actions

-----

## 🚀 How to Run

You don't need to install PHP, Node, or MySQL locally. **You only need Docker.**

### 1\. Clone the Repository

```bash
git clone [https://github.com/BryanC05/E-Commerce-Order-Log-System.git](https://github.com/BryanC05/E-Commerce-Order-Log-System.git)
cd E-Commerce-Order-Log-System
```

### 2\. Start Containers

```bash
docker compose up -d --build
```

*Wait for a few minutes for the initial build and image download.*

### 3\. Setup Laravel (First Time Only)

Run these commands to prepare the Laravel application inside the container:

```bash
# Fix permissions & Install dependencies
docker compose exec laravel-app chmod -R 777 storage bootstrap/cache
docker compose exec laravel-app composer install

# Setup Application
docker compose exec laravel-app php artisan key:generate
docker compose exec laravel-app php artisan migrate
docker compose exec laravel-app php artisan install:api
```

-----

## 📡 API Documentation

### 1\. Checkout (Main Feature)

Simulates a user purchasing an item. This triggers a write operation to MySQL and automatically sends a log to the Node.js service.

  * **Endpoint:** `POST http://localhost:8000/api/checkout`

  * **Content-Type:** `application/json`

  * **Body:**

    ```json
    {
        "total": 500000
    }
    ```

  * **Success Response:**

    ```json
    {
        "status": "success",
        "message": "Order berhasil disimpan di MySQL & Log tercatat di MongoDB!",
        "order_id": 1
    }
    ```

-----

## 🧪 Quality Assurance & Performance (QC)

To ensure system stability under high traffic, I implemented an automated load testing suite using **k6 by Grafana**.

### Automated CI/CD Pipeline

Every push to the `main` branch triggers a GitHub Actions workflow that:

1.  Builds the Docker environment.
2.  Runs database migrations.
3.  **Executes the k6 Load Test** to verify performance.

### Benchmark Results

Running `load-test.js` with **50 Concurrent Users** for 30 seconds:

| Metric | Result |
| :--- | :--- |
| **Total Requests** | **\~72,000** completed transactions |
| **Throughput** | **\~2,400 Requests Per Second (RPS)** |
| **Failed Requests** | **0.00%** (Zero Downtime) |
| **Avg Latency** | \< 200ms |

> **Insight:** By offloading logging to Node.js, the main Laravel application remains lightweight and responsive even under heavy load.

-----

## 📝 Author

**Bryan**
*Backend & QC Enthusiast*

```
```
*Backend Developer & QC Enthusiast*
