#ifndef FIREBASE_CONFIG_H
#define FIREBASE_CONFIG_H

#include <firebase/app.h>
#include <firebase/auth.h>
#include <firebase/database.h>
#include <firebase/firestore.h>
#include <string>

class firebaseConfig {
public:
    /**
     * @brief Initializes Firebase with the provided configuration.
     * @details Reads environment variables for Firebase configuration and initializes Firebase services.
     */
    static void initializeFirebase();

    /**
     * @brief Gets the Firestore instance.
     * @return A pointer to the Firestore instance.
     */
    static firebase::firestore::Firestore* getFirestoreInstance();

    /**
     * @brief Gets the Firebase Realtime Database instance.
     * @return A pointer to the Realtime Database instance.
     */
    static firebase::database::Database* getDatabaseInstance();

    /**
     * @brief Gets the Firebase Authentication instance.
     * @return A pointer to the Authentication instance.
     */
    static firebase::auth::Auth* getAuthInstance();

private:
    static firebase::App* app;
    static firebase::firestore::Firestore* firestore;
    static firebase::database::Database* database;
    static firebase::auth::Auth* auth;
};

#endif // FIREBASE_CONFIG_H