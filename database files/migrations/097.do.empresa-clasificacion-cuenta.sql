ALTER TABLE agil_contabilidad_clasificacion_cuenta add empresa int(11);
ALTER TABLE agil_contabilidad_cuenta add cuenta_activo tinyint default 0;
ALTER TABLE sys_usuario add autorizacion_caja_chica tinyint default 0;
