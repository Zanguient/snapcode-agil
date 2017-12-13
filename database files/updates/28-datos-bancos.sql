INSERT IGNORE INTO gl_tipo SET nombre = 'DESTINOS CAJA',nombre_corto='DC',createdAt = NOW(),updatedAt = NOW();
INSERT IGNORE INTO gl_tipo SET nombre = 'TIPOS CUENTA BANCARIA',nombre_corto='TCB',createdAt = NOW(),updatedAt = NOW();
INSERT IGNORE INTO gl_tipo SET nombre = 'TIPOS MONEDAS',nombre_corto='TM',createdAt = NOW(),updatedAt = NOW();

INSERT IGNORE INTO gl_clase SET tipo = 38,nombre = 'BANCO',nombre_corto = 'DBANCO',createdAt = NOW(),updatedAt = NOW();
INSERT IGNORE INTO gl_clase SET tipo = 38,nombre = 'CAJA',nombre_corto = 'CAJA',createdAt = NOW(),updatedAt = NOW();
INSERT IGNORE INTO gl_clase SET tipo = 38,nombre = 'SIGUIENTE TURNO',nombre_corto = 'SIGUIENTETURNO',createdAt = NOW(),updatedAt = NOW();
INSERT IGNORE INTO gl_clase SET tipo = 39,nombre = 'CAJA DE AHORRO',nombre_corto = 'CAH',createdAt = NOW(),updatedAt = NOW();
INSERT IGNORE INTO gl_clase SET tipo = 39,nombre = 'CTA. CTE.',nombre_corto = 'CCO',createdAt = NOW(),updatedAt = NOW();
INSERT IGNORE INTO gl_clase SET tipo = 39,nombre = 'SAFI',nombre_corto = 'SAFI',createdAt = NOW(),updatedAt = NOW();
INSERT IGNORE INTO gl_clase SET tipo = 40,nombre = 'BOLIVIANOS',nombre_corto = 'BOB',createdAt = NOW(),updatedAt = NOW();
INSERT IGNORE INTO gl_clase SET tipo = 40,nombre = 'DOLARES',nombre_corto = 'SUS',createdAt = NOW(),updatedAt = NOW();
INSERT IGNORE INTO gl_clase SET tipo = 40,nombre = 'UFVS',nombre_corto = 'UFV',createdAt = NOW(),updatedAt = NOW();