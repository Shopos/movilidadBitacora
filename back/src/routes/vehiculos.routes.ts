import { Router } from "express"
import { getVehiculos, getVehiculoPatente, editarVehiculo, agregarVehiculo} from '../controllers/vehiculos.controller'
import { autenticarJWT, verifyAdmin } from "../middleware/auth.middleware"


const router = Router()
/*Obtener todos los vehiculos*/
router.get('/',getVehiculos)
/*Obtener un vehiculo */
router.get('/:patente',getVehiculoPatente)



/*Agregar vehiculo */
router.post('/',autenticarJWT,verifyAdmin,agregarVehiculo)
/*Edita un vehiculo */
router.put('/:patente',autenticarJWT,verifyAdmin,editarVehiculo)

export default router