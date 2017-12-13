ALTER TABLE agil_empresa ADD usar_pedidos tinyint default 0;
ALTER TABLE agil_sucursal ADD pedido_correlativo int default 1;
ALTER TABLE inv_venta ADD pedido int;
ALTER TABLE agil_empresa ADD usar_pantalla_cliente tinyint default 0;
ALTER TABLE agil_empresa ADD usar_pantalla_despacho tinyint default 0;
ALTER TABLE inv_venta ADD despachado tinyint default 0;