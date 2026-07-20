import { Router } from "express"
import { getVehiculos, getVehiculoPatente, editarVehiculo, agregarVehiculo} from '../controllers/vehiculos.controller'
import { autenticarJWT } from "../middleware/auth.middleware"


const router = Router()
/*Obtener todos los vehiculos*/
router.get('/',getVehiculos)
/*Obtener un vehiculo */
router.get('/:patente',getVehiculoPatente)



/*Agregar vehiculo */
router.post('/',autenticarJWT,agregarVehiculo)
/*Edita un vehiculo */
router.put('/:patente',autenticarJWT,editarVehiculo)

export default router