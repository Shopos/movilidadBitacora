import { Router } from "express"
import { getVehiculos, getVehiculoPatente, editarVehiculo, agregarVehiculo} from '../controllers/vehiculos.controller'


const router = Router()
/*Obtener todos los vehiculos*/
router.get('/',getVehiculos)
/*Obtener un vehiculo */
router.get('/:patente',getVehiculoPatente)



/*Agregar vehiculo */
router.post('/',agregarVehiculo)
/*Edita un vehiculo */
router.put('/:patente',editarVehiculo)

export default router