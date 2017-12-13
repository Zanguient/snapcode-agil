ALTER TABLE gl_tipo ADD empresa int;
ALTER TABLE gl_tipo ADD CONSTRAINT fk_empresa_tipo_id FOREIGN KEY (empresa) REFERENCES agil_empresa(id);