import { Router } from "express"
import { addViajeInicio, getViajes, getViajeIdUsuario,parcheInicio,parcheFin, getViajeProceso , getViajeIdUsuarioEspera } from "../controllers/viajes.controller"

const router = Router()

//Obtiene todos los viajes
router.get('/',getViajes)

router.get('/:id',getViajeIdUsuarioEspera)

router.get('/search/:id', getViajeProceso)

router.get('/id/:id',getViajeIdUsuario)


//Agrega un viaje inicialmente
router.post('/', addViajeInicio)

//Agrega(edita) la informacion de un viaje 
//router.put('/:patente', addViajeFin)

router.patch('/inicio/:id', parcheInicio)

router.patch('/fin/:id', parcheFin)

export default router