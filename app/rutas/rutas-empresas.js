module.exports = function (router, decodeBase64Image, fs, Empresa, Sucursal, Clase, Tipo, signs3,
	ConfiguracionVentaVista, ConfiguracionCompraVista, sequelize) {

	router.route('/empresas')

		.post(function (req, res) {
			Empresa.create({
				razon_social: req.body.razon_social,
				nit: req.body.nit,
				direccion: req.body.direccion,
				telefono1: req.body.telefono1,
				telefono2: req.body.telefono2,
				telefono3: req.body.telefono3,
				id_departamento: req.body.id_departamento,
				id_municipio: req.body.id_municipio,
				usar_panel: req.body.usar_panel,
				usar_vencimientos: req.body.usar_vencimientos,
				usar_servicios: req.body.usar_servicios,
				usar_consumos: req.body.usar_consumos,
				usar_descuentos: req.body.usar_descuentos,
				usar_georeferenciacion: req.body.usar_georeferenciacion,
				usar_pedidos: req.body.usar_pedidos,
				usar_pantalla_cliente: req.body.usar_pantalla_cliente,
				usar_pantalla_despacho: req.body.usar_pantalla_despacho,
				usar_mesas: req.body.usar_mesas,
				usar_salas: req.body.usar_salas,
				usar_contabilidad: req.body.usar_contabilidad,
				usar_medico: req.body.usar_medico,
				usar_mantenimiento: req.body.usar_mantenimiento,
				usar_cuentas_auxiliares: req.body.usar_cuentas_auxiliares,
				usar_proformas: req.body.usar_proformas,
				usar_creditos: req.body.usar_creditos,
				usar_destinos: req.body.usar_destinos,
				usar_razon_social: req.body.usar_razon_social
			}).then(function (empresaCreada) {
				Sucursal.create({
					id_empresa: empresaCreada.id,
					nombre: req.body.sucursal.nombre,
					numero: req.body.sucursal.numero,
					direccion: req.body.sucursal.direccion,
					telefono1: req.body.sucursal.telefono1,
					telefono2: req.body.sucursal.telefono2,
					telefono3: req.body.sucursal.telefono3,
					id_departamento: req.body.sucursal.id_departamento,
					id_municipio: req.body.sucursal.id_municipio,
					nota_venta_correlativo: req.body.sucursal.nota_venta_correlativo
				}).then(function (sucursalCreada) {
					Tipo.create({
						id_empresa: empresaCreada.id,
						nombre: "GRUPOS PRODUCTOS",
						nombre_corto: "GRUPOS PRODUCTOS"
					}).then(function (grupoProd) {
						Tipo.create({
							id_empresa: empresaCreada.id,
							nombre: "SUBGRUPOS PRODUCTOS",
							nombre_corto: "SUBGRUPOS PRODUCTOS"
						}).then(function (subGrupoProd) {
							Tipo.create({
								id_empresa: empresaCreada.id,
								nombre: "VENCIMIENTOS",
								nombre_corto: "VENCIMIENTOS"
							}).then(function (venCreado) {
								Clase.create({
									id_tipo: venCreado.id,
									nombre: "VENCIMIENTO DE PRODUCTOS",
									nombre_corto: "10"
								}).then(function (venPROCreado) {
									Clase.create({
										id_tipo: venCreado.id,
										nombre: "VENCIMIENTO DE CRÉDITOS",
										nombre_corto: "10"
									}).then(function (venCRECreado) {
										Clase.create({
											id_tipo: venCreado.id,
											nombre: "VENCIMIENTO DE DEUDAS",
											nombre_corto: "10"
										}).then(function (venDECreado) {
											ConfiguracionVentaVista.create({
												mostrar_producto: true,
												mostrar_precio_unitario: true,
												mostrar_cantidad: true,
												mostrar_importe: true,
												mostrar_descuento: false,
												mostrar_recargo: false,
												mostrar_ice: false,
												mostrar_excento: false,
												mostrar_total: true,
												mostrar_fecha_vencimiento: false,
												mostrar_lote: false,
												mostrar_codigo_producto: true,
												mostrar_unidad_producto: true,
												id_empresa: empresaCreada.id
											}).then(function (configuracionVentaVistaCreada) {
												ConfiguracionCompraVista.create({
													mostrar_producto: true,
													mostrar_costo_unitario: true,
													mostrar_cantidad: true,
													mostrar_importe: true,
													mostrar_descuento: false,
													mostrar_recargo: false,
													mostrar_ice: false,
													mostrar_excento: false,
													mostrar_total: true,
													mostrar_fecha_vencimiento: false,
													mostrar_lote: false,
													mostrar_codigo_producto: true,
													mostrar_unidad_producto: true,
													id_empresa: empresaCreada.id
												}).then(function (configuracionCompraVistaCreada) {
													Clase.find({
														where: { nombre_corto: 'OAL' }
													}).then(function (clase) {
														if (clase.nombre == "ONLINE") {
															var imagen;
															if (req.body.imagen.indexOf('default') > -1) {
																actualizarImagenEmpresa(empresaCreada, req, res, null, req.body.imagen);
															} else {
																signs3('agil_imagenes/empresa-' + empresaCreada.id + '.jpg', 'image/jpeg', function (signedRequest, url) {
																	actualizarImagenEmpresa(empresaCreada, req, res, signedRequest, url);
																});
															}
														} else {
															var imagen;
															if (req.body.imagen.indexOf('default') > -1) {
																imagen = req.body.imagen;
															} else {
																var imagenEmpresa = decodeBase64Image(req.body.imagen);
																fs.writeFileSync('./img/empresa-' + empresaCreada.id + '.jpg', imagenEmpresa.data, 'base64', function (err) { });
																imagen = 'img/empresa-' + empresaCreada.id + '.jpg';
															}
															actualizarImagenEmpresa(empresaCreada, req, res, null, imagen);
														}
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		})

		.get(function (req, res) {
			Empresa.findAll({
				include: [{ model: Clase, as: 'departamento' },
				{ model: Clase, as: 'municipio' },
				{ model: Sucursal, as: 'sucursales' }]
			}).then(function (entidades) {
				res.json(entidades);
			});
		});

	function actualizarImagenEmpresa(empresaCreada, req, res, signedRequest, imagen) {
		Empresa.update({
			imagen: imagen
		}, {
				where: { id: empresaCreada.id }
			}).then(function (affecteedRows) {
				res.json({ empresa: empresaCreada, url: imagen, signedRequest: signedRequest, image_name: 'empresa-' + empresaCreada.id + '.jpg' });
			});
	}

	router.route('/empresas/:id_empresa')
		.put(function (req, res) {
			Empresa.update({
				razon_social: req.body.razon_social,
				nit: req.body.nit,
				direccion: req.body.direccion,
				telefono1: req.body.telefono1,
				telefono2: req.body.telefono2,
				telefono3: req.body.telefono3,
				id_departamento: req.body.id_departamento,
				id_municipio: req.body.id_municipio,
				usar_panel: req.body.usar_panel,
				usar_vencimientos: req.body.usar_vencimientos,
				usar_servicios: req.body.usar_servicios,
				usar_consumos: req.body.usar_consumos,
				usar_descuentos: req.body.usar_descuentos,
				usar_georeferenciacion: req.body.usar_georeferenciacion,
				usar_pedidos: req.body.usar_pedidos,
				usar_pantalla_cliente: req.body.usar_pantalla_cliente,
				usar_pantalla_despacho: req.body.usar_pantalla_despacho,
				usar_mesas: req.body.usar_mesas,
				usar_salas: req.body.usar_salas,
				usar_contabilidad: req.body.usar_contabilidad,
				usar_medico: req.body.usar_medico,
				usar_mantenimiento: req.body.usar_mantenimiento,
				usar_cuentas_auxiliares: req.body.usar_cuentas_auxiliares,
				usar_proformas: req.body.usar_proformas,
				usar_creditos: req.body.usar_creditos,
				usar_destinos: req.body.usar_destinos,
				usar_razon_social: req.body.usar_razon_social
			}, {
					where: {
						id: req.params.id_empresa
					}
				}).then(function (empresaActualizada) {
					Clase.find({
						where: { nombre_corto: 'OAL' }
					}).then(function (clase) {
						if (clase.nombre == "ONLINE") {
							if ((req.body.imagen.indexOf('default') > -1 || req.body.imagen.indexOf("empresa-" + req.body.id) > -1 || req.body.imagen.indexOf(req.body.id) > -1) && req.body.imagen.length < 200) {
								actualizarImagenEmpresa(req.body, req, res, null, req.body.imagen);
							} else {
								signs3('agil_imagenes/empresa-' + req.body.id + '.jpg', 'image/jpeg', function (signedRequest, url) {
									actualizarImagenEmpresa(req.body, req, res, signedRequest, url);
								});
							}
						} else {
							if ((req.body.imagen.indexOf('default') > -1 || req.body.imagen.indexOf("persona-" + req.body.id) > -1 || req.body.imagen.indexOf(req.body.id) > -1) && req.body.imagen.length < 200) {
								actualizarImagenEmpresa(req.body, req, res, null, req.body.imagen);
							} else {
								var imgPerson = decodeBase64Image(req.body.imagen);
								fs.writeFileSync('./img/empresa-' + req.body.id + '.jpg', imgPerson.data, 'base64', function (err) { });
								var imagen = 'img/empresa-' + req.body.id + '.jpg';
								actualizarImagenEmpresa(req.body, req, res, null, imagen);
							}
						}
					});
				});
		})

		.get(function (req, res) {
			var condicion;
			if (req.params.id_empresa == "0") {
				condicion = {};
			} else {
				condicion = { id: req.params.id_empresa };
			}
			Empresa.findAll({
				where: condicion,
				include: [{ model: Clase, as: 'departamento' },
				{ model: Clase, as: 'municipio' },
				{ model: Sucursal, as: 'sucursales' }]
			}).then(function (entidades) {
				res.json(entidades);
			});
		})

		.delete(function (req, res) {
			Empresa.destroy({
				where: {
					id: req.params.id_empresa
				}
			}).then(function (affectedRows) {
				Sucursal.destroy({
					where: {
						id_empresa: req.params.id_empresa
					}
				}).then(function (affectedRows) {
					res.json({ message: "Eliminado Satisfactoriamente!" });
				});
			});
		});

	router.route('/empresas/:id_empresa/configuracion-venta-vista')
		.get(function (req, res) {
			ConfiguracionVentaVista.find({
				where: {
					id_empresa: req.params.id_empresa
				}
			}).then(function (configuracionVentaVista) {
				res.json(configuracionVentaVista);
			});
		})

		.put(function (req, res) {
			ConfiguracionVentaVista.update({
				mostrar_producto: req.body.mostrar_producto,
				mostrar_precio_unitario: req.body.mostrar_precio_unitario,
				mostrar_cantidad: req.body.mostrar_cantidad,
				mostrar_importe: req.body.mostrar_importe,
				mostrar_descuento: req.body.mostrar_descuento,
				mostrar_recargo: req.body.mostrar_recargo,
				mostrar_ice: req.body.mostrar_ice,
				mostrar_excento: req.body.mostrar_excento,
				mostrar_total: req.body.mostrar_total,
				mostrar_fecha_vencimiento: req.body.mostrar_fecha_vencimiento,
				mostrar_lote: req.body.mostrar_lote,
				mostrar_codigo_producto: req.body.mostrar_codigo_producto,
				mostrar_unidad_producto: req.body.mostrar_unidad_producto
			}, {
					where: {
						id_empresa: req.params.id_empresa
					}
				}).then(function (actualizada) {
					res.json({ mensaje: "¡Actualizado Satisfactoriamente!" });
				});
		});

	router.route('/empresas/:id_empresa/configuracion-compra-vista')
		.get(function (req, res) {
			ConfiguracionCompraVista.find({
				where: {
					id_empresa: req.params.id_empresa
				}
			}).then(function (configuracionCompraVista) {
				res.json(configuracionCompraVista);
			});
		})

		.put(function (req, res) {
			ConfiguracionCompraVista.update({
				mostrar_producto: req.body.mostrar_producto,
				mostrar_costo_unitario: req.body.mostrar_costo_unitario,
				mostrar_cantidad: req.body.mostrar_cantidad,
				mostrar_importe: req.body.mostrar_importe,
				mostrar_descuento: req.body.mostrar_descuento,
				mostrar_recargo: req.body.mostrar_recargo,
				mostrar_ice: req.body.mostrar_ice,
				mostrar_excento: req.body.mostrar_excento,
				mostrar_total: req.body.mostrar_total,
				mostrar_fecha_vencimiento: req.body.mostrar_fecha_vencimiento,
				mostrar_lote: req.body.mostrar_lote,
				mostrar_codigo_producto: req.body.mostrar_codigo_producto,
				mostrar_unidad_producto: req.body.mostrar_unidad_producto
			}, {
					where: {
						id_empresa: req.params.id_empresa
					}
				}).then(function (actualizada) {
					res.json({ mensaje: "¡Actualizado Satisfactoriamente!" });
				});
		});

	router.route('/grupos/empresa/:id_empresa')
		.get(function (req, res) {
			sequelize.query("SELECT gl_clase.id, gl_clase.nombre FROM gl_clase,gl_tipo where gl_tipo.nombre_corto='GRUPOS PRODUCTOS' and gl_clase.tipo=gl_tipo.id and gl_tipo.empresa=" + req.params.id_empresa, { type: sequelize.QueryTypes.SELECT })
				.then(function (dato) {
					res.json(dato);;
				});


		});

	router.route('/subgrupos/empresa/:id_empresa')
		.get(function (req, res) {
			sequelize.query("SELECT gl_clase.id, gl_clase.nombre FROM gl_clase,gl_tipo where gl_tipo.nombre_corto='SUBGRUPOS PRODUCTOS' and gl_clase.tipo=gl_tipo.id and gl_tipo.empresa=" + req.params.id_empresa, { type: sequelize.QueryTypes.SELECT })
				.then(function (dato) {
					res.json(dato);;
				});


		});
}