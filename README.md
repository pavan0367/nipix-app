# Nipix - Social Media Platform

![Nipix Logo](./docs/logo.png)

**Nipix** is a full-stack social media application built with the MERN stack (MySQL, Express, React, Node.js). It provides a modern, responsive platform for sharing photos, videos, stories, and connecting with friends.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing][def]
- [License](#license)

## ✨ Features

### User Features
- 🔐 **Authentication & Authorization** (JWT-based)
-  **User Profiles** with bio, profile picture
- 🔍 **User Search** and discovery
- ➕ **Follow/Unfollow** system

### Content Features
-  **Photo & Video Posts** with Cloudinary integration
- 📝 **Captions** and location tagging
- 💬 **Comments** on posts
- ❤️ **Likes** and saves
- 📱 **Stories** (24-hour expiration)
- 🎬 **Reels** (short-form video)
- #️ **Hashtags** support

### Engagement Features
- 💬 **Real-time Messaging** (Socket.IO)
- 🔔 **Notifications** (likes, comments, follows)
-  **Explore Feed** with algorithmic ranking

### Moderation Features
- 🚫 **User Blocking**
- 🚩 **Content Reporting**
- 🔒 **Private Accounts**

## 🛠️ Tech Stack

### Frontend
- **React 18** with Hooks
- **Redux Toolkit** for state management
- **React Router DOM** for navigation
- **Axios** for API calls
- **Socket.IO Client** for real-time features

### Backend
- **Node.js** & **Express.js**
- **MySQL** with **Sequelize ORM**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Socket.IO** for real-time messaging
- **Cloudinary** for media storage
- **Multer** for file uploads

### DevOps & Deployment
- **GitHub** for version control
- **Vercel** for frontend hosting
- **Render** for backend hosting
- **TiDB Cloud** for MySQL database
- **Cloudinary** for media CDN

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MySQL database
- Cloudinary account

### Clone the Repository
```bash
git clone https://github.com/pavan0367/nipix-app.git
cd nipix-app

[def]: #contributing