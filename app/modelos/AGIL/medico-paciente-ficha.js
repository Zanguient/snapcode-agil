module.exports=function(sequelize,Sequelize){
	var MedicoPacienteFicha = sequelize.define('agil_medico_paciente_ficha', {
	  id_paciente: {
		type: Sequelize.INTEGER,
		field: 'id_paciente' 
	  },
	  fecha: {
		type: Sequelize.DATE,
		field: 'fecha'
	  },
	  estilo_vida: {
		type: Sequelize.STRING,
		field: 'estilo_vida'
	  },
	  actividad_laboral: {
		type: Sequelize.STRING,
		field: 'actividad_laboral'
	  },
	  area_operacion:{
		type: Sequelize.STRING,
		field: 'area_operacion'  
	  },
	  riesgo:{
		type: Sequelize.STRING,
		field: 'riesgo'  
	  },
	  id_persona_referencia:{
		type: Sequelize.INTEGER,
		field: 'id_persona_referencia'  
	  },
	  id_tipo_control:{
		type: Sequelize.INTEGER,
		field: 'id_tipo_control'  
	  },
	  alergia_humo_cigarrillo:{
		type: Sequelize.BOOLEAN,
		field: 'alergia_humo_cigarrillo'  
	  },
	  alergia_polvo:{
		type: Sequelize.BOOLEAN,
		field: 'alergia_polvo'  
      },
       alergia_picadura:{
		type: Sequelize.BOOLEAN,
		field: 'alergia_picadura'  
      },
       alergia_quimico:{
		type: Sequelize.BOOLEAN,
		field: 'alergia_quimico'  
      },
       alergia_algun_material:{
		type: Sequelize.BOOLEAN,
		field: 'alergia_algun_material'  
	  },	 
		alergia_medicamento:{
		type: Sequelize.BOOLEAN,
		field: 'alergia_medicamento'  
	  },
		alergia_plantas:{
		type: Sequelize.BOOLEAN,
		field: 'alergia_plantas'  
	  },
		alergia_alimentos:{
		type: Sequelize.BOOLEAN,
		field: 'alergia_alimentos'  
	  },
		alergia_conservas:{
		type: Sequelize.BOOLEAN,
		field: 'alergia_conservas'  
	  },
		alergia_otros:{
		type: Sequelize.BOOLEAN,
		field: 'alergia_otros'  
      },
		alergia_otros_comentario:{
		type: Sequelize.STRING,
		field: 'alergia_otros_comentario'  
	  },
		es_donante:{
		type: Sequelize.BOOLEAN,
		field: 'es_donante'  
      },
		enfermedad_hipertension:{
		type: Sequelize.BOOLEAN,
		field: 'enfermedad_hipertension'  
      },
		enfermedad_cardilogia:{
		type: Sequelize.BOOLEAN,
		field: 'enfermedad_cardilogia'  
      },
		enfermedad_lumbalgia:{
		type: Sequelize.BOOLEAN,
		field: 'enfermedad_lumbalgia'  
      },
		enfermedad_diabetes:{
		type: Sequelize.BOOLEAN,
		field: 'enfermedad_diabetes'  
      },
		enfermedad_digestiva:{
		type: Sequelize.BOOLEAN,
		field: 'enfermedad_digestiva'  
      },
		enfermedad_epilepsia:{
		type: Sequelize.BOOLEAN,
		field: 'enfermedad_epilepsia'  
      },
		enfermedad_chagas:{
		type: Sequelize.BOOLEAN,
		field: 'enfermedad_chagas'  
      },
		enfermedad_asma:{
		type: Sequelize.BOOLEAN,
		field: 'enfermedad_asma'  
      },
		enfermedad_hepatitis:{
		type: Sequelize.BOOLEAN,
		field: 'enfermedad_hepatitis'  
      },
		enfermedad_otros:{
		type: Sequelize.BOOLEAN,
		field: 'enfermedad_otros'  
      },
		enfermedad_comentario:{
		type: Sequelize.STRING,
		field: 'enfermedad_comentario'  
      },
		quirurgico_operado:{
		type: Sequelize.BOOLEAN,
		field: 'quirurgico_operado'  
      },
		quirurgico_comentario:{
		type: Sequelize.STRING,
		field: 'quirurgico_comentario'  
      }
	}, {
	  freezeTableName: true 
	});
	
	MedicoPacienteFicha.sync().then(function(){
		
	});
	
	return MedicoPacienteFicha;
}