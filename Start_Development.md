# How to Run the Project

This guide explains how to run the project, including starting the backend (C++ Crow server) and the frontend (React application).

## Prerequisites

- **Backend**: Ensure you have a C++ compiler (e.g., `g++`), CMake, and the necessary libraries installed.
- **Frontend**: Ensure you have Node.js and npm installed.

## Backend (C++ Crow Server)

1. **Install Crow**: Follow the instructions on the [Crow GitHub page](https://github.com/ipkn/crow) to install Crow.

2. **Navigate to the Backend Directory**:
    ```sh
    cd path/to/backend
    ```

3. **Configure the Build with CMake**:
    ```sh
    cmake -B build -DCMAKE_TOOLCHAIN_FILE="vcpkg\scripts\buildsystems\vcpkg.cmake"
    ```

4. **Build the Backend**:
    ```sh
    cmake --build build
    ```

5. **Run the Backend**:
    ```sh
    build/Debug/MyCrowApp.exe
    ```

    The backend server should now be running on `http://localhost:8080`.

## Frontend (React Application)

1. **Navigate to the Frontend Directory**:
    ```sh
    cd Frontend
    ```

2. **Install Dependencies**:
    ```sh
    npm install
    ```

3. **Start the Frontend**:
    ```sh
    npm run dev
    ```

    The frontend application should now be running on `http://localhost:3000`.

## Environment Variables

Ensure that the `.env` file in the frontend directory contains the necessary environment variables for Firebase configuration:

```properties
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id