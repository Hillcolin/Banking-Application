#ifndef ACCOUNT_H
#define ACCOUNT_H

#include <string>

class Account {
public:
    Account(int accountID, double balance, int userID, char accountType);

    int getAccountID() const;
    void setAccountID(int newID);
    double getBalance() const;
    void setBalance(int newBalance);
    void deposit(double amount);
    void withdraw(double amount);
    void transfer(Account recipient, double amount);
    char getAccountType() const;
    void setAccountType(char type);
    static Account fetchAccount(int accountID);

private:
    int accountID;
    double balance;
    int userID;
    char accountType;
};

#endif // ACCOUNT_H