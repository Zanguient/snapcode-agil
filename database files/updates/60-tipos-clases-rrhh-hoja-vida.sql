INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('GRADO', 'RRHH_GRA', '2017-12-27 12:26:51', '2017-12-27 12:34:47');
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('TITULO', 'RRHH_TITL', '2017-12-27 12:30:13', '2017-12-27 12:30:13');
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('INSTITULO', 'RRHH_INST', '2017-12-27 12:30:51', '2017-12-27 12:30:51');
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('TIPO CAPACIDAD', 'RRHH_TCIE', '2017-12-27 12:31:56', '2017-12-27 12:33:38');
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('TIPO LOGRO', 'RRHH_TLIE', '2017-12-27 12:32:45', '2017-12-27 17:41:38');

INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_GRA'), 'BACHILLERATO', 'BACH', '2017-12-27 12:34:47', '2017-12-27 12:34:47');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_GRA'), 'UNIVERSITARIO', 'UNIV', '2017-12-27 12:34:47', '2017-12-27 12:34:47');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_GRA'), 'POSTGRADO', 'POSTG', '2017-12-27 12:34:47', '2017-12-27 12:34:47');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TITL'), 'BACHILLER', 'BACH', '2017-12-27 12:30:13', '2017-12-27 12:30:13');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TITL'), 'LICENCIADO', 'LIC', '2017-12-27 12:30:13', '2017-12-27 12:30:13');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_INST'), 'UCATEC', 'UCATEC', '2017-12-27 12:30:51', '2017-12-27 12:30:51');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_INST'), 'CATOLICA', 'CATO', '2017-12-27 12:30:51', '2017-12-27 12:30:51');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TCIE'), 'INTERNO', 'INTER', '2017-12-27 12:33:39', '2017-12-27 12:33:39');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TCIE'), 'EXTERNO', 'EXT', '2017-12-27 12:33:39', '2017-12-27 12:33:39');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TLIE'), 'INTERNO', 'INTER', '2017-12-27 12:32:45', '2017-12-27 17:41:38');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TLIE'), 'EXTERNO', 'EXT', '2017-12-27 12:32:45', '2017-12-27 17:41:38');
