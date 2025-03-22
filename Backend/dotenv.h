#pragma once

#include <fstream>
#include <string>
#include <unordered_map>
#include <cstdlib>

namespace dotenv {
    inline void trim(std::string& str) {
        const char* whitespace = " \t\n\r\f\v";
        str.erase(0, str.find_first_not_of(whitespace));
        str.erase(str.find_last_not_of(whitespace) + 1);
    }

    inline void init(const std::string& path = ".env") {
        std::ifstream file(path);
        if (!file.is_open()) {
            throw std::runtime_error("Could not open .env file");
        }

        std::string line;
        while (std::getline(file, line)) {
            size_t pos = line.find('=');
            if (pos == std::string::npos) {
                continue;
            }

            std::string key = line.substr(0, pos);
            std::string value = line.substr(pos + 1);

            trim(key);
            trim(value);

            _putenv_s(key.c_str(), value.c_str());
        }
    }
}