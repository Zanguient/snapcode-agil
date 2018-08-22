ALTER TABLE sys_usuario add encargado_rendicion_caja_chica tinyint default 0;
ALTER TABLE sys_usuario add encargado_verificacion_caja_chica tinyint default 0;
ALTER TABLE agil_solicitud_caja_chica add autorizador int(11);
ALTER TABLE agil_solicitud_caja_chica add verificador int(11);
