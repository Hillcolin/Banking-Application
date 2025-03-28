#include "CheckingsAccount.h"

using namespace std;

CheckingsAccount::CheckingsAccount(int accountID, double balance, int userID, string accountType, double withdrawalLimit)
    : Account(accountID, balance, userID, accountType), withdrawalLimit(withdrawalLimit) {}

void CheckingsAccount::withdraw(double amount) {

    // If the amount to be withdrawn exceeds the withdrawal limit:
    if (amount > withdrawalLimit) {
        // Frontend: Display on screen "Withdrawal amount exceeds limit."
        cout << "Exceeds withdraw limit" << endl; // Remove this when the frotend message has been implemented
    } 

    // If the amount to be withdrawn exceeds the account's current balance:
    else if (amount > getBalance()) {
        // Frontend: Display on screen "Insufficient Funds. Please enter a lower withdrawal amount."
        cout << "Insufficient Funds" << endl; // Remove this when the frotend message has been implemented
    }

    else {
        setBalance(getBalance() - amount);
    }
}

double CheckingsAccount::getWithdrawalLimit() const {
    return withdrawalLimit;
}

void CheckingsAccount::setWithdrawalLimit(double newLimit) {
    withdrawalLimit = newLimit;
}
