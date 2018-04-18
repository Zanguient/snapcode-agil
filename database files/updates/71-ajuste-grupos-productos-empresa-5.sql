update agil_producto
set grupo = case grupo when 737 then 834
when 804 then 836 
else grupo end
where empresa = 5 and grupo in (737, 804);