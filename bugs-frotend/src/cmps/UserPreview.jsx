import { Link, useSearchParams } from "react-router-dom"

export function UserPreview({user}){
    return(
        <article className="user-preview">
        <Link to={"/user/"+ user._id}><h4>{user.fullname}</h4></Link>
        <p>Score <span>{user.score}</span></p>
        </article>
    )
}