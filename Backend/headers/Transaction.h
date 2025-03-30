#pragma once

#include <string>
#include <vector>

class Transaction {
public:
    Transaction(int transactionID, int accountID, const std::string& transactionType, double amount, const std::string& date);

    int getTransactionID() const;
    int getAccountID() const;
    std::string getTransactionType() const;
    double getAmount() const;
    std::string getDate() const;

    static std::vector<Transaction> getTransactions(int accountID);

private:
    int transactionID;
    int accountID;
    std::string transactionType;
    double amount;
    std::string date;
};