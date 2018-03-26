INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('TIPO REINCORPORACION', 'RRHH_TPRE', '2017-12-27 12:26:51', '2017-12-27 12:34:47');
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('TIPO INGRESO DEDUCCION', 'RRHH_TPDOI', '2017-12-27 12:30:13', '2017-12-27 12:30:13');
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('TIPO MOTIVIO RETIRO', 'RRHH_TPMR', '2017-12-27 12:30:13', '2017-12-27 12:30:13');

INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TPRE'), 'NUEVO REINGRESO', 'NREING', '2017-12-27 12:34:47', '2017-12-27 12:34:47',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TPRE'), 'REGENERACION', 'NREGEN', '2017-12-27 12:34:47', '2017-12-27 12:34:47',1);

INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TPDOI'), 'OTRO INGRESO', 'OTRING', '2017-12-27 12:34:47', '2017-12-27 12:34:47',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TPDOI'), 'DEDUCCION', 'DEDUC', '2017-12-27 12:34:47', '2017-12-27 12:34:47',1);

INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TPMR'), 'VOLUNTARIO', 'VOLUN', '2017-12-27 12:34:47', '2017-12-27 12:34:47',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TPMR'), 'CULMINACIÓN CONTRATO', 'CULCONT', '2017-12-27 12:34:47', '2017-12-27 12:34:47',1);
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt,habilitado) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TPMR'), 'DESPIDO', 'DESPI', '2017-12-27 12:34:47', '2017-12-27 12:34:47',1);


