# MediAccess - QR Based Medical Record Storage

## Overview
A full-stack web application allowing hospital staff to securely store, retrieve, and manage patient medical records via QR codes using role-based access control.

## Prerequisites
- **Java 17+**
- **Node.js 18+**
- **MySQL Server**
- Maven (or use an IDE like IntelliJ/VSCode)

## Architecture & Tech Stack
- **Backend:** Spring Boot 3, Spring Security (JWT), Spring Data JPA, MySQL, ZXing (QR Code generation)
- **Frontend:** React (Vite), React Router DOM, Axios, html5-qrcode, Vanilla CSS (Glassmorphism)

## Step 1: Database Setup
1. Ensure your local MySQL server is running.
2. Create the database:
   ```sql
   CREATE DATABASE mediaccess_db;
   ```
3. Update the `backend/src/main/resources/application.properties` with your MySQL credentials, if they differ from the defaults:
   - `spring.datasource.username=root`
   - `spring.datasource.password=password`

## Step 2: Running the Backend
1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   mvn clean spring-boot:run
   ```
2. The server will start on `http://localhost:8080`.
3. Provide the frontend API endpoint (`baseURL`) matches this in `frontend/src/services/api.js`.
4. *Note:* Default role-based users are automatically generated on the first run (handled via `DataLoader.java`):
   - **Admin:** `admin` / `admin123`
   - **Doctor:** `doctor` / `doctor123`
   - **Nurse:** `nurse` / `nurse123`

## Step 3: Running the Frontend
1. Open a terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:5173`.

## Roles & Permissions
- **Admin**: Has full access. Can add/edit/delete all patients, view records, and generate/download QR codes.
- **Doctor**: Can view all patients, view specific patient records, edit patient details, and generate/download patient QR codes.
- **Nurse**: Can view the patient directory, verify patient identity via QR scanner, and view the medical records in a read-only state.
