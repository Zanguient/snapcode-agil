ALTER TABLE inv_detalle_movimiento ADD inventario int;
ALTER TABLE inv_detalle_movimiento ADD CONSTRAINT fk_detmov_inventario_id FOREIGN KEY (inventario) REFERENCES inv_inventario(id);
ALTER TABLE inv_detalle_compra ADD inventario int;
ALTER TABLE inv_detalle_compra ADD CONSTRAINT fk_detcom_inventario_id FOREIGN KEY (inventario) REFERENCES inv_inventario(id);
ALTER TABLE inv_detalle_venta ADD inventario int;
ALTER TABLE inv_detalle_venta ADD CONSTRAINT fk_detven_inventario_id FOREIGN KEY (inventario) REFERENCES inv_inventario(id);

ALTER TABLE inv_venta ADD almacen_traspaso int;
ALTER TABLE inv_venta ADD CONSTRAINT fk_venta_almacentraspaso_id FOREIGN KEY (almacen_traspaso) REFERENCES agil_almacen(id);