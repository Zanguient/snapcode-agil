/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package UI;

/**
 *
 * @author AGIL
 */
public class DetalleVentaExport {
    private int idVenta;
    private int cantidad;
    private double descuento;
    private int excento;
    private int ice;
    private double importe;
    private double inventarioDisponible;
    private double precioUnitario;
    private int recargo;
    private boolean tipoDescuento;
    private boolean tipoRecargo;
    private double total;

    public DetalleVentaExport(int idVenta, int cantidad, double descuento, int excento, int ice, double importe, double inventarioDisponible, double precioUnitario, int recargo, boolean tipoDescuento, boolean tipoRecargo, double total) {
        this.idVenta = idVenta;
        this.cantidad = cantidad;
        this.descuento = descuento;
        this.excento = excento;
        this.ice = ice;
        this.importe = importe;
        this.inventarioDisponible = inventarioDisponible;
        this.precioUnitario = precioUnitario;
        this.recargo = recargo;
        this.tipoDescuento = tipoDescuento;
        this.tipoRecargo = tipoRecargo;
        this.total = total;
    }

    public int getIdVenta() {
        return idVenta;
    }

    public void setIdVenta(int idVenta) {
        this.idVenta = idVenta;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public double getDescuento() {
        return descuento;
    }

    public void setDescuento(double descuento) {
        this.descuento = descuento;
    }

    public int getExcento() {
        return excento;
    }

    public void setExcento(int excento) {
        this.excento = excento;
    }

    public int getIce() {
        return ice;
    }

    public void setIce(int ice) {
        this.ice = ice;
    }

    public double getImporte() {
        return importe;
    }

    public void setImporte(double importe) {
        this.importe = importe;
    }

    public double getInventarioDisponible() {
        return inventarioDisponible;
    }

    public void setInventarioDisponible(double inventarioDisponible) {
        this.inventarioDisponible = inventarioDisponible;
    }

    public double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public int getRecargo() {
        return recargo;
    }

    public void setRecargo(int recargo) {
        this.recargo = recargo;
    }

    public boolean isTipoDescuento() {
        return tipoDescuento;
    }

    public void setTipoDescuento(boolean tipoDescuento) {
        this.tipoDescuento = tipoDescuento;
    }

    public boolean isTipoRecargo() {
        return tipoRecargo;
    }

    public void setTipoRecargo(boolean tipoRecargo) {
        this.tipoRecargo = tipoRecargo;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
  
}
