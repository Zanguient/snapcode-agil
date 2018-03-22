ALTER TABLE inv_venta ADD usar_servicios tinyint;
ALTER TABLE inv_detalle_venta ADD servicio int;
ALTER TABLE inv_detalle_venta ADD CONSTRAINT inv_detalle_venta_ibfk_3 FOREIGN KEY (servicio) REFERENCES agil_servicio (id);