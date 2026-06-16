export type Vehiculo = {
    patente: string;
    modelo: string;
    KMS_actual: number;
    estado: "Activo"| "Disponible"|"En reparación"|"Dado de baja"
}
export type User = {
    email:string,
    nombre:string,
    cargo:string,
    estado:boolean
}