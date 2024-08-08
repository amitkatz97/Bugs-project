import { sortBy } from "lodash"
import { useState } from "react"


export function BugSort({filterBy, onSetFilterBy}){

    // const [newSortBy , setNewSortBy]= useState(filterBy.sortBy)

    function handleChange({target}){
        const {value, name} = target
        console.log(value)
        const newSortBy ={
            by: value,
            dir: 1
        }
        
        onSetFilterBy(prevFilterBy => ({...prevFilterBy, sortBy: newSortBy}))
    }

    function changeSort(){
        let {sortBy}= filterBy
        let {dir} = filterBy.sortBy
        const newSortBy ={
            by: sortBy.by,
            dir: dir *-1
        }
        console.log(newSortBy)
        onSetFilterBy(prevFilterBy => ({...prevFilterBy, sortBy: newSortBy}))
    }


    return(
        <section className="bug-sort">  
           <label htmlFor="sort"></label>
                <select onChange={handleChange} name ="sort" id= "sort">
                    <option value="severity">Severity</option>
                    <option value="CreateAt">Creation Time</option>
                    <option value="title">Title</option>
                </select>
                <button className='order-sort' onClick={changeSort} name='sort'>A-Z</button>
        </section>
    )

}