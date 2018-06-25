ALTER TABLE agil_empresa add usar_estado_resultados_no_contables  tinyint(1) default 1;
ALTER TABLE inv_detalle_compra add servicio  int(11);
ALTER TABLE inv_compra add sucursal  int(11);
ALTER TABLE inv_compra add tipo_movimiento  int(11);


