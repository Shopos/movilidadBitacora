import { Router } from "express"
import { addViajeInicio, getViajes, addViajeFin, getViajeIdUsuario } from "../controllers/viajes.controller"

const router = Router()

//Obtiene todos los viajes
router.get('/',getViajes)

router.get('/:id',getViajeIdUsuario)
//Agrega un viaje inicialmente
router.post('/', addViajeInicio)

//Agrega(edita) la informacion de un viaje 
router.put('/:patente', addViajeFin)

export default router