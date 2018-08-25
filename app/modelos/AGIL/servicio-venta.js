module.exports = function (sequelize, Sequelize) {
	var ServicioVenta = sequelize.define('agil_servicio_venta', {
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		nombre: {
			type: Sequelize.STRING,
			field: 'nombre'
		},
		precio: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'precio'
		},
		descripcion: {
			type: Sequelize.STRING,
			field: 'descripcion'
		},
		descuento: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'descuento'
		},
		descuento_fijo: {
			type: Sequelize.BOOLEAN,
			field: 'descuento_fijo'
		},
		habilitado: {
			type: Sequelize.BOOLEAN,
			field: 'habilitado'
		},		
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		}
	}, {
			freezeTableName: true
		});
	
		ServicioVenta.sync().then(function () {

	});

	return ServicioVenta;
}