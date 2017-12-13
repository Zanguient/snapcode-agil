ALTER TABLE inv_inventario ADD fecha_vencimiento DATETIME;
ALTER TABLE inv_inventario ADD lote varchar(255);
ALTER TABLE agil_producto ADD alerta int;
ALTER TABLE agil_producto ADD descuento decimal(10,2) default 0;
ALTER TABLE agil_producto ADD descuento_fijo tinyint default 0;