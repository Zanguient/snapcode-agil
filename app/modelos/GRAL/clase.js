module.exports=function(sequelize,Sequelize){
	var Clase = sequelize.define('gl_clase', {
	  id_tipo: {
		type: Sequelize.INTEGER,
		field: 'tipo' 
	  },
	  nombre: {
		type: Sequelize.STRING,
		field: 'nombre' 
	  },
	  nombre_corto:{
		type: Sequelize.STRING,
		field: 'nombre_corto' 
	  },
	  habilitado:{
		type: Sequelize.BOOLEAN,
		field: 'habilitado' 
	  },
	  eliminado:{
		type: Sequelize.BOOLEAN,
		field: 'eliminado' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	Clase.sync().then(function(){
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 1,tipo=1,nombre = 'BENI',nombre_corto='BENI',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 2,tipo=1,nombre = 'CHUQUISACA',nombre_corto='CHUQ',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 3,tipo=1,nombre = 'COCHABAMBA',nombre_corto='CBBA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 4,tipo=1,nombre = 'LA PAZ',nombre_corto='LPZ',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 5,tipo=1,nombre = 'ORURO',nombre_corto='ORU',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 6,tipo=1,nombre = 'PANDO',nombre_corto='PND',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 7,tipo=1,nombre = 'POTOSI',nombre_corto='PTS',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 8,tipo=1,nombre = 'SANTA CRUZ',nombre_corto='SCZ',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 9,tipo=1,nombre = 'TARIJA',nombre_corto='TRJ',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 9,tipo=1,nombre = 'TARIJA',nombre_corto='TRJ',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 10,tipo=2,nombre = 'AIQUILE',nombre_corto='CBBAM',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 11,tipo=2,nombre = 'ALALAY',nombre_corto='CBBAM',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 12,tipo=2,nombre = 'ANZALDO',nombre_corto='CBBAM',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 13,tipo=3,nombre = 'DESARROLLO DE SOFTWARE',nombre_corto='DSW',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 17,tipo=4,nombre = 'CONTADO',nombre_corto='CONT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 18,tipo=4,nombre = 'CREDITO',nombre_corto='CRE',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 19,tipo=5,nombre = 'ALMACEN',nombre_corto='ALM',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 20,tipo=5,nombre = 'VARIOS',nombre_corto='VR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 21,tipo = 6,nombre = 'INGRESO DIARIO',nombre_corto = 'ID',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 22,tipo = 6,nombre = 'INGRESO POR INVENTARIO INICIAL',nombre_corto = 'III',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 23,tipo = 6,nombre = 'INGRESO POR AJUSTE',nombre_corto = 'IPA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 24,tipo = 7,nombre = 'FACTURACIÓN',nombre_corto = 'FACT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 25,tipo = 7,nombre = 'BAJA',nombre_corto = 'BAJA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 26,tipo = 7,nombre = 'PROFORMA',nombre_corto = 'PFR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 27,tipo = 7,nombre = 'TRASPASO',nombre_corto = 'TRAS',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 28,tipo = 7,nombre = 'AJUSTE',nombre_corto = 'AJU',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 29,tipo = 8,nombre = 'VACIA',nombre_corto = 'VAC',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 30,tipo = 8,nombre = 'COMPLETA',nombre_corto = 'COMPL',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 31,tipo = 8,nombre = 'SEMI-COMPLETA',nombre_corto = 'SEMICOMPL',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 32,tipo = 9,nombre = 'NORMAL',nombre_corto = 'NORM',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 33,tipo = 9,nombre = 'FACTURACIÓN POR TERCEROS',nombre_corto = 'FACTTER',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 34,tipo = 9,nombre = 'CONJUNTA',nombre_corto = 'CONJUN',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 35,tipo = 10,nombre = 'OFICIO',nombre_corto = 'OFICIO',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 36,tipo = 10,nombre = 'CARTA',nombre_corto = 'CARTA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 37,tipo = 10,nombre = '1/2 OFICIO',nombre_corto = 'MEDOFI',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 38,tipo = 10,nombre = 'ROLLO',nombre_corto = 'ROLLO',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 39,tipo = 11,nombre = 'FACTURA',nombre_corto = 'TITFACT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 40,tipo = 11,nombre = 'FACTURA POR COMPRAS',nombre_corto = 'TITFACTCOMP',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 41,tipo = 12,nombre = 'DERECHO A CREDITO FISCAL',nombre_corto = 'DERCREFIS',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 42,tipo = 13,nombre = 'Ley N° 453: Si se te ha vulnerado algún derecho puedes exigir la reposición o restauración.',nombre_corto = 'L453',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 43,tipo = 6,nombre = 'INGRESO POR TRASPASO',nombre_corto = 'IPT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 44,tipo = 14,nombre = '2016',nombre_corto = '2016',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 45,tipo = 15,nombre = 'FACTURACIÓN',nombre_corto = 'FACT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 46,tipo = 15,nombre = 'PROFORMA',nombre_corto = 'PROF',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 47,tipo = 15,nombre = 'MIXTO',nombre_corto = 'MIX15',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 48,tipo = 16,nombre = 'SÓLO SUS VENTAS',nombre_corto = 'SSV',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 49,tipo = 16,nombre = 'TODAS LAS VENTAS',nombre_corto = 'TLV',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 50,tipo = 16,nombre = 'DESABILITADO',nombre_corto = 'DSB16',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 51,tipo = 17,nombre = 'CONTADO',nombre_corto = 'CNT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 52,tipo = 17,nombre = 'CREDITO',nombre_corto = 'CRE',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 53,tipo = 17,nombre = 'MIXTO',nombre_corto = 'MIX17',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 54,tipo = 18,nombre = 'LISTA SIMPLE',nombre_corto = 'LS18',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 55,tipo = 18,nombre = 'GRAFICOS',nombre_corto = 'GR18',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 56,tipo = 19,nombre = 'LUNES',nombre_corto = 'LUN19',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 57,tipo = 19,nombre = 'MARTES',nombre_corto = 'MAR19',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 58,tipo = 19,nombre = 'MIERCOLES',nombre_corto = 'MIE19',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 59,tipo = 19,nombre = 'JUEVES',nombre_corto = 'JUE19',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 60,tipo = 19,nombre = 'VIERNES',nombre_corto = 'VIE19',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 61,tipo = 19,nombre = 'SABADO',nombre_corto = 'SAB19',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 62,tipo = 19,nombre = 'DOMINGO',nombre_corto = 'DOM19',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 63,tipo = 20,nombre = 'ONLINE',nombre_corto = 'OAL',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 64,tipo = 6,nombre = 'INGRESO POR DEVOLUCION',nombre_corto = 'IPD',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 65,tipo = 21,nombre = 'PRODUCTO FINAL',nombre_corto = 'PFINAL',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 66,tipo = 21,nombre = 'PRODUCTO INTERMEDIO',nombre_corto = 'PINTER',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 67,tipo = 21,nombre = 'PRODUCTO BASE',nombre_corto = 'PBASE',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 68,tipo = 22,nombre = 'BANCO',nombre_corto = 'DBANCO',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 69,tipo = 22,nombre = 'CAJA',nombre_corto = 'CAJA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 70,tipo = 22,nombre = 'SIGUIENTE TURNO',nombre_corto = 'SIGUIENTETURNO',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 71,tipo = 23,nombre = 'CAJA DE AHORRO',nombre_corto = 'CAH',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 72,tipo = 23,nombre = 'CTA. CTE.',nombre_corto = 'CCO',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 73,tipo = 23,nombre = 'SAFI',nombre_corto = 'SAFI',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 74,tipo = 24,nombre = 'BOLIVIANOS',nombre_corto = 'BOB',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 75,tipo = 24,nombre = 'DOLARES',nombre_corto = 'SUS',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 76,tipo = 24,nombre = 'UFVS',nombre_corto = 'UFV',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 77,tipo = 25,nombre = 'RESERVADO',nombre_corto = 'RE',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 78,tipo = 25,nombre = 'DISPONIBLE',nombre_corto = 'DIS',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 79,tipo = 25,nombre = 'OCUPADO',nombre_corto = 'OCU',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 80,tipo = 26,nombre = 'AL BALANCE GENERAL',nombre_corto = 'ABG',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 81,tipo = 26,nombre = 'AL ESTADO DE RESULTADOS',nombre_corto = 'AER',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 82,tipo = 27,nombre = 'DEUDOR-DEBE',nombre_corto = 'DEDE',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 83,tipo = 27,nombre = 'ACREEDOR-HABER',nombre_corto = 'ACHA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 84,tipo = 27,nombre = 'AMBAS-DEBE Y HABER',nombre_corto = 'ADH',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 85,tipo = 28,nombre = 'GRUPO',nombre_corto = 'TCGRU',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 86,tipo = 28,nombre = 'SUBGRUPO',nombre_corto = 'TCSUBGRU',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 87,tipo = 28,nombre = 'GENERICA',nombre_corto = 'TCGEN',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 88,tipo = 28,nombre = 'APROPIACION',nombre_corto = 'TCAPR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 89,tipo = 29,nombre = 'MULTIPLICACION',nombre_corto = 'X',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 90,tipo = 29,nombre = 'DIVISION',nombre_corto = '/',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 91,tipo = 29,nombre = 'SUMA',nombre_corto = '+',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 92,tipo = 29,nombre = 'RESTA',nombre_corto = '-',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 93,tipo = 30,nombre = 'INGRESO',nombre_corto = 'TCMCING',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 94,tipo = 30,nombre = 'EGRESO',nombre_corto = 'TCMCEGR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 95,tipo = 30,nombre = 'CAJA CHICA',nombre_corto = 'TCMCCCH',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 96,tipo = 30,nombre = 'TRASPASO',nombre_corto = 'TCMCTRA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 97,tipo = 31,nombre = 'MASCULINO',nombre_corto = 'M',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 98,tipo = 31,nombre = 'FEMENINO',nombre_corto = 'F',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 99,tipo = 32,nombre = 'ANALISIS DE SANGRE',nombre_corto = 'ANALISISANGRE',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 100,tipo = 32,nombre = 'ALERGIAS',nombre_corto = 'ALERGIAS',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 101,tipo = 33,nombre = 'CONTROL SANITARIO',nombre_corto = 'CS',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 102,tipo = 34,nombre = 'PREVENTIVO',nombre_corto = 'PRE',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 103,tipo = 34,nombre = 'CORRECTIVO',nombre_corto = 'CORR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 104,tipo = 35,nombre = 'MOTOR',nombre_corto = 'MOT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 105,tipo = 35,nombre = 'TREN PROPULSOR',nombre_corto = 'TPR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 106,tipo = 35,nombre = 'RINES, LLANTAS Y FRENOS',nombre_corto = 'RLLF',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 107,tipo = 35,nombre = 'SUSPENCION DEL AUTO',nombre_corto = 'SDA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 108,tipo = 35,nombre = 'DIRECCION',nombre_corto = 'DIR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 109,tipo = 35,nombre = 'SISTEMA ELECTRICO',nombre_corto = 'SEO',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 110,tipo = 35,nombre = 'CARROCERIA Y CHASIS',nombre_corto = 'CYC',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 111,tipo = 36,nombre = 'ALTA',nombre_corto = 'ALTA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 112,tipo = 36,nombre = 'MEDIA',nombre_corto = 'MEDIA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 113,tipo = 36,nombre = 'BAJA',nombre_corto = 'BAJA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 114,tipo = 37,nombre = 'MECÁNICA',nombre_corto = 'MEC',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 115,tipo = 37,nombre = 'ELECTRÓNICA',nombre_corto = 'ELEC',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 116,tipo = 37,nombre = 'CHAPERIA',nombre_corto = 'CHA',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 117,tipo = 34,nombre = 'RUTINA',nombre_corto = 'RUT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
		sequelize.query("INSERT IGNORE INTO gl_clase SET id = 118,tipo = 34,nombre = 'ENTREGA',nombre_corto = 'ENT',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
			
		});
	});
	
	return Clase;
}