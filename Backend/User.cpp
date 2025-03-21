#include "User.h"
#include <iostream>

extern firebase::database::Database* database;

User::User(int userID, const std::string& username, const std::string& cardNum)
    : userID(userID), username(username), cardNum(cardNum) {}

int User::getUserID() const {
    return userID;
}

void User::setUserID(int newID) {
    userID = newID;
}

std::string User::getUsername() const {
    return username;
}

void User::setUsername(const std::string& newName) {
    username = newName;
}

std::string User::getCardNum() const {
    return cardNum;
}

void User::setCardNum(const std::string& newCardNum) {
    cardNum = newCardNum;
}

void User::saveUser() {
    auto user_ref = database->GetReference("users").Child(std::to_string(userID));
    user_ref.Child("username").SetValue(username.c_str());
    user_ref.Child("cardNum").SetValue(cardNum.c_str());
}

User User::fetchUser(int userID) {
    // Fetch user data from the database
    // For now, return a dummy user
    return User(userID, "dummy_username", "dummy_card_num");
}