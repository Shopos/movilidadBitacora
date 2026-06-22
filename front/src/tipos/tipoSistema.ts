export type Vehiculo={
    patente:string,
    modelo:string,
    kms_actual:number,
    estado:"DISPONIBLE"|"EN REPARACION"|"EN RUTA"|"DADO DE BAJA"
}
export type User={
    cargo:"Funcionario"|"Administrador"
    nombre:string,
    email:string,
    estado:boolean
}
export type navBarProps={
    type:number;
    texto:string;
}

export type Viaje = {
    id_viaje:number,
    fecha:string,
    vehiculo:string,
    patente:string,
    kms_inicio:number,
    fecha_hora_inicio:string,
    lat_inicio:number,
    lng_inicio:number,
    kms_fin:number,
    fecha_hora_fin:string,
    destino:string,
    lat_fin:number,
    lng_fin:number,
    motivo:string,
    obs_viaje:string,
    carga_combustible:boolean,
    cantidad_combustible:number,
    nombre_funcionario:string,
    estado_viaje:boolean
}