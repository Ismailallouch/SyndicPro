# 🏢 SyndicPro - Property Management System

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13-blue)
![Prisma](https://img.shields.io/badge/Prisma-6-orange)
![Docker](https://img.shields.io/badge/Docker-20+-lightblue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-success)

SyndicPro is a full-stack property management application designed to help building administrators efficiently manage co-ownership properties. Built with modern web technologies, it provides a complete solution with intuitive dashboards and data visualization.

## ✨ Why This Project Matters

This application solves real-world problems for property administrators by:

- **Centralizing property data** in one secure location
- **Providing visual analytics** for better decision making
- **Automating routine tasks** to save time
- **Mobile-responsive design** for on-the-go management

## 🎯 Key Features

### 📊 Dashboard & Analytics
- Interactive charts showing payment status
- Maintenance request statistics
- Financial overview with visual trends

### 👥 Co-owner Management
- Complete CRUD operations with modern UI
- Contact information tracking
- Document attachment capabilities

### � Lot & Financial Management
- Visual floor plans with lot status
- Automated charge calculations
- Payment history tracking

## 🛠️ Technology Stack

| Component       | Technology               |
|----------------|--------------------------|
| Frontend       | HTML5, CSS3, JavaScript  |
| Backend        | Node.js, Express         |
| Database       | PostgreSQL               |
| ORM            | Prisma                   |
| Authentication | JWT                      |
| Containers     | Docker, Docker Compose   |

### Services Architecture

1. **Backend Service** (`app`)
   - Node.js + Express server
   - Prisma for database operations
   - Serves REST API on port 7000

2. **Database Service** (`db`)
   - PostgreSQL 13 with persistent storage
   - Auto-seeding on first run
   - Health-check enabled

## 🚀 Quick Start

### Prerequisites
- Docker 20.10+
- Docker Compose

## 🚀 Installation Guide

### Set Up the Application

1. **Build the containers**:
   ```bash
   docker compose build
   ```
   *Prepares the Docker images for both backend and database services*

2. **Initialize the database schema**:
   ```bash
   docker compose run app npx prisma migrate dev --name init
   ```
   *Applies all database migrations using Prisma*

3. **Seed sample data**:
   ```bash
   docker compose exec db psql -U postgres -d syndicPro -f seeds/01_seed.sql
   ```
   *Populates the database with initial test data including admin accounts*

4. **Launch the system**:
   ```bash
   docker compose up -d
   ```
   *Starts all services in detached mode*

## 🔌 Access the Application

| Component | Access URL | Credentials |
|-----------|------------|-------------|
| Backend API | `http://localhost:7000` | JWT Authentication |
| PostgreSQL DB | `localhost:5432` | User: `postgres`<br>Password: `postgres` |
| Admin Account | N/A | Username: `user1`<br>Password: `1234` |

## 🔧 Development Commands

```bash
# Monitor application logs
docker compose logs -f app

# Access database shell
docker compose exec db psql -U postgres -d syndicPro

# Run Prisma Studio (DB GUI)
docker compose exec app npx prisma studio

# Rebuild containers
docker compose build --no-cache

# Stop and remove everything
docker compose down -v
```

## 👥 Development Team

* **Lead Developer**: [Your Name] - System architecture & backend
* **Frontend Specialist**: [Your Name] - UI/UX implementation  
* **Database Engineer**: [Your Name] - Data modeling & optimization

## 📜 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

Permission is granted for free use, modification, and distribution provided the original copyright notice and license terms are included.
