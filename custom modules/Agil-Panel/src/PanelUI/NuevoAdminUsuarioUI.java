/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.security.MessageDigest;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.StringTokenizer;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import modelo_Admin.ListaRolAplicaciones;
import modelo_Admin.ListaRoles;
import modelo_Admin.ListaUsuarioAdmin;
import modelo_Usuario.listaRoles;
import models.Database;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.MessageDigestAlgorithms;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.StringUtils;
/**
 *
 * @author AGIL
 */
public class NuevoAdminUsuarioUI extends javax.swing.JDialog {
    Database db = new Database();
    public int contVerif ;
    public int id_persona;
    DefaultTableModel modeloTablaRoles;

    /**
     * Creates new form NuevoAdminUsuarioUI
     */
    
    public NuevoAdminUsuarioUI(java.awt.Frame parent, boolean modal,int id_persona) {
        super(parent,modal);
        initComponents();
        setLocationRelativeTo(this);
        this.id_persona = id_persona;
        requerido1.setVisible(false);
        requerido2.setVisible(false);
        requerido3.setVisible(false);
        requerido4.setVisible(false);
        requerido5.setVisible(false);
        labelExiste.setVisible(false);
        
        String[] columnas = {"Aplicaciones","Crear","Ver","Modificar","Eliminar"};
        //modeloTablaRoles = new DefaultTableModel(null,columnas);
        modeloTablaRoles = (DefaultTableModel)tablaRoles.getModel();
              
        obtenerRoles();
        obtenerEmpresas();  
        obtenerDatosUsuario();
    }
    
    public NuevoAdminUsuarioUI(java.awt.Frame parent, boolean modal) {
        super(parent, modal);
        initComponents();
        setLocationRelativeTo(this);
        requerido1.setVisible(false);
        requerido2.setVisible(false);
        requerido3.setVisible(false);
        requerido4.setVisible(false);
        requerido5.setVisible(false);
        labelExiste.setVisible(false);
        requerido6.setVisible(false);
        
        String[] columnas = {"Aplicaciones","Ver","Crear","Modificar","Eliminar"};
        //modeloTablaRoles = new DefaultTableModel(null,columnas);
        modeloTablaRoles = (DefaultTableModel)tablaRoles.getModel();
              
        obtenerRoles();
        obtenerEmpresas();
    }
    
    public List<ListaUsuarioAdmin> ListaDatosUsuario(){
        ResultSet rs = null;
        List<ListaUsuarioAdmin> arregloUsuario = new ArrayList();
        String consulta = "SELECT P.NOMBRES,P.APELLIDO_PATERNO,P.APELLIDO_MATERNO, U.NOMBRE_USUARIO,U.CLAVE,R.NOMBRE ,U.ACTIVO,\n" +
            "E.RAZON_SOCIAL, S.NOMBRE\n" +
            "FROM PERSONA AS P\n" +
            "INNER JOIN USUARIO AS U ON P.ID = U.PERSONA\n" +
            "INNER JOIN USUARIO_ROL AS UR ON UR.USUARIO = U.ID\n" +
            "LEFT JOIN ROL AS R ON R.ID = UR.ROL\n" +
            "INNER JOIN EMPRESA AS E ON E.ID = U.EMPRESA\n" +
            "INNER JOIN USUARIO_SUCURSAL AS US ON US.USUARIO = U.ID\n" +
            "INNER JOIN SUCURSAL AS S ON S.ID = US.SUCURSAL\n" +
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
                String sucursal = rs.getString(9);
                
                ListaUsuarioAdmin listaUsuarios = new ListaUsuarioAdmin(nombre, apellido_p, apellido_m, usuario, clave, rol, activo, empresa, sucursal);
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
        ArrayList<listaRoles> arregloAplicacion = new ArrayList();
        String consulta = "SELECT  A.TITULO, UA.PUEDE_VER,UA.PUEDE_CREAR,UA.PUEDE_MODIFICAR,UA.PUEDE_ELIMINAR\n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN USUARIO_APLICACION AS UA ON UA.USUARIO = U.ID\n" +
            "INNER JOIN APLICACION AS A ON UA.APLICACION = A.ID\n" +
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
                modeloTablaRoles.addRow(datos);
            }
            tablaRoles.setModel(modeloTablaRoles);
            
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
        List<ListaUsuarioAdmin> lista = ListaDatosUsuario();
        
        
        for (ListaUsuarioAdmin listaUsuarioAdmin : lista) {
            datosNombre.setText(listaUsuarioAdmin.getNombre());
            datosApellidoPaterno.setText(listaUsuarioAdmin.getApellido_p());
            datosApellidoMaterno.setText(listaUsuarioAdmin.getApellido_m());
            datosUsuario.setText(listaUsuarioAdmin.getUsuario());
            datosClave.setText(listaUsuarioAdmin.getClave());
            comboRol.setSelectedItem(listaUsuarioAdmin.getRol());
            radioActivo.setSelected(listaUsuarioAdmin.isActivo());
            comboDatosEmpresa.setSelectedItem(listaUsuarioAdmin.getEmpresa());
            comboNombreSucur.setSelectedItem(listaUsuarioAdmin.getSucursal());
        }
   
        //ListaDatosAplicacion();
    }
    
    public void obtenerRoles(){
        ResultSet rs = null;
        String consulta = "SELECT NOMBRE FROM ROL WHERE NOMBRE != 'SUPER-ADMINISTRADOR' AND NOMBRE != 'ERP'";
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
    
    public void mostrarAplicaciones(String rol,String nombreEmpresa){
        ResultSet rs = null;
        //String rol =(String) comboRol.getSelectedItem();
        //String nombreEmpresa = (String) comboDatosEmpresa.getSelectedItem();
        int idEmpresa = obtenerIdEmpresa(nombreEmpresa);
        limpiarTabla();
        String consulta = "SELECT A.TITULO, RO.PUEDE_VER, RO.PUEDE_CREAR, RO.PUEDE_MODIFICAR, RO.PUEDE_ELIMINAR\n" +
            "FROM APLICACION AS A\n" +
            "INNER JOIN EMPRESA_APLICACION AS AE ON AE.APLICACION = A.ID\n" +
            "INNER JOIN ROL_APLICACION AS RO ON RO.APLICACION = AE.APLICACION\n" +
            "INNER JOIN ROL AS R ON R.ID = RO.ROL\n" +
            "WHERE AE.EMPRESA = "+idEmpresa+" AND R.NOMBRE = '"+rol+"'";
 
        try{
            rs = db.seleccionar(consulta); 
            int i= 0;
            while (rs.next()) {                
                String titulo = rs.getString(1);
                boolean ver = rs.getBoolean(2);
                boolean crear = rs.getBoolean(3);
                boolean modificar = rs.getBoolean(4);
                boolean eliminar = rs.getBoolean(5);
                
                if(rol.equals("ADMINISTRADOR")){
                    Object[] datos = {titulo,ver,crear,modificar,eliminar};
                    modeloTablaRoles.addRow(datos);
                }
                if (rol.equals("OPERADOR")) {
                    if(!titulo.equals("USUARIOS") && !titulo.equals("APP MOVIL")){
                        if(titulo.equals("COMPRAS")){
                            Object[] datos = {titulo,ver,crear,modificar,eliminar};
                            modeloTablaRoles.addRow(datos);
                            
                            tablaRoles.setValueAt(false, i, 2);
                            tablaRoles.setValueAt(false, i, 3);
                            tablaRoles.setValueAt(false, i, 4);
                        }
                        if(titulo.equals("VENTAS")){
                            Object[] datos = {titulo,ver,crear,modificar,eliminar};
                            modeloTablaRoles.addRow(datos);
                            
                            tablaRoles.setValueAt(false, i, 2);
                            tablaRoles.setValueAt(false, i, 3);
                            tablaRoles.setValueAt(false, i, 4);
                        } 
                        Object[] datos = {titulo,ver,crear,modificar,eliminar};
                        modeloTablaRoles.addRow(datos);
                    }   
                }
                if (rol.equals("VENDEDOR")) {
                    if(!titulo.equals("USUARIOS")){
                        if(titulo.equals("COMPRAS")){
                            Object[] datos = {titulo,ver,crear,modificar,eliminar};
                            modeloTablaRoles.addRow(datos);
                            
                            tablaRoles.setValueAt(false, i, 2);
                            tablaRoles.setValueAt(false, i, 3);
                            tablaRoles.setValueAt(false, i, 4);
                        }
                        if(titulo.equals("VENTAS")){
                            Object[] datos = {titulo,ver,crear,modificar,eliminar};
                            modeloTablaRoles.addRow(datos);
                            
                            tablaRoles.setValueAt(false, i, 2);
                            tablaRoles.setValueAt(false, i, 3);
                            tablaRoles.setValueAt(false, i, 4);
                        } 
                        Object[] datos = {titulo,ver,crear,modificar,eliminar};
                        modeloTablaRoles.addRow(datos);
                    }   
                }
                i++;
            }    
            
            tablaRoles.setModel(modeloTablaRoles);
            
        }catch(Exception e){
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
    
    public void limpiarTabla(){
        int tam = tablaRoles.getRowCount();
        for (int i = tam - 1; i >= 0; i--) {
            modeloTablaRoles.removeRow(i);
        }
    }
    
    public void obtenerEmpresas(){
        ResultSet rs = null;
        String consulta = "SELECT RAZON_SOCIAL FROM EMPRESA";
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                comboDatosEmpresa.addItem(rs.getString(1));
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
    
    public int obtenerIdEmpresa(String nombre){
        ResultSet rs = null;
        int id_empresa = 0;
        String consulta = "SELECT ID FROM EMPRESA WHERE RAZON_SOCIAL = '"+nombre+"'";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id_empresa = rs.getInt(1);
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
        return id_empresa;
    }
    
    public void verificar(){
        contVerif = 0;
        if (datosNombre.getText().equals("")){requerido1.setVisible(true); contVerif++;}else{requerido1.setVisible(false);}
        if (datosApellidoPaterno.getText().equals("")){requerido2.setVisible(true); contVerif++;}else{requerido2.setVisible(false);}
        if (datosApellidoMaterno.getText().equals("")) {requerido3.setVisible(true); contVerif++;}else{requerido3.setVisible(false);}
        if (comboDatosEmpresa.getSelectedItem().equals(" ")) {requerido4.setVisible(true); contVerif++;}else{requerido4.setVisible(false);}
        if (comboNombreSucur.getSelectedItem().equals(" ")) {requerido5.setVisible(true); contVerif++;}else{requerido5.setVisible(false);}
        if (datosUsuario.getText().equals("")){labelExiste.setVisible(true); contVerif++;}else{labelExiste.setVisible(false);}
        if (datosClave.getText().equals("")){requerido6.setVisible(true); contVerif++;}else{requerido6.setVisible(false);}

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
    
    public ArrayList<ListaRolAplicaciones> listarDatosTabla(){
        ArrayList<ListaRolAplicaciones> listas = new ArrayList();
        for (int i = 0; i < tablaRoles.getRowCount(); i++) {
            String aplicacion = String.valueOf(tablaRoles.getValueAt(i, 0));
            int id_aplica = db.seleccionarIdRoll(aplicacion);
            boolean ver = Boolean.valueOf(String.valueOf(tablaRoles.getValueAt(i, 1)));
            boolean crear = Boolean.valueOf(String.valueOf(tablaRoles.getValueAt(i, 2)));
            boolean modificar = Boolean.valueOf(String.valueOf(tablaRoles.getValueAt(i, 3)));
            boolean eliminar = Boolean.valueOf(String.valueOf(tablaRoles.getValueAt(i, 4)));
            ListaRolAplicaciones roles = new ListaRolAplicaciones(id_aplica, crear, ver, modificar, eliminar);
            listas.add(roles);
        }
        return listas;
    }
    
    public int obtenerIdSucursal(String nombre){
        int id = 0;
        ResultSet rs = null;
        String empresa = (String) comboDatosEmpresa.getSelectedItem();
        int id_empre = obtenerIdEmpresa(empresa);
        String consulta = "SELECT ID FROM SUCURSAL WHERE NOMBRE = '"+nombre+"' AND EMPRESA = "+id_empre ;
        
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
        String usuario = datosUsuario.getText();
        String consulta = "SELECT * FROM USUARIO WHERE NOMBRE_USUARIO = '"+usuario+"'";
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
    
    public int obtenerIdUsuario(){
        ResultSet rs = null;
        int id = 0;
        String consulta = "SELECT ID   \n" +
            "FROM USUARIO\n" +
            "WHERE PERSONA = "+this.id_persona;
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
    
    public void actualizarUsuario(){
        contVerif = 0;
        verificar();
        labelExiste.setVisible(false);
        ArrayList<ListaRoles> listaR = new ArrayList();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        java.util.Date fe = new java.util.Date();
        long d = fe.getTime();
        java.sql.Date fecha = new java.sql.Date(d);
        String fechaUpda = sdf.format(fecha);       

        String nombre = datosNombre.getText();
        String apellidoP = datosApellidoPaterno.getText();
        String apellidoM = datosApellidoMaterno.getText();
        String nombre_completo = nombre+" "+apellidoP+" "+apellidoM;
        String usuario = datosUsuario.getText();
        String clave = encode(datosClave.getText());
        String nombreRol = (String) comboRol.getSelectedItem();
        int id_rol = obtenerIdRol(nombreRol);
        boolean activo = radioActivo.isSelected();
        String nombreEmpresa = (String) comboDatosEmpresa.getSelectedItem();
        int empresa = obtenerIdEmpresa(nombreEmpresa);
        String nombreSucursal = (String) comboNombreSucur.getSelectedItem();
        int id_sucursal = obtenerIdSucursal(nombreSucursal);
        String token = Encriptar(nombre_completo);
        int comision_general = 0;
        int comision_activa = 0;
        
        
        int idUsuarioRol = 0;
        int idUsuario = 0;
        String fechareaCreaString = "";
        String fechaUsRoString = "";
        java.sql.Date fechaUsRolCreada = null;
        try {
            
            ResultSet rs2 = db.seleccionar("SELECT  UROL.ID, U.ID, U.CREATEDAT, UROL.CREATEDAT\n" +
                "FROM PERSONA AS P \n" +
                "INNER JOIN USUARIO AS U ON U.PERSONA = P.ID\n" +
                "INNER JOIN USUARIO_ROL AS UROL ON UROL.USUARIO = U.ID\n" +
                "WHERE P.ID = "+this.id_persona);
            while(rs2.next()){
                idUsuarioRol = rs2.getInt(1);
                idUsuario = rs2.getInt(2);
                fechareaCreaString = rs2.getString(3);
                fechaUsRoString = rs2.getString(4);
            }   
            Date fechaA = sdf.parse(fechareaCreaString);
            long f = fechaA.getTime();
            java.sql.Date fechaCreada = new java.sql.Date(f);
            
            Date fechaB = sdf.parse(fechaUsRoString);
            long fur = fechaB.getTime();
            fechaUsRolCreada = new java.sql.Date(fur);
           
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
        
        if (contVerif == 0) {
              
            db.actualizarPersona(this.id_persona, nombre_completo, apellidoP, apellidoM, nombre, "imagen",false);
            db.actualizarUsuario(idUsuario, this.id_persona, empresa,usuario, clave, token, activo, fechareaCreaString, fechaUpda, comision_general, comision_activa);
            db.actualizarUsuarioRol(idUsuarioRol, idUsuario, id_rol, fecha);

            String consulEliminar = "DELETE FROM APP.USUARIO_APLICACION WHERE USUARIO = "+idUsuario;
            db.eliminarProductos(consulEliminar);           

            for (int i = 0; i < tablaRoles.getRowCount(); i++) {
                String aplicacion = String.valueOf(tablaRoles.getValueAt(i, 0));
                int id_apli = db.seleccionarIdRoll(aplicacion);
                boolean ver = Boolean.valueOf(String.valueOf(tablaRoles.getValueAt(i, 1)));
                boolean  crear = Boolean.valueOf(String.valueOf(tablaRoles.getValueAt(i, 2)));
                boolean modificar = Boolean.valueOf(String.valueOf(tablaRoles.getValueAt(i, 3)));
                boolean eliminar = Boolean.valueOf(String.valueOf(tablaRoles.getValueAt(i, 4)));
                db.insertarUsuarioAplicacion(idUsuario, id_apli, ver, crear, modificar, eliminar, fecha, fecha);
            }

            db.actualizarUsuarioSucursal(idUsuario, id_sucursal, fechaUsRolCreada, fecha);
               
        }else{
            JOptionPane.showMessageDialog(null, "Ingrese los campos requeridos.");
        }  
        
        JOptionPane.showMessageDialog(null, "El usuario se actualizo sin problemas");
    }
    
    @SuppressWarnings("unchecked")
    
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        datosNombre = new javax.swing.JTextField();
        jLabel3 = new javax.swing.JLabel();
        datosApellidoPaterno = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        datosApellidoMaterno = new javax.swing.JTextField();
        jLabel5 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
        datosUsuario = new javax.swing.JTextField();
        jLabel7 = new javax.swing.JLabel();
        datosClave = new javax.swing.JTextField();
        jLabel8 = new javax.swing.JLabel();
        comboRol = new javax.swing.JComboBox<>();
        jLabel9 = new javax.swing.JLabel();
        radioActivo = new javax.swing.JCheckBox();
        jLabel10 = new javax.swing.JLabel();
        jScrollPane2 = new javax.swing.JScrollPane();
        tablaRoles = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 ;
            }
        };
        jLabel11 = new javax.swing.JLabel();
        jLabel12 = new javax.swing.JLabel();
        jLabel13 = new javax.swing.JLabel();
        comboNombreSucur = new javax.swing.JComboBox<>();
        guardar = new javax.swing.JButton();
        requerido1 = new javax.swing.JLabel();
        requerido2 = new javax.swing.JLabel();
        requerido3 = new javax.swing.JLabel();
        cancelar = new javax.swing.JButton();
        comoGrupo = new javax.swing.JComboBox<>();
        jLabel14 = new javax.swing.JLabel();
        comboDatosEmpresa = new javax.swing.JComboBox<>();
        requerido4 = new javax.swing.JLabel();
        requerido5 = new javax.swing.JLabel();
        labelExiste = new javax.swing.JLabel();
        requerido6 = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.DO_NOTHING_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(43, 125, 188));
        jLabel1.setText("DATOS PERSONALES");

        jLabel2.setForeground(new java.awt.Color(43, 125, 188));
        jLabel2.setText("Nombres");

        jLabel3.setForeground(new java.awt.Color(43, 125, 188));
        jLabel3.setText("Apellido Paterno");

        datosApellidoPaterno.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                datosApellidoPaternoActionPerformed(evt);
            }
        });

        jLabel4.setForeground(new java.awt.Color(43, 125, 188));
        jLabel4.setText("Apellido Materno");

        jLabel5.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(43, 125, 188));
        jLabel5.setText("DATOS DE USUARIO");

        jLabel6.setForeground(new java.awt.Color(43, 125, 188));
        jLabel6.setText("Usuario");

        jLabel7.setForeground(new java.awt.Color(43, 125, 188));
        jLabel7.setText("Clave");

        jLabel8.setForeground(new java.awt.Color(43, 125, 188));
        jLabel8.setText("Rol");

        comboRol.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboRol.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboRolActionPerformed(evt);
            }
        });

        jLabel9.setForeground(new java.awt.Color(43, 125, 188));
        jLabel9.setText("Activo?");

        radioActivo.setBackground(new java.awt.Color(255, 255, 255));
        radioActivo.setSelected(true);
        radioActivo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                radioActivoActionPerformed(evt);
            }
        });

        jLabel10.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(43, 125, 188));
        jLabel10.setText("ROL");

        tablaRoles.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Aplicaciones", "Ver", "Crear", "Modifica", "Eliminar"
            }
        ) {
            Class[] types = new Class [] {
                java.lang.Object.class, java.lang.Boolean.class, java.lang.Boolean.class, java.lang.Boolean.class, java.lang.Boolean.class
            };
            boolean[] canEdit = new boolean [] {
                false, true, true, true, true
            };

            public Class getColumnClass(int columnIndex) {
                return types [columnIndex];
            }

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        tablaRoles.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaRolesMouseClicked(evt);
            }
            public void mousePressed(java.awt.event.MouseEvent evt) {
                tablaRolesMousePressed(evt);
            }
            public void mouseReleased(java.awt.event.MouseEvent evt) {
                tablaRolesMouseReleased(evt);
            }
        });
        jScrollPane2.setViewportView(tablaRoles);
        if (tablaRoles.getColumnModel().getColumnCount() > 0) {
            tablaRoles.getColumnModel().getColumn(1).setMinWidth(45);
            tablaRoles.getColumnModel().getColumn(1).setPreferredWidth(45);
            tablaRoles.getColumnModel().getColumn(1).setMaxWidth(45);
            tablaRoles.getColumnModel().getColumn(2).setMinWidth(45);
            tablaRoles.getColumnModel().getColumn(2).setPreferredWidth(45);
            tablaRoles.getColumnModel().getColumn(2).setMaxWidth(45);
            tablaRoles.getColumnModel().getColumn(3).setMinWidth(59);
            tablaRoles.getColumnModel().getColumn(3).setPreferredWidth(59);
            tablaRoles.getColumnModel().getColumn(3).setMaxWidth(59);
            tablaRoles.getColumnModel().getColumn(4).setMinWidth(58);
            tablaRoles.getColumnModel().getColumn(4).setPreferredWidth(58);
            tablaRoles.getColumnModel().getColumn(4).setMaxWidth(58);
        }

        jLabel11.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        jLabel11.setForeground(new java.awt.Color(43, 125, 188));
        jLabel11.setText("DATOS DE LA EMPRESA");

        jLabel12.setForeground(new java.awt.Color(43, 125, 188));
        jLabel12.setText("Empresa");

        jLabel13.setForeground(new java.awt.Color(43, 125, 188));
        jLabel13.setText("Sucursal");

        comboNombreSucur.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));

        guardar.setBackground(new java.awt.Color(98, 155, 88));
        guardar.setText("Guardar");
        guardar.setBorder(new javax.swing.border.SoftBevelBorder(javax.swing.border.BevelBorder.RAISED));
        guardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                guardarActionPerformed(evt);
            }
        });

        requerido1.setForeground(new java.awt.Color(255, 51, 51));
        requerido1.setText("Requerido");

        requerido2.setForeground(new java.awt.Color(255, 51, 51));
        requerido2.setText("Requerido");

        requerido3.setForeground(new java.awt.Color(255, 51, 51));
        requerido3.setText("Requerido");

        cancelar.setBackground(new java.awt.Color(183, 70, 53));
        cancelar.setText("Cancelar");
        cancelar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(209, 91, 71)));
        cancelar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cancelarActionPerformed(evt);
            }
        });

        comoGrupo.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));

        jLabel14.setForeground(new java.awt.Color(43, 125, 188));
        jLabel14.setText("Grupos");

        comboDatosEmpresa.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { " " }));
        comboDatosEmpresa.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                comboDatosEmpresaActionPerformed(evt);
            }
        });

        requerido4.setForeground(new java.awt.Color(255, 51, 51));
        requerido4.setText("Requerido");

        requerido5.setForeground(new java.awt.Color(255, 51, 51));
        requerido5.setText("Requerido");

        labelExiste.setForeground(new java.awt.Color(255, 51, 51));
        labelExiste.setText("Requerido");

        requerido6.setForeground(new java.awt.Color(255, 51, 51));
        requerido6.setText("Requerido");

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGap(346, 346, 346))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(jLabel2, javax.swing.GroupLayout.DEFAULT_SIZE, 120, Short.MAX_VALUE)
                            .addComponent(requerido1)
                            .addComponent(datosNombre))
                        .addGap(18, 18, 18)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel3, javax.swing.GroupLayout.DEFAULT_SIZE, 128, Short.MAX_VALUE)
                                    .addComponent(datosApellidoPaterno))
                                .addGap(21, 21, 21))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(requerido2)
                                .addGap(98, 98, 98)))
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(requerido3)
                            .addComponent(jLabel4, javax.swing.GroupLayout.DEFAULT_SIZE, 122, Short.MAX_VALUE)
                            .addComponent(datosApellidoMaterno))
                        .addGap(295, 295, 295))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                        .addGap(0, 0, Short.MAX_VALUE)
                        .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 83, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(139, 139, 139)
                        .addComponent(guardar, javax.swing.GroupLayout.PREFERRED_SIZE, 85, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(91, 91, 91))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(jLabel5, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.PREFERRED_SIZE, 287, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                                    .addComponent(datosUsuario)
                                    .addComponent(jLabel6, javax.swing.GroupLayout.DEFAULT_SIZE, 116, Short.MAX_VALUE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(datosClave, javax.swing.GroupLayout.PREFERRED_SIZE, 116, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel7, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(requerido6))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel8, javax.swing.GroupLayout.PREFERRED_SIZE, 110, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(comboRol, javax.swing.GroupLayout.PREFERRED_SIZE, 171, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addGap(18, 18, 18)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel9, javax.swing.GroupLayout.PREFERRED_SIZE, 44, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(radioActivo, javax.swing.GroupLayout.PREFERRED_SIZE, 33, javax.swing.GroupLayout.PREFERRED_SIZE))))
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(labelExiste)
                            .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 393, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel10, javax.swing.GroupLayout.PREFERRED_SIZE, 287, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(jLabel12)
                                .addGap(112, 112, 112)
                                .addComponent(jLabel13))
                            .addComponent(jLabel11, javax.swing.GroupLayout.PREFERRED_SIZE, 287, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(comboDatosEmpresa, javax.swing.GroupLayout.PREFERRED_SIZE, 122, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(requerido4))
                                .addGap(18, 18, 18)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(jPanel1Layout.createSequentialGroup()
                                        .addComponent(comboNombreSucur, javax.swing.GroupLayout.PREFERRED_SIZE, 128, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(18, 18, 18)
                                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(jLabel14)
                                            .addComponent(comoGrupo, javax.swing.GroupLayout.PREFERRED_SIZE, 136, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                    .addComponent(requerido5))))
                        .addGap(0, 0, Short.MAX_VALUE))))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel2)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(datosNombre, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(7, 7, 7)
                        .addComponent(requerido1))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel3)
                            .addComponent(jLabel4))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(datosApellidoPaterno, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(datosApellidoMaterno, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(requerido2)
                            .addComponent(requerido3))))
                .addGap(18, 18, 18)
                .addComponent(jLabel5)
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel6)
                    .addComponent(jLabel7)
                    .addComponent(jLabel8)
                    .addComponent(jLabel9))
                .addGap(10, 10, 10)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(radioActivo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(datosUsuario)
                    .addComponent(datosClave)
                    .addComponent(comboRol, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(labelExiste)
                    .addComponent(requerido6))
                .addGap(16, 16, 16)
                .addComponent(jLabel11)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel12)
                    .addComponent(jLabel13)
                    .addComponent(jLabel14))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(comboDatosEmpresa)
                    .addComponent(comboNombreSucur)
                    .addComponent(comoGrupo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(requerido4)
                    .addComponent(requerido5))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel10)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 117, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(30, 30, 30)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(guardar, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(54, Short.MAX_VALUE))
        );

        jScrollPane1.setViewportView(jPanel1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane1, javax.swing.GroupLayout.Alignment.TRAILING)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void comboDatosEmpresaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboDatosEmpresaActionPerformed
        String nom_empresa = (String) comboDatosEmpresa.getSelectedItem();
        String rol = (String) comboRol.getSelectedItem();
        //if (this.id_persona == 0) {
            if (!nom_empresa.equals(" ") && !rol.equals(" ") ) {
                mostrarAplicaciones(rol,nom_empresa); 
            }
        //}
        
        ResultSet rs = null;
        try {
            comboNombreSucur.removeAllItems();
            rs = db.seleccionar("SELECT S.NOMBRE\n" +
                "FROM EMPRESA AS E\n" +
                "INNER JOIN SUCURSAL AS S ON S.EMPRESA = E.ID\n" +
                "WHERE RAZON_SOCIAL = '"+nom_empresa+"'");
            while (rs.next()) {
                comboNombreSucur.addItem(rs.getString(1));
            }
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }
        
    }//GEN-LAST:event_comboDatosEmpresaActionPerformed

    private void cancelarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cancelarActionPerformed
        dispose();
    }//GEN-LAST:event_cancelarActionPerformed

    private void guardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_guardarActionPerformed
        contVerif = 0;
        verificar();
        if(this.id_persona != 0){
            
           actualizarUsuario();
            
        }else{
            labelExiste.setVisible(false);
            ArrayList<ListaRoles> listaR = new ArrayList();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            java.util.Date fe = new java.util.Date();
            long d = fe.getTime();
            java.sql.Date fecha = new java.sql.Date(d);
            String fechaUpda = sdf.format(fecha);       

            String nombre = datosNombre.getText();
            String apellidoP = datosApellidoPaterno.getText();
            String apellidoM = datosApellidoMaterno.getText();
            String nombre_completo = nombre+" "+apellidoP+" "+apellidoM;
            String usuario = datosUsuario.getText();
            String clave = encode(datosClave.getText());
            String nombreRol = (String) comboRol.getSelectedItem();
            int id_rol = obtenerIdRol(nombreRol);
            boolean activo = radioActivo.isSelected();
            String nombreEmpresa = (String) comboDatosEmpresa.getSelectedItem();
            int empresa = obtenerIdEmpresa(nombreEmpresa);
            String nombreSucursal = (String) comboNombreSucur.getSelectedItem();
            int id_sucursal = obtenerIdSucursal(nombreSucursal);
            String token = Encriptar(nombre_completo);
            int comision_general = 0;
            int comision_activa = 0;

            if (contVerif == 0) {
                if(VerificarUsuario() == false){
                    db.actualizarPersona(0, nombre_completo, apellidoP, apellidoM, nombre, clave, false);         
                    int id_per = db.seleccionarUltimoIdPersona();
                    db.InsertarUsuario(id_per, empresa, usuario, clave, token, activo, fechaUpda, fechaUpda, comision_general, comision_activa,false);

                    int id_usuario = db.seleccionarUltimoIdUsuario();            
                    db.insertarUsuarioRol(id_usuario, id_rol, fecha, fecha,false);

                    String consulEliminar = "DELETE FROM APP.USUARIO_APLICACION WHERE USUARIO = "+id_usuario;
                    db.eliminarProductos(consulEliminar);

                    for (int i = 0; i < listarDatosTabla().size(); i++) {
                        int aplicacion = listarDatosTabla().get(i).getAplicacion();
                        boolean ver = listarDatosTabla().get(i).getVer();
                        boolean  crear = listarDatosTabla().get(i).getCrear();
                        boolean modificar = listarDatosTabla().get(i).getModificar();
                        boolean eliminar = listarDatosTabla().get(i).getEliminar();
                        db.insertarUsuarioAplicacion(id_usuario, aplicacion, ver, crear, modificar, eliminar, fecha, fecha);
                    }
                    db.insertarUsuarioSursal(id_usuario, id_sucursal, fecha, fecha,false);
                    
                    JOptionPane.showMessageDialog(null, "Guardado Exitosamente");
                    dispose();
                }else{
                    JOptionPane.showMessageDialog(null, "Ya existe el usuario.");
                    labelExiste.setVisible(true);
                }
            }else{
                JOptionPane.showMessageDialog(null, "Ingrese los campos requeridos.");
            }
        }    
    }//GEN-LAST:event_guardarActionPerformed

    private void tablaRolesMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaRolesMouseClicked
        // TODO add your handling code here:
        int columna = tablaRoles.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaRoles.getRowHeight();

        String aplicacion;
        boolean crear;
        boolean ver;
        boolean modificar;
        boolean eliminar;

        if (fila < tablaRoles.getRowCount() && fila >= 0 && columna < tablaRoles.getColumnCount() && columna >= 0) {
            Object value = tablaRoles.getValueAt(fila, columna);

            aplicacion = String.valueOf(tablaRoles.getValueAt(fila,0));
            crear = Boolean.parseBoolean(String.valueOf(tablaRoles.getValueAt(fila,1)));
            ver = Boolean.parseBoolean(String.valueOf(tablaRoles.getValueAt(fila,2)));
            modificar = Boolean.parseBoolean(String.valueOf(tablaRoles.getValueAt(fila,3)));
            eliminar = Boolean.parseBoolean(String.valueOf(tablaRoles.getValueAt(fila,4)));


        }
    }//GEN-LAST:event_tablaRolesMouseClicked

    private void radioActivoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_radioActivoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_radioActivoActionPerformed

    private void comboRolActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_comboRolActionPerformed
         String nom_empresa = (String) comboDatosEmpresa.getSelectedItem();
        String rol = (String) comboRol.getSelectedItem();
        //if (this.id_persona == 0) {
            if (!nom_empresa.equals(" ") && !rol.equals(" ") ) {
                mostrarAplicaciones(rol,nom_empresa); 
            }
        //}
    }//GEN-LAST:event_comboRolActionPerformed

    private void datosApellidoPaternoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_datosApellidoPaternoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_datosApellidoPaternoActionPerformed

    private void tablaRolesMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaRolesMousePressed
        
    }//GEN-LAST:event_tablaRolesMousePressed

    private void tablaRolesMouseReleased(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaRolesMouseReleased
        int columna = tablaRoles.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaRoles.getRowHeight();
        String rol = (String) comboRol.getSelectedItem();
        String aplicacion;
        boolean crear;
        boolean ver;
        boolean modificar;
        boolean eliminar;

        if (fila < tablaRoles.getRowCount() && fila >= 0 && columna < tablaRoles.getColumnCount() && columna >= 0) {
            Object value = tablaRoles.getValueAt(fila, columna);

            aplicacion = String.valueOf(tablaRoles.getValueAt(fila,0));
            ver = Boolean.parseBoolean(String.valueOf(tablaRoles.getValueAt(fila,2)));
            crear = Boolean.parseBoolean(String.valueOf(tablaRoles.getValueAt(fila,1)));          
            modificar = Boolean.parseBoolean(String.valueOf(tablaRoles.getValueAt(fila,3)));
            eliminar = Boolean.parseBoolean(String.valueOf(tablaRoles.getValueAt(fila,4)));

            if (value instanceof Boolean) {
                if (rol.equals("OPERADOR")) {
                    if (aplicacion.equals("COMPRAS")) {
                        if (columna == 2) {
                            tablaRoles.setValueAt(false, fila, 2);

                        }
                        if (columna == 3) {
                            tablaRoles.setValueAt(false, fila, 3);

                        }
                        if (columna == 4) {
                            tablaRoles.setValueAt(false, fila, 4);

                        }
                    }
                    if (aplicacion.equals("VENTAS")) {
                        if (columna == 2) {
                            tablaRoles.setValueAt(false, fila, 2);

                        }
                        if (columna == 3) {
                            tablaRoles.setValueAt(false, fila, 3);

                        }
                        if (columna == 4) {
                            tablaRoles.setValueAt(false, fila, 4);

                        }
                    }
                }
                
               if (rol.equals("VENDEDOR")) {
                    if (aplicacion.equals("COMPRAS")) {
                        if (columna == 2) {
                            tablaRoles.setValueAt(false, fila, 2);

                        }
                        if (columna == 3) {
                            tablaRoles.setValueAt(false, fila, 3);

                        }
                        if (columna == 4) {
                            tablaRoles.setValueAt(false, fila, 4);

                        }
                    }
                    if (aplicacion.equals("VENTAS")) {
                        if (columna == 2) {
                            tablaRoles.setValueAt(false, fila, 2);

                        }
                        if (columna == 3) {
                            tablaRoles.setValueAt(false, fila, 3);

                        }
                        if (columna == 4) {
                            tablaRoles.setValueAt(false, fila, 4);

                        }
                    }
                }
            }
        }
    }//GEN-LAST:event_tablaRolesMouseReleased

    /**
     * @param args the command line arguments
     */  
  


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton cancelar;
    private javax.swing.JComboBox<String> comboDatosEmpresa;
    private javax.swing.JComboBox<String> comboNombreSucur;
    private javax.swing.JComboBox<String> comboRol;
    private javax.swing.JComboBox<String> comoGrupo;
    private javax.swing.JTextField datosApellidoMaterno;
    private javax.swing.JTextField datosApellidoPaterno;
    private javax.swing.JTextField datosClave;
    private javax.swing.JTextField datosNombre;
    private javax.swing.JTextField datosUsuario;
    private javax.swing.JButton guardar;
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
    private javax.swing.JLabel labelExiste;
    private javax.swing.JCheckBox radioActivo;
    private javax.swing.JLabel requerido1;
    private javax.swing.JLabel requerido2;
    private javax.swing.JLabel requerido3;
    private javax.swing.JLabel requerido4;
    private javax.swing.JLabel requerido5;
    private javax.swing.JLabel requerido6;
    private javax.swing.JTable tablaRoles;
    // End of variables declaration//GEN-END:variables
}
