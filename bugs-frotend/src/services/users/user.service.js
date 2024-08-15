import Axios from "axios"
import { createRoutesFromChildren } from "react-router"
const axios = Axios.create({
    withCredentials: true
})

console.log(process.env.NODE_ENV)

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api' :
    '//localhost:3030/api'

const USER_URL= `${BASE_URL}/user`
const AUTH_URL = `${BASE_URL}/auth`
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'


export const userService = {
    query,
    getById,
    save,
    remove,
    pdfDownload,
    getDefaultSort,
    saveLocalUser,
    getLoggedinUser,
    getEmptyUser,
    login,
    signup,
    logout
}


async function query(filterBy ={}) {
    console.log('remote')
    console.log(filterBy)
    try {
        const {data : users} = await axios.get(USER_URL, {params: filterBy})
        // this filter below has removed to server side:
        // let usersToDisplay = users.filter(user => user.severity >= filterBy.severity && user.title.includes(filterBy.title))
        return users
    } catch (err) {
        console.log('erorr with getting users', err)
    }
    
}
async function getById(userId) {
    const url = USER_URL + '/' + userId
    try {
        let {data : user} = await axios.get(url)
        return user
    } catch (err) {
        console.log("cant find user with id:", userId, err)
        throw err
    }
    
}
async function remove(userId) {
    const url = USER_URL + '/' + userId
    let {data : user} = await axios.delete(url)
    return console.log("user deleted")
}


async function save(user) {
    try {
        console.log(user)
        const method = user._id ? 'put' : 'post'
        let {data : userToSave} = await axios.post(USER_URL, user)
        return userToSave
    } catch (err) {
        console.log("cant save user", err)
        throw err
    }
   
}

async function pdfDownload(){
    try {
        let file = await axios.get(USER_URL+"/download-pdf")
        console.log(file)
        return file
    } catch (err) {
        
    }
}

function getDefaultSort(){
    return{
        by : 'severity',
        dir: 1
    }
}

async function login(credentials){
    try {
        let {data : user} = await axios.post(AUTH_URL + '/login', credentials)
        saveLocalUser(user)
        return user
    } catch (err) {
        console.log("cant loggedin", err)
        throw err
    }
}

async function signup(credentials){
    try {
        let {data : user} = await axios.post(AUTH_URL + '/signup', credentials)
        saveLocalUser(user)
        return user
    } catch (err) {
        console.log("Cant sign up", err)
        throw err
    }
}

async function logout(){
    await axios.post(AUTH_URL + '/logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function saveLocalUser(user){
    user ={ _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
    }
}
