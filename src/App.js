import Board from "./COMPONENTS/Board/Board";
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import matchSound from "./sounds/correct-choice-43861.mp3";
import trySound from "./sounds/blackjack_1.mp3";
import winnerSound from "./sounds/success-1-6297.mp3";
import errorSound from "./sounds/error-126627.mp3";
import matchHabilitySound from "./sounds/correct-6033.mp3";
import flipHabilitySound from "./sounds/pageturn-102978.mp3";

function App() {
  const emojis = [..."🎁🎟🎄🎀🎗🎃🧧🎡🛒👕"];
  const [shuffleMemoBlocks, setShuffleMemoBlocks] = useState([]); // State with shuffle blocks
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [winMessage, setWinMessage] = useState("");
  const [loseMessage, setLoseMessage] = useState("");
  const [firstAttempt, setFirstAttempt] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [complete, setComplete] = useState(false);
  const [flipHability, setFlipHability] = useState(false);
  const [matchHability, setMatchHability] = useState(false);

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
    if (!firstAttempt) {
      setFirstAttempt(true);
    }

    if (selectedBlock === null) {
      try {
        document.getElementById("trySound").play();
      } catch (error) {
        console.error("Error al reproducir el sonido:", error);
      }

      setSelectedBlock(block);
    } else if (selectedBlock.emoji === block.emoji) {
      // aqui quiero que tanto para el selectedBlock como para el block se le agregue la clase match, para cambiarle el fondo de color a verde
      try {
        document.getElementById("matchSound").play();
      } catch (error) {
        console.error("Error al reproducir el sonido:", error);
      }
      const updatedMemoBlocks = shuffleMemoBlocksCopy.map((b) => {
        if (b.index === block.index || b.index === selectedBlock.index) {
          return { ...b, matched: true }; // Add the match property to the block
        }
        return b;
      });

      setShuffleMemoBlocks(updatedMemoBlocks);
      setSelectedBlock(null);

      const allFlipped = shuffleMemoBlocksCopy.every((block) => block.flipped);
      if (allFlipped) {
        try {
          setComplete(true);
          document.getElementById("winnerSound").play();
          setSeconds(60);
          setFirstAttempt(false);
          setWinMessage("¡Congratulations, you have won!");
        } catch (error) {
          console.error("Error al reproducir el sonido:", error);
        }
      }
    } else {
      setAnimating(true);
      setTimeout(() => {
        shuffleMemoBlocksCopy.splice(block.index, 1, block);
        shuffleMemoBlocksCopy.splice(selectedBlock.index, 1, selectedBlock);
        setShuffleMemoBlocks(shuffleMemoBlocksCopy);
        setSelectedBlock(null);
        setAnimating(false);
      }, 1000);

      try {
        document.getElementById("errorSound").play();
      } catch (error) {
        console.error("Error al reproducir el sonido:", error);
      }
    }
  };

  ///////////////////////// TIMER ////////////////////////////////////
  const timerRef = useRef(null);
  useEffect(() => {
    if (seconds === 0 && complete === false) {
      setLoseMessage("Sorry, your time is over!");
    }

    if (seconds > 0 && firstAttempt) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1); // Decrementa el contador en 1 cada segundo.
      }, 1000);

      // Limpia el intervalo cuando el componente se desmonta o el temporizador llega a cero.
      return () => clearInterval(timerRef.current);
    }
  }, [seconds, firstAttempt, complete]);

  ////////////// HABILITIES ///////////////////////////

  const flipAllBlocks = () => {
    const allFlippedBlocks = shuffleMemoBlocks.map(
      (block) => (block.matched ? block : { ...block, tempFlipped: true }) // Si el bloque ya fue emparejado, no lo modifiques.
    );
    setShuffleMemoBlocks(allFlippedBlocks);
  };

  const resetAllBlocks = () => {
    const allResetBlocks = shuffleMemoBlocks.map(
      (block) => (block.matched ? block : { ...block, tempFlipped: false }) // Solo "des-flipa" bloques que no han sido emparejados.
    );
    setShuffleMemoBlocks(allResetBlocks);
  };

  const handleFlipAllBlocks = () => {
    try {
      document.getElementById("flipHabilitySound").play();
    } catch (error) {
      console.error("Error al reproducir el sonido:", error);
    }
    setFirstAttempt(true);
    flipAllBlocks();
    setTimeout(() => {
      resetAllBlocks();
    }, 1000);
    setFlipHability(true);
  };

  /////

  const randomMatch = () => {
    try {
      document.getElementById("matchHabilitySound").play();
    } catch (error) {
      console.error("Error al reproducir el sonido:", error);
    }
    setFirstAttempt(true);
    const unmatchedBlocks = shuffleMemoBlocks.filter((block) => !block.matched);
    if (unmatchedBlocks.length < 2) {
      return; // No hay suficientes bloques para hacer una coincidencia.
    }

    const randomIndex = Math.floor(Math.random() * unmatchedBlocks.length);
    const block1 = unmatchedBlocks[randomIndex];

    // Encuentra el bloque coincidente.
    const block2 = unmatchedBlocks.find(
      (b) => b.emoji === block1.emoji && b.index !== block1.index
    );
    if (!block2) {
      return; // No debería ocurrir, pero es bueno ser precavido.
    }

    const updatedBlocks = shuffleMemoBlocks.map((block) => {
      if (block.index === block1.index || block.index === block2.index) {
        return { ...block, matched: true, flipped: true };
      }
      return block;
    });
    setShuffleMemoBlocks(updatedBlocks);
    setMatchHability(true);
  };

  //////////// RESET / WIN  / LOSE ///////////////////////
  const HandleClick = () => {
    const suffleList = shuffleArray([...emojis, ...emojis]);
    setShuffleMemoBlocks(
      suffleList.map((emoji, index) => ({ index, emoji, flipped: false }))
    );
    setWinMessage("");
    setLoseMessage("");
    setSeconds(60);
    setFirstAttempt(false);
    setFlipHability(false);
    setMatchHability(false);
  };

  //////////////////////////////////////////////////////////////
  return (
    <div className="container">
      <audio id="matchSound" src={matchSound} preload="auto"></audio>
      <audio id="winnerSound" src={winnerSound} preload="auto"></audio>
      <audio id="trySound" src={trySound} preload="auto"></audio>
      <audio id="errorSound" src={errorSound} preload="auto"></audio>
      <audio
        id="matchHabilitySound"
        src={matchHabilitySound}
        preload="auto"
      ></audio>
      <audio
        id="flipHabilitySound"
        src={flipHabilitySound}
        preload="auto"
      ></audio>

      <div className="main">
        {winMessage && (
          <div className="win-message">
            <h1>{winMessage}</h1>
            <button onClick={HandleClick}>Play again</button>
          </div>
        )}
        {loseMessage && (
          <div className="win-message">
            <h1>{loseMessage}</h1>
            <button onClick={HandleClick}>Retry</button>
          </div>
        )}

        <Board
          memoBlocks={shuffleMemoBlocks}
          animating={animating}
          handleMemoClick={handleMemoClick}
        ></Board>
      </div>

      <div className="sideBar">
        <div className="crono">{seconds}</div>

        <div className="dificult">
          <h2>Difficulty</h2>
          <button>Easy</button>
          <button>Medium</button>
          <button>Hard</button>
        </div>

        <div className="habilities">
          <h2>
            Habilities <span>🔎</span>{" "}
          </h2>
          <button
            className="hab"
            onClick={handleFlipAllBlocks}
            disabled={flipHability}
          >
            Flip
          </button>
          <button
            className="hab"
            onClick={randomMatch}
            disabled={matchHability}
          >
            Random match
          </button>
        </div>
        <button className="restart" onClick={HandleClick}>
          {" "}
          Restart
        </button>
      </div>
    </div>
  );
}

export default App;
