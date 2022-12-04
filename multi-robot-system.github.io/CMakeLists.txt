cmake_minimum_required(VERSION 2.8.3)
project(logistic-robot-system)

find_package(catkin REQUIRED)

###################################
## catkin specific configuration ##
###################################
catkin_package()

#############
## Install ##
#############

install(PROGRAMS
   src/index.js
   DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION}
)

