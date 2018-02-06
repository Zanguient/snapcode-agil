module.exports=function(sequelize,Sequelize){
	var Aplicacion = sequelize.define('sys_aplicacion', {
	  titulo: {
		type: Sequelize.STRING,
		field: 'titulo' 
	  },
	  atributo_clase: {
		type: Sequelize.STRING,
		field: 'atributo_clase' 
	  },
	  url: {
		type: Sequelize.STRING,
		field: 'url' 
	  },
	  id_padre: {
		type: Sequelize.INTEGER,
		field: 'padre' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	Aplicacion.sync().then(function(){
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 1,titulo = 'CONFIGURACIONES',atributo_clase='fa-tachometer',url='configuraciones',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 2,titulo = 'EMPRESAS',atributo_clase='fa-briefcase',url='empresas',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 3,titulo = 'USUARIOS',atributo_clase='fa-user',url='usuarios',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 4,titulo = 'CLIENTES',atributo_clase='fa-users',url='clientes',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
				});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 5,titulo = 'PROVEEDORES',atributo_clase='fa-calculator',url='proveedores',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 7,titulo = 'PRODUCTOS',atributo_clase='fa-gift',url='productos',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 8,titulo = 'CONCEPTOS',atributo_clase='fa-gift',url='conceptos',padre=1,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 9,titulo = 'SUCURSALES',atributo_clase='fa-home',url='sucursales',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 10,titulo = 'DOSIFICACIONES',atributo_clase='fa-book',url='dosificaciones',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 11,titulo = 'CERT. COD. DE CONTROL',atributo_clase='fa-barcode',url='codigo-control',padre=1,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 12,titulo = 'COMPRAS',atributo_clase='fa-credit-card',url='compras',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 13,titulo = 'INVENTARIO',atributo_clase='fa-cogs',url='inventario',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 14,titulo = 'VENTAS',atributo_clase='fa-newspaper-o',url='ventas',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 15,titulo = 'FACTURAS',atributo_clase='fa-pencil-square-o',url='facturas',padre=1,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 16,titulo = 'REPORTES',atributo_clase='fa-bar-chart-o',url='reportes',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 17,titulo = 'LIBRO DE COMPRAS',atributo_clase='fa-credit-card',url='libro-compras',padre=16,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 18,titulo = 'LIBRO DE VENTAS',atributo_clase='fa-pencil-square-o',url='libro-ventas',padre=16,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 19,titulo = 'REPORTES DE VENTAS',atributo_clase='fa-lightbulb-o',url='ventas-mensuales',padre=16,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 20,titulo = 'ALMACENES',atributo_clase='fa-pencil-square-o',url='reporte-almacenes',padre=16,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 21,titulo = 'REPORTE RÁPIDO ALMACENES',atributo_clase='fa-exchange',url='reporte-rapido-almacenes',padre=16,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 22,titulo = 'ESTADO DE RESULTADOS NO CONTABLE',atributo_clase='fa-check-square-o',url='estado-resultados-no-contable',padre=16,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 23,titulo = 'APP MOVIL',atributo_clase='fa-laptop',url='configuraciones-app',padre=1,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 24,titulo = 'RUTAS',atributo_clase='fa-road',url='rutas',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 25,titulo = 'ESTADO DE CUENTAS CLIENTES',atributo_clase='fa-check-square-o',url='estado-cuentas-cliente',padre=16,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 26,titulo = 'ESTADO DE CUENTAS PROVEEDORES',atributo_clase='fa-check-square-o',url='estado-cuentas-proveedor',padre=16,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 27,titulo = 'SEGUIMIENTO APP',atributo_clase='fa-filter',url='seguimiento-app',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 28,titulo = 'PANTALLAS',atributo_clase='fa-desktop',url='pantallas',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 29,titulo = 'PANTALLA CLIENTE',atributo_clase='fa-users',url='pantalla-cliente',padre=28,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 30,titulo = 'PANTALLA DESPACHO',atributo_clase='fa-building',url='pantalla-despacho',padre=28,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 31,titulo = 'BANCOS',atributo_clase='fa-eye',url='bancos',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 32,titulo = 'CIERRES DE CAJA',atributo_clase='fa-lock',url='cierres-caja',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 33,titulo = 'MESAS',atributo_clase='fa-cutlery',url='mesa',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 34,titulo = 'COTIZACIONES',atributo_clase='fa-map-pin',url='cotizacion',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 35,titulo = 'PLAN DE CUENTAS',atributo_clase='fa-sort-amount-asc',url='contabilidad-cuenta',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 36,titulo = 'COMPROBANTES',atributo_clase='fa-folder-o',url='comprobantes',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 37,titulo = 'PACIENTES',atributo_clase='fa-eyedropper',url='pacientes',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 38,titulo = 'VEHICULOS',atributo_clase='fa-truck',url='vehiculos',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 39,titulo = 'RRHH',atributo_clase='fa-users',url='rrhh',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 40,titulo = 'SOLICITUD DE VÍVERES',atributo_clase='fa-lemon-o',url='operaciones',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 41,titulo = 'DESPACHOS',atributo_clase='fa-bookmark',url='despachos',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 42,titulo = 'DESPACHO',atributo_clase='fa-bookmark',url='gtm-despachos',padre=41,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 43,titulo = 'TRANSPORTISTA',atributo_clase='fa-bookmark',url='gtm-transportista',padre=41,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 44,titulo = 'TIPO ESTIBAJE',atributo_clase='fa-bookmark',url='gtm-estibaje',padre=41,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 45,titulo = 'GRUPO ESTIBAJE',atributo_clase='fa-bookmark',url='gtm-grupo-estibaje',padre=41,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 46,titulo = 'DESTINOS',atributo_clase='fa-bookmark',url='gtm-destino',padre=41,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
		sequelize.query("INSERT IGNORE INTO sys_aplicacion SET id = 47,titulo = 'PROFORMAS',atributo_clase='fa-file-powerpoint-o',url='proformas',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_application");
		});
	});
	
	return Aplicacion;
}