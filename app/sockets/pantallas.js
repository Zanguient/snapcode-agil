module.exports=function(io,socket){
	var socketIdPantallaCliente;
	//io.on('connection', function(socket){		
		socket.on('comenzarVenta', function(venta){
			//io.emit('helloserver', { hello: msg.data});
			socketIdPantallaCliente=socket.id;
			socket.broadcast.emit('mostrarVenta',venta);
		});
		
		socket.on('terminarVenta', function(venta){
			//io.sockets.connected[socketIdPantallaCliente].emit('mostrarProductos', sucursal);
			socket.broadcast.emit('mostrarProductos',venta);
		});
		
		//io.emit('helloserver', { hello: 'world' });
	//});
}