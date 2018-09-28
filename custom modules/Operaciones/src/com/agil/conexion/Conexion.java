/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.agil.conexion;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 *
 * @author AGIL
 */
public class Conexion {
    
    
    public Connection cargarDB(){
        Connection con;
        String barra = File.separator;
        String proyecto = System.getProperty("user.dir")+barra+"registros";
        
        try {
           Class.forName("org.apache.derby.jdbc.EmbeddedDriver");
           String db = "jdbc:derby:"+proyecto;
           con = DriverManager.getConnection(db);
           System.out.println("Se cargaron los datos");
           return con;
        } catch (ClassNotFoundException | SQLException e) {
            System.out.println("Error: "+e);
        }
        return null;
    }
}
