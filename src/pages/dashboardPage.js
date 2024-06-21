import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import ThreeDGraph from "../components/threeDGraph";
import Loader from "../components/loader";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import { div } from "three/examples/jsm/nodes/Nodes.js";

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

        // Set initial coordinates in state
        setPosition(response.data);
      } catch (error) {
        console.error("Error fetching initial coordinates:", error);
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

      console.log(response.data.message);
    } catch (error) {
      console.error("Error sending coordinates:", error);
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
    </div>
  );
};

export default Dashboard;
