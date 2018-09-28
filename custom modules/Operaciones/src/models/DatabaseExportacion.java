/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import com.agil.nuevo.Almacen;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author AGIL
 */
public class DatabaseExportacion {
    public Connection con = null;
    
    public Connection Conectar(){
        try {
           //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\dbOperacionesExportar");   
           con = DriverManager.getConnection("jdbc:derby:.\\dbOperacionesExportar");   
        } catch (Exception e) {
            System.out.println("EXISTE UN ERROR EN LA CONECCION DE EXPORTACION "+ e);
        }
        return con;
    }
    
    public void ingresarSolicitudReposicionExp(int id,int id_almacen, java.sql.Timestamp fecha, int id_usuario, boolean activo, boolean eliminado, Date fechaAct, double monto, String nombre_sucursal){
        Conectar();
        ResultSet rs = null;
        boolean valor = false;
        try
        {
            this.con.setAutoCommit(false);
            Statement stmt = this.con.createStatement();

            PreparedStatement pstmt = this.con.prepareStatement("insert into solicitud_reposicion(id,almacen,usuario,activo,eliminado,createdat,updatedat,monto,nombre_sucursal,fecha) values(?,?,?,?,?,?,?,?,?,?)");
            pstmt.setInt(1, id);
            pstmt.setInt(2, id_almacen);
            pstmt.setInt(3, id_usuario);
            pstmt.setBoolean(4, activo);
            pstmt.setBoolean(5, eliminado);
            pstmt.setDate(6, fechaAct);
            pstmt.setDate(7, fechaAct);
            pstmt.setDouble(8, monto);
            pstmt.setString(9, nombre_sucursal);
            pstmt.setTimestamp(10, fecha);
            pstmt.executeUpdate();

            this.con.commit();

            valor = true;
        }catch (Exception e){
              System.out.println("Error al insertar solicitud en la segunda DB: "+ e);
        }
    }
    
     public void ingresarSolicitudReposicionCierre(int id,int id_almacen, java.sql.Timestamp fecha, int id_usuario, boolean activo, boolean eliminado, Date fechaAct, double monto, String nombre_sucursal){
        Conectar();
        ResultSet rs = null;
        boolean valor = false;
        try
        {
            this.con.setAutoCommit(false);
            Statement stmt = this.con.createStatement();
            
            rs = stmt.executeQuery("SELECT * FROM SOLICITUD_REPOSICION_CIERRE WHERE ID = " + id );
            if (rs.next())
            {
                String sql = "UPDATE solicitud_reposicion_cierre SET id=?, almacen=?, usuario=?, activo=?,monto=?,nombre_sucursal=?,fecha=? WHERE id=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setInt(2, id_almacen);
                statement.setInt(3, id_usuario);
                statement.setBoolean(4, activo);
                statement.setDouble(5, monto);
                statement.setString(6, nombre_sucursal);
                statement.setTimestamp(7, fecha);
           
            }else{
                PreparedStatement pstmt = this.con.prepareStatement("insert into solicitud_reposicion_cierre(id,almacen,usuario,activo,eliminado,createdat,updatedat,monto,nombre_sucursal,fecha) values(?,?,?,?,?,?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setInt(2, id_almacen);
                pstmt.setInt(3, id_usuario);
                pstmt.setBoolean(4, activo);
                pstmt.setBoolean(5, eliminado);
                pstmt.setDate(6, fechaAct);
                pstmt.setDate(7, fechaAct);
                pstmt.setDouble(8, monto);
                pstmt.setString(9, nombre_sucursal);
                pstmt.setTimestamp(10, fecha);
                pstmt.executeUpdate();

                this.con.commit();

                valor = true;
            }
        }catch (Exception e){
              System.out.println("Error al insertar solicitud en la segunda DB cierre: "+ e);
        }
    }
    
    public void insertarSolicitudProducto(int id, int solicitud, int id_pro, double cantidad, java.sql.Date fechaCreada, java.sql.Date fechaActualizada){
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;
        try{
            this.con.setAutoCommit(false);
            Statement orden = this.con.createStatement();
            stmt = this.con.createStatement();

            pstmt = this.con.prepareStatement("INSERT INTO DETALLE_SOLICITUD_PRODUCTO (ID, SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT) VALUES(?,?,?,?,?,?)");
            pstmt.setInt(1, id);
            pstmt.setInt(2, solicitud);
            pstmt.setInt(3, id_pro);
            pstmt.setDouble(4, cantidad);
            pstmt.setDate(5, fechaCreada);
            pstmt.setDate(6, fechaActualizada);

            pstmt.executeUpdate();

            this.con.commit();
        }catch (SQLException ex){
          System.out.println("Error insertar el id detalle producto: " + ex);
        }
    }
    
    public void insertarSolicitudProductoCierre(int id, int solicitud, int id_pro, double cantidad, java.sql.Date fechaCreada, java.sql.Date fechaActualizada){
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;
        try{
            this.con.setAutoCommit(false);
            Statement orden = this.con.createStatement();
            stmt = this.con.createStatement();

            pstmt = this.con.prepareStatement("INSERT INTO DETALLE_SOLICITUD_PRODUCTO_CIERRE (ID, SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT) VALUES(?,?,?,?,?,?)");
            pstmt.setInt(1, id);
            pstmt.setInt(2, solicitud);
            pstmt.setInt(3, id_pro);
            pstmt.setDouble(4, cantidad);
            pstmt.setDate(5, fechaCreada);
            pstmt.setDate(6, fechaActualizada);

            pstmt.executeUpdate();

            this.con.commit();
        }catch (SQLException ex){
          System.out.println("Error insertar el id detalle producto: " + ex);
        }
    }
    
    public void insertarDetalleSolicitudProductoBase(int id,int deta_solici_prod, int prod_base, double canti_ideal, double canti_real, Date fechaActual, Date fechaActualizada, double total){
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;
        try{
            this.con.setAutoCommit(false);
            Statement orden = this.con.createStatement();
            stmt = this.con.createStatement();

            pstmt = this.con.prepareStatement("INSERT INTO DETALLE_SOLICITUD_PRODUCTO_BASE (ID,DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,CREATEDAT,UPDATEDAT,TOTAL) VALUES(?,?,?,?,?,?,?,?)");
            pstmt.setInt(1, id);
            pstmt.setInt(2, deta_solici_prod);
            pstmt.setInt(3, prod_base);
            pstmt.setDouble(4, canti_ideal);
            pstmt.setDouble(5, canti_real);
            pstmt.setDate(6, fechaActual);
            pstmt.setDate(7, fechaActualizada);
            pstmt.setDouble(8, total);

            pstmt.executeUpdate();

            this.con.commit();
        }catch (SQLException ex){
          System.out.println("Error insertar el detalle producto base: " + ex);
        }
    }
    
    public void insertarDetalleSolicitudProductoBaseCierre(int id,int deta_solici_prod, int prod_base, double canti_ideal, double canti_real, Date fechaActual, Date fechaActualizada, double total){
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;
        try{
            this.con.setAutoCommit(false);
            Statement orden = this.con.createStatement();
            stmt = this.con.createStatement();

            pstmt = this.con.prepareStatement("INSERT INTO DETALLE_SOLICITUD_PRODUCTO_BASE_CIERRE (ID,DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,REATEDAT,UPDATEDAT,TOTAL) VALUES(?,?,?,?,?,?,?,?)");
            pstmt.setInt(1, id);
            pstmt.setInt(2, deta_solici_prod);
            pstmt.setInt(3, prod_base);
            pstmt.setDouble(4, canti_ideal);
            pstmt.setDouble(5, canti_real);
            pstmt.setDate(6, fechaActual);
            pstmt.setDate(7, fechaActualizada);
            pstmt.setDouble(8, total);

            pstmt.executeUpdate();

            this.con.commit();
        }catch (SQLException ex){
          System.out.println("Error insertar el detalle producto base: " + ex);
        }
    }
    
    public int seleccionarSolicitudReposicionId(){
        Conectar();
        int id_solicitud_repo = 0;
        try{
            this.con.setAutoCommit(false);
            Statement stmt = this.con.createStatement();

            String seleccionar = "SELECT Max(ID) FROM SOLICITUD_REPOSICION";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_solicitud_repo = rs.getInt(1);
            }
            this.con.commit();
        }catch (Exception e){
            System.out.println("Error al seleccionar el id del solicitud: " + e);
        }
        return id_solicitud_repo;
    }
    
    public int seleccionarDetalleSoliciProducto(){
        Conectar();
        int id_solicitud_repo = 0;
        try{

            this.con.setAutoCommit(false);
            Statement stmt = this.con.createStatement();

            String seleccionar = "SELECT Max(ID) FROM DETALLE_SOLICITUD_PRODUCTO";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
              id_solicitud_repo = rs.getInt(1);
            }
            this.con.commit();
        }catch (Exception e){
          System.out.println("Error al seleccionar el id del detalle de la solicitud del producto: " + e);
        }
        return id_solicitud_repo;
    }
    
    public int seleccionarUltimoIdDetalleSolicitudProductoBase(){
        Conectar();
        int id_solicitud_repo = 0;
        try{

            this.con.setAutoCommit(false);
            Statement stmt = this.con.createStatement();

            String seleccionar = "SELECT Max(ID) FROM DETALLE_SOLICITUD_PRODUCTO_BASE";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
              id_solicitud_repo = rs.getInt(1);
            }
            this.con.commit();
        }catch (Exception e){
          System.out.println("Error al seleccionar el id del detalle de la solicitud del producto base: " + e);
        }
        return id_solicitud_repo;
    }
    
    public ResultSet seleccionar(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            rs = stmt.executeQuery(consulta);
           
            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return rs;
    }
    
    public void eliminarProductos(String consulta){
        Conectar();
        ResultSet rs = null;
        try{
          this.con.setAutoCommit(false);
          Statement stmt = this.con.createStatement();
          stmt.execute(consulta);

          this.con.commit();
          stmt.close();
        }catch (Exception e){
          System.out.println(e.getMessage());
        }finally{
            try {
                Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(DatabaseExportacion.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    public void UpdateTablaSolicitudes(int id){
        Conectar();
        ResultSet rs = null;
        boolean activo = false;
        try{
            //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");

            Statement stmt = this.con.createStatement();

            String sql = "UPDATE SOLICITUD_REPOSICION SET ACTIVO = ? WHERE ID = ?";
            PreparedStatement statement = this.con.prepareStatement(sql);
            statement.setBoolean(1, false);
            statement.setInt(2, id);

            statement.executeUpdate();

            this.con.close();
        }catch (Exception e){
          System.out.println(e.getMessage());
        }
    }
    public ResultSet insertarProductos(String consulta){
        Conectar();
        ResultSet rs = null;
        try{
            this.con.setAutoCommit(false);
            Statement stmt = this.con.createStatement();

            PreparedStatement pstmt = this.con.prepareStatement(consulta);

            pstmt.executeUpdate();
            this.con.commit();
        }
        catch (Exception e){
            System.out.println(e.getMessage());
        }
            return rs;
    }
    
    public void insertarProductosConDatos(int solicitud, int producto, double cantidad, java.sql.Date createdat, java.sql.Date updatedat){
        Conectar();
        ResultSet rs = null;
        try{
            // this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
            this.con.setAutoCommit(false);
            Statement orden = this.con.createStatement();
            Statement stmt = this.con.createStatement();
            
            PreparedStatement pstmt = this.con.prepareStatement("INSERT INTO DETALLE_SOLICITUD_PRODUCTO (SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT) VALUES(?,?,?,?,?)");
            pstmt.setInt(1, solicitud);
            pstmt.setInt(2, producto);
            pstmt.setDouble(3, cantidad);
            pstmt.setDate(4, createdat);
            pstmt.setDate(5, updatedat);

            pstmt.executeUpdate();

            this.con.commit();
        }catch (SQLException ex){
            System.out.println("Error insertar el id detalle producto: " + ex);
        }
    }
    
}
