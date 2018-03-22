ALTER TABLE agil_rrhh_empleado_cargo add empleado  int(11);
ALTER TABLE agil_rrhh_empleado_cargo DROP FOREIGN KEY agil_rrhh_empleado_cargo_ibfk_1;
ALTER TABLE agil_rrhh_empleado_cargo drop ficha;
ALTER TABLE agil_rrhh_empleado_cargo ADD CONSTRAINT agil_rrhh_empleado_cargo_ibfk_1 FOREIGN KEY (empleado) REFERENCES agil_medico_paciente (id);
