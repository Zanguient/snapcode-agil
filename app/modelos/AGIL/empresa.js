module.exports=function(sequelize,Sequelize){
	var Empresa = sequelize.define('agil_empresa', {
	  razon_social: {
		type: Sequelize.STRING,
		field: 'razon_social' 
	  },
	  nit: {
		type: Sequelize.STRING,
		field: 'nit'
	  },
	  imagen: {
		type: Sequelize.STRING,
		field: 'imagen'
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
	  id_departamento:{
		type: Sequelize.INTEGER,
		field: 'departamento'  
	  },
	  id_municipio:{
		type: Sequelize.INTEGER,
		field: 'municipio'  
	  },
	  usar_panel:{
		type: Sequelize.BOOLEAN,
		field: 'usar_panel'  
	  },
	  usar_vencimientos:{
		type: Sequelize.BOOLEAN,
		field: 'usar_vencimientos'  
	  },
	  usar_servicios:{
		type: Sequelize.BOOLEAN,
		field: 'usar_servicios'  
	  },
	  usar_consumos:{
		type: Sequelize.BOOLEAN,
		field: 'usar_consumos'  
	  },
	  usar_descuentos:{
		type: Sequelize.BOOLEAN,
		field: 'usar_descuentos'  
	  },
	  usar_georeferenciacion:{
		type: Sequelize.BOOLEAN,
		field: 'usar_georeferenciacion'  
	  },
	  usar_pedidos:{
		type: Sequelize.BOOLEAN,
		field: 'usar_pedidos'  
	  },
	  usar_pantalla_cliente:{
		type: Sequelize.BOOLEAN,
		field: 'usar_pantalla_cliente'  
	  },
	  usar_pantalla_despacho:{
		type: Sequelize.BOOLEAN,
		field: 'usar_pantalla_despacho'  
	  },
	  usar_mesas:{
		type: Sequelize.BOOLEAN,
		field: 'usar_mesas'  
	  },
	  usar_salas:{
		type: Sequelize.BOOLEAN,
		field: 'usar_salas'  
	  },
	  usar_contabilidad:{
		type: Sequelize.BOOLEAN,
		field: 'usar_contabilidad'  
		},
		usar_medico:{
		type: Sequelize.BOOLEAN,
		field: 'usar_medico'  
	  },
		usar_mantenimiento:{
		type: Sequelize.BOOLEAN,
		field: 'usar_mantenimiento'  
	  },
		usar_cuentas_auxiliares:{
		type: Sequelize.BOOLEAN,
		field: 'usar_cuentas_auxiliares'  
		},
		usar_proformas:{
			type: Sequelize.BOOLEAN,
			field: 'usar_proforma'  
			}
	}, {
	  freezeTableName: true 
	});
	
	Empresa.sync().then(function(){
		
	});
	
	return Empresa;
}