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
public class ProductosBase {
    private int id;
    private int id_producto;
    private int id_producto_base;
    private String formulacion;
    private String createdAt;
    private String updatedAt;
    
    private int idPb;
    private String nombre;
    private boolean activar_inventario;
    private int tipo_producto;
    
    public ProductosBase(int id, int id_producto, int id_producto_base, String formulacion, String createdAt, String updatedAt) {
        this.id = id;
        this.id_producto = id_producto;
        this.id_producto_base = id_producto_base;
        this.formulacion = formulacion;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public ProductosBase(int idPb,String nombre, boolean activar_inventario,int tipo_producto) {
        this.idPb = idPb;
        this.nombre = nombre;
        this.activar_inventario = activar_inventario;
        this.tipo_producto = tipo_producto;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId_producto() {
        return id_producto;
    }

    public void setId_producto(int id_producto) {
        this.id_producto = id_producto;
    }

    public int getId_producto_base() {
        return id_producto_base;
    }

    public void setId_producto_base(int id_producto_base) {
        this.id_producto_base = id_producto_base;
    }

    public String getFormulacion() {
        return formulacion;
    }

    public void setFormulacion(String formulacion) {
        this.formulacion = formulacion;
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

    public int getIdPb() {
        return idPb;
    }

    public void setIdPb(int idPb) {
        this.idPb = idPb;
    }

    public boolean isActivar_inventario() {
        return activar_inventario;
    }

    public void setActivar_inventario(boolean activar_inventario) {
        this.activar_inventario = activar_inventario;
    }

    public int getTipo_producto() {
        return tipo_producto;
    }

    public void setTipo_producto(int tipo_producto) {
        this.tipo_producto = tipo_producto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    
            
            
       
}
