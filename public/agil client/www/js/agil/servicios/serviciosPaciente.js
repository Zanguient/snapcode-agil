angular.module('agil.servicios')

    .factory('PacienteActivo', function ($resource) {
        return $resource(restServer + "pacientes/:id_paciente/activo/:activo", { id_paciente: '@id_paciente', activo: '@activo' },
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('Paciente', function ($resource) {
        return $resource(restServer + "pacientes/:id_paciente", { id_paciente: '@id_paciente' },
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('Comentario', function ($resource) {
        return $resource(restServer + "pacientes/:id_paciente/comentario", { id_paciente: '@id_paciente' },
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('DatosPacientes', ['Paciente', '$q', function (Paciente, $q) {
        var res = function () {
            var delay = $q.defer();
            Paciente.get(function (entidad) {
                delay.resolve(entidad);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('PacientesEmpresaPaginador', function ($resource) {
        return $resource(restServer + "pacientes/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/codigo/:codigo/nombres/:nombres/ci/:ci/campo/:campo/cargo/:cargo/busquedaEmpresa/:busquedaEmpresa/grupo/:grupo_sanguineo/estado/:estado/apellido/:apellido");
    })

    .factory('PacientesPaginador', ['PacientesEmpresaPaginador', '$q', function (PacientesEmpresaPaginador, $q) {
        var res = function (paginator)//idEmpresa, xxx
        {
            var delay = $q.defer();
            paginator.filter.cargo=(paginator.filter.cargo)?paginator.filter.cargo:0
            paginator.filter.campo=(paginator.filter.campo)?paginator.filter.campo:0
            PacientesEmpresaPaginador.get({
                id_empresa: paginator.filter.empresa,
                pagina: paginator.currentPage,
                items_pagina: paginator.itemsPerPage,
                texto_busqueda: paginator.search,
                columna: paginator.column,
                direccion: paginator.direction,
                codigo: paginator.filter.codigo,
                nombres: paginator.filter.nombres,
                ci: paginator.filter.ci,
                campo: paginator.filter.campo,
                cargo: paginator.filter.cargo,
                busquedaEmpresa: paginator.filter.busquedaEmpresa,
                estado: paginator.filter.estado,
                grupo_sanguineo: paginator.filter.grupo_sanguineo,
                apellido:0

            }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('aplicacionVacunasPacientes', function ($resource) {
        return $resource(restServer + "pacientes/Vacunas/excel/upload")
    })

    .factory('SOAPlistaPacientes', function ($resource) {
        return $resource(restServer + "pacientes/SOAP/excel/upload")
    })

    .factory('SignosVitalesPacientes', function ($resource) {
        return $resource(restServer + "pacientes/signos_vitales/excel/upload")
    })

    .factory('FichasTecnicasPacientes', function ($resource) {
        return $resource(restServer + "pacientes/ficha_tecnica/excel/upload")
    })

    .factory('PacientesEmpresa', function ($resource) {
        return $resource(restServer + "pacientes/empresa/excel/upload")
    })

    .factory('ListaPrerequisitos', function ($resource) {
        return $resource(restServer + "prerequisitos",
            {
                'update': { method: 'PUT' }
            });
    })

    // .factory('Paciente', function ($resource) {
    //     return $resource(restServer + "paciente/:id_paciente", { id_paciente: '@id_paciente' },
    //         {
    //             'update': { method: 'PUT' }
    //         });
    // })

    .factory('obtenerPaciente', ['Paciente', '$q', function (Paciente, $q) {
        var res = function (idPaciente) {
            var delay = $q.defer();
            Paciente.get({ id_paciente: idPaciente }, function (entidad) {
                delay.resolve(entidad);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('ListaDatosPrerequisito', ['ListaPrerequisitos', '$q', function (ListaPrerequisitos, $q) {
        var res = function () {
            var delay = $q.defer();
            ListaPrerequisitos.get(function (entidad) {
                delay.resolve(entidad);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('ListaGeneros', function ($resource) {
        return $resource(restServer + "generos",
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('ListaDatosGenero', ['ListaGeneros', '$q', function (ListaGeneros, $q) {
        var res = function () {
            var delay = $q.defer();
            ListaGeneros.query(function (entidad) {
                delay.resolve(entidad);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('ListaTiposControl', function ($resource) {
        return $resource(restServer + "tipo-control",
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('ListaDatosTiposControl', ['ListaTiposControl', '$q', function (ListaTiposControl, $q) {
        var res = function () {
            var delay = $q.defer();
            ListaTiposControl.query(function (entidad) {
                delay.resolve(entidad);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('Prerequisito', function ($resource) {
        return $resource(restServer + "prerequisitos",
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('Prerequisitos', ['Prerequisito', '$q', function (Prerequisito, $q) {
        var res = function () {
            var delay = $q.defer();
            Prerequisito.get(function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('PrerequisitoHistorial', function ($resource) {
        return $resource(restServer + "prerequisito/:id_pre/historial/:id_pac/inicio/:inicio/fin/:fin",{});
    })

    .factory('PrerequisitosHistorial', ['PrerequisitoHistorial', '$q', function (PrerequisitoHistorial, $q) {
        var res = function (datos) {
            var delay = $q.defer();
            PrerequisitoHistorial.get(datos,function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    
    .factory('PrerequisitoPaciente', function ($resource) {
        return $resource(restServer + "prerequisito/paciente")
            // {
            //     'update': { method: 'PUT' }
            // });
    })

    .factory('CrearPrerequisito', ['Prerequisito', '$q', function (Prerequisito, $q) {
        var res = function (id_paciente) {
            var delay = $q.defer();
            Prerequisito.save({ id_paciente: id_paciente }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('ActualizarPrerequisito', ['Prerequisito', '$q', function (Prerequisito, $q) {
        var res = function (prerequisito) {
            var delay = $q.defer();
            Prerequisito.update({ id_paciente: 0 }, prerequisito, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('listaPrarequisitos', function ($resource) {
        return $resource(restServer + "medico-paciente-pre-requisito/empresa/:id_empresa/inicio/:inicio/fin/:fin", null,
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('ListaPrerequisitosEmpresa', ['listaPrarequisitos', '$q', function (listaPrarequisitos, $q) {
        var res = function (idEmpresa, filtro) {
            var delay = $q.defer();
            listaPrarequisitos.get({ id_empresa: idEmpresa, inicio: filtro.inicio, fin: filtro.fin }, function (entidad) {
                delay.resolve(entidad);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('listaAlertasPrarequisitosPaciente', function ($resource) {
        return $resource(restServer + "medico-paciente-pre-requisito-alertas/empresa/:id_empresa/inicio/:inicio/fin/:fin", null,
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('ListaAlertasPrerequisitosPaciente', ['listaAlertasPrarequisitosPaciente', '$q', function (listaAlertasPrarequisitosPaciente, $q) {
        var res = function (idEmpresa, filtro) {
            var delay = $q.defer();
            listaAlertasPrarequisitosPaciente.get({ id_empresa: idEmpresa, inicio: filtro.inicio, fin: filtro.fin }, function (entidad) {
                delay.resolve(entidad);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('listaAlertasVacunas', function ($resource) {
        return $resource(restServer + "medico-paciente-vacunas-alertas/empresa/:id_empresa/inicio/:inicio/fin/:fin/opcion/:opcion", null,
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('ListaAlertasVacunasEmpresa', ['listaAlertasVacunas', '$q', function (listaAlertasVacunas, $q) {
        var res = function (idEmpresa, filtro) {
            var delay = $q.defer();
            listaAlertasVacunas.get({ id_empresa: idEmpresa, inicio: filtro.inicio, fin: filtro.fin,opcion:filtro.vacuna}, function (entidad) {
                delay.resolve(entidad);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('listaVacunas', function ($resource) {
        return $resource(restServer + "medico-paciente-vacunas/empresa/:id_empresa/inicio/:inicio/fin/:fin", null,
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('ListaVacunasEmpresa', ['listaVacunas', '$q', function (listaVacunas, $q) {
        var res = function (idEmpresa, filtro) {
            var delay = $q.defer();
            listaVacunas.get({ id_empresa: idEmpresa, inicio: filtro.inicio, fin: filtro.fin }, function (entidad) {
                delay.resolve(entidad);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('listaPrarequisitosPaciente', function ($resource) {
        return $resource(restServer + "medico-paciente-pre-requisito/paciente/:id_paciente/inicio/:inicio/fin/:fin", null,
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('ListaPrerequisitosPaciente', ['listaPrarequisitosPaciente', '$q', function (listaPrarequisitosPaciente, $q) {
        var res = function (idPaciente, filtro) {
            var delay = $q.defer();
            listaPrarequisitosPaciente.get({ id_paciente: idPaciente, inicio: filtro.inicio, fin: filtro.fin }, function (entidad) {
                delay.resolve(entidad);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('MedicoPacientepatologia', function ($resource) {
        return $resource(restServer + "medico-paciente-patologia/paciente/:id_paciente", { id_paciente: '@id_paciente' },
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('ActualizarPatologiaPaciente', ['MedicoPacientepatologia', '$q', function (MedicoPacientepatologia, $q) {
        var res = function (idPaciente, ficha) {
            var delay = $q.defer();
            MedicoPacientepatologia.update({ id_paciente: idPaciente }, ficha, function (entidad) {
                delay.resolve(entidad);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('MedicoPacienteFicha', function ($resource) {
        return $resource(restServer + "medico-paciente-ficha/paciente/:id_paciente", null,
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('CrearMedicoPacienteFicha', ['MedicoPacienteFicha', '$q', function (MedicoPacienteFicha, $q) {
        var res = function (ficha) {
            var delay = $q.defer();
            MedicoPacienteFicha.save({ id_paciente: 0 }, ficha, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('BuscarFichaPaciente', ['MedicoPacienteFicha', '$q', function (MedicoPacienteFicha, $q) {
        var res = function (idPaciente) {
            var delay = $q.defer();
            MedicoPacienteFicha.get({ id_paciente: idPaciente }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('FichasMedicoPaciente', function ($resource) {
        return $resource(restServer + "historial-ficha-medico-paciente/paciente/:id_paciente/inicio/:inicio/fin/:fin/tipo-control/:tipo_control", null,
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('HistorialFichaMedicoPaciente', ['FichasMedicoPaciente', '$q', function (FichasMedicoPaciente, $q) {
        var res = function (idPaciente, filtro) {
            var delay = $q.defer();
            FichasMedicoPaciente.query({ id_paciente: idPaciente, inicio: filtro.inicio, fin: filtro.fin, tipo_control: filtro.tipo_control }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('MedicoPacienteConsulta', function ($resource) {
        return $resource(restServer + "medico-paciente-consulta", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('CrearMedicoPacienteConsulta', ['MedicoPacienteConsulta', '$q', function (MedicoPacienteConsulta, $q) {
        var res = function (consulta) {
            var delay = $q.defer();
            MedicoPacienteConsulta.save(consulta, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('DatosPrerequisitoPaciente', ['Prerequisito', '$q', function (Prerequisito, $q) {
        var res = function (id_paciente, paginator) {
            var delay = $q.defer();
            Prerequisito.query({
                id_paciente: id_paciente, pagina: paginator.currentPage,
                items_pagina: paginator.itemsPerPage,
                busqueda: paginator.search,
                inicio: paginator.filter.fecha_inicio,
                fin: paginator.filter.fecha_fin,
                columna: paginator.column,
                direccion: paginator.direction
            }, function (entidad) {
                delay.resolve(entidad);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('ListaConsultaPaciente', function ($resource) {
        return $resource(restServer + "medico-paciente-consulta/paciente/:id_paciente/inicio/:inicio/fin/:fin", null,
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ListaConsultasMedicoPaciente', ['ListaConsultaPaciente', '$q', function (ListaConsultaPaciente, $q) {
        var res = function (id_paciente, filtro) {
            var delay = $q.defer();
            ListaConsultaPaciente.get({
                id_paciente: id_paciente,
                inicio: filtro.inicio,
                fin: filtro.fin
            }, function (entidad) {
                delay.resolve(entidad);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('prerequisitoFiltro', function ($resource) {
        return $resource(restServer + "cotizacion/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/importe/:importe/busqueda/:busqueda/fecha-inicio/:inicio/fecha-fin/:fin/columna/:columna/direccion/:direccion", null,
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('filtroPrerequisitos', ['prerequisitoFiltro', '$q', function (prerequisitoFiltro, $q) {
        var res = function (paginator) {
            var delay = $q.defer();
            prerequisitoFiltro.get({
                id_empresa: paginator.filter.empresa,
                pagina: paginator.currentPage,
                items_pagina: paginator.itemsPerPage,
                busqueda: paginator.search,
                inicio: paginator.filter.fecha_inicio,
                fin: paginator.filter.fecha_fin,
                columna: paginator.column,
                direccion: paginator.direction
            }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('asignacionPacienteVacuna', function ($resource) {
        return $resource(restServer + "paciente/vacuna/asignacion/:id/:asignar", { id: '@id', asignar: '@asignar' },
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('aplicacionPacienteVacuna', function ($resource) {
        return $resource(restServer + "paciente/aplicacion/vacuna/:id", { id: '@id' },
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('VacunasPacientedosis', ['aplicacionPacienteVacuna', '$q', function (aplicacionPacienteVacuna, $q) {
        var res = function (vacuna) {
            var delay = $q.defer();
            prom = aplicacionPacienteVacuna.query({ id: vacuna.id }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('PacienteVacuna', function ($resource) {
        return $resource(restServer + "paciente/vacuna/:id_paciente", { id_paciente: '@id_paciente' },
            {
                'update': { method: 'PUT' }
            });
    })

    // .factory('PacienteVacunaAsignar', function ($resource) {
    //     return $resource(restServer + "/paciente/vacuna/", { id_paciente: '@id_paciente' },
    //         {
    //             'update': { method: 'PUT' }
    //         });
    // })

    .factory('VacunasPaciente', ['PacienteVacuna', '$q', function (PacienteVacuna, $q) {
        var res = function (paciente) {
            var delay = $q.defer();
            PacienteVacuna.query({ id_paciente: paciente.id }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('Vacunas', function ($resource) {
        return $resource(restServer + "vacunas/:id", { id: '@id' },
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('Vacuna', function ($resource) {
        return $resource(restServer + "vacunas", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ltsVacunas', ['Vacunas', '$q', function (Vacunas, $q) {
        var res = function () {
            var delay = $q.defer();
            Vacunas.query(function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    // .factory('crearVacuna', ['datosVacunas', '$q', function (datosVacunas, $q) {
    //     var res = function (paciente) {
    //         var delay = $q.defer();
    //         datosVacunas.save({ id_paciente: id_paciente }, function (entidades) {
    //             delay.resolve(entidades);
    //         }, function (error) {
    //                 delay.reject(error);
    //             });
    //         return delay.promise;
    //     };
    //     return res;
    // }])

    // rutas laboratorio inicio
    .factory('MedicoLaboratorio', function ($resource) {
        return $resource(restServer + "nuevo-laboratorio/empresa/:id_empresa", { id_empresa: '@id_empresa' },
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('CrearLaboratorio', ['MedicoLaboratorio', '$q', function (MedicoLaboratorio, $q) {
        var res = function (idEmpresa, laboratorio) {
            var delay = $q.defer();
            MedicoLaboratorio.save({ id_empresa: idEmpresa }, laboratorio, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('ActualizarLaboratorio', ['MedicoLaboratorio', '$q', function (MedicoLaboratorio, $q) {
        var res = function (idEmpresa, laboratorio) {
            var delay = $q.defer();
            MedicoLaboratorio.save({ id_empresa: idEmpresa }, laboratorio, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('EliminarLaboratorio', ['MedicoLaboratorio', '$q', function (MedicoLaboratorio, $q) {
        var res = function (idEmpresa, laboratorio) {
            var delay = $q.defer();
            MedicoLaboratorio.update({ id_empresa: idEmpresa }, laboratorio, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('ListaLaboratorios', ['MedicoLaboratorio', '$q', function (MedicoLaboratorio, $q) {
        var res = function (idEmpresa) {
            var delay = $q.defer();
            MedicoLaboratorio.query({ id_empresa: idEmpresa }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('MedicoLaboratorioExamen', function ($resource) {
        return $resource(restServer + "nuevo-laboratorio-examen/laboratorio/:id_laboratorio", { id_laboratorio: '@id_laboratorio' },
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('CrearLaboratorioExamen', ['MedicoLaboratorioExamen', '$q', function (MedicoLaboratorioExamen, $q) {
        var res = function (idLaboratorio, examen) {
            var delay = $q.defer();
            MedicoLaboratorioExamen.save({ id_laboratorio: idLaboratorio }, examen, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('ActualizarLaboratorioExamen', ['MedicoLaboratorioExamen', '$q', function (MedicoLaboratorioExamen, $q) {
        var res = function (idLaboratorio, examen) {
            var delay = $q.defer();
            MedicoLaboratorioExamen.save({ id_laboratorio: idLaboratorio }, examen, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('EliminarLaboratorioExamen', ['MedicoLaboratorioExamen', '$q', function (MedicoLaboratorioExamen, $q) {
        var res = function (idLaboratorio, examen) {
            var delay = $q.defer();
            MedicoLaboratorioExamen.update({ id_laboratorio: idLaboratorio }, examen, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('ListaLaboratorioExamenes', ['MedicoLaboratorioExamen', '$q', function (MedicoLaboratorioExamen, $q) {
        var res = function (idLaboratorio) {
            var delay = $q.defer();
            MedicoLaboratorioExamen.query({ id_laboratorio: idLaboratorio }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('MedicoLaboratorioExamenResultado', function ($resource) {
        return $resource(restServer + "nuevo-laboratorio-resultado/laboratorio/:id_laboratorio/paciente/:id_paciente", { id_laboratorio: '@id_laboratorio', id_paciente: '@id_paciente' },
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('CrearLaboratorioExamenResultado', ['MedicoLaboratorioExamenResultado', '$q', function (MedicoLaboratorioExamenResultado, $q) {
        var res = function (idLaboratorio, idPaciente, datos) {
            var delay = $q.defer();
            MedicoLaboratorioExamenResultado.save({ id_laboratorio: idLaboratorio, id_paciente: idPaciente }, datos, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('LaboratorioExamenHistorial', function ($resource) {
        return $resource(restServer + "laboratorio-resultado/laboratorio/:id_laboratorio/paciente/:id_paciente/inicio/:inicio/fin/:fin", null,
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('LaboratorioExamenListaHistorial', ['LaboratorioExamenHistorial', '$q', function (LaboratorioExamenHistorial, $q) {
        var res = function (idLaboratorio, idPaciente, filtro) {
            var delay = $q.defer();
            LaboratorioExamenHistorial.query({ id_laboratorio: idLaboratorio, id_paciente: idPaciente, inicio: filtro.inicio, fin: filtro.fin }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    // rutas laboratorio fin
    .factory('MedicoDiagnostico', function ($resource) {
        return $resource(restServer + "nuevo-diagnostico/empresa/:id_empresa", { id_empresa: '@id_empresa' },
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('CrearDiagnostico', ['MedicoDiagnostico', '$q', function (MedicoDiagnostico, $q) {
        var res = function (idEmpresa, diagnostico) {
            var delay = $q.defer();
            MedicoDiagnostico.save({ id_empresa: idEmpresa }, diagnostico, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('ActualizarDiagnostico', ['MedicoDiagnostico', '$q', function (MedicoDiagnostico, $q) {
        var res = function (idEmpresa, diagnostico) {
            var delay = $q.defer();
            MedicoDiagnostico.save({ id_empresa: idEmpresa }, diagnostico, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('EliminarDiagnostico', ['MedicoDiagnostico', '$q', function (MedicoDiagnostico, $q) {
        var res = function (idEmpresa, Diagnostico) {
            var delay = $q.defer();
            MedicoDiagnostico.update({ id_empresa: idEmpresa }, Diagnostico, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('ListaDiagnosticos', ['MedicoDiagnostico', '$q', function (MedicoDiagnostico, $q) {
        var res = function (idEmpresa) {
            var delay = $q.defer();
            MedicoDiagnostico.query({ id_empresa: idEmpresa }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('MedicoDiagnosticoExamen', function ($resource) {
        return $resource(restServer + "nuevo-diagnostico-examen/diagnostico/:id_diagnostico", { id_diagnostico: '@id_diagnostico' },
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('CrearDiagnosticoExamen', ['MedicoDiagnosticoExamen', '$q', function (MedicoDiagnosticoExamen, $q) {
        var res = function (idDiagnostico, examen) {
            var delay = $q.defer();
            MedicoDiagnosticoExamen.save({ id_diagnostico: idDiagnostico }, examen, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('ActualizarDiagnosticoExamen', ['MedicoDiagnosticoExamen', '$q', function (MedicoDiagnosticoExamen, $q) {
        var res = function (idDiagnostico, examen) {
            var delay = $q.defer();
            MedicoDiagnosticoExamen.save({ id_diagnostico: idDiagnostico }, examen, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('EliminarDiagnosticoExamen', ['MedicoDiagnosticoExamen', '$q', function (MedicoDiagnosticoExamen, $q) {
        var res = function (idDiagnostico, examen) {
            var delay = $q.defer();
            MedicoDiagnosticoExamen.update({ id_diagnostico: idDiagnostico }, examen, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('ListaDiagnosticoExamenes', ['MedicoDiagnosticoExamen', '$q', function (MedicoDiagnosticoExamen, $q) {
        var res = function (idDiagnostico) {
            var delay = $q.defer();
            MedicoDiagnosticoExamen.query({ id_diagnostico: idDiagnostico }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('MedicoDiagnosticoExamenResultado', function ($resource) {
        return $resource(restServer + "nuevo-diagnostico-resultado/diagnostico/:id_diagnostico/paciente/:id_paciente", { id_diagnostico: '@id_diagnostico', id_paciente: '@id_paciente' },
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('CrearDiagnosticoExamenResultado', ['MedicoDiagnosticoExamenResultado', '$q', function (MedicoDiagnosticoExamenResultado, $q) {
        var res = function (idDiagnostico, idPaciente, datos) {
            var delay = $q.defer();
            MedicoDiagnosticoExamenResultado.save({ id_diagnostico: idDiagnostico, id_paciente: idPaciente }, datos, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('DiagnosticoExamenHistorial', function ($resource) {
        return $resource(restServer + "diagnostico-resultado/diagnostico/:id_diagnostico/paciente/:id_paciente/inicio/:inicio/fin/:fin", null,
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('DiagnosticoExamenListaHistorial', ['DiagnosticoExamenHistorial', '$q', function (DiagnosticoExamenHistorial, $q) {
        var res = function (idDiagnostico, idPaciente, filtro) {
            var delay = $q.defer();
            DiagnosticoExamenHistorial.query({ id_diagnostico: idDiagnostico, id_paciente: idPaciente, inicio: filtro.inicio, fin: filtro.fin }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])