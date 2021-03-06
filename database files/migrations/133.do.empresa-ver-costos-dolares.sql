ALTER TABLE agil_empresa ADD ver_costos_dolares tinyint(1);
ALTER TABLE agil_producto ADD precio_unitario_dolares decimal(20, 4);
ALTER TABLE inv_compra ADD importe_dolares decimal(20, 4);
ALTER TABLE inv_compra ADD total_dolares decimal(20, 4);
ALTER TABLE inv_detalle_compra ADD costo_unitario_dolares decimal(20, 4);
ALTER TABLE inv_detalle_compra ADD importe_dolares decimal(20, 4);
ALTER TABLE inv_detalle_compra ADD total_dolares decimal(20, 4);
ALTER TABLE inv_inventario ADD costo_unitario_dolares decimal(20, 4);
ALTER TABLE inv_inventario ADD costo_total_dolares decimal(20, 4);
ALTER TABLE inv_detalle_movimiento ADD costo_unitario_dolares decimal(20, 4);
ALTER TABLE inv_detalle_movimiento ADD importe_dolares decimal(20, 4);
ALTER TABLE inv_detalle_movimiento ADD total_dolares decimal(20, 4);
ALTER TABLE inv_detalle_venta ADD precio_unitario_dolares decimal(20, 4);
ALTER TABLE inv_detalle_venta ADD importe_dolares decimal(20, 4);
ALTER TABLE inv_detalle_venta ADD total_dolares decimal(20, 4);
ALTER TABLE inv_venta ADD importe_dolares decimal(20, 4);
ALTER TABLE inv_venta ADD total_dolares decimal(20, 4);
ALTER TABLE agil_empresa ADD tipo_cambio_dolar decimal(20,4);