#include "crow.h"

int main() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/")([]() {
        return "Hello, Crow! wassup";
    });

    app.port(8080).multithreaded().run();
}
