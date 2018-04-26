ALTER TABLE sh_dimension_school ADD management int;
ALTER TABLE sh_dimension_school ADD CONSTRAINT fk_dimension_school_management_id FOREIGN KEY (management) REFERENCES gl_instance(id);