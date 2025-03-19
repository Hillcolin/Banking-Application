`#include <firebase/app.h>
#include <firebase/firestore.h>
#include <firebase/auth.h>
#include "dotenv.h"

firebase::firestore::Firestore* firestore;
firebase::auth::Auth* auth;

void initializeFirebase() {
    dotenv::init(); // Load environment variables from .env file

    firebase::AppOptions options;
    options.set_project_id(std::getenv("VITE_FIREBASE_PROJECT_ID"));
    options.set_app_id(std::getenv("VITE_FIREBASE_APP_ID"));
    options.set_api_key(std::getenv("VITE_FIREBASE_API_KEY"));

    firebase::App* app = firebase::App::Create(options);
    firestore = firebase::firestore::Firestore::GetInstance(app);
    auth = firebase::auth::Auth::GetAuth(app);
}