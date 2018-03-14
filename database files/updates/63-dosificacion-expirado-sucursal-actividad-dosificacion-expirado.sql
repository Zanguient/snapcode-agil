UPDATE agil_dosificacion
SET agil_dosificacion.expirado = CASE WHEN agil_dosificacion.fecha_limite_emision > NOW() THEN FALSE ELSE TRUE END;