BEGIN
	DECLARE doneEmpresas INT DEFAULT FALSE;
  DECLARE id_emp INT;
  DECLARE empresas CURSOR FOR select id from agil.agil_empresa;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET doneEmpresas = TRUE;

  OPEN empresas;

	readEmpresas_loop: LOOP

	FETCH empresas INTO id_emp;
		IF doneEmpresas THEN
			LEAVE readEmpresas_loop;
		END IF;

		BLOCK2: BEGIN
			DECLARE donegrupos INT DEFAULT FALSE;
			DECLARE id_clase INT;
			DECLARE nombre_subgrupo VARCHAR(255);
			DECLARE subgrupos CURSOR FOR select agil.gl_clase.id,agil.gl_clase.nombre from agil.gl_clase,agil.gl_tipo where agil.gl_tipo.empresa=id_emp and agil.gl_clase.tipo=agil.gl_tipo.id and agil.gl_tipo.nombre="SUBGRUPOS PRODUCTOS";
			DECLARE CONTINUE HANDLER FOR NOT FOUND SET donegrupos = TRUE;

			OPEN subgrupos;

			readgrupo_loop: LOOP
				FETCH subgrupos INTO id_clase,nombre_subgrupo;
				IF donegrupos THEN
					LEAVE readgrupo_loop;
				END IF;

				UPDATE agil.agil_producto SET subgrupo=id_clase where subgrupo=CONVERT(nombre_subgrupo using utf8) collate utf8_spanish_ci;
				
			END LOOP;
			CLOSE subgrupos;
		END BLOCK2;
	END LOOP;
  CLOSE empresas;
END