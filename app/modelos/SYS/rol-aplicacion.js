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
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=49,rol=2,aplicacion=31,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=50,rol=2,aplicacion=32,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=51,rol=2,aplicacion=33,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=52,rol=2,aplicacion=34,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=53,rol=2,aplicacion=35,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=54,rol=2,aplicacion=36,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=55,rol=5,aplicacion=35,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=56,rol=5,aplicacion=36,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=57,rol=2,aplicacion=37,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=58,rol=2,aplicacion=38,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO sys_rol_aplicacion SET id=59,rol=2,aplicacion=39,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
	});

	return RolAplicacion;
}