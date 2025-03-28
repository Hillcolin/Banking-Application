#include "SavingsAccount.h"

using namespace std;

double SavingsAccount::interestRate = 0.1;

SavingsAccount::SavingsAccount(int accountID, double balance, int userID, string accountType, double interestRate)
    : Account(accountID, balance, userID, accountType) {}

void SavingsAccount::applyInterest() {
    setBalance(getBalance() + getInterest());
}

double SavingsAccount::getInterestRate() {
    return interestRate;
}

double SavingsAccount::getInterest() const {
    return interestRate * getBalance();
}
