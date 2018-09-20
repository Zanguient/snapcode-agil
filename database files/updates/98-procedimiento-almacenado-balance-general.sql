DELIMITER $$
CREATE PROCEDURE balanceGeneralEEFF (IN idEmpresa INTEGER,IN cuentaActivo TINYINT(1),IN idtipoCuenta INT(11))
BEGIN
SELECT
	`agil_contabilidad_cuenta`.`id`,
	`agil_contabilidad_cuenta`.`empresa` AS `id_empresa`,
	`agil_contabilidad_cuenta`.`codigo`,
	`agil_contabilidad_cuenta`.`nombre`,
	`agil_contabilidad_cuenta`.`saldo`,	
	`agil_contabilidad_cuenta`.`eliminado`,
	`agil_contabilidad_cuenta`.`tipo_especifica`,
	`cuenta`.`id` AS `cuenta.id`,
	`cuenta.comprobante`.`fecha` AS `cuentaComprobanteFecha`,
`clasificacion.tipoClasificacion`.`nombre` AS `clasificacionTipoClasificacionNombre`,
`tipoCuenta`.`nombre` AS `tipoCuentaNombre`
FROM
	`agil_contabilidad_cuenta` AS `agil_contabilidad_cuenta`
LEFT OUTER JOIN `agil_asiento_contabilidad` AS `cuenta` ON `agil_contabilidad_cuenta`.`id` = `cuenta`.`cuenta`
LEFT OUTER JOIN `agil_comprobante_contabilidad` AS `cuenta.comprobante` ON `cuenta`.`comprobante` = `cuenta.comprobante`.`id`
LEFT OUTER JOIN `agil_contabilidad_clasificacion_cuenta` AS `clasificacion` ON `agil_contabilidad_cuenta`.`clasificacion` = `clasificacion`.`id`
LEFT OUTER JOIN `gl_clase` AS `clasificacion.tipoClasificacion` ON `clasificacion`.`tipo` = `clasificacion.tipoClasificacion`.`id`
INNER JOIN `gl_clase` AS `tipoCuenta` ON `agil_contabilidad_cuenta`.`tipo_cuenta` = `tipoCuenta`.`id`
AND `tipoCuenta`.`id` = idtipoCuenta
WHERE
	`agil_contabilidad_cuenta`.`eliminado` = FALSE
AND `agil_contabilidad_cuenta`.`cuenta_activo` = cuentaActivo
AND `agil_contabilidad_cuenta`.`empresa` = idEmpresa;
END $$
DELIMITER $$

DELIMITER $$
CREATE PROCEDURE balanceGeneralEEFFCuentasFijas (IN idEmpresa INTEGER,IN cuentaActivo TINYINT(1),IN idtipoCuenta INT(11), IN fechaInicio VARCHAR(250), IN fechaFin VARCHAR(250))
BEGIN
SELECT
	`agil_contabilidad_cuenta`.`id`,
	`agil_contabilidad_cuenta`.`empresa` AS `id_empresa`,
	`agil_contabilidad_cuenta`.`codigo`,
	`agil_contabilidad_cuenta`.`nombre`,
	`agil_contabilidad_cuenta`.`saldo`,	
	`agil_contabilidad_cuenta`.`eliminado`,
	`agil_contabilidad_cuenta`.`tipo_especifica`,
	`cuenta`.`id` AS `cuenta.id`,
	`cuenta.comprobante`.`fecha` AS `cuentaComprobanteFecha`,
`clasificacion.tipoClasificacion`.`nombre` AS `clasificacionTipoClasificacionNombre`,
`tipoCuenta`.`nombre` AS `tipoCuentaNombre`
FROM
	`agil_contabilidad_cuenta` AS `agil_contabilidad_cuenta`
LEFT OUTER JOIN `agil_asiento_contabilidad` AS `cuenta` ON `agil_contabilidad_cuenta`.`id` = `cuenta`.`cuenta`
LEFT OUTER JOIN `agil_comprobante_contabilidad` AS `cuenta.comprobante` ON `cuenta`.`comprobante` = `cuenta.comprobante`.`id`
LEFT OUTER JOIN `agil_contabilidad_clasificacion_cuenta` AS `clasificacion` ON `agil_contabilidad_cuenta`.`clasificacion` = `clasificacion`.`id`
LEFT OUTER JOIN `gl_clase` AS `clasificacion.tipoClasificacion` ON `clasificacion`.`tipo` = `clasificacion.tipoClasificacion`.`id`
INNER JOIN `gl_clase` AS `tipoCuenta` ON `agil_contabilidad_cuenta`.`tipo_cuenta` = `tipoCuenta`.`id`
AND `tipoCuenta`.`id` = idtipoCuenta
WHERE
	`agil_contabilidad_cuenta`.`eliminado` = FALSE
AND `agil_contabilidad_cuenta`.`cuenta_activo` = cuentaActivo
AND `agil_contabilidad_cuenta`.`empresa` = idEmpresa
and `cuenta.comprobante`.fecha BETWEEN FechaInicio and fechaFin;
END $$
DELIMITER $$