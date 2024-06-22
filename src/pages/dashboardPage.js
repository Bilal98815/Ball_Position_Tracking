import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import ThreeDGraph from "../components/threeDGraph";
import Loader from "../components/loader";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// setting up websocket
const socket = socketIOClient("http://localhost:3000");

const Dashboard = () => {
  const [localName, setLocalName] = useState("");
  const [position, setPosition] = useState([0, 0, 0]);
  const [isLoading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    // getting user name from local storage
    const tempName = localStorage.getItem("name");
    if (!tempName) {
      setLocalName("Nil");
    } else {
      setLocalName(tempName);
    }

    // getting intial coordinates from database on startup
    const fetchInitialCoordinates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/initialCoordinates",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          setPosition(response.data);
        } else {
          handleResponseError(response.status, response.data.message);
        }
      } catch (error) {
        handleError(error);
      }
      setLoading(false);
    };

    fetchInitialCoordinates();

    // getting new coordinates via websocket
    socket.on("ballPosition", (data) => {
      console.log(data);
      setPosition((prevPositions) => [...prevPositions, data]);
    });

    // Cleaning up the event listener on component unmount
    return () => socket.off("ballPosition");
  }, [token]);

  const handleResponseError = (status, message) => {
    switch (status) {
      case 401:
        console.log(status);
        toast.error(`${status} Unauthorized User!`, {
          position: "top-left",
          autoClose: 3000,
        });
        break;
      case 403:
        console.log(status);
        toast.error(`${status} Error verifying token!`, {
          position: "top-left",
          autoClose: 3000,
        });
        break;
      case 500:
        console.log(status);
        toast.error(`${status} ${message}`, {
          position: "top-left",
          autoClose: 3000,
        });
        break;
      default:
        console.log(status);
        toast.error(`${status} Something went wrong!`, {
          position: "top-left",
          autoClose: 3000,
        });
        break;
    }
  };

  const handleError = (error) => {
    if (error.response) {
      console.error("Error response:", error.response);
      toast.error(
        `Error! ${error.response.status} ${error.response.statusText}`,
        {
          position: "top-left",
          autoClose: 3000,
        }
      );
    } else if (error.request) {
      console.error("No response received from server:", error.request);
      toast.error("No response received from server. Please try again later.", {
        position: "top-left",
        autoClose: 3000,
      });
    } else {
      console.error("Error during request setup:", error.message);
      toast.error("Error during request setup. Please try again later.", {
        position: "top-left",
        autoClose: 3000,
      });
    }
  };

  // logout function
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      navigate("/", { replace: true });
    } catch (error) {
      console.log("Error: " + error);
      toast.error(`Error: ${error}`, {
        position: "top-left",
        autoClose: 3000,
      });
    }
  };

  // sending random generated coordinates to backend
  const sendCoordinates = async () => {
    const x = Math.random() * 10;
    const y = Math.random() * 10;
    const z = Math.random() * 10;

    console.log("token " + token);

    try {
      const response = await axios.post(
        "http://localhost:3000/ballPositions",
        { x, y, z },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log(response.data.message);
      } else {
        handleResponseError(response.status, response.data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="loader">
        <Loader />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <ToastContainer />
      <div className="left-side">
        <h1 className="dashboard-title">Hi, {localName}</h1>
        <div className="button-container">
          <button className="send-button" onClick={sendCoordinates}>
            Send Coordinates
          </button>
        </div>
        <p>
          Welcome! The graph on the right side visualizes the coordinates,
          providing a clear view of the object's movement over time. To see the
          latest position, simply press the "Send Coordinates" button. Explore
          the interactive graph using the controls for a closer look. Enjoy
          tracking the object's path and monitoring its spatial coordinates
          right here in real-time!
        </p>
        <div className="spacer"></div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="graph-container">
        <ThreeDGraph data={position} />
      </div>
    </div>
  );
};

export default Dashboard;
