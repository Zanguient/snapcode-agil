module.exports=function(router,forEach,fs,sequelize,Empresa,Dosificacion,SucursalActividadDosificacion,Sucursal,Clase){
	
router.route('/dosificaciones')

    .post(function(req, res) {
		Dosificacion.create({
			id_empresa:req.body.id_empresa,
			correlativo:req.body.correlativo,
			fecha_limite_emision:req.body.fecha_limite_emision,
			autorizacion:req.body.autorizacion,
			llave_digital:req.body.llave_digital,
			id_pie_factura:req.body.pieFactura.id,
			expirado: (new Date(req.body.fecha_limite_emision) > new Date()) ? false : true
			
		}).then(function(dosificacionCreada){
			res.json(dosificacionCreada);
		});
    });
	
router.route('/dosificaciones/empresa/:id_empresa')
	.get(function(req, res) {
		Dosificacion.findAll({ 
			where:{id_empresa:req.params.id_empresa},
			include: [{model:Empresa,as: 'empresa'},
					  {model:Clase,as: 'pieFactura'},
					  {model:SucursalActividadDosificacion,as: 'actividadesSucursales',
						include:[{model:Sucursal,as:"sucursal"}]}]
		}).then(function(dosificaciones){			
			res.json(dosificaciones);		  
		});
	});
	
router.route('/dosificaciones-disponibles/empresa/:id_empresa')
	.get(function(req, res) {
		sequelize.query("select * from agil_dosificacion where id not in (select dosificacion from agil_sucursal_actividad_dosificacion where dosificacion is not NULL) and expirado = false and empresa="+req.params.id_empresa, { type: sequelize.QueryTypes.SELECT})
		.then(function(dosificaciones){
			res.json(dosificaciones);
		});
	});
		
router.route('/dosificaciones/:id_dosificacion')
	.put(function(req, res) {
		Dosificacion.update({
			correlativo:req.body.correlativo,
			fecha_limite_emision:req.body.fecha_limite_emision,
			autorizacion:req.body.autorizacion,
			llave_digital:req.body.llave_digital,
			id_pie_factura:req.body.pieFactura.id
			
		},{
			where:{
				id:req.params.id_dosificacion
			}
		}).then(function(dosificacionActualizada){
			res.json(req.body);		  
		});
	})
	
	.delete(function(req, res) {
		Dosificacion.destroy({ 
			where:{
				id: req.params.id_dosificacion
			}
		}).then(function(affectedRows){		
			res.json({message:"Eliminado Satisfactoriamente!"});
		});
	});
}