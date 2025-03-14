cmake_minimum_required(VERSION 3.10)
project(MyCrowApp)

set(CMAKE_CXX_STANDARD 17)

# Path to vcpkg toolchain file
set(CMAKE_TOOLCHAIN_FILE "${CMAKE_SOURCE_DIR}/../../../vcpkg/scripts/buildsystems/vcpkg.cmake" CACHE STRING "Vcpkg toolchain file")

# Explicitly set CMAKE_PREFIX_PATH to help find libraries
set(CMAKE_PREFIX_PATH "C:/Users/hillc/OneDrive/Documents/GitHub/Banking-Application/vcpkg/installed/x64-windows")

# Explicitly set Poco_DIR to help find Poco
set(Poco_DIR "C:/Users/hillc/OneDrive/Documents/GitHub/Banking-Application/vcpkg/installed/x64-windows/share/poco")

# Define source files in the Backend directory
set(SOURCE_FILES
    Backend/main.cpp
    Backend/email.cpp
)

# Find Crow and Poco libraries
find_package(Crow CONFIG REQUIRED)
find_package(Poco REQUIRED Net Util Foundation)

# Add executable
add_executable(MyCrowApp ${SOURCE_FILES})

# Link Crow and Poco libraries
target_link_libraries(MyCrowApp PRIVATE
    Crow::Crow
    Poco::Net
    Poco::Util
    Poco::Foundation
)
