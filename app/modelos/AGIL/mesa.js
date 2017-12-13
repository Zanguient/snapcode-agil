module.exports=function(sequelize,Sequelize){
	var Mesa = sequelize.define('agil_mesa', {
	  numero: {
		type: Sequelize.INTEGER,
		field: 'numero'
	  },
	  id_estado: {
		type: Sequelize.INTEGER,
		field: 'estado' 
	  },
	  imagen: {
		type: Sequelize.STRING,
		field: 'imagen'
	  },
	  id_sala: {
		type: Sequelize.INTEGER,
		field: 'sala' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	Mesa.sync().then(function(){
		sequelize.query("INSERT IGNORE INTO agil_mesa SET id = 1,sala=1,estado=659,numero=1,imagen='img/table.png',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		});
		sequelize.query("INSERT IGNORE INTO agil_mesa SET id = 2,sala=1,estado=659,numero=2,imagen='img/table.png',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		});
		sequelize.query("INSERT IGNORE INTO agil_mesa SET id = 3,sala=1,estado=659,numero=3,imagen='img/table.png',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		});
		sequelize.query("INSERT IGNORE INTO agil_mesa SET id = 4,sala=1,estado=659,numero=4,imagen='img/table.png',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		});
		sequelize.query("INSERT IGNORE INTO agil_mesa SET id = 5,sala=1,estado=659,numero=5,imagen='img/table.png',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		});
		sequelize.query("INSERT IGNORE INTO agil_mesa SET id = 6,sala=1,estado=659,numero=6,imagen='img/table.png',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		});
		sequelize.query("INSERT IGNORE INTO agil_mesa SET id = 7,sala=1,estado=659,numero=7,imagen='img/table.png',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		});
		sequelize.query("INSERT IGNORE INTO agil_mesa SET id = 8,sala=1,estado=659,numero=8,imagen='img/table.png',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		});
		sequelize.query("INSERT IGNORE INTO agil_mesa SET id = 9,sala=1,estado=659,numero=9,imagen='img/table.png',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		});
		sequelize.query("INSERT IGNORE INTO agil_mesa SET id = 10,sala=1,estado=659,numero=10,imagen='img/table.png',createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		});
	});
	
	return Mesa;
}