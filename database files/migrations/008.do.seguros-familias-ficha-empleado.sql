ALTER TABLE agil_medico_paciente ADD tipo_documento int(11);
ALTER TABLE agil_medico_paciente DROP COLUMN extension;
ALTER TABLE agil_medico_paciente ADD extension int(11);
ALTER TABLE agil_medico_paciente ADD fecha_vence_documento datetime(0);
ALTER TABLE gl_persona ADD segundo_nombre varchar(255);
ALTER TABLE gl_persona ADD apellido_casada varchar(255);
ALTER TABLE agil_medico_paciente ADD CONSTRAINT fk_agil_medico_paciente_extension_id FOREIGN KEY (extension) REFERENCES gl_clase(id);
ALTER TABLE agil_medico_paciente ADD CONSTRAINT fk_agil_medico_paciente_tipo_documento_id FOREIGN KEY (tipo_documento) REFERENCES gl_clase(id);
