import { bugService } from '../services/bugs/index.js'
import { utilService } from '../services/util.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import _, { filter, sortBy } from 'lodash'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { useState ,useRef } from 'react'
import { useEffect } from 'react'
import { Link, useSearchParams } from "react-router-dom"
import { BugSort } from '../cmps/BugSort.jsx'
import { BugPagination } from '../cmps/BugPagination.jsx'
import { userService } from '../services/users/user.service.js'

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
export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterBy, setFilterBy] = useState(emptyFilter)
  const [sortBy, setSortBy]= useState(emptyFilter.sortBy)
  const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser)

  useEffect(() => {
    loadBugs()
    console.log("loggenin user from bugindex:", loggedinUser)
    setSearchParams(utilService.getOnlyExistingValues(filterBy))
  }, [filterBy])

  const onSetFilterByRef = useRef(_.debounce(_onSetFilterBy, 500))

  async function loadBugs() {
    const bugs = await bugService.query(filterBy)
    setBugs(bugs)
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log('Deleted Succesfully!')
      setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
      showSuccessMsg('Bug removed')
    } catch (err) {
      const {data} = err
      console.log('Error from onRemoveBug ->',err)
      showErrorMsg('Cannot remove bug')
    }
  }

  async function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      severity: +prompt('Bug severity?'),
      description: prompt('Bug description?'),
      creator : userService.getLoggedinUser()
    }
    try {
      const savedBug = await bugService.save(bug)
      console.log('Added Bug', savedBug)
      setBugs(prevBugs => [...prevBugs, savedBug])
      showSuccessMsg('Bug added')
    } catch (err) {
      console.log('Error from onAddBug ->', err)
      showErrorMsg('Cannot add bug')
    }
  }

  async function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const description = prompt ('New description?')
    const bugToSave = { ...bug, severity , description}
    console.log("edit bug:" ,bug)
    try {

      const savedBug = await bugService.save(bugToSave)
      console.log('Updated Bug:', savedBug)
      setBugs(prevBugs => prevBugs.map((currBug) =>
        currBug._id === savedBug._id ? savedBug : currBug
      ))
      showSuccessMsg('Bug updated')
    } catch (err) {
      console.log('Error from onEditBug ->', err)
      showErrorMsg('Cannot update bug')
    }
  }

 function _onSetFilterBy(filterByToEdit){
    setFilterBy(filterByToEdit)
  }

  async function onDownload(){
    await bugService.pdfDownload()
  }

  return (
    <main className="bug-index">
      <h3>Bugs App</h3>
      <main>
        <BugPagination filterBy={filterBy} onSetFilterBy={onSetFilterByRef.current}/>
        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterByRef.current}/>
        <BugSort filterBy={filterBy} onSetFilterBy={onSetFilterByRef.current}/>
        {loggedinUser &&  <button className='add-btn' onClick={onAddBug}>Add Bug ⛐</button>}
        <button onClick={onDownload}>Dowload as pdf</button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} loggedinUser= {loggedinUser}/>
      </main>
    </main>
  )
}
