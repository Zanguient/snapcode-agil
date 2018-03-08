ALTER TABLE agil_empresa add usar_creditos  tinyint default 0;
ALTER TABLE agil_empresa add usar_destinos  tinyint default 0;
ALTER TABLE agil_empresa add usar_razon_social  tinyint default 0;
ALTER TABLE agil_producto add rango_positivo DECIMAL(20,4);
ALTER TABLE agil_producto add rango_negativo DECIMAL(20,4);