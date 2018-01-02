module.exports=function(sequelize,Sequelize){
	var Tipo = sequelize.define('gl_tipo', {
	  nombre: {
		type: Sequelize.STRING,
		field: 'nombre' 
	  },
	  nombre_corto:{
		type: Sequelize.STRING,
		field: 'nombre_corto' 
	  },
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	Tipo.sync().then(function(){
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 1,nombre = 'DEPARTAMENTO',nombre_corto='DEP',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 2,nombre = 'MUNICIPIO',nombre_corto='MUN',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 3,nombre = 'ACTIVIDADES COMERCIALES',nombre_corto='ACTCOM',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 4,nombre = 'TIPOS DE PAGO',nombre_corto='TIPA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 5,nombre = 'CENTROS DE COSTO',nombre_corto='CCO',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 6,nombre = 'MOVIMIENTO DE INGRESO',nombre_corto='MOVING',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 7,nombre = 'MOVIMIENTO DE EGRESO',nombre_corto='MOVEGR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 8,nombre = 'IMPRESION FACTURA',nombre_corto='IMPFACT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 9,nombre = 'TIPO FACTURACIÓN',nombre_corto='TIPOFACT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 10,nombre = 'TAMAÑO PAPEL FACTURA',nombre_corto='TAMPAPFACT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 11,nombre = 'TÍTULO FACTURA',nombre_corto='TITFACT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 12,nombre = 'SUBTÍTULO FACTURA',nombre_corto='SUBTITFACT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 13,nombre = 'PIÉ FACTURA',nombre_corto='PIÉFACT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 14,nombre = 'GESTIÓN',nombre_corto='GTN',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 15,nombre = 'MOVIMIENTO DE EGRESO APP',nombre_corto='MEA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 16,nombre = 'COBROS APP',nombre_corto='COA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 17,nombre = 'TIPOS DE PAGO APP',nombre_corto='TPA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 18,nombre = 'LISTADO PRODUCTOS APP',nombre_corto='LPA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 19,nombre = 'DIAS',nombre_corto='DIAS',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 20,nombre = 'ORIGEN ALMACENAMIENTO', nombre_corto = 'OAL',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 21,nombre = 'TIPOS PRODUCTOS',nombre_corto='TPS',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 22,nombre = 'DESTINOS CAJA',nombre_corto='DC',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 23,nombre = 'TIPOS CUENTA BANCARIA',nombre_corto='TCB',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 24,nombre = 'TIPOS MONEDAS',nombre_corto='TM',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 25,nombre = 'ESTADO MESAS',nombre_corto='EM',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 26,nombre = 'MOVIMIENTO CLASIFICACION CUENTA',nombre_corto='CONTCLSMOV',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 27,nombre = 'SALDOS CUENTA CONTABILIDAD',nombre_corto='CONTCLSSAL',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 28,nombre = 'TIPOS CUENTA CONTABILIDAD',nombre_corto='TCC',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 29,nombre = 'OPERACIONES ARITMETICAS',nombre_corto='OPE',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 30,nombre = 'TIPO COMPROBANTE CONTABILIDAD',nombre_corto='TCMC',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 31,nombre = 'GENERO',nombre_corto='GNR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 32,nombre = 'PRE REQUISITO',nombre_corto='MLPR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 33,nombre = 'TIPOS DE CONTROL MEDICO',nombre_corto='TCMP',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 34,nombre = 'TIPO DE MANTENIMIENTO',nombre_corto='MTM',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 35,nombre = 'SISTEMAS ORDEN DE TRABAJO',nombre_corto='SOT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 36,nombre = 'TIPO PRIORIDAD MANTENIMIENTO',nombre_corto='TPM',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 37,nombre = 'TIPO ESPECIALIDAD MANTENIMIENTO',nombre_corto='TEM',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 38,nombre = 'EXPEDIDO',nombre_corto='RRHH_EXP',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 39,nombre = 'TIPO EXPEDIDO',nombre_corto='RRHH_TEXP',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 40,nombre = 'ESTADO CIVIL',nombre_corto='RRHH_EC',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 41,nombre = 'NACIONALIDAD',nombre_corto='NAC',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 42,nombre = 'l',nombre_corto='LOC',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 43,nombre = 'TIPO CONTRATO',nombre_corto='RRHH_TC',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 44,nombre = 'TIPO PERSONAL',nombre_corto='RRHH_TP',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 45,nombre = 'CARGA HORARIOS',nombre_corto='RRHH_CH',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 46,nombre = 'AREA',nombre_corto='RRHH_AREA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 47,nombre = 'UBICACION',nombre_corto='RRHH_UBI',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 48,nombre = 'SEGURO SOCIAL',nombre_corto='RRHH_SS',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 49,nombre = 'LUGAR SEGURO SALUD',nombre_corto='RRHH_LSS',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 50,nombre = 'APORTE SEGURO LARGO PLAZO',nombre_corto='RRHH_ASLP',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 51,nombre = 'OTROS SEGUROS',nombre_corto='RRHH_OST',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 52,nombre = 'BANCO',nombre_corto='RRHH_BAN',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 53,nombre = 'RELACION',nombre_corto='RRHH_REL',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 54,nombre = 'GRADO',nombre_corto='RRHH_GRA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 55,nombre = 'TITULO',nombre_corto='RRHH_TITL',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 56,nombre = 'INSTITUCION',nombre_corto='RRHH_INST',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 57,nombre = 'TIPO CAPACIDAD',nombre_corto='RRHH_TCIE',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_tipo SET id = 58,nombre = 'TIPO LOGRO',nombre_corto='RRHH_TLIC',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
	});
	
	return Tipo;
}