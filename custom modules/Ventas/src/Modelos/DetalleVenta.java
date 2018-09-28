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
public class DetalleVenta {
    
    
    private int id ;
    private int idVenta ;
    private int idProducto;
    private double precioUnitario ;
    private double cantidad ;
    private double importe ;
    private double descuento ;
    private double recargo ;
    private double ice ;
    private double excento ;
    private boolean tipoDescuento ;
    private boolean tipoRecargo ;
    private double total ;
    private String createdAt ;
    private String updatedAt ;
    private String fechaVencimiento;
    private String lote;
    private int inventario;
    private String observaciones;
    private int servicio;

    public DetalleVenta(int id, int idVenta, int idProducto, double precioUnitario, double cantidad, double importe, double descuento, double recargo, double ice, double excento, boolean tipoDescuento, boolean tipoRecargo, double total, String createdAt, String updatedAt, String fechaVencimiento, String lote, int inventario, String observaciones, int servicio) {
        this.id = id;
        this.idVenta = idVenta;
        this.idProducto = idProducto;
        this.precioUnitario = precioUnitario;
        this.cantidad = cantidad;
        this.importe = importe;
        this.descuento = descuento;
        this.recargo = recargo;
        this.ice = ice;
        this.excento = excento;
        this.tipoDescuento = tipoDescuento;
        this.tipoRecargo = tipoRecargo;
        this.total = total;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.fechaVencimiento = fechaVencimiento;
        this.lote = lote;
        this.inventario = inventario;
        this.observaciones = observaciones;
        this.servicio = servicio;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getIdVenta() {
        return idVenta;
    }

    public void setIdVenta(int idVenta) {
        this.idVenta = idVenta;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
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

    public double getRecargo() {
        return recargo;
    }

    public void setRecargo(double recargo) {
        this.recargo = recargo;
    }

    public double getIce() {
        return ice;
    }

    public void setIce(double ice) {
        this.ice = ice;
    }

    public double getExcento() {
        return excento;
    }

    public void setExcento(double excento) {
        this.excento = excento;
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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(String fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

    public String getLote() {
        return lote;
    }

    public void setLote(String lote) {
        this.lote = lote;
    }

    public int getInventario() {
        return inventario;
    }

    public void setInventario(int inventario) {
        this.inventario = inventario;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public int getServicio() {
        return servicio;
    }

    public void setServicio(int servicio) {
        this.servicio = servicio;
    }

}
