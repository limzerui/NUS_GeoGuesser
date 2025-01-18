"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For redirection

// Modal Component
function Modal({ message, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
          width: "300px",
        }}
      >
        <p>{message}</p>
        <button
          onClick={onClose}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// 1) Define bounding box and map dimensions:
const boundingBox = {
  minLat: 1.290643,
  maxLat: 1.307454,
  minLng: 103.766688,
  maxLng: 103.788455,
};

const MAP_WIDTH = 700;
const MAP_HEIGHT = 570;

// Helper function: lat/lng -> (x, y) pixels on the JPG
function latLngToPixel(lat, lng) {
  const latRange = boundingBox.maxLat - boundingBox.minLat;
  const lngRange = boundingBox.maxLng - boundingBox.minLng;

  const x = ((lng - boundingBox.minLng) / lngRange) * MAP_WIDTH;
  const y = ((boundingBox.maxLat - lat) / latRange) * MAP_HEIGHT;

  return { x, y };
}

// 2) Places array with real lat/lng
const places = [
  { lat: 1.2986334, lng: 103.7715247, label: "Engineering" },
  { lat: 1.3068482, lng: 103.773275, label: "NUSC" },
  { lat: 1.2907101, lng: 103.781023, label: "PGP" },
  { lat: 1.2950454, lng: 103.7748951, label: "COM3" },
  { lat: 1.2959847, lng: 103.7791716, label: "Science" },
  { lat: 1.292383, lng: 103.774028, label: "Business" },
  { lat: 1.2942524, lng: 103.7714807, label: "FASS" },
];

export default function GamePage() {
  const [score, setScore] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [round, setRound] = useState(1); // Track the current round
  const router = useRouter();

  const [correctPin, setCorrectPin] = useState(null); // Correct location in pixel coords
  const [userPin, setUserPin] = useState(null); // User's guess in pixel coords
  const [mapExpanded, setMapExpanded] = useState(false); // Control whether the map is expanded
  const [showCorrectPin, setShowCorrectPin] = useState(false); // Only show correct pin after guess
  const [modalMessage, setModalMessage] = useState(null); // Message for the modal popup

  useEffect(() => {
    // Check for Google Maps script
    const checkGoogleMaps = setInterval(() => {
      if (typeof google !== "undefined") {
        setMapLoaded(true);
        clearInterval(checkGoogleMaps);
      }
    }, 100);

    pickRandomPlace();
  }, []);

  useEffect(() => {
    if (mapLoaded && currentPlace) {
      initStreetView();
    }
  }, [mapLoaded, currentPlace]);

  function pickRandomPlace() {
    const place = places[Math.floor(Math.random() * places.length)];
    setCurrentPlace(place);

    // Compute correct location in pixel coords (on the JPG)
    const coords = latLngToPixel(place.lat, place.lng);
    setCorrectPin(coords);

    // Clear previous guess and hide correct pin
    setUserPin(null);
    setShowCorrectPin(false);
  }

  function initStreetView() {
    if (!currentPlace) return;
    new google.maps.StreetViewPanorama(document.getElementById("street-view"), {
      position: { lat: currentPlace.lat, lng: currentPlace.lng },
      pov: { heading: 165, pitch: 0 },
      zoom: 1,
      disableDefaultUI: true,
      scrollwheel: false,
      panControl: false,
      zoomControl: false,
      linksControl: false,
      motionTracking: false,
      motionTrackingControl: false,
      addressControl: false,
    });
  }

  function handleMapClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setUserPin({ x, y });
  }

  function handleSubmitGuess() {
    if (!userPin || !correctPin) return;

    const dx = userPin.x - correctPin.x;
    const dy = userPin.y - correctPin.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    setShowCorrectPin(true);

    let message;
    if (distance < 50) {
      setScore(score + 1);
      message = `Nice job! You were ${distance.toFixed(
        2
      )} pixels away. Score: ${score + 1}`;
    } else {
      setScore(score);
      message = `Too far! You were ${distance.toFixed(
        2
      )} pixels away. Score: ${score}`;
    }

    setModalMessage(message);

    if (round === 5) {
      setTimeout(() => {
        setModalMessage("Game over! Redirecting to the homepage...");
        setTimeout(() => router.push("/"), 2000); // Redirect after showing the message
      }, 2000);
    } else {
      setRound(round + 1); // Increment the round
      pickRandomPlace(); // Load the next location
    }
  }

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {/* Modal Popup */}
      {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage(null)} />
      )}

      {/* Street View container */}
      <div id="street-view" style={{ height: "100%", width: "100%" }} />

      {/* Score and guess button panel */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          backgroundColor: "#ffffffcc",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <h2>Round: {round} / 5</h2>
        <h2>Score: {score}</h2>
        <button onClick={() => setMapExpanded(true)}>Map Guess</button>
      </div>

      {/* Map expand popup */}
      {mapExpanded && (
        <div
          className="map-container"
          style={{
            position: "absolute",
            top: "50px",
            left: "50px",
            width: `${MAP_WIDTH}px`,
            height: `${MAP_HEIGHT}px`,
            border: "2px solid black",
            zIndex: 2000,
          }}
          onClick={handleMapClick}
        >
          <Image src="/map.jpg" alt="Map" layout="fill" objectFit="cover" />

          {/* User's guess pin (red) */}
          {userPin && (
            <div
              style={{
                position: "absolute",
                left: `${userPin.x}px`,
                top: `${userPin.y}px`,
                width: "10px",
                height: "10px",
                backgroundColor: "red",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 2100,
              }}
            />
          )}

          {/* Correct pin (emoji) */}
          {showCorrectPin && correctPin && (
            <div
              style={{
                position: "absolute",
                left: `${correctPin.x}px`,
                top: `${correctPin.y}px`,
                transform: "translate(-50%, -50%)",
                zIndex: 2100,
                fontSize: "24px",
              }}
            >
              📍
            </div>
          )}

          <button
            onClick={handleSubmitGuess}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 2101,
              backgroundColor: "blue",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Submit Guess
          </button>
        </div>
      )}

      {/* End Game link to homepage */}
      <Link href="/" passHref>
        <button
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            zIndex: 2100,
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          End Game
        </button>
      </Link>
    </div>
  );
}
