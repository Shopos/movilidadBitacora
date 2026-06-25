import { Router } from "express"
import { addViajeInicio, getViajes, addViajeFin } from "../controllers/viajes.controller"

const router = Router()

router.get('/',getViajes)

router.post('/', addViajeInicio)

router.put('/:patente', addViajeFin)

export default router