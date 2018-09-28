angular.module("agil.servicios").factory("SolicitudCajaChica",["$resource",function(e){return e(restServer+"solicitud-caja-chica",null,{update:{method:"PUT"}})}]).factory("GuardarSolicitudCajaChica",["SolicitudCajaChica","$q",function(e,a){return function(r){var i=a.defer();return e.save(r,function(e){i.resolve(e)},function(e){i.reject(e)}),i.promise}}]).factory("ConceptoMovimientoCajaChica",["$resource",function(e){return e(restServer+"solicitud-conceptos-caja-chica/empresa/:id_empresa",null,{update:{method:"PUT"}})}]).factory("GuardarConceptoMovimientoCajaChica",["ConceptoMovimientoCajaChica","$q",function(e,a){return function(r,i){var o=a.defer();return e.save({id_empresa:r},i,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise}}]).factory("ObtenerConceptoMovimientoCajaChica",["ConceptoMovimientoCajaChica","$q",function(e,a){return function(r,i){var o=a.defer();return e.query({id_empresa:r},function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise}}]).factory("SolicitudCajaChicaPaginador",["$resource",function(e){return e(restServer+"solocitudes-caja-chica/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/solicitante/:solicitante/usuario/:usuario/estado/:estado/concepto/:concepto/movimiento/:movimiento/usuario-no-autorizado/:id_usuario_no_autorizado")}]).factory("SolicitudesCajaPaginador",["SolicitudCajaChicaPaginador","$q",function(e,a){return function(r){var i=a.defer();return e.get({id_empresa:r.filter.empresa,pagina:r.currentPage,items_pagina:r.itemsPerPage,texto_busqueda:r.search,columna:r.column,direccion:r.direction,solicitante:r.filter.solicitante,usuario:r.filter.usuario,estado:r.filter.estado,concepto:r.filter.concepto,movimiento:r.filter.movimiento,id_usuario_no_autorizado:r.filter.id_usuario_no_autorizado},function(e){i.resolve(e)},function(e){i.reject(e)}),i.promise}}]).factory("CajaChicaPaginador",["$resource",function(e){return e(restServer+"caja-chica/sucursal/:id_sucursal/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/solicitante/:solicitante/usuario/:usuario/estado/:estado/concepto/:concepto/movimiento/:movimiento/usuario-no-autorizado/:id_usuario_no_autorizado/rendiciones/:rendiciones")}]).factory("SolicitudesCajaChicaPaginador",["CajaChicaPaginador","$q",function(e,a){return function(r){var i=a.defer();return e.get({id_empresa:r.filter.empresa,pagina:r.currentPage,items_pagina:r.itemsPerPage,texto_busqueda:r.search,columna:r.column,direccion:r.direction,solicitante:r.filter.solicitante,usuario:r.filter.usuario,estado:r.filter.estado,concepto:r.filter.concepto,movimiento:r.filter.movimiento,id_usuario_no_autorizado:r.filter.id_usuario_no_autorizado,id_sucursal:r.filter.id_sucursal,rendiciones:r.filter.rendiciones},function(e){i.resolve(e)},function(e){i.reject(e)}),i.promise}}]).factory("IngresosCajaChicaPaginador",["$resource",function(e){return e(restServer+"caja-chica/sucursal/:id_sucursal/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion")}]).factory("IngresosCajaPaginador",["IngresosCajaChicaPaginador","$q",function(e,a){return function(r){var i=a.defer();return e.get({id_empresa:r.filter.empresa,pagina:r.currentPage,items_pagina:r.itemsPerPage,texto_busqueda:r.search,columna:r.column,direccion:r.direction,id_sucursal:r.filter.id_sucursal},function(e){i.resolve(e)},function(e){i.reject(e)}),i.promise}}]).factory("DatosGuardarCajaChica",["$resource",function(e){return e(restServer+"caja-chica/:id_empresa",null,{update:{method:"PUT"}})}]).factory("GuardarCajaChica",["DatosGuardarCajaChica","$q",function(e,a){return function(r,i){var o=a.defer();return e.save({id_empresa:i},r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise}}]).factory("DatosCierreCaja",["$resource",function(e){return e(restServer+"caja-chica/sucursal/:id_sucursal/empresa/:id_empresa/fecha/:fecha/saldoInicial/:saldo",null,{update:{method:"PUT"}})}]).factory("ObtenerDatosCierreCaja",["DatosCierreCaja","$q",function(e,a){return function(r,i,o,t){var c=a.defer();return e.get({id_empresa:r,fecha:i,saldo:o,id_sucursal:t},function(e){c.resolve(e)},function(e){c.reject(e)}),c.promise}}]).factory("CierreCajaChicaPaginador",["$resource",function(e){return e(restServer+"cierre-caja-chica/sucursal/:id_sucursal/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion")}]).factory("CierreCajaCPaginador",["CierreCajaChicaPaginador","$q",function(e,a){return function(r){var i=a.defer();return e.get({id_empresa:r.filter.empresa,pagina:r.currentPage,items_pagina:r.itemsPerPage,texto_busqueda:r.search,columna:r.column,direccion:r.direction,id_sucursal:r.filter.id_sucursal},function(e){i.resolve(e)},function(e){i.reject(e)}),i.promise}}]).factory("AlertasCajaChica",["$resource",function(e){return e(restServer+"alertas-solicitud-caja-chica/empresa/:id_empresa/historico/:historico/mes/:mes/anio/:anio/verificador/:id_verificador",null,{update:{method:"PUT"}})}]).factory("ObtenerAlertasCajaChica",["AlertasCajaChica","$q",function(e,a){return function(r,i){var o=a.defer();return e.query({id_empresa:r.id_empresa,historico:r.historico?1:0,mes:""==r.mes?0:r.mes,anio:""==r.anio?0:r.anio,id_verificador:i},function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise}}]).factory("VerificacionCajaChica",["$resource",function(e){return e(restServer+"verificar-solicitudes-caja-chica",null,{update:{method:"PUT"}})}]).factory("GuardarVerificadorSolicitud",["VerificacionCajaChica","$q",function(e,a){return function(r,i){var o=a.defer();return e.update({},i,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise}}]);