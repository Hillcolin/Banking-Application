#ifndef USER_H
#define USER_H

#include <string>
#include <functional>

class User {
public:
    User() = default;
    User(int userID, const std::string& username, const std::string& cardNum);

    int getUserID() const;
    void setUserID(int newID);

    std::string getUsername() const;
    void setUsername(const std::string& newName);

    std::string getCardNum() const;
    void setCardNum(const std::string& newCardNum);

    void saveUser();

    static void fetchUser(int userID, const std::function<void(User)>& callback);

private:
    int userID;
    std::string username;
    std::string cardNum;
};

#endif // USER_H