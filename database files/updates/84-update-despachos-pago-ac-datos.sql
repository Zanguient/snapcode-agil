
START TRANSACTION;
update agil_gtm_despacho_detalle despacho
set despacho.saldo_pago_ac =(despacho.cantidad_despacho*despacho.precio_unitario+despacho.servicio_transporte),
despacho.total =(despacho.cantidad_despacho*despacho.precio_unitario+despacho.servicio_transporte),
despacho.pago_ac =0
where despacho.padre is not null;
select despacho.cantidad_despacho, producto.precio_unitario, despacho.servicio_transporte,(despacho.cantidad_despacho*producto.precio_unitario+despacho.servicio_transporte) as total_pago_ac from agil_gtm_despacho_detalle as despacho INNER JOIN agil_producto as producto ON despacho.producto = producto.id where despacho.padre is not null;
COMMIT;