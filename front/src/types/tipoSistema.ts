export type Vehiculo={
    patente:string,
    modelo:string,
    kms_actual:number,
    estado:"DISPONIBLE"|"EN REPARACION"|"EN RUTA"|"DADO DE BAJA"
    tipo_vehiculo:"Automóvil"|"Motocicleta"|"Bus"|"Camioneta"|"Furgón"|"Camión"|"Maquinaria"
    licencia_min:string
}
export type User={
    id_usuario:number,
    correo:string,
    pass:string,
    tipo_licencia:string,
    nombre:string,
    cargo:string,
    estado:boolean,
    estado_viaje_usuario:"Disponible"|"Asignado"|"En ruta",
    lista_licencia:string[],
    licencias_concat:string
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
    imagen_tablero_ida:string,
    imagen_tablero_vuelta:string,
    imagen_comprobante_ben:string
    hora_recomendada:string|null
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

export type Solicitud={
    id_solicitud:number,
    id_usuario:Number,
    correo:string,
    nombre:string,
    fecha_solicitada:string,
    estado:string,
    resuelta_por:string,
    fecha_resuelta:string
}

export type SolicitudInicio={
    id_solicitante:number,
    motivo:string,
    vehiculo_solicitado:string,
    solicitante:string
}

export type SolicitudViaje={
    id_solicitud:number,
    id_solicitante:number,
    motivo:string,
    vehiculo_solicitado:string,
    solicitante:string,
    fecha_solicitada:string,
    fecha_resuelta:string,
    resuelta_por:string,
    estado:"resuelta"|"rechazada"|"pendiente",
    estado_texto:string
}   