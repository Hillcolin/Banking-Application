#ifndef CHECKINGS_ACCOUNT_H
#define CHECKINGS_ACCOUNT_H

#include <iostream>
#include <string>

#include "Account.h"

class CheckingsAccount : public Account {
public:
    CheckingsAccount(int accountID, double balance, int userID, std::string accountType, double withdrawalLimit);

    void withdraw(double amount) override;  
    double getWithdrawalLimit() const;
    void setWithdrawalLimit(double newLimit);

private:
    double withdrawalLimit;
};

    

#endif // CHECKINGS_ACCOUNT_H
