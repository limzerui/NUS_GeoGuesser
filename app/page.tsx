// app/page.tsx
/*
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>NUS GeoGuesser</h1>
      <Link href="/game" passHref>
        <button
          style={{ margin: "10px", padding: "10px 20px", cursor: "pointer" }}
        >
          Start Game
        </button>
      </Link>
    </div>
  );
}
*/

import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          color: "#333",
          marginBottom: "30px",
        }}
      >
        NUS GeoGuesser
      </h1>

      {/* Leaderboard Section */}
      <div
        style={{
          width: "80%",
          maxWidth: "500px",
          padding: "20px",
          marginBottom: "30px",
          border: "2px solid #ccc",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            color: "#555",
            marginBottom: "20px",
          }}
        >
          Leaderboard
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            margin: "10px 0",
            color: "#333",
          }}
        >
          <strong>Highest Score:</strong> [Placeholder]
        </p>
        <p
          style={{
            fontSize: "1.2rem",
            margin: "10px 0",
            color: "#333",
          }}
        >
          <strong>Most Recent Score:</strong> [Placeholder]
        </p>
      </div>

      {/* Start Game Button */}
      <Link href="/game" passHref>
        <button
          style={{
            padding: "15px 30px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "#007BFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Start Game
        </button>
      </Link>
    </div>
  );
}


