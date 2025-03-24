cmake_minimum_required(VERSION 3.10)
project(BankingBackend)

set(CMAKE_CXX_STANDARD 17)

# Path to vcpkg toolchain file
set(CMAKE_TOOLCHAIN_FILE "${CMAKE_SOURCE_DIR}/../vcpkg/scripts/buildsystems/vcpkg.cmake" CACHE STRING "Vcpkg toolchain file")

# Explicitly set CMAKE_PREFIX_PATH to help find libraries
set(CMAKE_PREFIX_PATH "${CMAKE_SOURCE_DIR}/../vcpkg/installed/x64-windows")

# Set Crow_DIR to the directory containing Crow configuration files
set(Crow_DIR "${CMAKE_SOURCE_DIR}/../vcpkg/installed/x64-windows/share/crow")

# Set Firebase SDK path
set(FIREBASE_SDK_DIR "${CMAKE_SOURCE_DIR}/../firebase_cpp_sdk")

# Add Firebase SDK include directories
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}
    "${FIREBASE_SDK_DIR}/include"
)

# Add compiler definitions for Boost compatibility
add_definitions(-D_WIN32_WINNT=0x0601)  # Target Windows 7 or later

# Check if Firebase SDK headers exist
if(EXISTS "${FIREBASE_SDK_DIR}/include/firebase/app.h")
    message(STATUS "Firebase SDK headers found.")
else()
    message(FATAL_ERROR "Firebase SDK headers not found at ${FIREBASE_SDK_DIR}/include/firebase/app.h. Make sure the Firebase SDK is installed at ${FIREBASE_SDK_DIR}")
endif()

# Define source files (we're already in the Backend directory)
set(SOURCE_FILES
    main.cpp
    Account.cpp
    Transaction.cpp
    User.cpp
)

# Set policy for Boost
if(POLICY CMP0167)
    cmake_policy(SET CMP0167 NEW)
endif()

# Find required packages
find_package(Crow CONFIG REQUIRED)
find_package(Boost CONFIG REQUIRED system filesystem)

# Add executable
add_executable(main ${SOURCE_FILES})

# Link libraries
target_link_libraries(main PRIVATE
    Crow::Crow
    # Firebase libraries
    firebase_app
    firebase_auth
    firebase_database
    # Additional libraries
    Boost::system
    Boost::filesystem
)

# Set library directories for Firebase
link_directories(
    "${CMAKE_SOURCE_DIR}/../vcpkg/installed/x64-windows/lib"
    "${FIREBASE_SDK_DIR}/libs"
)

message(STATUS "Firebase SDK path: ${FIREBASE_SDK_DIR}")
