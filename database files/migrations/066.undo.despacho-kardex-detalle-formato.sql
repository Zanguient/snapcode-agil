ALTER TABLE agil_gtm_venta_kardex_detalle MODIFY cantidad int(11);
ALTER TABLE agil_gtm_venta_kardex_detalle MODIFY cantidad_despachada int(11);
ALTER TABLE agil_gtm_venta_kardex_detalle MODIFY saldo int(11);
ALTER TABLE agil_gtm_venta_kardex_detalle drop factura;
