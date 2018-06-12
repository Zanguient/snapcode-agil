
START TRANSACTION;
update agil_gtm_despacho_detalle despacho
set despacho.saldo_pago_ac =(despacho.cantidad_despacho*despacho.precio_unitario+despacho.servicio_transporte-despacho.pago_ac),
despacho.total =(despacho.cantidad_despacho*despacho.precio_unitario+despacho.servicio_transporte)
where despacho.total != (despacho.cantidad_despacho*despacho.precio_unitario+despacho.servicio_transporte);
select despacho.cantidad_despacho, despacho.precio_unitario, despacho.servicio_transporte,despacho.total,(despacho.cantidad_despacho*despacho.precio_unitario+despacho.servicio_transporte) as total_pago_ac,despacho.saldo_pago_ac from agil_gtm_despacho_detalle as despacho  where despacho.total != (despacho.cantidad_despacho*despacho.precio_unitario+despacho.servicio_transporte);
COMMIT;