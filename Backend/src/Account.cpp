/**
* Author: Group 13
* Date: 28/3/2025
*
* @brief Stores account information (account ID, account balance, user ID that the account belongs to, and the account type ("Savings", "Checkings", or not specified)) in an Account object and handles money withdrawals, deposits, and transfers.
*
* Account.cpp:
* This file initializes and handles a user's account(s). It handles account deposits, withdrawals, as well as money transfers between accounts.
* It ensures that the user's account has sufficient funds before processing a deposit, withdrawal, or transfer request.
*/

#include "Account.h"

using namespace std;

/**
* @brief Constructs an Account object that stores information such as its account ID, its current balance, the user it belongs to (user ID) and its type
*
* Account():
* A constructor function that initializes a user account. 
* It handles money deposits and withdrawals as well as the transfer of money from one account to another account
*
* @param accountID The account's unique ID
* @param balance The account's current balance
* @param userID The user ID that this account belongs to (is used to keep track of a user and their account)
* @param accountType The account's type ("Savings", "Checkings", or not specified)
*/
Account::Account(int accountID, double balance, int userID, string accountType)
    : accountID(accountID), balance(balance), userID(userID), accountType(accountType) {}

/**
* @brief Returns the account's unique ID.
*
* getAccountID():
* A Getter function that returns the account's ID.
*
* @return accountID The account's ID
*/
int Account::getAccountID() const {
    return accountID;
}

/**
* @brief Sets the account's ID to a different ID
*
* setAccountID():
* A setter function that replaces the account's current ID with a different one
*
* @param newID The new account ID 
*/
void Account::setAccountID(int newID) {
    accountID = newID;
}

/**
* @brief Returns the account's current balance.
*
* getBalance():
* A Getter function that returns the account's current balance.
*
* @return balance The account's current balance.
*/
double Account::getBalance() const {
    return balance;
}

/**
* @brief Sets the account's current balance to a new balance
*
* setBalance():
* A setter function that sets a new balance to the account's current balance
*
* @param newBalance The new account balance
*/
void Account::setBalance(double newBalance) {
    balance = newBalance;
}

/**
* @brief Returns the account's account type (Savings, Checkings, or not specified).
*
* getAccountType():
* A Getter function that returns the account's type (Savings, Checkings, or not specified).
*
* @return accountType The account's type (Savings, Checkings, or not specified)
*/
string Account::getAccountType() const {
    return accountType;
}

/**
* @brief Sets the account's current type to a new type
*
* setAccountType():
* A setter function that sets a new account type to the account's current type
*
* @param newType The new account type
*/
void Account::setAccountType(string newType) {
    accountType = newType;
}

/**
* @brief Deposits a specified amount of money to the account's balance
*
* deposit():
* A function that deposits a specified amount of money to the account's balance.
*
* @param amount The amount to be deposited
*/
void Account::deposit(double amount) {
    balance += amount;
}

/**
* @brief Withdraws a specified amount of money from the account's balance
*
* withdraw():
* A function that withdraws a specified amount of money from the account's balance, making sure that the account has sufficient funds before withdrawing the amount.
*
* @param amount The amount to be withdrawn
*/
void Account::withdraw(double amount) {

    // If the amount being withdrawn is not within the account's available balance:
    if (amount > balance) {
        
        // Frontend: Display on screen "Insufficient Funds. Please enter a lower withdrawal amount."
    }

    else {
        balance -= amount; // Deduct the amount being withdrawn from the account's balance if it is less than or equal to the account's balance
    }
}

/**
* @brief Transfers a specified amount of money from one account to another
*
* transfer():
* A function that transfers a specified amount of money from one account to another.
* It makes sure that the account has sufficient funds before transferring the amount.
*
* @param recipient A reference to the recipient's Account object
* @param amount The amount to be transferred
*/
void Account::transfer(Account& recipient, double amount) {

    // If the amount being transferred is within the account's available balance:
    if (amount <= balance) {

        // Deposit the transfer amount to the recipient's account and deduct the transfer amount from the sender's account 
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
