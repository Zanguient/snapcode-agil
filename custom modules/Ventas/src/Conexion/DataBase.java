/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Conexion;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;
import Modelos.*;

/**
 *
 * @author AGIL
 */
public class DataBase {

    public Connection con = null;
    Connection con2;

    /**
     * public void cerrarCon(){
     *
     *
     */
    /*public void Conectar() {
        PreparedStatement pstmt;
        java.sql.Statement stmt;
        ResultSet rs = null;
        try {*/
 /*String createSQL = "create table sucursal ("
            + "id integer not null,   "
            + "nombre varchar(30) not null,"
            + "constraint primary_key primary key (id))";
     */
 /*  con = DriverManager.getConnection("jdbc:derby:agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();*/
    //stmt.execute(createSQL);

    /*pstmt = con.prepareStatement("insert into sucursal(id,nombre) values(?,?)");
            pstmt.setString(1,"1");
            pstmt.setString(2, "hagar@somewhere.com");
            pstmt.executeUpdate();*/
 /*    rs = stmt.executeQuery("select * from sucursal");
            while (rs.next()) {
                System.out.println(rs.getInt(1) + rs.getString(2));
               // JOptionPane.showMessageDialog(null, +rs.getInt(1) + "-" + rs.getString(2));
            }*/
    //stmt.execute("drop table person");
    /*   con.commit();*/

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
 /*   } catch (Exception e) {
            System.out.println(e.getMessage());

        }
    }*/
    public Connection Conectar() {
        try {
            con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\dbVentas");
            //con = DriverManager.getConnection("jdbc:derby:.\\dbVentas");          
        } catch (Exception e) {
            System.out.println("error en la conexion " + e);
        }
        return con;
    }
    
    public Connection ConectarExport() {
        try {
            con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\dbVentasExportar");
            //con = DriverManager.getConnection("jdbc:derby:.\\dbVentas");          
        } catch (Exception e) {
            System.out.println("error en la conexion " + e);
        }
        return con;
    }

    public ResultSet seleccionar(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        java.sql.Statement stmt;
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

    public ArrayList<Almacen> SeleccionarAlmacen(String nombre, int idEmpresa) {
        Conectar();
        PreparedStatement pstmt;
        java.sql.Statement stmt;
        ArrayList<Almacen> almacenes = new ArrayList();
        int id_suc = 0;

        try {
            //con = DriverManager.getConnection("jdbc:derby:agil");
            con.setAutoCommit(false);
            stmt = con.createStatement();

            //Se busca el id de la sucursal seleccionada
            String seleccionarId = "SELECT ID \n"
                    + "FROM SUCURSAL\n"
                    + "WHERE NOMBRE = '" + nombre + "' AND EMPRESA = " + idEmpresa;
            ResultSet rsid = stmt.executeQuery(seleccionarId);
            while (rsid.next()) {
                id_suc = rsid.getInt(1);
                // System.out.println("id de la sucursal: "+ id_suc);
            }

            //Se selecciona los datos del almacen segun el id de la sucursal seleccionada
            String seleccionar = "SELECT ID, NOMBRE, SUCURSAL FROM ALMACEN WHERE SUCURSAL = " + id_suc;
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

    public void InsertarTipos(int id, String nombre, String nombre_corto, String createdat, String updatedat, int id_empresa) {
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //java.sql.Statement orden = con.createStatement();
            rs = stmt.executeQuery("SELECT * FROM TIPO WHERE ID = " + id);

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
                //System.out.println("SE ACTUALIZO LA TABLA SUCURSAL");
            } else {
                // String insertar = "insert into sucursal(ID, NOMBRE, ID_USUARIO) values(" + id + ",'" + nombre + "'," + id_usuario + ")";
                pstmt = con.prepareStatement("INSERT INTO TIPO(ID,NOMBRE,NOMBRE_CORTO,CREATEDAT,UPDATEDAT,ID_EMPRESA) values(?,?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setString(2, nombre);
                pstmt.setString(3, nombre_corto);
                pstmt.setString(4, createdat);
                pstmt.setString(5, updatedat);
                pstmt.setInt(6, id_empresa);

                pstmt.executeUpdate();
                //   orden.executeUpdate(insertar);
            }

            con.commit();
            con.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar los tipos: " + ex);
        }
    }

    public void InsertarTiposEmpresaNull(int id, String nombre, String nombre_corto, String createdat, String updatedat) {
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //java.sql.Statement orden = con.createStatement();
            rs = stmt.executeQuery("SELECT * FROM TIPO WHERE ID = " + id);

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
                //System.out.println("SE ACTUALIZO LA TABLA SUCURSAL");
            } else {
                // String insertar = "insert into sucursal(ID, NOMBRE, ID_USUARIO) values(" + id + ",'" + nombre + "'," + id_usuario + ")";
                pstmt = con.prepareStatement("INSERT INTO TIPO(ID,NOMBRE,NOMBRE_CORTO,CREATEDAT,UPDATEDAT) values(?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setString(2, nombre);
                pstmt.setString(3, nombre_corto);
                pstmt.setString(4, createdat);
                pstmt.setString(5, updatedat);

                pstmt.executeUpdate();
                //   orden.executeUpdate(insertar);
            }

            con.commit();
            con.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar los tipos: " + ex);
        }
    }

    public void InsertarClases(int id, int id_tipo, String nombre, String nombre_corto, boolean habilitado, String createdat, String updatedat) {
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //java.sql.Statement orden = con.createStatement();
            rs = stmt.executeQuery("SELECT * FROM CLASE WHERE ID = " + id);

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
            }
            con.commit();
            con.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar clase: " + ex);
        }
    }

    public void InsertarSucursalActividad(int id, int sucursal, int actividad, int dosificacion, String createdat, String updatedat) {
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //java.sql.Statement orden = con.createStatement();
            rs = stmt.executeQuery("SELECT * FROM SUCURSAL_ACTIVIDAD_DOSIFICACION WHERE ID = " + id);

            if (rs.next()) {
                String sql = "UPDATE SUCURSAL_ACTIVIDAD_DOSIFICACION SET ID=?,SUCURSAL=?,ACTIVIDAD=?,DOSIFICACION=?,CREATEDAT=?,UPDATEDAT=? WHERE id=? ";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setInt(2, sucursal);
                statement.setInt(3, actividad);
                statement.setInt(4, dosificacion);
                statement.setString(5, createdat);
                statement.setString(6, updatedat);
                statement.setInt(7, id);

                statement.executeUpdate();
                //System.out.println("SE ACTUALIZO LA TABLA SUCURSAL");
            } else {
                // String insertar = "insert into sucursal(ID, NOMBRE, ID_USUARIO) values(" + id + ",'" + nombre + "'," + id_usuario + ")";
                pstmt = con.prepareStatement("INSERT INTO SUCURSAL_ACTIVIDAD_DOSIFICACION(ID,SUCURSAL,ACTIVIDAD,DOSIFICACION,CREATEDAT,UPDATEDAT) values(?,?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setInt(2, sucursal);
                pstmt.setInt(3, actividad);
                pstmt.setInt(4, dosificacion);
                pstmt.setString(5, createdat);
                pstmt.setString(6, updatedat);

                pstmt.executeUpdate();
                //   orden.executeUpdate(insertar);
            }

            con.commit();
            con.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar los tipos: " + ex);
        }
    }

    public void InsertarSucursalActividadIdSucNull(int id, int actividad, int dosificacion, String createdat, String updatedat) {
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //java.sql.Statement orden = con.createStatement();
            rs = stmt.executeQuery("SELECT * FROM SUCURSAL_ACTIVIDAD_DOSIFICACION WHERE ID = " + id);

            if (rs.next()) {
                String sql = "UPDATE SUCURSAL_ACTIVIDAD_DOSIFICACION SET ID=?,ACTIVIDAD=?,DOSIFICACION=?,CREATEDAT=?,UPDATEDAT=? WHERE id=? ";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setInt(2, actividad);
                statement.setInt(3, dosificacion);
                statement.setString(4, createdat);
                statement.setString(5, updatedat);
                statement.setInt(6, id);

                statement.executeUpdate();
                //System.out.println("SE ACTUALIZO LA TABLA SUCURSAL");
            } else {
                // String insertar = "insert into sucursal(ID, NOMBRE, ID_USUARIO) values(" + id + ",'" + nombre + "'," + id_usuario + ")";
                pstmt = con.prepareStatement("INSERT INTO SUCURSAL_ACTIVIDAD_DOSIFICACION(ID,ACTIVIDAD,DOSIFICACION,CREATEDAT,UPDATEDAT) values(?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setInt(2, actividad);
                pstmt.setInt(3, dosificacion);
                pstmt.setString(4, createdat);
                pstmt.setString(5, updatedat);

                pstmt.executeUpdate();
                //   orden.executeUpdate(insertar);
            }

            con.commit();
            con.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar los tipos: " + ex);
        }
    }

    public void insertarSucursalSuc(int id, int empresa, String nombre, int numero, String direccion, String telefono1, String telefono2, String telefono3, int departamento, int municipio, String createdat, String updatedat, int nota_venta_correlativa, int nota_traspaso_correlativo, int nota_baja_correlativo, int pedido_correlativo, int copias_impresion_pedido, String frase_pedido, int nota_recibo_correlativo, int cotizacion_correlativo, int pre_factura_correlativo, int comprobante_ingreso_correlativo, int comprobante_egreso_correlativo, int comprobante_traspaso_correlativo, int comprobante_caja_chica_correlativa, String fecha_reinicio_correlativo, int nota_venta_farmacia_correlativo, int despacho_correlativo, int ropa_trabajo_correlativo, boolean reinicio_comprobante_ingreso, boolean reinicio_comprobante_traspaso, boolean reinicio_comprobante_egreso, boolean reinicio_comprobante_caja_chica, boolean imprimir_pedido_corto, boolean eliminado, int despacho_recibo_correlativo) {
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            rs = stmt.executeQuery("SELECT * FROM SUCURSAL WHERE ID = " + id);

            if (rs.next()) {
                String sql = "UPDATE SUCURSAL SET EMPRESA=?,NOMBRE=?,NUMERO=?,DIRECCION=?,TELEFONO1=?,TELEFONO2=?,TELEFONO3=?,DEPARTAMENTO=?,MUNICIPIO=?,CREATEDAT=?,UPDATEDAT=?,NOTA_VENTA_CORRELATIVO=?,NOTA_TRASPASO_CORRELATIVO=?,NOTA_BAJA_CORRELATIVO=?,PEDIDO_CORRELATIVO=?,COPIAS_IMPRESION_PEDIDO=?,FRASE_PEDIDO=?,NOTA_RECIBO_CORRELATIVO=?,COTIZACION_CORRELATIVO=?,PRE_FACTURA_CORRELATIVO=?,COMPROBANTE_INGRESO_CORRELATIVO=?,COMPROBANTE_EGRESO_CORRELATIVO=?,COMPROBANTE_TRASPASO_CORRELATIVO=?,COMPROBANTE_CAJA_CHICA_CORRELATIVO=?,FECHA_REINICIO_CORRELATIVO=?,NOTA_VENTA_FARMACIA_CORRELATIVO=?,DESPACHO_CORRELATIVO=?,ROPA_TRABAJO_CORRELATIVO=?,REINICIAR_COMPROBANTE_INGRESO_CORRELATIVO=?,REINICIAR_COMPROBANTE_TRASPASO_CORRELATIVO=?,REINICIAR_COMPROBANTE_EGRESO_CORRELATIVO=?,REINICIAR_COMPROBANTE_CAJA_CHICA_CORRELATIVO=?,IMPRIMIR_PEDIDO_CORTO=?,ELIMINADO=?,DESPACHO_RECIBO_CORRELATIVO=? WHERE ID=? ";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, empresa);
                statement.setString(2, nombre);
                statement.setInt(3, numero);
                statement.setString(4, direccion);
                statement.setString(5, telefono1);
                statement.setString(6, telefono2);
                statement.setString(7, telefono3);
                statement.setInt(8, departamento);
                statement.setInt(9, municipio);
                statement.setString(10, createdat);
                statement.setString(11, updatedat);
                statement.setInt(12, nota_venta_correlativa);
                statement.setInt(13, nota_traspaso_correlativo);
                statement.setInt(14, nota_baja_correlativo);
                statement.setInt(15, pedido_correlativo);
                statement.setInt(16, copias_impresion_pedido);
                statement.setString(17, frase_pedido);
                statement.setInt(18, nota_recibo_correlativo);

                statement.setInt(19, cotizacion_correlativo);
                statement.setInt(20, pre_factura_correlativo);
                statement.setInt(21, comprobante_ingreso_correlativo);
                statement.setInt(22, comprobante_egreso_correlativo);
                statement.setInt(23, comprobante_traspaso_correlativo);
                statement.setInt(24, comprobante_caja_chica_correlativa);
                statement.setString(25, fecha_reinicio_correlativo);
                statement.setInt(26, nota_venta_farmacia_correlativo);
                statement.setInt(27, despacho_correlativo);
                statement.setInt(28, ropa_trabajo_correlativo);
                statement.setBoolean(29, reinicio_comprobante_ingreso);
                statement.setBoolean(30, reinicio_comprobante_traspaso);
                statement.setBoolean(31, reinicio_comprobante_egreso);
                statement.setBoolean(32, reinicio_comprobante_caja_chica);
                statement.setBoolean(33, imprimir_pedido_corto);
                statement.setBoolean(34, eliminado);
                statement.setInt(35, despacho_recibo_correlativo);

                statement.setInt(36, id);

                statement.executeUpdate();
                //System.out.println("SE ACTUALIZO LA TABLA SUCURSAL");
            } else {
                pstmt = con.prepareStatement("INSERT INTO SUCURSAL(ID, EMPRESA,NOMBRE,NUMERO,DIRECCION,TELEFONO1,TELEFONO2,TELEFONO3,DEPARTAMENTO,MUNICIPIO,CREATEDAT,UPDATEDAT,NOTA_VENTA_CORRELATIVO,NOTA_TRASPASO_CORRELATIVO,NOTA_BAJA_CORRELATIVO,PEDIDO_CORRELATIVO,COPIAS_IMPRESION_PEDIDO,FRASE_PEDIDO,NOTA_RECIBO_CORRELATIVO,COTIZACION_CORRELATIVO,PRE_FACTURA_CORRELATIVO,COMPROBANTE_INGRESO_CORRELATIVO,COMPROBANTE_EGRESO_CORRELATIVO,COMPROBANTE_TRASPASO_CORRELATIVO,COMPROBANTE_CAJA_CHICA_CORRELATIVO,FECHA_REINICIO_CORRELATIVO,NOTA_VENTA_FARMACIA_CORRELATIVO,DESPACHO_CORRELATIVO,ROPA_TRABAJO_CORRELATIVO,REINICIAR_COMPROBANTE_INGRESO_CORRELATIVO,REINICIAR_COMPROBANTE_TRASPASO_CORRELATIVO,REINICIAR_COMPROBANTE_EGRESO_CORRELATIVO,REINICIAR_COMPROBANTE_CAJA_CHICA_CORRELATIVO,IMPRIMIR_PEDIDO_CORTO,ELIMINADO,DESPACHO_RECIBO_CORRELATIVO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setInt(2, empresa);
                pstmt.setString(3, nombre);
                pstmt.setInt(4, numero);
                pstmt.setString(5, direccion);
                pstmt.setString(6, telefono1);
                pstmt.setString(7, telefono2);
                pstmt.setString(8, telefono3);
                pstmt.setInt(9, departamento);
                pstmt.setInt(10, municipio);
                pstmt.setString(11, createdat);
                pstmt.setString(12, updatedat);
                pstmt.setInt(13, nota_venta_correlativa);
                pstmt.setInt(14, nota_traspaso_correlativo);
                pstmt.setInt(15, nota_baja_correlativo);
                pstmt.setInt(16, pedido_correlativo);
                pstmt.setInt(17, copias_impresion_pedido);
                pstmt.setString(18, frase_pedido);
                pstmt.setInt(19, nota_recibo_correlativo);

                pstmt.setInt(20, cotizacion_correlativo);
                pstmt.setInt(21, pre_factura_correlativo);
                pstmt.setInt(22, comprobante_ingreso_correlativo);
                pstmt.setInt(23, comprobante_egreso_correlativo);
                pstmt.setInt(24, comprobante_traspaso_correlativo);
                pstmt.setInt(25, comprobante_caja_chica_correlativa);
                pstmt.setString(26, fecha_reinicio_correlativo);
                pstmt.setInt(27, nota_venta_farmacia_correlativo);
                pstmt.setInt(28, despacho_correlativo);
                pstmt.setInt(29, ropa_trabajo_correlativo);
                pstmt.setBoolean(30, reinicio_comprobante_ingreso);
                pstmt.setBoolean(31, reinicio_comprobante_traspaso);
                pstmt.setBoolean(32, reinicio_comprobante_egreso);
                pstmt.setBoolean(33, reinicio_comprobante_caja_chica);
                pstmt.setBoolean(34, imprimir_pedido_corto);
                pstmt.setBoolean(35, eliminado);
                pstmt.setInt(36, despacho_recibo_correlativo);

                pstmt.executeUpdate();
            }
            con.commit();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar las sucursales: " + ex);
        }
    }

    public void insertarAlmacenSuc(int id, int sucursal, String nombre, int numero, String direccion, String telefono, String createdat, String updatedat) {
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {

            con.setAutoCommit(false);
            stmt = con.createStatement();
            rs = stmt.executeQuery("SELECT * FROM ALMACEN WHERE ID = " + id);
            
            if (rs.next()) {
                String sql = "UPDATE ALMACEN SET SUCURSAL=?,NOMBRE=?,NUMERO=?,DIRECCION=?,TELEFONO=?,CREATEDAT=?,UPDATEDAT=? WHERE id=? ";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, sucursal);
                statement.setString(2, nombre);
                statement.setInt(3, numero);
                statement.setString(4, direccion);
                statement.setString(5, telefono);
                statement.setString(6, createdat);
                statement.setString(7, updatedat);
                statement.setInt(8, id);

                statement.executeUpdate();
            } else {
                pstmt = con.prepareStatement("INSERT INTO ALMACEN(ID,SUCURSAL,NOMBRE,NUMERO,DIRECCION,TELEFONO,CREATEDAT,UPDATEDAT) values(?,?,?,?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setInt(2, sucursal);
                pstmt.setString(3, nombre);
                pstmt.setInt(4, numero);
                pstmt.setString(5, direccion);
                pstmt.setString(6, telefono);
                pstmt.setString(7, createdat);
                pstmt.setString(8, updatedat);

                pstmt.executeUpdate();
                pstmt.close();
            }
            con.commit();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar el almacen: " + ex);
        }
    }

    public void insertarRegistro(int id_usuario, java.sql.Date fecha) {
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;

        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            pstmt = con.prepareStatement("INSERT INTO REGISTRO(USUARIO,FECHA) values(?,?)");
            pstmt.setInt(1, id_usuario);
            pstmt.setDate(2, fecha);

            pstmt.executeUpdate();
            con.commit();
            con.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al insertar el registro: " + ex);
        }
    }

    public boolean verifRegistroDiario(int usuario, java.sql.Date fecha) {
        Conectar();
        PreparedStatement pstmt = null;
        java.sql.Statement stmt = null;
        ResultSet rs = null;
        boolean rest = false;
        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            //java.sql.Statement orden = con.createStatement();
            rs = stmt.executeQuery("SELECT * FROM REGISTRO WHERE USUARIO = " + usuario + " AND FECHA = '" + fecha + "'");

            if (rs.next()) {
                rest = true;
            } else {
                rest = false;
            }
            con.commit();
            con.close();

        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
            System.out.println("Error al verificar los registros: " + ex);
        }
        return rest;
    }

    public void insertarProductos(int id,int empresa,int almacen, String nombre,String codigo,String unidad_medida,double precio_unit,double utilidad_esperada,int inventario_min,String descripcion,int grupo,int subGrupo,String caract_esp1,String caract_esp2,String codigo_fabrica,double rangoMax,double rangoMin,String createdat,String updatedat,double comision,boolean publica_panel,int alerta,double descuento,boolean descuento_fijo,int id_tipo_producto,boolean activar_producto,String marca,String modelo,String anio,int cuenta,String imagen,boolean eliminado ){
        Conectar();
        PreparedStatement pstmt;
        Statement stmt = null;
        ResultSet rs = null;
        boolean valor = false;
        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            String seleccionar = "SELECT * FROM PRODUCTO WHERE IDP = "+id+" AND ALMACEN = "+almacen;
            rs = stmt.executeQuery(seleccionar);

            if (rs.next()) {
                String sql = "UPDATE producto SET IDP=?, EMPRESA=?, NOMBRE=?, CODIGO=?, UNIDAD_MEDIDA=?, PRECIO_UNITARIO=?, UNIDAD_ESPERADA=?, INVENTARIO_MINIMO=?, DESCRIPCION=?, GRUPO=?, SUBGRUPO=?,CARACTERISTICA_ESPECIAL1=?,CARACTERISTICA_ESPECIAL2=?,CODIGO_FABRICA=?,RANGO_MIN=?,RANGO_MAX=?,CREATEDAT=?,UPDATEDAT=?,COMISION=?,PUBLICAR_PANEL=?,ALERTA=?,DESCUENTO=?,DESCUENTO_FIJO=?,TIPO_PRODUCTO=?,ACTIVAR_INVENTARIO=?,MARCA=?,MODELO=?,ANIO=?,CUENTA=?,IMAGEN=?,ELIMINADO=?,ALMACEN=?  WHERE IDP = ? AND ALMACEN = ?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setInt(2, empresa);
                statement.setString(3, nombre);
                statement.setString(4, codigo);
                statement.setString(5, unidad_medida);
                statement.setDouble(6, precio_unit);
                statement.setDouble(7, utilidad_esperada);
                statement.setInt(8, inventario_min);
                statement.setString(9, descripcion);
                statement.setInt(10, grupo);
                statement.setInt(11, subGrupo);
                statement.setString(12, caract_esp1);
                statement.setString(13, caract_esp2);
                statement.setString(14, codigo_fabrica);
                statement.setDouble(15, rangoMin);
                statement.setDouble(16, rangoMax);
                statement.setString(17, createdat);
                statement.setString(18, updatedat);
                statement.setDouble(19, comision);
                statement.setBoolean(20, publica_panel);
                statement.setInt(21, alerta);
                statement.setDouble(22, descuento);
                statement.setBoolean(23, descuento_fijo);
                statement.setInt(24, id_tipo_producto);
                statement.setBoolean(25, activar_producto);
                statement.setString(26, marca);
                statement.setString(27, modelo);
                statement.setString(28, anio);
                statement.setInt(29, cuenta);
                statement.setString(30, imagen);
                statement.setBoolean(31, eliminado);
                statement.setInt(32, almacen);
                
                statement.setInt(33, id);
                statement.setInt(34, almacen);
                
                statement.executeUpdate();
         
                // System.out.println("Se actualizo la tabla productos");
            } else {
                pstmt = con.prepareStatement("INSERT INTO PRODUCTO(IDP,EMPRESA,NOMBRE,CODIGO,UNIDAD_MEDIDA,PRECIO_UNITARIO,UNIDAD_ESPERADA,INVENTARIO_MINIMO,DESCRIPCION,GRUPO,SUBGRUPO,CARACTERISTICA_ESPECIAL1,CARACTERISTICA_ESPECIAL2,CODIGO_FABRICA,RANGO_MIN,RANGO_MAX,CREATEDAT,UPDATEDAT,COMISION,PUBLICAR_PANEL,ALERTA,DESCUENTO,DESCUENTO_FIJO,TIPO_PRODUCTO,ACTIVAR_INVENTARIO,MARCA,MODELO,ANIO,CUENTA,IMAGEN,ELIMINADO,ALMACEN) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setInt(2, empresa);
                pstmt.setString(3, nombre);
                pstmt.setString(4, codigo);
                pstmt.setString(5, unidad_medida);
                pstmt.setDouble(6, precio_unit);
                pstmt.setDouble(7, utilidad_esperada);
                pstmt.setInt(8, inventario_min);
                pstmt.setString(9, descripcion);
                pstmt.setInt(10, grupo);
                pstmt.setInt(11, subGrupo);
                pstmt.setString(12, caract_esp1);
                pstmt.setString(13, caract_esp2);
                pstmt.setString(14, codigo_fabrica);
                pstmt.setDouble(15, rangoMin);
                pstmt.setDouble(16, rangoMax);
                pstmt.setString(17, createdat);
                pstmt.setString(18, updatedat);
                pstmt.setDouble(19, comision);
                pstmt.setBoolean(20, publica_panel);
                pstmt.setInt(21, alerta);
                pstmt.setDouble(22, descuento);
                pstmt.setBoolean(23, descuento_fijo);
                pstmt.setInt(24, id_tipo_producto);
                pstmt.setBoolean(25, activar_producto);
                pstmt.setString(26, marca);
                pstmt.setString(27, modelo);
                pstmt.setString(28, anio);
                pstmt.setInt(29, cuenta);
                pstmt.setString(30, imagen);
                pstmt.setBoolean(31, eliminado);
                pstmt.setInt(32, almacen);
                        
                pstmt.executeUpdate();            
            }
            con.commit();
            con.close();
        } catch (SQLException ex) {
            System.out.println("Error al insertar producto: " + ex);
            System.out.println(ex.getMessage());
            //           System.out.println("nom: " + nomb_prod + " id: " + id_prod);
        }
    }

    public void insertarProductosBases(int id,int empresa, String nombre,String codigo,String unidad_medida,double precio_unit,double utilidad_esperada,int inventario_min,String descripcion,int grupo,int subGrupo,String caract_esp1,String caract_esp2,String codigo_fabrica,double rangoMax,double rangoMin,String createdat,String updatedat,double comision,boolean publica_panel,int alerta,double descuento,boolean descuento_fijo,int id_tipo_producto,boolean activar_producto,String marca,String modelo,String anio,int cuenta,String imagen,boolean eliminado ){
        Conectar();
        PreparedStatement pstmt;
        Statement stmt = null;
        ResultSet rs = null;
        boolean valor = false;
        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            String seleccionar = "SELECT * FROM PRODUCTOS_BASES WHERE IDPB = "+id;
            rs = stmt.executeQuery(seleccionar);

            if (rs.next()) {
                String sql = "UPDATE PRODUCTOS_BASES SET IDPB=?,EMPRESA=?,NOMBRE=?,CODIGO=?,UNIDAD_MEDIDA=?,PRECIO_UNITARIO=?,UNIDAD_ESPERADA=?,INVENTARIO_MINIMO=?,DESCRIPCION=?,GRUPO=?,SUBGRUPO=?,CARACTERISTICA_ESPECIAL1=?,CARACTERISTICA_ESPECIAL2=?,CODIGO_FABRICA=?,RANGO_MIN=?,RANGO_MAX=?,CREATEDAT=?,UPDATEDAT=?,COMISION=?,PUBLICAR_PANEL=?,ALERTA=?,DESCUENTO=?,DESCUENTO_FIJO=?,TIPO_PRODUCTO=?,ACTIVAR_INVENTARIO=?,MARCA=?,MODELO=?,ANIO=?,CUENTA=?,IMAGEN=?,ELIMINADO=?  WHERE IDPB=?";
                PreparedStatement statement = con.prepareStatement(sql);
                statement.setInt(1, id);
                statement.setInt(2, empresa);
                statement.setString(3, nombre);
                statement.setString(4, codigo);
                statement.setString(5, unidad_medida);
                statement.setDouble(6, precio_unit);
                statement.setDouble(7, utilidad_esperada);
                statement.setInt(8, inventario_min);
                statement.setString(9, descripcion);
                statement.setInt(10, grupo);
                statement.setInt(11, subGrupo);
                statement.setString(12, caract_esp1);
                statement.setString(13, caract_esp2);
                statement.setString(14, codigo_fabrica);
                statement.setDouble(15, rangoMin);
                statement.setDouble(16, rangoMax);
                statement.setString(17, createdat);
                statement.setString(18, updatedat);
                statement.setDouble(19, comision);
                statement.setBoolean(20, publica_panel);
                statement.setInt(21, alerta);
                statement.setDouble(22, descuento);
                statement.setBoolean(23, descuento_fijo);
                statement.setInt(24, id_tipo_producto);
                statement.setBoolean(25, activar_producto);
                statement.setString(26, marca);
                statement.setString(27, modelo);
                statement.setString(28, anio);
                statement.setInt(29, cuenta);
                statement.setString(30, imagen);
                statement.setBoolean(31, eliminado);
                
                statement.setInt(32, id);

                statement.executeUpdate();
                //con.close();
                // System.out.println("Se actualizo la tabla productos");
            } else {
                pstmt = con.prepareStatement("INSERT INTO PRODUCTOS_BASES(IDPB,EMPRESA,NOMBRE,CODIGO,UNIDAD_MEDIDA,PRECIO_UNITARIO,UNIDAD_ESPERADA,INVENTARIO_MINIMO,DESCRIPCION,GRUPO,SUBGRUPO,CARACTERISTICA_ESPECIAL1,CARACTERISTICA_ESPECIAL2,CODIGO_FABRICA,RANGO_MIN,RANGO_MAX,CREATEDAT,UPDATEDAT,COMISION,PUBLICAR_PANEL,ALERTA,DESCUENTO,DESCUENTO_FIJO,TIPO_PRODUCTO,ACTIVAR_INVENTARIO,MARCA,MODELO,ANIO,CUENTA,IMAGEN,ELIMINADO) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
                pstmt.setInt(1, id);
                pstmt.setInt(2, empresa);
                pstmt.setString(3, nombre);
                pstmt.setString(4, codigo);
                pstmt.setString(5, unidad_medida);
                pstmt.setDouble(6, precio_unit);
                pstmt.setDouble(7, utilidad_esperada);
                pstmt.setInt(8, inventario_min);
                pstmt.setString(9, descripcion);
                pstmt.setInt(10, grupo);
                pstmt.setInt(11, subGrupo);
                pstmt.setString(12, caract_esp1);
                pstmt.setString(13, caract_esp2);
                pstmt.setString(14, codigo_fabrica);
                pstmt.setDouble(15, rangoMin);
                pstmt.setDouble(16, rangoMax);
                pstmt.setString(17, createdat);
                pstmt.setString(18, updatedat);
                pstmt.setDouble(19, comision);
                pstmt.setBoolean(20, publica_panel);
                pstmt.setInt(21, alerta);
                pstmt.setDouble(22, descuento);
                pstmt.setBoolean(23, descuento_fijo);
                pstmt.setInt(24, id_tipo_producto);
                pstmt.setBoolean(25, activar_producto);
                pstmt.setString(26, marca);
                pstmt.setString(27, modelo);
                pstmt.setString(28, anio);
                pstmt.setInt(29, cuenta);
                pstmt.setString(30, imagen);
                pstmt.setBoolean(31, eliminado);
                        
                pstmt.executeUpdate();            
            }
            con.commit();
            con.close();
        } catch (SQLException ex) {
            System.out.println("Error al insertar producto: " + ex);
            System.out.println(ex.getMessage());
            //           System.out.println("nom: " + nomb_prod + " id: " + id_prod);
        }
    }
  
    public void eliminar(String consulta){
        Conectar();
        ResultSet rs = null;
        try
        {
          this.con.setAutoCommit(false);
          Statement stmt = this.con.createStatement();
          stmt.execute(consulta);

          stmt.close();
          this.con.commit();
        }
        catch (Exception e){
          System.out.println(e.getMessage());
        }finally{
            try {

                Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(DataBase.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
        
    public void insertarInventario(int inv_id, int inv_id_alma, int inv_id_pro, double inv_cant, double inv_cost_unit, double inv_cost_to, String inv_fecha_venci, String inv_lote, String inv_createdAt, String inv_updatedAt){
    Conectar();
    Statement stmt = null;
    ResultSet rs = null;
    boolean valor = false;
    try{        
        con.setAutoCommit(false);
        stmt = con.createStatement();
        rs = stmt.executeQuery("SELECT * FROM INV_INVENTARIO WHERE ID = " + inv_id);
            
      if (rs.next()){
        String sql = "UPDATE INV_INVENTARIO SET almacen=?,producto=?,cantidad=?,costo_unitario=?,costo_total=?,createdat=?,updatedat=?,fecha_vencimiento=?,lote=? WHERE id=?";
        PreparedStatement statement = this.con.prepareStatement(sql);
        statement.setInt(1, inv_id_alma);
        statement.setInt(2, inv_id_pro);
        statement.setDouble(3, inv_cant);
        statement.setDouble(4, inv_cost_unit);
        statement.setDouble(5, inv_cost_to);
        statement.setString(6, inv_createdAt);
        statement.setString(7, inv_updatedAt);
        statement.setString(8, inv_fecha_venci);
        statement.setString(9, inv_lote);
        statement.setInt(10, inv_id);
        
        statement.executeUpdate();
      }else{
        PreparedStatement pstmt = this.con.prepareStatement("INSERT INTO INV_INVENTARIO(id,almacen,producto,cantidad,costo_unitario,costo_total,createdat,updatedat,fecha_vencimiento,lote) values(?,?,?,?,?,?,?,?,?,?)");
        
        pstmt.setInt(1, inv_id);
        pstmt.setInt(2, inv_id_alma);
        pstmt.setInt(3, inv_id_pro);
        pstmt.setDouble(4, inv_cant);
        pstmt.setDouble(5, inv_cost_unit);
        pstmt.setDouble(6, inv_cost_to);
        pstmt.setString(7, inv_createdAt);
        pstmt.setString(8, inv_updatedAt);       
        pstmt.setString(9, inv_fecha_venci);
        
        pstmt.setString(10, inv_lote);
        
        pstmt.executeUpdate();
      }
      this.con.commit();
      this.con.close();
    }
    catch (SQLException ex)
    {
      System.out.println("Error al insertar inventario: " + ex);
    }
  }

    public void insertarProductoBase(int id, int producto, int productoBase, double formulacion, String created, String updated, boolean eliminado){
        Conectar();
        ResultSet rs = null;
        Statement stmt = null;
        try{
          this.con.setAutoCommit(false);
          stmt = this.con.createStatement();
          rs = stmt.executeQuery("SELECT * FROM PRODUCTO_BASE WHERE ID=" + id);
          if (rs.next())
          {
            String sql = "UPDATE PRODUCTO_BASE SET PRODUCTO=?,PRODUCTO_BASE=?,FORMULACION=?,CREATEDAT=?,UPDATEDAT=?,ELIMINADO=? WHERE ID=?";
            PreparedStatement statement = this.con.prepareStatement(sql);

            statement.setInt(1, producto);
            statement.setInt(2, productoBase);
            statement.setDouble(3, formulacion);
            statement.setString(4, created);
            statement.setString(5, updated);
            statement.setBoolean(6, eliminado);
            statement.setInt(7, id);            
            
            statement.executeUpdate();
          }else{
            PreparedStatement pstmt = this.con.prepareStatement("INSERT INTO PRODUCTO_BASE(ID,PRODUCTO,PRODUCTO_BASE,FORMULACION,CREATEDAT,UPDATEDAT,ELIMINADO) VALUES(?,?,?,?,?,?,?)");

            pstmt.setInt(1, id);
            pstmt.setInt(2, producto);
            pstmt.setInt(3, productoBase);
            pstmt.setDouble(4, formulacion);
            pstmt.setString(5, created);
            pstmt.setString(6, created);
            pstmt.setBoolean(7, eliminado);
            
            pstmt.executeUpdate();
          }
          this.con.commit();
    
        }
        catch (SQLException ex)
        {
          System.out.println("Error al insertar producto base: " + ex);
        }
    }
    
    public ResultSet seleccionarExpor(String consulta) {
        ConectarExport();
        PreparedStatement pstmt;
        java.sql.Statement stmt;
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
    /*public static void main(String args[]){
        DataBase db = new DataBase();
        
        db.Conectar();
        //d.insertarSucursal(3, "edson");
}*/
}



