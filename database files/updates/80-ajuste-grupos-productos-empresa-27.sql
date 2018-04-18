update agil_producto
set grupo = case grupo when 737 then 918
else grupo end
where empresa = 27 and grupo in (737);