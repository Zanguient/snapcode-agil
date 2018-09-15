module.exports = function (sequelize, Sequelize) {
	var RolAplicacion = sequelize.define('sys_rol_aplicacion', {
		id_rol: {
			type: Sequelize.INTEGER,
			field: 'rol'
		},
		id_aplicacion: {
			type: Sequelize.INTEGER,
			field: 'aplicacion'
		},
		puede_ver: {
			type: Sequelize.BOOLEAN,
			field: 'puede_ver'
		},
		puede_crear: {
			type: Sequelize.BOOLEAN,
			field: 'puede_crear'
		},
		puede_modificar: {
			type: Sequelize.BOOLEAN,
			field: 'puede_modificar'
		},
		puede_eliminar: {
			type: Sequelize.BOOLEAN,
			field: 'puede_eliminar'
		}
	}, {
			freezeTableName: true
		});

	RolAplicacion.sync().then(function () {
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=1,rol=1,aplicacion=1,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=2,rol=1,aplicacion=2,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=3,rol=1,aplicacion=3,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=4,rol=2,aplicacion=3,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=5,rol=2,aplicacion=4,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=6,rol=2,aplicacion=5,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=8,rol=3,aplicacion=4,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=9,rol=3,aplicacion=5,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=11,rol=3,aplicacion=7,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=12,rol=2,aplicacion=9,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=13,rol=2,aplicacion=10,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=14,rol=3,aplicacion=12,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=15,rol=3,aplicacion=13,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=16,rol=3,aplicacion=14,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=17,rol=1,aplicacion=8,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=18,rol=1,aplicacion=11,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=19,rol=2,aplicacion=1,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=20,rol=2,aplicacion=15,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=21,rol=2,aplicacion=16,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=22,rol=2,aplicacion=17,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=23,rol=2,aplicacion=18,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=24,rol=2,aplicacion=19,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=25,rol=2,aplicacion=20,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=26,rol=2,aplicacion=21,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=27,rol=2,aplicacion=22,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=28,rol=2,aplicacion=11,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=29,rol=2,aplicacion=2,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=30,rol=2,aplicacion=12,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=31,rol=2,aplicacion=14,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=32,rol=4,aplicacion=4,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=33,rol=4,aplicacion=5,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=34,rol=4,aplicacion=7,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=35,rol=4,aplicacion=12,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=36,rol=4,aplicacion=13,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=37,rol=4,aplicacion=14,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=38,rol=2,aplicacion=23,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=39,rol=2,aplicacion=24,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=40,rol=2,aplicacion=7,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=41,rol=2,aplicacion=13,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=42,rol=2,aplicacion=25,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=43,rol=2,aplicacion=26,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=44,rol=2,aplicacion=27,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=45,rol=2,aplicacion=8,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=46,rol=2,aplicacion=28,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=47,rol=2,aplicacion=29,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=48,rol=2,aplicacion=30,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=49,rol=3,aplicacion=28,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=50,rol=3,aplicacion=29,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=51,rol=3,aplicacion=30,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=52,rol=2,aplicacion=31,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=53,rol=2,aplicacion=32,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=54,rol=3,aplicacion=32,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=55,rol=2,aplicacion=33,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=56,rol=3,aplicacion=16,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=57,rol=3,aplicacion=25,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=58,rol=3,aplicacion=26,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=59,rol=2,aplicacion=35,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=60,rol=2,aplicacion=36,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=61,rol=2,aplicacion=37,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=62,rol=2,aplicacion=38,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=63,rol=2,aplicacion=41,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=64,rol=2,aplicacion=42,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=65,rol=2,aplicacion=43,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=66,rol=2,aplicacion=44,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=67,rol=2,aplicacion=45,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=68,rol=2,aplicacion=46,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=69,rol=2,aplicacion=39,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});

		//admin
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=70,rol=2,aplicacion=47,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=71,rol=2,aplicacion=48,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=72,rol=4,aplicacion=41,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});

		//vendedor


		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=73,rol=4,aplicacion=42,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=74,rol=4,aplicacion=10,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=75,rol=4,aplicacion=1,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=76,rol=4,aplicacion=15,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=77,rol=4,aplicacion=16,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=78,rol=4,aplicacion=17,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=79,rol=4,aplicacion=18,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=80,rol=4,aplicacion=19,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=81,rol=4,aplicacion=20,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=82,rol=4,aplicacion=21,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=83,rol=4,aplicacion=22,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=84,rol=4,aplicacion=11,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=85,rol=4,aplicacion=2,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});


		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=86,rol=4,aplicacion=23,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=87,rol=4,aplicacion=24,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});

		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=88,rol=4,aplicacion=25,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=89,rol=4,aplicacion=26,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=90,rol=4,aplicacion=27,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=91,rol=4,aplicacion=8,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=92,rol=4,aplicacion=28,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=93,rol=4,aplicacion=29,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=94,rol=4,aplicacion=30,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=95,rol=4,aplicacion=31,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=96,rol=4,aplicacion=32,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {


		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=97,rol=4,aplicacion=33,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=98,rol=4,aplicacion=35,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=99,rol=4,aplicacion=36,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=100,rol=4,aplicacion=37,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=101,rol=4,aplicacion=38,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=102,rol=4,aplicacion=39,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=103,rol=4,aplicacion=40,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});

		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=104,rol=2,aplicacion=40,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=105,rol=4,aplicacion=9,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=106,rol=4,aplicacion=43,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=107,rol=4,aplicacion=44,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=108,rol=4,aplicacion=45,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=109,rol=4,aplicacion=46,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=110,rol=4,aplicacion=47,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=111,rol=4,aplicacion=48,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
	
	
		//operador
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=112,rol=3,aplicacion=9,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=113,rol=3,aplicacion=10,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=114,rol=3,aplicacion=1,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=115,rol=3,aplicacion=15,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});

		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=116,rol=3,aplicacion=17,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=117,rol=3,aplicacion=18,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=118,rol=3,aplicacion=19,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=119,rol=3,aplicacion=20,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=120,rol=3,aplicacion=21,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=121,rol=3,aplicacion=22,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=122,rol=3,aplicacion=11,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=123,rol=3,aplicacion=2,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});

		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=124,rol=3,aplicacion=24,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});


		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=125,rol=3,aplicacion=27,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=126,rol=3,aplicacion=8,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});


		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=127,rol=3,aplicacion=31,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});

		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=128,rol=3,aplicacion=33,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});

		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=129,rol=3,aplicacion=35,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=130,rol=3,aplicacion=36,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=131,rol=3,aplicacion=37,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=132,rol=3,aplicacion=38,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=133,rol=3,aplicacion=39,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});

		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=134,rol=3,aplicacion=40,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=135,rol=3,aplicacion=41,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=136,rol=3,aplicacion=42,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=137,rol=3,aplicacion=43,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=138,rol=3,aplicacion=44,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=139,rol=3,aplicacion=45,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=140,rol=3,aplicacion=46,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=141,rol=3,aplicacion=47,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=142,rol=3,aplicacion=48,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=143,rol=2,aplicacion=49,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=144,rol=3,aplicacion=49,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=145,rol=4,aplicacion=49,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=146,rol=2,aplicacion=50,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=147,rol=3,aplicacion=50,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=148,rol=4,aplicacion=50,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=149,rol=2,aplicacion=51,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=150,rol=2,aplicacion=52,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=151,rol=3,aplicacion=52,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=152,rol=2,aplicacion=53,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=153,rol=3,aplicacion=53,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=154,rol=2,aplicacion=54,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=155,rol=3,aplicacion=54,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=156,rol=2,aplicacion=55,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=157,rol=3,aplicacion=55,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=158,rol=2,aplicacion=56,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=159,rol=3,aplicacion=56,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=160,rol=2,aplicacion=57,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=161,rol=3,aplicacion=57,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=162,rol=2,aplicacion=34,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=163,rol=3,aplicacion=34,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});

		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=164,rol=2,aplicacion=58,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=165,rol=3,aplicacion=58,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=166,rol=2,aplicacion=59,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=167,rol=3,aplicacion=59,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=168,rol=2,aplicacion=60,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=169,rol=3,aplicacion=60,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=170,rol=2,aplicacion=61,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=171,rol=3,aplicacion=61,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
	});

	return RolAplicacion;
}