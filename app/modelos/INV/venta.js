module.exports = function (sequelize, Sequelize) {
	var Venta = sequelize.define('inv_venta', {
		id_almacen: {
			type: Sequelize.INTEGER,
			field: 'almacen'
		},
		id_actividad: {
			type: Sequelize.INTEGER,
			field: 'actividad'
		},
		id_cliente: {
			type: Sequelize.INTEGER,
			field: 'cliente'
		},
		id_movimiento: {
			type: Sequelize.INTEGER,
			field: 'movimiento'
		},
		factura: {
			type: Sequelize.BIGINT,
			field: 'factura'
		},
		autorizacion: {
			type: Sequelize.BIGINT,
			field: 'autorizacion'
		},
		fecha: {
			type: Sequelize.DATE,
			field: 'fecha'
		},
		fecha_limite_emision: {
			type: Sequelize.DATE,
			field: 'fecha_limite_emision'
		},
		codigo_control: {
			type: Sequelize.STRING,
			field: 'codigo_control'
		},
		importe: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'importe'
		},
		importe_dolares: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'importe_dolares'
		},
		id_tipo_pago: {
			type: Sequelize.INTEGER,
			field: 'tipo_pago'
		},
		dias_credito: {
			type: Sequelize.INTEGER,
			field: 'dias_credito'
		},
		a_cuenta: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'a_cuenta'
		},
		saldo: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'saldo'
		},
		total: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'total'
		},
		total_dolares: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'total_dolares'
		},
		id_usuario: {
			type: Sequelize.INTEGER,
			field: 'usuario'
		},
		pagado: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'pagado'
		},
		cambio: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'cambio'
		},
		activa: {
			type: Sequelize.BOOLEAN,
			field: 'activa'
		},
		id_almacen_traspaso: {
			type: Sequelize.INTEGER,
			field: 'almacen_traspaso'
		},
		pedido: {
			type: Sequelize.INTEGER,
			field: 'pedido'
		},
		despachado: {
			type: Sequelize.BOOLEAN,
			field: 'despachado'
		},
		id_cierre_caja: {
			type: Sequelize.INTEGER,
			field: 'cierre_caja'
		},
		id_vendedor: {
			type: Sequelize.INTEGER,
			field: 'vendedor'
		},
		contabilizado: {
			type: Sequelize.BOOLEAN,
			field: 'contabilizado',
			defaultValue: false
		},
		usar_servicios: {
			type: Sequelize.BOOLEAN,
			field: 'usar_servicios',
			defaultValue: false
		},
		observacion: {
			type: Sequelize.STRING,
			field: 'observacion',
		},
		id_tipo_movimiento: {
			type: Sequelize.INTEGER,
			field: 'tipo_movimiento',
		},
		id_sucursal: {
			type: Sequelize.INTEGER,
			field: 'sucursal',
		},
		total_descuento: {
			type: Sequelize.DECIMAL(20,4),
			field: 'descuento_general',
			defaultValue: 0
		},
		total_recargo: {
			type: Sequelize.DECIMAL(20,4),
			field: 'total_recargo',
			defaultValue: 0
		},
		total_ice: {
			type: Sequelize.DECIMAL(20,4),
			field: 'total_ice',
			defaultValue: 0
		},
		total_exento: {
			type: Sequelize.DECIMAL(20,4),
			field: 'total_exento',
			defaultValue: 0
		}
	}, {
			freezeTableName: true
		});

	Venta.sync().then(function () {

	});

	return Venta;
}