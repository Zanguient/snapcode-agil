update agil_producto
set grupo = case when 737 then 905
when 793 then 906
when 874 then 907 end
where empresa = 24