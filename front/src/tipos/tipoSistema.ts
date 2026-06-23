export type Vehiculo={
    patente:string,
    modelo:string,
    kms_actual:number,
    estado:"DISPONIBLE"|"EN REPARACION"|"EN RUTA"|"DADO DE BAJA"
}
export type User={
    correo:string,
    pass:string,
    tipo_licencia:string,
    nombre:string,
    cargo:string,
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

export type mantencionProp={
    patenteBuscada:string
}

export type Mantencion = {
    id_mantencion:number,
    ultimo_cambio_aceite:string,
    taller:string,
    ultima_mantencion:string,
    detalle_mantencion:string,
    patente:string
}