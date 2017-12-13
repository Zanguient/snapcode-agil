ALTER TABLE agil_producto ADD marca varchar(255);
ALTER TABLE agil_producto ADD modelo varchar(255);
ALTER TABLE agil_producto ADD anio varchar(255);
ALTER TABLE agil_producto ADD almacen_erp int;
ALTER TABLE agil_producto ADD CONSTRAINT fk_producto_almacen_id FOREIGN KEY (almacen_erp) REFERENCES agil_almacen(id);
ALTER TABLE agil_producto ADD cuenta int;
ALTER TABLE agil_producto ADD CONSTRAINT fk_producto_cuenta_id FOREIGN KEY (cuenta) REFERENCES agil_contabilidad_cuenta(id);