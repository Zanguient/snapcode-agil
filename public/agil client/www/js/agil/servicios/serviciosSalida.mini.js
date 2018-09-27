angular.module("agil.servicios").factory("BusquedaProductosEmpresa",["$resource",function(r){return r(restServer+"productos/empresa/:idEmpresa/texto/:texto")}]).factory("ListaProductosEmpresa",["BusquedaProductosEmpresa","$q",function(r,e){return function(o,t){var n=e.defer();return r.query({idEmpresa:o,texto:t},function(r){n.resolve(r)},function(r){n.reject(r)}),n.promise}}]).factory("BusquedaProductosEmpresaUsuario",["$resource",function(r){return r(restServer+"productos/empresa/:idEmpresa/texto/:texto/user/:id_usuario/almacen/:id_almacen")}]).factory("ListaProductosEmpresaUsuario",["BusquedaProductosEmpresaUsuario","$q",function(r,e){return function(o,t,n,u){var a=e.defer();return r.query({idEmpresa:o,texto:t,id_usuario:n,id_almacen:u},function(r){a.resolve(r)},function(r){a.reject(r)}),a.promise}}]).factory("InventariosProducto",["$resource",function(r){return r(restServer+"inventarios/producto/:id_producto/almacen/:id_almacen")}]).factory("ListaInventariosProducto",["InventariosProducto","$q",function(r,e){return function(o,t){var n=e.defer();return r.query({id_producto:o,id_almacen:t},function(r){n.resolve(r)},function(r){n.reject(r)}),n.promise}}]).factory("ConfiguracionVentaVista",["$resource",function(r){return r(restServer+"empresas/:id_empresa/configuracion-venta-vista",null,{update:{method:"PUT"}})}]).factory("ConfiguracionVentaVistaDatos",["ConfiguracionVentaVista","$q",function(r,e){return function(o){var t=e.defer();return r.get({id_empresa:o},function(r){t.resolve(r)},function(r){t.reject(r)}),t.promise}}]).factory("ConfiguracionCompraVista",["$resource",function(r){return r(restServer+"empresas/:id_empresa/configuracion-compra-vista",null,{update:{method:"PUT"}})}]).factory("ConfiguracionCompraVistaDatos",["ConfiguracionCompraVista","$q",function(r,e){return function(o){var t=e.defer();return r.get({id_empresa:o},function(r){t.resolve(r)},function(r){t.reject(r)}),t.promise}}]).factory("GruposProductoEmpresa",["$resource",function(r){return r(restServer+"grupos/empresa/:id_empresa",null,{update:{method:"PUT"}})}]).factory("ListaGruposProductoEmpresa",["GruposProductoEmpresa","$q",function(r,e){return function(o){var t=e.defer();return r.query({id_empresa:o},function(r){t.resolve(r)},function(r){t.reject(r)}),t.promise}}]).factory("GruposProductoUsuario",["$resource",function(r){return r(restServer+"grupos/empresa/:id_empresa/user/:id_usuario",null,{update:{method:"PUT"}})}]).factory("ListaGruposProductoUsuario",["GruposProductoUsuario","$q",function(r,e){return function(o,t){var n=e.defer();return r.query({id_empresa:o,id_usuario:t},function(r){n.resolve(r)},function(r){n.reject(r)}),n.promise}}]).factory("VendedorVenta",["$resource",function(r){return r(restServer+"vendedor-venta/empresa/:id_empresa",null,{update:{method:"PUT"}})}]).factory("ListaVendedorVenta",["VendedorVenta","$q",function(r,e){return function(o){var t=e.defer();return r.query({id_empresa:o},function(r){t.resolve(r)},function(r){t.reject(r)}),t.promise}}]).factory("VendedorVentaActualizacion",["$resource",function(r){return r(restServer+"vendedor-venta/:id_vendedor",{id_vendedor:"@id"},{update:{method:"PUT"}})}]).factory("SubGruposProductoEmpresa",["$resource",function(r){return r(restServer+"subgrupos/empresa/:id_empresa",null,{update:{method:"PUT"}})}]).factory("ListaSubGruposProductoEmpresa",["SubGruposProductoEmpresa","$q",function(r,e){return function(o){var t=e.defer();return r.query({id_empresa:o},function(r){t.resolve(r)},function(r){t.reject(r)}),t.promise}}]).factory("InventariosProductosVentaEdicion",["$resource",function(r){return r(restServer+"inventarios-venta-edicion/producto/:id_producto/almacen/:id_almacen/fecha/:fecha")}]).factory("ListaInventariosProductoVentaEdicion",["InventariosProductosVentaEdicion","$q",function(r,e){return function(o,t,n){var u=e.defer();return r.query({id_producto:o,id_almacen:t,fecha:n},function(r){u.resolve(r)},function(r){u.reject(r)}),u.promise}}]);