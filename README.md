# Hybrid E-Commerce Order & Log System 🚀

![Project Status](https://img.shields.io/badge/status-completed-success)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)
![Laravel](https://img.shields.io/badge/laravel-%23FF2D20.svg?style=flat&logo=laravel&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F.svg?style=flat&logo=node.js&logoColor=white)

A proof-of-concept backend system demonstrating a **Hybrid Microservices Architecture**.

This project integrates **Laravel (MySQL)** for handling core transactional data and **Node.js (MongoDB)** for high-speed activity logging. The entire infrastructure is containerized and orchestrated using **Docker Compose**.

---

## 🏗 Architecture Overview

The system consists of two distinct services communicating via an internal Docker network:

1.  **Main Service (Laravel + MySQL):** Handles User Checkout. It ensures data consistency (ACID) for financial transactions.
2.  **Log Service (Node.js + MongoDB):** Handles Activity Logging. It captures system events asynchronously for audit trails.

**Data Flow:**
````markdown
Client Request (POST /checkout)
      │
      ▼
[ Laravel Container ] ────(Transaction)───▶ [ MySQL Container ]
      │
      │ (HTTP Request via Internal Network)
      ▼
[ Node.js Container ] ────(Store Log)─────▶ [ MongoDB Container ]

-----

## 🛠 Tech Stack

  * **Core Backend:** Laravel 11 (PHP 8.2)
  * **Microservice:** Express.js (Node.js 18)
  * **Relational Database:** MySQL 8.0 (Orders & Users)
  * **NoSQL Database:** MongoDB (Activity Logs)
  * **DevOps:** Docker & Docker Compose

-----

## 🚀 How to Run

You don't need to install PHP, Node, or MySQL locally. **You only need Docker.**

### 1\. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

### 2\. Start Containers

```bash
docker-compose up -d --build
````

*Wait for a few minutes for the initial build and image download.*

### 3\. Setup Laravel (First Time Only)

Run these commands to prepare the Laravel application inside the container:

```bash
# Install dependencies (if not installed during build)
docker-compose exec laravel-app composer install

# Generate App Key
docker-compose exec laravel-app php artisan key:generate

# Run Database Migrations (Creates 'orders' table in MySQL)
docker-compose exec laravel-app php artisan migrate

# Install API Scaffolding (Required for Laravel 11)
docker-compose exec laravel-app php artisan install:api
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

## 🔍 Verification (Behind the Scenes)

To verify that the microservices are working correctly, you can inspect the databases directly via Docker.

**Check MySQL (Orders):**

```bash
docker-compose exec mysql-db mysql -u root -p -e "USE ecommerce_db; SELECT * FROM orders;"
# Password: rootpassword
```

**Check MongoDB (Logs):**

```bash
docker-compose exec mongo-db mongosh "mongodb://localhost:27017/logs_db" --eval "db.logs.find()"
```

-----

## 💡 Key Learning Points

By building this project, I demonstrated understanding in:

  * **SQL vs NoSQL:** Knowing when to use Relational DB (MySQL) for structured order data vs NoSQL (MongoDB) for unstructured logs.
  * \*\*Docker Networking:\*\*Configuring service discovery so Laravel can communicate with Node.js using hostname `http://node-logger`.
  * **Inter-service Communication:** Implementing RESTful HTTP calls between backend services.
  * **Database Transactions:** Using Laravel `DB::beginTransaction()` to ensure data integrity.

-----

## 📝 Author

**Bryan Chan**
*Open for Internship*
