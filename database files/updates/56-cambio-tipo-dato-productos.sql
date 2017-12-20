ALTER TABLE agil_producto MODIFY grupo INTEGER;
ALTER TABLE agil_producto ADD CONSTRAINT fk_producto_grupo_id FOREIGN KEY (grupo) REFERENCES gl_clase(id);