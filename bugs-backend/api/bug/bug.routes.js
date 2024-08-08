import express from 'express'
import { addBug, getBugs, getBug, deleteBug, updateBug} from './bug.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.js'


const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId',requireAuth, getBug)
router.delete('/:bugId',requireAuth, deleteBug)
router.post('/', requireAuth, addBug)
router.put('/',updateBug)

export const bugRoutes = router