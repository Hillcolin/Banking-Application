#ifndef USER_H
#define USER_H

#include <string>
#include <firebase/database.h>

class User {
public:
    User(int userID, const std::string& username, const std::string& cardNum);

    int getUserID() const;
    std::string getUsername() const;
    std::string getCardNum() const;

    static User fetchUser(int userID);

private:
    int userID;
    std::string username;
    std::string cardNum;
};

#endif // USER_H