#ifndef ACCOUNT_H
#define ACCOUNT_H

#include <string>

class Account {
public:
    Account(int accountID, double balance, int userID);

    int getAccountID() const;
    double getBalance() const;
    int getUserID() const;

    static Account fetchAccount(int accountID);

private:
    int accountID;
    double balance;
    int userID;
};

#endif // ACCOUNT_H