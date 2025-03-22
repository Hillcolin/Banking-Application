#include "Transaction.h"

Transaction::Transaction(int transactionID, int accountID, const std::string& transactionType, double amount, const std::string& date)
    : transactionID(transactionID), accountID(accountID), transactionType(transactionType), amount(amount), date(date) {}

int Transaction::getTransactionID() const {
    return transactionID;
}

int Transaction::getAccountID() const {
    return accountID;
}

std::string Transaction::getTransactionType() const {
    return transactionType;
}

double Transaction::getAmount() const {
    return amount;
}

std::string Transaction::getDate() const {
    return date;
}

std::vector<Transaction> Transaction::getTransactions(int accountID) {
    // Fetch transactions from the database
    // For now, return dummy transactions
    std::vector<Transaction> transactions;
    transactions.push_back(Transaction(1, accountID, "deposit", 100.0, "2025-03-20"));
    transactions.push_back(Transaction(2, accountID, "withdrawal", 50.0, "2025-03-21"));
    return transactions;
}