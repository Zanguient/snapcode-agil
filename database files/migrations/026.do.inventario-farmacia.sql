ALTER TABLE inv_detalle_venta ADD COLUMN observaciones  varchar(255) AFTER inventario;
ALTER TABLE inv_venta_farmacia ADD CONSTRAINT inv_venta_farmacia_ibfk_1 FOREIGN KEY (venta) REFERENCES inv_venta (id);
ALTER TABLE inv_venta_farmacia ADD CONSTRAINT inv_venta_farmacia_ibfk_2 FOREIGN KEY (id_consulta) REFERENCES agil_medico_paciente_consulta (id);