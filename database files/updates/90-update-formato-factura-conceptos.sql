INSERT INTO gl_tipo (nombre, nombre_corto, createdAt, updatedAt) VALUES ('FORMATO IMPRESION_FACTURA', 'FORM_IMP_FAC', '2018-07-25 10:00:17', '2018-07-25 10:00:23');

INSERT INTO gl_clase (tipo, nombre, nombre_corto, createdAt, updatedAt) VALUES ((select max(id) from gl_tipo), 'FORMATO CON MARGEN', 'FORM_C_MAR', '2018-07-25 10:02:03', '2018-07-25 10:02:06');
INSERT INTO gl_clase (tipo, nombre, nombre_corto, createdAt, updatedAt) VALUES ((select max(id) from gl_tipo), 'FORMATO SIN MARGEN', 'FORM_S_MAR', '2018-07-25 10:02:03', '2018-07-25 10:02:06');



UPDATE agil_configuracion_general_factura SET formato_papel_factura = (SELECT id
                                                                        FROM gl_clase
                                                                        WHERE nombre_corto = 'FORM_C_MAR')