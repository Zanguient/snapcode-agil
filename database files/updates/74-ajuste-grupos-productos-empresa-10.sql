Insert into gl_clase (id, tipo, nombre, nombre_corto, createdAt, updatedAt, habilitado) values (default, 64, 'BEBIDAS', 'BEBIDAS', now(), now(), 1);

update agil_producto
set grupo = case grupo when 768 then (select max(id) from gl_clase) end
where empresa = 10 and grupo in (768);

Insert into gl_clase (id, tipo, nombre, nombre_corto, createdAt, updatedAt, habilitado) values (default, 64, 'ENVASADOS', 'ENVASADOS', now(), now(), 1);

update agil_producto
set grupo = case grupo when 782 then (select max(id) from gl_clase) end
where empresa = 10 and grupo in (782);