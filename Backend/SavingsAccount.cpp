#include "SavingsAccount.h"

SavingsAccount::SavingsAccount(int accountID, double balance, int userID, double interestRate)
    : Account(accountID, balance, userID), interestRate(interestRate) {
        setInterestRate(interestRate);
    }

void SavingsAccount::applyInterest()) {
    balance += getInterest();
}

double SavingsAccount::getInterestRate() const {
    return interestRate;
}

static void SavingsAccount::setInterestRate(double newInterestRate) {
    interestRate = newInterestRate;
}

double SavingsAccount::getInterest() const {
    return interestRate * balance;
}
