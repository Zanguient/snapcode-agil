/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.swing.JOptionPane;
import java.sql.PreparedStatement;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.ArrayList;

import com.agil.nuevo.*;
import java.math.BigDecimal;
import java.sql.Savepoint;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import modelo_Admin.ListaEmpresasAdmin;
import modelo_Productos.listaSucursal;
import modelo_Sucursal.listaDatosCorrelativos;

/**
 *
 * @author win
 */
public class Database {

    public Connection con = null;
    Connection con2;

    /**
    public void cerrarCon(){
        
     *
     */
    

    public Connection Conectar(){
        try {
            con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");   
            //con = DriverManager.getConnection("jdbc:derby:.\\agil");   

        } catch (Exception e) {
            System.out.println("error en la conexion "+ e);
        }
        return con;
    }
    
    public void PurebaConectar() {
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            /*String createSQL = "create table sucursal ("
            + "id integer not null,   "
            + "nombre varchar(30) not null,"
            + "constraint primary_key primary key (id))";
             */
            con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //stmt.execute(createSQL);

            /*pstmt = con.prepareStatement("insert into sucursal(id,nombre) values(?,?)");
            pstmt.setString(1,"1");
            pstmt.setString(2, "hagar@somewhere.com");
            pstmt.executeUpdate();*/
             
            rs = stmt.executeQuery("select * from sucursal");
            while (rs.next()) {
                System.out.printf(rs.getInt(1) + rs.getString(2));
               // JOptionPane.showMessageDialog(null, +rs.getInt(1) + "-" + rs.getString(2));
            }

            //stmt.execute("drop table person");
            con.commit();

            /*Class.forName("org.apache.derby.jdbc.EmbeddedDriver");
                con = DriverManager.getConnection("jdbc:derby://localhost:1527/agil", "agil", "agil");
                 System.out.println("Connection successfully");
                 System.out.println("Query:"); 

                Statement stmt = con.createStatement();
                ResultSet rs = stmt.executeQuery("select * from SUCURSAL");

                while (rs.next()) {
                  System.out.println( 
                    rs.getString("ID") + " : " + rs.getString("nombre"));
                  JOptionPane.showMessageDialog(null,rs.getString("ID") + " : " + rs.getString("nombre"));
                }
             */
        } catch (Exception e) {
            System.out.println(e.getMessage());

        }
    }

    public void login(int id, int idEmp) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            Statement orden = con.createStatement();

            rs = stmt.executeQuery("select * from login where id = " + id);

            if (rs.next()) {
                String sql = "UPDATE login SET ID = ?, IDEMPRESA = ? WHERE ID=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setInt(2, idEmp);
                statement.setInt(3, id);
                statement.executeUpdate();
                //System.out.println("SE ACTUALIZO LA TABLA SUCURSAL");
            } else {
                String insertar = "insert into login (ID, IDEMPRESA) values(" + id + "," + idEmp + ")";
                orden.executeUpdate(insertar);
                //System.out.println("SE A INSERTO LA SUCURSAL");
            }

            con.commit();
            stmt.close();
            rs.close();
        } catch (SQLException ex) {
            System.out.println("Error insertar login: " + ex);
        }
    }

    public ArrayList<Login> selectIdLogin(String nombre, String clave) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        int id = 0;
        int empresa = 0;
        ArrayList<Login> login = new ArrayList();
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //stmt.execute(createSQL);

            ResultSet rs = stmt.executeQuery("select id, empresa from usuario where nombre_usuario='" + nombre + "' and clave='" + clave + "'");
            while (rs.next()) {
                //System.out.printf("Id: "+rs.getInt(1)+",Nombre: "+rs.getString(2));
                id = rs.getInt(1);
                empresa = rs.getInt(2);
                Login log = new Login(id, empresa);
                login.add(log);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return login;
    }

    public ArrayList<Autentificacion> seleccionarIdEmpresa(int id) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;
        ArrayList<Autentificacion> autentificacion = new ArrayList();

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            Statement orden = con.createStatement();

            rs = stmt.executeQuery("select * from login where id = " + id);

            while (rs.next()) {
                Autentificacion autentif = new Autentificacion(rs.getInt(1), rs.getInt(2));
                autentificacion.add(autentif);
            }

            con.commit();
            stmt.close();
            rs.close();
        } catch (SQLException ex) {
            System.out.println("Error seleccionar tabla autentificación: " + ex);
        }
        return autentificacion;
    }

    public boolean Autentificacion(String usuario, String clave) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        boolean resultado = false;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            Statement orden = con.createStatement();
            rs = stmt.executeQuery("select * from usuario where nombre_usuario ='" + usuario + "' and clave='" + clave + "'");

            if (rs.next()) {
                resultado = true;
            }

            con.commit();
            stmt.close();
            rs.close();
        } catch (Exception ex) {
            System.out.println("Error seleccionar tabla autentificación: " + ex.getMessage());
        }
        return resultado;
    }
    
    public void actualizarSucursalSuc(int id,int empresa,String nombre,int numero,String direccion,int telefono1,int telefono2,int telefono3,int departamento,int municipio,java.sql.Date updatedat,int nota_venta_correlativa,int nota_traspaso_correlativo,int nota_baja_correlativo,int pedido_correlativo,int copias_impresion_pedido,String frase_pedido,int nota_recibo_correlativo,int imprimir_pedido_corto,int cotizacion_correlativo,int pre_factura,java.sql.Date fecha_Reinicio) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
           // con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            Statement orden = con.createStatement();
            
            stmt = con.createStatement();
            String seleccionar = "select * from sucursal where id = "+id;
            rs = stmt.executeQuery(seleccionar);
            if(rs.next()){
                String sql = "UPDATE sucursal SET EMPRESA=?,NOMBRE=?,NUMERO=?,DIRECCION=?,TELEFONO1=?,TELEFONO2=?,TELEFONO3=?,DEPARTAMENTO=?,MUNICIPIO=?,UPDATEDAT=?,NOTA_VENTA_CORRELATIVO=?,NOTA_TRASPASO_CORRELATIVO=?,NOTA_BAJA_CORRELATIVO=?,PEDIDO_CORRELATIVO=?,COPIAS_IMPRESION_PEDIDO=?,FRASE_PEDIDO=?,NOTA_RECIBO_CORRELATIVO=?,IMPRIMIR_PEDIDO_CORTO=?,COTIZACION_CORRELATIVO=?,PRE_FACTURA_CORRELATIVO=?,FECHA_REINICIO_CORRELATIVO=? WHERE ID=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, empresa);
                statement.setString(2, nombre);
                statement.setInt(3, numero);
                statement.setString(4, direccion);
                statement.setInt(5, telefono1);
                statement.setInt(6, telefono2);
                statement.setInt(7, telefono3);
                statement.setInt(8, departamento);
                statement.setInt(9, municipio);
                statement.setDate(10, updatedat);
                statement.setInt(11, nota_venta_correlativa);
                statement.setInt(12, nota_traspaso_correlativo);
                statement.setInt(13, nota_baja_correlativo);
                statement.setInt(14, pedido_correlativo);
                statement.setInt(15, copias_impresion_pedido);
                statement.setString(16, frase_pedido);
                statement.setInt(17, nota_recibo_correlativo);
                statement.setInt(18, imprimir_pedido_corto);
                statement.setInt(19, cotizacion_correlativo);
                statement.setInt(20, pre_factura);
                statement.setDate(21, fecha_Reinicio);
                statement.setInt(22, id);
                
                statement.executeUpdate(); 
                statement.close();
            }/*else{
            String insertar = "insert into sucursal(EMPRESA,NOMBRE,NUMERO,DIRECCION,TELEFONO1,TELEFONO2,TELEFONO3,DEPARTAMENTO,MUNICIPIO,CREATEDAT,UPDATEDAT,NOTA_VENTA_CORRELATIVO) VALUES ("+empresa+",'"+nombre+"',"+numero+",'"+direccion+"',"+telefono1+","+telefono2+","+telefono3+","+departamento+","+municipio+",'"+createdat+"','"+updatedat+"',"+nota_venta_correlativa+")";
            orden.executeUpdate(insertar);
            }  */ 
            con.commit();
            //stmt.close();
            //rs.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al actualizar las sucursales: " + ex);
        }            
    }
     
    public void insertarSucursalSuc(int empresa,String nombre,int numero,String direccion,int telefono1,int telefono2,int telefono3,int departamento,int municipio,java.sql.Date createdat,java.sql.Date updatedat,int nota_venta_correlativa,int nota_traspaso_correlativo,int nota_baja_correlativo,int pedido_correlativo,int copias_impresion_pedido,String frase_pedido,int nota_recibo_correlativo,int imprimir_pedido_corto,int cotizacion_correlativo,int pre_factura,java.sql.Date fecha_Reinicio,boolean eliminado) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
           // con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            /*con.setAutoCommit(false);
            stmt = con.createStatement();

            Statement orden = con.createStatement();          

            String insertar = "insert into sucursal(EMPRESA,NOMBRE,NUMERO,DIRECCION,TELEFONO1,TELEFONO2,TELEFONO3,DEPARTAMENTO,MUNICIPIO,CREATEDAT,UPDATEDAT,NOTA_VENTA_CORRELATIVO,NOTA_TRASPASO_CORRELATIVO,NOTA_BAJA_CORRELATIVO,PEDIDO_CORRELATIVO,COPIAS_IMPRESION_PEDIDO,FRASE_PEDIDO,NOTA_RECIBO_CORRELATIVO,IMPRIMIR_PEDIDO_CORTO,COTIZACION_CORRELATIVO,PRE_FACTURA_CORRELATIVO,FECHA_REINICIO_CORRELATIVO) VALUES ("+empresa+",'"+nombre+"',"+numero+",'"+direccion+"',"+telefono1+","+telefono2+","+telefono3+","+departamento+","+municipio+",'"+createdat+"','"+updatedat+"',"+nota_venta_correlativa+","+nota_traspaso_correlativo+","+nota_baja_correlativo+","+pedido_correlativo+","+copias_impresion_pedido+",'"+frase_pedido+"',"+nota_recibo_correlativo+","+imprimir_pedido_corto+","+cotizacion_correlativo+","+pre_factura+",'"+fecha_Reinicio+"')";
            orden.executeUpdate(insertar);NUMERO
            
            con.commit();*/
            con.setAutoCommit(false);
            stmt = con.createStatement();

            pstmt = con.prepareStatement("INSERT INTO SUCURSAL(EMPRESA,NOMBRE,NUMERO,DIRECCION,TELEFONO1,TELEFONO2,TELEFONO3,DEPARTAMENTO,MUNICIPIO,CREATEDAT,UPDATEDAT,NOTA_VENTA_CORRELATIVO,NOTA_TRASPASO_CORRELATIVO,NOTA_BAJA_CORRELATIVO,PEDIDO_CORRELATIVO,COPIAS_IMPRESION_PEDIDO,FRASE_PEDIDO,NOTA_RECIBO_CORRELATIVO,IMPRIMIR_PEDIDO_CORTO,COTIZACION_CORRELATIVO,PRE_FACTURA_CORRELATIVO,FECHA_REINICIO_CORRELATIVO,ELIMINADO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            pstmt.setInt(1, empresa);
            pstmt.setString(2, nombre);
            pstmt.setInt(3, numero);
            pstmt.setString(4, direccion);
            pstmt.setInt(5, telefono1);
            pstmt.setInt(6, telefono2);
            pstmt.setInt(7, telefono3);
            pstmt.setInt(8, departamento);
            pstmt.setInt(9, municipio);
            pstmt.setDate(10, createdat);
            pstmt.setDate(11, updatedat);
            pstmt.setInt(12, nota_venta_correlativa);
            pstmt.setInt(13, nota_traspaso_correlativo);     
            pstmt.setInt(14, nota_baja_correlativo);             
            pstmt.setInt(15, pedido_correlativo); 
            pstmt.setInt(16, copias_impresion_pedido); 
            pstmt.setString(17, frase_pedido); 
            pstmt.setInt(18, nota_recibo_correlativo); 
            pstmt.setInt(19, imprimir_pedido_corto); 
            pstmt.setInt(20, cotizacion_correlativo); 
            pstmt.setInt(21, pre_factura);
            pstmt.setDate(22, fecha_Reinicio);
            pstmt.setBoolean(23, eliminado);
            
            pstmt.executeUpdate();

            con.commit();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar las sucursales: " + ex);
        }            
    }
        
    //REVISAR PARA SOLICITUDES
    public void insertarSucursal(int id, String nombre, int id_usuario) {

        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            Statement orden = con.createStatement();

            rs = stmt.executeQuery("select * from sucursal where id = " + id + " and id_usuario=" + id_usuario);
            //while (rs.next()) {
            //System.out.printf(rs.getInt(1) + rs.getString(2));
            //JOptionPane.showMessageDialog(null,+rs.getInt(1)+"-"+rs.getString(2))
            if (rs.next()) {
                String sql = "UPDATE sucursal SET id=?, nombre=?, id_usuario=? WHERE id=? AND id_usuario=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setString(2, nombre);
                statement.setInt(3, id_usuario);
                statement.setInt(4, id);
                statement.setInt(5, id_usuario);
                statement.executeUpdate();
                //System.out.println("SE ACTUALIZO LA TABLA SUCURSAL");
            } else {
                String insertar = "insert into sucursal(ID, NOMBRE, ID_USUARIO) values(" + id + ",'" + nombre + "'," + id_usuario + ")";
                orden.executeUpdate(insertar);
                //System.out.println("SE A INSERTO LA SUCURSAL");
            }
            // }

            //
            con.commit();
            //stmt.close();
            //rs.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar las sucursales: " + ex);
        }
    }

    public void insertarSucursalEmpresa(int empresa,String nombre,int numero,String direccion,int telefono1,int telefono2,int telefono3,int departamento,int municipio,java.sql.Date createdat,java.sql.Date updatedat,int nota_venta_correlativa,boolean eliminado) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
           // con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            Statement orden = con.createStatement();
            
            stmt = con.createStatement();
            String seleccionar = "select * from sucursal where empresa = "+empresa;
            rs = stmt.executeQuery(seleccionar);
            if(rs.next()){
                String sql = "UPDATE sucursal SET EMPRESA=?,NOMBRE=?,NUMERO=?,DIRECCION=?,TELEFONO1=?,TELEFONO2=?,TELEFONO3=?,DEPARTAMENTO=?,MUNICIPIO=?,UPDATEDAT=?,NOTA_VENTA_CORRELATIVO=?,ELIMINADO=? WHERE empresa=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, empresa);
                statement.setString(2, nombre);
                statement.setInt(3, numero);
                statement.setString(4, direccion);
                statement.setInt(5, telefono1);
                statement.setInt(6, telefono2);
                statement.setInt(7, telefono3);
                statement.setInt(8, departamento);
                statement.setInt(9, municipio);
                statement.setDate(10, updatedat);
                statement.setInt(11, nota_venta_correlativa);
                statement.setBoolean(12, eliminado);
                statement.setInt(13, empresa);

                statement.executeUpdate(); 
                statement.close();
            }else{
            String insertar = "insert into sucursal(EMPRESA,NOMBRE,NUMERO,DIRECCION,TELEFONO1,TELEFONO2,TELEFONO3,DEPARTAMENTO,MUNICIPIO,CREATEDAT,UPDATEDAT,NOTA_VENTA_CORRELATIVO,ELIMINADO) VALUES ("+empresa+",'"+nombre+"',"+numero+",'"+direccion+"',"+telefono1+","+telefono2+","+telefono3+","+departamento+","+municipio+",'"+createdat+"','"+updatedat+"',"+nota_venta_correlativa+","+eliminado+")";
            orden.executeUpdate(insertar);
            }   
            con.commit();
            //stmt.close();
            //rs.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar las sucursales: " + ex);
            JOptionPane.showMessageDialog(null, "Error al ingresar o actualizar la sucursal.");
        }            
    }
     
    public ArrayList<Sucursal> SeleccionarSucursal(int id_user) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ArrayList<Sucursal> sucursales = new ArrayList();
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //stmt.execute(createSQL);

            ResultSet rs = stmt.executeQuery("select * from sucursal where id_usuario=" + id_user);
            while (rs.next()) {
                //System.out.printf("Id: "+rs.getInt(1)+",Nombre: "+rs.getString(2));
                Sucursal sucursal = new Sucursal(rs.getInt(1), rs.getString(2), rs.getInt(3));
                sucursales.add(sucursal);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return sucursales;
    }

    public ResultSet SeleccionarSucursalPorId(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            rs = stmt.executeQuery(consulta);

            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return rs;
    }

    public ArrayList<Sucursal> SeleccionarSucursalPorNombre(String nombre_sucursal) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ArrayList<Sucursal> sucursales = new ArrayList();

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //stmt.execute(createSQL);

            ResultSet rs = stmt.executeQuery("select * from sucursal where nombre = '" + nombre_sucursal + "'");
            while (rs.next()) {
                //System.out.printf("Id: "+rs.getInt(1)+", Nombre: "+rs.getString(2));
                Sucursal sucursal = new Sucursal(rs.getInt(1), rs.getString(2), rs.getInt(3));
                sucursales.add(sucursal);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return sucursales;
    }

    public void InsertAlmacen(int id, String nombre, int id_sucursal) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();
            Statement orden = con.createStatement();
            rs = stmt.executeQuery("select * from almacen where id = " + id);
            if (rs.next()) {
                // System.out.println("esta lleno");
                String sql = "UPDATE almacen SET id=?, nombre=?, id_sucursal=? WHERE id=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setString(2, nombre);
                statement.setInt(3, id_sucursal);
                statement.setInt(4, id);
                //System.out.println("SE ACTUALIZO LA TABLA");
            } else {
                //System.out.println("esta vacio");
                String insertar = "insert into almacen(ID, NOMBRE,ID_SUCURSAL) values(" + id + ",'" + nombre + "'," + id_sucursal + ")";
                orden.executeUpdate(insertar);
                // System.out.println("SE A INSERTO EL ALMACEN");
            }

            con.commit();

        } catch (SQLException ex) {
            System.out.println("Error al insertar almacen: " + ex);
        }
    }

    public ArrayList<Almacen> SeleccionarAlmacen(String nombre) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ArrayList<Almacen> almacenes = new ArrayList();
        int id_suc = 0;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionarId = "select * from sucursal where nombre = '" + nombre + "'";
            ResultSet rsid = stmt.executeQuery(seleccionarId);
            while (rsid.next()) {
                id_suc = rsid.getInt(1);
                // System.out.println("id de la sucursal: "+ id_suc);
            }

            //Se selecciona los datos del almacen segun el id de la sucursal seleccionada
            String seleccionar = "select * from almacen where id_sucursal = " + id_suc;
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                Almacen almacen = new Almacen(rs.getInt(1), rs.getString(2), rs.getInt(3));
                almacenes.add(almacen);
                //System.out.println(rs.getInt(1) + rs.getString(2) + rs.getInt(3));    
            }

            con.commit();
        } catch (Exception e) {
            System.out.println("Error al seleccionar almacen: " + e);
        }
        return almacenes;
    }

    public ResultSet seleccionarTodoAlmacen(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            rs = stmt.executeQuery(consulta);

            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return rs;
    }

    public ArrayList<Almacen> SeleccionarTodoAlmacenPorNombre(String nombre) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ArrayList<Almacen> almacenes = new ArrayList();
        int id_suc = 0;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se selecciona los datos del almacen segun el id de la sucursal seleccionada
            String seleccionar = "select * from almacen where nombre = '" + nombre + "'";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                Almacen almacen = new Almacen(rs.getInt(1), rs.getString(2), rs.getInt(3));
                almacenes.add(almacen);
                //System.out.println(rs.getInt(1) + rs.getString(2) + rs.getInt(3));    
            }

            con.commit();
            con.close();
        } catch (Exception e) {
            System.out.println("Error al seleccionar todo almacen: " + e);
        }
        return almacenes;
    }

    public void insertarGrupoEmpresas(int id, String nombre) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
            String seleccionar = "select * from grupos where id = " + id;
            rs = stmt.executeQuery(seleccionar);
            if (rs.next()) {
                //System.out.println("Se Encuentra");
                String sql = "UPDATE grupos SET id=?, nombre=? WHERE id=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setString(2, nombre);
                statement.setInt(3, id);
                // System.out.println("Se actualizo la tabla de grupos");
            } else {
                String insertar = "insert into grupos(id, nombre) values(" + id + ",'" + nombre + "')";
                orden.executeUpdate(insertar);
                //System.out.println("Se Ingresaron los grupos empresas");
            }
            con.commit();

        } catch (SQLException ex) {
            System.out.println("Error insertar grupos empresa: " + ex);
        }
    }

    public int selectIdAlmacen(String nombre_Almacen) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ArrayList<Almacen> almacenes = new ArrayList();
        int id_almacen = 0;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionarId = "select * from almacen where nombre = '" + nombre_Almacen + "'";
            ResultSet rsid = stmt.executeQuery(seleccionarId);
            while (rsid.next()) {
                id_almacen = rsid.getInt(1);
                //return id_almacen;
                //System.out.println("id de la Almacen: "+ id_almacen);
            }

            con.commit();
        } catch (Exception e) {
            System.out.println("Error al seleccionar el id del almacen: " + e);
        }
        return id_almacen;
    }

    public ArrayList<Almacen> selectAlmacenById(int id_sucursal) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ArrayList<Almacen> almacenes = new ArrayList();
        int id_almacen = 0;
        String nombre = "";
        int id_sucu = 0;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "select * from almacen where id_sucursal=" + id_sucursal;
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_almacen = rs.getInt(1);
                nombre = rs.getString(2);
                id_sucu = rs.getInt(3);
                Almacen almacen = new Almacen(id_almacen, nombre, id_sucu);
                almacenes.add(almacen);

            }

            con.commit();
        } catch (Exception e) {
            System.out.println("Error al seleccionar el id del almacen: " + e);
        }
        return almacenes;
    }

    public boolean ingresarSolicitudReposicion(int id_almacen, java.sql.Date fecha, int id_usuario, boolean activo, boolean eliminado, java.sql.Date fechaAct, double monto, String nombre_sucursal) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;

        //System.out.println(formateador.format(date));
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //String consulta = "SELECT * FROM SOLICITUD_REPOSICION WHERE";

            pstmt = con.prepareStatement("insert into solicitud_reposicion(almacen,fecha,usuario,activo,eliminado,createdat,updatedat,monto,nombre_sucursal) values(?,?,?,?,?,?,?,?,?)");
            pstmt.setInt(1, id_almacen);
            pstmt.setDate(2, fecha);
            pstmt.setInt(3, id_usuario);
            pstmt.setBoolean(4, activo);
            pstmt.setBoolean(5, eliminado);
            pstmt.setDate(6, fechaAct);
            pstmt.setDate(7, fechaAct);
            pstmt.setDouble(8, monto);
            pstmt.setString(9, nombre_sucursal);
            pstmt.executeUpdate();

            con.commit();
            //con.close();
            valor = true;
        } catch (Exception e) {
            System.out.println("Error al insertar " + e);
        }
        return valor;
    }

    public void actualizarSolicitudReposicion(int id_detalle, int id_alm_repo,java.sql.Date fecha, int id_usuario, boolean activo, boolean eliminado, java.sql.Date fechaAct, double monto, String Nombre_Sucursal) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        ResultSet rsDSP = null;
        ResultSet rsDSPB = null;
        PreparedStatement statement = null;
       // java.sql.Date fechaAnt=null;
        int id_soliRepo = 0;
        int numUpd;    
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            //con.setAutoCommit(false);
            stmt = con.createStatement();

            String sql = "UPDATE SOLICITUD_REPOSICION SET FECHA = ?, UPDATEDAT = ? WHERE ID = ?";
            statement = con.prepareStatement(sql);
            statement.setDate(1, fecha);
            statement.setDate(2, fechaAct);
            statement.setInt(3, id_detalle);

            statement.executeUpdate(); 
            con.close();
           
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }                
    }

    public void insertarProductosBase(int id, int id_pb, String nombre_pb, String unid_med_pb, int precio_unit_pb, String cantU_ideal_pb) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
            String seleccionar = "select id_prod_base,id_producto from producto_base where id_prod_base = " + id_pb + " and id_producto=" + id;
            rs = stmt.executeQuery(seleccionar);

            if (rs.next()) {

                String sql = "UPDATE producto_base SET id_producto=?, nombre_pb=?,uni_medi_pb=?,cant_uni_ideal=?,precio_uni_pb=?,id_prod_base=? WHERE id_prod_base=? and id_producto=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setString(2, nombre_pb);
                statement.setString(3, unid_med_pb);
                statement.setString(4, cantU_ideal_pb);
                statement.setInt(5, precio_unit_pb);
                statement.setInt(6, id_pb);
                statement.setInt(7, id_pb);
                statement.setInt(8, id);

                // System.out.println("Se actualizo los productos base");
            } else {
                pstmt = con.prepareStatement("insert into producto_base(id_producto,nombre_pb,uni_medi_pb,cant_uni_ideal,precio_uni_pb,id_prod_base) values(?,?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setString(2, nombre_pb);
                pstmt.setString(3, unid_med_pb);
                pstmt.setString(4, cantU_ideal_pb);
                pstmt.setInt(5, precio_unit_pb);
                pstmt.setInt(6, id_pb);

                pstmt.executeUpdate();
                //System.out.println("Se Ingresaron los productos base ");
            }
            con.commit();
            stmt.close();
            orden.close();
        } catch (SQLException ex) {
            System.out.println("Error al insertar producto base: " + ex);
            System.out.println(ex.getMessage());
            System.out.println(nombre_pb);
        }

    }

    public void insertarProductos(int id_almacen, int id_prod, String nomb_prod, String unidad_medida, double precio_unitario, int id_grupo, int id_subgrupos) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
            String seleccionar = "select id_prod,id_alm from producto where id_prod=" + id_prod + " and id_alm=" + id_almacen;
            rs = stmt.executeQuery(seleccionar);

            if (rs.next()) {
                //System.out.println("Se Encuentra");
                String sql = "UPDATE producto SET  id_prod=?,id_alm=?, nomb_prod=?,unid_medid=?,precio_unit=?,id_grupo=?,id_subgrupos=? WHERE id_prod=? and id_alm=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id_prod);
                statement.setInt(2, id_almacen);
                statement.setString(3, nomb_prod);
                statement.setString(4, unidad_medida);
                statement.setDouble(5, precio_unitario);
                statement.setInt(6, id_grupo);
                statement.setInt(7, id_subgrupos);
                statement.setInt(8, id_prod);
                statement.setInt(9, id_almacen);

                statement.executeUpdate();
                //con.close();
                // System.out.println("Se actualizo la tabla productos");
            } else {
                pstmt = con.prepareStatement("insert into producto(id_prod,id_alm,nomb_prod,unid_medid,precio_unit,id_grupo,id_subgrupos) values(?,?,?,?,?,?,?)");
                pstmt.setInt(1, id_prod);
                pstmt.setInt(2, id_almacen);
                pstmt.setString(3, nomb_prod);
                pstmt.setString(4, unidad_medida);
                pstmt.setDouble(5, precio_unitario);
                pstmt.setInt(6, id_grupo);
                pstmt.setInt(7, id_subgrupos);
                pstmt.executeUpdate();
                //System.out.println("Se Ingresaron los productos");            
            }
            con.commit();
            con.close();
        } catch (SQLException ex) {
            System.out.println("Error al insertar producto: " + ex);
            System.out.println(ex.getMessage());
            //           System.out.println("nom: " + nomb_prod + " id: " + id_prod);
        }
    }

    public ResultSet selectProductos(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            rs = stmt.executeQuery(consulta);

            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return rs;
    }

    public ResultSet selectProductosBase(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            rs = stmt.executeQuery(consulta);
            /*while (rs.next()) {
              // System.out.println("Id: "+rs.getInt(1)+" Nombre: "+rs.getString(2)+" Unidad "+rs.getString(3)+" cantidad "+rs.getString(4)+" Precio "+rs.getInt(5)+" IdPB "+rs.getInt(6));
               ProductoBase producto = new ProductoBase(rs.getInt(1),rs.getString(2), rs.getString(3), rs.getString(4), rs.getInt(5),rs.getInt(6)); 
               productosBase.add(producto);
            }*/
            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());

        }
        return rs;
    }

    public void insertarInventario(int inv_id, int inv_id_alma, int inv_id_pro, int inv_cant, int inv_cost_unit, int inv_cost_to, String inv_fecha_venci, String inv_lote, String inv_createdAt, String inv_updatedAt) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
            String seleccionar = "select * from inventario where id=" + inv_id;
            rs = stmt.executeQuery(seleccionar);

            if (rs.next()) {
                    
                String sql = "UPDATE inventario SET id=?, id_almacen=?,id_producto=?,cantidad=?,costo_unitario=?,costo_total=?,fecha_venci=?,lote=?,createdat=?,updatedat=? WHERE id=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, inv_id);
                statement.setInt(2, inv_id_alma);
                statement.setInt(3, inv_id_pro);
                statement.setInt(4, inv_cant);
                statement.setInt(5, inv_cost_unit);
                statement.setInt(6, inv_cost_to);
                statement.setString(7, inv_fecha_venci);

                statement.setString(8, inv_lote);
                statement.setString(9, inv_createdAt);
                statement.setString(10, inv_updatedAt);
                statement.setInt(11, inv_id);

                statement.executeUpdate();
                // System.out.println("Se actualizo los productos base");
            } else {
                pstmt = con.prepareStatement("insert into inventario(id,id_almacen,id_producto,cantidad,costo_unitario,costo_total,fecha_venci,lote,createdat,updatedat) values(?,?,?,?,?,?,?,?,?,?)");

                pstmt.setInt(1, inv_id);
                pstmt.setInt(2, inv_id_alma);
                pstmt.setInt(3, inv_id_pro);
                pstmt.setInt(4, inv_cant);
                pstmt.setInt(5, inv_cost_unit);
                pstmt.setInt(6, inv_cost_to);
                pstmt.setString(7, inv_fecha_venci);

                pstmt.setString(8, inv_lote);
                pstmt.setString(9, inv_createdAt);
                pstmt.setString(10, inv_updatedAt);

                pstmt.executeUpdate();
                //System.out.println("Se Ingresaron los productos base ");
            }
            con.commit();
            con.close();
        } catch (SQLException ex) {
            System.out.println("Error al insertar inventario: " + ex);
        }
    }

    public ResultSet selectInFiltro(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();
            rs = stmt.executeQuery(consulta);
            
            /*while (rs.next()) {
              // System.out.println("Id: "+rs.getInt(1)+" Nombre: "+rs.getString(2)+" Unidad "+rs.getString(3)+" cantidad "+rs.getString(4)+" Precio "+rs.getInt(5)+" IdPB "+rs.getInt(6));
               ProductoBase producto = new ProductoBase(rs.getInt(1),rs.getString(2), rs.getString(3), rs.getString(4), rs.getInt(5),rs.getInt(6)); 
               productosBase.add(producto);
            }*/
        
            con.commit();

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return rs;
    }

    public void InsertarUsuario(int persona,int empresa,String nombre_usuario,String clave,String token,boolean activo,String createdat,String updatedat,int comision_general,int comision_activa,boolean eliminado) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
           /* String seleccionar = "select * from usuario where persona = " + persona;
            rs = stmt.executeQuery(seleccionar);
            if (rs.next()) {
                //System.out.println("Se Encuentra");
                String sql = "UPDATE USUARIO SET PERSONA=?,EMPRESA=?,NOMBRE_USUARIO=?,CLAVE=?,TOKEN=?,ACTIVO=?,CREATEDAT=?,UPDATEDAT=?,COMISION_GENERAL=?,COMISION_ACTIVA=? WHERE PERSONA=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, persona);
                statement.setInt(2, empresa);
                statement.setString(3, nombre_usuario);    
                statement.setString(4, clave);
                statement.setString(5, token);
                statement.setBoolean(6, activo);
                statement.setString(7,createdat);
                statement.setString(8,updatedat);
                statement.setInt(9, comision_general);
                statement.setInt(10, comision_activa);
                statement.setInt(11, empresa);
                statement.executeUpdate();

            } else {*/
                        
            pstmt = con.prepareStatement("INSERT INTO USUARIO (PERSONA, EMPRESA, NOMBRE_USUARIO, CLAVE, TOKEN, ACTIVO, CREATEDAT, UPDATEDAT, COMISION_GENERAL, COMISION_ACTIVA,ELIMINADO) VALUES(?,?,?,?,?,?,?,?,?,?,?)");
            pstmt.setInt(1, persona);
            pstmt.setInt(2, empresa);
            pstmt.setString(3, nombre_usuario);
            pstmt.setString(4, clave);
            pstmt.setString(5, token);
            pstmt.setBoolean(6, activo);
            pstmt.setString(7, createdat);
            pstmt.setString(8, updatedat);
            pstmt.setInt(9, comision_general);
            pstmt.setInt(10, comision_activa);
            pstmt.setBoolean(11, eliminado);
            
            pstmt.executeUpdate();
            
           /* }*/
            con.commit();

        } catch (SQLException ex) {
            System.out.println("Error insertar el usuario: " + ex);
        }
    }

    public int seleccionarSolicitudReposicionId() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ArrayList<Almacen> almacenes = new ArrayList();
        int id_solicitud_repo = 0;
        String nombre = "";
        int id_sucu = 0;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "SELECT Max(ID) FROM SOLICITUD_REPOSICION";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_solicitud_repo = rs.getInt(1);
            }

            con.commit();
        } catch (Exception e) {
            System.out.println("Error al seleccionar el id del almacen: " + e);
        }
        return id_solicitud_repo;
    }

    public int seleccionarDetalleSoliciProducto() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ArrayList<Almacen> almacenes = new ArrayList();
        int id_solicitud_repo = 0;
        String nombre = "";
        int id_sucu = 0;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "SELECT Max(ID) FROM DETALLE_SOLICITUD_PRODUCTO";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_solicitud_repo = rs.getInt(1);
            }

            con.commit();
        } catch (Exception e) {
            System.out.println("Error al seleccionar el id del almacen: " + e);
        }
        return id_solicitud_repo;
    }

    public void insertarSolicitudProducto(int solicitud, int id_pro, double cantidad, java.sql.Date fechaCreada,java.sql.Date fechaActualizada) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();

            pstmt = con.prepareStatement("INSERT INTO DETALLE_SOLICITUD_PRODUCTO (SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT) VALUES(?,?,?,?,?)");
            pstmt.setInt(1, solicitud);
            pstmt.setInt(2, id_pro);
            pstmt.setDouble(3, cantidad);
            pstmt.setDate(4, fechaCreada);
            pstmt.setDate(5, fechaActualizada);

            pstmt.executeUpdate();

            con.commit();

        } catch (SQLException ex) {
            System.out.println("Error insertar el id detalle producto: " + ex);
        }
    }

    public void insertarDetalleSolicitudProductoBase(int deta_solici_prod, int prod_base, double canti_ideal, double canti_real, java.sql.Date fechaActual, java.sql.Date fechaActualizada, double total) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();

            /*String insertar = "INSERT INTO DETALLE_SOLICITUD_PRODUCTO_BASE (DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,CREATEDAT,UPDATEDAT,TOTAL) VALUES ("+deta_solici_prod+","+prod_base+","+canti_ideal+","+canti_real+","+fecha+","+fecha+","+total+")";
            orden.executeUpdate(insertar);*/
            pstmt = con.prepareStatement("INSERT INTO DETALLE_SOLICITUD_PRODUCTO_BASE (DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,CREATEDAT,UPDATEDAT,TOTAL) VALUES(?,?,?,?,?,?,?)");
            pstmt.setInt(1, deta_solici_prod);
            pstmt.setInt(2, prod_base);
            pstmt.setDouble(3, canti_ideal);
            pstmt.setDouble(4, canti_real);
            pstmt.setDate(5, fechaActual);
            pstmt.setDate(6, fechaActualizada);
            pstmt.setDouble(7, total);

            pstmt.executeUpdate();

            con.commit();

        } catch (SQLException ex) {
            System.out.println("Error insertar el detalle producto base: " + ex);
        }
    }

    public ResultSet seleccionarUsuario(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();
            rs = stmt.executeQuery(consulta);
            /*while (rs.next()) {
              // System.out.println("Id: "+rs.getInt(1)+" Nombre: "+rs.getString(2)+" Unidad "+rs.getString(3)+" cantidad "+rs.getString(4)+" Precio "+rs.getInt(5)+" IdPB "+rs.getInt(6));
               ProductoBase producto = new ProductoBase(rs.getInt(1),rs.getString(2), rs.getString(3), rs.getString(4), rs.getInt(5),rs.getInt(6)); 
               productosBase.add(producto);
            }*/
            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return rs;
    }

    public void UpdateTablaSolicitudes(int id) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean activo = false;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            //con.setAutoCommit(false);
            stmt = con.createStatement();

            String sql = "UPDATE SOLICITUD_REPOSICION SET ACTIVO = ? WHERE ID = ?";
            PreparedStatement statement = con.prepareStatement(sql);
            statement.setBoolean(1, false);
            statement.setInt(2, id);

            statement.executeUpdate(); 
            //statement.close();
            con.close();
           
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
    
    public void UpdateTablaDetalleSolicitudProducto(int id){
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean activo = false;

        try {
            
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            //con.setAutoCommit(false);
            stmt = con.createStatement();

            String sql = "UPDATE SOLICITUD_REPOSICION SET ACTIVO = ? WHERE ID = ?";
            PreparedStatement statement = con.prepareStatement(sql);
            statement.setBoolean(1, false);
            statement.setInt(2, id);

            statement.executeUpdate(); 
            //statement.close();
            con.close();
           
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public ResultSet consultasSelectSolicitud(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();
            rs = stmt.executeQuery(consulta);

            con.commit();
   
        } catch (Exception e) {
            System.out.println("Error al duplicar los productos "+e.getMessage());
        }
        return rs;
    }

    public ResultSet seleccionarGrupos(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();
            rs = stmt.executeQuery(consulta);
            /*while (rs.next()) {
              // System.out.println("Id: "+rs.getInt(1)+" Nombre: "+rs.getString(2)+" Unidad "+rs.getString(3)+" cantidad "+rs.getString(4)+" Precio "+rs.getInt(5)+" IdPB "+rs.getInt(6));
               ProductoBase producto = new ProductoBase(rs.getInt(1),rs.getString(2), rs.getString(3), rs.getString(4), rs.getInt(5),rs.getInt(6)); 
               productosBase.add(producto);
            }*/
            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return rs;
    }

    public boolean existeEldato(String consulta) {
        Conectar();
        boolean res = false;
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            rs = stmt.executeQuery(consulta);
            while (rs.next()) {
                res = true;
            }

            con.commit();
            //con.close();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return res;
    }
    
    public ResultSet insertarProductos(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            pstmt = con.prepareStatement(consulta);

            pstmt.executeUpdate();
            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());

        }
        return rs;
    }
    
    public void insertarProductosConDatos(int solicitud,int producto,double cantidad,java.sql.Date createdat,java.sql.Date updatedat) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();

            pstmt = con.prepareStatement("INSERT INTO DETALLE_SOLICITUD_PRODUCTO (SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT) VALUES(?,?,?,?,?)");
            pstmt.setInt(1, solicitud);
            pstmt.setInt(2, producto);
            pstmt.setDouble(3, cantidad);
            pstmt.setDate(4, createdat);
            pstmt.setDate(5, updatedat);

            pstmt.executeUpdate();

            con.commit();

        } catch (SQLException ex) {
            System.out.println("Error insertar el id detalle producto: " + ex);
        }
    }
    
    public void eliminarProductos(String consulta){
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();
            stmt.execute(consulta);
            //pstmt = con.prepareStatement(consulta);

           //pstmt.executeUpdate();
            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());

        }
    }
    
    public void InsertarRoles(int id,String nombre,String createdat,String updatedat) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
            String seleccionar = "select * from rol where id = " + id;
            rs = stmt.executeQuery(seleccionar);
            if (rs.next()) {
                //System.out.println("Se Encuentra");
                String sql = "UPDATE ROL SET NOMBRE=?,CREATEDAT=?,UPDATEDAT=? WHERE ID=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setString(1, nombre);    
                statement.setString(2, createdat);
                statement.setString(3, updatedat);
                statement.setInt(4, id);
                
                statement.executeUpdate();
//                System.out.println("Se actualizo la tabla de grupos");
            } else {
             /*   String insertar = "INSERT INTO APP.USUARIO "
                        + "(PERSONA, EMPRESA, NOMBRE_USUARIO, CLAVE, TOKEN, ACTIVO, CREATEDAT, UPDATEDAT, COMISION_GENERAL, COMISION_ACTIVA) \n" +
                        "VALUES ("+persona+","+empresa+",'"+nombre_usuario+"','"+clave+"','"+activo+"', NULL, NULL, NULL, NULL)";
                orden.executeUpdate(insertar);*/
//              
                pstmt = con.prepareStatement("INSERT INTO ROL (NOMBRE, CREATEDAT, UPDATEDAT) VALUES(?,?,?)");
                pstmt.setString(1, nombre);
                pstmt.setString(2, createdat);
                pstmt.setString(3, updatedat);

                pstmt.executeUpdate();
            
            }
            con.commit();

        } catch (SQLException ex) {
            System.out.println("Error insertar el usuario: " + ex);
        }
    }
    
    public void InsertarRolesAplicacion(int id,int rol,int aplicacion,boolean puede_ver,boolean puede_crear,boolean puede_modificar,boolean puede_eliminar,String createdat,String updatedat) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
            String seleccionar = "SELECT * FROM ROL_APLICACION WHERE ID = " + id;
            rs = stmt.executeQuery(seleccionar);
            if (rs.next()) {
                //System.out.println("Se Encuentra");
                String sql = "UPDATE ROL_APLICACION SET ROL=?,APLICACION=?,PUEDE_VER=?,PUEDE_CREAR=?,PUEDE_MODIFICAR=?,PUEDE_ELIMINAR=?,CREATEDAT=?,UPDATEDAT=? WHERE ID=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, rol);    
                statement.setInt(2, aplicacion);
                statement.setBoolean(3, puede_ver);
                statement.setBoolean(4, puede_crear);
                statement.setBoolean(5, puede_modificar);
                statement.setBoolean(6, puede_eliminar);
                statement.setString(7, createdat);
                statement.setString(8, updatedat);               
                statement.setInt(9, id);
                
                statement.executeUpdate();
//                System.out.println("Se actualizo la tabla de grupos");
            } else {
              
                pstmt = con.prepareStatement("INSERT INTO ROL_APLICACION (ROL,APLICACION,PUEDE_VER,PUEDE_CREAR,PUEDE_MODIFICAR,PUEDE_ELIMINAR,CREATEDAT,UPDATEDAT) VALUES(?,?,?,?,?,?,?,?)");
                pstmt.setInt(1, rol);    
                pstmt.setInt(2, aplicacion);
                pstmt.setBoolean(3, puede_ver);
                pstmt.setBoolean(4, puede_crear);
                pstmt.setBoolean(5, puede_modificar);
                pstmt.setBoolean(6, puede_eliminar);
                pstmt.setString(7, createdat);
                pstmt.setString(8, updatedat);   

                pstmt.executeUpdate();
            
            }
            con.commit();

        } catch (SQLException ex) {
            System.out.println("Error insertar el usuario: " + ex);
        }
    }
    
    public void InsertarAplicacion(int id,String titulo, String atributo_clase,String url,int padre) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;
        Date fecha = new Date();
        long d = fecha.getTime();
        java.sql.Date fechas = new java.sql.Date(d);
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
            String seleccionar = "SELECT * FROM APLICACION WHERE ID = " + id;
            rs = stmt.executeQuery(seleccionar);
            if (rs.next()) {
                //System.out.println("Se Encuentra");
                String sql = "UPDATE APLICACION SET TITULO=?,ATRIBUTO_CLASE=?,URL=?,PADRE=?,CREATEDAT=?,UPDATEDAT=? WHERE ID=?";
                PreparedStatement statement = con.prepareStatement(sql);   
                statement.setString(1, titulo);
                statement.setString(2, atributo_clase);
                statement.setString(3, url);
                statement.setInt(4, padre); 
                statement.setDate(5, fechas);
                statement.setDate(6, fechas);
                statement.setInt(7, id);
                
                statement.executeUpdate();
//                System.out.println("Se actualizo la tabla de grupos");
            } else {
              
                pstmt = con.prepareStatement("INSERT INTO APLICACION (TITULO,ATRIBUTO_CLASE,URL,PADRE,CREATEDAT,UPDATEDAT) VALUES(?,?,?,?,?,?)");
                pstmt.setString(1, titulo);    
                pstmt.setString(2, atributo_clase);
                pstmt.setString(3, url);
                pstmt.setInt(4, padre);
                pstmt.setDate(5, fechas);
                pstmt.setDate(6, fechas);   

                pstmt.executeUpdate();
            
            }
            con.commit();

        } catch (SQLException ex) {
            System.out.println("Error insertar el usuario: " + ex);
        }
    }
    
    public void InsertarAplicacionNull(int id,String titulo, String atributo_clase,String url) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;
        Date fecha = new Date();
        long d = fecha.getTime();
        java.sql.Date fechas = new java.sql.Date(d);
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
            String seleccionar = "SELECT * FROM APLICACION WHERE ID = " + id;
            rs = stmt.executeQuery(seleccionar);
            if (rs.next()) {
                //System.out.println("Se Encuentra");
                String sql = "UPDATE APLICACION SET TITULO=?,ATRIBUTO_CLASE=?,URL=?,CREATEDAT=?,UPDATEDAT=? WHERE ID=?";
                PreparedStatement statement = con.prepareStatement(sql);   
                statement.setString(1, titulo);
                statement.setString(2, atributo_clase);
                statement.setString(3, url);
                statement.setDate(4, fechas);
                statement.setDate(5, fechas);
                statement.setInt(6, id);
                
                statement.executeUpdate();
//                System.out.println("Se actualizo la tabla de grupos");
            } else {
              
                pstmt = con.prepareStatement("INSERT INTO APLICACION (TITULO,ATRIBUTO_CLASE,URL,CREATEDAT,UPDATEDAT) VALUES(?,?,?,?,?)");
                pstmt.setString(1, titulo);    
                pstmt.setString(2, atributo_clase);
                pstmt.setString(3, url);
                pstmt.setDate(4, fechas);
                pstmt.setDate(5, fechas);   

                pstmt.executeUpdate();
            
            }
            con.commit();

        } catch (SQLException ex) {
            System.out.println("Error insertar el usuario: " + ex);
        }
    }
   
    public ResultSet seleccionar(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
           // con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();
            
            rs = stmt.executeQuery(consulta);
            
            
            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return rs;
    } 
    
    public ResultSet insertar(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            pstmt = con.prepareStatement(consulta);

            pstmt.executeUpdate();
            pstmt.close();
            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return rs;
    }
    
    public int seleccionarUltimoIdUsuario() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;;
        int id_solicitud_repo = 0;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "SELECT Max(ID) FROM USUARIO";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_solicitud_repo = rs.getInt(1);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println("Error id usuario: " + e);
        }
        return id_solicitud_repo;
    }
    
    public int seleccionarUltimoIdCompra() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;;
        int id_Compra = 0;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la compar seleccionada
            String seleccionar = "SELECT Max(ID) FROM COMPRA";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_Compra = rs.getInt(1);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println("Error al seleccionar ultimo id compra: " + e);
        }
        return id_Compra;
    }
    
    public int seleccionarUltimoIdProveedor() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;;
        int id_solicitud_repo = 0;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "SELECT Max(ID) FROM PROVEEDOR";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_solicitud_repo = rs.getInt(1);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println("Error id usuario: " + e);
        }
        return id_solicitud_repo;
    }
        
    public int seleccionarUltimoIdTipo() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;;
        int id_solicitud_repo = 0;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "SELECT Max(ID) FROM TIPO";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_solicitud_repo = rs.getInt(1);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println("Error id tipo: " + e);
        }
        return id_solicitud_repo;
    }
    
    public int seleccionarUltimoIdClase() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;;
        int id = 0;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "SELECT Max(ID) FROM CLASE";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id= rs.getInt(1);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println("Error id clase: " + e);
        }
        return id;
    }
    
    public int seleccionarUltimoIdPersona() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        int id_solicitud_repo = 0;
        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "SELECT Max(ID) FROM PERSONA";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_solicitud_repo = rs.getInt(1);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println("Error id usuario: " + e);
        }
        return id_solicitud_repo;
    }
    
     public int seleccionarUltimoIdEmpresa() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ArrayList<Almacen> almacenes = new ArrayList();
        int id_solicitud_repo = 0;
        String nombre = "";
        int id_sucu = 0;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "SELECT Max(ID) FROM EMPRESA";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_solicitud_repo = rs.getInt(1);
            }

            con.commit();
        } catch (Exception e) {
            System.out.println("Error id empresa: " + e);
        }
        return id_solicitud_repo;
    }
    
    public int seleccionarUltimoIdSucursal() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        int id_sucursal = 0;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "SELECT Max(ID) FROM SUCURSAL";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_sucursal = rs.getInt(1);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println("Error al seleccionar el ultimo id sucursal: " + e);
        }
        return id_sucursal;
    }
     
        public int seleccionarUltimoIdProducto() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        int id_producto = 0;
        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "SELECT Max(ID) FROM PRODUCTO";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_producto = rs.getInt(1);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println("Error id usuario: " + e);
        }
        return id_producto;
    }
    
    public String seleccionarCodigoProducto() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;;
        String codigo = "";

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "SELECT Max(CODIGO) FROM PRODUCTO";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                codigo = rs.getString(1);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println("Error id tipo: " + e);
        }
        return codigo;
    }
        
    public int seleccionarUltimoIdInventario() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        int id_solicitud_repo = 0;
        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "SELECT Max(ID) FROM INV_MOVIMIENTO";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_solicitud_repo = rs.getInt(1);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println("Error id inventario: " + e);
        }
        return id_solicitud_repo;
    }
    
    public int seleccionarUltimoIdMovimiento() {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        int id_solicitud_repo = 0;
        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionar = "SELECT Max(ID) FROM INV_MOVIMIENTO";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                id_solicitud_repo = rs.getInt(1);
            }
            con.commit();
        } catch (Exception e) {
            System.out.println("Error id movimiento: " + e);
        }
        return id_solicitud_repo;
    }
        
    public void InsertarTipos(int id,String nombre,String nombre_corto,String createdat,String updatedat,int id_empresa){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            rs = stmt.executeQuery("SELECT * FROM TIPO WHERE ID = "+id);

            if (rs.next()) {
                String sql = "UPDATE TIPO SET ID=?,NOMBRE=?,NOMBRE_CORTO=?,CREATEDAT=?,UPDATEDAT=?,ID_EMPRESA=? WHERE id=? ";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setString(2, nombre);
                statement.setString(3, nombre_corto);
                statement.setString(4, createdat);
                statement.setString(5, updatedat);
                statement.setInt(6, id_empresa);
                statement.setInt(7, id);

                statement.executeUpdate();
            } else {
                pstmt = con.prepareStatement("INSERT INTO TIPO(ID,NOMBRE,NOMBRE_CORTO,CREATEDAT,UPDATEDAT,ID_EMPRESA) values(?,?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setString(2, nombre);
                pstmt.setString(3, nombre_corto);
                pstmt.setString(4, createdat);
                pstmt.setString(5, updatedat);
                pstmt.setInt(6, id_empresa);

                pstmt.executeUpdate();
            }

            con.commit();
          //  con.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar los tipos: " + ex);
        }    
    }
    
    public void InsertarTiposConceptos(int id,String nombre,String nombre_corto,String createdat,String updatedat,int id_empresa){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            rs = stmt.executeQuery("SELECT * FROM TIPO WHERE ID = "+id);

            if (rs.next()) {

                String sql = "UPDATE TIPO SET ID=?,NOMBRE=?,NOMBRE_CORTO=?,CREATEDAT=?,UPDATEDAT=?,ID_EMPRESA=? WHERE id=? ";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setString(2, nombre);
                statement.setString(3, nombre_corto);
                statement.setString(4, createdat);
                statement.setString(5, updatedat);
                statement.setInt(6, id_empresa);
                statement.setInt(7, id);

                statement.executeUpdate();
            } else {
                id = id + 1;
                                
                pstmt = con.prepareStatement("INSERT INTO TIPO(ID,NOMBRE,NOMBRE_CORTO,CREATEDAT,UPDATEDAT,ID_EMPRESA) values(?,?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setString(2, nombre);
                pstmt.setString(3, nombre_corto);
                pstmt.setString(4, createdat);
                pstmt.setString(5, updatedat);
                pstmt.setInt(6, id_empresa);

                pstmt.executeUpdate();
            }

            con.commit();
          //  con.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar los tipos: " + ex);
        }    
    }
    
    public void InsertarTiposEmpresaNula(int id,String nombre,String nombre_corto,String createdat,String updatedat){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //java.sql.Statement orden = con.createStatement();
            rs = stmt.executeQuery("SELECT * FROM TIPO WHERE ID = "+id);

            if (rs.next()) {
                String sql = "UPDATE TIPO SET ID=?,NOMBRE=?,NOMBRE_CORTO=?,CREATEDAT=?,UPDATEDAT=? WHERE id=? ";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setString(2, nombre);
                statement.setString(3, nombre_corto);
                statement.setString(4, createdat);
                statement.setString(5, updatedat);
                statement.setInt(6, id);

                statement.executeUpdate();
            } else {
                pstmt = con.prepareStatement("INSERT INTO TIPO(ID,NOMBRE,NOMBRE_CORTO,CREATEDAT,UPDATEDAT) VALUES (?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setString(2, nombre);
                pstmt.setString(3, nombre_corto);
                pstmt.setString(4, createdat);
                pstmt.setString(5, updatedat);

                pstmt.executeUpdate();
            }

            con.commit();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar los tipos: " + ex);
        }    
    }
    
    public void InsertarClases(int id,int id_tipo,String nombre,String nombre_corto,boolean habilitado,String createdat,String updatedat){
    Conectar();
    PreparedStatement pstmt = null;
    java.sql.Statement stmt = null;
    ResultSet rs = null;

    try {
        con.setAutoCommit(false);
        stmt = con.createStatement();
        //java.sql.Statement orden = con.createStatement();
        rs = stmt.executeQuery("SELECT * FROM CLASE WHERE ID = "+id);

        if (rs.next()) {
            String sql = "UPDATE CLASE SET ID=?,ID_TIPO=?,NOMBRE=?,NOMBRE_CORTO=?,HABILITADO=?,CREATEDAT=?,UPDATEDAT=? WHERE id=? ";
            PreparedStatement statement = con.prepareStatement(sql);
            statement.setInt(1, id);
            statement.setInt(2, id_tipo);
            statement.setString(3, nombre);
            statement.setString(4, nombre_corto);
            statement.setBoolean(5, habilitado);
            statement.setString(6, createdat);
            statement.setString(7, updatedat);

            statement.setInt(8, id);

            statement.executeUpdate();
            //System.out.println("SE ACTUALIZO LA TABLA SUCURSAL");
        } else {
           // String insertar = "insert into sucursal(ID, NOMBRE, ID_USUARIO) values(" + id + ",'" + nombre + "'," + id_usuario + ")";
            pstmt = con.prepareStatement("INSERT INTO CLASE(ID,ID_TIPO,NOMBRE,NOMBRE_CORTO,HABILITADO,CREATEDAT,UPDATEDAT) values(?,?,?,?,?,?,?)");
            pstmt.setInt(1, id);
            pstmt.setInt(2, id_tipo);
            pstmt.setString(3, nombre);
            pstmt.setString(4, nombre_corto);
            pstmt.setBoolean(5, habilitado);
            pstmt.setString(6, createdat);
            pstmt.setString(7, updatedat);
            
            pstmt.executeUpdate();
            //   orden.executeUpdate(insertar);
        }
        con.commit();
       // con.close();
    } catch (SQLException ex) {
        System.out.println(ex.getMessage());
        System.out.println("Error al insertar clase: " + ex);
    }    
}
   
    public void InsertarClasesConcepto(int id,int id_tipo,String nombre,String nombre_corto,boolean habilitado,String createdat,String updatedat){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //java.sql.Statement orden = con.createStatement();
            rs = stmt.executeQuery("SELECT * FROM CLASE WHERE ID = "+id);

            if (rs.next()) {
                String sql = "UPDATE CLASE SET ID=?,ID_TIPO=?,NOMBRE=?,NOMBRE_CORTO=?,HABILITADO=?,CREATEDAT=?,UPDATEDAT=? WHERE id=? ";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setInt(2, id_tipo);
                statement.setString(3, nombre);
                statement.setString(4, nombre_corto);
                statement.setBoolean(5, habilitado);
                statement.setString(6, createdat);
                statement.setString(7, updatedat);

                statement.setInt(8, id);

                statement.executeUpdate();
                statement.close();
            } else {
    
                pstmt = con.prepareStatement("INSERT INTO CLASE(ID,ID_TIPO,NOMBRE,NOMBRE_CORTO,HABILITADO,CREATEDAT,UPDATEDAT) values(?,?,?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setInt(2, id_tipo);
                pstmt.setString(3, nombre);
                pstmt.setString(4, nombre_corto);
                pstmt.setBoolean(5, habilitado);
                pstmt.setString(6, createdat);
                pstmt.setString(7, updatedat);

                pstmt.executeUpdate();
                pstmt.close();
                //   orden.executeUpdate(insertar);
            }
            con.commit();
            
           // con.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar clase: " + ex);
        }    
    }
    
    public void insertarEmpresa(String razon_social, String nit,String direccion, int telefono1,int telefono2,int telefono3,int departamente,int municipio,java.sql.Date createdat,java.sql.Date updatedat,boolean usar_panel,boolean vencimiento,boolean servicios,boolean consumo,boolean descuentos,boolean georeferencia, boolean pedidos, boolean pantalla_cliente, boolean pantalla_despacho,boolean mesas,boolean salas, boolean contabilidad, boolean medico, boolean mantenimiento,boolean cuentasAuxuliares,String imagen,boolean eliminar){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //java.sql.Statement orden = con.createStatement();
            
                pstmt = con.prepareStatement("INSERT INTO EMPRESA(RAZON_SOCIAL,NIT,DIRECCION,TELEFONO1,TELEFONO2,TELEFONO3,DEPARTAMENTO,MUNICIPIO,CREATEDAT,UPDATEDAT,USAR_PANEL,USAR_VENCIMIENTOS,USAR_SERVICIOS,USAR_CONSUMOS,USAR_DESCUENTOS,USAR_GEOREFERENCIACION,USAR_PEDIDOS,USAR_PANTALLA_CLIENTE,USAR_PANTALLA_DESPACHO,USAR_MESAS,USAR_SALAS,USAR_CONTABILIDAD,USAR_MEDICO,USAR_MANTENIMIENTO,USAR_CUENTAS_AUXILIARES,IMAGEN,ELIMINADO) "
                        + "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
                pstmt.setString(1, razon_social);
                pstmt.setString(2, nit);
                pstmt.setString(3, direccion);
                pstmt.setInt(4, telefono1);
                pstmt.setInt(5, telefono2);
                pstmt.setInt(6, telefono3);
                pstmt.setInt(7, departamente);
                pstmt.setInt(8, municipio);
                pstmt.setDate(9, createdat);
                pstmt.setDate(10, updatedat);
                pstmt.setBoolean(11, usar_panel);
                pstmt.setBoolean(12, vencimiento);
                pstmt.setBoolean(13, servicios);
                pstmt.setBoolean(14, consumo);
                pstmt.setBoolean(15, descuentos);
                pstmt.setBoolean(16, georeferencia);
                pstmt.setBoolean(17, pedidos);
                pstmt.setBoolean(18, pantalla_cliente);
                pstmt.setBoolean(19, pantalla_despacho);
                pstmt.setBoolean(20, mesas);
                pstmt.setBoolean(21, salas);
                pstmt.setBoolean(22, contabilidad);
                pstmt.setBoolean(23, medico);
                pstmt.setBoolean(24, mantenimiento);
                pstmt.setBoolean(25, cuentasAuxuliares);
                pstmt.setString(26, imagen);
                pstmt.setBoolean(27, eliminar);
                pstmt.executeUpdate();

            con.commit();
           // con.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar la empresa: " + ex);
        }    
    }
    
    public void actualizarEmpresa(int id,String razon_social,String nit,String direccion,int telefono1,int telefono2,int telefono3,int departamente,int municipio,java.sql.Date updatedat,boolean usar_panel,boolean vencimiento,boolean servicios,boolean consumo,boolean descuentos,boolean georeferencia, boolean pedidos, boolean pantalla_cliente, boolean pantalla_despacho,boolean mesas,boolean salas, boolean contabilidad, boolean medico, boolean mantenimiento,boolean cuentasAuxuliares,String imagen,boolean eliminar){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
      
            //con.setAutoCommit(false);
            stmt = con.createStatement();
            //java.sql.Statement orden = con.createStatement();

            String sql = "UPDATE EMPRESA SET RAZON_SOCIAL=?,NIT=?,DIRECCION=?,TELEFONO1=?,TELEFONO2=?,TELEFONO3=?,DEPARTAMENTO=?,MUNICIPIO=?,UPDATEDAT=?,USAR_PANEL=?,USAR_VENCIMIENTOS=?,USAR_SERVICIOS=?,USAR_CONSUMOS=?,USAR_DESCUENTOS=?,USAR_GEOREFERENCIACION=?,USAR_PEDIDOS=?,USAR_PANTALLA_CLIENTE=?,USAR_PANTALLA_DESPACHO=?,USAR_MESAS=?,USAR_SALAS=?,USAR_CONTABILIDAD=?,USAR_MEDICO=?,USAR_MANTENIMIENTO=?,USAR_CUENTAS_AUXILIARES=?,IMAGEN=?,ELIMINADO=? WHERE ID=?";
            PreparedStatement statement = con.prepareStatement(sql);  
       
            statement.setString(1, razon_social);
            statement.setString(2, nit);
            statement.setString(3, direccion);
            statement.setInt(4, telefono1);
            statement.setInt(5, telefono2);
            statement.setInt(6, telefono3);           
            statement.setInt(7, departamente);
            statement.setInt(8, municipio);
            statement.setDate(9, updatedat);
            statement.setBoolean(10, usar_panel);
            statement.setBoolean(11, vencimiento);
            statement.setBoolean(12, servicios);
            statement.setBoolean(13, consumo);
            statement.setBoolean(14, descuentos);
            statement.setBoolean(15, georeferencia);
            statement.setBoolean(16, pedidos);
            statement.setBoolean(17, pantalla_cliente);
            statement.setBoolean(18, pantalla_despacho);
            statement.setBoolean(19, mesas);
            statement.setBoolean(20, salas);
            statement.setBoolean(21, contabilidad);
            statement.setBoolean(22, medico);
            statement.setBoolean(23, mantenimiento);
            statement.setBoolean(24, cuentasAuxuliares);
            statement.setString(25, imagen); 
            statement.setBoolean(26, eliminar);
            statement.setInt(27, id);

            statement.executeUpdate();
            statement.close();
            //con.commit();
           // con.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al actualizar la empresa: " + ex);
            JOptionPane.showMessageDialog(null, "Error al actualizar la empresa");
        }    
    }
        
    public String seleccionarNombreDepartamento(int id){
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        String nombre = "";
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();
            
            String seleccionar = "SELECT NOMBRE FROM CLASE WHERE ID = "+id;
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
                nombre = rs.getString(1);
            }

            con.commit();
            //con.close();
        } catch (Exception e) {
            System.out.println("Error al seleccionar nombre " + e);
        }
        return nombre;
    }
    
    public ArrayList<ListaEmpresasAdmin> seleccionarEmpresa(int id){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;
        ArrayList<ListaEmpresasAdmin> listaEmpresa = new ArrayList();

        try {
             con.setAutoCommit(false);
            stmt = con.createStatement();
            
            String seleccionar = "SELECT * FROM EMPRESA WHERE ID = "+id;
            rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
               
               ListaEmpresasAdmin empresa = new ListaEmpresasAdmin(rs.getInt(1),rs.getString(2),rs.getString(3),rs.getString(4),rs.getInt(5),rs.getInt(6),rs.getInt(7),rs.getInt(8),rs.getInt(9), rs.getDate(10),rs.getDate(11),rs.getBoolean(12),rs.getBoolean(13),rs.getBoolean(14),rs.getBoolean(15),rs.getBoolean(16),rs.getBoolean(17),rs.getBoolean(18),rs.getBoolean(19),rs.getBoolean(20),rs.getBoolean(21),rs.getBoolean(22),rs.getBoolean(23),rs.getBoolean(24),rs.getBoolean(25),rs.getBoolean(26),rs.getString(27));
               listaEmpresa.add(empresa);
            }

            con.commit();
           // con.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar la empresa: " + ex);
        }    
        return listaEmpresa;
    }
    
    public void insertarUsuarioRol(int usuario, int rol,java.sql.Date createdat, java.sql.Date updatedat,boolean eliminado){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
          
            pstmt = con.prepareStatement("INSERT INTO USUARIO_ROL(USUARIO,ROL,CREATEDAT,UPDATEDAT,ELIMINADO) values(?,?,?,?,?)");
            pstmt.setInt(1, usuario);
            pstmt.setInt(2, rol);
            pstmt.setDate(3, createdat);
            pstmt.setDate(4, updatedat);
            pstmt.setBoolean(5, eliminado);
            
            pstmt.executeUpdate();
            //   orden.executeUpdate(insertar);
            
            con.commit();
           // con.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar clase: " + ex);
        }    
    }
    
    public void actualizarUsuarioRol(int id, int usuario, int rol, java.sql.Date updatedat){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            /*con.setAutoCommit(false);*/
            stmt = con.createStatement();
          
            pstmt = con.prepareStatement("UPDATE USUARIO_ROL SET USUARIO=?,ROL=?,UPDATEDAT=? WHERE ID = ?");
            pstmt.setInt(1, usuario);
            pstmt.setInt(2, rol);
            pstmt.setDate(3, updatedat);
            pstmt.setInt(4, id);
            
            pstmt.executeUpdate();
            pstmt.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar clase: " + ex);
        }    
    }
        
    public void insertarUsuarioAplicacion(int usuario, int aplicacion,boolean ver, boolean crear,boolean modificar,boolean eliminar, java.sql.Date createdat, java.sql.Date updatedat){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
          
            pstmt = con.prepareStatement("INSERT INTO USUARIO_APLICACION(USUARIO,APLICACION,PUEDE_VER,PUEDE_CREAR,PUEDE_MODIFICAR,PUEDE_ELIMINAR,CREATEDAT,UPDATEDAT) values(?,?,?,?,?,?,?,?)");
            pstmt.setInt(1, usuario);
            pstmt.setInt(2, aplicacion);
            pstmt.setBoolean(3, ver);
            pstmt.setBoolean(4, crear);
            pstmt.setBoolean(5, modificar);
            pstmt.setBoolean(6, eliminar);                     
            pstmt.setDate(7, createdat);
            pstmt.setDate(8, updatedat);

            pstmt.executeUpdate();
            //   orden.executeUpdate(insertar);
           
            con.commit();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar clase: " + ex);
        }    
    }
        
    public int seleccionarIdRoll(String titulo){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;
        int id = 0;

        try {
             con.setAutoCommit(false);
            stmt = con.createStatement();
            
            String seleccionar = "SELECT ID FROM APLICACION WHERE TITULO = '"+titulo+"'";
            rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
               
               id = rs.getInt(1);
            }
            con.commit();
           // con.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar la empresa: " + ex);
        }    
        return id;
    }
    
    public void insertarUsuarioSursal(int usuario, int sucursal, java.sql.Date createdat, java.sql.Date updatedat,boolean eliminado){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
          
            pstmt = con.prepareStatement("INSERT INTO USUARIO_SUCURSAL(USUARIO,SUCURSAL,CREATEDAT,UPDATEDAT,ELIMINADO) VALUES(?,?,?,?,?)");
            pstmt.setInt(1, usuario);
            pstmt.setInt(2, sucursal);
            pstmt.setDate(3, createdat);
            pstmt.setDate(4, updatedat);
            pstmt.setBoolean(5, eliminado);

            pstmt.executeUpdate();           
            con.commit();
           // con.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar clase: " + ex);
            JOptionPane.showMessageDialog(null, "Error al insertar usuario sucursal.");
        }    
    }
    
    public void insertarUsuarioGrupo(int usuario, int grupo, java.sql.Date createdat, java.sql.Date updatedat,boolean eliminado){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
          
            pstmt = con.prepareStatement("INSERT INTO USUARIO_GRUPOS(USUARIO,GRUPO,CREATEDAT,UPDATEDAT,ELIMINADO) VALUES(?,?,?,?,?)");
            pstmt.setInt(1, usuario);
            pstmt.setInt(2, grupo);
            pstmt.setDate(3, createdat);
            pstmt.setDate(4, updatedat);
            pstmt.setBoolean(5, eliminado);

            pstmt.executeUpdate();           
            con.commit();
           // con.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar usuario grupo: " + ex);
            JOptionPane.showMessageDialog(null, "Error al insertar usuario grupos.");
        }    
    }
        
    public void actualizarPersona(int id,String nombre_completo,String apellido_p,String apellido_m,String nombres,String imagen,boolean eliminado){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
      
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //java.sql.Statement orden = con.createStatement();
            rs = stmt.executeQuery("SELECT * FROM PERSONA WHERE ID = "+id);
            if(rs.next()){
                String sql = "UPDATE PERSONA SET NOMBRE_COMPLETO=?,APELLIDO_PATERNO=?,APELLIDO_MATERNO=?,NOMBRES=?,IMAGEN=? WHERE ID=?";
                PreparedStatement statement = con.prepareStatement(sql);  

                statement.setString(1, nombre_completo);
                statement.setString(2, apellido_p);
                statement.setString(3, apellido_m);
                statement.setString(4, nombres);
                statement.setString(5, imagen);

                statement.setInt(6, id);

                statement.executeUpdate();
                statement.close();
                //con.commit();
               // con.close();
            }else{
                 pstmt = con.prepareStatement("INSERT INTO PERSONA(NOMBRE_COMPLETO,APELLIDO_PATERNO,APELLIDO_MATERNO,NOMBRES,IMAGEN,ELIMINADO) VALUES(?,?,?,?,?,?)");
                pstmt.setString(1, nombre_completo);
                pstmt.setString(2, apellido_p);
                pstmt.setString(3, apellido_m);
                pstmt.setString(4, nombres);
                pstmt.setString(5, imagen);
                pstmt.setBoolean(6, eliminado);
                
                pstmt.executeUpdate();     
            }
            con.commit();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al actualizar la empresa: " + ex);
        }    
    }
    
    public void actualizarUsuario(int id, int persona,int empresa,String nombre_usuario,String clave,String token,boolean activo,String createdat,String updatedat,int comision_general,int comision_activa) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            
            String consulta = "SELECT * FROM USUARIO WHERE ID = "+id;
            rs = stmt.executeQuery(consulta);
            if(rs.next()){
                String sql = "UPDATE USUARIO SET PERSONA=?,EMPRESA=?,NOMBRE_USUARIO=?,CLAVE=?,TOKEN=?,ACTIVO=?,CREATEDAT=?,UPDATEDAT=?,COMISION_GENERAL=?,COMISION_ACTIVA=? WHERE ID=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, persona);
                statement.setInt(2, empresa);
                statement.setString(3, nombre_usuario);    
                statement.setString(4, clave);
                statement.setString(5, token);
                statement.setBoolean(6, activo);
                statement.setString(7,createdat);
                statement.setString(8,updatedat);
                statement.setInt(9, comision_general);
                statement.setInt(10, comision_activa);
                statement.setInt(11, id);

                statement.executeUpdate();
                statement.close();
            }else{
                pstmt = con.prepareStatement("INSERT INTO USUARIO(ID,PERSONA,EMPRESA,NOMBRE_USUARIO,CLAVE,TOKEN,ACTIVO,CREATEDAT,UPDATEDAT,COMISION_GENERAL,COMISION_ACTIVA) values(?,?,?,?,?,?,?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setInt(2, persona);
                pstmt.setInt(3, empresa);
                pstmt.setString(4, nombre_usuario);
                pstmt.setString(5, clave);
                pstmt.setString(6, token);
                pstmt.setBoolean(7,activo);
                pstmt.setString(8, createdat);
                pstmt.setString(9, updatedat);
                pstmt.setInt(10, comision_general);
                pstmt.setInt(11, comision_activa);
                
                pstmt.executeUpdate();
            }    
            con.commit();
        } catch (SQLException ex) {
            System.out.println("Error insertar el usuario: " + ex.getMessage());
        }
    }
    
    public void actualizarUsuarioSucursal(int usuario,int sucursal,java.sql.Date createdat,java.sql.Date updatedat){
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {

            stmt = con.createStatement();
    
            String sql = "UPDATE USUARIO_SUCURSAL SET USUARIO=?,SUCURSAL=?,CREATEDAT=?,UPDATEDAT=? WHERE USUARIO=?";
            PreparedStatement statement = con.prepareStatement(sql);
            statement.setInt(1, usuario);
            statement.setInt(2, sucursal);
            statement.setDate(3, createdat);    
            statement.setDate(4, updatedat);    
            statement.setInt(5, usuario);

            statement.executeUpdate();
            statement.close();
            
        } catch (SQLException ex) {
            System.out.println("Error insertar el usuario: " + ex);
        }
    }
    
    /*public void Agregar_ProductoVO(){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;
        
        String sql = "INSERT INTO producto (idProducto, nombre, precio, marca, foto)\n" +
            "VALUES (NULL,?,?,?,?);";
        PreparedStatement ps = null;
        try{
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, "");
            pstmt.setDouble(2, 1);
            pstmt.setString(3, "");
           // pstmt.setBytes(4, );
            pstmt.executeUpdate();
        }catch(SQLException ex){
            System.out.println("A "+ex.getMessage());
        }catch(Exception ex){
            System.out.println("B "+ex.getMessage());
        }finally{
            try{
                ps.close();
                con.commit();
            }catch(Exception ex){}
        }
    }*/
    
    public void actualizarInfoClase(int id, String nombre, String nombre_corto,java.sql.Date updateat){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {

            stmt = con.createStatement();
     
            pstmt = con.prepareStatement("UPDATE CLASE SET NOMBRE=?,NOMBRE_CORTO=?,UPDATEDAT=? WHERE ID = ?");
            pstmt.setString(1, nombre);
            pstmt.setString(2, nombre_corto);
            pstmt.setDate(3, updateat);
            pstmt.setInt(4, id);

            pstmt.executeUpdate();
            pstmt.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar clase: " + ex);
        }    
    }
    
    public void insertarInfoClase(int id,int id_tipo, String nombre,boolean habilitado, String nombre_corto,java.sql.Date createdat,java.sql.Date updatedat){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            
            con.setAutoCommit(false);
            stmt = con.createStatement();
            
                pstmt = con.prepareStatement("INSERT INTO CLASE(ID,ID_TIPO,NOMBRE,NOMBRE_CORTO,HABILITADO,CREATEDAT,UPDATEDAT) values(?,?,?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setInt(2, id_tipo);
                pstmt.setString(3, nombre);
                pstmt.setString(4, nombre_corto);
                pstmt.setBoolean(5, habilitado);
                pstmt.setDate(6, createdat);
                pstmt.setDate(7, updatedat);

                pstmt.executeUpdate();
           
                pstmt.close();
                con.commit();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar clase: " + ex);
        }    
    }
    
    public void actualizarAlmacenSuc(int id,int sucursal,String nombre,int numero,String direccion,String telefono,java.sql.Date updatedat) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
           // con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            Statement orden = con.createStatement();
            
            stmt = con.createStatement();
            String seleccionar = "SELECT * FROM ALMACEN WHERE ID = "+id;
            rs = stmt.executeQuery(seleccionar);
            if(rs.next()){
                String sql = "UPDATE ALMCEN SET SUCURSAL=?,NOMBRE=?,NUMERO=?,DIRECCION=?,TELEFONO=?,UPDATEDAT=? WHERE ID =?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, sucursal);
                statement.setString(2, nombre);
                statement.setInt(3, numero);
                statement.setString(4, direccion);
                statement.setString(5, telefono);
                statement.setDate(6, updatedat);
                statement.setInt(7, id);
                
                statement.executeUpdate(); 
                statement.close();
            }/*else{
            String insertar = "insert into sucursal(EMPRESA,NOMBRE,NUMERO,DIRECCION,TELEFONO1,TELEFONO2,TELEFONO3,DEPARTAMENTO,MUNICIPIO,CREATEDAT,UPDATEDAT,NOTA_VENTA_CORRELATIVO) VALUES ("+empresa+",'"+nombre+"',"+numero+",'"+direccion+"',"+telefono1+","+telefono2+","+telefono3+","+departamento+","+municipio+",'"+createdat+"','"+updatedat+"',"+nota_venta_correlativa+")";
            orden.executeUpdate(insertar);
            }  */ 
            con.commit();
            //stmt.close();
            //rs.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al actualizar el almacen: " + ex);
        }            
    }
    
    public void insertarAlmacenSuc(int sucursal,String nombre, int numero,String direccion,String telefono,java.sql.Date createdat,java.sql.Date updatedat){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            
            con.setAutoCommit(false);
            stmt = con.createStatement();
            
                pstmt = con.prepareStatement("INSERT INTO ALMACEN(SUCURSAL,NOMBRE,NUMERO,DIRECCION,TELEFONO,CREATEDAT,UPDATEDAT) values(?,?,?,?,?,?,?)");
                pstmt.setInt(1, sucursal);
                pstmt.setString(2, nombre);
                pstmt.setInt(3, numero);
                pstmt.setString(4, direccion);
                pstmt.setString(5, telefono);
                pstmt.setDate(6, createdat);
                pstmt.setDate(7, updatedat);

                pstmt.executeUpdate();        
                pstmt.close();
                con.commit();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar el almacen: " + ex);
        }    
    }
    
    public void insertarSucursalActividadDosificacion(int sucursal,int actividad, int dosificacion, String createdat, String updatedat,boolean expirado){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            
            con.setAutoCommit(false);
            stmt = con.createStatement();
            
                pstmt = con.prepareStatement("INSERT INTO SUCURSAL_ACTIVIDAD_DOSIFICACION(SUCURSAL,ACTIVIDAD,DOSIFICACION,CREATEDAT,UPDATEDAT,EXPIRADO) values(?,?,?,?,?,?)");
                pstmt.setInt(1, sucursal);
                pstmt.setInt(2, actividad);
                pstmt.setInt(3, dosificacion);
                pstmt.setString(4, createdat);
                pstmt.setString(5, updatedat);
                pstmt.setBoolean(6, expirado);
                
                pstmt.executeUpdate();        
                pstmt.close();
                con.commit();
                
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error: " + ex);
            JOptionPane.showMessageDialog(null, "Error al insertar Sucursal Dosificación");
        }    
    }
    
    public void actualizarSucursalActividadDosificacion(int id,int sucursal,int actividad, int dosificacion, String updatedat){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            
           con.setAutoCommit(false);
            stmt = con.createStatement();

            Statement orden = con.createStatement();
            
            stmt = con.createStatement();
            String seleccionar = "SELECT * FROM SUCURSAL_ACTIVIDAD_DOSIFICACION WHERE ID = "+id;
            rs = stmt.executeQuery(seleccionar);
            if(rs.next()){
                String sql = "UPDATE SUCURSAL_ACTIVIDAD_DOSIFICACION SET SUCURSAL=?,ACTIVIDAD=?,DOSIFICACION=?,UPDATEDAT=? WHERE ID =?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, sucursal);
                statement.setInt(2, actividad);
                statement.setInt(3, dosificacion);;
                statement.setString(4, updatedat);
                statement.setInt(5, id);
                
                statement.executeUpdate(); 
                statement.close();
            }
            con.commit();
                
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al actualizar la sucursal dosificacion: " + ex);
        }    
    }
    
    public void insertarProductosProd(int empresa,String nombre,String codigo,String unidad_medida,double precio_unit,double utilidad_esperada,int inventario_min,String descripcion,int grupo,int subGrupo,String caract_esp1,String caract_esp2,String codigo_fabrica,double rangoMax,double rangoMin,java.sql.Date createdat,java.sql.Date updatedat,double comision,boolean publica_panel,int alerta,double descuento,double descuento_fijo,int id_tipo_producto,boolean activar_producto,String marca,String modelo,String anio,int cuenta,boolean eliminado ){
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            /*stmt = con.createStatement();
            String seleccionar = "select id_prod,id_alm from producto where id_prod=" + id_prod + " and id_alm=" + id_almacen;
            rs = stmt.executeQuery(seleccionar);

            if (rs.next()) {
                //System.out.println("Se Encuentra");
                String sql = "UPDATE producto SET  id_prod=?,id_alm=?, nomb_prod=?,unid_medid=?,precio_unit=?,id_grupo=?,id_subgrupos=? WHERE id_prod=? and id_alm=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id_prod);
                statement.setInt(2, id_almacen);
                statement.setString(3, nomb_prod);
                statement.setString(4, unidad_medida);
                statement.setDouble(5, precio_unitario);
                statement.setInt(6, id_grupo);
                statement.setInt(7, id_subgrupos);
                statement.setInt(8, id_prod);
                statement.setInt(9, id_almacen);

                statement.executeUpdate();
                //con.close();
                // System.out.println("Se actualizo la tabla productos");
            } else {*/
                pstmt = con.prepareStatement("INSERT INTO PRODUCTO(EMPRESA,NOMBRE,CODIGO,UNIDAD_MEDIDA,PRECIO_UNITARIO,UNIDAD_ESPERADA,INVENTARIO_MINIMO,DESCRIPCION,GRUPO,SUBGRUPO,CARACTERISTICA_ESPECIAL1,CARACTERISTICA_ESPECIAL2,CODIGO_FABRICA,RANGO_MIN,RANGO_MAX,CREATEDAT,UPDATEDAT,COMISION,PUBLICAR_PANEL,ALERTA,DESCUENTO,DESCUENTO_FIJO,TIPO_PRODUCTO,ACTIVAR_INVENTARIO,MARCA,MODELO,ANIO,CUENTA,ELIMINADO) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
                pstmt.setInt(1, empresa);
                pstmt.setString(2, nombre);
                pstmt.setString(3, codigo);
                pstmt.setString(4, unidad_medida);
                pstmt.setDouble(5, precio_unit);
                pstmt.setDouble(6, utilidad_esperada);
                pstmt.setInt(7, inventario_min);
                pstmt.setString(8, descripcion);
                pstmt.setInt(9, grupo);
                pstmt.setInt(10, subGrupo);
                pstmt.setString(11, caract_esp1);
                pstmt.setString(12, caract_esp2);
                pstmt.setString(13, codigo_fabrica);
                pstmt.setDouble(14, rangoMin);
                pstmt.setDouble(15, rangoMax);
                pstmt.setDate(16, createdat);
                pstmt.setDate(17, updatedat);
                pstmt.setDouble(18, comision);
                pstmt.setBoolean(19, publica_panel);
                pstmt.setInt(20, alerta);
                pstmt.setDouble(21, descuento);
                pstmt.setDouble(22, descuento_fijo);
                pstmt.setInt(23, id_tipo_producto);
                pstmt.setBoolean(24, activar_producto);
                pstmt.setString(25, marca);
                pstmt.setString(26, modelo);
                pstmt.setString(27, anio);
                pstmt.setBoolean(28, eliminado);
                pstmt.setInt(29, cuenta);
                        
                pstmt.executeUpdate();
                //System.out.println("Se Ingresaron los productos");            
           /* }*/
            con.commit();
            con.close();
        } catch (SQLException ex) {
            System.out.println("Error al insertar producto: " + ex);
            System.out.println(ex.getMessage());
            //           System.out.println("nom: " + nomb_prod + " id: " + id_prod);
        }
    }
    
    public void actualizarProductosProd(int id, int empresa,String nombre,String codigo,String unidad_medida,double precio_unit,double utilidad_esperada,int inventario_min,String descripcion,int grupo,int subGrupo,String caract_esp1,String caract_esp2,String codigo_fabrica,double rangoMax,double rangoMin,java.sql.Date updatedat,double comision,boolean publica_panel,int alerta,double descuento,double descuento_fijo,int id_tipo_producto,boolean activar_producto,String marca,String modelo,String anio,int cuenta ){
        Conectar();
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
           // con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
           // String seleccionar = "SELECT * FROM PRODUCTO WHERE ID = "+id;
           // rs = stmt.executeQuery(seleccionar);

                String sql = "UPDATE PRODUCTO SET  EMPRESA=? , NOMBRE=?, CODIGO=?, UNIDAD_MEDIDA=?, PRECIO_UNITARIO=?, UNIDAD_ESPERADA=?, INVENTARIO_MINIMO=?, DESCRIPCION=?, GRUPO=?, SUBGRUPO=?, CARACTERISTICA_ESPECIAL1=?, CARACTERISTICA_ESPECIAL2=?, CODIGO_FABRICA=?, RANGO_MIN=?, RANGO_MAX=?, UPDATEDAT=?, COMISION=?, PUBLICAR_PANEL=?, ALERTA=?, DESCUENTO=?, DESCUENTO_FIJO=?, TIPO_PRODUCTO=?, ACTIVAR_INVENTARIO=?, MARCA=?,MODELO=?, ANIO=?, CUENTA=? WHERE ID = ?";
                PreparedStatement statement = con.prepareStatement(sql);              
                statement.setInt(1, empresa);
                statement.setString(2, nombre);
                statement.setString(3, codigo);
                statement.setString(4, unidad_medida);
                statement.setDouble(5, precio_unit);
                statement.setDouble(6, utilidad_esperada);
                statement.setInt(7, inventario_min);
                statement.setString(8, descripcion);
                statement.setInt(9, grupo);
                statement.setInt(10, subGrupo);
                statement.setString(11, caract_esp1);
                statement.setString(12, caract_esp2);
                statement.setString(13, codigo_fabrica);
                statement.setDouble(14, rangoMin);
                statement.setDouble(15, rangoMax);
                statement.setDate(16, updatedat);
                statement.setDouble(17, comision);
                statement.setBoolean(18, publica_panel);
                statement.setInt(19, alerta);
                statement.setDouble(20, descuento);
                statement.setDouble(21, descuento_fijo);
                statement.setInt(22, id_tipo_producto);
                statement.setBoolean(23, activar_producto);
                statement.setString(24, marca);
                statement.setString(25, modelo);
                statement.setString(26, anio);
                //statement.setInt(27, almacen_erp);
                statement.setInt(27, cuenta);
                statement.setInt(28, id);
                
                statement.executeUpdate();
                statement.close();

            con.commit();
            //con.close();
        } catch (SQLException ex) {
            System.out.println("Error al actualizar producto: " + ex);
            System.out.println(ex.getMessage());
      
        }
    }
    public void insertarImgenProducto(int id, String imagen){
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);          
            stmt = con.createStatement();
            
            String seleccionar = "select * from producto where id = "+id;
            rs = stmt.executeQuery(seleccionar);

            if (rs.next()) {
                
                String sql = "UPDATE PRODUCTO SET IMAGEN=? WHERE ID = ?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setString(1, imagen);
                statement.setInt(2, id);

                statement.executeUpdate();
                statement.close();
            }
            con.commit();
            
        }catch(Exception e){
            System.out.println("Error al insertar la ruta de la imagen "+e);
        }
    }
    
    public void insertarProductosBasePro(int producto,int producto_base, double formulacion, java.sql.Date createdat, java.sql.Date updatedat,boolean eliminado){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {       
            con.setAutoCommit(false);
            stmt = con.createStatement();
            
            pstmt = con.prepareStatement("INSERT INTO PRODUCTO_BASE (PRODUCTO,PRODUCTO_BASE,FORMULACION,CREATEDAT,UPDATEDAT,ELIMINADO) values(?,?,?,?,?,?)");
            pstmt.setInt(1, producto);
            pstmt.setInt(2, producto_base);
            pstmt.setDouble(3, formulacion);
            pstmt.setDate(4, createdat);
            pstmt.setDate(5, updatedat);
            pstmt.setBoolean(6, eliminado);
            
            pstmt.executeUpdate();        
            //pstmt.close();
            con.commit();
                
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar el producto base: " + ex);
            JOptionPane.showMessageDialog(null, "Error al insertar el producto base!");
        }    
    }
    
    public void actualizarProductosBasePro(int id,int producto,int producto_base, double formulacion,java.sql.Date createdat, java.sql.Date updatedat){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {       
            con.setAutoCommit(false);
            stmt = con.createStatement();
            
            String seleccionar = "SELECT * FROM PRODUCTO_BASE WHERE ID = "+id;
            rs = stmt.executeQuery(seleccionar);

            if (rs.next()) {
                
                String sql = "UPDATE PRODUCTO_BASE SET PRODUCTO=?,PRODUCTO_BASE=?,FORMULACION=?,UPDATEDAT=? WHERE ID = ?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, producto);
                statement.setInt(2, producto_base);
                statement.setDouble(3, formulacion);
                statement.setDate(4, updatedat);
                
                statement.setInt(5, id);

                statement.executeUpdate();        
                statement.close();
            }else{
                pstmt = con.prepareStatement("INSERT INTO PRODUCTO(PRODUCTO,PRODUCTO_BASE,FORMULACION,CREATEDAT,UPDATEDAT) VALUES(?,?,?,?,?)");
                pstmt.setInt(1, producto);
                pstmt.setInt(2, producto_base);
                pstmt.setDouble(3, formulacion);
                pstmt.setDate(4, createdat);
                pstmt.setDate(5, updatedat);
                
                pstmt.executeUpdate();
                pstmt.close();
            }
            
            con.commit();
                
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al actualizar el producto base: " + ex);
        }    
    }
    
    public ArrayList<listaSucursal> seleccionarProductos(int id_producto){
        Conectar();
        java.sql.Statement stmt = null;
        ResultSet rs = null;
        ArrayList<listaSucursal> lista = new ArrayList();
        try {       
            con.setAutoCommit(false);
            stmt = con.createStatement();
          
           
            String consulta = "SELECT P.CODIGO,P.NOMBRE,P.UNIDAD_MEDIDA,P.PRECIO_UNITARIO,P.RANGO_MAX,P.RANGO_MIN,P.DESCRIPCION,\n" +
                "P.IMAGEN,P.PUBLICAR_PANEL,P.ACTIVAR_INVENTARIO,P.INVENTARIO_MINIMO,P.GRUPO,P.SUBGRUPO,\n" +
                "P.CARACTERISTICA_ESPECIAL1,P.CARACTERISTICA_ESPECIAL2,P.MARCA,P.MODELO,P.ANIO,P.CODIGO_FABRICA,\n" +
                "P.COMISION,P.ALERTA,P.DESCUENTO,P.DESCUENTO_FIJO,P.TIPO_PRODUCTO,P.ALMACEN_ERP,P.CUENTA\n" +
                "FROM PRODUCTO AS P\n" +
                "WHERE P.ID = "+id_producto;
             rs = stmt.executeQuery(consulta);
             
             while(rs.next()){
                 listaSucursal listaSucursal = new listaSucursal(rs.getString(1),rs.getString(2),rs.getString(3),rs.getDouble(4),
                         rs.getDouble(5),rs.getDouble(6),rs.getString(7),rs.getString(8),rs.getBoolean(9),rs.getBoolean(10)
                         ,rs.getInt(11),rs.getInt(12),rs.getInt(13),rs.getString(14),rs.getString(15),rs.getString(16),
                         rs.getString(17),rs.getString(18),rs.getString(19),rs.getDouble(20),rs.getInt(21),
                         rs.getDouble(22),rs.getDouble(23),rs.getInt(24),rs.getInt(25),rs.getInt(26));
                 
                 lista.add(listaSucursal);
             }
             con.commit();
        }catch(Exception e){
            System.out.println("Error "+e);
        }
        
        return lista;
    }
    
    public void actualizarPanelTabla(int id, boolean panel){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            /*con.setAutoCommit(false);*/
            stmt = con.createStatement();
          
            pstmt = con.prepareStatement("UPDATE PRODUCTO SET PUBLICAR_PANEL = ? WHERE ID = ?");
            pstmt.setBoolean(1, panel);
            pstmt.setInt(2, id);
  
            
            pstmt.executeUpdate();
            pstmt.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error actualizar panel de tabla productos clase: " + ex);
        }  
    }
    
    public void actualizarActivarInventaTabla(int id, boolean inventario){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            /*con.setAutoCommit(false);*/
            stmt = con.createStatement();
          
            pstmt = con.prepareStatement("UPDATE PRODUCTO SET ACTIVAR_INVENTARIO = ? WHERE ID = ?");
            pstmt.setBoolean(1, inventario);
            pstmt.setInt(2, id);
  
            
            pstmt.executeUpdate();
            pstmt.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error actualizar activar inventario de tabla productos clase: " + ex);
        }  
    }
    
    public List<listaDatosCorrelativos> seleccionarDatosCorrelativosSucu(int id_sucursal,int id_usuario) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<listaDatosCorrelativos> lista = new ArrayList();
        try {
           // con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            Statement orden = con.createStatement();
            
            stmt = con.createStatement();
            String seleccionar = "SELECT S.NOTA_VENTA_CORRELATIVO,S.NOTA_TRASPASO_CORRELATIVO,S.NOTA_BAJA_CORRELATIVO,\n" +
                "S.PEDIDO_CORRELATIVO,S.COTIZACION_CORRELATIVO,S.PRE_FACTURA_CORRELATIVO,S.DESPACHO_CORRELATIVO,\n" +
                "S.DESPACHO_RECIBO_CORRELATIVO,S.ROPA_TRABAJO_CORRELATIVO,S.COMPROBANTE_INGRESO_CORRELATIVO,\n" +
                "S.REINICIAR_COMPROBANTE_INGRESO_CORRELATIVO,S.COMPROBANTE_EGRESO_CORRELATIVO,S.REINICIAR_COMPROBANTE_EGRESO_CORRELATIVO,\n" +
                "S.COMPROBANTE_TRASPASO_CORRELATIVO,S.REINICIAR_COMPROBANTE_TRASPASO_CORRELATIVO,S.COMPROBANTE_CAJA_CHICA_CORRELATIVO,\n" +
                "S.REINICIAR_COMPROBANTE_CAJA_CHICA_CORRELATIVO,S.NOTA_VENTA_FARMACIA_CORRELATIVO,S.FRASE_PEDIDO,S.COPIAS_IMPRESION_PEDIDO,\n" +
                "S.IMPRIMIR_PEDIDO_CORTO \n" +
                "FROM USUARIO AS U\n" +
                "INNER JOIN SUCURSAL AS S ON U.EMPRESA = S.EMPRESA\n" +
                "WHERE U.ID = "+id_usuario+" AND S.ID = "+id_sucursal;
            rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {    
                int nota_venta_corre = rs.getInt(1);
                int nota_traspa_corre = rs.getInt(2);
                int nota_baja_corre = rs.getInt(3);
                int nota_pedido_corre = rs.getInt(4);
                int nota_cotizacion_corre = rs.getInt(5);
                int nota_preFactura_corre = rs.getInt(6);
                int nota_despacho_corre = rs.getInt(7);
                int nota_despacho_recibo_corre = rs.getInt(8);
                int ropa_trabajo_corre = rs.getInt(9);
                int compro_ingreso_corre = rs.getInt(10);
                boolean renicio_ingreso = rs.getBoolean(11);
                int compro_egreso_corre = rs.getInt(12);
                boolean reinicio_egreso = rs.getBoolean(13);
                int compro_traspaso_corre = rs.getInt(14);
                boolean reinicio_traspaso = rs.getBoolean(15);
                int compro_caja_chica_corre = rs.getInt(16);
                boolean reinicio_caja_chica = rs.getBoolean(17);
                int nota_venta_farmacia = rs.getInt(18);
                String frase = rs.getString(19);
                int copias_impre_pedido = rs.getInt(20);
                boolean impre_pedido_corto = rs.getBoolean(21);
                
                listaDatosCorrelativos datos = new listaDatosCorrelativos(nota_venta_corre,nota_traspa_corre,
                        nota_baja_corre,nota_pedido_corre,nota_cotizacion_corre,nota_preFactura_corre,nota_despacho_corre,
                        nota_despacho_recibo_corre,ropa_trabajo_corre,compro_ingreso_corre,renicio_ingreso,
                        compro_egreso_corre,reinicio_egreso,compro_traspaso_corre,reinicio_traspaso,compro_caja_chica_corre,
                        reinicio_caja_chica,nota_venta_farmacia,frase,copias_impre_pedido,impre_pedido_corto);
                
                lista.add(datos);
            }
           
            
            con.commit();
            //stmt.close();
            //rs.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al actualizar las sucursales: " + ex);
        } 
        return lista;
    }
    
    public void actualizarDosificaciones(int id,int empresa, BigDecimal autori, int correla,java.sql.Date fechaLimi,String llaveDigi,java.sql.Date updatedat,int piefaactura, boolean expirado){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            /*con.setAutoCommit(false);*/
            stmt = con.createStatement();
          
            pstmt = con.prepareStatement("UPDATE DOSIFICACION SET EMPRESA=?,AUTORIZACION=?,CORRELATIVO=?,FEHCA_LIMITE_EMISION=?,LLAVE_DIGITAL=?,UPDATEDAT=?,PIE_FACTURA=?,EXPIRADO=? WHERE ID = ?");
            pstmt.setInt(1, empresa);
            pstmt.setBigDecimal(2, autori);
            pstmt.setInt(3, correla);
            pstmt.setDate(4, fechaLimi);
            pstmt.setString(5,llaveDigi);
            pstmt.setDate(6, updatedat);
            pstmt.setInt(7, piefaactura);
            pstmt.setBoolean(8, expirado);
            pstmt.setInt(9, id);
            
            
            pstmt.executeUpdate();
            pstmt.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error actualizar dosificaciones: " + ex);
        }  
    } 

    public void insertarEmpresaAplicacion(int empresa,int aplicacion, java.sql.Date createdat, java.sql.Date updatedat){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            
            con.setAutoCommit(false);
            stmt = con.createStatement();
            
            pstmt = con.prepareStatement("INSERT INTO EMPRESA_APLICACION (EMPRESA,APLICACION,CREATEDAT,UPDATEDAT) values(?,?,?,?)");
            pstmt.setInt(1, empresa);
            pstmt.setInt(2, aplicacion);
            pstmt.setDate(3, createdat);
            pstmt.setDate(4, updatedat);

            pstmt.executeUpdate();        
            con.commit();
                
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error: " + ex);
            JOptionPane.showMessageDialog(null, "Error al insertar Empresa Aplicacion");
        }    
    }
        
    public void insertarConfigGeneralFactura(int empresa,boolean usar, java.sql.Date createdat,java.sql.Date updatedat,boolean usarPF, boolean imprimirGuardar){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {       
            con.setAutoCommit(false);
            stmt = con.createStatement();
       
            pstmt = con.prepareStatement("INSERT INTO CONFIGURACION_GENERAL_FACTURA(EMPRESA,USAR,CREATEDAT,UPDATEDAT,USAR_PF,IMPRIMIR_AL_GUARDAR) VALUES(?,?,?,?,?,?)");
            pstmt.setInt(1, empresa);
            pstmt.setBoolean(2, usar);
            pstmt.setDate(3, createdat);
            pstmt.setDate(4, updatedat);
            pstmt.setBoolean(5, usarPF);
            pstmt.setBoolean(6, imprimirGuardar);
            
            pstmt.executeUpdate();
    
            con.commit();
                
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al actualizar el producto base: " + ex);
        }    
    }

    public void actualizarConfigGeneralFactura(int id,int empresa, int imprimir,int tipo,int tamano, int titulo,int subTitulo, boolean usar,boolean usarPF,boolean imprimirGuardar, java.sql.Date updatedat,int notaVenta, int notaTraspaso,int notaBaja, int notaPedido,int cierreCaja,int cotizacion){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            /*con.setAutoCommit(false);*/
            stmt = con.createStatement();
          
            pstmt = con.prepareStatement("UPDATE CONFIGURACION_GENERAL_FACTURA SET EMPRESA=?,IMPRESION_FACTURA=?,TIPO_FACTURA=?,TAMANO_PAPEL_FACTURA=?,TITULO_FACTURA=?,SUBTITULO_FACTURA=?,USAR=?,UPDATEDAT=?,USAR_PF=?,IMPRIMIR_AL_GUARDAR=?,TAMANO_PAPEL_NOTA_VENTA=?,TAMANO_PAPEL_NOTA_TRASPASO=?,TAMANO_PAPEL_NOTA_BAJA=?,TAMANO_PAPEL_NOTA_PEDIDO=?,TAMANO_PAPEL_CIERRE_CAJA=?,TAMANO_PAPEL_COTIZACION=? WHERE ID = ?");
            pstmt.setInt(1, empresa);
            pstmt.setInt(2, imprimir);
            pstmt.setInt(3, tipo);
            pstmt.setInt(4, tamano);
            pstmt.setInt(5,titulo);
            pstmt.setInt(6, subTitulo);
            pstmt.setBoolean(7, usar);
            pstmt.setDate(8, updatedat);
            pstmt.setBoolean(9, usarPF);
            pstmt.setBoolean(10, imprimirGuardar);
            pstmt.setInt(11, notaVenta);
            pstmt.setInt(12, notaTraspaso);
            pstmt.setInt(13, notaBaja);
            pstmt.setInt(14, notaPedido);
            pstmt.setInt(15, cierreCaja);
            pstmt.setInt(16,cotizacion);
            
            pstmt.setInt(17,id);      
            
            pstmt.executeUpdate();
            pstmt.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error actualizar la facturacion general: " + ex);
            JOptionPane.showMessageDialog(null, "Error al actualizar la formulacion general.");
        }  
    } 
     
     public void insertarConfigFactura(int sucursal,boolean usarPF,boolean imprimiGuardar,java.sql.Date createdat,java.sql.Date updatedat){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {       
            con.setAutoCommit(false);
            stmt = con.createStatement();
       
            pstmt = con.prepareStatement("INSERT INTO CONFIGURACION_FACTURA(SUCURSAL,USAR_PF,IMPRIMIR_AL_GUARDAR,CREATEDAT,UPDATEDAT) VALUES(?,?,?,?,?)");
            pstmt.setInt(1, sucursal);
            pstmt.setBoolean(2, usarPF);
            pstmt.setBoolean(3, imprimiGuardar);
            pstmt.setDate(4, createdat);
            pstmt.setDate(5, updatedat);

            pstmt.executeUpdate();
    
            con.commit();
                
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al actualizar el producto base: " + ex);
            JOptionPane.showMessageDialog(null, "Error al insertar configuracion de la factura sucursal");
        }    
    }
     
    public void actualizarConfigFactura(int id, int imprimir,int tipo,int tamano, int titulo,int subTitulo,boolean usarPF,boolean imprimirGuardar, java.sql.Date updatedat,int notaVenta, int notaTraspaso,int notaBaja, int notaPedido,int cierreCaja,int cotizacion){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            /*con.setAutoCommit(false);*/
            stmt = con.createStatement();
          
            pstmt = con.prepareStatement("UPDATE CONFIGURACION_FACTURA SET IMPRESION_FACTURA=?,TIPO_FACTURACION=?,TAMANO_PAPEL_FACTURA=?,TITULO_FACTURA=?,SUBTITULO_FACTURA=?,UPDATEDAT=?,USAR_PF=?,IMPRIMIR_AL_GUARDAR=?,TAMANO_PAPEL_NOTA_VENTA=?,TAMANO_PAPEL_NOTA_TRASPASO=?,TAMANO_PAPEL_NOTA_BAJA=?,TAMANO_PAPEL_NOTA_PEDIDO=?,TAMANO_PAPEL_CIERRE_CAJA=?,TAMANO_PAPEL_COTIZACION=? WHERE ID = ?");
            pstmt.setInt(1, imprimir);
            pstmt.setInt(2, tipo);
            pstmt.setInt(3, tamano);
            pstmt.setInt(4,titulo);
            pstmt.setInt(5, subTitulo);
            pstmt.setDate(6, updatedat);
            pstmt.setBoolean(7, usarPF);
            pstmt.setBoolean(8, imprimirGuardar);
            pstmt.setInt(9, notaVenta);
            pstmt.setInt(10, notaTraspaso);
            pstmt.setInt(11, notaBaja);
            pstmt.setInt(12, notaPedido);
            pstmt.setInt(13, cierreCaja);
            pstmt.setInt(14,cotizacion);
            
            pstmt.setInt(15,id);      
            
            pstmt.executeUpdate();
            pstmt.close();
            
            con.commit();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error actualizar la facturacion: " + ex);
            JOptionPane.showMessageDialog(null, "Error al actualizar la formulacion.");
        }  
    }
    
    public void actualizarSucursalDatosCorrelativos(int id,int nota_venta_corre,int nota_traspaso_corre,int nota_baja_corre,int nota_pedido_corre,int copias_imprimir_pedido,String frase,int nota_cotizacion_corre,int preFactura,int compro_ingreso,int compro_egreso,int compro_traspa,int compro_caja_chica,int nota_venta_farmacia,int nota_despa_corre,int ropa_trabajo_corre,boolean reinicio_ingreso,boolean reinicio_traspaso,boolean reinicio_egreso,boolean reinicio_caja_chica,boolean imprimir_pedido_corto,int despacho_recibo_corre) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            
            String sql = "UPDATE SUCURSAL SET NOTA_VENTA_CORRELATIVO=?,NOTA_TRASPASO_CORRELATIVO=?,NOTA_BAJA_CORRELATIVO=?,PEDIDO_CORRELATIVO=?,COPIAS_IMPRESION_PEDIDO=?,FRASE_PEDIDO=?,COTIZACION_CORRELATIVO=?,PRE_FACTURA_CORRELATIVO=?,COMPROBANTE_INGRESO_CORRELATIVO=?,COMPROBANTE_EGRESO_CORRELATIVO=?,COMPROBANTE_TRASPASO_CORRELATIVO=?,COMPROBANTE_CAJA_CHICA_CORRELATIVO=?,NOTA_VENTA_FARMACIA_CORRELATIVO=?,DESPACHO_CORRELATIVO=?,ROPA_TRABAJO_CORRELATIVO=?,REINICIAR_COMPROBANTE_INGRESO_CORRELATIVO=?,REINICIAR_COMPROBANTE_TRASPASO_CORRELATIVO=?,REINICIAR_COMPROBANTE_EGRESO_CORRELATIVO=?,REINICIAR_COMPROBANTE_CAJA_CHICA_CORRELATIVO=?,IMPRIMIR_PEDIDO_CORTO=?,DESPACHO_RECIBO_CORRELATIVO=? WHERE ID=?";
            PreparedStatement statement = con.prepareStatement(sql);
            statement.setInt(1, nota_venta_corre);
            statement.setInt(2, nota_traspaso_corre);
            statement.setInt(3, nota_baja_corre);
            statement.setInt(4, nota_pedido_corre);
            statement.setInt(5, copias_imprimir_pedido);
            statement.setString(6, frase);
            statement.setInt(7, nota_cotizacion_corre);
            statement.setInt(8, preFactura);
            statement.setInt(9, compro_ingreso);
            statement.setInt(10, compro_egreso);
            statement.setInt(11, compro_traspa);
            statement.setInt(12, compro_caja_chica);
            statement.setInt(13, nota_venta_farmacia);
            statement.setInt(14, nota_despa_corre);
            statement.setInt(15, ropa_trabajo_corre);
            statement.setBoolean(16, reinicio_ingreso);
            statement.setBoolean(17, reinicio_traspaso);
            statement.setBoolean(18, reinicio_egreso);
            statement.setBoolean(19, reinicio_caja_chica);
            statement.setBoolean(20, imprimir_pedido_corto);
            statement.setInt(21, despacho_recibo_corre);

            statement.setInt(22, id);

            statement.executeUpdate(); 
            statement.close();

            //con.commit();
   
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al actualizar las sucursales datos correlativos: " + ex);
        }            
    }
    
     public void actualizarFacturaSucursalDatosCorrelativo(int sucursal, int nota_venta,int nota_traspaso,int nota_baja, int nota_pedido,int cierre_caja,java.sql.Date updatedat){
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            /*con.setAutoCommit(false);*/
            stmt = con.createStatement();
          
            pstmt = con.prepareStatement("UPDATE CONFIGURACION_FACTURA SET TAMANO_PAPEL_NOTA_VENTA=?,TAMANO_PAPEL_NOTA_TRASPASO=?,TAMANO_PAPEL_NOTA_BAJA=?,TAMANO_PAPEL_NOTA_PEDIDO=?,TAMANO_PAPEL_CIERRE_CAJA=?,UPDATEDAT=? WHERE SUCURSAL = ?");
            pstmt.setInt(1, nota_venta);
            pstmt.setInt(2, nota_traspaso);
            pstmt.setInt(3, nota_baja);
            pstmt.setInt(4,nota_pedido);
            pstmt.setInt(5, cierre_caja);
            pstmt.setDate(6, updatedat);         
            
            pstmt.setInt(7,sucursal);      
            
            pstmt.executeUpdate();
            pstmt.close();
            
            con.commit();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error actualizar la sucrusal factura dosificacion: " + ex);
            JOptionPane.showMessageDialog(null, "Error al actualizar la formulacion.");
        }  
    }
     
    public void insertarInvInventario(int almacen, int producto, double cantidad, double costoUnitario, double costoTotal, java.sql.Date createdat,java.sql.Date updatedat,java.sql.Date fechaVencimiento, String lote) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
           
            pstmt = con.prepareStatement("INSERT INTO INV_INVENTARIO(ALMACEN,PRODUCTO,CANTIDAD,COSTO_UNITARIO,COSTO_TOATAL,CREATEDAT,UPDATEDAT,FECHA_VENCIMIENTO,LOTE) values(?,?,?,?,?,?,?,?,?)");
      
            pstmt.setInt(1, almacen);
            pstmt.setInt(2, producto);
            pstmt.setDouble(3, cantidad);
            pstmt.setDouble(4, costoUnitario);
            pstmt.setDouble(5, costoTotal);
            pstmt.setDate(6, createdat);
            pstmt.setDate(7, updatedat);
            pstmt.setDate(8, fechaVencimiento);
            pstmt.setString(9, lote);

            pstmt.executeUpdate();
            
            con.commit();
           
        } catch (SQLException ex) {
            System.out.println("Error al insertar inventario: " + ex);
        }
    }
    
    public void insertarInvInventarioSinFechaLimite(int almacen, int producto, double cantidad, double costoUnitario, double costoTotal, java.sql.Date createdat,java.sql.Date updatedat,String lote) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
           
            pstmt = con.prepareStatement("INSERT INTO INV_INVENTARIO(ALMACEN,PRODUCTO,CANTIDAD,COSTO_UNITARIO,COSTO_TOATAL,CREATEDAT,UPDATEDAT,LOTE) values(?,?,?,?,?,?,?,?)");
      
            pstmt.setInt(1, almacen);
            pstmt.setInt(2, producto);
            pstmt.setDouble(3, cantidad);
            pstmt.setDouble(4, costoUnitario);
            pstmt.setDouble(5, costoTotal);
            pstmt.setDate(6, createdat);
            pstmt.setDate(7, updatedat);
            pstmt.setString(8, lote);

            pstmt.executeUpdate();
            
            con.commit();
           
        } catch (SQLException ex) {
            System.out.println("Error al insertar inventario: " + ex);
        }
    }
    
    public void insertarInvMovimiento(int tipo, int clase, int almacen,java.sql.Date fecha,java.sql.Date createdat,java.sql.Date updatedat) {
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
           
            pstmt = con.prepareStatement("INSERT INTO INV_MOVIMIENTO(TIPO,CLASE,ALMACEN,FECHA,CREATEDAT,UPDATEDAT) values(?,?,?,?,?,?)");
      
            pstmt.setInt(1, tipo);
            pstmt.setInt(2, clase);
            pstmt.setInt(3, almacen);
            pstmt.setDate(4, fecha);
            pstmt.setDate(5, createdat);
            pstmt.setDate(6, updatedat);;

            pstmt.executeUpdate();
            
            con.commit();
           
        } catch (SQLException ex) {
            System.out.println("Error al insertar inventario: " + ex);
            ex.printStackTrace(System.out);
            try {
                con.rollback((Savepoint) pstmt);
            } catch (SQLException ex1) {
                Logger.getLogger(Database.class.getName()).log(Level.SEVERE, null, ex1);
            }
        }
    }
    
    public void insertarDetalleMovimiento(int producto, int movimiento, double costoUnitario, double cantidad, double importe,double descuento,double recargo,double ice,double excento,boolean tipoDescu,boolean tipoRecargo,double total,java.sql.Date createdat,java.sql.Date updatedat,java.sql.Date fechaVencimiento, int inventario) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
           
            pstmt = con.prepareStatement("INSERT INTO INV_DETALLE_MOVIMIENTO(PRODUCTO,MOVIMIENTO,COSTO_UNITARIO,CANTIDAD,IMPORTE,DESCUENTO,RECARGO,ICE,EXCENTO,TOTAL,CREATEDAT,UPDATEDAT,FECHA_VENCIMIENTO,INVENTARIO) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
      
            pstmt.setInt(1, producto);
            pstmt.setInt(2, movimiento);
            pstmt.setDouble(3, costoUnitario);
            pstmt.setDouble(4, cantidad);
            pstmt.setDouble(5, importe);
            pstmt.setDouble(6, descuento);
            pstmt.setDouble(7, recargo);
            pstmt.setDouble(8, ice);
            pstmt.setDouble(9, excento);
            pstmt.setDouble(10, total);
            pstmt.setDate(11, createdat);
            pstmt.setDate(12, updatedat);
            pstmt.setDate(13, fechaVencimiento);
            pstmt.setInt(14, inventario);

            pstmt.executeUpdate();
            
            con.commit();
           
        } catch (SQLException ex) {
            System.out.println("Error al insertar inventario: " + ex);
        }
    }
    
    public void insertarProveedor(int empresa,String codigo,String razonSocial,String nit,String direccion,String telefono1,String telefono2,String telefono3,String contacto,String rubro,String categoria,java.sql.Date fecha1,java.sql.Date fecha2,String texto1,String texto2,java.sql.Date createdat,java.sql.Date updatedat,String documento_nit,String documento_fundaEmpre,String documento_ci,String documento_licen,String documento_seguro) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
           
            pstmt = con.prepareStatement("INSERT INTO PROVEEDOR(EMPRESA,CODIGO,RAZON_SOCIAL,NIT,DIRECCION,TELEFONO1,TELEFONO2,TELEFONO3,CONTACTO,RUBRO,CATEGORIA,FECHA1,FECHA2,TEXTO1,TEXTO2,CREATEDAT,UPDATEDAT,DOCUMENTO_NIT,DOCUMENTO_FUNDA_EMPRESA,DOCUMENTO_CI,DOCUMENTO_LICENCIA_FUNCIONAMIENTO,DOCUMENTO_SUGURO_SOCIAL) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
      
            pstmt.setInt(1, empresa);
            pstmt.setString(2, codigo);
            pstmt.setString(3, razonSocial);
            pstmt.setString(4, nit);
            pstmt.setString(5, direccion);
            pstmt.setString(6, telefono1);
            pstmt.setString(7, telefono2);
            pstmt.setString(8, telefono3);
            pstmt.setString(9, contacto);
            pstmt.setString(10, rubro);
            pstmt.setString(11, categoria);
            pstmt.setDate(12, fecha1);
            pstmt.setDate(13, fecha2);
            pstmt.setString(14, texto1);
            pstmt.setString(15, texto2);
            pstmt.setDate(16, createdat);
            pstmt.setDate(17, updatedat);
            pstmt.setString(18, documento_nit);
            pstmt.setString(19, documento_fundaEmpre);
            pstmt.setString(20, documento_ci);
            pstmt.setString(21, documento_licen);
            pstmt.setString(22, documento_seguro);

            pstmt.executeUpdate();
            
            con.commit();
           
        } catch (SQLException ex) {
            System.out.println("Error al insertar al proveedor: " + ex);
        }
    }
    
    public void insertarCompra(int almacen,int proveedor,int movimiento,java.math.BigInteger factura,java.math.BigInteger autorizacion,java.sql.Date fecha,String codigoControl,double importe,int tipoPago,int dias,double aCuenta,double saldo,boolean descGene,double descuento,double recarga,double ice,double excento,boolean tipoDescuento, boolean tipoRecargo,double total,java.sql.Date createdat,java.sql.Date updatedut,int cierreCaja,int usuario,int contabilidad) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
           
            pstmt = con.prepareStatement("INSERT INTO COMPRA(ALMACEN,PROVEEDOR,MOVIMIENTO,FACTURA,AUTORIACION,FECHA,CODIGO_CONTROL,IMPORTE,TIPO_PAGO,DIAS_CREDITO,A_CUENTA,SALDO,DESCUENTO_GENERAL,DESCUENTO,RECARGA,ICE,EXCENTO,TIPO_DESCUENTO,TIPO_RECARGO,TOTAL,CREATEDAT,UPDATEDAT,CIERRE_CAJA,USUARIO,CONTABILIZADO) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
      
            pstmt.setInt(1, almacen);
            pstmt.setInt(2, proveedor);
            pstmt.setInt(3, movimiento);
            pstmt.setBigDecimal(4, new java.math.BigDecimal(factura));
            pstmt.setBigDecimal(5, new java.math.BigDecimal(autorizacion));
            pstmt.setDate(6, fecha);
            pstmt.setString(7, codigoControl);
            pstmt.setDouble(8, importe);
            pstmt.setInt(9, tipoPago);
            pstmt.setInt(10, dias);
            pstmt.setDouble(11, aCuenta);
            pstmt.setDouble(12, saldo);
            pstmt.setBoolean(13, descGene);
            pstmt.setDouble(14, descuento);
            pstmt.setDouble(15, recarga);
            pstmt.setDouble(16, ice);
            pstmt.setDouble(17, excento);
            pstmt.setBoolean(18, tipoDescuento);
            pstmt.setBoolean(19, tipoRecargo);
            pstmt.setDouble(20, total);
            pstmt.setDate(21, createdat);
            pstmt.setDate(22, updatedut);
            pstmt.setInt(23, cierreCaja);
            pstmt.setInt(24, usuario);
            pstmt.setInt(25, contabilidad);
            
            pstmt.executeUpdate();
            
            con.commit();
           
        } catch (SQLException ex) {
            System.out.println("Error al insertar al proveedor: " + ex);
        }
    }
    
    public void insertarDetalleCompra(int compra,int producto,int centro_costo,double costo_unitario,double cantidad,double importe,double descuento,double recargo,double ice, double excento,boolean tipo_descuento,boolean tipo_recargo,double total,java.sql.Date createdat,java.sql.Date updatedut,int inventario) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        boolean valor = false;
        try {
            //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
            con.setAutoCommit(false);
            Statement orden = con.createStatement();
            stmt = con.createStatement();
           
            pstmt = con.prepareStatement("INSERT INTO INV_DETALLE_COMPRA(COMPRA,PRODUCTO,CENTRO_COSTO,COSTO_UNITARIO,CANTIDAD,IMPORTE,DESCUENTO,RECARGO,ICE,EXCENTO,TIPO_DESCUENTO,TIPO_RECARGO,TOTAL,CREATEDAT,UPDATEDAT,INVENTARIO) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
      
            pstmt.setInt(1, compra);
            pstmt.setInt(2, producto);
            pstmt.setInt(3, centro_costo);
            pstmt.setDouble(4, costo_unitario);
            pstmt.setDouble(5, cantidad);
            pstmt.setDouble(6, importe);
            pstmt.setDouble(7, descuento);
            pstmt.setDouble(8, recargo);
            pstmt.setDouble(9, ice);
            pstmt.setDouble(10, excento);
            pstmt.setBoolean(11, tipo_descuento);
            pstmt.setBoolean(12, tipo_recargo);
            pstmt.setDouble(13, total);
            pstmt.setDate(14, createdat);
            pstmt.setDate(15, updatedut);
            pstmt.setInt(16, inventario);
            
            pstmt.executeUpdate();
            
            con.commit();
           
        } catch (SQLException ex) {
            System.out.println("Error al insertar detalle de compra: " + ex);
        }
    }
    
     /* public static void main(String args[]){
        Database d = new Database();
        d.Conectar();
        //d.insertarSucursal(3, "edson");
    }*/

}
