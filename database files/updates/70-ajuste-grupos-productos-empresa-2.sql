Insert into gl_clase (id, tipo, nombre, nombre_corto, createdAt, updatedAt, habilitado) values (default, 58, 'CARNES Y FIAMBRES', 'CARNES Y FIAMBRES', now(), now(), 1);

update agil_producto
set grupo = case grupo when 737 then 829
when 793 then 831
when 747 then 828
when 810 then 832
when 772 then (select max(id) from gl_clase) 
else grupo end
where empresa = 2 and grupo in (737, 793, 747, 810, 772);

