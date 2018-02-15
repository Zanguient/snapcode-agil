ALTER TABLE agil_proforma ADD sucursal int(11);
ALTER TABLE agil_proforma ADD CONSTRAINT agil_proforma_ibfk_1 FOREIGN KEY (sucursal) REFERENCES agil_sucursal (id);
