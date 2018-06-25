module.exports=function(sequelize,Sequelize){
	var Proveedor = sequelize.define('agil_proveedor', {
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa' 
	  },
	  codigo: {
		type: Sequelize.STRING,
		field: 'codigo'
	  },
	  razon_social: {
		type: Sequelize.STRING,
		field: 'razon_social'
	  },
	  nit: {
		type: Sequelize.BIGINT,
		field: 'nit'
	  },
	  direccion: {
		type: Sequelize.STRING,
		field: 'direccion'
	  },
	  telefono1:{
		type: Sequelize.STRING,
		field: 'telefono1'  
	  },
	  telefono2:{
		type: Sequelize.STRING,
		field: 'telefono2'  
	  },
	  telefono3:{
		type: Sequelize.STRING,
		field: 'telefono3'  
	  },
	  contacto:{
		type: Sequelize.STRING,
		field: 'contacto'  
	  },
	  rubro:{
		type: Sequelize.STRING,
		field: 'rubro'  
	  },
	  categoria:{
		type: Sequelize.STRING,
		field: 'categoria'  
	  },
	  ubicacion_geografica:{
		type: Sequelize.STRING,
		field: 'ubicacion_geografica'  
	  },
	  fecha1:{
		type: Sequelize.DATE,
		field: 'fecha1'  
	  },
	  fecha2:{
		type: Sequelize.DATE,
		field: 'fecha2'  
	  },
	  texto1:{
		type: Sequelize.STRING,
		field: 'texto1'  
	  },
	  texto2:{
		type: Sequelize.STRING,
		field: 'texto2'  
		},
		documento_nit: {
			type: Sequelize.STRING,
			field: 'documento_nit'
		},
		documento_funda_empresa: {
			type: Sequelize.STRING,
			field: 'documento_funda_empresa'
		},
		documento_ci: {
			type: Sequelize.STRING,
			field: 'documento_ci'
		},
		documento_licencia_funcionamiento: {
			type: Sequelize.STRING,
			field: 'documento_licencia_funcionamiento'
		},
		documento_seguro_social: {
			type: Sequelize.STRING,
			field: 'documento_seguro_social'
		},
		productos: {
			type: Sequelize.TEXT('long'),
			field: 'productos'
		},
	}, {
	  freezeTableName: true 
	});
	
	Proveedor.sync().then(function(){
		
	});
	
	return Proveedor;
}