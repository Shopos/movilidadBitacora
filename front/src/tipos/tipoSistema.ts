export type Vehiculo={
    patente:string,
    modelo:string,
    kms_actual:number,
    estado:"DISPONIBLE"|"EN REPARACION"|"EN RUTA"|"DADO DE BAJA"
}
export type User={
    id_usuario:number,
    correo:string,
    pass:string,
    tipo_licencia:string,
    nombre:string,
    cargo:string,
    estado:boolean,
    estado_viaje_usuario:"Disponible"|"Asignado"|"En ruta"
}
export type navBarProps={
    type:number;
    texto:string;
}

export type Viaje = {
    id_viaje:number,
    vehiculo:string, 
    id_usuario:number,
    patente:string, 
    kms_inicial:number, 
    fecha_hora_inicio:string, //separar fecha y hora al pedir datos
    lat_inicio:number,
    lng_inicio:number,
    kms_fin:number,
    fecha_hora_fin:string, //separar fecha y hora al pedir datos
    destino:string, 
    lat_fin:number,
    lng_fin:number,
    lat_fin_real:number,
    lng_fin_real:number,
    motivo:string,
    obs_viaje:string,
    carga_combustible:boolean,
    cantidad_carga:number,
    nombre_funcionario:string, //
    estado_viaje:"En espera"|"En proceso"|"Terminado",
    ultima_modificacion:string,
    modificado_por:string,
    modo:string
}

export type ViajeInputFin = {
    fecha_hora_fin:string,
    //lat_fin_real:number,
    //lng_fin_real:number,
    obs_viaje:string,
    carga_combustible:boolean,
    cantidad_combustible:number,
    ultima_modificacion:string,
    modificado_por: string
    kms_fin:number,
    estado_viaje:"En espera"|"En proceso"|"Terminado"
}

export type ViajeInputInicio = {
    fecha_hora_inicio:string,
    modificado_por:string,
    ultima_modificacion:string
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