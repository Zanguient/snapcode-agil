ALTER TABLE inv_detalle_venta ADD fecha_vencimiento DATETIME;
ALTER TABLE inv_detalle_venta ADD lote varchar(255);
ALTER TABLE inv_detalle_movimiento ADD fecha_vencimiento DATETIME;
ALTER TABLE inv_detalle_movimiento ADD lote varchar(255);