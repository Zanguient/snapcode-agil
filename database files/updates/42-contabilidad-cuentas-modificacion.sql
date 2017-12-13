alter table agil_contabilidad_cuenta drop FOREIGN KEY agil_contabilidad_cuenta_ibfk_4;
alter table agil_contabilidad_cuenta drop FOREIGN KEY agil_contabilidad_cuenta_ibfk_5;
ALTER TABLE agil_contabilidad_cuenta DROP COLUMN vincular;
ALTER TABLE agil_contabilidad_cuenta DROP COLUMN clase;
ALTER TABLE agil_contabilidad_cuenta DROP COLUMN usuario;
ALTER TABLE agil_contabilidad_cuenta CHANGE COLUMN id_calculo calculo int;
ALTER TABLE agil_contabilidad_cuenta CHANGE COLUMN calculos aplicar_calculo int;