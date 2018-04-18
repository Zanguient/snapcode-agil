update agil_producto
set grupo = case grupo when 742 then 956
when 738 then 942
when 739 then 943 
else grupo end
where empresa = 19 and grupo in (742, 738, 739);