import { Link, useSearchParams } from "react-router-dom"
import { UserPreview } from "./UserPreview.jsx"


export function UserList({users}){
    return(
        <ul className="user-list">
        {users.map((user) => (
          <li className="user-preview" key={user._id}>
            <UserPreview user={user} />
            <div>
              <button
                // onClick={() => {
                //   onRemoveuser(user._id)
                // }}
              >
                x
              </button>
              <button
                // onClick={() => {
                //   onEdituser(user)
                // }}
              >
                Edit
              </button>
            </div>
            <Link to={`/user/${user._id}`}>Details</Link>
          </li>
        ))}
      </ul>
    )
}