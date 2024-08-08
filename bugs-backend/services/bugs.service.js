// import { now } from "lodash";
import { loggerService } from "./logger.service.js";
import { makeId, readJsonFile } from "./util.service.js";


import fs from "fs";

// const bugs = readJsonFile("./data/data.json")

// export const BugsService = {
//     query,
//     getById,
//     save,
//     remove
// }

// async function query(filterBy){
//     try {
//         // const bugsToDisplay = bugs
//         let bugsToDisplay = bugs.filter(bug => bug.severity >= filterBy.severity && bug.title.includes(filterBy.title))
//         return bugsToDisplay
//     } catch (err) {
//         loggerService.error("Couldnt ger bugs", err)
//     }
    
// }

// async function getById(bugId){
//     try {
//         const bug = bugs.find(bug => bug._id === bugId)
//         // if(!bug) throw `Couldnt find bug with Id ${bugId}`
//         return bug
//     } catch (err) {
//         loggerService.error(`Couldnt find bug with Id ${bugId}`, err)
//     }
// }

// async function save(bugToSave){
//     let currnetDate = new Date()
//     console.log(bugToSave)
//     try {
//         if (bugToSave._id){
//             const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
//             let bugCreationDate = bugs[idx].createAt  
//             bugs[idx] = bugToSave
//             bugToSave.createAt = bugCreationDate
//             bugToSave.updateTime = currnetDate
//         } else {
//             bugToSave._id = makeId()
//             bugToSave.createAt = currnetDate
//             bugs.push(bugToSave)
//         }
//         await _saveBugsToFile()
//         return bugToSave
//     } catch (err) {
//         loggerService.error('err', err) 
//        throw err
//     }

// }

// async function remove(bugId){
//     try {
//         const bugIdx = bugs.findIndex(bug => bug._id ===bugId)
//         if (bugIdx === -1) throw `Couldn't remove bug with _id ${bugId}`
//         bugs.splice(bugIdx, 1)
//         _saveBugsToFile()
//     } catch (err) {
//         loggerService.error("Couldn't remove bug with", err)
//         throw err
//     }
// }

// function _saveBugsToFile(path = './data/data.json') {
//     return new Promise((resolve, reject) => {
//         const data = JSON.stringify(bugs, null, 4)
//         fs.writeFile(path, data, (err) => {
//             if (err) return reject(err)
//             resolve()
//         })
//     })
// }