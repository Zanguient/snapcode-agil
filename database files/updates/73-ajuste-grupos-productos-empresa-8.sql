update agil_producto
set grupo = case grupo when 737 then 853
when 844 then 854
when 815 then 858
else grupo end
where empresa = 8 and grupo in (737, 844, 815);