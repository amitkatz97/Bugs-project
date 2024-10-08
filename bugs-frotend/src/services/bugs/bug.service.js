import Axios from "axios"
import { showErrorMsg } from "../event-bus.service"
const axios = Axios.create({
    withCredentials: true
})
// const BASE_URL= "http://localhost:3030/api/bug"

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/bug' :
    '//localhost:3030/api/bug'


export const bugService = {
    query,
    getById,
    save,
    remove,
    update,
    pdfDownload,
    getDefaultSort,
}


async function query(filterBy ={}) {
    console.log('remote')
    console.log(filterBy)
    try {
        const {data : bugs} = await axios.get(BASE_URL, {params: filterBy})
        // this filter below has removed to server side:
        // let bugsToDisplay = bugs.filter(bug => bug.severity >= filterBy.severity && bug.title.includes(filterBy.title))
        return bugs
    } catch (err) {
        console.log('erorr with getting bugs', err)
    }
    
}
async function getById(bugId) {
    const url = BASE_URL + '/' + bugId
    try {
        let {data : bug} = await axios.get(url)
        return bug
    } catch (err) {
        console.log("cant find bug with id:", bugId, err)
        throw err
    }
    
}
async function remove(bugId) {
        const url = BASE_URL + '/' + bugId
        let {data : bug} = await axios.delete(url)
        console.log(bug)
        return bug
}


async function save(bug) {
    try {
        console.log(bug)
        const {data : bugToSave} = await axios.post(BASE_URL, bug)
        return bugToSave
    } catch (err) {
        console.log("cant save bug", err)
        throw err
    }
}

async function update(bug){
    try {
        console.log(bug)
        const {data : bugToSave} = await axios.put(BASE_URL, bug)
        return bugToSave
    } catch (err) {
        console.log("cant save bug", err)
        throw err
    }
}

async function pdfDownload(){
    try {
        let file = await axios.get(BASE_URL+"/download-pdf")
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