UPDATE inv_venta as v 
SET v.fecha_limite_emision =(select d.fecha_limite_emision 
                            from agil_dosificacion as d 
                            where d.autorizacion = v.autorizacion 
                            and d.empresa=1)
where v.sucursal 
is not null;