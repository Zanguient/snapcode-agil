INSERT INTO gl_clase (tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ('21','PRODUCTO FINAL', 'PFINAL','18-02-17 10:34:09','18-02-17 10:34:09');
INSERT INTO gl_clase (tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ('21','PRODUCTO INTERMEDIO', 'PINTER','18-02-17 10:34:09','18-02-17 10:34:09');
INSERT INTO gl_clase (tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ('21','PRODUCTO BASE', 'PBASE','18-02-17 10:34:09','18-02-17 10:34:09');
ALTER TABLE agil_producto ADD tipo_producto int;
ALTER TABLE agil_producto ADD CONSTRAINT fk_tipo_producto_id FOREIGN KEY (tipo_producto) REFERENCES gl_clase(id);
