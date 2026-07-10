import { Router } from "express"
import { addViajeInicio, getViajes, getViajeIdUsuario,parcheInicio,parcheFin, getViajeProceso , getViajeIdUsuarioEspera,editarViaje, uploadImagenInicio, uploadImagenFin, uploadImagenComprobante,deleteViajeEspera } from "../controllers/viajes.controller"
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

//Edita los elementos necesarios para dar partida a un viaje {id}
router.patch('/inicio/:id', parcheInicio)
//Edita los elementos necesarios para finalizar un viaje {id}
router.patch('/fin/:id', parcheFin)

//Agrega la foto de tablero al inicio de un viaje
router.patch('/:id/foto-inicio',autenticarJWT,...uploadImagenInicio)
//Agrega la foto de tablero al final de un viaje
router.patch('/:id/foto-fin',autenticarJWT,...uploadImagenFin)
//Agrega la foto de comprobante carga combustible al final de un viaje
router.patch('/:id/foto-comprobante',autenticarJWT,...uploadImagenComprobante)
//Edita la informacion de un viaje {id}
router.put('/:id',autenticarJWT,verifyAdmin,editarViaje)
//Elimina un viaje en espera
router.delete('/:id',autenticarJWT,verifyAdmin, deleteViajeEspera)

export default router