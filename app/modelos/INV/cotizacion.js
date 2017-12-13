module.exports=function(sequelize,Sequelize){
	var Cotizacion = sequelize.define('inv_cotizacion', {
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		nombre: {
			type: Sequelize.STRING,
			field: 'nombre'
		},
		descripcion: {
			type: Sequelize.STRING,
			field: 'descripcion'
		},
		numero_documento: {
			type: Sequelize.INTEGER,
			field: 'numero_documento'
		},
		fecha: {
			type: Sequelize.DATE,
			field: 'fecha'
		},
		importe: {
			type: Sequelize.DECIMAL,
			field: 'importe'
		},
		id_usuario: {
			type: Sequelize.INTEGER,
			field: 'id_usuario'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		},
		id_sucursal: {
			type: Sequelize.INTEGER,
			field: 'id_sucursal'
		}
	}, {
		freezeTableName: true 
		});
	
	Cotizacion.sync();
	
	return Cotizacion;
}