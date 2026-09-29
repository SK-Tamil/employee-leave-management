# Employee Leave Management System

A containerized **Employee Leave Management System** built with React, Flask, Python, and MySQL. The application provides separate employee and administration workflows for submitting, tracking, and approving employee leave requests.

## 📌 Project Overview

The Employee Leave Management System is a web-based application designed to simplify employee leave management.

Employees can:

* Login securely
* View their employee profile
* Check leave balance
* Apply for leave
* View leave history
* Track leave status
* View approved, pending, and rejected requests

Administrators and managers can:

* Manage employees
* View leave requests
* Approve or reject leave requests
* Track employee leave
* Manage users and roles
* Monitor leave information through dashboards

---

## 🎯 Project Objectives

* Provide a centralized employee leave management system
* Simplify the leave application and approval process
* Reduce manual leave management
* Provide employee and admin portals
* Implement role-based access
* Maintain leave history and leave status
* Build a scalable containerized application
* Deploy the application using AWS services
* Implement CI/CD using Jenkins and GitHub

---

## ✨ Key Features

### Employee Portal

* Secure Login
* Employee Dashboard
* Employee Profile
* Apply Leave
* Leave Balance
* Leave History
* Leave Tracking
* Leave Status

### Admin / Manager Portal

* Admin Dashboard
* Employee Management
* User Management
* Leave Request Management
* Leave Approval
* Leave Rejection
* Approval Workflow
* Employee Leave Tracking

### Leave Types

* Sick Leave
* Casual Leave
* Earned Leave
* Annual Leave

### Leave Status

* Pending
* Approved
* Rejected

---

## 🏗️ Application Architecture

```text
                         Users
                           |
                           v
                    +-------------+
                    |    Nginx    |
                    |   Port 80   |
                    +------+------+
                           |
             +-------------+-------------+
             |                           |
             v                           v
      +-------------+              +-------------+
      |   React     |              |   Flask     |
      |  Frontend   |              |   Backend   |
      |    Vite     |              | Python API  |
      +-------------+              +------+------+
                                          |
                                          v
                                   +-------------+
                                   |    MySQL    |
                                   |  Database   |
                                   +-------------+
```

---

## ☁️ AWS Deployment Architecture

```text
                         Internet
                            |
                            v
                    +---------------+
                    |      ALB      |
                    | Application   |
                    | Load Balancer |
                    +-------+-------+
                            |
                 +----------+----------+
                 |                     |
                 v                     v
        +----------------+    +----------------+
        | ECS Frontend   |    | ECS Backend    |
        | React/Nginx    |    | Flask/Python   |
        +----------------+    +--------+-------+
                                      |
                                      v
                               +-------------+
                               |     RDS     |
                               |    MySQL    |
                               +-------------+

        Container Images
              |
              v
        +-------------+
        |     ECR     |
        +-------------+
```

---

## 🔄 CI/CD Workflow

The project uses GitHub and Jenkins for continuous integration and deployment.

```text
Developer
    |
    v
GitHub
  dev branch
    |
    | Webhook
    v
 Jenkins
    |
    +----------------------+
    |                      |
    v                      v
Build Frontend       Build Backend
    |                      |
    +----------+-----------+
               |
               v
        Docker Images
               |
               v
             ECR
       +-------+-------+
       |               |
       v               v
employee-frontend  employee-backend
       |               |
       +-------+-------+
               |
               v
              ECS
               |
               v
              ALB
               |
               v
             Users
               |
               v
        Final Email Notification
```

---

## 🛠️ Technologies Used

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS
* Bootstrap

### Backend

* Python
* Flask
* Flask-SQLAlchemy
* REST API
* CORS
* PyMySQL

### Database

* MySQL
* Amazon RDS

### Containerization

* Docker
* Docker Compose

### Web Server / Reverse Proxy

* Nginx

### DevOps

* Git
* GitHub
* Jenkins
* CI/CD

### AWS

* Amazon ECS
* Amazon ECR
* Amazon RDS
* Application Load Balancer (ALB)
* IAM
* VPC

---

## 🐳 Docker Architecture

The application is containerized into separate services.

```text
+------------------------------------------+
|              Docker Environment          |
|                                          |
|  +-------------+    +-------------+      |
|  |   React     |    |   Flask     |      |
|  |  Frontend   |    |   Backend   |      |
|  +-------------+    +------+------+\     |
|                             |             |
|                             v             |
|                       +-----------+       |
|                       |   MySQL   |       |
|                       +-----------+       |
|                                          |
+------------------------------------------+
```

Docker Compose is used for local development and testing.

---

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SK-Tamil/employee-leave-management.git
cd employee-leave-management
```

### 2. Start the Application

```bash
docker compose up -d --build
```

### 3. Check Running Containers

```bash
docker ps
```

### 4. Access the Application

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

## 🔧 Useful Docker Commands

Start containers:

```bash
docker compose up -d
```

Build and start:

```bash
docker compose up -d --build
```

View containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs
```

View specific service logs:

```bash
docker compose logs frontend
```

```bash
docker compose logs backend
```

Stop containers:

```bash
docker compose down
```

---

## 🌐 Nginx Configuration

Nginx is used as the web server and reverse proxy.

The intended request flow is:

```text
Browser
   |
   v
Nginx :80
   |
   +------> React Frontend
   |
   +------> Flask API
```

Nginx provides a single entry point for the application and forwards API requests to the Flask backend.

---

## 🔐 Security

The project follows basic application and AWS security practices:

* IAM-based AWS access
* Role-based application access
* Environment variables for configuration
* Sensitive credentials excluded from Git
* `.env` files excluded using `.gitignore`
* AWS security groups
* Private database access where applicable
* Containerized application services

**Never commit passwords, AWS access keys, database credentials, or other secrets to GitHub.**

---

## 📁 Project Structure

```text
employee-leave-management/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── backend/
│   ├── app.py
│   ├── extensions.py
│   ├── models.py
│   ├── routes.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── venv/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

> The `venv/` directory should remain excluded from Git using `.gitignore`.

---

## 📊 Application Modules

```text
Employee Leave Management
│
├── Authentication
│   └── Secure Login
│
├── Employee Management
│   ├── Employee Profile
│   └── User Management
│
├── Leave Management
│   ├── Apply Leave
│   ├── Leave Balance
│   ├── Leave History
│   ├── Leave Tracking
│   └── Leave Status
│
├── Approval Management
│   ├── Pending
│   ├── Approved
│   └── Rejected
│
└── Dashboard
    ├── Employee Dashboard
    └── Admin Dashboard
```

---

## 🔌 REST API

The Flask backend provides REST API endpoints for communication between the React frontend and backend services.

```text
React Frontend
       |
       | HTTP / REST API
       v
Flask Backend
       |
       v
MySQL Database
```

The API handles operations such as:

* Authentication
* Employee management
* Leave requests
* Leave approval
* Leave status
* Leave history
* Leave balance

---

## 🔄 Development Workflow

```text
Code Changes
     |
     v
Local Testing
     |
     v
Git
     |
     v
GitHub
     |
     v
dev Branch
     |
     v
Jenkins Webhook
     |
     v
CI/CD Pipeline
     |
     v
Docker Build
     |
     v
Amazon ECR
     |
     v
Amazon ECS
     |
     v
Application Load Balancer
     |
     v
Application
```

---

## 🎓 Project Purpose

This project demonstrates practical implementation of:

* Full-stack web application development
* REST API development
* Database integration
* Docker containerization
* Docker Compose
* Nginx reverse proxy
* Git and GitHub
* Jenkins CI/CD
* AWS ECS deployment
* Amazon ECR
* Amazon RDS
* Application Load Balancer
* Basic cloud security practices

---

## 🚧 Future Enhancements

Possible future improvements include:

* Email notifications for leave requests
* Advanced attendance management
* Leave calendar
* Employee reporting
* Admin analytics
* CloudWatch monitoring
* HTTPS using SSL/TLS
* Custom domain using Route 53
* Automated database backup and recovery
* Enhanced role and permission management

---

## 👨‍💻 Author

**Tamilselvan S**

**AWS DevOps Engineer**

### Skills

```text
AWS
Docker
Kubernetes
Jenkins
Terraform
Ansible
Git
GitHub
ArgoCD
Prometheus
Grafana
Python
React
Flask
MySQL
Linux
Nginx
CI/CD
```

### LinkedIn

linkedin.com/in/tamilselvan-s336

---

## 📜 License

This project is created for educational and project demonstration purposes.
