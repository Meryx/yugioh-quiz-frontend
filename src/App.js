import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles, Button, mergeClasses } from "@fluentui/react-components";
import { shorthands } from "@fluentui/react-components";

import correctSound from "./assets/sounds/right-answer.mp3";
import incorrectSound from "./assets/sounds/wrong-answer.mp3";

import aqua from "./assets/images/types/Aqua.png";
import beast from "./assets/images/types/Beast.png";
import beastwarrior from "./assets/images/types/BeastWarrior.png";
import machine from "./assets/images/types/Machine.png";
import pyro from "./assets/images/types/Pyro.png";
import rock from "./assets/images/types/Rock.png";
import spellcaster from "./assets/images/types/Spellcaster.png";
import warrior from "./assets/images/types/Warrior.png";
import wingedbeast from "./assets/images/types/WingedBeast.png";
import zombie from "./assets/images/types/Zombie.png";
import cyberse from "./assets/images/types/Cyberse.png";
import dinosaur from "./assets/images/types/Dinosaur.png";
import dragon from "./assets/images/types/Dragon.png";
import fairy from "./assets/images/types/Fairy.png";
import fiend from "./assets/images/types/Fiend.png";
import fish from "./assets/images/types/Fish.png";
import insect from "./assets/images/types/Insect.png";
import plant from "./assets/images/types/Plant.png";
import psychic from "./assets/images/types/Psychic.png";
import reptile from "./assets/images/types/Reptile.png";
import seaserpent from "./assets/images/types/SeaSerpent.png";
import thunder from "./assets/images/types/Thunder.png";
import wyrm from "./assets/images/types/Wyrm.png";
import divinebeast from "./assets/images/types/DivineBeast.png";

const icons = {
  aqua,
  beast,
  beastwarrior,
  machine,
  pyro,
  rock,
  spellcaster,
  warrior,
  wingedbeast,
  zombie,
  cyberse,
  dinosaur,
  dragon,
  fairy,
  fiend,
  fish,
  insect,
  plant,
  psychic,
  reptile,
  seaserpent,
  thunder,
  wyrm,
  divinebeast,
};

const correctAudio = new Audio(correctSound);
const incorrectAudio = new Audio(incorrectSound);

const useStyles = makeStyles({
  buttonWithIcon: {
    position: "relative",
    display: "inline-block", // Adjust as needed
  },
  iconImage: {
    position: "absolute",
    top: "4px",
    left: "4px",
  },
  quizContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "24px",
    marginBottom: "24px",
  },
  imageProgressContainer: {
    width: "624px",

    "@media (max-width: 768px)": {
      width: "100%", // Set width to 100% of the container
    },
  },
  progressBarContainer: {
    width: "100%",
    height: "20px",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "green",
  },
  streakCounter: {
    marginTop: "12px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  answerButton: {
    width: "300px",
    marginBottom: "12px",

    "@media (max-width: 768px)": {
      marginRight: "0px",
    },
  },
  question: {
    marginBottom: "12px",
    marginTop: "12px",
    fontSize: "20px",
    display: "flex",
    flexDirection: "column",
    "@media (max-width: 768px)": {
      alignItems: "center",
    },
  },
  answersRow: {
    display: "flex",
    justifyContent: "space-between",
    "@media (max-width: 768px)": {
      flexDirection: "column",

      alignItems: "center",
    },
  },
  questionAnswerContainer: {
    display: "flex",
    flexDirection: "column",
    width: "624px",
    justifyItems: "center",
    "@media (max-width: 768px)": {
      alignItems: "center",
      width: "100%", // Set width to 100% of the container
    },
  },
  responsiveImage: {
    width: "624px", // Default width for larger screens
    height: "624px", // Default height for larger screens

    // Media query for smaller screens (e.g., max-width of 768px)
    "@media (max-width: 768px)": {
      width: "100%", // Set width to 100% of the container
      height: "auto", // Adjust height automatically to maintain aspect ratio
    },
  },
  correctAnswer: {
    ...shorthands.border(
      "1px !important",
      "solid !important",
      "green !important"
    ),
    ...shorthands.transition("border-color 0.5s ease"),
    transitionDuration: "0.5s",
  },
  incorrectAnswer: {
    ...shorthands.border(
      "1px !important",
      "solid !important",
      "red !important"
    ),
    ...shorthands.transition("border-color 0.5s ease"),
    transitionDuration: "0.5s",
  },
  streakContainer: {
    display: "flex",
    flexDirection: "column",
    width: "624px",
    "@media (max-width: 768px)": {
      width: "100%", // Set width to 100% of the container
    },
  },
});

const App = () => {
  const styles = useStyles();
  const [imageSrc, setImageSrc] = useState("");
  const [imageData, setImageData] = useState({ choices: [] });
  const [correct, setCorrect] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [streakCounter, setStreakCounter] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [progress, setProgress] = useState(1000);
  const [progressColor, setProgressColor] = useState([0, 255, 0]);
  const [icon, setIcon] = useState(["", "", "", ""]);

  const mix = (color1, color2, weight) => {
    // Mix two colors together
    const p = weight / 100;
    const w = p * 2 - 1;
    const w1 = (w / 1 + 1) / 2;
    const w2 = 1 - w1;
    const rgb = [
      Math.round(color1[0] * w1 + color2[0] * w2),
      Math.round(color1[1] * w1 + color2[1] * w2),
      Math.round(color1[2] * w1 + color2[2] * w2),
    ];
    return rgb;
  };

  useEffect(() => {
    // Start the progress bar when a new image is fetched
    setProgress(1000);
    setProgressColor([0, 255, 0]);
    // Clean up the timer
  }, [imageSrc]); // Depend on imageSrc so it resets on new image

  useEffect(() => {
    if (imageData.question == "What is the type of this monster?") {
      const type = imageData.race.toLowerCase();
      const index = imageData.choices.indexOf(imageData.race);
      const selectedIcon = ["", "", "", ""];
      selectedIcon[index] = icons[type.replace(" ", "").replace("-", "")];
      for (let i = 0; i < 4; i++) {
        if (i != index) {
          selectedIcon[i] =
            icons[
              imageData.choices[i]
                .replace(" ", "")
                .replace("-", "")
                .toLowerCase()
            ];
        }
      }
      console.log(imageData.choices);
      setIcon(selectedIcon);
    }
  }, [imageData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(progress - 1); // Set progress to 0 after 5 seconds
      setProgressColor(mix([0, 255, 0], [255, 0, 0], progress / 10));
    }, 5);

    if (progress === 0) {
      // Reset streak and fetch new image when progress bar completes
      setStreakCounter(0);
      fetchImage();
      return () => clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [progress]);

  const fetchImage = async () => {
    try {
      // First request to get the image key
      const response = await axios.get(
        "http://localhost:8000/random-image-info"
      );
      const name = response.data.name;
      const key = name.split(".")[0];

      setImageData(response.data);
      console.log("Image data:", response.data);

      // Second request to fetch the image using the key
      const imageResponse = await axios.get(
        `http://localhost:8000/fetch-image?name=${key}`,
        { responseType: "blob" }
      );

      // Convert the blob to a URL and set it as the image source
      const url = URL.createObjectURL(imageResponse.data);
      setImageSrc(url);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };
  useEffect(() => {
    // Function to fetch image key and then the image
    fetchImage();
  }, []);

  const pickAnswer = (answer) => {
    setSelectedAnswer(answer); // Set the selected answer
    setShowAnimation(true); // Start the animation
    setCorrect(answer === imageData.correct_choice ? "Correct!" : "Incorrect!");

    if (answer === imageData.correct_choice) {
      if (streakCounter + 1 > highestStreak) {
        setHighestStreak(streakCounter + 1); // Set new highest streak
      }
      setStreakCounter(streakCounter + 1); // Increment streak counter if correct
      (() => {
        new Audio(correctSound).play();
      })();
    } else {
      setStreakCounter(0); // Reset streak counter if incorrect
      (() => {
        new Audio(incorrectSound).play();
      })();
    }

    // Delay fetching new image/question
    setTimeout(() => {
      fetchImage();
      setShowAnimation(false); // Reset animation state
      setSelectedAnswer(null); // Reset selected answer
      setCorrect(""); // Reset correct state
    }, 1000); // Delay in milliseconds
  };

  return (
    <div className={styles.quizContainer}>
      <div className={styles.imageProgressContainer}>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{
              width: `${progress / 10}%`,
              backgroundColor: `rgb(${progressColor[0]}, ${progressColor[1]}, ${progressColor[2]})`,
            }}
          ></div>
        </div>
        <div>
          {imageSrc && (
            <img
              src={imageSrc}
              className={styles.responsiveImage}
              alt="Random"
            />
          )}
        </div>
      </div>
      <div className={styles.questionAnswerContainer}>
        <div className={styles.question}>
          <b>{imageData.question}</b>
        </div>
        <div className={styles.answersRow}>
          {imageData.choices.slice(0, 2).map((choice, index) => (
            <div className={styles.buttonWithIcon}>
              {imageData.question == "What is the type of this monster?" && (
                <img
                  className={styles.iconImage}
                  width="24px"
                  height="24px"
                  src={icon[index]}
                />
              )}
              <Button
                key={index}
                disabled={showAnimation}
                className={mergeClasses(
                  styles.answerButton,
                  showAnimation && selectedAnswer === choice
                    ? choice === imageData.correct_choice
                      ? styles.correctAnswer
                      : styles.incorrectAnswer
                    : "",
                  showAnimation && choice === imageData.correct_choice
                    ? styles.correctAnswer
                    : ""
                )}
                onClick={() => pickAnswer(choice)}
              >
                {choice}
              </Button>
            </div>
          ))}
        </div>
        <div className={styles.answersRow}>
          {imageData.choices.slice(2, 4).map((choice, index) => (
            <div className={styles.buttonWithIcon}>
              {imageData.question == "What is the type of this monster?" && (
                <img
                  className={styles.iconImage}
                  width="24px"
                  height="24px"
                  src={icon[index + 2]}
                />
              )}
              <Button
                key={index}
                disabled={showAnimation}
                className={mergeClasses(
                  styles.answerButton,
                  showAnimation && selectedAnswer === choice
                    ? choice === imageData.correct_choice
                      ? styles.correctAnswer
                      : styles.incorrectAnswer
                    : "",
                  showAnimation && choice === imageData.correct_choice
                    ? styles.correctAnswer
                    : ""
                )}
                onClick={() => pickAnswer(choice)}
              >
                {choice}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.streakContainer}>
        <div className={styles.streakCounter}>Streak: {streakCounter}</div>
        <div className={styles.streakCounter}>
          Highest Streak: {highestStreak}
        </div>
      </div>

      <div>{correct}</div>
      <img width="32px" height="32px" src={aqua} />
    </div>
  );
};

export default App;
