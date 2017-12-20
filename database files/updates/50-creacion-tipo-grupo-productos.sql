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

		INSERT INTO agil.gl_tipo SET nombre="GRUPOS PRODUCTOS", nombre_corto='GRUPOS PRODUCTOS',empresa=id_emp,createdAt=Now(),updatedAt=Now();
	END LOOP;
  CLOSE empresas;
END