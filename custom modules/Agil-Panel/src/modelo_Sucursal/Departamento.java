/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo_Sucursal;

import java.sql.ResultSet;
import javax.swing.JComboBox;
import modelo_Dosificacion.Dosificacion;
import models.Database;

/**
 *
 * @author AGIL
 */
public class Departamento {
    public Database db = new Database();
    public int id;
    public String nombre;
    private String nomb_corto;

    public Departamento(int id, String nombre,String nombre_corto) {
        this.id = id;
        this.nombre = nombre;
        this.nomb_corto = nombre_corto;
    }
    
    public Departamento(){
        
    }
    
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getNomb_corto() {
        return nomb_corto;
    }

    public void setNomb_corto(String nomb_corto) {
        this.nomb_corto = nomb_corto;
    }
    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    
    public void agregarDepartamentos(JComboBox<Departamento> depart){
        db.Conectar();
        ResultSet rs = null;
        boolean habilitado = true;
        String consulta = "SELECT ID, NOMBRE, NOMBRE_CORTO \n" +
            "FROM CLASE \n" +
            "WHERE ID_TIPO = "+1+" AND HABILITADO = "+habilitado;
        try {          
            rs = db.seleccionar(consulta);
            while (rs.next()) {                    
              depart.addItem(new Departamento(rs.getInt(1), rs.getString(2), rs.getString(3)));
            }
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
    }
    
    public void agregarMunicipio(String nombCorto, JComboBox<Departamento> municipio){
        db.Conectar();
        ResultSet rs = null;
        boolean habilitado = true;
        String consulta = "SELECT ID,NOMBRE,NOMBRE_CORTO "
                + "FROM CLASE "
                + "WHERE NOMBRE_CORTO = '"+nombCorto+"' AND HABILITADO = "+habilitado;
;
        try {          
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
              municipio.addItem(new Departamento(rs.getInt(1), rs.getString(2),rs.getString(3)));
            }
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
    }
    
    @Override
    public String toString() {
        return  nombre;
    }
}
