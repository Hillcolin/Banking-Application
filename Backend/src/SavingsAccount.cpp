/**
* Author: Christopher Boulos (251267786)
* Date: 28/3/2025
*
* @brief A child of the 'Account' class that stores the same information that the 'Account' object stores but with an additional 'interestRate' parameter that holds the account's interest rate.
*
* SavingsAccount.cpp:
* This file initializes and handles a user's SavingsAccount. It performs the same actions as the 'Account' class (deposit, withdraw, and transfer)
* In addition to all those functionalities, this class can apply interest to the account's balance by increasing the account's balance with its interest, which is calculated by multiplying interest rate and the balance.
*/

#include "SavingsAccount.h"

using namespace std;

double SavingsAccount::interestRate = 0.04; // All Savings accounts will have the same interest rate of 0.04 = 4%

/**
* @brief Constructs a SavingsAccount object that stores the same information an 'Account' object stores but now also stores an 'interest rate'
*
* SavingsAccount():
* A constructor function that initializes a Savings account. 
* It performs the same actions as an 'Account' object but with an additional functionality that applies interest to the account's balance based on the interest rate
*
* @param accountID The account's unique ID
* @param balance The account's current balance
* @param userID The user ID that this account belongs to (is used to keep track of a user and their account)
* @param accountType The account's type ("Savings", "Checkings", or not specified)
* @param interestRate The account's interest rate
*/
SavingsAccount::SavingsAccount(int accountID, double balance, int userID, string accountType, double interestRate)
    : Account(accountID, balance, userID, accountType) {}

/**
* @brief A function that applies interest to the account's balance.
*
* applyInterest():
* A function that applies interest to the account's balance by increasing the account's balance by its interest, which is calculated by multiplying interest rate and the balance.
*/
void SavingsAccount::applyInterest() {
    setBalance(getBalance() + getInterest());
}

/**
* @brief Returns the account's interest rate.
*
* getInterestRate():
* A Getter function that returns the account's interest rate.
*
* @return interestRate The account's interest rate
*/
double SavingsAccount::getInterestRate() {
    return interestRate;
}

/**
* @brief Returns the account's withdrawal limit.
*
* getInterest():
* A Getter function that returns the account's interest, which is calculated by multiplying interest rate and the balance.
*
* @return interest The account's interest
*/
double SavingsAccount::getInterest() const {
    return interestRate * getBalance();
}
