import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [imageData, setImageData] = useState({ choices: [] });
  const [correct, setCorrect] = useState("");

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
    if (answer === imageData.correct_choice) {
      setCorrect("Correct!");
      fetchImage();
    } else {
      setCorrect("Incorrect!");
      fetchImage();
    }
  };

  return (
    <div>
      <div>{imageSrc && <img src={imageSrc} alt="Random" />}</div>
      {imageData.choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => {
            pickAnswer(choice);
          }}
        >
          {choice}
        </button>
      ))}

      <div>{correct}</div>
    </div>
  );
};

export default App;
