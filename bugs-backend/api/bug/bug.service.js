// import { now } from "lodash";
import { loggerService } from "../../services/logger.service.js";
import { makeId, readJsonFile } from "../../services/util.service.js";
import { ObjectId } from "mongodb";
import { asyncLocalStorage } from '../../services/als.service.js'


import fs from "fs";
import { dbService } from "../../services/db.service.js";

const bugs = readJsonFile("data/data.json")
const PAGE_SIZE = 8

export const BugService = {
    query,
    getById,
    // save,
    remove,
    queryFromDb,
    add,
    update
}

async function query(filterBy){
    const {pageIdx ,sortBy, ...rest} = filterBy
    // console.log(filterBy)
    try {
        // const bugsToDisplay = bugs
        let bugsToDisplay = bugs.filter(bug => bug.severity >= filterBy.severity && bug.title.includes(filterBy.title))

        if (filterBy.labels){
            const filterChars = new Set(filterBy.labels)
            bugsToDisplay = bugsToDisplay.filter(bug => bug.labels.some(label =>
                [...filterChars].every(char=> 
                    label.includes(char))))
        }
        _sortBugs(bugsToDisplay, sortBy)
        if(pageIdx){
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            bugsToDisplay =bugsToDisplay.slice(startIdx, startIdx +PAGE_SIZE)
        }

        _sortBugs(bugsToDisplay, sortBy)
        return bugsToDisplay
    } catch (err) {
        loggerService.error("Couldnt get bugs", err)
    }
}

async function queryFromDb(filterBy= {}){
    const criteria = _buildCriteria(filterBy)
    const sort = _buildSort(filterBy)
    const collection = await dbService.getCollection('bugs')
    var bugCursor = await collection.find(criteria, {sort} )
    const bugs = await bugCursor.toArray()
    return bugs
}

async function getById(bugId){
    try {
        const criteria = {_id: ObjectId.createFromHexString(bugId)}

        const collection = await dbService.getCollection('bugs')
        const bug = await collection.findOne(criteria)
        
        // if(!bug) throw `Couldnt find bug with Id ${bugId}`
        return bug
    } catch (err) {
        loggerService.error(`Couldnt find bug with Id ${bugId}`, err)
    }
}

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

async function add(bug){
    try {
        const collection = await dbService.getCollection('bugs')
		await collection.insertOne(bug)

        return bug
    } catch (err) {
        loggerService.error('cannot insert bug', err)
		throw err
    }
}

async function update(bug){
    let currnetDate = new Date()
    const bugToSave = {severity : bug.severity, updateTime : currnetDate }

    try {
        const criteria = { _id: ObjectId.createFromHexString(bug._id) }

        const collection = await dbService.getCollection('bugs')
		await collection.updateOne(criteria, {$set: bugToSave})

        return bug
    } catch (err) {
        loggerService.error("Cannot update bug with id", bug._id)
        throw err
    }
}

// async function remove(bugId, loggedinUser){
//     try {
//         const bug = bugs.find(bug=> bug._id ===bugId)
//         if(bug.creator._id !== loggedinUser._id && !loggedinUser.isAdmin) throw 'not allowed to delete this bug'

//         const bugIdx = bugs.findIndex(bug => bug._id ===bugId)
//         if (bugIdx === -1) throw `Couldn't remove bug with _id ${bugId}`
//         console.log("bug index:", bugIdx)
//         bugs.splice(bugIdx, 1)
//         _saveBugsToFile()
//     } catch (err) {
//         loggerService.error("Couldn't remove bug with", err)
//         throw err
//     }
// }

async function remove(bugId, loggedinUser){
    try {
        const criteria ={_id: ObjectId.createFromHexString(bugId)}
        if(!loggedinUser.isAdmin) criteria['owner._id'] = loggedinUser._id

        const collection =await dbService.getCollection('bugs')
        const res = await collection.deleteOne(criteria)

        if(res.deletedCount === 0) throw ("Not allowed to deleted this bug")
            loggerService.warn(`bug with id ${bugId} id deleted`)
        return bugId
    } catch (err) {
        loggerService.error("Couldn't remove bug with id:", bugId ,err)
        throw err
    }
}

function _saveBugsToFile(path = './data/data.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function getDefaultSort(){
    return{
        by : 'severity',
        dir: 1
    }
}

function _sortBugs(bugs, sortBy){
    if (sortBy.by === 'severity'){
        bugs.sort((bug1, bug2) => (bug1.severity - bug2.severity) * sortBy.dir)
    } else if (sortBy.by ==='createAt'){
        bugs.sort((bug1, bug2) => (bug1.createAt - bug2.createAt) * sortBy.dir)
    } else if (sortBy.by ==='title'){
        bugs.sort((bug1, bug2) => (bug1.title - bug2.title) * sortBy.dir)
    }
}

function _buildCriteria(filterBy){
    const criteria ={ 
        title: {$regex: filterBy.title },
        severity: {$gte: filterBy.severity},
        labels: {$regex: filterBy.labels}
    }
    return criteria
}

function _buildSort({sortBy}){
    if (!sortBy) return {}
    return { [sortBy.by]: sortBy.dir}
}