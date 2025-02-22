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

2 points


### User Story 2: Error Handling for incorrect input

Card:

As a bank customer, I want the page to notify me when my credentials are incorrect and allow me to re-enter them

Conversation:
 - After how many login attempts should the user be locked out?
 - What message should be displayed for incorrect credentials?

Confirmation:
 - System displays an error message when incorrect credentials are entered
 - After X failed attempts, the system locks out the user's account temporarily

1 points




## Account Balance Inquiry

### User Story 1: View current account balance

Card:

As a bank customer, I want to see my current account balance immediately after logging in.

Conversation:
 - Should we show balances for all accounts or just the primary?
 - How frequently should the account be updated?
 - Should pending transactions be included in the balance?

Confirmation:
 - User sees their current account balance on the dashboard immediately after login
 - Balance is updated in real-time, changes made will update the balance
 - System clearly distinguishes between available balance and pending transactions

2 points

### User Story 2: Detailed Transaction History

Card:

As an account holder, I want a detailed view of my recent transactions so that I can track my spending

Conversation:
 - How many transactions should that user be able to see at once?
 - What information should be included for each transaction?
 - Should we offer a sorting option for the transactions?

Confirmation:
 - The user can see at least 30 transactions recent transactions by default
 - The transaction shows the date, amount, type of transaction, what account it came from, and where it went to (vendor name)
 - User can sort the transactions by date, amount, or type

2 points



## Deposit functionality (taking in money)

### User Story 1:

Card: 

As a customer, I want incoming money to be deposited into the correct account so that my funds are properly managed and easily accessible.

Conversation:
 - How will the system identify and route incoming deposits to the correct account?
 - What happens if there's an error in routing the deposit?
 - Should customers be able to set preferences for where certain types of deposits go?

Confirmation:
 - Incoming deposits are correctly routed to the specified account based on account number or other unique identifiers
 - System double-checks routing information before finalizing deposit
 - Transaction history clearly shows the incoming deposit in the correct account
 - If there's an error in routing, the system flags it for review and notifies both the customer and bank staff
 - Email notification

2 points

## Withdrawl Functionality (sending money)

### User Story 1: Simple Money Transfer

Card:

As a bank customer, I want to transfer money from my account to another person's account so that I can pay friends, family, or service providers.

Conversation:
 - What information does the user need to provide to initiate a transfer?
 - Should there be limits on transfer amounts?
 - Should there be limits on transfer amounts?

Confirmation:
 - The user can initiate a transfer by entering the recipient's account details and the transfer amount
 - System verifies sufficient funds before processing the transfer
 - User receives an immediate on-screen confirmation of the transfer initiation
 - Transaction appears in the user's account history immediately
 - Email notification

3 points


### User Story 2: Scheduled Recurring Transfers

Card:

As a bank customer, I want to set up recurring transfers so that I can automatically send money at regular intervals for rent, bills, or savings.


Conversation:
 - What options should be available for transfer frequency (e.g., weekly, monthly)?
 - How far in advance can transfers be scheduled?
 - Can users edit or cancel scheduled transfers?
 - How will users be notified of upcoming and completed scheduled transfers?

Confirmation:
 - User can set up recurring transfers by specifying recipient, amount, frequency, and start/end dates
 - System allows weekly, bi-weekly, or monthly recurring transfers
 - Sends email confirmation
 - Can cancel scheduled transfers up to 6 hours before scheduled transfer
 - Scheduled transfers appear in a separate section of the user's dashboard

3 points


## 



