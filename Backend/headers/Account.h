#ifndef ACCOUNT_H
#define ACCOUNT_H

/**
* Author: Group 13
* Date: 28/3/2025
* 
* @brief A header file that defines the implementation for the "Account" class which stores an account's information and handles actions like money deposits, withdrawals, and transfers. 
*
* Account.h: 
* This is a header file that defines the implementation for the "Account" class, which stores an account's information and handles actions like money deposits, withdrawals, and transfers.
*/

#include <string>
#include <iostream>

class Account {
public:
    Account(int accountID, double balance, int userID, std::string accountType); // Constructor function that contructs an Account object

    int getAccountID() const; // A getter function that returns the account's ID
    void setAccountID(int newID); // A setter function that sets the account's current ID to a new/different ID
    double getBalance() const; // A getter function that returns the account's balance
    void setBalance(double newBalance); // A setter function that sets the account's balance to a new/different balance
    std::string getAccountType() const; // A getter function that returns the account's type
    void setAccountType(std::string newType); // A setter function that sets the account's type to a new/different balance
    void deposit(double amount); // A function that deposits an 'amount' of money to the account's balance
    virtual void withdraw(double amount); // A function that withdraws an 'amount' of money from the account's balance. It is set as 'virtual' since it is overrode in the 'CheckingsAccount' class
    void transfer(Account& recipient, double amount); // A function that transfers money from one account (sender) to a 'recipient'

    static Account fetchAccount(int accountID);

private:
    int accountID; // The account's ID
    double balance; // The account's balance
    int userID; // The account's user ID, which is used to locate the user that owns the account
    std::string accountType; // The account's type ("Savings", "Checkings", or not specified)
};

#endif // ACCOUNT_H