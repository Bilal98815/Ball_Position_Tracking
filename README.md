# Ball_Position_Tracking

# Project Overview

This is a web based project consisting of both backend and frontend. In this project the user known as Ball Monitor signups, logins
and then can see 3D coordinates in a 3D space or 3D graph. These coordinates are of a real object known as Ball. But the coordinates are random generated.
When user send new coordinates, these coordinates are send to backend and database which is mysql database and then these coordinates are reflected back to frontend
using websocket. Initially when ball monitor login then the site get initial coordinated from backend and show them in 3D graph.

# How to run project

There are 3 branches in this repo
-> main
-> frontend_reactjs
-> backend_nodejs

frontend_reactjs branch contains all the code of frontend of website made in reactjs
when clone this code and install necessary dependencies, then run "npm start" command to run the project
Frontend code is running on local server on port 3001

backend_nodejs branch contains all the code of backend of website made in nodejs and expressjs
when clone this code, run "npm start server.js" command. Here server.js is the main file containing all the code
Backend code is also running on local server on port 3000

To use mysql, I have downloaded and installed xampp control panel which installs apache, mysql, php. Open xampp control panel and start 
apache for "localhost/phpmyadmin" site to view mysql database and then start mysql also to interact with mysql.

# Technologies used

-> ReactJS (frontend)
-> NodeJS (backend)
-> MySQL (Database)
-> Github (version management)
-> Postman (testing APIs)

