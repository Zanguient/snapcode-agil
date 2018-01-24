module.exports = function (sequelize, Sequelize) {
	var RrhhEmpleadoPrestamoPago = sequelize.define('agil_rrhh_empleado_prestamo_pago', {
		id_prestamo: {
			type: Sequelize.INTEGER,
			field: 'prestamo'
		},
		fecha: {
			type: Sequelize.DATE,
			field: 'fecha'
		},
		monto_pagado: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'monto_pagado'
		},
		saldo_anterior: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'saldo_anterior'
		},
		a_cuenta_anterior: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'a_cuenta_anterior'
		},
		id_usuario: {
			type: Sequelize.INTEGER,
			field: 'usuario'
		},
	}, {
			freezeTableName: true
		});

		RrhhEmpleadoPrestamoPago.sync().then(function () {

	});

	return RrhhEmpleadoPrestamoPago;
}