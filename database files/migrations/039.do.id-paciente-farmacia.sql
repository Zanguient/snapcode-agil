ALTER TABLE inv_venta_farmacia DROP FOREIGN KEY inv_venta_farmacia_ibfk_2;
ALTER TABLE inv_venta_farmacia DROP id_consulta;
ALTER TABLE inv_venta_farmacia ADD id_paciente  int(11);
ALTER TABLE inv_venta_farmacia ADD CONSTRAINT inv_venta_farmacia_ibfk_2 FOREIGN KEY (id_paciente) REFERENCES agil_medico_paciente (id);