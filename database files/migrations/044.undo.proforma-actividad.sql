ALTER TABLE agil_proforma DROP FOREIGN KEY agil_proforma_ibfk_2;
ALTER TABLE agil_proforma ADD CONSTRAINT agil_proforma_ibfk_2 FOREIGN KEY (actividad) REFERENCES agil_actividades_economicas (id);