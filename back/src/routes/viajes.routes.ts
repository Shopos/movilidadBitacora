import { Router } from "express"
import { addViajeInicio, getViajes, addViajeFin } from "../controllers/viajes.controller"

const router = Router()

//Obtiene todos los viajes
router.get('/',getViajes)

//Agrega un viaje inicialmente
router.post('/', addViajeInicio)

//Agrega(edita) la informacion de un viaje 
router.put('/:patente', addViajeFin)

export default router