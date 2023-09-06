import Board from "./COMPONENTS/Board/Board";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const emojis = [..."🎁🎟🎄🎀🎗"];
  const [shuffleMemoBlocks, setShuffleMemoBlocks] = useState([]); // State with shuffle blocks

  useEffect(() => {
    const suffleList = shuffleArray([...emojis, ...emojis]); // Funtion for get the complete shuffle emoji list (array x2)
    setShuffleMemoBlocks(
      suffleList.map(
        (emoji, index) => ({ index, emoji, flipped: false }) // Set the list state with the shuffle blocks (each with props flipped and index)
      )
    );
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const a = Math.floor(Math.random() * (i + 1)); //   Function for shuffle the array
      [array[i], array[a]] = [array[a], array[i]];
    }
    return array;
  };

  return (
    <div>
      <Board memoBlocks={shuffleMemoBlocks}></Board>
    </div>
  );
}

export default App;
