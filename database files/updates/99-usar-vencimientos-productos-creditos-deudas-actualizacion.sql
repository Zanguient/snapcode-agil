update agil_empresa
set usar_vencimiento_productos = case usar_vencimientos when 1 then 1
when 0 then 0
else 0
end,
usar_vencimiento_creditos = case usar_vencimientos when 1 then 1
when 0 then 0
else 0
end,
usar_vencimiento_deudas = case usar_vencimientos when 1 then 1
when 0 then 0
else 0
end