/**
* Author: Group 13
* Date: 28/3/2025
*
* @brief A child of the 'Account' class that stores the same information that the 'Account' object stores but with an additional 'withdrawalLimit' parameter that limits the amount a user can withdraw from a withdraw request.
*
* CheckingsAccount.cpp:
* This file initializes and handles a user's CheckingsAccount. It performs the same actions as the 'Account' class (deposit, withdraw, and transfer)
* However, this class overrides the 'withdraw' function from the 'Account' class since the 'CheckingsAccount' has a withdrawal limit.
* The withdraw function in this class ensures that the withdrawal amount does not exceed the Checkings Account's withdrawal limit.
*/

#include "CheckingsAccount.h"

using namespace std;

/**
* @brief Constructs a CheckingsAccount object that stores the same information an Account object stores but now also stores a 'withdrawal limit'
*
* CheckingsAccount():
* A constructor function that initializes a Checkings account. 
* It performs the same actions as an 'Account' object but with a modified 'withdraw' function
*
* @param accountID The account's unique ID
* @param balance The account's current balance
* @param userID The user ID that this account belongs to (is used to keep track of a user and their account)
* @param accountType The account's type ("Savings", "Checkings", or not specified)
* @param withdrawalLimit The account's withdrawal limit
*/
CheckingsAccount::CheckingsAccount(int accountID, double balance, int userID, string accountType, double withdrawalLimit)
    : Account(accountID, balance, userID, accountType), withdrawalLimit(withdrawalLimit) {}

/**
* @brief This function overrides the withdraw function in the 'Account' so that it now limits the amount a user can withdraw from a withdraw request.
*
* withdraw():
* A function that overrides the 'withdraw' function in the 'Account' class.
* It ensures that the user cannot withdraw more than their withdrawal limit and their account balance from a withdraw request
*
* @param amount The amount to be withdrawn 
*/
void CheckingsAccount::withdraw(double amount) {

    // If the amount to be withdrawn exceeds the withdrawal limit:
    if (amount > withdrawalLimit) {
        
        // Frontend: Display on screen "Withdrawal amount exceeds limit."
    } 

    // If the amount to be withdrawn exceeds the account's current balance:
    else if (amount > getBalance()) {
        
        // Frontend: Display on screen "Insufficient Funds. Please enter a lower withdrawal amount."
    }

    else {
        setBalance(getBalance() - amount); // Deduct the amount being withdrawn from the account's balance if it is less than or equal to the account's balance and withdrawal limit
    }
}

/**
* @brief Returns the account's withdrawal limit.
*
* getWithdrawalLimit():
* A Getter function that returns the account's withdrawal limit.
*
* @return withdrawalLimit The account's withdrawal limit
*/
double CheckingsAccount::getWithdrawalLimit() const {
    return withdrawalLimit;
}

/**
* @brief Sets the account's withdrawal limit to a new/different withdrawal limit
*
* setWithdrawalLimit():
* A setter function that replaces the account's current withdrawal limit with a different one
*
* @param newLimit The account's new withdrawal limit
*/
void CheckingsAccount::setWithdrawalLimit(double newLimit) {
    withdrawalLimit = newLimit;
}
