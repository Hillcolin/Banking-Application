#ifndef TRANSACTION_H
#define TRANSACTION_H

#include <string>
#include <vector>

class Transaction {
public:
    Transaction(int transactionID, int accountID, const std::string& transactionType, double amount);

    int getTransactionID() const;
    int getAccountID() const;
    std::string getTransactionType() const;
    double getAmount() const;

    static std::vector<Transaction> getTransactions(int accountID);

private:
    int transactionID;
    int accountID;
    std::string transactionType;
    double amount;
};

#endif // TRANSACTION_H