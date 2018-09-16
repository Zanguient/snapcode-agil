angular.module('agil.servicios')
    .factory('BalanceComprobacionFiltroSS', function ($resource) {
		return $resource(restServer + "balance-comp-suma-saldo/empresa/:id_empresa/tipo_periodo/:periodo/gestion/:gestion/mes/:mes/inicio/:inicio/fin/:fin/gestion_fin/:gestion_fin", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('BalanceComprobacionSS', ['BalanceComprobacionFiltroSS', '$q', function (BalanceComprobacionFiltroSS, $q) {
		var res = function (filtro,idEmpresa) {
			var delay = $q.defer();
			BalanceComprobacionFiltroSS.save({
				id_empresa: idEmpresa,
				periodo: filtro.tipoPeriodo.nombre,
                gestion:(filtro.gestion)?filtro.gestion.nombre:0,
                mes:(filtro.mes.id)?filtro.mes.id:0,
                inicio:(filtro.inicio2)?filtro.inicio2:0,
                fin:(filtro.fin2)?filtro.fin2:0,
                gestion_fin:(filtro.gestion_fin)?filtro.gestion_fin.nombre:0
			},filtro, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])