#pragma once

#include <boost/asio.hpp>
#include <boost/version.hpp>

#if BOOST_VERSION >= 106600
namespace boost {
    namespace asio {
        typedef io_context io_service;  // Add this line to define io_service as io_context
        template <typename T>
        auto get_io_service(T& t) -> decltype(t.get_executor().context()) {
            return t.get_executor().context();
        }
    }
}
#else
namespace boost {
    namespace asio {
        template <typename T>
        auto get_io_service(T& t) -> decltype(t.get_io_service()) {
            return t.get_io_service();
        }
    }
}
#endif