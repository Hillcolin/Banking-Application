#include "Account.h"

Account::Account(int accountID, double balance, int userID)
    : accountID(accountID), balance(balance), userID(userID) {}

int Account::getAccountID() const {
    return accountID;
}

double Account::getBalance() const {
    return balance;
}

int Account::getUserID() const {
    return userID;
}

Account Account::fetchAccount(int accountID) {
    // Fetch account data from the database
    // For now, return a dummy account
    return Account(accountID, 1000.0, 1);
}