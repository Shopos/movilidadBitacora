import { Router } from "express"
import { getViajes } from "../controllers/viajes.controller"

const router = Router()

router.get('/',getViajes)

export default router