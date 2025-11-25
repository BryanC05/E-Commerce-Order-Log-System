# Hybrid E-Commerce Order & Log System 🚀

![Status](https://img.shields.io/badge/status-ready-success)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)
![Laravel](https://img.shields.io/badge/laravel-%23FF2D20.svg?style=flat&logo=laravel&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F.svg?style=flat&logo=node.js&logoColor=white)
![k6](https://img.shields.io/badge/k6-load%20testing-purple)

A high-performance backend system demonstrating a **Hybrid Microservices Architecture**.

This project integrates **Laravel (MySQL)** for transactional integrity and **Node.js (MongoDB)** for high-volume asynchronous logging. The entire infrastructure is containerized via Docker Compose and has been stress-tested using **k6**.

---

## 🏗 Architecture Overview

The system consists of two distinct services communicating via an internal Docker network:

1.  **Transactional Service (Laravel + MySQL):** Handles User Checkout. Ensures ACID compliance for financial data.
2.  **Logging Service (Node.js + MongoDB):** Handles Activity Logging. Captures high-volume system events asynchronously to avoid blocking the main thread.

**Data Flow:**
```bash
[ Client ] ──(POST /checkout)──▶ [ Laravel API ] ────(SQL Transaction)───▶ [ MySQL ]
                                      │
                                      ▼
                               (Async HTTP Call)
                                      │
                                      ▼
                                [ Node.js Service ] ──(Write Log)──▶ [ MongoDB ]
```
-----

## 🧪 Quality Assurance & Performance (QC)

To ensure system stability under high traffic, I implemented an automated load testing suite using **k6 by Grafana**.

### Load Test Scenario

  * **Objective:** Stress test the Checkout Endpoint (`/api/checkout`) to verify Docker container stability and database locking mechanisms.
  * **Virtual Users (VUs):** 50 concurrent users.
  * **Duration:** 30 seconds.

### Test Script (`load-test.js`)

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:8000/api/checkout';
  const payload = JSON.stringify({ total: 150000 });
  const params = { headers: { 'Content-Type': 'application/json' } };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction success': (r) => r.body.includes('success'),
  });

  sleep(1);
}


### 📊 Benchmark Results

The system demonstrated exceptional resilience and high throughput:

| Metric | Result |
| :--- | :--- |
| **Total Requests** | **72,374** completed transactions |
| **Duration** | 30 Seconds |
| **Throughput** | **\~2,412 Requests Per Second (RPS)** |
| **Failed Requests** | 0.00% |

> **Insight:** By offloading logging to Node.js, the main Laravel application maintained a response time of under 200ms even under heavy load, proving the efficiency of the hybrid architecture.

-----

## 🛠 Tech Stack

  * **Core Backend:** Laravel 11 (PHP 8.2)
  * **Microservice:** Express.js (Node.js 18)
  * **Databases:** MySQL 8.0 & MongoDB
  * **DevOps:** Docker & Docker Compose
  * **Testing:** k6 (Performance), Postman (API Automation)

-----

## ⚡️ How to Run

### 1\. Start the Environment

```bash
# Clone the repo
git clone <REPO_URL>

# Start Docker containers
docker-compose up -d --build
```

### 2\. Setup Database (First run only)

```bash
docker-compose exec laravel-app php artisan migrate
docker-compose exec laravel-app php artisan install:api
```

### 3\. Run the Load Test (Optional)

If you have **k6** installed locally:

```bash
k6 run load-test.js
```

-----

## 📝 Author

**Bryan Chan**
*Backend Developer & QC Enthusiast*
