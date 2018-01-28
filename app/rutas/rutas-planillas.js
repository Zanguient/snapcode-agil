module.exports = function (router, sequelize, Sequelize, Usuario, RRHHParametros, Persona, Empresa, Sucursal, Clase, Diccionario, Tipo, RrhhEmpleadoFicha, RrhhEmpleadoCargo, MedicoPaciente, RrhhEmpleadoDiscapacidad, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, decodeBase64Image, fs) {

    router.route('/rrhh-parametros/:id_empresa')
    .get(function(req, res) {
    	// ==== codigo para autenticar mediante token para acceder al api =====
    	// var token = req.headers['x-access-token'];
  		// if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  		// ================================================
        RRHHParametros.findOrCreate({
	        where:{id_empresa:req.params.id_empresa},
	        defaults:{
				id_empresa:req.params.id_empresa,
				salario_minimo: 2000,
				salario_rciva: 4,
				porcentage_iva: 13,
				decreto_supremo: '3161',
				seguro_salud: 'Caja Petrolera de Salud',
				aporte_serguro_salud: 10,
				numero_patronal: '942-2-1095',
				pension_vejez: 10,
				riesgo_comun: 1.71,
				comision: 0.5,
				aporte_solidario_laboral: 0.5,
				riesgo_profesional: 1.75,
				aporte_solidario_patronal: 3,
				rango_primero_inicio_solidario: 13000,
				rango_primero_fin_solidario: 1,
				rango_segundo_inicio_solidario: 25000,
				rango_segundo_fin_solidario: 5,
				rango_tercero_inicio_solidario: 35000,
				rango_tercero_fin_solidario: 10,
				salario_base_antiguedad: 6000,
				antiguedad_cero_dos: 0,
				antiguedad_dos_cinco: 5,
				antiguedad_cinco_ocho: 11,
				antiguedad_ocho_once: 18,
				antiguedad_once_quince: 26,
				antiguedad_quice_veinte: 34,
				antiguedad_veinte_veinticinco: 42,
				antiguedad_mas_veinticinco: 50
			}
	    }).spread(function(parametros, created){
	    	res.json(parametros);	  
		});
    })

    .put(function (req, res) {
		RRHHParametros.update({
			salario_minimo: req.body.salario_minimo,
			salario_rciva: req.body.salario_rciva,
			porcentage_iva: req.body.porcentage_iva,
			decreto_supremo: req.body.decreto_supremo,
			seguro_salud: req.body.seguro_salud,
			aporte_serguro_salud: req.body.aporte_serguro_salud,
			numero_patronal: req.body.numero_patronal,
			pension_vejez: req.body.pension_vejez,
			riesgo_comun: req.body.riesgo_comun,
			comision: req.body.comision,
			aporte_solidario_laboral: req.body.aporte_solidario_laboral,
			riesgo_profesional: req.body.riesgo_profesional,
			aporte_solidario_patronal: req.body.aporte_solidario_patronal,
			rango_primero_inicio_solidario: req.body.rango_primero_inicio_solidario,
			rango_primero_fin_solidario: req.body.rango_primero_fin_solidario,
			rango_segundo_inicio_solidario: req.body.rango_segundo_inicio_solidario,
			rango_segundo_fin_solidario: req.body.rango_segundo_fin_solidario,
			rango_tercero_inicio_solidario: req.body.rango_tercero_inicio_solidario,
			rango_tercero_fin_solidario: req.body.rango_tercero_fin_solidario,
			salario_base_antiguedad: req.body.salario_base_antiguedad,
			antiguedad_cero_dos: req.body.antiguedad_cero_dos,
			antiguedad_dos_cinco: req.body.antiguedad_dos_cinco,
			antiguedad_cinco_ocho: req.body.antiguedad_cinco_ocho,
			antiguedad_ocho_once: req.body.antiguedad_ocho_once,
			antiguedad_once_quince: req.body.antiguedad_once_quince,
			antiguedad_quice_veinte: req.body.antiguedad_quice_veinte,
			antiguedad_veinte_veinticinco: req.body.antiguedad_veinte_veinticinco,
			antiguedad_mas_veinticinco: req.body.antiguedad_mas_veinticinco
		}, {
			where: { id_empresa: req.params.id_empresa },
		}).then(function (parametroActualizado) {
			res.json({"mensaje":"Actualizado Satisfactoriamente!"});
		});
	})
	router.route('/recursos-humanos-fichas/empleados')
        .get(function (req, res) {
            MedicoPaciente.findAll({
            	where: {
                    es_empleado: true
                },
                include: [{
			        model: RrhhEmpleadoFicha,
			        as: 'empleadosFichas',
			        limit: 1,
			        order: [['id', 'DESC']]
			    },{ model: Persona, as: 'persona'},
			    { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo" }]}]
			    
            }).then(function (empleado) {
            	res.json({ empleados: empleado });
            	
            });
        });
}