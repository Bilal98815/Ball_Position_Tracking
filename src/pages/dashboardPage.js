import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import ThreeDGraph from "../components/threeDGraph";
import Loader from "../components/loader";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = socketIOClient("http://localhost:3000");

const Dashboard = () => {
  const [localName, setLocalName] = useState("");
  const [position, setPosition] = useState([0, 0, 0]);
  const [isLoading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const tempName = localStorage.getItem("name");
    if (!tempName) {
      setLocalName("Nil");
    } else {
      setLocalName(tempName);
    }

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

        switch (response.status) {
          case 200:
            setPosition(response.data);
            break;
          case 201:
            setPosition(response.data);
            break;
          case 401:
            console.log(response.status);
            toast.error(response.status + " Unauthorized User!", {
              position: "top-left",
              autoClose: 3000,
            });
            break;
          case 403:
            console.log(response.status);
            toast.error(response.status + " Error verifying token!", {
              position: "top-left",
              autoClose: 3000,
            });
            break;
          case 500:
            console.log(response.status);
            toast.error(response.status + " " + response.data.message, {
              position: "top-left",
              autoClose: 3000,
            });
            break;

          default:
            console.log(response.status);
            toast.error(response.status + " Something went wrong!", {
              position: "top-left",
              autoClose: 3000,
            });
            break;
        }
      } catch (error) {
        if (error.response) {
          console.error("Error! " + error);
          toast.error("Error! " + error, {
            position: "top-left",
            autoClose: 3000,
          });
        } else if (error.request) {
          console.error("No response received from server:", error.request);
          toast.error(
            "No response received from server. Please try again later.",
            {
              position: "top-left",
              autoClose: 3000,
            }
          );
        } else {
          console.error("Error during request setup:", error.message);
          toast.error("Error during request setup. Please try again later.", {
            position: "top-left",
            autoClose: 3000,
          });
        }
      }
    };

    fetchInitialCoordinates();
    setLoading(false);

    socket.on("ballPosition", (data) => {
      console.log(data);
      setPosition((prevPositions) => [...prevPositions, data]);
    });

    // Clean up the event listener on component unmount
    return () => socket.off("ballPosition");
  }, []);

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

  const sendCoordinates = async () => {
    const x = Math.random() * 10; // Simulate random coordinates
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

      switch (response.status) {
        case 200:
          console.log(response.data.message);
          break;
        case 201:
          console.log(response.data.message);
          break;
        case 400:
          console.log(response.data.message);
          toast.error(response.status + " " + response.data.message, {
            position: "top-left",
            autoClose: 3000,
          });
          break;
        case 401:
          console.log(response.status);
          toast.error(response.status + " Unauthorized User!", {
            position: "top-left",
            autoClose: 3000,
          });
          break;
        case 403:
          console.log(response.status);
          toast.error(response.status + " Error verifying token!", {
            position: "top-left",
            autoClose: 3000,
          });
          break;
        case 500:
          console.log(response.status);
          toast.error(response.status + " " + response.data.message, {
            position: "top-left",
            autoClose: 3000,
          });
          break;

        default:
          console.log(response.status);
          toast.error(response.status + " Something went wrong!", {
            position: "top-left",
            autoClose: 3000,
          });
          break;
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.message);
        toast.error(error.response.data.message, {
          position: "top-left",
          autoClose: 3000,
        });
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        toast.error(
          "No response received from server. Please try again later.",
          {
            position: "top-left",
            autoClose: 3000,
          }
        );
      } else {
        console.error("Error during request setup:", error.message);
        toast.error("Error during request setup. Please try again later.", {
          position: "top-left",
          autoClose: 3000,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loader">
        <Loader />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
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
        <div className="spacer"></div>{" "}
        {/* Spacer to push logout button to bottom */}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="graph-container">
        <ThreeDGraph data={position} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
