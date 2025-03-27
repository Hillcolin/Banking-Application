#include "CheckingsAccount.h"

CheckingsAccount::CheckingsAccount(int accountID, double balance, int userID, double withdrawalLimit)
    : Account(accountID, balance, userID), withdrawalLimit(withdrawalLimit) {}

void CheckingsAccount::withdraw(double amount) {

    // If the amount to be withdrawn exceeds the withdrawal limit:
    if (amount > withdrawalLimit) {
        // Frontend: Display on screen "Withdrawal amount exceeds limit."
    } 

    // If the amount to be withdrawn exceeds the account's current balance:
    else if (amount > balance) {
        // Frontend: Display on screen "Insufficient Funds. Please enter a lower withdrawal amount."
    }

    else {
        balance -= amount;
    }
}

double CheckingsAccount::getWithdrawalLimit() const {
    return withdrawalLimit;
}

void CheckingsAccount::setWithdrawalLimit(double newLimit) {
    withdrawalLimit = newLimit;
}
