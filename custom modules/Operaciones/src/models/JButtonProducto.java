  /*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import java.awt.event.ActionListener;
import java.util.ArrayList;
import javax.swing.*;

/**
 *
 * @author AGIL
 */
public class JButtonProducto extends JButton {
    //Producto Final
    private int id;      
    private String nombre;
    private String unid_medida;
    private double precio_unitario;
    private int pos;
    
    private int id_pro_base;
    private String nombre_pb;
    private String unid_med_pb; 
    private int precio_unit_pb;
    private String cantU_ideal_pb; 
    private int id_almacen;
    private String nombre_sucursal;  

    private ArrayList<JButtonProducto> lista ;
    private int cantidad;

    public JButtonProducto(int id, String nombre, String unid_medida,double precio_unitario, ArrayList<JButtonProducto> lista, String nombreProducto,int cantidad, int pos, Icon icon) {
        super(nombreProducto, icon);
        this.id = id;
        this.nombre = nombre;
        this.unid_medida = unid_medida;
        this.precio_unitario = precio_unitario;
        this.lista = lista;
        this.cantidad = cantidad;
        this.pos = pos;
    }
    
    public JButtonProducto(int id_producto, String nombre_pb, String unid_med_pb, int precio_unit_pb, String cantU_ideal_pb,int id_almacen,String nombre_sucursal) {
        this.id = id_producto;
        this.nombre_pb = nombre_pb;
        this.unid_med_pb = unid_med_pb;
        this.precio_unit_pb = precio_unit_pb;
        this.cantU_ideal_pb = cantU_ideal_pb;
        this.id_almacen = id_almacen;
        this.nombre_sucursal = nombre_sucursal;
    }
    
    
    public int getId_Pro_Base() {
        return id_pro_base;
    }

    public void setId_Prod_Base(int id_Pro_Base) {
        this.id_pro_base = id_Pro_Base;
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
    
    public ArrayList<JButtonProducto> getLista() {
        return lista;
    }

    public void setLista(ArrayList<JButtonProducto> lista) {
        this.lista = lista;
    }

    public String getNombre_pb() {
        return nombre_pb;
    }

    public void setNombre_pb(String nombre_pb) {
        this.nombre_pb = nombre_pb;
    }

    public String getUnid_med_pb() {
        return unid_med_pb;
    }

    public void setUnid_med_pb(String unid_med_pb) {
        this.unid_med_pb = unid_med_pb;
    }

    public int getPrecio_unit_pb() {
        return precio_unit_pb;
    }

    public void setPrecio_unit_pb(int precio_unit_pb) {
        this.precio_unit_pb = precio_unit_pb;
    }

    public String getCantU_ideal_pb() {
        return cantU_ideal_pb;
    }

    public void setCantU_ideal_pb(String cantU_ideal_pb) {
        this.cantU_ideal_pb = cantU_ideal_pb;
    }

    public String getUnid_medida() {
        return unid_medida;
    }

    public void setUnid_medida(String unid_medida) {
        this.unid_medida = unid_medida;
    }

    public double getPrecio_unitario() {
        return precio_unitario;
    }

    public void setPrecio_unitario(double precio_unitario) {
        this.precio_unitario = precio_unitario;
    }

    public boolean startsWith(String letras) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public int getId_almacen() {
        return id_almacen;
    }

    public void setId_almacen(int id_almacen) {
        this.id_almacen = id_almacen;
    }

    public String getNombre_sucursal() {
        return nombre_sucursal;
    }

    public void setNombre_sucursal(String nombre_sucursal) {
        this.nombre_sucursal = nombre_sucursal;
    }

    public int getId_pro_base() {
        return id_pro_base;
    }

    public void setId_pro_base(int id_pro_base) {
        this.id_pro_base = id_pro_base;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public int getPos() {
        return pos;
    }

    public void setPos(int pos) {
        this.pos = pos;
    }
}
