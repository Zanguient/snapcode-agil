ALTER TABLE inv_venta ADD receptor int;
ALTER TABLE inv_venta ADD CONSTRAINT fk_receptor_venta_id FOREIGN KEY (receptor) REFERENCES gl_persona(id);