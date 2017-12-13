module.exports=function(sequelize,Sequelize){
	var Rol = sequelize.define('sys_rol', {
	  nombre: {
		type: Sequelize.STRING,
		field: 'nombre' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	Rol.sync().then(function(){
		sequelize.query("INSERT IGNORE INTO sys_rol SET id = 1,nombre = 'SUPER-ADMINISTRADOR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_rol");
		});
		sequelize.query("INSERT IGNORE INTO sys_rol SET id = 2,nombre = 'ADMINISTRADOR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_rol");
		});
		sequelize.query("INSERT IGNORE INTO sys_rol SET id = 3,nombre = 'OPERADOR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_rol");
		});
		sequelize.query("INSERT IGNORE INTO sys_rol SET id = 4,nombre = 'VENDEDOR',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_rol");
		});
		sequelize.query("INSERT IGNORE INTO sys_rol SET id = 5,nombre = 'ERP',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in sys_rol");
		});		
	});
	
	return Rol;
}