#ifndef SAVNGS_ACCOUNT_H
#define SAVNGS_ACCOUNT_H

/**
* Author: Group 13
* Date: 28/3/2025
* 
* @brief A header file that defines the implementation for the "SavingsAccount" class which is a child of the 'Account' class. It does everything the 'Account' class does, but now has an 'interest rate' so that the Savings Account receives interest.
*
* SavingsAccount.h: 
* This is a header file that defines the "SavingsAccount" class which is a child of the 'Account' class. It does everything the 'Account' class does, but has an 'interest rate' so that the Savings account receives interest
*/

#include <iostream>
#include <string>

#include "Account.h"

class SavingsAccount : public Account {
public:
    SavingsAccount(int accountID, double balance, int userID, std::string accountType, double interestRate); // Constructor function that constructs a Savings Account with an interest rate

    void applyInterest();  // A function that applies interest to the account's balance
    static double getInterestRate(); // A getter function that returns the Savings Account's interest rate
    double getInterest() const; // A getter function that returns the Savings Account's interest

private:
    static double interestRate; // The account's interest rate
    double interest; // The account's interest
};

#endif // SAVNGS_ACCOUNT_H
