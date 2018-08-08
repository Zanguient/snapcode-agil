INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('ESTADO PAGO DESPACHOS', 'ES_DESP_PAGO', '2018-07-25 12:28:22', '2018-07-25 12:28:22');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'ES_DESP_PAGO'), 'PARCIAL', 'PARCIAL', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'ES_DESP_PAGO'), 'DEUDA', 'DEUDA', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'ES_DESP_PAGO'), 'PAGADO', 'PAGADO', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
UPDATE agil_gtm_despacho_detalle
SET estado = (
	SELECT
		c.id
	FROM
		gl_tipo AS t
	INNER JOIN gl_clase AS c ON t.id = c.tipo
	WHERE
		c.nombre_corto = "PAGADO"
)
WHERE
	saldo_pago_ac = 0;
UPDATE agil_gtm_despacho_detalle
SET estado = (
	SELECT
		c.id
	FROM
		gl_tipo AS t
	INNER JOIN gl_clase AS c ON t.id = c.tipo
	WHERE
		c.nombre_corto = "DEUDA"
)
WHERE
	pago_ac = 0;
UPDATE agil_gtm_despacho_detalle
SET estado = (
	SELECT
		c.id
	FROM
		gl_tipo AS t
	INNER JOIN gl_clase AS c ON t.id = c.tipo
	WHERE
		c.nombre_corto = "PARCIAL"
)
WHERE
	saldo_pago_ac > 0 and pago_ac > 0;