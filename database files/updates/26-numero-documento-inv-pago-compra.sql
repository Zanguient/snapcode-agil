ALTER TABLE	inv_pago_compra ADD numero_documento int;
ALTER TABLE inv_pago_compra ADD usuario int;
ALTER TABLE inv_pago_compra ADD CONSTRAINT fk_usuario_pagocompra_id FOREIGN KEY (usuario) REFERENCES sys_usuario(id);