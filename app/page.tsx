"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [classicHighestScore, setClassicHighestScore] = useState<number | null>(null);
  const [classicMostRecentScore, setClassicMostRecentScore] = useState<number | null>(null);
  const [altHighestScore, setAltHighestScore] = useState<number | null>(null);
  const [altMostRecentScore, setAltMostRecentScore] = useState<number | null>(null);

  useEffect(() => {
    // Load Classic Mode leaderboard
    const classicLeaderboard = JSON.parse(localStorage.getItem("classicLeaderboard"));
    if (classicLeaderboard) {
      setClassicHighestScore(classicLeaderboard.highestScore || 0);
      setClassicMostRecentScore(classicLeaderboard.mostRecentScore || 0);
    }

    // Load Close-Up Challenge leaderboard
    const altLeaderboard = JSON.parse(localStorage.getItem("altLeaderboard"));
    if (altLeaderboard) {
      setAltHighestScore(altLeaderboard.highestScore || 0);
      setAltMostRecentScore(altLeaderboard.mostRecentScore || 0);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "'Arial', sans-serif",
        backgroundColor: "#F8F9FA", // Light grey background
      }}
    >
      <h1
        style={{
          fontSize: "3.5rem",
          color: "#0057A8", // NUS Blue
          marginBottom: "30px",
          textTransform: "uppercase",
          fontWeight: "bold",
        }}
      >
        NUS Guesser Leaderboards
      </h1>

      {/* Classic Mode Leaderboard */}
      <div
        style={{
          width: "80%",
          maxWidth: "500px",
          padding: "20px",
          marginBottom: "30px",
          border: "2px solid #0057A8", // Blue border
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Slight shadow
          textAlign: "center",
          backgroundColor: "#FFFFFF", // White background
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            color: "#F58025", // NUS Orange
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Classic Mode Leaderboard
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            margin: "10px 0",
            color: "#333",
          }}
        >
          <strong>Highest Score:</strong>{" "}
          {classicHighestScore !== null ? classicHighestScore : "[No score yet]"}
        </p>
        <p
          style={{
            fontSize: "1.2rem",
            margin: "10px 0",
            color: "#333",
          }}
        >
          <strong>Most Recent Score:</strong>{" "}
          {classicMostRecentScore !== null
            ? classicMostRecentScore
            : "[No recent score]"}
        </p>
      </div>

      {/* Close-Up Challenge Leaderboard */}
      <div
        style={{
          width: "80%",
          maxWidth: "500px",
          padding: "20px",
          marginBottom: "30px",
          border: "2px solid #F58025", // Orange border
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Slight shadow
          textAlign: "center",
          backgroundColor: "#FFFFFF", // White background
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            color: "#0057A8", // NUS Blue
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Close-Up Challenge Leaderboard
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            margin: "10px 0",
            color: "#333",
          }}
        >
          <strong>Highest Score:</strong>{" "}
          {altHighestScore !== null ? altHighestScore : "[No score yet]"}
        </p>
        <p
          style={{
            fontSize: "1.2rem",
            margin: "10px 0",
            color: "#333",
          }}
        >
          <strong>Most Recent Score:</strong>{" "}
          {altMostRecentScore !== null
            ? altMostRecentScore
            : "[No recent score]"}
        </p>
      </div>

      {/* Navigation Buttons */}
      <Link href="/game" passHref>
        <button
          style={{
            padding: "15px 30px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "#FFFFFF",
            backgroundColor: "#0057A8", // NUS Blue
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "15px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add a button shadow
            transition: "transform 0.2s ease",
          }}
        >
          Classic Mode
        </button>
      </Link>

      <Link href="/alt-game" passHref>
        <button
          style={{
            padding: "15px 30px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "#FFFFFF",
            backgroundColor: "#F58025", // NUS Orange
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add a button shadow
            transition: "transform 0.2s ease",
          }}
        >
          Close-Up Challenge
        </button>
      </Link>
    </div>
  );
}





