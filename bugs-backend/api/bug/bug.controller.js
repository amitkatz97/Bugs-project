

import { loggerService } from "../../services/logger.service.js";
import { BugService } from "./bug.service.js";

let visitedBug =[]

export async function getBugs(req, res){
    const {severity , title, labels, sortBy ,pageIdx} = req.query
    const filterBy = {severity : +severity, title: title, labels: labels, sortBy: sortBy, pageIdx : pageIdx}
    try {
        const bugs = await BugService.query(filterBy)
        res.send(bugs)
    } catch (error) {
        console.log('Couldent gat bugs', error)
        res.status(400).send("Couldnt get bugs")
    }
}

export async function addBug(req , res){
    const {title , severity, _id, description, creator} = req.body
    const bugToSave ={_id : _id , title : title, severity : severity, description: description ,labels : [], creator}
    console.log("bug to save:", bugToSave)
    try {
        const savedBug = await BugService.save(bugToSave)
        res.send(bugToSave)
        loggerService.info("saved succsfully" , bugToSave)
    } catch (err) {
        console.log(`err:`, err)
        res.status(400).send(`Couldnt save bug`)
    }
}

export async function updateBug(req , res){
    const {title , severity, _id, description} = req.body
    const bugToSave ={_id : _id , title : title, severity : severity, description: description}
    console.log("bug to save:", bugToSave)
    try {
        const savedBug = await BugService.save(bugToSave)
        res.send(bugToSave)
    } catch (err) {
        console.log(`err:`, err)
        res.status(400).send(`Couldnt save bug`)
    }
}

export async function getBug(req , res) {
    
    const {bugId} = req.params
    res.cookie('visitBug',visitedBug.length, { maxAge: 1000 * 50 })
    if(visitedBug.length > 3 && !visitedBug.includes(bugId) ){
        return res.status(403).send("need to sign up for review another bug")
    } 

    try {
        const bug = await BugService.getById(bugId)
        for(let i = 0; 5 > visitedBug.length +1 > i ; i++){ //try to not use for loop, only use if !visitBug.includ -- push
            if (!visitedBug.includes(bug._id)){
                visitedBug.push(bug._id)
            }
        }
        console.log("visited bugs:",visitedBug)
        res.send(bug)
    } catch (err) {
        console.log(`couldnt find bug with id ${req.params}`, err)
        res.status(401).send("Bug not find")
    }
}

export async function deleteBug(req , res){
    const { bugId } = req.params
    const {loggedinUser } =req 
    try {
      await BugService.remove(bugId ,loggedinUser)
      res.send('bug deleted')
    } catch (err) {
        console.log('err:', err)
        res.status(400).send(`Couldn't delete bug`)
    }
}