ALTER TABLE inv_compra add usar_producto tinyint default 1;
ALTER TABLE inv_compra add observacion varchar(255);
ALTER TABLE inv_compra add dui varchar(255);
ALTER TABLE inv_compra add tipo_retencion tinyint;
ALTER TABLE agil_configuracion_compra_vista add mostrar_it_retencion tinyint default 0;
ALTER TABLE agil_configuracion_compra_vista add mostrar_iue  tinyint default 0;
ALTER TABLE agil_configuracion_compra_vista add mostrar_pagado  tinyint default 0;
ALTER TABLE inv_detalle_compra add it  DECIMAL(20,4);
ALTER TABLE inv_detalle_compra add iue  DECIMAL(20,4);