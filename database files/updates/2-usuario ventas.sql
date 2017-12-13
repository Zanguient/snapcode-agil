ALTER TABLE inv_venta ADD usuario int;
ALTER TABLE inv_venta ADD CONSTRAINT fk_usuario_venta_id FOREIGN KEY (usuario) REFERENCES sys_usuario(id);