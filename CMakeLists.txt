cmake_minimum_required(VERSION 3.10)
project(MyCrowApp)

set(CMAKE_CXX_STANDARD 17)

# Find Crow and its dependencies
find_package(Crow CONFIG REQUIRED)

add_executable(MyCrowApp main.cpp)

# Link Crow
target_link_libraries(MyCrowApp PRIVATE Crow::Crow)
