#include "crow.h"

int main() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/")([]() {
        return "Hello, Crow! wassup";
    });
	CROW_ROUTE(app, "/greet/<string>")
    ([](const crow::request& req, crow::response& res, std::string username) {
        crow::json::wvalue response;
        response["message"] = "Hello, " + username + "!";
        res = crow::response(response);
        add_cors_headers(res);
        res.end();
    });
    app.port(8080).multithreaded().run();
}
