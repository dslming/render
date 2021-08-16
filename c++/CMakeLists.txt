cmake_minimum_required(VERSION 3.10)
project(app)

set(CMAKE_CXX_STANDARD 17)
include_directories(
  "image_load"
)
include_directories( "/usr/local/include/eigen3" )

add_executable(app app.cpp)
