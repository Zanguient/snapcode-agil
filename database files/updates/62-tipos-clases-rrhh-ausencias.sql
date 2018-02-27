INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('AUSENCIA MEDICA', 'RRHH_AUSMED', '2017-12-27 12:26:51', '2017-12-27 12:34:47');
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('OTRAS AUSENCIAS', 'RRHH_OTRAUS', '2017-12-27 12:30:13', '2017-12-27 12:30:13');

INSERT INTO agil_rrhh_clase_ausencia(tipo,nombre,porcentaje,dias_descuento,habilitado,createdAt,updatedAt) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_AUSMED'), 'MATERNIDAD', '0',"0","1", '2017-12-27 12:34:47', '2017-12-27 12:34:47');
INSERT INTO agil_rrhh_clase_ausencia(tipo,nombre,porcentaje,dias_descuento,habilitado,createdAt,updatedAt) VALUES ((SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_OTRAUS'), 'CAPACITACION', '0',"0","1", '2017-12-27 12:34:47', '2017-12-27 12:34:47');


