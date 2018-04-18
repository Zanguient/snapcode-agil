update agil_producto
set grupo = case grupo when 838 then 848
when 741 then 846
when 743 then 849 
else grupo end
where empresa = 7 and grupo in (838, 741, 743);