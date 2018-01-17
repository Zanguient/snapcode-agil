ALTER TABLE agil_sucursal ADD comprobante_ingreso_correlativo int(11) DEFAULT 1;
ALTER TABLE agil_sucursal ADD comprobante_egreso_correlativo int(11) DEFAULT 1;
ALTER TABLE agil_sucursal ADD comprobante_traspaso_correlativo int(11) DEFAULT 1;
ALTER TABLE agil_sucursal ADD comprobante_caja_chica_correlativo int(11) DEFAULT 1;
ALTER TABLE agil_sucursal ADD reiniciar_comprobante_ingreso_correlativo int(11) DEFAULT 0;
ALTER TABLE agil_sucursal ADD reiniciar_comprobante_egreso_correlativo int(11) DEFAULT 0;
ALTER TABLE agil_sucursal ADD reiniciar_comprobante_traspaso_correlativo int(11) DEFAULT 0;
ALTER TABLE agil_sucursal ADD reiniciar_comprobante_caja_chica_correlativo int(11) DEFAULT 0;
