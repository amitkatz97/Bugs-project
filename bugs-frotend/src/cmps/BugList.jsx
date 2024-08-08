
import { Link } from 'react-router-dom'
import { BugPreview } from './BugPreview'
import { useState } from 'react'

export function BugList({ bugs, onRemoveBug, onEditBug, loggedinUser }) {


  function isAllowed(bug){
    return loggedinUser && (loggedinUser.isAdmin || bug?.creator?._id === loggedinUser?._id)
  }

  if (!bugs) return <div>loading...</div>
  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          {isAllowed(bug) &&
          <div>
            <button
              onClick={() => {
                onRemoveBug(bug._id)
              }}
            >
              x
            </button>
            <button
              onClick={() => {
                onEditBug(bug)
              }}
            >
              Edit
            </button>
          </div>}
          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  )
}
