update agil_producto
set grupo = case grupo when 737 then 908
else grupo
end
where empresa = 25 and grupo in (737);