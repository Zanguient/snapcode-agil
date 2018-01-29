ALTER TABLE agil_proforma ADD detalle TEXT(2000);
ALTER TABLE agil_proforma ADD empresa int(11);
ALTER TABLE agil_proforma ADD CONSTRAINT agil_proforma_ibfk_5 FOREIGN KEY (empresa) REFERENCES agil_empresa (id);