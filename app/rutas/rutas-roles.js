module.exports=function(router,Rol,RolAplicacion,Aplicacion){
	
router.route('/roles')

	.get(function(req, res) {
		Rol.findAll({
			include:[{model:RolAplicacion,as:'aplicacionesRol',
					include:[{model:Aplicacion,as:'aplicacion'}]}]
		}).then(function(entities){			
			res.json(entities);		  
		});
	});	
}