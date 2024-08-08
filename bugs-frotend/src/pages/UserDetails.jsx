
import { useState } from 'react'
import { userService } from '../services/users/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bugService } from '../services/bugs/bug.service.js'

let emptyFilter ={
    severity: 0,
    title: "",
    labels: '',
    sortBy: {
      by: 'severity',
      dir: 1
    },
    pageIdx: 0
  }

export function UserDetails() {

    const [user, setUser] = useState(null)
    const { userId } = useParams()
    const [bugs2 ,setBugs2] = useState()
    const [userBugs ,setUserBugs] = useState([])

    useEffect(() => {
        Init()
    }, [])

    async function loadUser() {
        try {
            const user = await userService.getById(userId)
            console.log(user)
            setUser(user)
        } catch (err) {
            showErrorMsg('Cannot load user')

        }
    }

    async function loadBugs(){
        
        console.log(bugs)
        setBugs(bugs)
    }

    async function getUserBugs(){
        let bugs = await bugService.query(emptyFilter)
        console.log("50",bugs)
        bugs.filter((bug => bug.creator._id !== user._id))
        console.log("bugs to display", bugs)
    }

    async function Init(){
        await loadUser()
        await getUserBugs()
    }

    if (!user) return <h1>loadings....</h1>
    return <div className="user-details container">
        <h3>User Details</h3>
        <h4>{user.username}</h4>
        <p>score <span>{user.score}</span></p>
        <p>Full Name: <span>{user.fullname}</span></p>
        <p>Password: <span>{user.password}</span></p>
        <Link to="/user">Back to List</Link>
    </div>

}

