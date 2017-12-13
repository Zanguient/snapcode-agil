ALTER TABLE inv_cotizacion ADD id_sucursal int;
ALTER TABLE inv_cotizacion ADD CONSTRAINT fk_cotizacion_sucursal_id FOREIGN KEY (id_sucursal) REFERENCES agil_sucursal(id);
