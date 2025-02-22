# User Stories

## User authentication (login) system

### User Story 1: Successful Login

Card:

As a bank customer, I want to log into my account using my username and password so that I can access my banking services

Conversation:
 - What fields should be required for login (username or card number, password, etc)?
 - Should we implement security measures during login, what might that look like?

Confirmation:
 - User can enter valid credentials and successfully login
 - After successful login, user is directed to the dashboard/homepage
 - Passwords are securely encrypted and stored


### User Story 2: Error Handling for incorrect input

Card:

As a bank customer, I want the page to notify me when my credentials are incorrect and allow for me to re-enter them

Conversation:
 - After how many login attempts should the user be locked out?
 - What message should be displayed for incorrect credentials?

Confirmation:
 - System displays an error message when incorrect credentials are entered
 - After X failed attempts, the system locks out the user's account temporarily





