ALTER TABLE agil_proforma ADD movimiento int(11);
ALTER TABLE agil_proforma ADD factura bigint(20);
ALTER TABLE agil_proforma ADD autorizacion bigint(20);
ALTER TABLE agil_proforma ADD fecha_limite_emision datetime;
ALTER TABLE agil_proforma ADD codigo_control varchar(255);