update agil_producto
set grupo = case grupo when 793 then 889
when 874 then 981
else grupo end
where empresa = 20 and grupo in (793, 874);