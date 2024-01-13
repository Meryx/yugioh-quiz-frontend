import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles, Button, mergeClasses } from "@fluentui/react-components";
import { shorthands } from "@fluentui/react-components";

const useStyles = makeStyles({
  streakCounter: {
    marginTop: "12px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  answerButton: {
    width: "300px",
    marginRight: "24px",
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
    alignItems: "center",
  },
  answersRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  questionAnswerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    } else {
      setStreakCounter(0); // Reset streak counter if incorrect
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
    <div>
      <div>
        {imageSrc && (
          <img src={imageSrc} className={styles.responsiveImage} alt="Random" />
        )}
      </div>
      <div className={styles.questionAnswerContainer}>
        <div className={styles.question}>
          <b>{imageData.question}</b>
        </div>
        <div className={styles.answersRow}>
          {imageData.choices.slice(0, 2).map((choice, index) => (
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
          ))}
        </div>
        <div className={styles.answersRow}>
          {imageData.choices.slice(2, 4).map((choice, index) => (
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
          ))}
        </div>
      </div>
      <div>
        <div className={styles.streakCounter}>Streak: {streakCounter}</div>
        <div className={styles.streakCounter}>
          Highest Streak: {highestStreak}
        </div>
      </div>

      <div>{correct}</div>
    </div>
  );
};

export default App;
