module.exports=function(sequelize,Sequelize){
	var Persona = sequelize.define('gl_persona', {
	  nombre_completo: {
		type: Sequelize.STRING,
		field: 'nombre_completo' 
	  },
	  apellido_paterno: {
		type: Sequelize.STRING,
		field: 'apellido_paterno' 
	  },
	  apellido_materno: {
		type: Sequelize.STRING,
		field: 'apellido_materno' 
		},
		apellido_casada: {
			type: Sequelize.STRING,
			field: 'apellido_casada' 
			},
	  nombres: {
		type: Sequelize.STRING,
		field: 'nombres' 
		},
		segundo_nombre: {
			type: Sequelize.STRING,
			field: 'segundo_nombre' 
			},
	  direccion:{
		type: Sequelize.STRING,
		field: 'direccion' 
	  },
	  telefono:{
		type: Sequelize.STRING,
		field: 'telefono' 
	  },
	  imagen:{
		type: Sequelize.STRING,
		field: 'imagen' 
	  },
	  fecha_nacimiento: {
		type: Sequelize.DATE,
		field: 'fecha_nacimiento'
	  },
	  id_lugar_nacimiento: {//instance
		type: Sequelize.INTEGER,
		field: 'lugar_nacimiento'
	  },
	  profesion: {
		type: Sequelize.STRING,
		field: 'profesion'
	  },
	  correo_electronico:{
		type: Sequelize.STRING,
		field: 'correo_electronico' 
	  },
	  ci:{
		type: Sequelize.STRING,
		field: 'ci' 
	  },
	  id_genero: {//instance
		type: Sequelize.INTEGER,
		field: 'genero'
	  },
	  telefono_movil:{
		type: Sequelize.STRING,
		field: 'telefono_movil' 
	  },
	  id_lenguaje: {//instance
		type: Sequelize.INTEGER,
		field: 'lenguaje'
	  },
	  id_grado_academico: {//instance
		type: Sequelize.INTEGER,
		field: 'grado_academico'
	  },
	  id_pais_nacimiento:{
		type: Sequelize.INTEGER,
		field: 'pais_nacimiento' 
	  },
	  id_ciudad_nacimiento:{
		type: Sequelize.INTEGER,
		field: 'ciudad_nacimiento' 
	  },
	  id_provincia_nacimiento:{
		type: Sequelize.INTEGER,
		field: 'provincia_nacimiento' 
	  },
	  id_localidad_nacimiento:{
		type: Sequelize.INTEGER,
		field: 'localidad_nacimiento' 
	  },
	  direccion_provincia:{
		type: Sequelize.STRING,
		field: 'direccion_provincia' 
	  },
	  direccion_ciudad:{
		type: Sequelize.STRING,
		field: 'direccion_ciudad' 
	  },
	  direccion_localidad:{
		type: Sequelize.STRING,
		field: 'direccion_localidad' 
	  },
	  direccion_zona:{
		type: Sequelize.STRING,
		field: 'direccion_zona' 
	  },
	  direccion_numero:{
		type: Sequelize.STRING,
		field: 'direccion_numero' 
	  },
	  firma:{
		type: Sequelize.STRING,
		field: 'firma' 
	  },
	  activo:{
		type: Sequelize.BOOLEAN,
		field: 'activo'  
	  },
	  id_estado_civil:{
		type: Sequelize.INTEGER,
		field: 'estado_civil'  
		},
		id_expedido:{
			type: Sequelize.INTEGER,
		field: 'expedido'  	
		}
	}, {
	  freezeTableName: true 
	});
	
	Persona.sync().then(function(){
		sequelize.query("INSERT IGNORE INTO gl_persona SET id=1,nombres='ADMINISTRADOR',apellido_paterno='ADMINISTRADOR',apellido_materno='ADMINISTRADOR',nombre_completo='ADMINISTRADOR',imagen='img/icon-user-default.png',activo=1,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  console.log(metadata+" rows affected in gl_type");
		});		
	});
	
	return Persona;
}