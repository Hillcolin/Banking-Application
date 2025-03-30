#include "User.h"
#include <iostream>
#include <thread>
//#include <firebase/database.h>

using namespace std;

//extern firebase::database::Database* database;

User::User(int userID, const string& username, const string& cardNum)
    : userID(userID), username(username), cardNum(cardNum) {}

int User::getUserID() const {
    return userID;
}

void User::setUserID(int newID) {
    userID = newID;
}

string User::getUsername() const {
    return username;
}

void User::setUsername(const string& newName) {
    username = newName;
}

string User::getCardNum() const {
    return cardNum;
}

void User::setCardNum(const string& newCardNum) {
    cardNum = newCardNum;
}

void User::saveUser() {
    /* auto user_ref = database->GetReference("users").Child(std::to_string(userID));
    user_ref.Child("username").SetValue(username.c_str());
    user_ref.Child("cardNum").SetValue(cardNum.c_str()); */
}

/**
 * @brief Loads user data from the Firebase Realtime Database.
 * @param database Pointer to the Firebase database instance.
 * @returns True if the user data was successfully loaded, false otherwise.
 */
bool User::loadFromDatabase(firebase::database::Database* database) {
    try {
        auto userRef = database->GetReference("users").Child(std::to_string(userID));
        auto future = userRef.GetValue();

        // Wait for the Firebase operation to complete
        while (future.status() == firebase::kFutureStatusPending) {
            std::this_thread::sleep_for(std::chrono::milliseconds(10));
        }

        if (future.error() == firebase::database::kErrorNone) {
            const firebase::database::DataSnapshot& snapshot = *future.result();
            if (snapshot.exists()) {
                username = snapshot.Child("username").value().string_value();
                cardNum = snapshot.Child("cardNum").value().string_value();
                return true;
            } else {
                cerr << "User data not found in the database." << endl;
            }
        } else {
            cerr << "Error loading user data: " << future.error_message() << endl;
        }
    } catch (const exception& e) {
        cerr << "Exception while loading user data: " << e.what() << endl;
    }

    return false;
}

void User::fetchUser(firebase::database::Database* database, int userID, const function<void(User)>& callback) {
    auto user_ref = database->GetReference("users").Child(std::to_string(userID));
    user_ref.GetValue().OnCompletion([callback, userID](const firebase::Future<firebase::database::DataSnapshot>& result) {
        if (result.error() == firebase::database::kErrorNone) {
            const firebase::database::DataSnapshot& snapshot = *result.result();
            std::string username = snapshot.Child("username").value().string_value();
            std::string cardNum = snapshot.Child("cardNum").value().string_value();
            User user(userID, username, cardNum);
            callback(user);
        } else {
            std::cerr << "Error fetching user data: " << result.error_message() << std::endl;
        }
    });
}