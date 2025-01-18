"use client";

import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// 1) Define bounding box and map dimensions:
const boundingBox = {
  minLat: 1.290643, 
  maxLat: 1.307454,
  minLng: 103.766688,
  maxLng: 103.788455,
};

const MAP_WIDTH = 800; // The real size of map.jpg
const MAP_HEIGHT = 600;

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

function Modal({ message, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
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

export default function GamePage() {
  const router = useRouter();      // <-- For redirection
  const [score, setScore] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [round, setRound] = useState(1); // Track current round

  // We'll store the correct location's pixel coords for the current place
  const [correctPin, setCorrectPin] = useState(null);

  // The user's guess in pixel coords
  const [userPin, setUserPin] = useState(null);

  // Control whether the map is expanded
  const [mapExpanded, setMapExpanded] = useState(false);

  // Only show the correct pin (green pin / emoji) after pressing "Submit Guess"
  const [showCorrectPin, setShowCorrectPin] = useState(false);

  // Modal state
  const [modalMessage, setModalMessage] = useState(null);

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

    // Clear previous guess
    setUserPin(null);

    // Hide the correct pin until they guess again
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

    // Reveal the correct pin now
    setShowCorrectPin(true);

    // Example scoring logic
    if (distance < 50) {
      setScore(score + 1);
      setModalMessage(
        `Nice job! You were ${distance.toFixed(
          2
        )} pixels away. Score now: ${score + 1}`
      );
    } else {
      setModalMessage(
        `Too far! You were ${distance.toFixed(
          2
        )} pixels away. Score remains: ${score}`
      );
    }
  }

  /**
   * We remove the logic that automatically closes the map 
   * if the user clicks outside of it. Hence the map stays open
   * (and the guess remains) even after submission.
   */
  // useEffect(() => {
  //   if (mapExpanded) document.addEventListener("click", handleOutsideClick);
  //   else document.removeEventListener("click", handleOutsideClick);
  //   return () => document.removeEventListener("click", handleOutsideClick);
  // }, [mapExpanded]);

  // function handleOutsideClick(e) {
  //   if (mapExpanded && !e.target.closest(".map-container")) {
  //     setMapExpanded(false);
  //     setUserPin(null);
  //   }
  // }

  /**
   * After 5 rounds, redirect to homepage. 
   * Otherwise, proceed to the next round as before.
   */
  function handleNextRound() {
    if (round === 5) {
      // Redirect to homepage after 5 rounds
      router.push("/");
      return;
    }
    setShowCorrectPin(false);
    setRound(round + 1);
    pickRandomPlace();
  }

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {/* Modal for messages */}
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage(null)} />}

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
        <h2>Score: {score}</h2>
        <h3>Round: {round} / 5</h3>
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
            width: "800px", // Real size so we can measure clicks accurately
            height: "600px",
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
                zIndex: 2102,
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
                zIndex: 2101,
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
              zIndex: 2102,
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

          {showCorrectPin && (
            <button
              onClick={handleNextRound}
              style={{
                position: "absolute",
                top: "50px",
                left: "10px",
                zIndex: 2102,
                backgroundColor: "green",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Next Round
            </button>
          )}

          {/* Optional: A separate "Close Map" button if needed */}
          <button
            onClick={() => setMapExpanded(false)}
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              zIndex: 2102,
              backgroundColor: "gray",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Close Map
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
