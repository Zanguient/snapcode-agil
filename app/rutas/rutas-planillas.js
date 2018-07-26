module.exports = function (router, sequelize, Sequelize, Usuario, RRHHParametros, Persona, Empresa, Sucursal, Clase, Diccionario, Tipo, RrhhEmpleadoFicha, RrhhEmpleadoCargo, MedicoPaciente, RrhhEmpleadoDiscapacidad, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoHorasExtra, RRHHPlanillaSueldos, RRHHDetallePlanillaSueldos, RrhhEmpleadoPrestamo, RRHHPlanillaRcIva, RRHHDetallePlanillaRcIva, RrhhAnticipo, decodeBase64Image, fs) {

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
	router.route('/recursos-humanos-fichas/empleados/:id_empresa')
        .get(function (req, res) {
   //      	var mes= new Date(req.params.gestion,parseInt(req.params.mes),0);
			// var primerDia = new Date(req.params.gestion,parseInt(req.params.mes)-1,1,0,0,0);
			// var ultimoDia = new Date(req.params.gestion,parseInt(req.params.mes)-1,mes.getDate(),23,59,59);
   //          { model: RrhhEmpleadoHorasExtra, as: 'horasExtra', where:{fecha: {$between: [primerDia,ultimoDia]}}},
   			var activo = "true"
   			
   			sequelize.query("select DISTINCT agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                    agil_medico_paciente.empresa as 'id_empresa', extencion.nombre as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                    agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa',agil_medico_paciente.comentario as 'comentario',\
                    gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                    estado.nombre as 'estado', gl_persona.nombres as 'nombres',gl_persona.direccion_zona as 'direccion',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                    gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                    ,campamento.nombre as 'campamento',fichas.fecha_inicio as 'fecha_inicio',fichas.fecha_expiracion as 'fecha_expiracion',fichas.haber_basico as 'haber_basico', fichas.matricula_seguro as 'matricula_seguro',fichas.id as 'id_ficha',contrato.nombre as 'tipoContrato', rrhhDetallePlanillaRcIva.nuevo_saldo AS 'nuevo_saldo', rrhhDetallePlanillaRcIva.rc_iva_mes AS 'rc_iva_mes', GROUP_CONCAT(`cargos.cargo`.nombre order by `cargos.cargo`.id) cargos from agil_medico_paciente  JOIN agil_rrhh_empleado_ficha AS fichas ON fichas.id=( select agil_rrhh_empleado_ficha.id from agil_rrhh_empleado_ficha where  agil_rrhh_empleado_ficha.id_empleado =  agil_medico_paciente.id order by id desc limit 1) \
                    LEFT JOIN agil_rrhh_detalle_planilla_rc_iva AS rrhhDetallePlanillaRcIva ON rrhhDetallePlanillaRcIva.id = ( SELECT agil_rrhh_detalle_planilla_rc_iva.id FROM agil_rrhh_detalle_planilla_rc_iva WHERE agil_rrhh_detalle_planilla_rc_iva.ficha = fichas.id ORDER BY id DESC LIMIT 1)\
                     left JOIN gl_clase AS contrato ON fichas.tipo_contrato = contrato.id left JOIN agil_rrhh_empleado_cargo AS cargos ON fichas.id = cargos.ficha \
                    LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id  left JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) left JOIN gl_clase as extencion ON agil_medico_paciente.extension = extencion.id left JOIN gl_clase as estado ON gl_persona.estado_civil = estado.id\
                    left JOIN gl_clase as campamento ON agil_medico_paciente.campo = campamento.id where agil_medico_paciente.empresa = "+ req.params.id_empresa + " AND agil_medico_paciente.es_empleado = true GROUP BY agil_medico_paciente.id", { type: sequelize.QueryTypes.SELECT })
            .then(function (pacientes) {
                res.json({ empleados: pacientes });
            });
   // ==================================================================================
   		// 	MedicoPaciente.findAll({
   		// 		where: {
     //                es_empleado: true,
     //                id_empresa:req.params.id_empresa
     //            }
   		// 	}).then(function (empleados) {
   		// 		var empleadosArray = [];
   		// 		empleados.forEach( function(element, index) {
   		// 			// console.log("los datosss ", element);
   					
   		// 			RrhhEmpleadoFicha.findOne({
					//     where: {
					//         id_empleado: element.dataValues.id,
					//     },
					//     include: [
					//     	{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo" }] },
					//     	{ model: MedicoPaciente, as: 'empleado', include: [{ model: Persona, as: 'persona' }] }
					//     ],
					//     order: [ [ 'id', 'DESC' ]],
					// }).then(function(entries){
					  
					//   empleadosArray.push(entries);
					//   console.log("empleadosss ", empleadosArray);
					// }); 

   		// 		});
   				
   		// 		// res.json({ empleados: empleadosArray });
   				
   		// 	});

   		// ==================================================================================================== 

        //     MedicoPaciente.findAll({
        //     	where: {
        //             es_empleado: true,
        //             id_empresa:req.params.id_empresa
        //         },
                
        //         include: [
        //         	{ model: Clase, as: 'campo' }, 
        //         	{ model: RrhhEmpleadoFicha, 
        //         		as: 'empleadosFichas', 

                		
        //         		where: {
                			
				    //     	haber_basico: {$ne: null} 
				    //     },
				        
				        
        //         		include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo" }] }],
                		
        //         		order: [['id', 'DESC']],
                		
                		
                		
        //         	}, 
        //         	{ model: Clase, as: 'extension' }, 
        //         	{ model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }
        //             // { model: Empresa, as: 'empresa'},{model:MedicoPrerequisito, as: 'prerequisitos',include: [{ model: Clase, as: 'prerequisitoClase' }]}
        //         ]
        //         // para hacer las query ==================================================================================
        //         // primero obtener todos los pacientes de la empresa
        //         // luego de los resultados  hacer un for para obtener el id de el empleado
        //         // luego hacer el findall en fichas y hacer el where con el id del empleado y obtener la ultima ficha con limit
                
			    
        //     }).then(function (empleado) {
        //     	var empleados = [];
        //     	empleado.forEach( function(element, index) {
            
        //     		if (element.dataValues.empleadosFichas.length > 0) {
        //     			empleados.push(element);
        //     		}
        //     	});
        //     	res.json({ empleados: empleados });
            	
        //     });
        })
    router.route('/recursos-humanos/horas-extra/empleado-sueldo/:id_ficha/gestion/:gestion/mes/:mes/empleado/:id_empleado')
        .get(function (req, res) {
            var mes= new Date(req.params.gestion,parseInt(req.params.mes),0);
			var primerDia = new Date(req.params.gestion,parseInt(req.params.mes)-1,1,0,0,0);
			console.log("primerDia =======", primerDia);
			var ultimoDia = new Date(req.params.gestion,parseInt(req.params.mes)-1,mes.getDate(),23,59,59); 
			console.log("ultimoDia =======", ultimoDia);
		

            RrhhEmpleadoHorasExtra.findAll({
                where:{id_ficha: req.params.id_ficha, eliminado: false, fecha: {$between: [primerDia,ultimoDia]}}
            }).then(function (horasExtra) {
   
            	var totalHoras = "";
                var timeHoras = 0;
                var timeMinutos = 0;
                if (horasExtra.length > 0) {
                    for (var i = 0; i < horasExtra.length; i++) {
                        var minutos = horasExtra[i].tiempo.split(':')[1];
                        var horas = horasExtra[i].tiempo.split(':')[0];

                        timeHoras = timeHoras + parseInt(horas);
                        timeMinutos = timeMinutos + parseInt(minutos);
                        if (timeMinutos >= 60) {
                        	timeMinutos = timeMinutos - 60;
                            timeHoras = timeHoras + 1;
                        }
                        totalHoras = timeHoras;
                    }
                 
                }else{
                    totalHoras = 0;
                }

                // =========================================================================================================================
                // ==== hacer filtro del modelo recursos humanos anticipos para obtener el ultimo anticipo del mes del empleado :)  ============
                // =========================================================================================================================

                RrhhEmpleadoPrestamo.findAll({
					where:{id_empleado: req.params.id_empleado, cuota:{$gt: 0}}
				}).then( function (prestamos) {
					console.log("los prestamos ======================================================", prestamos);
					var totalCuotas = 0;
					
					if (prestamos.length > 0) {
						var fechaInicial = "";
						var fechaVencimiento = "";
	                    for (var j = 0; j < prestamos.length; j++) {
	                    	fechaInicial = fechaATexto(prestamos[j].fecha_inicial);
	                    	
	                    	fechaVencimiento = editar_fecha(fechaInicial, prestamos[j].plazo, "m", "/");
	          
	             			// totalCuotas = totalCuotas + prestamos[j].cuota;
	             			// condicion para que saque los prestamos de avuerdo al mes y año del prestamo ===========
	                    	if (primerDia <= fechaVencimiento && ultimoDia >= prestamos[j].fecha_inicial) {
	                    		totalCuotas = totalCuotas + prestamos[j].cuota;
	                    	}
	                    }
	                }else{
	                    totalCuotas = 0;
	                }
	                // console.log("los totales prestamos =====================", totalCuotas);
	                // res.json({totalHoras: totalHoras, totalCuotas: totalCuotas});
	                // query anticipo =============
	                RrhhAnticipo.findOne({
	                	where:{id_empleado: req.params.id_empleado, eliminado: false, fecha: {$between: [primerDia,ultimoDia]}},
	                	order: [ [ 'createdAt', 'DESC' ]]
	                }).then(function (anticipo) {
	                	var totalanticipo = 0;
	                	if (anticipo) {
	                		totalanticipo = anticipo.total;
	                	}
	                	res.json({totalHoras: totalHoras, totalCuotas: totalCuotas, totalAnticipo: totalanticipo});
	                });

				});

                
               // res.json({horasExtra: horasExtra});
            });

            //  ==== hacer query x el updatedAt que sea menor o igual  a la fecha de vencimiento =======
   //          sequelize.query('SELECT * FROM agil_rrhh_empleado_prestamo WHERE empleado=:id_empleado AND updatedAt >= :fecha AND updatedAt < DATE_ADD(fecha_inicial, INTERVAL plazo MONTH) ',
			//   {replacements: { fecha: primerDia, id_empleado: req.params.id_empleado}, type: sequelize.QueryTypes.SELECT }
			// ).then( function(projects) {
			// 	console.log("projects prestamosssssssssss ======== ", projects);
			// 	// body...
			// });

			
            // =========== obetener de la base de datos los prestamos que sean mayores a cero ===========
        });

    function editar_fecha(fecha, intervalo, dma, simbolo) {
		var simbolo = simbolo || "-";
		var arrayFecha = fecha.split(simbolo);
		var dia = arrayFecha[0];
		var mes = arrayFecha[1];
		var anio = arrayFecha[2];

		var fechaInicial = new Date(anio, mes - 1, dia);
		var fechaFinal = fechaInicial;
		fechaFinal.setMonth(fechaInicial.getMonth() + parseInt(intervalo));

		console.log('la fecha venceeeee ==== ', fechaFinal);

		return fechaFinal;
	}

	function fechaATexto(fecha) {
		fech = new Date(fecha)
		var valor = (fech.getMonth() + 1)
		if (valor < 10) {
			valor = "0" + valor
		}
		fecha = fech.getDate() + "/" + valor + "/" + fech.getFullYear();
		return fecha
		// $scope.fechaAplicacionVacuna = new Date(convertirFecha(fecha))
	}

	router.route('/rrhh-planilla-sueldos/:id_empresa/gestion/:gestion/mes/:mes')
		.get(function (req, res) {
    		RRHHPlanillaSueldos.findAll({
            	where: {
                    id_empresa:req.params.id_empresa,
                    anio:req.params.gestion,
                    mes:req.params.mes
                }
            }).then(function (planillas) {
            	res.json({ planillas: planillas });
            });
    	});

    router.route('/rrhh-planilla-sueldos/:id_empresa')
    	.post(function(req, res) {
    		var planillas = req.body;
    		console.log('los datos recibidos', planillas);
	    	RRHHPlanillaSueldos.create({
				id_empresa:req.body.id_empresa,
				mes:req.body.mes,
				anio:req.body.gestion,
				total_empleados:req.body.totalEmpleados,
				total:req.body.importeLiquidoPagable,
				importe_sueldo_basico:req.body.importeSueldoBasico,
				total_horas_extras:req.body.totalHorasExtras,
				importe_horas_extras:req.body.importeHorasExtras,
				importe_recargo_nocturno:req.body.importeRecargoNocturno,
			    importe_bono_antiguedad:req.body.importeBonoAntiguedad,
			    importe_bono_frontera:req.body.importeBonoFrontera,
			    importe_otros_bonos:req.body.importeOtrosBonos,
			    importe_total_ganado:req.body.importeTotalGanado,
			    importe_afp:req.body.importeAFP,
			    importe_rc_iva:req.body.importeRCIVA,
			    importe_anticipos:req.body.importeAniticipos,
			    importe_prestamos:req.body.importePrestamos,
			    importe_total_descuento:req.body.importeTotalDescuento,
			    importe_liquido_pagable:req.body.importeLiquidoPagable
			}).then(function(planillaCreado){
				// console.log("planillaCreado =============== ", planillaCreado);
				
				// for para guardar los detalles de las planillas ==================
				planillas.RecursosHumanosEmpleados.forEach(function (detallePlanilla, index, array) {
					CrearDetallePlanillaSueldos(planillaCreado, detallePlanilla);
				});

				res.json(planillaCreado);
			});
    	});

    function CrearDetallePlanillaSueldos(planilla, detallePlanilla) {
    	RRHHDetallePlanillaSueldos.create({
    		planilla: planilla.id,
			ficha: detallePlanilla.id_ficha,
			importe_sueldo_basico:detallePlanilla.sueldoBasico,
			horas_extras: detallePlanilla.horasExtras,
			importe_horas_extras: detallePlanilla.totalHorasExtras,
			importe_recargo_nocturno: detallePlanilla.recargoNocturno,
			importe_bono_antiguedad: detallePlanilla.bonoAntiguedad,
			importe_bono_frontera: detallePlanilla.bonoFrontera,
			importe_otros_bonos: detallePlanilla.otrosBonos,
			total_ganado: detallePlanilla.totalGanado,
			afp: detallePlanilla.afp,
			rc_iva: detallePlanilla.rc_iva,
			importe_anticipos: detallePlanilla.anticipos,
			importe_prestamos: detallePlanilla.prestamos,
			importe_total_descuento: detallePlanilla.totalDescuento,
			liquido_pagable: detallePlanilla.liquidoPagable
		}).then(function (detalles) {
			
		});
    }



    router.route('/rrhh-planilla-rc-iva/:id_empresa')
    	.post(function(req, res) {
    		var planillas = req.body;
    		console.log('los datos recibidos', planillas);
	    	RRHHPlanillaRcIva.create({
			    id_empresa: req.body.id_empresa,
				mes:req.body.mes,
				anio:req.body.gestion,
				total_empleados:req.body.totalEmpleados,
				total: req.body.importeLiquidoPagable,
				neto_imponible:req.body.netoImponible,
				dos_smn:req.body.sumaDos_SMN,
				diferencia:req.body.sumaDiferencia,
				rc_iva:req.body.sumarcIva13,
				dos_smn13:req.body.sumaDos_SMN13,
				f110:req.body.sumaF110,
				rc_iva_fisico:req.body.sumaRcIvaFisco,
				saldo_dependiente:req.body.sumaSaldoDependiente,
				saldo_anterior:req.body.sumaSaldoAnterior,
				actualizacion:req.body.sumaActualizacion,
				saldo_actualizado:req.body.sumaSaldoActualizado,
				saldo_total:req.body.sumaSaldoTotal,
				saldo_utilizado:req.body.sumaSaldoUtilizado,
				rc_iva_mes:req.body.sumaRcIvaMes,
				nuevo_saldo:req.body.sumaSaldoNuevo
			}).then(function(planillaCreado){
				// console.log("planillaCreado =============== ", planillaCreado);
				
				// for para guardar los detalles de las planillas ==================
				planillas.RecursosHumanosEmpleados.forEach(function (detallePlanilla, index, array) {
					CrearDetallePlanillaRcIva(planillaCreado, detallePlanilla);
				});

				res.json(planillaCreado);
			});
    	});

    	function CrearDetallePlanillaRcIva(planilla, detallePlanilla) {
	    	RRHHDetallePlanillaRcIva.create({
				planilla:planilla.id,
				ficha:detallePlanilla.id_ficha,
				neto_imponible:detallePlanilla.netoImponible,
				dos_smn:detallePlanilla.dos_SMN,
				diferencia:detallePlanilla.diferencia,
				rc_iva:detallePlanilla.rcIva13,
				dos_smn13:detallePlanilla.dos_SMN13,
				f110:detallePlanilla.f110,
				rc_iva_fisico:detallePlanilla.rcIvaFisco,
				saldo_dependiente:detallePlanilla.saldoDependiente,
				saldo_anterior:detallePlanilla.saldoAnterior,
				actualizacion:detallePlanilla.actualizacion,
				saldo_actualizado:detallePlanilla.saldoActualizado,
				saldo_total:detallePlanilla.saldoTotal,
				saldo_utilizado:detallePlanilla.saldoTotal,
				rc_iva_mes:detallePlanilla.rcIvaMes,
				nuevo_saldo:detallePlanilla.saldoNuevo
			}).then(function (detalles) {
				
			});
	    };
	    //  =====  api para obtener  planilla rc iva del mes ========
	    router.route('/rrhh-planilla-rc-iva/valid/:id_empresa/gestion/:gestion/mes/:mes')
		.get(function (req, res) {
    		RRHHPlanillaRcIva.findAll({
            	where: {
                    id_empresa:req.params.id_empresa, 
                    anio:req.params.gestion,
                    mes:req.params.mes
                }
            }).then(function (planillas) {
            	res.json({ planillas: planillas });
            });
    	});

    	router.route('/rrhh-planilla-rc-iva/:id_empresa/gestion/:gestion/mes/:mes')
		.get(function (req, res) {
    		RRHHPlanillaRcIva.findAll({
            	where: {
                    id_empresa:req.params.id_empresa, 
                    anio:req.params.gestion,
                    mes:req.params.mes
                },
                include: [
                	{ 
                		model: RRHHDetallePlanillaRcIva, as: 'rrhhPlanillaRcIva',
                		include: [
                			{ model: RrhhEmpleadoFicha, as: 'rrhhDetallePlanillaRcIva',
                			// attributes: [sequelize.literal('`empleado.persona`.`nombre_completo`'), 'empleado'],
	                			include: [
	                				{ model: MedicoPaciente, as: 'empleado',
	                				// attributes: ["id","cargo", "persona"],
	                					include: [
	                					{ model: Clase, as: 'campo' },
	                					{model: Persona, as: 'persona'}

	                					]
	                			 	},
	                			 	{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo" }] }
	                			]			    
                			}
                		]
                		
        //         		as: 'empleadosFichas', 

                		
        //         		where: {
                			
				    //     	haber_basico: {$ne: null} 
				    //     },
				        
				        
        //         		include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo" }] }],
                		
        //         		order: [['id', 'DESC']],
                		
                		
                		
                	}  
                	
                ]
            }).then(function (planillas) {
            	res.json({ planillas: planillas });
            });
    	});

}