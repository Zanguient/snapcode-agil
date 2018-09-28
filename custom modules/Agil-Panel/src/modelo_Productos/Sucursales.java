/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo_Productos;

import java.sql.ResultSet;
import javax.swing.JComboBox;
import models.Database;

/**
 *
 * @author AGIL
 */
public class Sucursales {
    public Database db = new Database();
    public int id;
    public String nombre;

    public Sucursales(int id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public Sucursales(){
        
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
    
     public void agregarSucursal(JComboBox<Sucursales>sucursal, int id){
        db.Conectar();
        ResultSet rs = null;
        try {
            rs = db.seleccionar("SELECT S.ID,S.NOMBRE \n" 
                    + "FROM USUARIO AS U \n"
                    + "INNER JOIN SUCURSAL AS S ON S.EMPRESA = U.EMPRESA \n"
                    + "WHERE U.ID = "+id);
            while(rs.next()){
                sucursal.addItem(new Sucursales(rs.getInt(1), rs.getString(2)));
            }
        } catch (Exception e) {
            System.out.println("Error en listar sucursal "+e);
        }
    }
     
     public void establecer(JComboBox<Sucursales>sucursal, String nombre){
         sucursal.setSelectedItem(nombre);
     }

    @Override
    public String toString() {
        return nombre;
    }

}
