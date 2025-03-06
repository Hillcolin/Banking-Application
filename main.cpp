#include "crow.h"

void add_cors_headers(crow::response& res) {
    res.add_header("Access-Control-Allow-Origin", "*");
    res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.add_header("Access-Control-Allow-Headers", "Content-Type");
}

int main() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/")
    ([]() {
        auto res = crow::response("Hello, Crow!");
        add_cors_headers(res);
        return res;
    });

    CROW_ROUTE(app, "/<path>")
    ([](const crow::request& req, crow::response& res) {
        add_cors_headers(res);
        res.end();
    });

    app.port(8080).multithreaded().run();
}