INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('CONCEPTOS MOVIMIENTO CAJA CHICA', 'CM_CCH', '2018-07-25 12:28:22', '2018-07-25 12:28:22');
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('ESTADOS SOLICITUDES CAJA CHICA', 'ES_CCH', '2018-07-25 12:28:22', '2018-07-25 12:28:22');


INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'ES_CCH'), 'PENDIENTE', 'PENDIENTE', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'ES_CCH'), 'AUTORIZADO', 'AUTORIZADO', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'ES_CCH'), 'PROCESADO', 'PROCESADO', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'ES_CCH'), 'ANULADO', 'ANULADO', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);

INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'CM_CCH'), 'INGRESO', 'INGRESO', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'CM_CCH'), 'GASTO', 'GASTO', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'CM_CCH'), 'KARDEX', 'KARDEX', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
