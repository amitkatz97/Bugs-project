import { useEffect, useState } from "react";

export function BugFilter({filterBy, onSetFilterBy}){

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
                value = +value || ''
                break;

            case 'text':
                value = value
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }


const {severity , title, labels} = filterByToEdit
    return(
        <section className="bug-filter">
            <h3>Filter the bugs</h3>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="severity"> Severity:</label>
                <input id= "severity" name="severity" type="number" value={severity} onChange={handleChange} />

                <label htmlFor="title">Title:</label>
                <input id= "title" name="title" type="text" value={title} onChange={handleChange} />

                <label htmlFor="labels">Labels: </label>
                <input id="labels" name="labels" type="text" value={labels} onChange={handleChange} />

                <button>Set</button>
            </form>

        </section>
    )

}