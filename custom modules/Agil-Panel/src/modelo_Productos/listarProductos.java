/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo_Productos;

import javax.swing.Icon;
import javax.swing.ImageIcon;

/**
 *
 * @author AGIL
 */
public class listarProductos {
    private int id ;
    private boolean publi_panel ;
    private boolean activar_inventario;
    private String codigo;
    private String nombre;
    private String unidadMedida;
    private double precioUnit;
    private int inventMinimo;
    private String descripcion;
    private int grupo;
    private int subGrupo;
    private String imagen;

    public listarProductos(int id, boolean publi_panel, boolean activar_inventario, String codigo, String nombre, String unidadMedida, double precioUnit, int inventMinimo, String descripcion, int grupo, int subGrupo, String imagen) {
        this.id = id;
        this.publi_panel = publi_panel;
        this.activar_inventario = activar_inventario;
        this.codigo = codigo;
        this.nombre = nombre;
        this.unidadMedida = unidadMedida;
        this.precioUnit = precioUnit;
        this.inventMinimo = inventMinimo;
        this.descripcion = descripcion;
        this.grupo = grupo;
        this.subGrupo = subGrupo;
        this.imagen = imagen;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isPubli_panel() {
        return publi_panel;
    }

    public void setPubli_panel(boolean publi_panel) {
        this.publi_panel = publi_panel;
    }

    public boolean isActivar_inventario() {
        return activar_inventario;
    }

    public void setActivar_inventario(boolean activar_inventario) {
        this.activar_inventario = activar_inventario;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getUnidadMedida() {
        return unidadMedida;
    }

    public void setUnidadMedida(String unidadMedida) {
        this.unidadMedida = unidadMedida;
    }

    public double getPrecioUnit() {
        return precioUnit;
    }

    public void setPrecioUnit(double precioUnit) {
        this.precioUnit = precioUnit;
    }

    public int getInventMinimo() {
        return inventMinimo;
    }

    public void setInventMinimo(int inventMinimo) {
        this.inventMinimo = inventMinimo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public int getGrupo() {
        return grupo;
    }

    public void setGrupo(int grupo) {
        this.grupo = grupo;
    }

    public int getSubGrupo() {
        return subGrupo;
    }

    public void setSubGrupo(int subGrupo) {
        this.subGrupo = subGrupo;
    }
    
    
}
