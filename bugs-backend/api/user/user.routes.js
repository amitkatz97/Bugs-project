import express from 'express'
import { addUser, getUsers, getUser, deleteUser, updateUser} from './user.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.js'


const router = express.Router()

router.get('/',getUsers )
router.get('/:userId', getUser)
router.delete('/:userId', requireAuth ,deleteUser)
router.post('/', requireAuth ,addUser )
router.put('/',updateUser)

export const userRoutes = router