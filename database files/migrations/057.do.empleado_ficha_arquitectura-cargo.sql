ALTER TABLE agil_rrhh_empleado_cargo add ficha  int(11);
ALTER TABLE agil_rrhh_empleado_cargo DROP FOREIGN KEY agil_rrhh_empleado_cargo_ibfk_1;
ALTER TABLE agil_rrhh_empleado_cargo drop empleado;
ALTER TABLE agil_rrhh_empleado_cargo ADD CONSTRAINT agil_rrhh_empleado_cargo_ibfk_1 FOREIGN KEY (ficha) REFERENCES agil_rrhh_empleado_ficha (id);
