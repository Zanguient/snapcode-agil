Insert into gl_clase (id, tipo, nombre, nombre_corto, createdAt, updatedAt, habilitado) values (default, 57, 'CEMENTO', 'CEMENTO', now(), now(), 1);

update agil_producto
set grupo = case grupo when 737 then 748
when 738 then 768
when 1220 then (select max(id) from gl_clase)
else grupo
end
where empresa = 1 and grupo in (737, 738, 1220);

