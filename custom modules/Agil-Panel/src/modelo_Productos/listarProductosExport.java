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
public class listarProductosExport {
    private String codigo;
    private String nombre;
    private String unidadMedida;
    private double precioUnit;
    private int inventMinimo;
    private String descripcion;
    private int grupo;
    private int subGrupo;
    private String caracte1;
    private String caracte2;
    private String codigoFabrica;
    private double comicion;
    private int alerta;
    private double descuento;
    private double descuentoFijo;

    public listarProductosExport(String codigo, String nombre, String unidadMedida, double precioUnit, int inventMinimo, String descripcion, int grupo, int subGrupo, String caracte1, String caracte2, String codigoFabrica, double comicion, int alerta, double descuento, double descuentoFijo) {

        this.codigo = codigo;
        this.nombre = nombre;
        this.unidadMedida = unidadMedida;
        this.precioUnit = precioUnit;
        this.inventMinimo = inventMinimo;
        this.descripcion = descripcion;
        this.grupo = grupo;
        this.subGrupo = subGrupo;
        this.caracte1 = caracte1;
        this.caracte2 = caracte2;
        this.codigoFabrica = codigoFabrica;
        this.comicion = comicion;
        this.alerta = alerta;
        this.descuento = descuento;
        this.descuentoFijo = descuentoFijo;
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

    public String getCaracte1() {
        return caracte1;
    }

    public void setCaracte1(String caracte1) {
        this.caracte1 = caracte1;
    }

    public String getCaracte2() {
        return caracte2;
    }

    public void setCaracte2(String caracte2) {
        this.caracte2 = caracte2;
    }

    public String getCodigoFabrica() {
        return codigoFabrica;
    }

    public void setCodigoFabrica(String codigoFabrica) {
        this.codigoFabrica = codigoFabrica;
    }

    public double getComicion() {
        return comicion;
    }

    public void setComicion(double comicion) {
        this.comicion = comicion;
    }

    public int getAlerta() {
        return alerta;
    }

    public void setAlerta(int alerta) {
        this.alerta = alerta;
    }

    public double getDescuento() {
        return descuento;
    }

    public void setDescuento(double descuento) {
        this.descuento = descuento;
    }

    public double getDescuentoFijo() {
        return descuentoFijo;
    }

    public void setDescuentoFijo(double descuentoFijo) {
        this.descuentoFijo = descuentoFijo;
    }

}
