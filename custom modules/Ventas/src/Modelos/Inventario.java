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
public class Inventario {
    private int id;
    private int almacen;
    private int producto;
    private double cantidad;
    private double costo_unitario;
    private double costo_total;
    private String created;
    private String updated;
    private String fecha_vencimiento;
    private String lote;

    public Inventario(int id, int almacen, int producto, double cantidad, double costo_unitario, double costo_total, String created, String updated, String fecha_vencimiento, String lote) {
        this.id = id;
        this.almacen = almacen;
        this.producto = producto;
        this.cantidad = cantidad;
        this.costo_unitario = costo_unitario;
        this.costo_total = costo_total;
        this.created = created;
        this.updated = updated;
        this.fecha_vencimiento = fecha_vencimiento;
        this.lote = lote;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getAlmacen() {
        return almacen;
    }

    public void setAlmacen(int almacen) {
        this.almacen = almacen;
    }

    public int getProducto() {
        return producto;
    }

    public void setProducto(int producto) {
        this.producto = producto;
    }

    public double getCantidad() {
        return cantidad;
    }

    public void setCantidad(double cantidad) {
        this.cantidad = cantidad;
    }

    public double getCosto_unitario() {
        return costo_unitario;
    }

    public void setCosto_unitario(double costo_unitario) {
        this.costo_unitario = costo_unitario;
    }

    public double getCosto_total() {
        return costo_total;
    }

    public void setCosto_total(double costo_total) {
        this.costo_total = costo_total;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getUpdated() {
        return updated;
    }

    public void setUpdated(String updated) {
        this.updated = updated;
    }

    public String getFecha_vencimiento() {
        return fecha_vencimiento;
    }

    public void setFecha_vencimiento(String fecha_vencimiento) {
        this.fecha_vencimiento = fecha_vencimiento;
    }

    public String getLote() {
        return lote;
    }

    public void setLote(String lote) {
        this.lote = lote;
    }
    
    
    
}
