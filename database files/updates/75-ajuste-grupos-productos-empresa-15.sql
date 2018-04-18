Insert into gl_clase (id, tipo, nombre, nombre_corto, createdAt, updatedAt, habilitado) values (default, 67, 'Genérico', 'Genérico', now(), now(), 1);

update agil_producto
set grupo = case grupo when 793 then (select max(id) from gl_clase)
else grupo end
where empresa = 15 and grupo in (793);
