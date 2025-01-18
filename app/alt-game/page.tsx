"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
function latLngToPixel(lat: number, lng: number) {
  const latRange = boundingBox.maxLat - boundingBox.minLat;
  const lngRange = boundingBox.maxLng - boundingBox.minLng;

  const x = ((lng - boundingBox.minLng) / lngRange) * MAP_WIDTH;
  const y = ((boundingBox.maxLat - lat) / latRange) * MAP_HEIGHT;

  return { x, y };
}

// 2) Places array with lat/lng + array of 3 images
//    Reordered so that (1.jpg) -> (3.jpg) -> (2.jpg)
const altPlaces = [
  {
    lat: 1.304203,
    lng: 103.7736519,
    label: "Fine Food",
    images: [
      "/alt-maps/finefood1.jpg", // Shown first (index 0)
      "/alt-maps/finefood2.jpg", // Shown last (index 2)
      "/alt-maps/finefood3.jpg", // Shown second (index 1)
    ],
  },
  {
    lat: 1.3035836,
    lng: 103.7744331,
    label: "UtownBusStop",
    images: [
      "/alt-maps/utownbusstop1.jpg", // index 0
      "/alt-maps/utownbusstop3.jpg", // index 1
      "/alt-maps/utownbusstop2.jpg", // index 2
    ],
  },
  // ... Repeat for other places
];

// Simple modal for displaying info
function Modal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height:"100%",
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

export default function AltGamePage() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  // Current location object
  const [currentPlace, setCurrentPlace] = useState<any>(null);

  // The correct location's pixel coords
  const [correctPin, setCorrectPin] = useState<{ x: number; y: number } | null>(
    null
  );

  // The user’s guess in pixel coords
  const [userPin, setUserPin] = useState<{ x: number; y: number } | null>(null);

  // Show/hide correct pin after guess
  const [showCorrectPin, setShowCorrectPin] = useState(false);

  // Control whether the map is expanded
  const [mapExpanded, setMapExpanded] = useState(false);

  // Modal messages
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  // Track which “image index” (0,1,2) we’re currently showing for this place
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    pickRandomPlace();
  }, []);

  // Pick a random place, reset pins, etc.
  function pickRandomPlace() {
    const place = altPlaces[Math.floor(Math.random() * altPlaces.length)];
    setCurrentPlace(place);

    // Compute correct location in pixel coords
    const coords = latLngToPixel(place.lat, place.lng);
    setCorrectPin(coords);

    // Reset user guess and pins
    setUserPin(null);
    setShowCorrectPin(false);

    // Start from the first image (index 0 => "1.jpg")
    setImageIndex(0);
  }

  // Called each time user clicks “Next Hint”
  // Moves from index 0 -> 1 -> 2 (max 2)
  function showNextImage() {
    if (imageIndex < 2) {
      setImageIndex(imageIndex + 1);
    }
  }

  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setUserPin({ x, y });
  }

  // Example scoring logic: distance-based
  function getDistanceScore(distance: number) {
    // Base score from 0..1000
    if (distance <= 50) {
      return 1000;
    } else if (distance >= 500) {
      return 0;
    } else {
      // Linear interpolation for mid-range
      const ratio = (500 - distance) / 450; // 500-50=450
      return Math.round(1000 * ratio);
    }
  }

  // Return a hint multiplier based on imageIndex
  // 0 => 2, 1 => 1.5, 2 => 1
  function getHintMultiplier(index: number) {
    if (index === 0) return 2.0;
    if (index === 1) return 1.5;
    return 1.0;
  }

  function handleSubmitGuess() {
    if (!userPin || !correctPin) return;

    const dx = userPin.x - correctPin.x;
    const dy = userPin.y - correctPin.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Show correct pin
    setShowCorrectPin(true);

    // Calculate the base score from distance
    const baseScore = getDistanceScore(distance);

    // Multiply by hint factor
    const multiplier = getHintMultiplier(imageIndex);
    const roundScore = Math.round(baseScore * multiplier);

    const newTotal = score + roundScore;
    setScore(newTotal);

    setModalMessage(
      `You were ${distance.toFixed(
        2
      )} pixels away. Base score: ${baseScore} × multiplier ${multiplier} = ${roundScore}. Total: ${newTotal}.`
    );
  }

  // Move to the next round or end game after 5
  function handleNextRound() {
    if (round === 5) {
      // Optionally store the final alt-game score
      localStorage.setItem("altMostRecentScore", String(score));
      // Compare to highest if needed ...

      router.push("/");
      return;
    }

    setRound(round + 1);
    pickRandomPlace();
  }

  return (
    
    <div style={{ height: "100vh", position: "relative" }}>
      {/* Modal */}
      {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage(null)} />
      )}

      {/* Header / Score display */}
      
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <h2>Alt-Game</h2>
        <h3>Score: {score}</h3>
        <h4>Round: {round} / 5</h4>
      </div>

      {/* End Game link */}
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

      {/* Main area: show the current image(s) */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Display the current image from currentPlace.images[imageIndex] */}
        {currentPlace && (
          <div
            style={{
              width: "600px",
              height: "400px",
              position: "relative",
              border: "2px solid #ccc",
              overflow: "hidden",
            }}
          >
            <Image
              src={currentPlace.images[imageIndex]}
              alt="Clue"
              fill
              unoptimized
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* Buttons to move to next image OR show map */}
        <div style={{ marginTop: "20px" }}>
          {/* Only show "Next Hint" button if we haven't reached the 3rd image */}
          {imageIndex < 2 && (
            <button
              onClick={showNextImage}
              style={{
                padding: "10px 15px",
                marginRight: "10px",
                backgroundColor: "orange",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Next Hint
            </button>
          )}

          <button
            onClick={() => setMapExpanded(true)}
            style={{
              padding: "10px 15px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Guess on Map
          </button>
        </div>
      </div>

      {/* Map pop-up (similar to original game) */}
      {mapExpanded && (
        <div
          className="map-container"
          style={{
            position: "absolute",
            top: "50px",
            left: "50px",
            width: "800px",
            height: "600px",
            border: "2px solid black",
            zIndex: 2000,
          }}
          onClick={handleMapClick}
        >
          <Image src="/map.jpg" alt="Map" fill style={{ objectFit: "cover" }} />

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

          {/* Submit Guess */}
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

          {/* Next Round */}
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

          {/* Close Map */}
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
    </div>
  );
}
