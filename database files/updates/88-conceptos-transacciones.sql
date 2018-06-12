insert into gl_tipo (id, nombre, nombre_corto, createdAt, updatedAt, empresa) values (default, 'ESTADO TRANSACCION', 'ESTRANS', now(), now(), 1);

insert into gl_clase (id, tipo, nombre, nombre_corto, createdAt, updatedAt, habilitado) values (default, (select max(id) from gl_tipo), 'EN TRÁNSITO', 'EN TRÁNSITO', now(), now(), 1);
insert into gl_clase (id, tipo, nombre, nombre_corto, createdAt, updatedAt, habilitado) values (default, (select max(id) from gl_tipo), 'CONFIRMADO', 'CONFIRMADO', now(), now(), 1);

insert into gl_tipo (id, nombre, nombre_corto, createdAt, updatedAt, empresa) values (default, 'TIPO DOCUMENTO CONTABLE', 'TDC', now(), now(), 1);

insert into gl_clase (id, tipo, nombre, nombre_corto, createdAt, updatedAt, habilitado) values (default, (select max(id) from gl_tipo), 'CHEQUE', 'CHEQUE', now(), now(), 1);
insert into gl_clase (id, tipo, nombre, nombre_corto, createdAt, updatedAt, habilitado) values (default, (select max(id) from gl_tipo), 'LETRA DE CAMBIO', 'LETRA_CAMBIO', now(), now(), 1);

insert into gl_tipo (id, nombre, nombre_corto, createdAt, updatedAt, empresa) values (default, 'CONCEPTO TRANSACCION', 'CONTRAN', now(), now(), 1);