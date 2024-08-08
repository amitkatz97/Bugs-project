

import { loggerService } from "../../services/logger.service.js";
import { userService } from "./user.service.js";

export async function getUsers(req, res){
    const {username, score} = req.query
    const filterBy = {username, score}
    try {
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        console.log('Couldent gat users', err)
        res.status(400).send("Couldnt get users")
    }
}

export async function addUser(req , res){
    const {fullname , username, _id, password, score} = req.body
    const userToSave ={fullname, username, _id, password, score }
    console.log("user to save:", userToSave)
    try {
        const saveduser = await userService.save(userToSave)
        res.send(userToSave)
        loggerService.info("saved succsfully" , userToSave)
    } catch (err) {
        console.log(`err:`, err)
        res.status(400).send(`Couldnt save user`)
    }
}

export async function updateUser(req , res){
    const {fullname , username, _id, password, score} = req.body
    const userToSave ={fullname, username, _id, password, score }
    console.log("user to save:", userToSave)
    try {
        const saveduser = await userService.save(userToSave)
        res.send(userToSave)
    } catch (err) {
        console.log(`err:`, err)
        res.status(400).send(`Couldnt save user`)
    }
}

export async function getUser(req , res) {
    const {userId } = req.params
    try {
        const user = await userService.getById(userId)
        userService.getByUsername(user.username)
        res.send(user)
    } catch (err) {
        console.log(`couldnt find user with id ${userId}`, err)
        res.status(401).send("user not find")
    }
}

export async function deleteUser(req , res){
    const { userId } = req.params
    try {
      await userService.remove(userId)
      res.send('user deleted')
    } catch (err) {
        console.log('err:', err)
        res.status(400).send(`Couldn't get user`)
    }
}