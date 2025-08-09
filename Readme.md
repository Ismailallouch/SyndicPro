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

### Prerequisites
- Docker 20.10+
- Docker Compose

## 🚀 Installation Guide

### Set Up the Application

SyndicPro provides a complete dockerized environment that simplifies deployment and ensures consistency across different development machines. This installation process will create a fully functional property management system with sample data, ready for immediate use or customization.

1. **Build the containers**:
   ```bash
   docker compose build
   ```
   *Creates optimized Docker images for both the Node.js backend and PostgreSQL database, ensuring all dependencies are properly configured and isolated*

2. **Initialize the database schema**:
   ```bash
   docker compose run app npx prisma migrate dev --name init
   ```
   *Establishes the complete database structure using Prisma migrations, creating all necessary tables for co-owners, lots, payments, and maintenance requests with proper relationships and constraints*

3. **Seed sample data**:
   ```bash
   docker compose exec db psql -U postgres -d syndicPro -f seeds/01_seed.sql
   ```
   *Populates your database with realistic test data including sample co-owners, property lots, payment records, and maintenance requests - perfect for exploring features or demonstrating the system*

4. **Launch the system**:
   ```bash
   docker compose up -d
   ```
   *Starts all services in detached mode, making your complete property management system accessible via web browser with full API functionality*

## 🔌 Access the Application

Once installation is complete, SyndicPro provides multiple access points for different user types and development needs. The system is designed to be immediately usable with pre-configured accounts and realistic sample data.

| Component | Access URL | Credentials | Purpose |
|-----------|------------|-------------|---------|
| Backend API | `http://localhost:7000` | JWT Authentication | RESTful API for all property management operations |
| PostgreSQL DB | `localhost:5432` | User: `postgres`<br>Password: `postgres` | Direct database access for advanced queries and maintenance |
| Admin Account | via Login page | Email: `user1@gmail.com`<br>Password: `123456` | Full system access for property administration |

## 🔧 Development Commands

These commands help you monitor, debug, and maintain your SyndicPro installation during development and production use.

### System Monitoring & Debugging

1. **Monitor application logs**:
   ```bash
   docker compose logs -f app
   ```
   *Real-time monitoring of backend application logs, essential for debugging API requests, database operations, and system performance issues*

2. **Access database shell**:
   ```bash
   docker compose exec db psql -U postgres -d syndicPro
   ```
   *Direct PostgreSQL shell access for running custom queries, examining data integrity, and performing database maintenance tasks*

### System Maintenance

4. **Rebuild containers**:
   ```bash
   docker compose build --no-cache
   ```
   *Forces a complete rebuild of all Docker images from scratch, useful when updating dependencies or troubleshooting container issues*

5. **Stop and remove everything**:
   ```bash
   docker compose down -v
   ```
   *Completely shuts down all services and removes volumes, effectively resetting your installation to a clean state*

## 👥 Development Team

* Allouch Ismail
* Abouchiba Mohamed Yassir
* Kholty Abdelali

## 📜 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

Permission is granted for free use, modification, and distribution provided the original copyright notice and license terms are included.
