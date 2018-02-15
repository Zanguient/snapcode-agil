ALTER TABLE agil_servicio DROP FOREIGN KEY agil_servicio_ibfk_1;
ALTER TABLE agil_servicio ADD CONSTRAINT agil_servicio_ibfk_1 FOREIGN KEY (actividad) REFERENCES gl_clase (id);
