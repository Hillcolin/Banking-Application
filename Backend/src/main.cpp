//#include "crow_all.h"
/* #include <firebase/app.h>
#include <firebase/auth.h>
#include <firebase/database.h> */
#include <unordered_map>
#include <vector>
#include <string>
#include <iostream>
// #include "dotenv.h" // Ensure this header is included correctly
#include "User.h"
#include "Account.h"
#include "Transaction.h"
#include "SavingsAccount.h"
#include "CheckingsAccount.h"

using namespace std;

//firebase::database::Database* database;
//firebase::auth::Auth* auth;

/* void initializeFirebase() {
    dotenv::init(); // Load environment variables from .env file

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

crow::json::wvalue convertSnapshotToJson(const firebase::database::DataSnapshot& snapshot) {
    crow::json::wvalue json;
    for (const auto& child : snapshot.children()) {
        json[child.key()] = child.value().AsString().string_value();
    }
    return json;
}

void linkRoutes(crow::SimpleApp& app) {
    // Endpoint to get user data
    CROW_ROUTE(app, "/api/user/<int>")
    ([](int userID) {
        crow::response res;
        User::fetchUser(userID, [&res, userID](User user) {
            crow::json::wvalue response;
            response["userID"] = user.getUserID();
            response["username"] = user.getUsername();
            response["cardNumber"] = user.getCardNum();
            res.write(crow::json::dump(response));
            res.end();
        });
        return res;
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
            response["transactions"][static_cast<unsigned int>(i)] = std::move(transactionJson);
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
} */

int main() {
    //crow::SimpleApp app;

    //initializeFirebase();
    //linkRoutes(app);

    //app.port(8080).multithreaded().run();

    Account acc(101, 500.0, 1, "");
    Account acc2(102, 1500.0, 2, "");
    SavingsAccount acc3(103, 1500.0, 2, "Savings", 0.0);
    CheckingsAccount acc4(104, 500.0, 2, "Checkings", 100.0);

    cout << "Account balance:" << acc.getBalance() << endl;

    acc.deposit(50.0);
    cout << "Account balance:" << acc.getBalance() << endl;

    acc.withdraw(50.0);

    cout << "Account balance:" << acc.getBalance() << endl;

    acc.withdraw(550.0);

    acc.transfer(acc2, 50.0);
    cout << "Account balance acc1:" << acc.getBalance() << endl;
    cout << "Account balance acc2:" << acc2.getBalance() << endl;

    acc.transfer(acc2, 550.0);
    cout << "Account balance acc1:" << acc.getBalance() << endl;
    cout << "Account balance acc2:" << acc2.getBalance() << endl;

    cout << "Account balance acc3:" << acc3.getBalance() << endl;
    acc3.applyInterest();
    cout << "Account balance acc3:" << acc3.getBalance() << endl;
    acc3.deposit(100.0);
    cout << "Account balance acc3:" << acc3.getBalance() << endl;
    acc3.withdraw(100.0);
    cout << "Account balance acc3:" << acc3.getBalance() << endl;

    cout << "Account balance acc4:" << acc4.getBalance() << endl;
    acc4.withdraw(100.0);
    cout << "Account balance acc4:" << acc4.getBalance() << endl;
    acc4.withdraw(101.0);
    cout << "Account balance acc4:" << acc4.getBalance() << endl;
    acc4.withdraw(1000.0);

}