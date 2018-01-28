module.exports = function (router, sequelize, Sequelize, Usuario, Farmacia, Persona, Empresa, Sucursal, Clase, Diccionario, Tipo, Movimiento, SucursalActividadDosificacion, CodigoControl, NumeroLiteral, Dosificacion, decodeBase64Image, fs) {

	router.route('/venta-farmacia')

    .post(function(req, res) {
		Farmacia.create({
			id_venta:req.body.id_venta,
			diagnostico:req.body.diagnostico,
			observaciones:req.body.observaciones,
			id_consulta:null
		}).then(function(farmacia){
			res.json(farmacia);
		});
    });


}