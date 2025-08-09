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

## 🐳 Docker Setup

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
- Docker Compose 2.2+

### Installation
```bash
# Build and start containers
docker compose up -d --build

# Initialize database
docker compose run app npx prisma migrate dev --name init

# Seed sample data
docker compose exec db psql -U postgres -d syndicPro -f seeds/01_seed.sql  
