
import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { userService } from '../services/users/user.service.js'

export function AppHeader() {

    const params = useParams()

    const [loggendinUser, setLoggedinUser] = useState(userService.getLoggedinUser() ||"")

    function onUpdate(){
        setLoggedinUser(userService.getLoggedinUser)
    }
    return (
        <header className='app-header container'>
            
            <div className='header-container'>
                <nav className='app-nav' onClick={onUpdate}>
                    <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
                    <NavLink to="/about">About</NavLink>  | {loggendinUser?.isAdmin &&<NavLink to="/user">Users</NavLink>}
                </nav>
                <span> Hey {loggendinUser?.fullname}</span>
                <h1>Bugs are Forever</h1>
            </div>
        </header>
    )
}
