ALTER TABLE inv_venta ADD cierre_caja int;
ALTER TABLE inv_venta ADD CONSTRAINT fk_venta_cierre_id FOREIGN KEY (cierre_caja) REFERENCES agil_cierre_caja(id);
ALTER TABLE inv_compra ADD cierre_caja int;
ALTER TABLE inv_compra ADD CONSTRAINT fk_compra_cierre_id FOREIGN KEY (cierre_caja) REFERENCES agil_cierre_caja(id);
ALTER TABLE inv_pago_venta ADD cierre_caja int;
ALTER TABLE inv_pago_venta ADD CONSTRAINT fk_pagoventa_cierre_id FOREIGN KEY (cierre_caja) REFERENCES agil_cierre_caja(id);
ALTER TABLE inv_pago_compra ADD cierre_caja int;
ALTER TABLE inv_pago_compra ADD CONSTRAINT fk_pagocompra_cierre_id FOREIGN KEY (cierre_caja) REFERENCES agil_cierre_caja(id);