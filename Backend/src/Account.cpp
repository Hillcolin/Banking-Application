#include "Account.h"
using namespace std;

Account::Account(int accountID, double balance, int userID, string accountType)
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

string Account::getAccountType() const {
    return accountType;
}

void Account::setAccountType(string type) {
    accountType = type;
}

// Deposits money into the account
void Account::deposit(double amount) {
    balance += amount;
}

// Withdraws money from the account
void Account::withdraw(double amount) {

    // If the amount being withdrawn is not within the account's available balance:
    if (amount > balance) {
        // Frontend: Display on screen "Insufficient Funds. Please enter a lower withdrawal amount."
        cout << "Insufficient Funds" << endl;
    }

    else {
        balance -= amount; 
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
        cout << "Insufficient Funds" << endl;
    }
}



Account Account::fetchAccount(int accountID) {
    // Fetch account data from the database
    // For now, return a dummy account
    return Account(accountID, 1000.0, 1, "Savings");
}