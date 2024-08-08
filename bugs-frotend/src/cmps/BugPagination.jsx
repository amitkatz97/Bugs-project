


export function BugPagination({filterBy, onSetFilterBy}){


    function onChangeIdx(x){
        let {pageIdx} = filterBy
        
        if(x === "+"){
            onSetFilterBy(prevFilterBy => ({...prevFilterBy, pageIdx: pageIdx+1}))
        } else { if (pageIdx === 0){
            return
        } else{onSetFilterBy(prevFilterBy => ({...prevFilterBy, pageIdx: pageIdx-1}))}
        }
    }

    return (
        <div className="bug-pagination">
           <button onClick={()=>onChangeIdx('-')}>-</button>
           <span>{filterBy.pageIdx}</span>
           <button onClick={()=>onChangeIdx('+')}>+</button>
        </div>
    )
}