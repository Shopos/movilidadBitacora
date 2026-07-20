DELIMITER $$
-- ==========USUARIOS===========
CREATE TRIGGER trg_usuarios_insert 
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (
        tabla_afectada, 
        id_registro, 
        accion, 
        cambiado_por, 
        valor_new
    )
    VALUES (
        'usuarios',
        NEW.id_usuario,
        'INSERT',
        COALESCE(@usuario_actual, 'CONSOLA'),
        JSON_OBJECT(
            'correo', NEW.correo,
            'nombre', NEW.nombre,
            'cargo', NEW.cargo,
            'estado', NEW.estado,
            'tipo_licencia', NEW.tipo_licencia
        )
    );
END$$

CREATE TRIGGER trg_usuarios_update
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN 
	INSERT INTO auditoria(
    tabla_afectada,
    id_registro,
    accion,
    cambiado_por,
    valor_old,
    valor_new
    )
    VALUES(
		'usuarios',
        NEW.id_usuario,
        'UPDATE',
        COALESCE(@usuario_actual,'CONSOLA'),
        JSON_OBJECT(
		'correo',OLD.correo,
        'nombre',OLD.nombre,
        'cargo',OLD.cargo,
        'estado',OLD.estado,
        'tipo_licencia',OLD.tipo_licencia),
        JSON_OBJECT(
        'correo',NEW.correo,
        'nombre',NEW.nombre,
        'cargo',NEW.cargo,
        'estado',NEW.estado,
        'tipo_licencia',NEW.tipo_licencia
        )
    );
END$$

CREATE TRIGGER trg_usuarios_delete
AFTER DELETE ON usuarios
FOR EACH ROW
BEGIN
 INSERT INTO auditoria(
 tabla_afectada,
 id_registro,
 accion,
 cambiado_por,
 valor_old)
 VALUES(
	'usuarios',
    OLD.id_usuario,
    'DELETE',
    COALESCE(@usuario_actual,'CONSOLA'),
    JSON_OBJECT(
    'correo',OLD.correo,
        'nombre',OLD.nombre,
        'cargo',OLD.cargo,
        'estado',OLD.estado,
        'tipo_licencia',OLD.tipo_licencia)
    );
 END $$
 
-- =========VEHICULOS===========
CREATE TRIGGER trg_vehiculos_insert
AFTER INSERT ON vehiculos
FOR EACH ROW
BEGIN
INSERT INTO auditoria(
	tabla_afectada,id_registro,accion,cambiado_por,valor_new)
    VALUES(
		'vehiculos',
        NEW.patente,
        'INSERT',
        COALESCE(@usuario_actual,'CONSOLA'),
        JSON_OBJECT(
        'patente',NEW.patente,
        'modelo',NEW.modelo,
        'kms_actual',NEW.kms_actual,
        'estado',NEW.estado,
        'tipo_vehiculo',NEW.tipo_vehiculo,
        'licencia_min',NEW.licencia_min
        )
    );
END$$

CREATE TRIGGER trg_vehiculos_update
AFTER UPDATE ON vehiculos
FOR EACH ROW
BEGIN
INSERT INTO auditoria(
tabla_afectada,id_registro,accion,cambiada_por,valor_old,valor_new
)VALUES(
	'vehiculos',
	NEW.patente,
    'UPDATE',
    COALESCE(@usuario_actual,'CONSOLA'),
    JSON_OBJECT(
    'modelo',OLD.modelo,
    'kms_actual',OLD.kms_actual,
    'estado',OLD.estado),
    JSON_OBJECT(
    'modelo',NEW.modelo,
    'kms_actual',NEW.kms_actual,
    'estado',NEW.estado
)
);
END$$
CREATE TRIGGER trg_vehiculos_delete
AFTER DELETE ON vehiculos
FOR EACH ROW 
BEGIN
INSERT INTO auditoria(
tabla_afectada,id_registro,accion,cambiada_por,valor_old)
VALUES(
	'vehiculos',
    OLD.patente,
    'DELETE',
    COALESCE(@usuario_actual,'CONSOLA'),
    JSON_OBJECT(
    'modelo',OLD.modelo,
    'kms_actual',OLD.kms_actual,
    'estado',OLD.estado
)
);
END$$


-- ======BITACORAS==========
CREATE TRIGGER trg_bitacoras_insert
AFTER INSERT ON viajes
FOR EACH ROW
BEGIN
INSERT INTO auditoria(tabla_afectada,id_registro,accion,cambiado_por,valor_new)
VALUES(
'viajes',NEW.id_viaje,'INSERT',COALESCE(@usuario_actual,'CONSOLA'),
JSON_OBJECT(
	'patente',NEW.patente,'id_usuario',NEW.id_usuario,'destino',NEW.destino,'estado_viaje',NEW.estado_viaje,'modo',NEW.modo
));
END$$

CREATE TRIGGER trg_bitacoras_update
AFTER UPDATE ON viajes
FOR EACH ROW
BEGIN
INSERT INTO auditoria(tabla_afectada,id_registro,accion,cambiado_por,valor_old,valor_new)
VALUES(
	'viajes',NEW.id_viaje,'UPDATE',COALESCE(@usuario_actual,'CONSOLA'),
	JSON_OBJECT('estado',OLD.estado,'destino',OLD.destino,'kms_fin',OLD.kms_fin,'obs_viaje',OLD.obs_viaje,'fecha_hora_fin',OLD.fecha_hora_fin),
    JSON_OBJECT('estado',NEW.estado,'destino',NEW.destino,'kms_fin',NEW.kms_fin,'obs_viaje',NEW.obs_viaje,'fecha_hora_fin',NEW.fecha_hora_fin)
);
END$$

CREATE TRIGGER trg_bitacoras_delete
AFTER DELETE ON viajes
FOR EACH ROW
BEGIN
INSERT INTO auditoria(tabla_afectada,id_registro,accion,cambiado_por,valor_old)
VALUES(
	'viajes',OLD.id_viaje,'DELETE',COALESCE(@usuario_actual,'CONSOLA'),
    JSON_OBJECT('patente',OLD.patente,'id_usuario',OLD.id_usuario,'estado',OLD.estado)
);
END$$

-- ========SOLICITUDES===========
CREATE TRIGGER trg_solicitudes_insert
AFTER INSERT ON solicitudes_viaje
FOR EACH ROW
BEGIN
INSERT INTO auditoria(tabla_afectada,id_registro,accion,cambiado_por,valor_new)VALUES(
'solicitudes_viaje',NEW.id_solicitud,'INSERT',COALESCE(@usuario_actual,'CONSOLA'),JSON_OBJECT('solicitante',NEW.solicitante,'motivo',NEW.motivo,'estado',NEW.estado)
);
END$$

CREATE TRIGGER trg_solicitudes_update
AFTER UPDATE ON solicitudes_viaje
FOR EACH ROW
BEGIN
INSERT INTO auditoria(tabla_afectada,id_registro,accion,cambiado_por,valor_old,valor_new)
VALUES(
'solicitudes_viaje',
NEW.id_solicitud,
COALESCE(@usuario_actual,'CONSOLA'),
JSON_OBJECT('estado',OLD.estado,'resuelta_por',OLD.resuelta_por),
JSON_OBJECT('estado',NEW.estado,'resuelta_por',NEW.resuelta_por)
);
END$$

-- ========MANTENCIONES==========
CREATE TRIGGER trg_mantenciones_insert
AFTER INSERT ON mantenciones
FOR EACH ROW
BEGIN
INSERT INTO auditoria(tabla_afectada,id_registro,accion,cambiado_por,valor_new)
VALUES(
'mantenciones',
new.id_mantencion,
'INSERT',
COALESCE(@usuario_actual,'CONSOLA'),
JSON_OBJECT('patente',NEW.patente,'taller',NEW.taller,'ultima_mantencion',NEW.ultima_mantencion)
);
END$$

DELIMITER ;