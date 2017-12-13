ALTER TABLE inv_venta DROP FOREIGN KEY fk_receptor_venta_id;
ALTER TABLE inv_venta CHANGE COLUMN receptor vendedor int;
update inv_venta set vendedor=null;
ALTER TABLE inv_venta ADD CONSTRAINT fk_vendedor_venta_id FOREIGN KEY (vendedor) REFERENCES inv_vendedor_venta(id);