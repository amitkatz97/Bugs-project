import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"

import img from '../assets/img/logo.png'
import { LoginSignup } from '../cmps/LoginSignUp.jsx'
import { userService } from "../services/users/user.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"


export function Home() {

  const navigate = useNavigate()
  
  const [loggedinUser , setLoggedinUser] = useState(userService.getLoggedinUser())

  // async function AAA(){
  //   const user = userService.getLoggedinUser()
  // }

  async function onLogin(credentials){
      const user = await userService.login(credentials)
      setLoggedinUser(user)
      navigate("/")
  }

  async function onSignup(credentials){
    const newUser = await userService.signup(credentials)
    setLoggedinUser(newUser)
    showSuccessMsg(`Welcome ${newUser.fullname}`)
    navigate("/")
  }

  async function onLogout(){
      await userService.logout()
      console.log(loggedinUser)
      setLoggedinUser(null)
      navigate("/")
  }

  return (
    <section className='home'>
      <section className='login-logout'>
         {!loggedinUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}
                    {loggedinUser && <div className="user-preview">
                        <h3>Hello {loggedinUser.fullname}</h3>
                        <button onClick={onLogout}>Logout</button>
      </div>}
      <h2>Home is Home</h2>
      <img src={img} />
    </section>
  </section>

  )
}
