ALTER TABLE agil_medico_prerequisito CHANGE COLUMN nombre prerequisito int(11);
ALTER TABLE agil_medico_prerequisito ADD CONSTRAINT agil_medico_prerequisito_ibfk_2 FOREIGN KEY (prerequisito) REFERENCES gl_clase(id);
ALTER TABLE agil_medico_prerequisito ADD paciente int(11);
ALTER TABLE agil_medico_prerequisito ADD CONSTRAINT agil_medico_prerequisito_ibfk_1 FOREIGN KEY (paciente) REFERENCES agil_medico_paciente(id)