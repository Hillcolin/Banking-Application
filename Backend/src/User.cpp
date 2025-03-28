#include "User.h"
#include <iostream>
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

void User::fetchUser(int userID, const function<void(User)>& callback) {
    /* auto user_ref = database->GetReference("users").Child(std::to_string(userID));
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
    }); */
}