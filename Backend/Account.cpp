#include "Account.h"

Account::Account(int accountID, double balance, int userID, char accountType)
    : accountID(accountID), balance(balance), userID(userID), accountType(accountType) {}

int Account::getAccountID() const {
    return accountID;
}

void Account::setAccountID(int newID) {
    accountID = newID;
}

double Account::getBalance() const {
    return balance;
}

void Account::setBalance(double newBalance) {
    balance = newBalance;
}

char Account::getAccountType() const {
    return accountType;
}

void Account::setAccountType(char type) {
    accountType = type;
}

// Deposits money into the account
void Account::deposit(double amount) {
    balance += amount;
}

// Withdraws money from the account
void Account::withdraw(double amount) {

    // If the amount being withdrawn is within the account's available balance:
    if (amount <= balance) {
        balance -= amount; 
    }

    else {
        // Frontend: Display on screen "Insufficient Funds. Please enter a lower withdrawal amount."
    }
}

// Transfers money from one account to another
void Account::transfer(Account& recipient, double amount) {

    // If the amount being transferred is within the account's available balance:
    if (amount <= balance) {
        recipient.deposit(amount);
        balance -= amount;
    }

    else {
        // Frontend: Display on screen "Insufficient Funds. Please enter a lower transfer amount."
    }
}



Account Account::fetchAccount(int accountID) {
    // Fetch account data from the database
    // For now, return a dummy account
    return Account(accountID, 1000.0, 1);
}