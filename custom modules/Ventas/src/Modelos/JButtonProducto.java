/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Modelos;

import java.util.ArrayList;
import javax.swing.Icon;
import javax.swing.JButton;

/**
 *
 * @author AGIL
 */
public class JButtonProducto extends JButton {
    private int id;      
    private String nombre;
    private String codigo;
    private String unidad_medida;
    private double precio_unitario;
    private String descripcion;
    private String codigo_fabrica;
    private double descuento;
    private int pos;
    
    private int idProBase;
    private String nombreProBase;
    private double formulacion;
    private String codigoProBase;
    private String unidad_medida_proBase;
    private double precio_unitario_proBase;
    private String codigo_fabrica_proBase;
    private int cantidad;
    private ArrayList<JButtonProducto> lista ;

    public JButtonProducto(int id, String nombre, String codigo, String unidad_medida, double precio_unitario, String descripcion, String codigo_fabrica,int cantidad, ArrayList<JButtonProducto> lista, double descuento, int pos, Icon icon) {
        super(nombre,icon);
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.unidad_medida = unidad_medida;
        this.precio_unitario = precio_unitario;
        this.descripcion = descripcion;
        this.codigo_fabrica = codigo_fabrica;
        this.cantidad = cantidad;
        this.lista = lista;
        this.descuento = descuento;
        this.pos = pos;
    }

    public JButtonProducto(int idProBase, String nombreProBase, double formulacion, String codigoProBase, String unidad_medida_proBase, double precio_unitario_proBase, String codigo_fabrica_proBase) {
        this.idProBase = idProBase;
        this.nombreProBase = nombreProBase;
        this.formulacion = formulacion;
        this.codigoProBase = codigoProBase;
        this.unidad_medida_proBase = unidad_medida_proBase;
        this.precio_unitario_proBase = precio_unitario_proBase;
        this.codigo_fabrica_proBase = codigo_fabrica_proBase;
    }

    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getUnidad_medida() {
        return unidad_medida;
    }

    public void setUnidad_medida(String unidad_medida) {
        this.unidad_medida = unidad_medida;
    }

    public double getPrecio_unitario() {
        return precio_unitario;
    }

    public void setPrecio_unitario(double precio_unitario) {
        this.precio_unitario = precio_unitario;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCodigo_fabrica() {
        return codigo_fabrica;
    }

    public void setCodigo_fabrica(String codigo_fabrica) {
        this.codigo_fabrica = codigo_fabrica;
    }

    public int getIdProBase() {
        return idProBase;
    }

    public void setIdProBase(int idProBase) {
        this.idProBase = idProBase;
    }

    public String getNombreProBase() {
        return nombreProBase;
    }

    public void setNombreProBase(String nombreProBase) {
        this.nombreProBase = nombreProBase;
    }

    public double getFormulacion() {
        return formulacion;
    }

    public void setFormulacion(double formulacion) {
        this.formulacion = formulacion;
    }

    public String getCodigoProBase() {
        return codigoProBase;
    }

    public void setCodigoProBase(String codigoProBase) {
        this.codigoProBase = codigoProBase;
    }

    public String getUnidad_medida_proBase() {
        return unidad_medida_proBase;
    }

    public void setUnidad_medida_proBase(String unidad_medida_proBase) {
        this.unidad_medida_proBase = unidad_medida_proBase;
    }

    public double getPrecio_unitario_proBase() {
        return precio_unitario_proBase;
    }

    public void setPrecio_unitario_proBase(double precio_unitario_proBase) {
        this.precio_unitario_proBase = precio_unitario_proBase;
    }

    public String getCodigo_fabrica_proBase() {
        return codigo_fabrica_proBase;
    }

    public void setCodigo_fabrica_proBase(String codigo_fabrica_proBase) {
        this.codigo_fabrica_proBase = codigo_fabrica_proBase;
    }

    public ArrayList<JButtonProducto> getLista() {
        return lista;
    }

    public void setLista(ArrayList<JButtonProducto> lista) {
        this.lista = lista;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public int getPost() {
        return pos;
    }

    public void setPost(int post) {
        this.pos = post;
    }

    public double getDescuento() {
        return descuento;
    }

    public void setDescuento(double descuento) {
        this.descuento = descuento;
    }

    public int getPos() {
        return pos;
    }

    public void setPos(int pos) {
        this.pos = pos;
    }

    
}
