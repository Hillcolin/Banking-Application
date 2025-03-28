#ifndef ACCOUNT_H
#define ACCOUNT_H

#include <string>
#include <iostream>

class Account {
public:
    Account(int accountID, double balance, int userID, std::string accountType);

    int getAccountID() const;
    void setAccountID(int newID);
    double getBalance() const;
    void setBalance(double newBalance);
    void deposit(double amount);
    virtual void withdraw(double amount);
    void transfer(Account& recipient, double amount);
    std::string getAccountType() const;
    void setAccountType(std::string type);
    static Account fetchAccount(int accountID);

private:
    int accountID;
    double balance;
    int userID;
    std::string accountType;
};

#endif // ACCOUNT_H