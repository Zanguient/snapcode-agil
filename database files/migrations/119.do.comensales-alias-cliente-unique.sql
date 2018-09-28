alter table agil_comensales_alias_cliente_empresa add constraint alias_cliente_empresa_codigo unique (cliente, empresa, codigo);
alter table agil_comensales_horario_comidas_cliente_empresa add constraint comensales_horario_comidas unique (cliente, empresa, codigo);
