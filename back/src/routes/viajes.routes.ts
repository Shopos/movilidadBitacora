import { Router } from "express"
import { addViajeInicio, getViajes, getViajeIdUsuario,parcheInicio,parcheFin, getViajeProceso , getViajeIdUsuarioEspera,editarViaje, uploadImagenInicio, uploadImagenFin, uploadImagenComprobante } from "../controllers/viajes.controller"
import { autenticarJWT, verifyAdmin } from "../middleware/auth.middleware"

const router = Router()

//Obtiene todos los viajes
router.get('/',getViajes)

//Obtiene el viaje en proceso del usuario
router.get('/search/:id', getViajeProceso)
//Obtiene los viajes del usuario
router.get('/id/:id',getViajeIdUsuario)
//Obtiene el viaje en espera del usuario
router.get('/:id',getViajeIdUsuarioEspera)


//Agrega un viaje inicialmente
router.post('/', addViajeInicio)

//Agrega(edita) la informacion de un viaje 
//router.put('/:patente', addViajeFin)

//Edita los elementos necesarios para dar partida a un viaje {id}
router.patch('/inicio/:id', parcheInicio)
//Edita los elementos necesarios para finalizar un viaje {id}
router.patch('/fin/:id', parcheFin)

router.patch('/:id/foto-inicio',autenticarJWT,...uploadImagenInicio)
router.patch('/:id/foto-fin',autenticarJWT,...uploadImagenFin)
router.patch('/:id/foto-comprobante',autenticarJWT,...uploadImagenComprobante)

router.put('/:id',autenticarJWT,verifyAdmin,editarViaje)



export default router