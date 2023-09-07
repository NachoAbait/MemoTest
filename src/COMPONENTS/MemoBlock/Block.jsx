import css from "./Block.module.css"

export default function Block({memoBlock, handleMemoClick, animating}) {
    return (
        <div className={css.Block} onClick={()=> (!memoBlock.flipped && !animating) && handleMemoClick(memoBlock) }>
            <div className={`${css.inner} ${memoBlock.flipped && css.flipped}`}>
                <div className={css.BlockFront}>
                </div>
                <div className={`${css.BlockBack} ${memoBlock.matched && css.match}`}>
                    {memoBlock.emoji}
                </div>
            </div>
            
        </div>
    )
}