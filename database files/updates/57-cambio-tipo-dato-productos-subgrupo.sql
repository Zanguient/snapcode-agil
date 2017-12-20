ALTER TABLE agil_producto MODIFY subgrupo INTEGER;
ALTER TABLE agil_producto ADD CONSTRAINT fk_producto_subgrupo_id FOREIGN KEY (subgrupo) REFERENCES gl_clase(id);