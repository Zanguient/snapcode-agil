ALTER TABLE inv_compra ADD usuario int;
ALTER TABLE inv_compra ADD CONSTRAINT fk_usuario_compra_id FOREIGN KEY (usuario) REFERENCES sys_usuario(id);