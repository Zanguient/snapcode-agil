/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import static PanelUI.NuevoAdminUsuarioUI.Encriptar;
import java.security.MessageDigest;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import modelo_Admin.ListaUsuarioAdmin;
import modelo_Usuario.ListaUsuario;
import modelo_Usuario.ListaUsuarioGrupos;
import modelo_Usuario.ListaUsuarioSucursal;
import modelo_Usuario.listaRoles;
import models.Database;
import models.RenderTable;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.StringUtils;
import org.apache.commons.codec.digest.MessageDigestAlgorithms;

/**
 *
 * @author AGIL
 */
public class NuevoPanelUsuarioCli extends javax.swing.JDialog {
    public int id_usuario;
    public int id_persona;
    public int contVali ;
    public Database db = new Database();
    DefaultTableModel modelSucTabla;
    DefaultTableModel modelGrupo;
    DefaultTableModel modelUsuarioTabla;
    
    public JButton editar;
    public ImageIcon imgEditar;
    public Icon iconEditar;
     
    public JButton eliminar;
    public ImageIcon imgEliminar;
    public Icon iconEliminar;
    
    /**
     * Creates new form NuevoPanelUsuarioCli
     */
    public NuevoPanelUsuarioCli(java.awt.Frame parent, boolean modal,int id_usuario) {
        super(parent, modal);
        initComponents();
        setLocationRelativeTo(this);
        this.id_usuario = id_usuario;
        
        requerido.setVisible(false);
        requerido1.setVisible(false);
        requerido2.setVisible(false);
        requerido3.setVisible(false);
        
        String[] columnaUsua = {"Aplicacion","Ver","Crear","Modificar","Modificar"};
        modelUsuarioTabla = (DefaultTableModel)tablaUsuarios.getModel();
        //modelUsuarioTabla = new DefaultTableModel(null,columnaUsua);
        //tablaUsuarios.setDefaultRenderer(Object.class, new RenderTable());
        
        String[] columnaSuc = {"Sucursal","Eliminar"};
        modelSucTabla = new DefaultTableModel(null,columnaSuc);
        tablaSucursal.setDefaultRenderer(Object.class, new RenderTable());
        
        String[] columnaGrup = {"Grupo","Eliminar"};
        modelGrupo = new DefaultTableModel(null,columnaGrup);
        tablaGrupos.setDefaultRenderer(Object.class, new RenderTable());
        insertarBotones();
        
        obtenerRoles();
        obtenerEmpresa();
        obtenerSucursal();
        obtenerGrupos();
        //obtenerRolesAplicaciones();
    }
    
    public NuevoPanelUsuarioCli(java.awt.Frame parent, boolean modal,int id_usuario,int id_persona){
        super(parent,modal);
        initComponents();
        setLocationRelativeTo(this);
        this.id_usuario = id_usuario;
        this.id_persona = id_persona;
        
        requerido.setVisible(false);
        requerido1.setVisible(false);
        requerido2.setVisible(false);
        requerido3.setVisible(false);
        
        String[] columnaUsua = {"Aplicacion","Ver","Crear","Modificar","Modificar"};
        modelUsuarioTabla = (DefaultTableModel)tablaUsuarios.getModel();
        //modelUsuarioTabla = new DefaultTableModel(null,columnaUsua);
        //tablaUsuarios.setDefaultRenderer(Object.class, new RenderTable());
        
        String[] columnaSuc = {"Sucursal","Eliminar"};
        modelSucTabla = new DefaultTableModel(null,columnaSuc);
        tablaSucursal.setDefaultRenderer(Object.class, new RenderTable());
        
        String[] columnaGrup = {"Grupo","Eliminar"};
        modelGrupo = new DefaultTableModel(null,columnaGrup);
        tablaGrupos.setDefaultRenderer(Object.class, new RenderTable());
        insertarBotones();
        
        obtenerRoles();
        obtenerEmpresa();
        obtenerSucursal();
        obtenerGrupos();
        obtenerDatosUsuario();
        //obtenerRolesAplicaciones();
    }
    
    public int obtenerIdUsuarioRol(){
        int id = 0;
        String consulta = "SELECT UR.ID\n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN USUARIO_ROL AS UR ON UR.USUARIO = U.ID\n" +
            "WHERE U.PERSONA = "+this.id_persona;
        ResultSet rs = null;
        try{
            rs = db.seleccionar(consulta);
           while(rs.next()){
               id = rs.getInt(1);
           } 
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        return id;
    }
    
    public int obtenerIdUsuario(){
        ResultSet rs = null;
        int id = 0;
        String consulta = "SELECT ID \n" +
            "FROM USUARIO\n" +
            "WHERE PERSONA = "+this.id_persona;
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                id = rs.getInt(1);
            } 
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        return id;
    }
    
    public void ListarUsuarioGrupos(){
        ResultSet rs = null;
        ArrayList<ListaUsuarioGrupos> arrayUsuarioGrupos = new ArrayList();
        String consulta = "SELECT T.NOMBRE\n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN USUARIO_GRUPOS AS UG ON UG.USUARIO = U.ID\n" +
            "INNER JOIN TIPO AS T ON T.ID = UG.GRUPO\n" +
            "WHERE U.PERSONA = "+this.id_persona+" AND U.ELIMINADO = "+false+" AND UG.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                ListaUsuarioGrupos listaUsuaGrupo = new ListaUsuarioGrupos(rs.getString(1));
                arrayUsuarioGrupos.add(listaUsuaGrupo);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }
    
    public ArrayList<ListaUsuarioGrupos> ListaUsuarioGrupo(){
        ArrayList<ListaUsuarioGrupos> arregloUsuarioGrupos = new ArrayList();
        ResultSet rs = null;
        String consulta = "SELECT C.NOMBRE\n" +
            "FROM USUARIO U \n" +
            "INNER JOIN USUARIO_GRUPOS AS UG ON UG.USUARIO = U.ID\n" +
            "INNER JOIN CLASE AS C ON C.ID = UG.GRUPO\n" +
            "WHERE U.PERSONA = "+this.id_persona+" AND U.ELIMINADO = "+false+" AND UG.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                ListaUsuarioGrupos listaUsuGrup = new ListaUsuarioGrupos(rs.getString(1));
                arregloUsuarioGrupos.add(listaUsuGrup);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        
        return arregloUsuarioGrupos;
    }
    
    public ArrayList<ListaUsuarioSucursal> ListaUsuarioSucursal(){
        ResultSet rs = null;
        ArrayList<ListaUsuarioSucursal> arregloUsuaSucursal = new ArrayList();
        String consulta = "SELECT S.NOMBRE\n" +
        "FROM USUARIO AS U\n" +
        "INNER JOIN USUARIO_SUCURSAL AS US ON US.USUARIO = U.ID\n" +
        "INNER JOIN SUCURSAL AS S ON S.ID = US.SUCURSAL\n" +
        "WHERE U.PERSONA = "+this.id_persona+" AND S.ELIMINADO = "+false+" AND US.ELIMINADO = "+false+" AND S.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
               ListaUsuarioSucursal listaUsuaSucur = new ListaUsuarioSucursal(rs.getString(1));
               arregloUsuaSucursal.add(listaUsuaSucur);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
               ex.printStackTrace();
            }
        }
        return arregloUsuaSucursal;
    }
    
    public List<ListaUsuario> ListaDatosUsuario(){
        ResultSet rs = null;
        List<ListaUsuario> arregloUsuario = new ArrayList();
        String consulta = "SELECT P.NOMBRES,P.APELLIDO_PATERNO,P.APELLIDO_MATERNO, U.NOMBRE_USUARIO,U.CLAVE,R.NOMBRE ,U.ACTIVO,\n" +
            "E.RAZON_SOCIAL\n" +
            "FROM PERSONA AS P\n" +
            "INNER JOIN USUARIO AS U ON P.ID = U.PERSONA\n" +
            "INNER JOIN USUARIO_ROL AS UR ON UR.USUARIO = U.ID\n" +
            "LEFT JOIN ROL AS R ON R.ID = UR.ROL\n" +
            "INNER JOIN EMPRESA AS E ON E.ID = U.EMPRESA\n" +
            "INNER JOIN USUARIO_SUCURSAL AS US ON US.USUARIO = U.ID\n" +
            "WHERE P.ID = "+this.id_persona+" AND P.ELIMINADO = "+false+" AND U.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                String nombre = rs.getString(1);
                String apellido_p = rs.getString(2);
                String apellido_m = rs.getString(3);
                String usuario = rs.getString(4);
                String clave = decode(rs.getString(5));
                String rol = rs.getString(6);
                boolean activo = rs.getBoolean(7);
                String empresa = rs.getString(8);
    
                
                ListaUsuario listaUsuarios = new ListaUsuario(nombre, apellido_p, apellido_m, usuario, clave, rol, activo, empresa);
                arregloUsuario.add(listaUsuarios);
            }
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(null, "Error al listar los datos del usuario.");
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        return arregloUsuario;
    }
    
    public void ListaDatosAplicacion(){
        ResultSet rs = null;
    
        String consulta = "SELECT A.TITULO, UA.PUEDE_VER,UA.PUEDE_CREAR,UA.PUEDE_MODIFICAR,UA.PUEDE_ELIMINAR\n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN USUARIO_APLICACION AS UA ON UA.USUARIO = U.ID\n" +
            "INNER JOIN APLICACION AS A ON A.ID = UA.APLICACION\n" +
            "WHERE U.PERSONA = "+this.id_persona+" AND U.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                String aplicacion = rs.getString(1);
                boolean ver = rs.getBoolean(2);
                boolean crear = rs.getBoolean(3);
                boolean modificar = rs.getBoolean(4);
                boolean eliminar = rs.getBoolean(5);
                
                Object[] datos = {aplicacion,ver,crear,modificar,eliminar};
                modelUsuarioTabla.addRow(datos);
;
            }
            tablaUsuarios.setModel(modelUsuarioTabla);
            tamañoTabla();
        } catch (Exception e) {
            e.printStackTrace();
            
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        } 
    }
    
    public void obtenerDatosUsuario(){
        List<ListaUsuario> lista = ListaDatosUsuario();        
        
        for (ListaUsuario listaUsuario: lista) {
            nombrePersona.setText(listaUsuario.getNombre());
            apelliPaterPersona.setText(listaUsuario.getApellido_p());
            apelliMaterPersona.setText(listaUsuario.getApellido_m());
            usuario.setText(listaUsuario.getUsuario());
            claveUsuario.setText(listaUsuario.getClave());
            comboRol.setSelectedItem(listaUsuario.getRol());
            activoUsuario.setSelected(listaUsuario.isActivo());
            empresa.setText(listaUsuario.getEmpresa());
            //com.setSelectedItem(listaUsuarioAdmin.getSucursal());
        }
        
        ListaDatosAplicacion();    
        
       
        for (int i = 0; i < ListaUsuarioSucursal().size(); i++) {
            String sucursal = ListaUsuarioSucursal().get(i).getSucursal();
            Object[] datos = {sucursal,eliminar};
            modelSucTabla.addRow(datos);
        }
        tablaSucursal.setModel(modelSucTabla);
        tamañoTabla();
        
        for (int i = 0; i < ListaUsuarioGrupo().size(); i++) {
            String grupo = ListaUsuarioGrupo().get(i).getGrupo();
            Object[] datos = {grupo,eliminar};
            modelGrupo.addRow(datos);
        }
        tablaGrupos.setModel(modelGrupo);
        tamañoTabla();
        
    }
          
    public void validacion(){
        if (nombrePersona.getText().equals("")) {requerido.setVisible(true);contVali++;}else{requerido.setVisible(false);}
        if (apelliPaterPersona.getText().equals("")) {requerido1.setVisible(true);contVali++;}else{requerido1.setVisible(false);}
        if (apelliMaterPersona.getText().equals("")) {requerido2.setVisible(true);contVali++;}else{requerido2.setVisible(false);}
        if (usuario.getText().equals("")) {requerido3.setVisible(true);contVali++;}else{requerido3.setVisible(false);}
    }
    
   /* public void obtenerRolesAplicaciones(){
        ResultSet rs = null;
        String rol =(String) comboRol.getSelectedItem();
        String nombreEmpresa = empresa.getText();
        int idEmpresa = obtenerIdEmpresa(nombreEmpresa);
        //limpiarTabla();
        String consulta = "SELECT A.TITULO, RO.PUEDE_VER, RO.PUEDE_CREAR, RO.PUEDE_MODIFICAR, RO.PUEDE_ELIMINAR\n" +
            "FROM APLICACION AS A\n" +
            "INNER JOIN EMPRESA_APLICACION AS AE ON AE.APLICACION = A.ID\n" +
            "INNER JOIN ROL_APLICACION AS RO ON RO.APLICACION = AE.APLICACION\n" +
            "INNER JOIN ROL AS R ON R.ID = RO.ROL\n" +
            "WHERE AE.EMPRESA = "+idEmpresa+" AND R.NOMBRE = '"+rol+"'";
        int i = 0;
        try{
            rs = db.seleccionar(consulta); 
            while (rs.next()) {                
                String titulo = rs.getString(1);
                boolean ver = rs.getBoolean(2);
                boolean crear = rs.getBoolean(3);
                boolean modificar = rs.getBoolean(4);
                boolean eliminar = rs.getBoolean(5);
               
                if(rol.equals("ADMINISTRADOR")){
                    Object[] datos = {titulo,ver,crear,modificar,eliminar};
                    modelUsuarioTabla.addRow(datos);
                }
                if (rol.equals("OPERADOR")) {
                    if(!titulo.equals("USUARIOS") && !titulo.equals("APP MOVIL")){
                        if(titulo.equals("COMPRAS")){
                            Object[] datos = {titulo,ver,crear,modificar,eliminar};
                            modelUsuarioTabla.addRow(datos);
                            
                            tablaUsuarios.setValueAt(false, i, 2);
                            tablaUsuarios.setValueAt(false, i, 3);
                            tablaUsuarios.setValueAt(false, i, 4);
                        }
                        if(titulo.equals("VENTAS")){
                            Object[] datos = {titulo,ver,crear,modificar,eliminar};
                            modelUsuarioTabla.addRow(datos);
                            
                            tablaUsuarios.setValueAt(false, i, 2);
                            tablaUsuarios.setValueAt(false, i, 3);
                            tablaUsuarios.setValueAt(false, i, 4);
                        } 
                        Object[] datos = {titulo,ver,crear,modificar,eliminar};
                        modelUsuarioTabla.addRow(datos);
                    }   
                }
                if (rol.equals("VENDEDOR")) {
                    if(!titulo.equals("USUARIOS")){
                        if(titulo.equals("COMPRAS")){
                            Object[] datos = {titulo,ver,crear,modificar,eliminar};
                            modelUsuarioTabla.addRow(datos);
                            
                            tablaUsuarios.setValueAt(false, i, 2);
                            tablaUsuarios.setValueAt(false, i, 3);
                            tablaUsuarios.setValueAt(false, i, 4);
                        }
                        if(titulo.equals("VENTAS")){
                            Object[] datos = {titulo,ver,crear,modificar,eliminar};
                            modelUsuarioTabla.addRow(datos);
                            
                            tablaUsuarios.setValueAt(false, i, 2);
                            tablaUsuarios.setValueAt(false, i, 3);
                            tablaUsuarios.setValueAt(false, i, 4);
                        } 
                        Object[] datos = {titulo,ver,crear,modificar,eliminar};
                        modelUsuarioTabla.addRow(datos);
                    }   
                }
                i++;
            }
            
            tablaUsuarios.setModel(modelUsuarioTabla);
            tamañoTabla();
        }catch(Exception e){
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        } 
    }*/
    
    public void tamañoTabla(){
        tablaGrupos.getColumnModel().getColumn(1).setMaxWidth(60);
        tablaGrupos.getColumnModel().getColumn(1).setMinWidth(60);
        tablaGrupos.getColumnModel().getColumn(1).setPreferredWidth(60);
        
        tablaSucursal.getColumnModel().getColumn(1).setMaxWidth(60);
        tablaSucursal.getColumnModel().getColumn(1).setMinWidth(60);
        tablaSucursal.getColumnModel().getColumn(1).setPreferredWidth(60);
        
        tablaUsuarios.getColumnModel().getColumn(0).setMaxWidth(230);
        tablaUsuarios.getColumnModel().getColumn(0).setMinWidth(230);
        tablaUsuarios.getColumnModel().getColumn(0).setPreferredWidth(230);
    }
    
    public void insertarBotones(){
        String imgEdit = "/imagen/editar.png";
        imgEditar = new ImageIcon(this.getClass().getResource(imgEdit));
        iconEditar = new ImageIcon(imgEditar.getImage().getScaledInstance(20, 20, 1));
        editar = new JButton(iconEditar);
        editar.setName("editar");   
        
        String imgElim = "/imagen/delete.png";
        imgEliminar = new ImageIcon(this.getClass().getResource(imgElim));
        iconEliminar = new ImageIcon(imgEliminar.getImage().getScaledInstance(20, 20, 1));
        eliminar = new JButton(iconEliminar);
        eliminar.setName("eliminar");
        
        tablaGrupos.setRowHeight(33);
        tablaSucursal.setRowHeight(33);
        tablaUsuarios.setRowHeight(33);
        
    }
    
    public void obtenerRoles(){
        ResultSet rs = null;
        String consulta = "SELECT NOMBRE FROM ROL WHERE NOMBRE != 'SUPER-ADMINISTRADOR'";
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                comboRol.addItem(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }
    
    public void obtenerEmpresa(){
        ResultSet rs = null;
        String consulta = "SELECT E.RAZON_SOCIAL \n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN EMPRESA AS E ON E.ID = U.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario+" AND U.ELIMINADO = "+false;
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                empresa.setText(rs.getString(1));
            }      
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
               ex.printStackTrace();
            }
        }
    }
    
    public void obtenerSucursal(){
        ResultSet rs = null;
        String nombEmpre = empresa.getText();
        
        String consulta = "SELECT S.NOMBRE \n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN EMPRESA AS E ON E.ID = U.EMPRESA\n" +
            "INNER JOIN SUCURSAL AS S ON S.EMPRESA = E.ID\n" +
            "WHERE U.ID = "+this.id_usuario+" AND U.ELIMINADO = "+false;
        
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                comboSucursal.addItem(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(null,"Error al obtener la sucursal en usuarios cliente.");
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
               ex.printStackTrace();
            }
        }  
    }
    
    public void obtenerGrupos(){
        int idEmpresa = obtenerIdEmpresa(empresa.getText());
        ResultSet rs = null;
        String consulta = "SELECT C.NOMBRE\n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.NOMBRE = 'GRUPOS PRODUCTOS' AND T.ID_EMPRESA = "+idEmpresa;
        try{
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                comboGrupo.addItem(rs.getString(1));
            }
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }
    
    public int obtenerIdRol(String nombre){
        int id = 0;
        ResultSet rs = null;
        String consulta = "SELECT ID FROM ROL WHERE NOMBRE = '"+nombre+"'" ;
        
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
               ex.printStackTrace();
            }
        }
        
        return id;
    }
    
    public void mostrarAplicaciones(String rol){
        ResultSet rs = null;  
        String nombreEmpresa = empresa.getText();
        int idEmpresa = obtenerIdEmpresa(nombreEmpresa);
        int i = 0;
        limpiarTablaRolApli();
        String consulta = "SELECT A.TITULO, RO.PUEDE_VER, RO.PUEDE_CREAR, RO.PUEDE_MODIFICAR, RO.PUEDE_ELIMINAR\n" +
            "FROM APLICACION AS A\n" +
            "INNER JOIN EMPRESA_APLICACION AS AE ON AE.APLICACION = A.ID\n" +
            "INNER JOIN ROL_APLICACION AS RO ON RO.APLICACION = AE.APLICACION\n" +
            "INNER JOIN ROL AS R ON R.ID = RO.ROL\n" +
            "WHERE AE.EMPRESA = "+idEmpresa+" AND R.NOMBRE = '"+rol+"'";
        try{
            rs = db.seleccionar(consulta); 
            while (rs.next()) {                
                String titulo = rs.getString(1);
                boolean ver = rs.getBoolean(2);
                boolean crear = rs.getBoolean(3);
                boolean modificar = rs.getBoolean(4);
                boolean eliminar = rs.getBoolean(5);
                
                                if(rol.equals("ADMINISTRADOR")){
                    Object[] datos = {titulo,ver,crear,modificar,eliminar};
                    modelUsuarioTabla.addRow(datos);
                }
                if (rol.equals("OPERADOR")) {
                    if(!titulo.equals("USUARIOS") && !titulo.equals("APP MOVIL")){
                        if(titulo.equals("COMPRAS")){
                            Object[] datos = {titulo,ver,crear,modificar,eliminar};
                            modelUsuarioTabla.addRow(datos);
                            
                            tablaUsuarios.setValueAt(false, i, 2);
                            tablaUsuarios.setValueAt(false, i, 3);
                            tablaUsuarios.setValueAt(false, i, 4);
                        }
                        if(titulo.equals("VENTAS")){
                            Object[] datos = {titulo,ver,crear,modificar,eliminar};
                            modelUsuarioTabla.addRow(datos);
                            
                            tablaUsuarios.setValueAt(false, i, 2);
                            tablaUsuarios.setValueAt(false, i, 3);
                            tablaUsuarios.setValueAt(false, i, 4);
                        } 
                        Object[] datos = {titulo,ver,crear,modificar,eliminar};
                        modelUsuarioTabla.addRow(datos);
                    }   
                }
                if (rol.equals("VENDEDOR")) {
                    if(!titulo.equals("USUARIOS")){
                        if(titulo.equals("COMPRAS")){
                            Object[] datos = {titulo,ver,crear,modificar,eliminar};
                            modelUsuarioTabla.addRow(datos);
                            
                            tablaUsuarios.setValueAt(false, i, 2);
                            tablaUsuarios.setValueAt(false, i, 3);
                            tablaUsuarios.setValueAt(false, i, 4);
                        }
                        if(titulo.equals("VENTAS")){
                            Object[] datos = {titulo,ver,crear,modificar,eliminar};
                            modelUsuarioTabla.addRow(datos);
                            
                            tablaUsuarios.setValueAt(false, i, 2);
                            tablaUsuarios.setValueAt(false, i, 3);
                            tablaUsuarios.setValueAt(false, i, 4);
                        } 
                        Object[] datos = {titulo,ver,crear,modificar,eliminar};
                        modelUsuarioTabla.addRow(datos);
                    }   
                }
                i++;
            }           
            tablaUsuarios.setModel(modelUsuarioTabla);
        }catch(Exception e){
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }      
     }
    
    public void limpiarTablaRolApli(){
        int tam = tablaUsuarios.getRowCount();
         for (int i = tam - 1; i >=0 ; i--) {
             modelUsuarioTabla.removeRow(i);
         }
     }
     
    public int obtenerIdRolAplicacion(String nombreAplicacion){
        ResultSet rs = null;
        int id = 0;
        String consulta = "SELECT ID\n" +
            "FROM APLICACION\n" +
            "WHERE TITULO = '"+nombreAplicacion+"'";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        return id;
    } 
    
    public int obtenerIdEmpresa(String nombreEmpresa){
        ResultSet rs = null;
        int id = 0;
        try {
            rs = db.seleccionar("SELECT ID FROM EMPRESA WHERE RAZON_SOCIAL = '"+nombreEmpresa+"'");
            while(rs.next()){
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }      
        return id;
    }
    
     public String decode(String s) {
        return StringUtils.newStringUtf8(Base64.decodeBase64(s));
    }
    
    public String encode(String s) {
        return Base64.encodeBase64String(StringUtils.getBytesUtf8(s));
    }
    
    public static String Encriptar(String texto) {
        String claveCifra = "";
        try {
            MessageDigest md = MessageDigest.getInstance(MessageDigestAlgorithms.MD5);
            md.update(texto.getBytes());
            byte[] digest = md.digest();

            // Se escribe byte a byte en hexadecimal
            for (byte b : digest) {
                //System.out.print("Correcto " + Integer.toHexString(0xFF & b));
                claveCifra += Integer.toHexString(0xFF & b);
            }
//            System.out.println(claveCifra);

            // Se escribe codificado base 64. Se necesita la librería
            // commons-codec-x.x.x.jar de Apache
//                byte[] encoded = Base64.encodeBase64(digest);
//                claveCifra += encoded;
            // System.out.println(new String(encoded));
        } catch (Exception e) {

        }
        return claveCifra;
    }
    
    public int obtenerIdSucursal(String nombre){
        int id = 0;
        ResultSet rs = null;
        try {
            rs = db.seleccionar("SELECT ID FROM SUCURSAL WHERE NOMBRE = '"+nombre+"'");
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        
        return id;
    }
    
    public int obtenerIdGrupos (String nombreGrupo){
        int id = 0;
        ResultSet rs = null;
        String consulta = "SELECT C.ID\n" +
            "FROM CLASE AS C\n" +
            "INNER JOIN TIPO AS T ON T.ID = C.ID_TIPO\n" +
            "INNER JOIN USUARIO AS U ON U.EMPRESA = T.ID_EMPRESA\n" +
            "WHERE C.NOMBRE = '"+nombreGrupo+"' AND U.PERSONA = "+this.id_persona;
        try {
           rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }     
        return id;
    }
    
    public boolean VerificarUsuario(){
        boolean existe = false;
        ResultSet rs = null;
        String usuarios = usuario.getText();
        String consulta = "SELECT * FROM USUARIO WHERE NOMBRE_USUARIO = '"+usuarios+"'";
        existe = db.existeEldato(consulta);
        /*try {
            rs = db.seleccionar(consulta);
            if (rs.next()) {
                existe = true;
            }else{
                existe = false;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }*/
        return existe;
    }
    
    public void actualizarDatos(){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        java.util.Date fe = new java.util.Date();
        long d = fe.getTime();
        java.sql.Date fecha = new java.sql.Date(d);
        String fechaActual = sdf.format(fecha);  

        String nombre = nombrePersona.getText();
        String apellidoP = apelliPaterPersona.getText();
        String apellidoM = apelliMaterPersona.getText();
        String nombre_completo = nombre+" "+apellidoP+" "+apellidoM;
        String imagen = "";

        String usuarios = usuario.getText();
        String clave = encode(claveUsuario.getText());
        String token = Encriptar(nombre_completo);
        String nombreRol = (String) comboRol.getSelectedItem();
        int idRol = obtenerIdRol(nombreRol);
        boolean activo = activoUsuario.isSelected();
        String empresas = empresa.getText();
        int idEmpresa = obtenerIdEmpresa(empresas);
        int comicionGeneral = 0;
        int comicionActiva = 0;
        int idUsuario = obtenerIdUsuario();
        int idUsuarioRol = obtenerIdUsuarioRol();
        
        validacion();
        if (contVali == 0) {
            
            db.actualizarPersona(this.id_persona, nombre_completo, apellidoP, apellidoM, nombre, imagen, false);
            db.actualizarUsuario(idUsuario, this.id_persona, idEmpresa, usuarios, clave, token, activo, fechaActual, fechaActual, comicionGeneral, comicionActiva);
            db.actualizarUsuarioRol(idUsuarioRol, idUsuario, idRol, fecha);

            String consulEliminar = "DELETE FROM APP.USUARIO_APLICACION WHERE USUARIO = "+idUsuario;
            db.eliminarProductos(consulEliminar);   
            for (int i = 0; i < tablaUsuarios.getRowCount(); i++) {
                String aplicacion = String.valueOf(tablaUsuarios.getValueAt(i, 0));
                int id_apli = db.seleccionarIdRoll(aplicacion);
                boolean ver = Boolean.valueOf(String.valueOf(tablaUsuarios.getValueAt(i, 1)));
                boolean  crear = Boolean.valueOf(String.valueOf(tablaUsuarios.getValueAt(i, 2)));
                boolean modificar = Boolean.valueOf(String.valueOf(tablaUsuarios.getValueAt(i, 3)));
                boolean eliminar = Boolean.valueOf(String.valueOf(tablaUsuarios.getValueAt(i, 4)));
                db.insertarUsuarioAplicacion(idUsuario, id_apli, ver, crear, modificar, eliminar, fecha, fecha);
            }

            String consulEliminarSuc = "DELETE FROM APP.USUARIO_SUCURSAL WHERE USUARIO = "+idUsuario;
            db.eliminarProductos(consulEliminarSuc);   
            for (int i = 0; i < tablaSucursal.getRowCount(); i++) {
                String nombreSurcursal = String.valueOf(tablaSucursal.getValueAt(i, 0));
                int idSucursal = obtenerIdSucursal(nombreSurcursal);
                db.insertarUsuarioSursal(idUsuario, idSucursal, fecha, fecha, false);
            }

            String consulEliminarGrupo = "DELETE FROM APP.USUARIO_GRUPOS WHERE USUARIO = "+idUsuario;
            db.eliminarProductos(consulEliminarGrupo);   
            for (int i = 0; i < tablaGrupos.getRowCount(); i++) {
                String nombreGrupos = String.valueOf(tablaGrupos.getValueAt(i, 0));
                int idGrupos = obtenerIdGrupos(nombreGrupos);
                db.insertarUsuarioGrupo(idUsuario, idGrupos, fecha, fecha, false);
                
                actualizarEstadoGrupos(idGrupos,nombreGrupos);
            }

            JOptionPane.showMessageDialog(null, "Guardado Exitosamente");
            dispose();

        }else{
            JOptionPane.showMessageDialog(null, "El usuario ya existe.");
        }
    }
    
    public void actualizarEstadoGrupos(int idGrupo,String nombreGrupo){
        db.insertar("UPDATE CLASE SET HABILITADO = "+true+" WHERE NOMBRE_CORTO = '"+nombreGrupo+"'");
        db.insertar("UPDATE CLASE SET HABILITADO = "+true+" WHERE ID = "+idGrupo);
        
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        nombrePersona = new javax.swing.JTextField();
        jLabel3 = new javax.swing.JLabel();
        apelliPaterPersona = new javax.swing.JTextField();
        apelliMaterPersona = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
        usuario = new javax.swing.JTextField();
        jLabel7 = new javax.swing.JLabel();
        claveUsuario = new javax.swing.JTextField();
        jLabel8 = new javax.swing.JLabel();
        comboRol = new javax.swing.JComboBox<>();
        jLabel9 = new javax.swing.JLabel();
        activoUsuario = new javax.swing.JRadioButton();
        requerido = new javax.swing.JLabel();
        requerido1 = new javax.swing.JLabel();
        requerido2 = new javax.swing.JLabel();
        requerido3 = new javax.swing.JLabel();
        jLabel10 = new javax.swing.JLabel();
        jLabel11 = new javax.swing.JLabel();
        jLabel12 = new javax.swing.JLabel();
        empresa = new javax.swing.JTextField();
        jLabel13 = new javax.swing.JLabel();
        comboSucursal = new javax.swing.JComboBox<>();
        jScrollPane2 = new javax.swing.JScrollPane();
        tablaUsuarios = new javax.swing.JTable();
        addSucursal = new javax.swing.JButton();
        jLabel14 = new javax.swing.JLabel();
        comboGrupo = new javax.swing.JComboBox<>();
        jScrollPane3 = new javax.swing.JScrollPane();
        tablaSucursal = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1;
            }
        };
        addGrupo = new javax.swing.JButton();
        jScrollPane4 = new javax.swing.JScrollPane();
        tablaGrupos = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 ;
            }
        };
        btnGuardar = new javax.swing.JButton();
        btnCerrar = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.DO_NOTHING_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(66, 139, 202));
        jLabel1.setText("Datos de la Persona");

        jLabel2.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(66, 139, 202));
        jLabel2.setText("Nombres");

        jLabel3.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(66, 139, 202));
        jLabel3.setText("Apellido Paterno");

        apelliPaterPersona.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                apelliPaterPersonaActionPerformed(evt);
            }
        });

        jLabel4.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(66, 139, 202));
        jLabel4.setText("Apellido Materno");

        jLabel5.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(66, 139, 202));
        jLabel5.setText("Roles");

        jLabel6.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel6.setForeground(new java.awt.Color(66, 139, 202));
        jLabel6.setText("Usuario");

        jLabel7.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel7.setForeground(new java.awt.Color(66, 139, 202));
        jLabel7.setText("Clave");

        jLabel8.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel8.setForeground(new java.awt.Color(66, 139, 202));
        jLabel8.setText("Rol");

        comboRol.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboRolActionPerformed(evt);
            }
        });

        jLabel9.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel9.setForeground(new java.awt.Color(66, 139, 202));
        jLabel9.setText("Activo?");

        requerido.setForeground(new java.awt.Color(255, 51, 51));
        requerido.setText("Requido");

        requerido1.setForeground(new java.awt.Color(255, 51, 51));
        requerido1.setText("Requido");

        requerido2.setForeground(new java.awt.Color(255, 51, 51));
        requerido2.setText("Requido");

        requerido3.setForeground(new java.awt.Color(255, 51, 51));
        requerido3.setText("Requido");

        jLabel10.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(66, 139, 202));
        jLabel10.setText("Datos del Usuario");

        jLabel11.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel11.setForeground(new java.awt.Color(66, 139, 202));
        jLabel11.setText("Datos de la Empresa");

        jLabel12.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel12.setForeground(new java.awt.Color(66, 139, 202));
        jLabel12.setText("Empresa");

        empresa.setEditable(false);

        jLabel13.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel13.setForeground(new java.awt.Color(66, 139, 202));
        jLabel13.setText("Sucursal");

        comboSucursal.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));

        tablaUsuarios.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Aplicacion", "Crear", "Ver", "Modificar", "Eliminar"
            }
        ) {
            Class[] types = new Class [] {
                java.lang.Object.class, java.lang.Boolean.class, java.lang.Boolean.class, java.lang.Boolean.class, java.lang.Boolean.class
            };

            public Class getColumnClass(int columnIndex) {
                return types [columnIndex];
            }
        });
        jScrollPane2.setViewportView(tablaUsuarios);
        if (tablaUsuarios.getColumnModel().getColumnCount() > 0) {
            tablaUsuarios.getColumnModel().getColumn(0).setMinWidth(250);
            tablaUsuarios.getColumnModel().getColumn(0).setPreferredWidth(250);
            tablaUsuarios.getColumnModel().getColumn(0).setMaxWidth(250);
        }

        addSucursal.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition.png"))); // NOI18N
        addSucursal.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                addSucursalActionPerformed(evt);
            }
        });

        jLabel14.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel14.setForeground(new java.awt.Color(66, 139, 202));
        jLabel14.setText("Grupo");

        comboGrupo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboGrupoActionPerformed(evt);
            }
        });

        tablaSucursal.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Sucursal", "Eliminar"
            }
        ));
        tablaSucursal.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaSucursalMouseClicked(evt);
            }
        });
        jScrollPane3.setViewportView(tablaSucursal);
        if (tablaSucursal.getColumnModel().getColumnCount() > 0) {
            tablaSucursal.getColumnModel().getColumn(1).setMinWidth(60);
            tablaSucursal.getColumnModel().getColumn(1).setPreferredWidth(60);
            tablaSucursal.getColumnModel().getColumn(1).setMaxWidth(60);
        }

        addGrupo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition.png"))); // NOI18N
        addGrupo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                addGrupoActionPerformed(evt);
            }
        });

        tablaGrupos.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Grupo", "Eliminar"
            }
        ));
        tablaGrupos.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaGruposMouseClicked(evt);
            }
        });
        jScrollPane4.setViewportView(tablaGrupos);
        if (tablaGrupos.getColumnModel().getColumnCount() > 0) {
            tablaGrupos.getColumnModel().getColumn(1).setMinWidth(60);
            tablaGrupos.getColumnModel().getColumn(1).setPreferredWidth(60);
            tablaGrupos.getColumnModel().getColumn(1).setMaxWidth(60);
        }

        btnGuardar.setBackground(new java.awt.Color(98, 155, 88));
        btnGuardar.setForeground(new java.awt.Color(255, 255, 255));
        btnGuardar.setText("Guardar");
        btnGuardar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(135, 184, 127)));
        btnGuardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnGuardarActionPerformed(evt);
            }
        });

        btnCerrar.setBackground(new java.awt.Color(183, 70, 53));
        btnCerrar.setForeground(new java.awt.Color(255, 255, 255));
        btnCerrar.setText("Cerrar");
        btnCerrar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(209, 91, 71)));
        btnCerrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnCerrarActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(requerido)
                            .addComponent(requerido3)
                            .addComponent(jLabel11)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel12)
                                    .addComponent(empresa, javax.swing.GroupLayout.PREFERRED_SIZE, 131, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel13)
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addComponent(comboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, 119, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                        .addComponent(addSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                .addGap(6, 6, 6)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(jLabel14)
                                    .addComponent(comboGrupo, javax.swing.GroupLayout.PREFERRED_SIZE, 136, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(addGrupo, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(0, 0, Short.MAX_VALUE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel1)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel2)
                                    .addComponent(nombrePersona, javax.swing.GroupLayout.PREFERRED_SIZE, 110, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(apelliPaterPersona, javax.swing.GroupLayout.PREFERRED_SIZE, 110, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel3)
                                    .addComponent(requerido1))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel4)
                                    .addComponent(apelliMaterPersona, javax.swing.GroupLayout.PREFERRED_SIZE, 110, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(requerido2)))
                            .addComponent(jLabel5))
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 213, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jScrollPane4, javax.swing.GroupLayout.PREFERRED_SIZE, 213, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(33, 33, 33))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(jScrollPane2, javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(usuario, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                                            .addComponent(jLabel6))
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(claveUsuario, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                                            .addComponent(jLabel7))
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addGroup(jPanel1Layout.createSequentialGroup()
                                                .addComponent(jLabel8, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addGap(0, 0, Short.MAX_VALUE))
                                            .addGroup(jPanel1Layout.createSequentialGroup()
                                                .addComponent(comboRol, javax.swing.GroupLayout.PREFERRED_SIZE, 147, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))))
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addComponent(jLabel10)
                                        .addGap(125, 125, 125)))
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel9, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addGap(10, 10, 10)
                                        .addComponent(activoUsuario)))
                                .addGap(45, 45, 45)))
                        .addGap(32, 32, 32))))
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(btnCerrar, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(64, 64, 64)
                .addComponent(btnGuardar, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(60, 60, 60))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel2)
                    .addComponent(jLabel3)
                    .addComponent(jLabel4))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(nombrePersona, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(apelliPaterPersona, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(apelliMaterPersona, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(3, 3, 3)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(requerido)
                    .addComponent(requerido1)
                    .addComponent(requerido2))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jLabel10, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel7)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(claveUsuario, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel6)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(usuario, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel8)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(comboRol, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel9)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(activoUsuario)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(requerido3)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jLabel5)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 113, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel11, javax.swing.GroupLayout.PREFERRED_SIZE, 28, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel12)
                    .addComponent(jLabel13)
                    .addComponent(jLabel14))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(empresa, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(comboSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(comboGrupo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(addSucursal)
                    .addComponent(addGrupo))
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 115, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jScrollPane4, javax.swing.GroupLayout.PREFERRED_SIZE, 115, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(btnGuardar, javax.swing.GroupLayout.DEFAULT_SIZE, 33, Short.MAX_VALUE)
                        .addGap(153, 153, 153))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(btnCerrar, javax.swing.GroupLayout.PREFERRED_SIZE, 33, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))))
        );

        jScrollPane1.setViewportView(jPanel1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 537, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, 644, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void apelliPaterPersonaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_apelliPaterPersonaActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_apelliPaterPersonaActionPerformed

    private void addSucursalActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_addSucursalActionPerformed
        String nombreSuc = (String) comboSucursal.getSelectedItem();
        int existe = 0;
        String nombre = "";
        if (tablaSucursal.getRowCount() == 0) {
            Object[] datos = {nombreSuc,eliminar};
            modelSucTabla.addRow(datos);
            tablaSucursal.setModel(modelSucTabla);
            tamañoTabla();
        }else{
            for (int i = 0; i < tablaSucursal.getRowCount(); i++) {
                if (tablaSucursal.getValueAt(i, 0).equals(nombreSuc)) {
                    existe++;
                }else{
                   existe = existe;
                   nombre = nombreSuc;
                }
            }
            
            if (existe == 0) {               
                Object[] datos = {nombre,eliminar};
                modelSucTabla.addRow(datos);
                tablaSucursal.setModel(modelSucTabla);
                tamañoTabla();
            }else{
                JOptionPane.showMessageDialog(null, "La sucursal ya fue seleccionada!");
            }      
        }  
    }//GEN-LAST:event_addSucursalActionPerformed

    private void tablaSucursalMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaSucursalMouseClicked
        int columna = tablaSucursal.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaSucursal.getRowHeight();
        String idProducto;
        boolean existe = false;

        if (fila < tablaSucursal.getRowCount() && fila >= 0 && columna < tablaSucursal.getColumnCount() && columna >= 0) {
            Object value = tablaSucursal.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("eliminar")) {
                    modelSucTabla.removeRow(fila);
                }
            }
        }
    }//GEN-LAST:event_tablaSucursalMouseClicked

    private void addGrupoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_addGrupoActionPerformed
        String nombGrupo = (String) comboGrupo.getSelectedItem();
        int existe = 0;
        String nombre = "";
        if (tablaGrupos.getRowCount() == 0) {
            Object[] datos = {nombGrupo,eliminar};
            modelGrupo.addRow(datos);

            tablaGrupos.setModel(modelGrupo);
            tamañoTabla();
        }else{
            for (int i = 0; i < tablaGrupos.getRowCount(); i++) {
                if (tablaGrupos.getValueAt(i, 0).equals(nombGrupo)) {
                    existe++;
                }else{
                    existe = existe;
                    nombre = nombGrupo;
                }
            }
            if (existe == 0) {                                  
                Object[] datos = {nombre,eliminar};
                modelGrupo.addRow(datos);
                tablaGrupos.setModel(modelGrupo);
                tamañoTabla();
            }else{
                JOptionPane.showMessageDialog(null, "La sucursal ya fue seleccionada!");
            }
        }
        
    }//GEN-LAST:event_addGrupoActionPerformed

    private void tablaGruposMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaGruposMouseClicked
        int columna = tablaGrupos.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaGrupos.getRowHeight();
        String idProducto;
        boolean existe = false;

        if (fila < tablaGrupos.getRowCount() && fila >= 0 && columna < tablaGrupos.getColumnCount() && columna >= 0) {
            Object value = tablaGrupos.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("eliminar")) {
                    modelGrupo.removeRow(fila);
                }
            }
        }
    }//GEN-LAST:event_tablaGruposMouseClicked

    private void btnGuardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnGuardarActionPerformed
        contVali = 0;
        
        if (this.id_persona != 0) {
            actualizarDatos();
        }else{
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            java.util.Date fe = new java.util.Date();
            long d = fe.getTime();
            java.sql.Date fecha = new java.sql.Date(d);
            String fechaActual = sdf.format(fecha);  

            String nombre = nombrePersona.getText();
            String apellidoP = apelliPaterPersona.getText();
            String apellidoM = apelliMaterPersona.getText();
            String nombre_completo = nombre+" "+apellidoP+" "+apellidoM;
            String imagen = "";

            String usuarios = usuario.getText();
            String clave = encode(claveUsuario.getText());
            String token = Encriptar(nombre_completo);
            String nombreRol = (String) comboRol.getSelectedItem();
            int idRol = obtenerIdRol(nombreRol);
            boolean activo = activoUsuario.isSelected();
            String empresas = empresa.getText();
            int idEmpresa = obtenerIdEmpresa(empresas);
            int comicionGeneral = 0;
            int comicionActiva = 0;

            validacion();
            if (contVali == 0) {
                if (VerificarUsuario() == false) {

                    db.actualizarPersona(0, nombre, apellidoP, apellidoM, nombre_completo, imagen, false);
                    int idPersona = db.seleccionarUltimoIdPersona();
                    db.InsertarUsuario(idPersona, idEmpresa, usuarios, clave, token, activo, fechaActual, fechaActual, comicionGeneral, comicionActiva, false);
                    int idUsuario = db.seleccionarUltimoIdUsuario();
                    db.insertarUsuarioRol(idUsuario, idRol, fecha, fecha, activo);

                    for (int i = 0; i < tablaUsuarios.getRowCount(); i++) {
                        String aplicacion = String.valueOf(tablaUsuarios.getValueAt(i, 0));
                        int idAplicacion = obtenerIdRolAplicacion(aplicacion);
                        boolean ver = Boolean.valueOf(String.valueOf(tablaUsuarios.getValueAt(i, 1)));
                        boolean crear = Boolean.valueOf(String.valueOf(tablaUsuarios.getValueAt(i, 2)));
                        boolean modificar = Boolean.valueOf(String.valueOf(tablaUsuarios.getValueAt(i, 3)));
                        boolean eliiminar = Boolean.valueOf(String.valueOf(tablaUsuarios.getValueAt(i, 4)));

                        db.insertarUsuarioAplicacion(idUsuario, idAplicacion, ver, crear, modificar, eliiminar, fecha, fecha);
                    }

                    for (int i = 0; i < tablaSucursal.getRowCount(); i++) {              
                        String nombreSucursal = String.valueOf(tablaSucursal.getValueAt(i, 0));
                        int idSucursal = obtenerIdSucursal(nombreSucursal);
                        db.insertarUsuarioSursal(idUsuario, idSucursal, fecha, fecha, false);
                    }

                    for (int i = 0; i < tablaGrupos.getRowCount(); i++) {
                        String nombreGrupo = String.valueOf(tablaGrupos.getValueAt(i, 0));
                        int idGrupo = obtenerIdGrupos(nombreGrupo);
                        db.insertarUsuarioGrupo(idUsuario, idGrupo, fecha, fecha, false);
                        actualizarEstadoGrupos(idGrupo,nombreGrupo);
                    }
                }else{
                   JOptionPane.showMessageDialog(null, "El usuario ya existe."); 
                }
            }else{
                JOptionPane.showMessageDialog(null, "Ingrese los campos requeridos.");
            }

            JOptionPane.showMessageDialog(null, "Guardado Exitosamente");
            dispose();
        }
    }//GEN-LAST:event_btnGuardarActionPerformed

    private void comboRolActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboRolActionPerformed
        String rol =(String) comboRol.getSelectedItem();
        if (this.id_persona == 0) {
            mostrarAplicaciones(rol);
        }
        
    }//GEN-LAST:event_comboRolActionPerformed

    private void btnCerrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCerrarActionPerformed
        dispose();
    }//GEN-LAST:event_btnCerrarActionPerformed

    private void comboGrupoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboGrupoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_comboGrupoActionPerformed

    /**
     * @param args the command line arguments
     */
    
   

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JRadioButton activoUsuario;
    private javax.swing.JButton addGrupo;
    private javax.swing.JButton addSucursal;
    private javax.swing.JTextField apelliMaterPersona;
    private javax.swing.JTextField apelliPaterPersona;
    private javax.swing.JButton btnCerrar;
    private javax.swing.JButton btnGuardar;
    private javax.swing.JTextField claveUsuario;
    private javax.swing.JComboBox<String> comboGrupo;
    private javax.swing.JComboBox<String> comboRol;
    private javax.swing.JComboBox<String> comboSucursal;
    private javax.swing.JTextField empresa;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel12;
    private javax.swing.JLabel jLabel13;
    private javax.swing.JLabel jLabel14;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JScrollPane jScrollPane3;
    private javax.swing.JScrollPane jScrollPane4;
    private javax.swing.JTextField nombrePersona;
    private javax.swing.JLabel requerido;
    private javax.swing.JLabel requerido1;
    private javax.swing.JLabel requerido2;
    private javax.swing.JLabel requerido3;
    private javax.swing.JTable tablaGrupos;
    private javax.swing.JTable tablaSucursal;
    private javax.swing.JTable tablaUsuarios;
    private javax.swing.JTextField usuario;
    // End of variables declaration//GEN-END:variables
}
