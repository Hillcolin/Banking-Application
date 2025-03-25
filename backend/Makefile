# Compiler and flags
CXX = x86_64-w64-mingw32-g++
CXXFLAGS = -std=c++17 -I$(INCLUDE_DIR) -I$(DROGON_INCLUDE_DIR) -I$(OPENSSL_INCLUDE_DIR)
LDFLAGS = -L$(LIB_DIR) -L$(PERL_LIB_DIR) -static-libstdc++ -static-libgcc -ltrantor -ldrogon -ljsoncpp -lssl -lcrypto -lws2_32 -lwsock32

# Directories
SRC_DIR = .
INCLUDE_DIR = .
BUILD_DIR = ./build
LIB_DIR = ../vcpkg/installed/x64-windows/lib
PERL_LIB_DIR = ../vcpkg/downloads/tools/perl/5.40.0.1/c/lib
DROGON_INCLUDE_DIR = ../vcpkg/installed/x64-windows/include
OPENSSL_INCLUDE_DIR = ../vcpkg/installed/x64-windows/include

# Source files
SRCS = $(SRC_DIR)/main.cpp

# Object files
OBJS = $(BUILD_DIR)/main.o

# Executable
TARGET = $(BUILD_DIR)/MyBackend

# Default target
all: $(TARGET)

# Build target
$(TARGET): $(OBJS)
	$(CXX) $(OBJS) -o $@ $(LDFLAGS) $(CXXFLAGS)

# Build object files
$(BUILD_DIR)/%.o: $(SRC_DIR)/%.cpp
	@mkdir -p $(BUILD_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Clean target
clean:
	rm -rf $(BUILD_DIR)

.PHONY: all clean