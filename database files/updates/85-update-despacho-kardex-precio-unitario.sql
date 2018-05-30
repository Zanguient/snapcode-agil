
START TRANSACTION;
update agil_gtm_venta_kardex_detalle kardex INNER JOIN agil_producto as producto ON kardex.producto = producto.id
set kardex.precio_unitario = producto.precio_unitario
where kardex.precio_unitario is NULL;
COMMIT;