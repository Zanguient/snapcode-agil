module.exports=function(sequelize,Sequelize){
	var ContabilidadCuentaAuxiliar = sequelize.define('agil_contabilidad_cuenta_auxiliar', {
		id_cuenta: {
			type: Sequelize.INTEGER,
			field: 'cuenta'
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
		id_asiento: {
			type: Sequelize.INTEGER,
			field: 'asiento'
		},		
	}, {
		freezeTableName: true 
		});
	
        ContabilidadCuentaAuxiliar.sync();
	
	return ContabilidadCuentaAuxiliar;
}