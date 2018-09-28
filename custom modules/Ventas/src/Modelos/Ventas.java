/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Modelos;

/**
 *
 * @author AGIL
 */
public class Ventas {
    private int id;
    private int aCuenta;
    private int actividad;
    private int almacen;
    private double cambio;
    private int cliente;
    private boolean despachado;
    private String fecha;
    private String fechaTexto;
    private int empresa;
    private int usuario;
    private double importe;
    private int movimiento;
    private double pagado;
    private double saldo;
    private int sucursal;
    private int tipoPago;
    private double total;
    private double vendedor;

    public Ventas(int id, int aCuenta, int actividad, int almacen, double cambio, int cliente, boolean despachado, String fecha, String fechaTexto, int empresa, int usuario, double importe, int movimiento, double pagado, double saldo, int sucursal, int tipoPago, double total, double vendedor) {
        this.id = id;
        this.aCuenta = aCuenta;
        this.actividad = actividad;
        this.almacen = almacen;
        this.cambio = cambio;
        this.cliente = cliente;
        this.despachado = despachado;
        this.fecha = fecha;
        this.fechaTexto = fechaTexto;
        this.empresa = empresa;
        this.usuario = usuario;
        this.importe = importe;
        this.movimiento = movimiento;
        this.pagado = pagado;
        this.saldo = saldo;
        this.sucursal = sucursal;
        this.tipoPago = tipoPago;
        this.total = total;
        this.vendedor = vendedor;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getaCuenta() {
        return aCuenta;
    }

    public void setaCuenta(int aCuenta) {
        this.aCuenta = aCuenta;
    }

    public int getActividad() {
        return actividad;
    }

    public void setActividad(int actividad) {
        this.actividad = actividad;
    }

    public int getAlmacen() {
        return almacen;
    }

    public void setAlmacen(int almacen) {
        this.almacen = almacen;
    }

    public double getCambio() {
        return cambio;
    }

    public void setCambio(double cambio) {
        this.cambio = cambio;
    }

    public int getCliente() {
        return cliente;
    }

    public void setCliente(int cliente) {
        this.cliente = cliente;
    }

    public boolean isDespachado() {
        return despachado;
    }

    public void setDespachado(boolean despachado) {
        this.despachado = despachado;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getFechaTexto() {
        return fechaTexto;
    }

    public void setFechaTexto(String fechaTexto) {
        this.fechaTexto = fechaTexto;
    }

    public int getEmpresa() {
        return empresa;
    }

    public void setEmpresa(int empresa) {
        this.empresa = empresa;
    }

    public int getUsuario() {
        return usuario;
    }

    public void setUsuario(int usuario) {
        this.usuario = usuario;
    }

    public double getImporte() {
        return importe;
    }

    public void setImporte(double importe) {
        this.importe = importe;
    }

    public int getMovimiento() {
        return movimiento;
    }

    public void setMovimiento(int movimiento) {
        this.movimiento = movimiento;
    }

    public double getPagado() {
        return pagado;
    }

    public void setPagado(double pagado) {
        this.pagado = pagado;
    }

    public double getSaldo() {
        return saldo;
    }

    public void setSaldo(double saldo) {
        this.saldo = saldo;
    }

    public int getSucursal() {
        return sucursal;
    }

    public void setSucursal(int sucursal) {
        this.sucursal = sucursal;
    }

    public int getTipoPago() {
        return tipoPago;
    }

    public void setTipoPago(int tipoPago) {
        this.tipoPago = tipoPago;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public double getVendedor() {
        return vendedor;
    }

    public void setVendedor(double vendedor) {
        this.vendedor = vendedor;
    }
    
    
}
