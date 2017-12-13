ALTER TABLE inv_pago_venta ADD usuario int;
ALTER TABLE inv_pago_venta ADD CONSTRAINT fk_usuario_pagoventa_id FOREIGN KEY (usuario) REFERENCES sys_usuario(id);