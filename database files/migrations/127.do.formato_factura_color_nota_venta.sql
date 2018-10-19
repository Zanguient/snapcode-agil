ALTER TABLE agil_configuracion_general_factura ADD formato_color_nota_venta INT(11);
ALTER TABLE agil_configuracion_general_factura ADD formato_papel_nota_venta INT(11);
ALTER TABLE agil_configuracion_general_factura ADD nota_factura_nota_venta VARCHAR(255);
ALTER TABLE agil_configuracion_general_factura ADD color_cabecera_nota_venta VARCHAR(255);
ALTER TABLE agil_configuracion_general_factura ADD color_detalle_nota_venta VARCHAR(255);
ALTER TABLE agil_configuracion_general_factura ADD tipo_configuracion_nota_venta INT(11);

ALTER TABLE agil_configuracion_factura ADD formato_color_nota_venta INT(11);
ALTER TABLE agil_configuracion_factura ADD formato_papel_nota_venta INT(11);
ALTER TABLE agil_configuracion_factura ADD nota_factura_nota_venta VARCHAR(255);
ALTER TABLE agil_configuracion_factura ADD color_cabecera_nota_venta VARCHAR(255);
ALTER TABLE agil_configuracion_factura ADD color_detalle_nota_venta VARCHAR(255);
ALTER TABLE agil_configuracion_factura ADD tipo_configuracion_nota_venta INT(11);

