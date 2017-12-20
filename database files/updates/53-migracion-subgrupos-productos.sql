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
		DECLARE done INT DEFAULT FALSE;
		DECLARE id_producto INT;
		DECLARE id_empresa INT;
		DECLARE grupog VARCHAR(255);
		DECLARE subgrupog VARCHAR(255);
		DECLARE productos CURSOR FOR select id,empresa,grupo,subgrupo from agil.agil_producto where empresa=id_emp GROUP BY subgrupo;
		DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

		OPEN productos;

		read_loop: LOOP
			FETCH productos INTO id_producto,id_empresa,grupog,subgrupog;
			IF done THEN
				LEAVE read_loop;
			END IF;
					
			BLOCK3: BEGIN
			DECLARE doneGruposTipos INT DEFAULT FALSE;
			DECLARE count_clase INT DEFAULT 0;
			DECLARE gruposTipo CURSOR FOR select agil.gl_clase.id,tipo,agil.gl_clase.nombre from agil.gl_clase,agil.gl_tipo where agil.gl_clase.nombre=CONVERT(subgrupog using utf8) collate utf8_spanish_ci and agil.gl_tipo.nombre=CONVERT("SUBGRUPOS PRODUCTOS" using utf8) collate utf8_spanish_ci and agil.gl_clase.tipo=agil.gl_tipo.id and agil.gl_tipo.empresa=id_empresa;		
			DECLARE CONTINUE HANDLER FOR NOT FOUND SET doneGruposTipos = TRUE;

			OPEN gruposTipo;

			select FOUND_ROWS() into count_clase ;
			CLOSE gruposTipo;
			IF count_clase=0 THEN
				BLOCK4: BEGIN
					DECLARE donetipoDato INT DEFAULT FALSE;
					DECLARE id_tipo INT;
					DECLARE tipoDato CURSOR FOR select id from agil.gl_tipo where agil.gl_tipo.nombre=CONVERT("SUBGRUPOS PRODUCTOS" using utf8) collate utf8_spanish_ci and agil.gl_tipo.empresa=id_empresa;
					DECLARE CONTINUE HANDLER FOR NOT FOUND SET donetipoDato = TRUE;

					OPEN tipoDato;

					readtipoDato_loop: LOOP
						FETCH tipoDato INTO id_tipo;
						IF donetipoDato THEN
							LEAVE readtipoDato_loop;
						END IF;

						INSERT INTO agil.gl_clase SET tipo=id_tipo, nombre=subgrupog, nombre_corto='SUBGRUPO_PRODUCTO',createdAt=Now(),updatedAt=Now();

						
					END LOOP;
					CLOSE tipoDato;
				END BLOCK4;


			

				
			END IF;

			
			END BLOCK3;

			
		END LOOP;
		CLOSE productos;
		END BLOCK2;

	END LOOP;
CLOSE empresas;
END