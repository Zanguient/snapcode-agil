module.exports=function(sequelize,Sequelize){
	var EstadoFinancieroConfiguracionImpresion = sequelize.define('agil_estado_financiero_confituracion_impresion', {
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa' 
	  },
	  lugar_emision: {
		type: Sequelize.STRING,
		field: 'lugar_emision'
	  },
	  fecha_emision: {
		type: Sequelize.DATE,
		field: 'fecha_emision' 
	  },
	  id_tipo_numeracion: {
		type: Sequelize.INTEGER,
		field: 'tipo_numeracion'
	  },
	  empesar_numeracion: {
		type: Sequelize.INTEGER,
		field: 'empesar_numeracion'
	  },
	  firma_uno: {
		type: Sequelize.STRING,
		field: 'firma_uno'
	  },
	  cargo_uno: {
		type: Sequelize.STRING,
		field: 'cargo_uno'
	  },
	  firma_dos: {
		type: Sequelize.STRING,
		field: 'firma_dos'
	  },
	  cargo_dos: {
		type: Sequelize.STRING,
		field: 'cargo_dos'
	  },
	  frase_pie_pagina: {
		type: Sequelize.STRING,
		field: 'frase_pie_pagina'
	  },
	  usar_lugar_emision: {
		type: Sequelize.BOOLEAN,
		field: 'usar_lugar_emision'
	  },
	  usar_fecha_emision: {
		type: Sequelize.BOOLEAN,
		field: 'usar_fecha_emision'
	  },
	  usar_tipo_numeracion: {
		type: Sequelize.BOOLEAN,
		field: 'usar_tipo_numeracion'
	  },
	  usar_empesar_numeracion: {
		type: Sequelize.BOOLEAN,
		field: 'usar_empesar_numeracion'
	  },
	  usar_firma_uno: {
		type: Sequelize.BOOLEAN,
		field: 'usar_firma_uno'
	  },
	  usar_firma_dos: {
		type: Sequelize.BOOLEAN,
		field: 'usar_firma_dos'
	  },
	  usar_frase_pie_pagina: {
		type: Sequelize.BOOLEAN,
		field: 'usar_frase_pie_pagina'
	  }
      
	}, {
	  freezeTableName: true 
	});
	
	EstadoFinancieroConfiguracionImpresion.sync().then(function(){
		
	});
	
	return EstadoFinancieroConfiguracionImpresion;
}