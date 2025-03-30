#include "Transaction.h"
#include "firebaseConfig.h"

#include <iostream>
#include <vector>
#include <thread>
#include <chrono>
/**
 * @brief Constructs a Transaction object.
 * 
 * @param transactionID The unique ID of the transaction.
 * @param accountID The ID of the account associated with the transaction.
 * @param transactionType The type of the transaction (e.g., "deposit", "withdrawal").
 * @param amount The amount involved in the transaction.
 * @param date The date of the transaction in YYYY-MM-DD format.
 */
Transaction::Transaction(int transactionID, int accountID, const std::string& transactionType, double amount, const std::string& date)
    : transactionID(transactionID), accountID(accountID), transactionType(transactionType), amount(amount), date(date) {}

/**
 * @brief Gets the unique ID of the transaction.
 * 
 * @return The transaction ID.
 */
int Transaction::getTransactionID() const {
    return transactionID;
}

/**
 * @brief Gets the ID of the account associated with the transaction.
 * 
 * @return The account ID.
 */
int Transaction::getAccountID() const {
    return accountID;
}

/**
 * @brief Gets the type of the transaction.
 * 
 * @return The transaction type as a string.
 */
std::string Transaction::getTransactionType() const {
    return transactionType;
}

/**
 * @brief Gets the amount involved in the transaction.
 * 
 * @return The transaction amount.
 */
double Transaction::getAmount() const {
    return amount;
}

/**
 * @brief Gets the date of the transaction.
 * 
 * @return The transaction date as a string in YYYY-MM-DD format.
 */
std::string Transaction::getDate() const {
    return date;
}

/**
 * @brief Fetches a list of transactions for a specific account from Firestore.
 * 
 * @param accountID The ID of the account for which transactions are fetched.
 * @return A vector of Transaction objects associated with the account.
 */
std::vector<Transaction> Transaction::getTransactions(int accountID) {
    std::vector<Transaction> transactions;

    try {
        // Reference to the Firestore collection
        auto db = firebaseConfig::getFirestoreInstance(); // Get Firestore instance from your config
        auto transactionsRef = db->Collection("transactions");

        // Create a query to filter transactions by accountID
        auto query = transactionsRef.WhereEqualTo("accountID", firebase::firestore::FieldValue::Integer(accountID));

        // Execute the query
        auto future = query.Get();

        // Wait for the query to complete
        while (future.status() == firebase::kFutureStatusPending) {
            std::this_thread::sleep_for(std::chrono::milliseconds(10));
        }

        if (future.error() == firebase::firestore::Error::kErrorOk) {
            // Process the query results
            auto snapshot = *future.result();
            for (const auto& doc : snapshot.documents()) {
                if (doc.exists()) {
                    // Extract transaction data from Firestore document
                    int transactionID = doc.Get("transactionID").integer_value();
                    std::string transactionType = doc.Get("transactionType").string_value();
                    double amount = doc.Get("amount").double_value();
                    std::string date = doc.Get("date").string_value();

                    // Create a Transaction object and add it to the vector
                    transactions.emplace_back(transactionID, accountID, transactionType, amount, date);
                }
            }
        } else {
            std::cerr << "Error fetching transactions from Firestore: " << future.error_message() << std::endl;
        }
    } catch (const std::exception& e) {
        std::cerr << "Exception while fetching transactions: " << e.what() << std::endl;
    }

    return transactions;
}