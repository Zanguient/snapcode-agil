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
public class ProductoBaseExport {
    private int id_PB;
    private int id_producto;
    private int id_productobase;
    private int idProducto;
    private int idProductoBase;
    private String formulacion;
    private String createdat;
    private String updatedat;

    public ProductoBaseExport(int id_PB,int id_producto, int id_productobase, int idProducto, int idProductoBase, String formulacion, String createdat, String updatedat) {
        this.id_PB = id_PB;
        this.id_producto = id_producto;
        this.id_productobase = id_productobase;
        this.idProducto = idProducto;
        this.idProductoBase = idProductoBase;
        this.formulacion = formulacion;
        this.createdat = createdat;
        this.updatedat = updatedat;
    }

    
    public int getId_producto() {
        return id_producto;
    }

    public void setId_producto(int id_producto) {
        this.id_producto = id_producto;
    }

    public int getId_productobase() {
        return id_productobase;
    }

    public void setId_productobase(int id_productobase) {
        this.id_productobase = id_productobase;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public int getIdProductoBase() {
        return idProductoBase;
    }

    public void setIdProductoBase(int idProductoBase) {
        this.idProductoBase = idProductoBase;
    }

    public String getFormulacion() {
        return formulacion;
    }

    public void setFormulacion(String formulacion) {
        this.formulacion = formulacion;
    }

    public String getCreatedat() {
        return createdat;
    }

    public void setCreatedat(String createdat) {
        this.createdat = createdat;
    }

    public String getUpdatedat() {
        return updatedat;
    }

    public void setUpdatedat(String updatedat) {
        this.updatedat = updatedat;
    }

    public int getId_PB() {
        return id_PB;
    }

    public void setId_PB(int id_PB) {
        this.id_PB = id_PB;
    }
    
    
}
