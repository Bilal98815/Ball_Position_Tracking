import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import ThreeDGraph from "../components/threeDGraph";

const socket = socketIOClient("http://localhost:3000");

const Dashboard = () => {
  const [localName, setLocalName] = useState("");
  const [position, setPosition] = useState([0, 0, 0]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const tempName = localStorage.getItem("name");
    if (!tempName) {
      setLocalName("");
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

    socket.on("ballPosition", (data) => {
      console.log(data);
      setPosition((prevPositions) => [...prevPositions, data]);
    });

    // Clean up the event listener on component unmount
    return () => socket.off("ballPosition");
  }, []);

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

  return (
    <div className="App">
      <h1>Hi, {localName}</h1>
      <button onClick={sendCoordinates}>Send Coordinates</button>
      <ThreeDGraph data={position} />
    </div>
  );
};

export default Dashboard;
