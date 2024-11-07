# file-uploader App 📂

file-uploader is a web application that allows users to securely upload, manage, and share files organized in folders. This project serves as a practice for backend development using **Node.js**, **Express**, **Prisma ORM**, and **Supabase** for storage.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [License](#license)

## About

The **file-uploader** app is a multi-page web application designed to provide users with secure file storage and management capabilities. With user authentication, users can create folders, upload files, and organize their data efficiently. This app does not use single-page architecture (SPA), opting for server-side rendering instead for page navigation and data display.

## Features

- **User Authentication**: Users can register and log in.
- **File Management**: Upload, view, and delete files.
- **Folder Management**: Organize files within custom folders.
- **Share Links**: Generate public URLs to share files.
- **Download files**: Allow users to download files.
- **Error Handling**: Centralized error handling and custom error pages.

## Tech Stack

- **Node.js & Express**: Backend server and routing
- **Prisma ORM**: Database management and querying
- **PostgreSQL**: Database for storing user data, file info, and folder structure
- **Supabase**: File storage and public URL generation for file downloads
- **EJS**: Template engine for server-side rendering (multi-page application)
- **Passport.js**: User authentication and session management
- **Multer**: Middleware for handling file uploads
- **TailwindCSS**: Basic styling for a clean, responsive UI

## Installation

### Prerequisites

- **Node.js** and **npm** or **pnpm** installed.
- A **PostgreSQL** database.
- Supabase account and bucket for file storage.

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/file-uploader.git
   cd file-uploader
   ```
2. **Install dependencies**:
   ```bash
     npm install
   ```
3. Configure Environment Variables: Create a .env file in the root directory and add the following:

```env
  PORT=3000
  DATABASE_URL="postgresql://username:password@hostname:5432/database"
  SESSION_SECRET="your_session_secret"
  SUPABASE_URL="https://your-supabase-instance.supabase.co"
  SUPABASE_SERVICE_ROLE_KEY="your-supabase-key"

```

4. Set Up Prisma: Initialize Prisma and generate client:

```bash
 npx prisma generate
 npx prisma migrate dev
```

5. Set Up Prisma: Initialize Prisma and generate client:

```bash
 npm start
```

The application should now be running on http://localhost:3000.

## Usage

- **Register**: Create a new user account.
- **Login**: Access your personal dashboard.
- **Upload Files**: Use the upload form to add files to specific folders.
- **Share Links**: Generate public URLs to share files.
- **Download files**: Allow users to download files.

# Conclusion

The FileUploader App offers a robust solution for secure file management and storage, combining reliable backend technologies with user-friendly features. Through implementing real-world functionalities like nested folders, relative timestamps, and file synchronization with Supabase, this project serves as an excellent practice in backend development and data handling. The app is designed to be extensible and scalable, providing a strong foundation for further enhancements in the future.
