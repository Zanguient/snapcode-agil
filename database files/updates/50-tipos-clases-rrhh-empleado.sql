/* tipos recursos humanos */
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('EXPEDIDO', 'RRHH_EXP', '2017-12-13 12:07:06', '2017-12-13 12:10:46') 
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('TIPO EXPEDIDO', 'RRHH_TEXP', '2017-12-13 12:12:58', '2017-12-13 12:12:58')
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('ESTADO CIVIL', 'RRHH_EC', '2017-12-13 12:15:01', '2017-12-13 12:15:01') 
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('TIPO CONTRATO', 'RRHH_TC', '2017-12-13 12:26:28', '2017-12-13 12:27:10')
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('TIPO PERSONAL', 'RRHH_TP', '2017-12-13 12:27:48', '2017-12-13 12:27:48')
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('CARGA HORARIOS', 'RRHH_CH', '2017-12-13 12:31:24', '2017-12-13 12:31:24')
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('AREA', 'RRHH_AREA', '2017-12-13 12:32:07', '2017-12-13 12:32:07') 
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('UBICACION', 'RRHH_UBI', '2017-12-13 12:32:41', '2017-12-13 12:32:41')
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('SEGURO SOCIAL', 'RRHH_SS', '2017-12-13 14:15:36', '2017-12-13 14:15:36') 
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('LUGAR SEGURO SALUD', 'RRHH_LSS', '2017-12-13 14:17:38', '2017-12-13 14:17:38') 
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('APORTE SEGURO LARGO PLAZO', 'RRHH_ASLP', '2017-12-13 14:27:00', '2017-12-13 14:27:00')
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('OTROS SEGUROS', 'RRHH_OST', '2017-12-13 14:35:46', '2017-12-13 14:35:46')
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('BANCO', 'RRHH_BAN', '2017-12-13 14:37:13', '2017-12-13 14:37:13') 
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('RELACION', 'RRHH_REL', '2017-12-13 15:10:17', '2017-12-13 15:10:17')
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('CARGO', 'RRHH_CARGO', '2017-12-18 17:39:19', '2017-12-18 17:39:19') 
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('NACIONALIDAD', 'NAC', '2017-12-19 11:04:51', '2017-12-19 11:04:51') 
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('LOCALIDAD', 'LOC', '2017-12-19 11:04:51', '2017-12-19 11:04:51')
INSERT INTO gl_tipo(nombre,nombre_corto,createdAt,updatedAt) VALUES ('DISCAPACIDAD', 'RRHH_DISC', '2017-12-19 11:04:51', '2017-12-19 11:04:51')
/* clases de los tipos */
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_EXP'), 'COCHABAMBA', 'CB', '2017-12-13 12:07:06', '2017-12-13 12:10:46');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_EXP'), 'LA PAZ', 'LA', '2017-12-13 12:07:06', '2017-12-13 12:10:46');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_EXP'), 'SANTA CRUZ', 'SC', '2017-12-13 12:07:06', '2017-12-13 12:10:46');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TEXP'), 'CÉLULA DE IDENTIDAD', 'CI', '2017-12-13 12:12:58', '2017-12-13 12:12:58');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TEXP'), 'ROL ÚNICO NACIONAL', 'RUN', '2017-12-13 12:12:58', '2017-12-13 12:12:58');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_EC'), 'SOLTERO', 'SOLT', '2017-12-13 12:15:01', '2017-12-13 12:15:01');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_EC'), 'CASADO', 'CAS', '2017-12-13 12:15:01', '2017-12-13 12:15:01');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'NAC'), 'BOLIVIANA', 'BOL', '2017-12-13 12:23:19', '2017-12-13 12:23:19');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'NAC'), 'BRAZILERA', 'BRA', '2017-12-13 12:23:19', '2017-12-13 12:23:19');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'NAC'), 'COLOMBIA', 'COL', '2017-12-13 12:23:19', '2017-12-13 12:23:19');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'LOC'), 'LOCALIDAD 1', 'LOC1-AIQL', '2017-12-13 12:24:29', '2017-12-13 12:24:29');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'LOC'), 'LOCALIDAD 2', 'LOC2-AIQL', '2017-12-13 12:24:29', '2017-12-13 12:24:29');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TC'), 'INDEFINIDO', 'IND', '2017-12-13 12:26:28', '2017-12-13 12:27:10');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TC'), 'PLAZO FIJO', 'PLF', '2017-12-13 12:26:28', '2017-12-13 12:27:10');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TC'), 'OBRA', 'OBRA', '2017-12-13 12:26:28', '2017-12-13 12:27:10');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TC'), 'EVENTUAL', 'EVEN', '2017-12-13 12:26:28', '2017-12-13 12:27:10');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TP'), 'CAMPO', 'CAMPO', '2017-12-13 12:27:48', '2017-12-13 12:27:48');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_TP'), 'OFICINA', 'OFI', '2017-12-13 12:27:48', '2017-12-13 12:27:48');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_CH'), 'TIEMPO COMPLETO', 'TC', '2017-12-13 12:31:24', '2017-12-13 12:31:24');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_CH'), 'MEDIO TIEMPO', 'MD', '2017-12-13 12:31:24', '2017-12-13 12:31:24');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_AREA'), 'MARGARITA', 'MA', '2017-12-13 12:32:07', '2017-12-13 12:32:07');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_AREA'), 'REPSOL', 'REP', '2017-12-13 12:32:07', '2017-12-13 12:32:07');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_UBI'), 'MARGARITA', 'MAR', '2017-12-13 12:32:41', '2017-12-13 12:32:41');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_UBI'), 'REPSOL', 'REPS', '2017-12-13 12:32:41', '2017-12-13 12:32:41');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_SS'), 'CAJA PETROLERA', 'PET', '2017-12-13 14:15:36', '2017-12-13 14:15:36');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_SS'),, 'CAJA CORDES', 'COR', '2017-12-13 14:15:36', '2017-12-13 14:15:36');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_LSS'), 'VILLA TUNARI', 'TUN', '2017-12-13 14:17:39', '2017-12-13 14:17:39');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_LSS'), 'VILLA MOSCU', 'MOS', '2017-12-13 14:17:39', '2017-12-13 14:17:39');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_ASLP'), 'AFP PREVICION', 'AFPP', '2017-12-13 14:27:00', '2017-12-13 14:27:00');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_ASLP'), 'AFP FUTURO', 'AFPF', '2017-12-13 14:27:00', '2017-12-13 14:27:00');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_OST'), 'VIDA', 'VIDA', '2017-12-13 14:35:46', '2017-12-13 14:35:46');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_OST'), 'ACCIDENTE', 'ACCI', '2017-12-13 14:35:46', '2017-12-13 14:35:46');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_BAN'), 'BANCO CAJA PETROLERA', 'BCP', '2017-12-13 14:37:13', '2017-12-13 14:37:13');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_BAN'), 'BAMCO MERCANTIL SANTA CRUS', 'BMS', '2017-12-13 14:37:13', '2017-12-13 14:37:13');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_REL'), 'HERMANO', 'HER', '2017-12-13 15:10:17', '2017-12-13 15:10:17');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_REL'), 'HERMANA', 'HERM', '2017-12-13 15:10:17', '2017-12-13 15:10:17');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_REL'), 'PADRE', 'PA', '2017-12-13 15:10:17', '2017-12-13 15:10:17');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_REL'), 'MADRE', 'MA', '2017-12-13 15:10:17', '2017-12-13 15:10:17');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_CARGO'), 'Chofer', 'chof', '2017-12-18 17:39:19', '2017-12-18 17:39:19');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_CARGO'), 'Asistente chofer', 'asisc', '2017-12-18 17:39:19', '2017-12-18 17:39:19');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_DISC'), 'FISICA', 'FIS', '2017-12-19 11:04:51', '2017-12-19 11:04:51');
INSERT INTO gl_clase(tipo,nombre,nombre_corto,createdAt,updatedAt) VALUES (SELECT gl_tipo.id from gl_tipo where nombre_corto = 'RRHH_DISC'), 'SENSORIAL', 'SENS', '2017-12-19 11:04:51', '2017-12-19 11:04:51');

