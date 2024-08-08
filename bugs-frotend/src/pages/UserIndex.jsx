import { userService } from "../services/users/user.service.js"
import { UserList } from "../cmps/UserList.jsx"
import { useState ,useRef } from 'react'
import { useEffect } from 'react'
import { utilService } from "../services/util.service.js"
import { Link, useSearchParams } from "react-router-dom"
import _, { filter, sortBy } from 'lodash'

export function UserIndex(){
    const [users, setUsers] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState()

  useEffect(() => {
    loadUsers()
    setSearchParams(utilService.getOnlyExistingValues(filterBy))
  }, [filterBy])

//   const onSetFilterByRef = useRef(_.debounce(_onSetFilterBy, 500))

  async function loadUsers() {
    const users = await userService.query(filterBy)
    console.log(users)
    setUsers(users)
  }

  if (!users) return <div>Loading...</div>
  return (
    <div className="user-index">
        <UserList users={users}/>
    </div>
  )
}