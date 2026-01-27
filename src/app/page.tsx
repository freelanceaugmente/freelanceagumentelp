"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace("/landing.html");
  }, []);

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      backgroundColor: "#f4ece5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <p>Chargement...</p>
    </div>
  );
}
