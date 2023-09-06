import React from "react";


export default function Board({ memoBlocks }) {

    return (
        <div>
            {memoBlocks.map(e => <div>{e.emoji}</div>)}
        </div>
    )
}