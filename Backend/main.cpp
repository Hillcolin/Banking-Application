#include "asio_compat.h"  // Add this before crow_all.h
#include "crow_all.h"
#include <firebase/app.h>
#include <firebase/auth.h>
#include <firebase/database.h>
#include <unordered_map>
#include <vector>
#include <string>
#include <iostream>
#include "dotenv.h" // Ensure this header is included correctly
#include "User.h"
#include "Account.h"
#include "Transaction.h"

firebase::database::Database* database;
firebase::auth::Auth* auth;

void initializeFirebase() {
    dotenv::init(); // Load environment variables from .env file

    firebase::AppOptions options;
    options.set_project_id(std::getenv("VITE_FIREBASE_PROJECT_ID"));
    options.set_app_id(std::getenv("VITE_FIREBASE_APP_ID"));
    options.set_api_key(std::getenv("VITE_FIREBASE_API_KEY"));

    firebase::App* app = firebase::App::Create(options);
    database = firebase::database::Database::GetInstance(app);
    auth = firebase::auth::Auth::GetAuth(app);
}

crow::json::wvalue convertSnapshotToJson(const firebase::database::DataSnapshot& snapshot) {
    crow::json::wvalue json;
    for (const auto& child : snapshot.children()) {
        json[child.key()] = child.value().AsString().string_value();
    }
    return json;
}

void linkRoutes(crow::SimpleApp& app) {
    // Add CORS setup
    app.middleware<crow::CORSHandler>()
        .global()
        .allow_origin("*")
        .allow_methods("GET, POST, PUT, DELETE")
        .allow_headers("Content-Type");

    // Endpoint to get user data
    CROW_ROUTE(app, "/api/user/<int>")
    ([](int userID) {
        User user = User::fetchUser(userID);
        crow::json::wvalue response;
        response["userID"] = user.getUserID();
        response["username"] = user.getUsername();
        response["cardNumber"] = user.getCardNum();
        return crow::response(response);
    });

    // Endpoint to get account data
    CROW_ROUTE(app, "/api/account/<int>")
    ([](int accountID) {
        Account account = Account::fetchAccount(accountID);
        crow::json::wvalue response;
        response["accountID"] = account.getAccountID();
        response["balance"] = account.getBalance();
        response["userID"] = account.getUserID();
        return crow::response(response);
    });

    // Endpoint to get recent transactions
    CROW_ROUTE(app, "/api/account/<int>/transactions")
    ([](int accountID) {
        std::vector<Transaction> transactions = Transaction::getTransactions(accountID);
        crow::json::wvalue response;
        response["transactions"] = crow::json::wvalue();
        for (size_t i = 0; i < transactions.size(); ++i) {
            crow::json::wvalue transactionJson;
            transactionJson["transactionID"] = transactions[i].getTransactionID();
            transactionJson["amount"] = transactions[i].getAmount();
            transactionJson["date"] = transactions[i].getDate();
            response["transactions"][i] = std::move(transactionJson);
        }
        return crow::response(response);
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

int main() {
    crow::SimpleApp app;

    initializeFirebase();
    linkRoutes(app);

    app.port(8080).multithreaded().run();
}