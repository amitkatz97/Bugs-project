import { loggerService } from "../../services/logger.service.js";
import { makeId, readJsonFile } from "../../services/util.service.js";


import fs from "fs";

const users = readJsonFile("data/user.json")
const PAGE_SIZE = 3

export const userService = {
    query,
    getById,
    save,
    remove,
    getByUsername
}

async function query(filterBy){
    const {pageIdx ,sortBy, ...rest} = filterBy
    console.log(filterBy)
    try {
        let usersToDisplay = users//.filter(user => user.score >= filterBy.score)
        // _sortusers(usersToDisplay, sortBy)

        // if(pageIdx){
        //     const startIdx = filterBy.pageIdx * PAGE_SIZE
        //     usersToDisplay =usersToDisplay.slice(startIdx, startIdx +PAGE_SIZE)
        // }

        // _sortUsers(usersToDisplay, sortBy)
        return usersToDisplay
    } catch (err) {
        loggerService.error("Couldnt get users", err)
    }
    
}

async function getById(userId){
    try {
        const user = users.find(user => user._id === userId)
        // if(!user) throw `Couldnt find user with Id ${userId}`
        return user
    } catch (err) {
        loggerService.error(`Couldnt find user with Id ${userId}`, err)
    }
}

async function getByUsername(username){
    try {
        const user = users.find(user => user.username === username)
        // if(!user) throw `Couldnt find user with Id ${userId}`
        return user
    } catch (err) {
        loggerService.error(`Couldnt find user with username ${username}`, err)
    }
}

async function save(userToSave){
    console.log(userToSave)
    try {
        if (userToSave._id){
            const idx = users.findIndex(user => user._id === userToSave._id)  
            users[idx] = userToSave
            
        } else {
            userToSave._id = makeId()
            userToSave.isAdmin = false
            users.push(userToSave)
        }
        await _saveusersToFile()
        return userToSave
    } catch (err) {
        loggerService.error('Cannot save user:', err) 
       throw err
    }

}

async function remove(userId){
    try {
        const userIdx = users.findIndex(user => user._id ===userId)
        if (userIdx === -1) throw `Couldn't remove user with _id ${userId}`
        users.splice(userIdx, 1)
        _saveusersToFile()
    } catch (err) {
        loggerService.error("Couldn't remove user with", err)
        throw err
    }
}

function _saveusersToFile(path = './data/user.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function getDefaultSort(){
    return{
        by : 'score',
        dir: 1
    }
}

function _sortusers(users, sortBy){
    if (sortBy.by === 'score'){
        users.sort((user1, user2) => (user1.score - user2.score) * sortBy.dir)
    } else if (sortBy.by ==='username'){
        users.sort((user1, user2) => (user1.username - user2.username) * sortBy.dir)
    }
    
}