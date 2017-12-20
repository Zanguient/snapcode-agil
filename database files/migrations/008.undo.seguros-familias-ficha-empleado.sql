
ALTER TABLE agil_medico_paciente DROP COLUMN fecha_vence_documento;
ALTER TABLE gl_persona DROP COLUMN segundo_nombre;
ALTER TABLE gl_persona DROP COLUMN apellido_casada;
ALTER TABLE agil_medico_paciente DROP FOREIGN KEY fk_agil_medico_paciente_extension_id;
ALTER TABLE agil_medico_paciente DROP FOREIGN KEY fk_agil_medico_paciente_tipo_documento_id;
ALTER TABLE agil_medico_paciente DROP COLUMN tipo_documento;
ALTER TABLE agil_medico_paciente CHANGE COLUMN extension extension VARCHAR(255);
