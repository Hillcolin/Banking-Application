#ifndef SAVNGS_ACCOUNT_H
#define SAVNGS_ACCOUNT_H

#include "Account.h"

class SavingsAccount : public Account {
public:
    SavingsAccount(int accountID, double balance, int userID, double interestRate);

    void applyInterest();  
    double getInterestRate() const;
    static void setInterestRate(double newInterestRate);
    double getInterest() const;

private:
    static double interestRate;
    double interest;
};

#endif // SAVNGS_ACCOUNT_H
