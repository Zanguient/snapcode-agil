update agil_moneda_tipo_cambio
set empresa = 35;

insert into agil_moneda_tipo_cambio (fecha, ufv, dolar, createdAt, updatedAt, empresa)
select fecha, ufv, dolar, now(), now(), 1 from agil_moneda_tipo_cambio where empresa = 35;

insert into agil_moneda_tipo_cambio (fecha, ufv, dolar, createdAt, updatedAt, empresa)
select fecha, ufv, dolar, now(), now(),17 from agil_moneda_tipo_cambio where empresa = 35;

insert into agil_moneda_tipo_cambio (fecha, ufv, dolar, createdAt, updatedAt, empresa)
select fecha, ufv, dolar, now(), now(), 41 from agil_moneda_tipo_cambio where empresa = 35;

insert into agil_moneda_tipo_cambio (fecha, ufv, dolar, createdAt, updatedAt, empresa)
select fecha, ufv, dolar, now(), now(), 42 from agil_moneda_tipo_cambio where empresa = 35;