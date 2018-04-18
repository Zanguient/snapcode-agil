Insert into gl_clase (id, tipo, nombre, nombre_corto, createdAt, updatedAt, habilitado) values (default, 78, 'CARNES Y FIAMBRES', 'CARNES Y FIAMBRES', now(), now(), 1);

update agil_producto
set grupo = case grupo when 904 then 772
when 772 then (select max(id) from gl_clase)
else grupo end
where empresa = 28 and grupo in (904, 772);