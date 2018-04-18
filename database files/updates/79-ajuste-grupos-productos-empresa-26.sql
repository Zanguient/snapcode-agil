update agil_producto
set grupo = case grupo when 744 then 916
when 738 then 911
when 815 then 912
else grupo end
where empresa = 26 and grupo in (744, 738, 815);