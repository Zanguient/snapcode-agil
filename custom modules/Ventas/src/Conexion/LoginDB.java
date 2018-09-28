/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Conexion;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author AGIL
 */
public class LoginDB {

    private java.sql.Connection userConn;
    //private final String SQL_INSERT =
    // "INSERT INTO persona(nombre, apellido) VALUES(?,?)";
    //private final String SQL_UPDATE =
    //"UPDATE persona SET nombre=?, apellido=? WHERE id_persona=?";
    //private final String SQL_DELETE =
    //"DELETE FROM persona WHERE id_persona = ?";

    public LoginDB() {
    }

    public LoginDB(Connection conn) {
        this.userConn = conn;
    }

    public boolean existeUsuario(int id) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        boolean res = false;
        String consulta = "SELECT * FROM USUARIO WHERE ID = " + id;
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            if (rs.next()) {
                res = true;
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return res;
    }

    public int ingresarUsuario(int id, int id_persona, int id_empresa, String nombre_usuario, String clave, String token, boolean activo, String created, boolean eliminado, int comision_general, int comision_activa) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio
        int rows = 0; //registros afectados
        String consulta
                = "INSERT INTO usuario (ID, PERSONA, EMPRESA, NOMBRE_USUARIO, CLAVE, TOKEN, ACTIVO, CREATEDAT, UPDATEDAT, COMISION_GENERAL, COMISION_ACTIVA, ELIMINADO) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";
        try {
            conn = (this.userConn != null) ? this.userConn
                    : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas
            stmt.setInt(index++, id);//param 1 => ?
            stmt.setInt(index++, id_persona);//param 2 => ?
            stmt.setInt(index++, id_empresa);//param 2 => ?
            stmt.setString(index++, nombre_usuario);//param 2 => ?
            stmt.setString(index++, clave);//param 2 => ?
            stmt.setString(index++, token);//param 2 => ?
            stmt.setBoolean(index++, activo);//param 2 => ?
            stmt.setString(index++, created);
            stmt.setString(index++, created);
            stmt.setInt(index++, comision_general);
            stmt.setInt(index++, comision_activa);
            stmt.setBoolean(index++, eliminado);

            //System.out.println("Ejecutando query:" + SQL_INSERT);
            rows = stmt.executeUpdate();//no. registros afectados
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }

    public int actualizarUsuario(int id,String nombre_usuario,String clave,String token,boolean activo,String updated)throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        int rows = 0;
        String consulta = "UPDATE usuario SET nombre_usuario=?,clave=?,token=?,activo=?,updatedAt=? WHERE id=?";
        try {
            conn = (this.userConn != null) ? this.userConn
                    : Conexion.getConnection();
            //System.out.println("Ejecutando query:" + SQL_UPDATE);
            stmt = conn.prepareStatement(consulta);
            int index = 1;
            stmt.setString(index++, nombre_usuario);
            stmt.setString(index++, clave);
            stmt.setString(index++, token);
            stmt.setBoolean(index++, activo);
            stmt.setString(index++, updated);          
            stmt.setInt(index, id);
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

    public boolean existeUsuarioSinRed(String usuario,String clave) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        boolean res = false;
        String consulta = "SELECT * FROM usuario WHERE nombre_usuario='"+usuario+"' AND clave='"+clave+"'";
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            if (rs.next()) {
                res = true;
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return res;
    }
    
    public int obtenerIdUsuario(String usuario,String clave) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int res = 0;
        String consulta = "SELECT id FROM usuario WHERE nombre_usuario='"+usuario+"' AND clave='"+clave+"'";
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {                
                res = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return res;
    }
    
    public int obtenerIdEmpresa(String usuario,String clave) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        int res = 0;
        String consulta = "SELECT empresa FROM usuario WHERE nombre_usuario='"+usuario+"' AND clave='"+clave+"'";
        try {
            conn = (this.userConn != null) ? this.userConn : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            rs = stmt.executeQuery();
            while (rs.next()) {                
                res = rs.getInt(1);
            }
        } finally {
            Conexion.close(rs);
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return res;
    }
    
    public int registrar(int id_usuario, java.sql.Date fecha) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;//no se utiliza en este ejercicio
        int rows = 0; //registros afectados
        String consulta
                = "INSERT INTO REGISTRO (USUARIO, FECHA) VALUES(?,?)";
        try {
            conn = (this.userConn != null) ? this.userConn
                    : Conexion.getConnection();
            stmt = conn.prepareStatement(consulta);
            int index = 1;//contador de columnas
            stmt.setInt(index++, id_usuario);//param 1 => ?
            stmt.setDate(index++, fecha);//param 2 => ?

            //System.out.println("Ejecutando query:" + SQL_INSERT);
            rows = stmt.executeUpdate();//no. registros afectados
            System.out.println("Registros afectados:" + rows);
        } finally {
            Conexion.close(stmt);
            if (this.userConn == null) {
                Conexion.close(conn);
            }
        }
        return rows;
    }
}
