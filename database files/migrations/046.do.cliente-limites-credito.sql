ALTER TABLE agil_cliente add linea_credito  DECIMAL(20,4);
ALTER TABLE agil_cliente add plazo_credito  int(11);
ALTER TABLE agil_cliente add usar_limite_credito tinyint default 0;