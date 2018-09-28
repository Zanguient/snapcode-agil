/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo_Dosificacion;

import java.sql.ResultSet;
import javax.swing.JComboBox;
import models.Database;

/**
 *
 * @author AGIL
 */
public class Dosificacion{
    public Database db = new Database();
    private int id;
    private String nombre;

    public Dosificacion(int id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public Dosificacion(){
        
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
    
    public void mostrarFrases(JComboBox<Dosificacion>comboFrace){
        db.Conectar();
        ResultSet rs = null;
        String consulta = "SELECT C.ID, C.NOMBRE\n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON T.ID = C.ID_TIPO\n" +
            "WHERE T.ID = "+13;
        try {
            
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
               comboFrace.addItem(new Dosificacion(rs.getInt(1), rs.getString(2)));
            }
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
    }

    @Override
    public String toString() {
        return nombre;
    }
}
