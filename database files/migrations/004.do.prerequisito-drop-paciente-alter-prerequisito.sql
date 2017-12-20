ALTER TABLE agil_medico_prerequisito DROP FOREIGN KEY agil_medico_prerequisito_ibfk_1;
ALTER TABLE agil_medico_prerequisito DROP FOREIGN KEY agil_medico_prerequisito_ibfk_2;
ALTER TABLE agil_medico_prerequisito CHANGE COLUMN prerequisito nombre VARCHAR(255);
ALTER TABLE agil_medico_prerequisito DROP COLUMN paciente;
