ALTER TABLE agil_gtm_despacho_detalle add kardex_detalle int(11);
ALTER TABLE agil_gtm_despacho drop kardex_detalle;

ALTER TABLE agil_gtm_despacho_detalle ADD CONSTRAINT agil_gtm_despacho_detalle_ibfk_7 FOREIGN KEY (kardex_detalle) REFERENCES agil_gtm_venta_kardex_detalle (id);