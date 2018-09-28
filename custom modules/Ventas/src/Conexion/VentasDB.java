/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Conexion;

import Modelos.Actividad;
import Modelos.Almacen;
import Modelos.AlmacenExpo;
import Modelos.ClienteExpor;
import Modelos.Inventario;
import Modelos.ProductoBaseExport;
import Modelos.ProductoExport;
import Modelos.ProductosBaseExport;
import Modelos.Ventas;
import UI.DetalleVentaExport;
import Modelos.costosExport;
import java.util.List;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;

/**
 *
 * @author AGIL
 */
public class VentasDB {

    private java.sql.Connection userConn;
    //private final String SQL_INSERT =
    // "INSERT INTO persona(nombre, apellido) VALUES(?,?)";
    //private final String SQL_UPDATE =
    //"UPDATE persona SET nombre=?, apellido=? WHERE id_persona=?";
    //private final String SQL_DELETE =
    //"DELETE FROM persona WHERE id_persona = ?";

    public VentasDB() {
    }

    public VentasDB(Connection conn) {
        this.userConn = conn;
    }

    public int insertVentaExportar(double aCuenta, int actividad, int almacen, double cambio, int cliente, boolean despachado, String fecha, String fechaTexto, int idEmpresa, int idUsuario, double importe, int movimiento, double pagado, double saldo, int sucursal, int tipoPago, double total) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio
        String consulta = "INSERT INTO INV_VENTA (A_CUENTA, ACTIVIDAD, ALMACEN, CAMBIO, CLIENTE, DESPACHADO, FECHA, FECHATEXTO, ID_EMPRESA, ID_USUARIO, IMPORTE, MOVIMIENTO, PAGADO, SALDO, SUCURSAL, TIPOPAGO, TOTAL) \n"
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
            stmt.setDouble(index++, aCuenta);//param 1 => ? 
            stmt.setInt(index++, actividad);
            stmt.setInt(index++, almacen);
            stmt.setDouble(index++, cambio);
            stmt.setInt(index++, cliente);
            stmt.setBoolean(index++, despachado);
            stmt.setString(index++, fecha);
            stmt.setString(index++, fechaTexto);
            stmt.setInt(index++, idEmpresa);
            stmt.setInt(index++, idUsuario);
            stmt.setDouble(index++, importe);
            stmt.setInt(index++, movimiento);
            stmt.setDouble(index++, pagado);
            stmt.setDouble(index++, saldo);
            stmt.setInt(index++, sucursal);
            stmt.setInt(index++, tipoPago);
            stmt.setDouble(index++, total);

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int selectUltimoIdVenta() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String consulta = "SELECT Max(ID) FROM INV_VENTA";
        int id = 0;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                id = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return id;
    }

    public int insertActividadExportar(int idAct, int idTipo, String nombre, String nombreCorto, boolean eliminado, boolean habilitado) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio
        String consulta = "INSERT INTO ACTIVIDAD (ID_A, ID_TIPO, NOMBRE, NOMBRE_CORTO, ELIMINADO, HABILITADO) \n"
                + "VALUES (?, ?, ?, ?, ?, ?)";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
            stmt.setInt(index++, idAct);//param 1 => ? 
            stmt.setInt(index++, idTipo);
            stmt.setString(index++, nombre);
            stmt.setString(index++, nombreCorto);
            stmt.setBoolean(index++, eliminado);
            stmt.setBoolean(index++, habilitado);

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int insertAlmacenExportar(int idAlm, int idSucAlm, String nombre, int numero, String direccion) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO ALMACEN (ID_A, ID_SUCUSAL, NOMBRE, NUMERO, DIRECCION) \n"
                + "VALUES (?, ?, ?, ?, ?)";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
            stmt.setInt(index++, idAlm);//param 1 => ? 
            stmt.setInt(index++, idSucAlm);
            stmt.setString(index++, nombre);
            stmt.setInt(index++, numero);
            stmt.setString(index++, direccion);

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int insertClienteExportar(String nit, String razonSocial) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO CLIENTE (NIT, RAZON_SOCIAL) \n"
                + "VALUES (?, ?)";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
            stmt.setString(index++, nit);//param 1 => ? 
            stmt.setString(index++, razonSocial);

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int insertClaseExportar(int idC, int idTipo, String nombre, String nombreCorto, boolean habilitado, String created, String updated, boolean eliminado) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO CLASE (ID_C, ID_TIPO,NOMBRE,NOMBRE_CORTO,HABILITADO,CREATEDAT,UPDATEDAT,ELIMINADO) \n"
                + "VALUES (?, ?, ? , ?, ?, ?, ?, ?)";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
            stmt.setInt(index++, idC);//param 1 => ? 
            stmt.setInt(index++, idTipo);
            stmt.setString(index++, nombre);
            stmt.setString(index++, nombreCorto);
            stmt.setBoolean(index++, habilitado);
            stmt.setString(index++, created);
            stmt.setString(index++, updated);
            stmt.setBoolean(index++, eliminado);

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int selectUltimoIdActividad() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String consulta = "SELECT Max(ID) FROM ACTIVIDAD";
        int id = 0;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                id = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return id;
    }

    public int selectUltimoIdAlmacen() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String consulta = "SELECT Max(ID) FROM ALMACEN";
        int id = 0;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                id = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return id;
    }

    public int selectUltimoIdCliente() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String consulta = "SELECT Max(ID) FROM CLIENTE";
        int id = 0;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                id = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return id;
    }

    public int selectUltimoIdClase() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String consulta = "SELECT Max(ID) FROM CLASE";
        int id = 0;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                id = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return id;
    }

    public int insertCostosExportar(int idd, int idc, int id_almacen, int id_producto, double cantidad, double costoTotal, double costoUnitario, String created, String updated, String fechaVencimiento, String lote) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO COSTOS (ID_D, ID_C, ID_ALMACEN, ID_PRODUCTO, CANTIDAD, COSTO_TOTAL, COSTO_UNITARIO, CREATEDAT, FECHA_VENCIMIENTO, LOTE, UPDATEDAT) \n"
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
            stmt.setInt(index++, idd);//param 1 => ? 
            stmt.setInt(index++, idc);//param 1 => ? 
            stmt.setInt(index++, id_almacen);
            stmt.setInt(index++, id_producto);
            stmt.setDouble(index++, cantidad);
            stmt.setDouble(index++, costoTotal);
            stmt.setDouble(index++, costoUnitario);
            stmt.setString(index++, created);
            stmt.setString(index++, fechaVencimiento);
            stmt.setString(index++, lote);
            stmt.setString(index++, updated);

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int insertDetalleVentaExportar(int idVenta, int cantidad, double descuento, int excento, int ice, double importe, double inventarioDispo, double precioUnit, int recargo, boolean tipoDescu, boolean tipoRecargo, double total) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO DETALLE_VENTA (ID_V, CANTIDAD, DESCUENTO, EXCENTO, ICE, IMPORTE, INVENTARIO_DISPONIBLE, PRECIO_UNITARIO, RECARGO, TIPO_DESCUENTO, TIPO_RECARGO, TOTAL) \n"
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
            stmt.setInt(index++, idVenta);//param 1 => ? 
            stmt.setInt(index++, cantidad);//param 1 => ? 
            stmt.setDouble(index++, descuento);
            stmt.setInt(index++, excento);
            stmt.setInt(index++, ice);
            stmt.setDouble(index++, importe);
            stmt.setDouble(index++, inventarioDispo);
            stmt.setDouble(index++, precioUnit);
            stmt.setInt(index++, recargo);
            stmt.setBoolean(index++, tipoDescu);
            stmt.setBoolean(index++, tipoRecargo);
            stmt.setDouble(index++, total);

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int selectUltimoIdDetalleVenta() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String consulta = "SELECT Max(ID) FROM DETALLE_VENTA";
        int id = 0;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                id = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return id;
    }

    public int insertSucursalExportar(int id) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO SUCURSAL (ID_S) \n"
                + "VALUES (?)";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
            stmt.setInt(index++, id);//param 1 => ? 

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int selectUltimoIdSucursal() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String consulta = "SELECT Max(ID) FROM SUCURSAL";
        int id = 0;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                id = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return id;
    }

    public int insertProductoExportar(int idDeta, int idPro, int empresa, boolean activarInventario, int activoFijo, int alerta, String anio, String caracEspe1, String caracEspe2, String codigo, String codigoFabrica, double comision, String created, String updated, double descuento, boolean descuentoFijo, int almacenERP, int cuenta, int grupo, int subGrupo, String imagen, double inventaDisponible, int invetaMinimo,int tipoProducto) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO PRODUCTO (ID_D, ID_P, EMPRESA, ACTIVAR_INVENTARIO, ACTIVO_FIJO, ALERTE, ANIO, CARACTERISTICA_ESPECIAL1, CARACTERISTICA_ESPECIAL2, CODIGO, CODIGO_FABRICA, COMISION, CREATEDAT, UPDATEDAT, DESCUENTO, DESCUENTO_FIJO, ALMACEN_ERP, CUENTA, GRUPO, SUBGRUPO, IMAGEN, INVENTARIO_DISPONIBLE, INVENTARIO_MINIMO,TIPO_PRODUCTO) \n"
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
            stmt.setInt(index++, idDeta);//param 1 => ? 
            stmt.setInt(index++, idPro);
            stmt.setInt(index++, empresa);
            stmt.setBoolean(index++, activarInventario);
            stmt.setInt(index++, activoFijo);
            stmt.setInt(index++, alerta);
            stmt.setString(index++, anio);
            stmt.setString(index++, caracEspe1);
            stmt.setString(index++, caracEspe2);
            stmt.setString(index++, codigo);
            stmt.setString(index++, codigoFabrica);
            stmt.setDouble(index++, comision);
            stmt.setString(index++, created);
            stmt.setString(index++, updated);
            stmt.setDouble(index++, descuento);
            stmt.setBoolean(index++, descuentoFijo);
            stmt.setInt(index++, almacenERP);
            stmt.setInt(index++, cuenta);
            stmt.setInt(index++, grupo);
            stmt.setInt(index++, subGrupo);
            stmt.setString(index++, imagen);
            stmt.setDouble(index++, inventaDisponible);
            stmt.setInt(index++, invetaMinimo);
            stmt.setInt(index++, tipoProducto);

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int selectUltimoIdProd() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String consulta = "SELECT Max(ID) FROM PRODUCTO";
        int id = 0;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                id = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return id;
    }

    public int insertProductoBaseExportar(int idUltimoPro, int id_PB, int idP, int idPB, String formulacion, String created, String updated) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO PRODUCTO_BASE (ID_P,ID_PB,IDP,IDPB,FORMULACION,CREATEDAT,UPDATEDAT) \n"
                + "VALUES (?,?,?,?,?,?,?)";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
            stmt.setInt(index++, idUltimoPro);//param 1 => ? 
            stmt.setInt(index++, id_PB);
            stmt.setInt(index++, idP);
            stmt.setInt(index++, idPB);
            stmt.setString(index++, formulacion);
            stmt.setString(index++, created);
            stmt.setString(index++, updated);

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int selectUltimoIdProdBase() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String consulta = "SELECT Max(ID) FROM PRODUCTO_BASE";
        int id = 0;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                id = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return id;
    }

    public int insertProductosBaseExportar(int id_PB, int idpb, boolean activar_inventario, int tipoProducto, String nombre) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO PRODUCTOS_BASE (ID_PB,IDPB,ACTIVAR_INVENTARIO,TIPO_PRODUCTO,NOMBRE) \n"
                + "VALUES (?,?,?,?,?)";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
            stmt.setInt(index++, id_PB);//param 1 => ? 
            stmt.setInt(index++, idpb);
            stmt.setBoolean(index++, activar_inventario);
            stmt.setInt(index++, tipoProducto);
            stmt.setString(index++, nombre);

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int selectUltimoIdProductosBase() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String consulta = "SELECT Max(ID) FROM PRODUCTOS_BASE";
        int id = 0;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                id = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return id;
    }

    public int insertInventarioPBExportar(int id_inv, int almacen, int producto, double cantidad, double cosTotal, double cosUnitario, String created, String lote) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO INVENTARIO_PB (ID_INV, ALMACEN,PRODUCTO,CANTIDAD,COSTO_TOTAL,COSTO_UNITARIO,CREATED,LOTE) \n"
                + "VALUES (?,?,?,?,?,?,?,?)";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
            stmt.setInt(index++, id_inv);//param 1 => ? 
            stmt.setInt(index++, almacen);
            stmt.setInt(index++, producto);
            stmt.setDouble(index++, cantidad);
            stmt.setDouble(index++, cosTotal);
            stmt.setDouble(index++, cosUnitario);
            stmt.setString(index++, created);
            stmt.setString(index++, lote);

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int insertarVenta(int id, int almacen, int actividad, int cliente, int movimiento, String factura, String autorizacion, Timestamp fecha, String fechaLimite, String codigoControl, double importe, int tipoPago, int diasCredito, double aCuenta, double saldo, double total, String created, String updated, int usuario, boolean activa, double pagado, double cambio, int almacenTraspaso, int pedido, boolean despachado, int cierreCaja, int vendedor, boolean contabilizado, boolean usarServicios,String total_literario) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO INV_VENTA (ID, ALMACEN,ACTIVIDAD,CLIENTE,MOVIMIENTO,FACTURA,AUTORIZACION,FECHA,FECHA_LIMITE_EMISION,CODIGO_CONTROL,IMPORTE,TIPO_PAGO,DIAS_CREDITO,A_CUENTA,SALDO,TOTAL,CREATEDAT,UPDATEDAT,USUARIO,ACTIVA,PAGADO,CAMBIO,ALMACEN_TRASPASO,PEDIDO,DESPACHADO,CIERRE_CAJA,VENDEDOR,CONTABILIZADO,USAR_SERVICIOS,TOTAL_LITERARIO) \n"
                + "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        String consultaBuscar = "SELECT * FROM INV_VENTA WHERE ID = "+id;
        String consultaUpdate = "UPDATE INV_VENTA SET ACTIVA = ? WHERE ID = ?";
        int rows = 0; //registros afectados 
        int cont = 0;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consultaBuscar);
            rs = stmt.executeQuery();
            if (rs.next()) {
                stmt = conn.prepareStatement(consultaUpdate); 
                int index = 1; 
                stmt.setBoolean(index++, activa); 
                stmt.setInt(index++, id); 
                
                rows = stmt.executeUpdate(); 
            }else{
                stmt = conn.prepareStatement(consulta);
                int index = 1;//contador de columnas 
                stmt.setInt(index++, id);//param 1 => ? 
                stmt.setInt(index++, almacen);
                stmt.setInt(index++, actividad);
                stmt.setInt(index++, cliente);
                stmt.setInt(index++, movimiento);
                stmt.setString(index++, factura);
                stmt.setString(index++, autorizacion);
                stmt.setTimestamp(index++, fecha);
                stmt.setString(index++, fechaLimite);
                stmt.setString(index++, codigoControl);
                stmt.setDouble(index++, importe);
                stmt.setInt(index++, tipoPago);
                stmt.setInt(index++, diasCredito);
                stmt.setDouble(index++, aCuenta);
                stmt.setDouble(index++, saldo);
                stmt.setDouble(index++, total);
                stmt.setString(index++, created);
                stmt.setString(index++, updated);
                stmt.setInt(index++, usuario);
                stmt.setBoolean(index++, activa);
                stmt.setDouble(index++, pagado);
                stmt.setDouble(index++, cambio);
                stmt.setInt(index++, almacenTraspaso);
                stmt.setInt(index++, pedido);
                stmt.setBoolean(index++, despachado);
                stmt.setInt(index++, cierreCaja);
                stmt.setInt(index++, vendedor);
                stmt.setBoolean(index++, contabilizado);
                stmt.setBoolean(index++, usarServicios);
                stmt.setString(index, total_literario);

                rows = stmt.executeUpdate();
                //no. registros afectados 
                System.out.println("Registros afectados:" + rows);
            }
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int insertarDetalleVenta(int id, int venta, int producto, double precioUnitario, double cantidad, double importe, double descuento, double recargo, double ice, double excento, boolean tipoDescuento, boolean tipoRecargo, double total, String created, String updated, String fechaVencimiento, String lote, int inventario, String observaciones, int servicio) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO APP.INV_DETALLE_VENTA (ID, VENTA, PRODUCTO, PRECIO_UNITARIO, CANTIDAD, IMPORTE, DESCUENTO, RECARGO, ICE, EXCENTO, TIPO_DESCUENTO, TIPO_RECARGO, TOTAL, CREATEDAT, UPDATEDAT, FECHA_VENCIMIENTO, LOTE, INVENTARIO, OBSERVACIONES, SERVICIO) \n" +
"	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String consultaBusqueda = "SELECT * FROM APP.INV_DETALLE_VENTA WHERE ID = "+id;
        int rows = 0; //registros afectados 
        int cont = 0;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consultaBusqueda);
            rs = stmt.executeQuery();
            if (rs.next()) {

            }else{
                stmt = conn.prepareStatement(consulta);
                int index = 1;//contador de columnas 
                stmt.setInt(index++, id);//param 1 => ? 
                stmt.setInt(index++, venta);
                stmt.setInt(index++, producto);
                stmt.setDouble(index++, precioUnitario);
                stmt.setDouble(index++, cantidad);
                stmt.setDouble(index++, importe);
                stmt.setDouble(index++, descuento);
                stmt.setDouble(index++, recargo);
                stmt.setDouble(index++, ice);
                stmt.setDouble(index++, excento);
                stmt.setBoolean(index++, tipoDescuento);
                stmt.setBoolean(index++, tipoRecargo);
                stmt.setDouble(index++, total);
                stmt.setString(index++, created);
                stmt.setString(index++, updated);
                stmt.setString(index++, fechaVencimiento);
                stmt.setString(index++, lote);
                stmt.setInt(index++, inventario);
                stmt.setString(index++, observaciones);
                stmt.setInt(index++, servicio);

                //System.out.println("Ejecutando query:" + SQL_INSERT); 
                rows = stmt.executeUpdate();
                //no. registros afectados 
                System.out.println("Registros detalle venta afectados:" + rows);
            }
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }
     
    public int deleteVentas() {
        Connection conn = null;
        PreparedStatement stmt = null;
        String consulta = "DELETE FROM INV_VENTA";
        int rows = 0;
        try {
            conn = Conexion.getConnection();
            //System.out.println("Ejecutando query:" + consulta);
            stmt = conn.prepareStatement(consulta);

            rows = stmt.executeUpdate();
            System.out.println("Registros venta eliminados:" + rows);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            Conexion.close(stmt);
            Conexion.close(conn);
        }
        return rows;
    }
    
    public int deleteDetalleVentas() {
        Connection conn = null;
        PreparedStatement stmt = null;
        String consulta = "DELETE FROM APP.INV_DETALLE_VENTA";
        int rows = 0;
        try {
            conn = Conexion.getConnection();
            //System.out.println("Ejecutando query:" + consulta);
            stmt = conn.prepareStatement(consulta);

            rows = stmt.executeUpdate();
            System.out.println("Registros detalle venta eliminados:" + rows);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            Conexion.close(stmt);
            Conexion.close(conn);
        }
        return rows;
    }

    public int insertMovimientos(int id, int tipo, int clase, int almacen, String fecha, String created, String updated) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO INV_MOVIMIENTO (ID,TIPO,CLASE,ALMACEN,FECHA,CREATEDAT,UPDATEDAT) \n"
                + "VALUES (?,?,?,?,?,?,?)";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
            stmt.setInt(index++, id);//param 1 => ? 
            stmt.setInt(index++, tipo);
            stmt.setInt(index++, clase);
            stmt.setInt(index++, almacen);
            stmt.setString(index++, fecha);
            stmt.setString(index++, created);
            stmt.setString(index++, updated);

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int insertMovimientosVenta(int id, int tipo, int clase, int almacen, String fecha, String created, String updated) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio

        String consulta = "INSERT INTO INV_MOVIMIENTO (ID,TIPO,CLASE,ALMACEN,FECHA,CREATEDAT,UPDATEDAT) \n"
                + "VALUES (?,?,?,?,?,?,?)";
        String consultaBusqueda = "SELECT * FROM INV_MOVIMIENTO WHERE ID = "+id;
        String consultaUpdate = "UPDATE INV_MOVIMIENTO SET ";
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consultaBusqueda); 
            rs = stmt.executeQuery(); 
            if (rs.next()) {
                System.out.println("Existe Movimiento");
            }else{
                stmt = conn.prepareStatement(consulta);
                int index = 1;//contador de columnas 
                stmt.setInt(index++, id);//param 1 => ? 
                stmt.setInt(index++, tipo);
                stmt.setInt(index++, clase);
                stmt.setInt(index++, almacen);
                stmt.setString(index++, fecha);
                stmt.setString(index++, created);
                stmt.setString(index++, updated);
     
                //System.out.println("Ejecutando query:" + SQL_INSERT); 
                rows = stmt.executeUpdate();
                //no. registros afectados 
                System.out.println("Registros afectados:" + rows);
            }
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }
    
    public int deleteMovimientos() {
        Connection conn = null;
        PreparedStatement stmt = null;
        String consulta = "DELETE FROM INV_MOVIMIENTO";
        int rows = 0;
        try {
            conn = Conexion.getConnection();
            //System.out.println("Ejecutando query:" + consulta);
            stmt = conn.prepareStatement(consulta);

            rows = stmt.executeUpdate();
            System.out.println("Registros eliminados en movimientos:" + rows);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            Conexion.close(stmt);
            Conexion.close(conn);
        }
        return rows;
    }

    public int insertCliente(int id, String razonSocial, String nit) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio
        int cont = 0;
        String consulta = "INSERT INTO CLIENTE (ID,RAZON_SOCIAL,NIT) \n"
                + "VALUES (?,?,?)";
        String consultaBusqueda = "SELECT * FROM CLIENTE WHERE ID = "+id;
        String consultaUpdate = "UPDATE CLIENTE SET ID = ?, RAZON_SOCIAL = ?, NIT = ? WHERE ID = "+id;
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consultaBusqueda); 
            rs = stmt.executeQuery(); 
            if (rs.next()) {
                stmt = conn.prepareStatement(consultaUpdate); 
                int index = 1; 
                stmt.setInt(index++, id); 
                stmt.setString(index++, razonSocial); 
                stmt.setString(index, nit); 
                rows = stmt.executeUpdate(); 
            }else{           
                stmt = conn.prepareStatement(consulta);
                int index = 1;//contador de columnas 
                stmt.setInt(index++, id);//param 1 => ? 
                stmt.setString(index++, razonSocial);
                stmt.setString(index++, nit);

                //System.out.println("Ejecutando query:" + SQL_INSERT); 
                rows = stmt.executeUpdate();
                //no. registros afectados 
                System.out.println("Registros de cliente afectados:" + rows);
            }
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int deleteCliente() {
        Connection conn = null;
        PreparedStatement stmt = null;
        String consulta = "DELETE FROM CLIENTE";
        int rows = 0;
        try {
            conn = Conexion.getConnection();
            //System.out.println("Ejecutando query:" + consulta);
            stmt = conn.prepareStatement(consulta);

            rows = stmt.executeUpdate();
            System.out.println("Registros eliminados en clientes:" + rows);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            Conexion.close(stmt);
            Conexion.close(conn);
        }
        return rows;
    }

    public List<Ventas> seleccionarVentasExport() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Ventas venta = null;
        List<Ventas> lista = new ArrayList<>();
        String consulta = "SELECT * FROM APP.INV_VENTA";
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt(1);
                int aCuenta = rs.getInt(2);
                int actividad = rs.getInt(3);
                int almacen = rs.getInt(4);
                double cambio = rs.getDouble(5);
                int cliente = rs.getInt(6);
                boolean despachado = rs.getBoolean(7);
                String fecha = rs.getString(8);
                String fechaTexto = rs.getString(9);
                int empresa = rs.getInt(10);
                int usuario = rs.getInt(11);
                double importe = rs.getDouble(12);
                int movimiento = rs.getInt(13);
                double pagado = rs.getDouble(14);
                double saldo = rs.getDouble(15);
                int sucursal = rs.getInt(16);
                int tipoPago = rs.getInt(17);
                double total = rs.getDouble(18);
                double vendedor = rs.getDouble(19);

                venta = new Ventas(id, aCuenta, actividad, almacen, cambio, cliente, despachado, fecha, fechaTexto, empresa, usuario, importe, movimiento, pagado, saldo, sucursal, tipoPago, total, vendedor);
                lista.add(venta);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return lista;
    }

    public List<Actividad> seleccionarActividadPorIdDetalle(int idDetalle) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Actividad actividad = null;
        List<Actividad> lista = new ArrayList<>();
        String consulta = "SELECT * FROM ACTIVIDAD WHERE id = " + idDetalle;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt(1);
                int idActividad = rs.getInt(2);
                int idTipo = rs.getInt(3);
                String nombre = rs.getString(4);
                String nombreCorto = rs.getString(5);
                boolean eliminado = rs.getBoolean(6);
                boolean habilitado = rs.getBoolean(7);

                actividad = new Actividad(id, idActividad, idTipo, nombre, nombreCorto, eliminado, habilitado);
                lista.add(actividad);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return lista;
    }

    public List<AlmacenExpo> seleccionarAlmacenPorIdDetalle(int idAlmacen) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        AlmacenExpo almacen = null;
        List<AlmacenExpo> lista = new ArrayList<>();
        String consulta = "SELECT * FROM ALMACEN WHERE ID = " + idAlmacen;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt(1);
                int idAlmacenes = rs.getInt(2);
                int sucursal = rs.getInt(3);
                String nombre = rs.getString(4);
                int numero = rs.getInt(5);
                String direccion = rs.getString(6);

                almacen = new AlmacenExpo(id, idAlmacenes, sucursal, nombre, numero, direccion);
                lista.add(almacen);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return lista;
    }

    public List<ClienteExpor> seleccionarClientePorIdCliente(int idCliente) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        ClienteExpor cliente = null;
        List<ClienteExpor> lista = new ArrayList<>();
        String consulta = "SELECT * FROM CLIENTE WHERE ID = " + idCliente;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt(1);
                String nit = rs.getString(2);
                String razonSocial = rs.getString(3);

                cliente = new ClienteExpor(id, nit, razonSocial);
                lista.add(cliente);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return lista;
    }

    public List<DetalleVentaExport> seleccionarDetallePorIdVenta(int idVenta) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        DetalleVentaExport detalle = null;
        List<DetalleVentaExport> lista = new ArrayList<>();
        String consulta = "SELECT * FROM DETALLE_VENTA WHERE ID_V = " + idVenta;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt(1);
                int cantidad = rs.getInt(3);
                double descuento = rs.getDouble(4);
                int excento = rs.getInt(5);
                int ice = rs.getInt(6);
                double importe = rs.getDouble(7);
                double inventrioDisponible = rs.getDouble(8);
                double precioUnitario = rs.getDouble(9);
                int cargo = rs.getInt(10);
                boolean tipoDescuento = rs.getBoolean(11);
                boolean tipoRecargo = rs.getBoolean(12);
                double total = rs.getDouble(13);

                detalle = new DetalleVentaExport(id, cantidad, descuento, excento, ice, importe, inventrioDisponible, precioUnitario, cargo, tipoDescuento, tipoRecargo, total);
                lista.add(detalle);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return lista;
    }

    public List<costosExport> seleccionarCostoPorIdDetalle(int idDetalleV) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        costosExport costo = null;
        List<costosExport> lista = new ArrayList<>();
        String consulta = "SELECT * FROM COSTOS WHERE ID_D = " + idDetalleV;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int idDetalle = rs.getInt(1);
                int idCosto = rs.getInt(3);
                int almacen = rs.getInt(4);
                int producto = rs.getInt(5);
                double cantidad = rs.getDouble(6);
                double costoTotal = rs.getDouble(7);
                double costoUnitario = rs.getDouble(8);
                String createdat = rs.getString(9);
                String fechaVencimiento = rs.getString(10);
                String lote = rs.getString(11);
                String updatedat = rs.getString(12);

                costo = new costosExport(idDetalle, idCosto, almacen, producto, cantidad, costoTotal, costoUnitario, createdat, fechaVencimiento, lote, updatedat);
                lista.add(costo);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return lista;
    }

    public List<ProductoExport> seleccionarProductoPorIdDetalle(int idDetalleV) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        ProductoExport producto = null;
        List<ProductoExport> lista = new ArrayList<>();
        String consulta = "SELECT * FROM PRODUCTO WHERE ID_D = " + idDetalleV;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int id_P = rs.getInt(1);
                int idDetalle = rs.getInt(2);
                int idProducto = rs.getInt(3);
                int empresa = rs.getInt(4);
                boolean activarInventario = rs.getBoolean(5);
                int activarFijo = rs.getInt(6);
                int alerta = rs.getInt(7);
                String anio = rs.getString(8);
                String caract1 = rs.getString(9);
                String caract2 = rs.getString(10);
                String codigo = rs.getString(11);
                String codigoFabrica = rs.getString(12);
                double comision = rs.getDouble(13);
                String createdAt = rs.getString(14);
                String updatedAt = rs.getString(15);
                double descuento = rs.getDouble(16);
                boolean descuentoFijo = rs.getBoolean(17);
                int almacenERP = rs.getInt(18);
                int cuenta = rs.getInt(19);
                int grupo = rs.getInt(20);
                int subgrupo = rs.getInt(21);
                String imagen = rs.getString(22);
                double inventarioDisponible = rs.getDouble(23);
                int inventarioMinimo = rs.getInt(24);
                int tipoProducto = rs.getInt(25);

                producto = new ProductoExport(id_P, idDetalle, idProducto, empresa, activarInventario, activarFijo, alerta, anio, caract1, caract2, codigo, codigoFabrica, comision, createdAt, updatedAt, descuento, descuentoFijo, almacenERP, cuenta, grupo, subgrupo, imagen, inventarioDisponible, inventarioMinimo, tipoProducto);
                lista.add(producto);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return lista;
    }

    public List<ProductoBaseExport> seleccionarProductoBasePorIdDetalle(int id_P, int id_Pro) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        ProductoBaseExport productoBase = null;
        List<ProductoBaseExport> lista = new ArrayList<>();
        String consulta = "SELECT * FROM PRODUCTO_BASE WHERE ID_P = " + id_P + " AND IDP = " + id_Pro;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt(1);
                int id_Producto = rs.getInt(2);
                int id_ProdBase = rs.getInt(3);
                int idProducto = rs.getInt(4);
                int idProdBase = rs.getInt(5);
                String formulario = rs.getString(6);
                String createdat = rs.getString(7);
                String updatedat = rs.getString(8);

                productoBase = new ProductoBaseExport(id, id_Producto, id_ProdBase, idProducto, idProdBase, formulario, createdat, updatedat);
                lista.add(productoBase);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return lista;
    }

    public List<ProductosBaseExport> seleccionarProductosBasePorIdDetalle(int id_PB, int idPB) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        ProductosBaseExport productosBase = null;
        List<ProductosBaseExport> lista = new ArrayList<>();
        String consulta = "SELECT * FROM PRODUCTOS_BASE WHERE ID_PB = " + id_PB + " AND IDPB = " + idPB;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt(1);
                int id_ProductoBase = rs.getInt(2);
                int idProductoBase = rs.getInt(3);
                boolean activarInventario = rs.getBoolean(4);
                int tipoProducto = rs.getInt(5);
                String nombre = rs.getString(6);

                productosBase = new ProductosBaseExport(id, id_ProductoBase, idProductoBase, activarInventario, tipoProducto, nombre);
                lista.add(productosBase);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return lista;
    }

    public List<Inventario> seleccionarInventarioPorIdProducto(int id_P) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Inventario inventario = null;
        List<Inventario> lista = new ArrayList<>();
        String consulta = "SELECT * FROM COSTOS WHERE ID_D = " + id_P;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int id_Producto = rs.getInt(2);
                int idInventario = rs.getInt(3);
                int almacen = rs.getInt(4);
                int producto = rs.getInt(5);
                double cantidad = rs.getDouble(6);
                double costoTotal = rs.getDouble(7);
                double costoUnitario = rs.getDouble(8);
                String createdAt = rs.getString(9);
                String fechaVencimiento = rs.getString(10);
                String lote = rs.getString(11);
                String updatedAt = rs.getString(12);
                
                inventario = new Inventario(idInventario, almacen, producto, cantidad, costoUnitario, costoTotal, createdAt, updatedAt, fechaVencimiento, lote);
                lista.add(inventario);

                
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return lista;
    }
    
    public List<ProductoBaseExport> seleccionarProductoBasePorIdBP(int id_P, int id_Pro) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        ProductoBaseExport productoBase = null;
        List<ProductoBaseExport> lista = new ArrayList<>();
        String consulta = "SELECT * FROM PRODUCTO_BASE WHERE ID_PB = " + id_P + " AND IDPB = " + id_Pro;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt(1);
                int id_Producto = rs.getInt(2);
                int id_ProdBase = rs.getInt(3);
                int idProducto = rs.getInt(4);
                int idProdBase = rs.getInt(5);
                String formulario = rs.getString(6);
                String createdat = rs.getString(7);
                String updatedat = rs.getString(8);

                productoBase = new ProductoBaseExport(id, id_Producto, id_ProdBase, idProducto, idProdBase, formulario, createdat, updatedat);
                lista.add(productoBase);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return lista;
    } 
    
    public int insertarEmpresa(int id, String razon_social, String nit, String direccion, int tele1, int tele2, int tele3, int departamento, String municipio, boolean usar_panel, boolean usar_vencimiento, boolean usar_servicios, boolean usar_consumos, boolean usar_descuentos, boolean usar_georeferencia, boolean pedidos, boolean usar_pantalla_cliente, boolean usar_pantalla_despacho, boolean usar_mesas, boolean usar_salas, boolean usar_contabilidad,boolean usar_medico,boolean usar_mantenimiento, boolean usar_cuentas_auxiliares, String created,String updated) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio
        int cont = 0;
        String consulta = "INSERT INTO EMPRESA (ID, RAZON_SOCIAL, NIT, DIRECCION, TELEFONO1, TELEFONO2, TELEFONO3, DEPARTAMENTO, MUNICIPIO, CREATEDAT, UPDATEDAT, USAR_PANEL, USAR_VENCIMIENTOS, USAR_SERVICIOS, USAR_CONSUMOS, USAR_DESCUENTOS, USAR_GEOREFERENCIACION, USAR_PEDIDOS, USAR_PANTALLA_CLIENTE, USAR_PANTALLA_DESPACHO, USAR_MESAS, USAR_SALAS, USAR_CONTABILIDAD, USAR_MEDICO, USAR_MANTENIMIENTO, USAR_CUENTAS_AUXILIARES) \n" +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String consulta1 = "SELECT * FROM EMPRESA WHERE ID = "+id;
        int rows = 0; //registros afectados 
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            
            stmt = conn.prepareStatement(consulta1);
            rs = stmt.executeQuery();
            if (rs.next()) {
                System.out.println("existe"); 
            }else{
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas 
                stmt.setInt(index++, id);//param 1 => ? 
                stmt.setString(index++, razon_social);
                stmt.setString(index++, nit);
                stmt.setString(index++, direccion);
                stmt.setInt(index++, tele1);
                stmt.setInt(index++, tele2);
                stmt.setInt(index++, tele3);
                stmt.setInt(index++, departamento);
                stmt.setString(index++, municipio);
                stmt.setString(index++, created);
                stmt.setString(index++, updated);
                stmt.setBoolean(index++, usar_panel);
                stmt.setBoolean(index++, usar_vencimiento);
                stmt.setBoolean(index++, usar_servicios);
                stmt.setBoolean(index++, usar_consumos);
                stmt.setBoolean(index++, usar_descuentos);
                stmt.setBoolean(index++, usar_georeferencia);
                stmt.setBoolean(index++, pedidos);
                stmt.setBoolean(index++, usar_pantalla_cliente);
                stmt.setBoolean(index++, usar_pantalla_despacho);
                stmt.setBoolean(index++, usar_mesas);
                stmt.setBoolean(index++, usar_salas);
                stmt.setBoolean(index++, usar_contabilidad);
                stmt.setBoolean(index++, usar_medico);
                stmt.setBoolean(index++, usar_mantenimiento);
                stmt.setBoolean(index++, usar_cuentas_auxiliares);

            //System.out.println("Ejecutando query:" + SQL_INSERT); 
            rows = stmt.executeUpdate();
            //no. registros afectados 
            System.out.println("Registros afectados:" + rows);
            }
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }
}
