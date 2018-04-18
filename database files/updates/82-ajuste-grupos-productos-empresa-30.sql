update agil_producto
set grupo = case grupo when 737 then 929
else grupo end
where empresa = 30 and grupo in (737);