import css from "./Block.module.css"

export default function Block({ memoBlock, handleMemoClick, animating}) {
    console.log("tempFlipped",memoBlock)
    return (
        <div className={css.Block} onClick={()=> (!memoBlock.flipped && !animating) && handleMemoClick(memoBlock) }>
            <div className={`${css.inner} ${(memoBlock.flipped || memoBlock.tempFlipped) && css.flipped}`}>
                <div className={css.BlockFront}>
                </div>
                <div className={`${css.BlockBack} ${memoBlock.matched && css.match}`}>
                    {memoBlock.emoji}
                </div>
            </div>
            
        </div>
    )
}