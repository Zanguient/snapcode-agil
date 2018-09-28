/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

/**
 *
 * @author AGIL
 */
public class ProductosBase {
  // private int id_pro;
   private int id_detalle;
   private int id_p;
   private int id_pb;
   private String nombre_pb;
   private String unid_med_pb; 
   private double cantU_ideal_pb; 
   private double cantU_modif_pb;
   private double total_ideal_pb;
   private double total_real_pb;
   private double precio_unitario;
   private int id_almacen;
   private String nombre_sucursal;

    public ProductosBase(int id_detalle,int id_p, String nombre_pb, String unid_med_pb, double cantU_ideal_pb, double cantU_modif_pb, double total_ideal_pb, double total_real_pb,double precio_unitario,int id_almacen,String nombre_sucursal) {
        this.id_detalle = id_detalle;
        this.id_p = id_p;
        this.nombre_pb = nombre_pb;
        this.unid_med_pb = unid_med_pb;
        this.cantU_ideal_pb = cantU_ideal_pb;
        this.cantU_modif_pb = cantU_modif_pb;
        this.total_ideal_pb = total_ideal_pb;
        this.total_real_pb = total_real_pb;
        this.precio_unitario = precio_unitario;
        this.id_almacen = id_almacen;
        this.nombre_sucursal = nombre_sucursal;
    }
    
    public int getId_pb() {
        return id_p;
    }

    public void setId_pb(int id_p) {
        this.id_p = id_p;
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

    public double getCantU_ideal_pb() {
        return cantU_ideal_pb;
    }

    public void setCantU_ideal_pb(double cantU_ideal_pb) {
        this.cantU_ideal_pb = cantU_ideal_pb;
    }

    public double getCantU_modif_pb() {
        return cantU_modif_pb;
    }

    public void setCantU_modif_pb(double cantU_modif_pb) {
        this.cantU_modif_pb = cantU_modif_pb;
    }

    public double getTotal_ideal_pb() {
        return total_ideal_pb;
    }

    public void setTotal_ideal_pb(double total_ideal_pb) {
        this.total_ideal_pb = total_ideal_pb;
    }

    public double getTotal_real_pb() {
        return total_real_pb;
    }

    public void setTotal_real_pb(double total_real_pb) {
        this.total_real_pb = total_real_pb;
    }

    public double getPrecio_unitario() {
        return precio_unitario;
    }

    public void setPrecio_unitario(double precio_unitario) {
        this.precio_unitario = precio_unitario;
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

    /*public int getId_pro() {
        return id_pro;
    }

    public void setId_pro(int id_pro) {
        this.id_pro = id_pro;
    }*/

    public int getId_detalle() {
        return id_detalle;
    }

    public void setId_detalle(int id_detalle) {
        this.id_detalle = id_detalle;
    }
  
}
