INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt,empresa) VALUES ('GESTIÓN', 'GESTION_EEFF', '2018-07-25 12:28:22', '2018-07-25 12:28:22',35);
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('NUMERACIOON EF', 'NEEFF', '2018-07-25 12:28:22', '2018-07-25 12:28:22');
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('TIPO PERIODO', 'EEFF_TP', '2018-07-25 12:28:22', '2018-07-25 12:28:22');
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('DETALLE BALANCE', 'EEFF_DB', '2018-07-25 12:28:22', '2018-07-25 12:28:22');


INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'GESTION_EEFF'), 'COMERCIAL', 'CM', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'GESTION_EEFF'), 'INDUSTRIAL', 'IND', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'GESTION_EEFF'), 'AGRICOLA', 'AGR', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);

INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'NEEFF'), 'SIMPLE ABAJO A LA DERECHA', 'SAD', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'NEEFF'), 'SIMPLE ABAJO AL CENTRO', 'SAI', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'NEEFF'), 'SIMPLE SUPERIOR DERECHA', 'SSD', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'NEEFF'), 'PAGINA DE PAGINAS A LA DERECHA', 'PPD', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'NEEFF'), 'PAGINA DE PAGINAS AL CENTRO', 'PPC', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'NEEFF'), 'PAGINA DE PAGINAS SUPERIOR DERECHA', 'PPSD', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);

INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'EEFF_TP'), 'GESTIÓN', 'GES', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'EEFF_TP'), 'MES', 'MES', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'EEFF_TP'), 'FECHAS', 'FECHAS', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'EEFF_TP'), 'COMPARATIVO', 'COMPARATIVO', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);

INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'EEFF_DB'), 'PREESTABLECIDO', 'PREESTABLECIDO', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'EEFF_DB'), 'GRUPO', 'GRUPO', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'EEFF_DB'), 'SUBGRUPO', 'SUBGRUPO', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'EEFF_DB'), 'GENERICA', 'GENERICA', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'EEFF_DB'), 'APROPIACION', 'APROPIACION', '2018-07-25 12:28:22', '2018-07-25 12:28:22',1);

INSERT INTO agil_estado_financiero_gestion(tipo,habilitado,createdAt,updatedAt) VALUES ((SELECT gl_clase.id from gl_clase where nombre_corto = 'AGR' and nombre="AGRICOLA"),1,now(), now());
INSERT INTO agil_estado_financiero_gestion(tipo,habilitado,createdAt,updatedAt) VALUES ((SELECT gl_clase.id from gl_clase where nombre_corto = 'IND' and nombre="INDUSTRIAL"),0,now(), now());
INSERT INTO agil_estado_financiero_gestion(tipo,habilitado,createdAt,updatedAt) VALUES ((SELECT gl_clase.id from gl_clase where nombre_corto = 'CM' and nombre="COMERCIAL"),0,now(), now());
