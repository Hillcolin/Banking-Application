#include <drogon/drogon.h>

int main() {
    // Create a Drogon application
    drogon::app().addListener("0.0.0.0", 8080);

    // Define a simple HTTP GET endpoint
    drogon::app().registerHandler("/hello", [](const drogon::HttpRequestPtr &req,
                                               std::function<void(const drogon::HttpResponsePtr &)> &&callback) {
        auto resp = drogon::HttpResponse::newHttpResponse();
        resp->setBody("Hello, Drogon!");
        callback(resp);
    });

    // Run the application
    drogon::app().run();
    return 0;
}