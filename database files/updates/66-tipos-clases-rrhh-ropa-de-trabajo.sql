INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('ESTADO DOTACIÓN DE ROPA DE TRABAJO', 'RRHH_EDRT', '2017-12-27 12:26:51', '2017-12-27 12:34:47');
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('CUMPLIMIENTO DOTACIÓN DE ROPA DE TRABAJO', 'RRHH_CDRT', '2017-12-27 12:30:13', '2017-12-27 12:30:13');


INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_EDRT'), 'COMPLETA', 'COMPL', '2017-12-27 12:34:47', '2017-12-27 12:34:47',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_EDRT'), 'INCOMPLETA', 'INCOMPL', '2017-12-27 12:34:47', '2017-12-27 12:34:47',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_EDRT'), 'AGREGADO', 'AGREG', '2017-12-27 12:34:47', '2017-12-27 12:34:47',1);

INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_CDRT'), 'EN FECHA', 'FECHA', '2017-12-27 12:34:47', '2017-12-27 12:34:47',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_CDRT'), 'RETRASADO', 'RETRA', '2017-12-27 12:34:47', '2017-12-27 12:34:47',1);
