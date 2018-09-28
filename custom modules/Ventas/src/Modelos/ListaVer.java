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
public class ListaVer {
    private int idV;
    private int nit;
    private String razon_social;
    private int numFactura;
    private String numAutorizacion;
    private String fecha;
    private String codigoControl;
    private String sucursal;
    private String almacen;
    private String tipoPago;
    private double pago;
    private double cambio;
    
    private String nombreProducto;
    private String codigoItem;
    private String unidadMedida;
    private double precioUnitario;
    private double cantidad;
    private double importe;
    private double descuento;
    private double recargos;
    private double ice;
    private double excentos;
    private double sujetoA;

    public ListaVer(String nombreProducto, String codigoItem,String unidadMedida, double precioUnitario, double cantidad, double importe, double descuento, double recargos, double ice, double excentos, double sujetoA) {
        this.nombreProducto = nombreProducto;
        this.codigoItem = codigoItem;
        this.unidadMedida = unidadMedida;
        this.precioUnitario = precioUnitario;
        this.cantidad = cantidad;
        this.importe = importe;
        this.descuento = descuento;
        this.recargos = recargos;
        this.ice = ice;
        this.excentos = excentos;
        this.sujetoA = sujetoA;
    }
    

    public ListaVer(int idV,int nit, String razon_social, int numFactura, String numAutorizacion, String fecha, String codigoControl, String sucursal, String almacen, String tipoPago, double pago, double cambio) {
        this.idV = idV;
        this.nit = nit;
        this.razon_social = razon_social;
        this.numFactura = numFactura;
        this.numAutorizacion = numAutorizacion;
        this.fecha = fecha;
        this.codigoControl = codigoControl;
        this.sucursal = sucursal;
        this.almacen = almacen;
        this.tipoPago = tipoPago;
        this.pago = pago;
        this.cambio = cambio;
    }

    public String getUnidadMedida() {
        return unidadMedida;
    }

    public void setUnidadMedida(String unidadMedida) {
        this.unidadMedida = unidadMedida;
    }
    
    
    public int getNit() {
        return nit;
    }

    public void setNit(int nit) {
        this.nit = nit;
    }

    public String getRazon_social() {
        return razon_social;
    }

    public void setRazon_social(String razon_social) {
        this.razon_social = razon_social;
    }

    public int getNumFactura() {
        return numFactura;
    }

    public void setNumFactura(int numFactura) {
        this.numFactura = numFactura;
    }

    public String getNumAutorizacion() {
        return numAutorizacion;
    }

    public void setNumAutorizacion(String numAutorizacion) {
        this.numAutorizacion = numAutorizacion;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getCodigoControl() {
        return codigoControl;
    }

    public void setCodigoControl(String codigoControl) {
        this.codigoControl = codigoControl;
    }

    public String getSucursal() {
        return sucursal;
    }

    public void setSucursal(String sucursal) {
        this.sucursal = sucursal;
    }

    public String getAlmacen() {
        return almacen;
    }

    public void setAlmacen(String almacen) {
        this.almacen = almacen;
    }

    public String getTipoPago() {
        return tipoPago;
    }

    public void setTipoPago(String tipoPago) {
        this.tipoPago = tipoPago;
    }

    public double getPago() {
        return pago;
    }

    public void setPago(double pago) {
        this.pago = pago;
    }

    public double getCambio() {
        return cambio;
    }

    public void setCambio(double cambio) {
        this.cambio = cambio;
    }

    public int getIdV() {
        return idV;
    }

    public void setIdV(int idV) {
        this.idV = idV;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public String getCodigoItem() {
        return codigoItem;
    }

    public void setCodigoItem(String codigoItem) {
        this.codigoItem = codigoItem;
    }

    public double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public double getCantidad() {
        return cantidad;
    }

    public void setCantidad(double cantidad) {
        this.cantidad = cantidad;
    }

    public double getImporte() {
        return importe;
    }

    public void setImporte(double importe) {
        this.importe = importe;
    }

    public double getDescuento() {
        return descuento;
    }

    public void setDescuento(double descuento) {
        this.descuento = descuento;
    }

    public double getRecargos() {
        return recargos;
    }

    public void setRecargos(double recargos) {
        this.recargos = recargos;
    }

    public double getIce() {
        return ice;
    }

    public void setIce(double ice) {
        this.ice = ice;
    }

    public double getExcentos() {
        return excentos;
    }

    public void setExcentos(double excentos) {
        this.excentos = excentos;
    }

    public double getSujetoA() {
        return sujetoA;
    }

    public void setSujetoA(double sujetoA) {
        this.sujetoA = sujetoA;
    }

   
}
