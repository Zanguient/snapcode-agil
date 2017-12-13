module.exports = function (router,Persona,VendedorVenta) {

router.route('/vendedor-venta/empresa/:id_empresa')
	.get(function(req, res) {
		VendedorVenta.findAll({
            where:{id_empresa:req.params.id_empresa},
            include:[{model:Persona,as:'persona'}]
		}).then(function(persons){
            res.json(persons);
        });
    });

router.route('/vendedor-venta/empresa')
	.post(function(req, res) {
		Persona.create({
            nombres:req.body.persona.nombres,
            apellido_paterno:req.body.persona.apellido_paterno,
            apellido_materno:req.body.persona.apellido_materno,
            nombre_completo:(req.body.persona.apellido_paterno?req.body.persona.apellido_paterno:"")+" "+(req.body.persona.apellido_materno?req.body.persona.apellido_materno:"")+" "+req.body.persona.nombres
		}).then(function(persona){
            VendedorVenta.create({
                id_empresa:req.body.id_empresa,
                id_persona:persona.id
            }).then(function(vendedor){
                res.json(vendedor);
            });
        });
    });

router.route('/vendedor-venta/:id_vendedor')
	.put(function(req, res) {
		VendedorVenta.find({
            where:{
                id:req.params.id_vendedor
            }
		}).then(function(vendedor){
            Persona.update({
                nombres:req.body.persona.nombres,
                apellido_paterno:req.body.persona.apellido_paterno,
                apellido_materno:req.body.persona.apellido_materno,
                nombre_completo:(req.body.persona.apellido_paterno?req.body.persona.apellido_paterno:"")+" "+(req.body.persona.apellido_materno?req.body.persona.apellido_materno:"")+" "+req.body.persona.nombres
            },{
                where:{
                    id:vendedor.id_persona
                }
            }).then(function(persona){
                res.json({mensaje:"Vendedor actualizado satisfactoriamente!"});
            });
        });
    });

router.route('/vendedor-venta/:id_vendedor')
	.delete(function(req, res) {
		VendedorVenta.find({
            where:{
                id:req.params.id_vendedor
            }
		}).then(function(vendedor){
            Persona.destroy({
                where:{
                    id:vendedor.id_persona
                }
            }).then(function(persona){
                VendedorVenta.destroy({
                    where:{
                        id:req.params.id_vendedor
                    }
                }).then(function(persona){
                    res.json({mensaje:"Vendedor eliminado satisfactoriamente!"});
                });
            });
        });
    });
}