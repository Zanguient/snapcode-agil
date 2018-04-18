update agil_producto
set grupo = case grupo when 737 then 930
else grupo end
where empresa = 33 and grupo in (737);