/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import model_detalle_producto.detalleSolicitudProducto;
import model_detalle_producto_base.detalleSolicitudProductoBase;
import model_solicitud.solicitudReposicion;

/**
 *
 * @author AGIL
 */
public class InventarioDB {

    private java.sql.Connection userConn;
    //private final String SQL_INSERT =
    // "INSERT INTO persona(nombre, apellido) VALUES(?,?)";
    //private final String SQL_UPDATE =
    //"UPDATE persona SET nombre=?, apellido=? WHERE id_persona=?";
    //private final String SQL_DELETE =
    //"DELETE FROM persona WHERE id_persona = ?";

    public InventarioDB() {
    }

    public InventarioDB(Connection conn) {
        this.userConn = conn;
    }

    public ArrayList<solicitudReposicion>  seleccionarSolicitudReposicion(int id) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        solicitudReposicion solicitud = null;
        ArrayList<solicitudReposicion> lista = new ArrayList<>();
        String consulta = "SELECT ID,ALMACEN,USUARIO,ACTIVO,ELIMINADO,MONTO,NOMBRE_SUCURSAL,FECHA "+
                           "FROM SOLICITUD_REPOSICION "+
                           "WHERE ID = "+ id;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int idS = rs.getInt(1);
                int almacen = rs.getInt(2);
                int usuario = rs.getInt(3);
                boolean activo = rs.getBoolean(4);
                boolean eliminado = rs.getBoolean(5);
                double monto = rs.getDouble(6);
                String nomSucursal = rs.getString(7);
                Timestamp fecha = rs.getTimestamp(8);
                
                solicitud = new solicitudReposicion(idS, almacen, usuario, fecha, activo, eliminado, null, null, monto, nomSucursal);
                lista.add(solicitud);
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
    
    public ArrayList<detalleSolicitudProducto>  seleccionarSolicitudProducto(int id) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        detalleSolicitudProducto productos = null;
        ArrayList<detalleSolicitudProducto> lista = new ArrayList<>();
        String consulta = "SELECT ID,SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT "
                        + "FROM DETALLE_SOLICITUD_PRODUCTO "
                        + "WHERE SOLICITUD = "+id;
try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int idDP = rs.getInt(1);
                int solicitud = rs.getInt(2);
                int producto = rs.getInt(3);
                double cantidad = rs.getDouble(4);
                java.sql.Date created = rs.getDate(5);
                java.sql.Date updated = rs.getDate(6);
                
                productos = new detalleSolicitudProducto(idDP, solicitud, producto, cantidad, created, updated);
                lista.add(productos);
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

    public ArrayList<detalleSolicitudProductoBase>  seleccionarSolicitudProductoBase(int id) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        detalleSolicitudProductoBase productosB = null;
        ArrayList<detalleSolicitudProductoBase> lista = new ArrayList<>();
        String consulta = "SELECT ID,ALMACEN,USUARIO,ACTIVO,ELIMINADO,MONTO,NOMBRE_SUCURSAL,FECHA "+
                           "FROM SOLICITUD_REPOSICION "+
                           "WHERE ID = "+ id;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int idDPB = rs.getInt(1);
                int detalleProducto = rs.getInt(2);
                int productoBase = rs.getInt(3);
                double cantidadIdeal = rs.getDouble(4);
                double cantidadReal = rs.getDouble(5);
                double total = rs.getDouble(6);
                
                productosB = new detalleSolicitudProductoBase(idDPB, detalleProducto, productoBase, cantidadIdeal, cantidadReal, null, null, total);
                lista.add(productosB);
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
        
    public int updateSolicitud(int id) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        int rows = 0;
        String consulta = "UPDATE solicitud_reposicion SET activo = ? WHERE id = ?";
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            //System.out.println("Ejecutando query:" + SQL_UPDATE);
            stmt = conn.prepareStatement(consulta);
            int index = 1;
            stmt.setBoolean(index++, false);
            stmt.setInt(index++, id);
            rows = stmt.executeUpdate();
            System.out.println("Registros actualizados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }
    
    public int seleccionarCantidadSolicitud() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int count = 0;
        String consulta = "SELECT COUNT(*) \n" +
            "FROM SOLICITUD_REPOSICION AS S\n" +
            "INNER JOIN DETALLE_SOLICITUD_PRODUCTO AS DSP ON DSP.SOLICITUD = S.ID";
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                count = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return count;
    }
    
    public int seleccionarCantidadCerrar() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int count = 0;
        String consulta = "SELECT * \n" +
        "FROM SOLICITUD_REPOSICION_CIERRE AS SR\n" +
        "INNER JOIN DETALLE_SOLICITUD_PRODUCTO_CIERRE AS DSPC ON SR.ID = DSPC.SOLICITUD";
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                count = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return count;
    }
    
    public ArrayList<solicitudReposicion>  seleccionarSolicitudReposicionTodo() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        solicitudReposicion solicitud = null;
        ArrayList<solicitudReposicion> lista = new ArrayList<>();
        String consulta = "SELECT ID,ALMACEN,USUARIO,ACTIVO,ELIMINADO,MONTO,NOMBRE_SUCURSAL,FECHA "
                + "FROM SOLICITUD_REPOSICION "
                + "WHERE ELIMINADO = "+false;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                 int id = rs.getInt(1);
                int almacen = rs.getInt(2);
                int usuario = rs.getInt(3);
                boolean activo = rs.getBoolean(4);
                boolean eliminado = rs.getBoolean(5);
                double monto = rs.getDouble(6);
                String nombreSucur = rs.getString(7);
                Timestamp fecha = rs.getTimestamp(8);
                
                solicitud = new solicitudReposicion(id, almacen, usuario, fecha, activo, eliminado, null, null, monto, nombreSucur);
                lista.add(solicitud);
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
    
    public ArrayList<detalleSolicitudProducto>  seleccionarSolicitudProductoTodo() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        detalleSolicitudProducto productos = null;
        ArrayList<detalleSolicitudProducto> lista = new ArrayList<>();
        String consulta = "SELECT ID,SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT "
                + "FROM DETALLE_SOLICITUD_PRODUCTO";
try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt(1);
                int solicitud = rs.getInt(2);
                int producto = rs.getInt(3);
                double cantidad = rs.getDouble(4);
                java.sql.Date created = rs.getDate(5);
                java.sql.Date updated = rs.getDate(6);
                
                productos = new detalleSolicitudProducto(id, solicitud, producto, cantidad, created, updated);
                lista.add(productos);
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
    
    public ArrayList<detalleSolicitudProductoBase>  seleccionarSolicitudProductoBaseTodo() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        detalleSolicitudProductoBase productosB = null;
        ArrayList<detalleSolicitudProductoBase> lista = new ArrayList<>();
        String consulta = "SELECT ID,DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,TOTAL\n" +
            "FROM DETALLE_SOLICITUD_PRODUCTO_BASE";
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt(1);
                int detalleSP = rs.getInt(2);
                int producto_base = rs.getInt(3);
                double cantidadIdeal = rs.getDouble(4);
                double cantidadReal = rs.getDouble(5);
                double total = rs.getDouble(6);
                
                productosB = new detalleSolicitudProductoBase(id, detalleSP, producto_base, cantidadIdeal, cantidadReal, null, null, total);
                lista.add(productosB);
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
}
