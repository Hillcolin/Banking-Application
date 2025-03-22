cmake_minimum_required(VERSION 3.10)
project(BankingBackend)

set(CMAKE_CXX_STANDARD 17)

# Path to vcpkg toolchain file
set(CMAKE_TOOLCHAIN_FILE "C:/vcpkg/scripts/buildsystems/vcpkg.cmake" CACHE STRING "Vcpkg toolchain file")

# Explicitly set CMAKE_PREFIX_PATH to help find libraries
set(CMAKE_PREFIX_PATH "C:/vcpkg/installed/x64-windows")

# Set Crow_DIR to the directory containing Crow configuration files
set(Crow_DIR "C:/vcpkg/installed/x64-windows/share/crow")

# Set Firebase SDK path
set(FIREBASE_SDK_DIR "${CMAKE_SOURCE_DIR}/../firebase_cpp_sdk")

# Add Firebase SDK include directories
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}
    "${FIREBASE_SDK_DIR}/include"
)

# Add compiler definitions for Boost compatibility
add_definitions(-D_WIN32_WINNT=0x0601)  # Target Windows 7 or later

# Make sure Firebase include directory exists
include(CheckIncludeFileCXX)
check_include_file_cxx(firebase/app.h HAVE_FIREBASE_SDK)

if(NOT HAVE_FIREBASE_SDK)
    message(WARNING "Firebase SDK headers not found. Make sure the Firebase SDK is installed at ${FIREBASE_SDK_DIR}")
endif()

# Define source files (we're already in the Backend directory)
set(SOURCE_FILES
    main.cpp
    email.cpp
    Account.cpp
    Transaction.cpp
    User.cpp
)

# Find required packages
find_package(Crow CONFIG REQUIRED)
find_package(Poco REQUIRED Net Util Foundation)

# Add executable
add_executable(main ${SOURCE_FILES})

# Link libraries
target_link_libraries(main PRIVATE
    Crow::Crow
    Poco::Net
    Poco::Util
    Poco::Foundation
    # Firebase libraries
    firebase_app
    firebase_auth
    firebase_database
    # Additional libraries
    boost_system
    boost_filesystem
)

# Set library directories for Firebase
link_directories(
    "C:/vcpkg/installed/x64-windows/lib"
    "${FIREBASE_SDK_DIR}/lib" # You may need to adjust this path based on your Firebase SDK structure
)
