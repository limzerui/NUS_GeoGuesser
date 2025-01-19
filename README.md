

# NUS GeoGuesser

**NUS GeoGuesser** is a hackathon project done in 12 hours for Hack&Roll, in which it won the award -- "Most Commendable Projects". It is a fun, interactive web application that challenges you to guess locations across the National University of Singapore (NUS) campus. It offers **two distinct game modes**, each with unique mechanics and levels of difficulty. The application is deployed on [Vercel](https://nus-geo-guesser-2-o9raeei99-zeruis-projects-638c0957.vercel.app/), making it easily accessible to anyone.

---

https://github.com/user-attachments/assets/d82c2589-c9a5-4e66-97ad-f788de6d1486
---
https://github.com/user-attachments/assets/b6aefbeb-5e74-4d95-b753-d273895e3be6

---

## Features

- **Two Distinct Game Modes**: Choose between the “Classic” Street View-based mode or the image-based “Close-up” mode.
- **Progressive Rounds**: Each game consists of a series of rounds (e.g., 5). Your points accumulate to a final score.
- **Difficulty Scaling**:  
  - **Classic Mode**: Start zoomed in at a random Street View location. Each guess transitions you to the next round.  
  - **Close-up Mode**: Three images for each location, offering increasing clarity (first image is the trickiest, last image is the easiest).
- **Interactive Map**: Click on the map to pinpoint your guess, and the application shows both your guess and the true location.
- **Local Leaderboard**: Your most recent and highest scores are stored locally in your browser. This data persists between sessions.
- **User-Friendly UI**: Clean interface with intuitive buttons, modals, and progress tracking.
- **Deployed on Vercel**: Easily shareable link, quick loading, and reliable hosting.

---

## Game Modes

### Classic Mode
1. **Street View Guessing**: You are placed in a random NUS location using Google Street View.  
2. **Scoring**: The closer your guess is to the actual location, the more points you score (ranging from 0 to 1000).  
3. **Rounds**: Progress through multiple rounds, each picking a new random location.

### Close-Up Challenge
1. **Image-Based Clues**: Instead of Street View, you see **three static images** of a location — from hardest clue (close-up) to easiest (wide shot).  
2. **Hint Progression**: You can click **Next Hint** to reveal a clearer image.  
3. **Difficulty Multiplier**: Guessing correctly on the first image yields higher points compared to the second or third.  
4. **Same Guess Mechanic**: You open the map, click where you think it is, and compare your guess.

---

## Scoring & Leaderboard

- **Distance-Based Score**: Each guess is scored out of **1000**.  
  - Very close (within ~50px on the map) can yield maximum points.  
  - Far away (over ~500px) yields **0** points.  
  - Anything in between is calculated via linear interpolation.  
- **Leaderboard**:  
  - Stores your **highest score** and **most recent score** in localStorage.  
  - Displayed on the home page, allowing you to track personal improvements.

---

## Scaling of Difficulty

1. **Zooming Mechanics (Classic)**: Street View typically starts from a moderate zoom, forcing you to rotate around, identify landmarks, and guess carefully.
2. **Clue-Based (Close-Up Challenge)**: The first image is zoomed in or more cryptic, the second is moderately revealing, and the third is often a wide or iconic shot. This progression simulates “zooming out” in difficulty over successive hints.
3. **Score Multiplier (Close-Up Challenge)**: Earning higher points for guessing earlier images ensures a risk–reward element. You can guess as soon as you think you know or wait for a better hint at the cost of fewer possible points.

---

## Tech Stack

- **Next.js** (App Router) and **React** for the frontend logic.  
- **TypeScript** for type-safe code.  
- **Google Maps / Street View** for the Classic Mode location services.  
- **localStorage** to save user scores persistently on the client side.  
- **Vercel** hosting and deployment.

---

## Deployment

The app is deployed on **Vercel** at:
[https://nus-geo-guesser-2-o9raeei99-zeruis-projects-638c0957.vercel.app/](https://nus-geo-guesser-2-o9raeei99-zeruis-projects-638c0957.vercel.app/)

---

## Getting Started (Local Development)

1. **Clone** the repository:
   ```bash
   git clone https://github.com/username/nus-geo-guesser.git
   cd nus-geo-guesser
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run in Development**:
   ```bash
   npm run dev
   ```
4. **Open** [http://localhost:3000](http://localhost:3000) to view the app in your browser.

---

## Future Enhancements

- **Multiplayer Mode**: Compete in real-time with friends.  
- **Additional Difficulty Tiers**: More clues or advanced Street View navigation.  
- **Global Leaderboard**: Sync with a backend database for worldwide competition.  
- **Custom Map Boundaries**: Expand or change bounding boxes to other campuses or city areas.

---

## Contributing

Contributions and suggestions are welcome! Feel free to open an issue or submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is available under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

**Enjoy exploring NUS with NUS GeoGuesser!** If you have feedback or ideas, you’re welcome to contribute or reach out.
