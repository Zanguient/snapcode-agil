module.exports=function(sequelize,Sequelize){
	var ContabilidadCuenta = sequelize.define('agil_contabilidad_cuenta', {
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		codigo: {
			type: Sequelize.STRING,
			field: 'codigo'
		},	
		nombre: {
			type: Sequelize.STRING,
			field: 'nombre'
		},
		descripcion: {
			type: Sequelize.STRING,
			field: 'descripcion'
		},
		debe: {
			type: Sequelize.DECIMAL(20,4),
			field: 'debe'
		},
		haber: {
			type: Sequelize.DECIMAL(20,4),
			field: 'haber'
		},
		saldo: {
			type: Sequelize.DECIMAL(20,4),
			field: 'saldo'
		},
		id_clasificacion: {
			type: Sequelize.INTEGER,
			field: 'clasificacion'
		},
		id_tipo_cuenta: {
			type: Sequelize.INTEGER,
			field: 'tipo_cuenta'
		},
		bimonetaria: {
			type: Sequelize.BOOLEAN,
			field: 'bimonetaria'
		},		
		aplicar_calculo: {
			type: Sequelize.BOOLEAN,
			field: 'aplicar_calculo'
		},
		id_calculo: {
			type: Sequelize.INTEGER,
			field: 'calculo'
		},
		monto: {
			type: Sequelize.DECIMAL(20,4),
			field: 'monto'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		}
	}, {
		freezeTableName: true 
		});
	
	ContabilidadCuenta.sync();
	
	return ContabilidadCuenta;
}