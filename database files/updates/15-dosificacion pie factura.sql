ALTER TABLE agil_dosificacion ADD pie_factura int;
ALTER TABLE agil_dosificacion ADD CONSTRAINT fk_agil_dosificacion_pie_factura_id FOREIGN KEY (pie_factura) REFERENCES gl_clase(id);