/**
 * @file main.cpp
 * @brief Backend implementation for the Banking Application.
 * @details This file contains the backend logic for the Banking Application, including API endpoints
 * for user data, account data, and transactions. It interacts with Firebase to fetch and update real user data.
 * It also serves static files for the React frontend using the Crow framework.
 * @author Colin
 */

#include "crow_all.h"
#include <firebase/app.h>
#include <firebase/auth.h>
#include <firebase/database.h>
#include <unordered_map>
#include <vector>
#include <string>
#include <iostream>
#include <fstream>
#include <sstream>
#include "User.h"
#include "Account.h"
#include "Transaction.h"
#include "SavingsAccount.h"
#include "CheckingAccount.h"

using namespace std;

// Firebase instances
firebase::database::Database* database;
firebase::auth::Auth* auth;

/**
 * @brief Initializes Firebase.
 * @details This function initializes Firebase using environment variables for configuration.
 */
void initializeFirebase() {
    ifstream envFile(".env");
    if (envFile.is_open()) {
        string line;
        while (getline(envFile, line)) {
            auto delimiterPos = line.find('=');
            auto name = line.substr(0, delimiterPos);
            auto value = line.substr(delimiterPos + 1);
            _putenv_s(name.c_str(), value.c_str());
        }
        envFile.close();
    } else {
        cerr << "Error: .env file not found." << endl;
        exit(EXIT_FAILURE);
    }

    firebase::AppOptions options;
    char* project_id;
    char* app_id;
    char* api_key;
    _dupenv_s(&project_id, nullptr, "VITE_FIREBASE_PROJECT_ID");
    _dupenv_s(&app_id, nullptr, "VITE_FIREBASE_APP_ID");
    _dupenv_s(&api_key, nullptr, "VITE_FIREBASE_API_KEY");

    options.set_project_id(project_id);
    options.set_app_id(app_id);
    options.set_api_key(api_key);

    firebase::App* app = firebase::App::Create(options);
    database = firebase::database::Database::GetInstance(app);
    auth = firebase::auth::Auth::GetAuth(app);

    free(project_id);
    free(app_id);
    free(api_key);
}

/**
 * @brief Checks if a user is locked out.
 * @param userId The ID of the user.
 * @returns True if the user is locked out, false otherwise.
 */
bool isUserLockedOut(const string& userId) {
    auto userRef = database->GetReference("users").Child(userId).Child("lockoutEndTime");
    auto future = userRef.GetValue();
    future.OnCompletion([](const firebase::Future<firebase::database::DataSnapshot>& completedFuture) {
        if (completedFuture.error() == firebase::database::kErrorNone) {
            auto snapshot = *completedFuture.result();
            if (snapshot.exists()) {
                long long lockoutEndTime = snapshot.value().int64_value();
                return lockoutEndTime > time(nullptr); // Check if lockoutEndTime is in the future
            }
        }
        return false;
    });
    return false;
}

/**
 * @brief Links API routes for the backend.
 * @details This function defines API endpoints for user data, account data, and transactions.
 * It also serves static files for the React frontend.
 * @param app The Crow application instance.
 */
void linkRoutes(crow::SimpleApp& app) {
    // Endpoint to get user data
    CROW_ROUTE(app, "/api/user/<string>")
    ([](const string& userId) {
        if (isUserLockedOut(userId)) {
            return crow::response(403, "User is locked out.");
        }

        User user(userId);
        if (!user.loadFromDatabase(database)) {
            return crow::response(404, "User not found.");
        }

        return crow::response(user.toJson());
    });

    // Endpoint to get account data
    CROW_ROUTE(app, "/api/account/<string>")
    ([](const string& accountId) {
        Account account(accountId);
        if (!account.loadFromDatabase(database)) {
            return crow::response(404, "Account not found.");
        }

        return crow::response(account.toJson());
    });

    // Endpoint to transfer funds
    CROW_ROUTE(app, "/api/transfer").methods("POST"_method)
    ([](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON.");
        }

        string senderId = body["senderId"].s();
        string recipientId = body["recipientId"].s();
        double amount = body["amount"].d();

        if (isUserLockedOut(senderId)) {
            return crow::response(403, "Sender is locked out.");
        }

        CheckingAccount sender(senderId);
        CheckingAccount recipient(recipientId);

        if (!sender.loadFromDatabase(database) || !recipient.loadFromDatabase(database)) {
            return crow::response(404, "Sender or recipient account not found.");
        }

        if (!sender.withdraw(amount)) {
            return crow::response(400, "Insufficient funds.");
        }

        recipient.deposit(amount);

        sender.saveToDatabase(database);
        recipient.saveToDatabase(database);

        Transaction transaction(senderId, recipientId, amount, "Transfer");
        transaction.saveToDatabase(database);

        return crow::response(200, "Transfer successful.");
    });

    // Serve static files for the React frontend
    CROW_ROUTE(app, "/<path>")
    ([](const crow::request& req, crow::response& res, std::string path) {
        if (path.empty()) {
            path = "index.html";
        }
        std::ifstream file("../Frontend/" + path);
        if (!file) {
            res.code = 404;
            res.end("File not found");
            return;
        }
        std::stringstream buffer;
        buffer << file.rdbuf();
        res.end(buffer.str());
    });

    // Serve the index.html file for the root path
    CROW_ROUTE(app, "/")
    ([]() {
        std::ifstream file("../Frontend/index.html");
        std::stringstream buffer;
        buffer << file.rdbuf();
        return buffer.str();
    });
}

/**
 * @brief Main entry point for the backend application.
 * @details This function initializes the backend, links API routes, and starts the Crow server.
 * @returns int Exit code of the application.
 */
int main() {
    crow::SimpleApp app;

    // Initialize Firebase
    initializeFirebase();

    // Link routes for API endpoints and static file serving
    linkRoutes(app);

    // Start the Crow server on port 5000
    cout << "Starting Crow server on http://localhost:5000" << endl;
    app.port(5000).multithreaded().run();

    return 0;
}