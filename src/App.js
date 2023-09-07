import Board from "./COMPONENTS/Board/Board";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const emojis = [..."🎁🎟🎄🎀🎗🎃🧧🎡🛒👕"];
  const [shuffleMemoBlocks, setShuffleMemoBlocks] = useState([]); // State with shuffle blocks
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [animating, setAnimating] = useState(false);

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

  const handleMemoClick = (block) => {
    const flippedBlock = { ...block, flipped: true }; // add flipped prop to the Block
    let shuffleMemoBlocksCopy = [...shuffleMemoBlocks]; // make a copy of shuffleArray
    shuffleMemoBlocksCopy.splice(block.index, 1, flippedBlock); // Swap the block without the flipped prop for the one that has it
    setShuffleMemoBlocks(shuffleMemoBlocksCopy);
    console.log("s");

    if (selectedBlock === null) {
      setSelectedBlock(block);
    } else if (selectedBlock.emoji === block.emoji) {
      // aqui quiero que tanto para el selectedBlock como para el block se le agregue la clase match, para cambiarle el fondo de color a verde
      const updatedMemoBlocks = shuffleMemoBlocksCopy.map((b) => {
        if (b.index === block.index || b.index === selectedBlock.index) {
          return { ...b, matched: true }; // Add the match property to the block
        }
        return b;
      });
      setShuffleMemoBlocks(updatedMemoBlocks);
      setSelectedBlock(null);
    } else {
      setAnimating(true);
      setTimeout(() => {
        shuffleMemoBlocksCopy.splice(block.index, 1, block);
        shuffleMemoBlocksCopy.splice(selectedBlock.index, 1, selectedBlock);
        setShuffleMemoBlocks(shuffleMemoBlocksCopy);
        setSelectedBlock(null);
        setAnimating(false);
      }, 1000);
    }
  };

  ///////////////////////////////////////////////////////////////
  return (
    <div>
      <Board
        memoBlocks={shuffleMemoBlocks}
        animating={animating}
        handleMemoClick={handleMemoClick}
      ></Board>
    </div>
  );
}

export default App;
