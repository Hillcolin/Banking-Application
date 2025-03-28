#ifndef SAVNGS_ACCOUNT_H
#define SAVNGS_ACCOUNT_H

#include <iostream>
#include <string>

#include "Account.h"

class SavingsAccount : public Account {
public:
    SavingsAccount(int accountID, double balance, int userID, std::string accountType, double interestRate);

    void applyInterest();  
    static double getInterestRate() ;
    static void setInterestRate(double newInterestRate);
    double getInterest() const;

private:
    static double interestRate;
    double interest;
};

#endif // SAVNGS_ACCOUNT_H
