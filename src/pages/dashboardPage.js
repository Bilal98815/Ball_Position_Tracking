import React, { useEffect, useState } from "react";
import ThreeDGraph from "../components/threeDGraph";

const data = [
  { latitude: 0, longitude: 0, altitude: 0 },
  { latitude: 30, longitude: 5, altitude: 0 },
  { latitude: 10, longitude: 60, altitude: 0 },
  { latitude: 10, longitude: 20, altitude: 10 },
];

const Dashboard = () => {
  const [localName, setLocalName] = useState("");

  useEffect(() => {
    const tempName = localStorage.getItem("name");
    if (!tempName) {
      setLocalName("");
    } else {
      setLocalName(tempName);
    }
  }, []);

  return (
    <div className="App">
      <h1>Hi, {localName}</h1>
      <ThreeDGraph data={data} />
    </div>
  );
};

export default Dashboard;
