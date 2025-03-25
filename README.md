# My App

This project is a simple demonstration of a React Native frontend communicating with a C++ backend using the Crow framework. When a button is pressed in the frontend, it retrieves a message from the backend and displays it.

## Project Structure

```
my-app
├── backend
│   ├── CMakeLists.txt
│   ├── main.cpp
│   └── crow_all.h
├── frontend
│   ├── App.js
│   ├── package.json
│   ├── babel.config.js
│   └── index.js
└── README.md
```

## Backend Setup

1. Navigate to the `backend` directory.
2. Ensure you have CMake installed on your system.
3. Build the backend using the following commands:

   ```
   mkdir build
   cd build
   cmake ..
   make
   ```

4. Run the backend server:

   ```
   ./your_backend_executable_name
   ```

   Replace `your_backend_executable_name` with the name of the compiled executable.

## Frontend Setup

1. Navigate to the `frontend` directory.
2. Install the necessary dependencies:

   ```
   npm install
   ```

3. Start the React Native application:

   ```
   npm start
   ```

## Usage

- Open the React Native application on your device or emulator.
- Press the button in the app to send a request to the C++ backend.
- The message "c++ backend is working" will be displayed in the app upon a successful response from the backend.

## License

This project is licensed under the MIT License.