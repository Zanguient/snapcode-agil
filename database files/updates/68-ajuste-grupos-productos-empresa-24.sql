update agil_producto
set grupo = case grupo when 737 then 905
when 793 then 906
when 874 then 907 
else grupo end
where empresa = 24 and grupo in (737, 793, 874);