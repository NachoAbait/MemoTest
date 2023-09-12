import React from "react";
import css from "./Board.module.css"
import Block from "../MemoBlock/Block";

export default function Board({ memoBlocks, handleMemoClick , animating, difficult}) {

    return (
        <div className={`${css.board} ${css[difficult]}`}>
            {memoBlocks.map((e, i) => { 
                  return <Block key={`${i}_${e.emoji}`} memoBlock={e} handleMemoClick={handleMemoClick} animating={animating} ></Block>
            })}
        </div>
    )
}