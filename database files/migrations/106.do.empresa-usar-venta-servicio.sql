ALTER TABLE agil_empresa add usar_venta_servicio tinyint default 0;
ALTER TABLE inv_venta add observacion varchar(255);
ALTER TABLE inv_venta add sucursal int(11);
ALTER TABLE inv_venta add tipo_movimiento int(11);
ALTER TABLE agil_dosificacion add tipo_dosificacion tinyint default 0;
ALTER TABLE inv_detalle_venta add servicio int(11);