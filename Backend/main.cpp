#include <crow.h>
#include <firebase/app.h>
#include <firebase/firestore.h>
#include <unordered_map>
#include <vector>
#include <string>
#include <iostream>

firebase::firestore::Firestore* firestore;

void initializeFirebase() {
    firebase::AppOptions options;
    options.set_project_id(VITE_FIREBASE_PROJECT_ID);
    options.set_app_id(VITE_FIREBASE_APP_ID);
    options.set_api_key(VITE_FIREBASE_API_KEY);

    firebase::App* app = firebase::App::Create(options);
    firestore = firebase::firestore::Firestore::GetInstance(app);
}

crow::json::wvalue convertDocumentToJson(const firebase::firestore::DocumentSnapshot& doc) {
    crow::json::wvalue json;
    for (const auto& field : doc.GetData()) {
        json[field.first] = field.second.ToString();
    }
    return json;
}

int main() {
    crow::SimpleApp app;

    initializeFirebase();

    // Endpoint to get user data
    CROW_ROUTE(app, "/api/user/<string>")
    ([](const std::string& uid) {
        auto doc_ref = firestore->Collection("users").Document(uid);
        auto future = doc_ref.Get();
        future.OnCompletion([](const firebase::Future<firebase::firestore::DocumentSnapshot>& completed_future) {
            if (completed_future.error() == firebase::firestore::Error::kErrorOk) {
                const auto& doc = *completed_future.result();
                if (doc.exists()) {
                    return crow::response(convertDocumentToJson(doc));
                } else {
                    return crow::response(404, "User not found");
                }
            } else {
                return crow::response(500, "Error fetching user data");
            }
        });
    });

    // Endpoint to get recent transactions
    CROW_ROUTE(app, "/api/user/<string>/transactions")
    ([](const std::string& uid) {
        auto collection_ref = firestore->Collection("users").Document(uid).Collection("transactions");
        auto future = collection_ref.Get();
        future.OnCompletion([](const firebase::Future<firebase::firestore::QuerySnapshot>& completed_future) {
            if (completed_future.error() == firebase::firestore::Error::kErrorOk) {
                const auto& snapshot = *completed_future.result();
                crow::json::wvalue json = crow::json::wvalue::list();
                for (const auto& doc : snapshot.documents()) {
                    json.push_back(convertDocumentToJson(doc));
                }
                return crow::response(json);
            } else {
                return crow::response(500, "Error fetching transactions");
            }
        });
    });

    app.port(18080).multithreaded().run();
}

