ALTER TABLE agil_empresa add usar_facturacion_masiva tinyint default 0;
ALTER TABLE inv_detalle_venta DROP FOREIGN KEY inv_detalle_venta_ibfk_3;
ALTER TABLE sys_usuario add usar_importacion_venta_servicio tinyint default 0;