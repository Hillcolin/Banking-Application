#ifndef USER_H
#define USER_H

#include <string>
#include <functional>
#include <firebase/database.h>

class User {
public:
    User() = default;
    User(int userID, const std::string& username, const std::string& cardNum);

    // Getters and Setters
    int getUserID() const;
    void setUserID(int newID);

    std::string getUsername() const;
    void setUsername(const std::string& newName);

    std::string getCardNum() const;
    void setCardNum(const std::string& newCardNum);

    // Save user data to the database
    void saveUser();

    // Load user data from the database
    bool loadFromDatabase(firebase::database::Database* database);

    // Fetch user data asynchronously
    static void fetchUser(firebase::database::Database* database, int userID, const function<void(User)>& callback);

private:
    int userID;
    std::string username;
    std::string cardNum;
};

#endif // USER_H