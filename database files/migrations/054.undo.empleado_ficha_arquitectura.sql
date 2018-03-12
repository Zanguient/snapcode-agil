ALTER TABLE agil_rrhh_empleado_ausencia drop ficha;
ALTER TABLE agil_rrhh_empleado_vacaciones drop ficha;
ALTER TABLE agil_rrhh_empleado_horas_extra drop ficha;
ALTER TABLE agil_rrhh_empleado_rol_turno drop ficha;


ALTER TABLE agil_rrhh_empleado_ausencia DROP FOREIGN KEY agil_rrhh_empleado_ausencia_ibfk_1;
ALTER TABLE agil_rrhh_empleado_vacaciones DROP FOREIGN KEY agil_rrhh_empleado_vacaciones_ibfk_1;
ALTER TABLE agil_rrhh_empleado_horas_extra DROP FOREIGN KEY agil_rrhh_empleado_horas_extra_ibfk_1;
ALTER TABLE agil_rrhh_empleado_rol_turno DROP FOREIGN KEY agil_rrhh_empleado_rol_turno_ibfk_1;

ALTER TABLE agil_rrhh_empleado_ausencia add empleado int(11);
ALTER TABLE agil_rrhh_empleado_vacaciones  add empleado int(11);
ALTER TABLE agil_rrhh_empleado_horas_extra  add empleado int(11);
ALTER TABLE agil_rrhh_empleado_rol_turno  add empleado int(11);

ALTER TABLE agil_rrhh_empleado_ausencia ADD CONSTRAINT agil_rrhh_empleado_ausencia_ibfk_1 FOREIGN KEY (empleado) REFERENCES agil_medico_paciente (id);
ALTER TABLE agil_rrhh_empleado_vacaciones ADD CONSTRAINT agil_rrhh_empleado_vacaciones_ibfk_1 FOREIGN KEY (empleado) REFERENCES agil_medico_paciente (id);
ALTER TABLE agil_rrhh_empleado_horas_extra ADD CONSTRAINT agil_rrhh_empleado_horas_extra_ibfk_1 FOREIGN KEY (empleado) REFERENCES agil_medico_paciente (id);
ALTER TABLE agil_rrhh_empleado_rol_turno ADD CONSTRAINT agil_rrhh_empleado_rol_turno_ibfk_1 FOREIGN KEY (empleado) REFERENCES agil_medico_paciente (id);
