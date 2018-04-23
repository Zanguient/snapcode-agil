ALTER TABLE agil_gtm_venta_kardex_detalle MODIFY cantidad DECIMAL(20,4);
ALTER TABLE agil_gtm_venta_kardex_detalle MODIFY cantidad_despachada DECIMAL(20,4);
ALTER TABLE agil_gtm_venta_kardex_detalle MODIFY saldo DECIMAL(20,4);
ALTER TABLE agil_gtm_venta_kardex_detalle add factura int(11);
