#ifndef CHECKINGS_ACCOUNT_H
#define CHECKINGS_ACCOUNT_H

/**
* Author: Group 13
* Date: 28/3/2025
* 
* @brief A header file that defines the implementation for the "CheckingsAccount" class which is a child of the 'Account' class. It does everything the 'Account' class does, but has a 'withdrawalLimit' to limit the amount of money withdrawn from a withdrawal request.
*
* CheckingsAccount.h: 
* This is a header file that defines the "CheckingsAccount" class which is a child of the 'Account' class. It does everything the 'Account' class does, but has a 'withdrawalLimit' to limit the amount of money withdrawn from a withdrawal request.
*/

#include <iostream>
#include <string>

#include "Account.h"

class CheckingsAccount : public Account {
public:
    CheckingsAccount(int accountID, double balance, int userID, std::string accountType, double withdrawalLimit); // Constructor function that constructs a Checkings Account with a withdrawal limit

    void withdraw(double amount) override;  // A withdraw function that overrides the withdraw function in the 'Account' class since it should now check if the withdrawal amount exceeds the Checkings Account's withdrawal limit
    double getWithdrawalLimit() const; // A getter function that returns the Checkings Account's withdrawal limit
    void setWithdrawalLimit(double newLimit); // A setter function that sets the Checkings Account's withdrawal limit to a new/different value

private:
    double withdrawalLimit; // The withdrawal limit
};

#endif // CHECKINGS_ACCOUNT_H
