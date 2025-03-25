#include <crow.h>
#include <Poco/Net/MailMessage.h>
#include <Poco/Net/SMTPClientSession.h>
#include <iostream>
#include <string>

// Hardcoded SMTP configuration
const std::string SMTP_SERVER = "smtp.gmail.com"; // Replace with your SMTP server
const int SMTP_PORT = 587;                        // TLS port (use 465 for SSL)
const std::string SMTP_USER = "your_email@gmail.com"; // Replace with your email
const std::string SMTP_PASS = "your_password";       // Replace with your email password (use an App Password for Gmail)

// Function to send email
void sendEmail(const std::string& recipientEmail, const std::string& subject, const std::string& body) {
    try {
        std::cout << "Attempting to send email to: " << recipientEmail << std::endl;

        // Create the email message
        Poco::Net::MailMessage msg;
        msg.setSender("Your App <noreply@yourapp.com>");
        msg.addRecipient(Poco::Net::MailRecipient(Poco::Net::MailRecipient::PRIMARY_RECIPIENT, recipientEmail));
        msg.setSubject(subject);
        msg.setContent(body);

        // Connect to the SMTP server
        Poco::Net::SMTPClientSession smtp(SMTP_SERVER, SMTP_PORT);
        smtp.login(Poco::Net::SMTPClientSession::AUTH_LOGIN, SMTP_USER, SMTP_PASS);
        smtp.startTLS(); // Enable TLS encryption
        smtp.sendMessage(msg);
        smtp.close();

        std::cout << "Email sent successfully to " << recipientEmail << std::endl;
    } catch (const Poco::Net::NetException& e) {
        std::cerr << "Network error sending email: " << e.displayText() << std::endl;
        throw; // Rethrow the exception to handle it in the caller
    } catch (const std::exception& e) {
        std::cerr << "General error sending email: " << e.what() << std::endl;
        throw; // Rethrow the exception to handle it in the caller
    }
}

int main() {
    crow::SimpleApp app;

    // CORS Middleware
    auto cors = [](const crow::request&, crow::response& res, std::function<void()> next) {
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
        next();
    };

    app.use(cors);

    // Email sending route
    CROW_ROUTE(app, "/send-email").methods("POST"_method)([](const crow::request& req) {
        auto json = crow::json::load(req.body);
        if (!json) {
            return crow::response(400, "Invalid JSON");
        }

        try {
            std::string email = json["email"].s();
            std::string subject = json["subject"].s();
            std::string message = json["body"].s();

            std::cout << "Received email request for: " << email << std::endl;

            sendEmail(email, subject, message);

            return crow::response(200, "Email sent successfully");
        } catch (const std::exception& e) {
            std::cerr << "Error in /send-email route: " << e.what() << std::endl;
            return crow::response(500, "Failed to send email");
        }
    });

    // Options route for CORS preflight requests
    CROW_ROUTE(app, "/send-email").methods("OPTIONS"_method)([] {
        return crow::response(204);
    });

    // Start the server on port 5001
    app.port(5001).multithreaded().run();

    return 0;
}
