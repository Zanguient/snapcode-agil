ALTER TABLE agil_gtm_despacho_detalle ADD pago_ac DECIMAL(20,4);
ALTER TABLE agil_gtm_despacho_detalle ADD saldo_pago_ac DECIMAL(20,4);
ALTER TABLE agil_gtm_despacho_detalle ADD total DECIMAL(20,4);
ALTER TABLE agil_sucursal add despacho_recivo_correlativo int(11) default 1;
