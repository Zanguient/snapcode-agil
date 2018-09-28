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
public class ProductosBaseExport {
    private int id;
    private int id_productoBase;
    private int idProductoBase;
    private boolean activarInventario;
    private int tipoProducto;
    private String nombre;

    public ProductosBaseExport(int id, int id_productoBase, int idProductoBase, boolean activarInventario, int tipoProducto, String nombre) {
        this.id = id;
        this.id_productoBase = id_productoBase;
        this.idProductoBase = idProductoBase;
        this.activarInventario = activarInventario;
        this.tipoProducto = tipoProducto;
        this.nombre = nombre;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId_productoBase() {
        return id_productoBase;
    }

    public void setId_productoBase(int id_productoBase) {
        this.id_productoBase = id_productoBase;
    }

    public int getIdProductoBase() {
        return idProductoBase;
    }

    public void setIdProductoBase(int idProductoBase) {
        this.idProductoBase = idProductoBase;
    }

    public boolean isActivarInventario() {
        return activarInventario;
    }

    public void setActivarInventario(boolean activarInventario) {
        this.activarInventario = activarInventario;
    }

    public int getTipoProducto() {
        return tipoProducto;
    }

    public void setTipoProducto(int tipoProducto) {
        this.tipoProducto = tipoProducto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    
}
