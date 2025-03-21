#include "crow_all.h"
#include <firebase-cpp-sdk/app.h>
#include <firebase/auth.h>
#include <firebase/database.h>
#include <unordered_map>
#include <vector>
#include <string>
#include <iostream>
#include "dotenv.h" // Include dotenv-cpp header
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

int main() {
    crow::SimpleApp app;

    initializeFirebase();

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
        crow::json::wvalue response = crow::json::wvalue::list();
        for (const auto& transaction : transactions) {
            crow::json::wvalue transactionJson;
            transactionJson["transactionID"] = transaction.getTransactionID();
            transactionJson["accountID"] = transaction.getAccountID();
            transactionJson["transactionType"] = transaction.getTransactionType();
            transactionJson["amount"] = transaction.getAmount();
            response.push_back(transactionJson);
        }
        return crow::response(response);
    });

    // Endpoint to authenticate user
    CROW_ROUTE(app, "/api/authenticate")
    .methods("POST"_method)
    ([](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }

        std::string email = body["email"].s();
        std::string password = body["password"].s();

        auto future = auth->SignInWithEmailAndPassword(email.c_str(), password.c_str());
        future.OnCompletion([](const firebase::Future<firebase::auth::User*>& completed_future) {
            if (completed_future.error() == firebase::auth::kAuthErrorNone) {
                const firebase::auth::User* user = *completed_future.result();
                crow::json::wvalue response;
                response["uid"] = user->uid();
                return crow::response(response);
            } else {
                return crow::response(401, "Authentication failed");
            }
        });
    });

    app.port(18080).multithreaded().run();
}

