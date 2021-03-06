/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package UI;

import Conexion.Conexion;
import Conexion.LoginDB;
import Conexion.RestServer;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import Conexion.DataBase;
import java.net.URL;
import java.net.URLConnection;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.StringUtils;
import org.apache.commons.codec.digest.MessageDigestAlgorithms;
/**
 *
 * @author AGIL
 */
public class Login extends javax.swing.JFrame {
    public DataBase db = new DataBase();
    /**
     * Creates new form Loging
     */
    public Login() {
        initComponents();
        setLocationRelativeTo(null);
        
    }
    
       
   
    private static final char[] CONSTS_HEX = {'0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f' };
    public static String encriptaEnMD5(String stringAEncriptar){
        try
        {
           MessageDigest msgd = MessageDigest.getInstance("MD5");
           byte[] bytes = msgd.digest(stringAEncriptar.getBytes());
           StringBuilder strbCadenaMD5 = new StringBuilder(2 * bytes.length);
           for (int i = 0; i < bytes.length; i++)
           {
                int bajo = (int)(bytes[i] & 0x0f);
                int alto = (int)((bytes[i] & 0xf0) >> 4);
                strbCadenaMD5.append(CONSTS_HEX[alto]);
                strbCadenaMD5.append(CONSTS_HEX[bajo]);
           }
           return strbCadenaMD5.toString();
        } catch (NoSuchAlgorithmException e) {
           return null;
        }
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
    
    private boolean getConnectionStatus() {
        String estado = "";
        boolean respuesta = false;
        try { 
            URL ruta=new URL("http://agilsof.net/"); 
            URLConnection rutaC = ruta.openConnection(); 
            rutaC.connect(); 
            estado="Online"; 
            respuesta = true;
        }catch(Exception e){ 
            estado="Offline"; 
            respuesta  = false;
        } 
        return respuesta;   
    }
    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        txtUsuario = new javax.swing.JTextField();
        jLabel3 = new javax.swing.JLabel();
        btnCerrar = new javax.swing.JButton();
        btnEntrar = new javax.swing.JButton();
        jLabel4 = new javax.swing.JLabel();
        radioSi = new javax.swing.JRadioButton();
        radioNo = new javax.swing.JRadioButton();
        txtContraseña = new javax.swing.JPasswordField();
        jLabel1 = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setMinimumSize(new java.awt.Dimension(426, 360));
        setResizable(false);
        getContentPane().setLayout(null);

        jPanel1.setLayout(null);

        jLabel2.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("USUARIO");
        jPanel1.add(jLabel2);
        jLabel2.setBounds(100, 100, 60, 15);

        txtUsuario.setBorder(javax.swing.BorderFactory.createEmptyBorder(1, 1, 1, 1));
        txtUsuario.setPreferredSize(new java.awt.Dimension(4, 16));
        txtUsuario.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                txtUsuarioActionPerformed(evt);
            }
        });
        jPanel1.add(txtUsuario);
        txtUsuario.setBounds(100, 120, 180, 20);

        jLabel3.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(255, 255, 255));
        jLabel3.setText("CONTRASEÑA");
        jPanel1.add(jLabel3);
        jLabel3.setBounds(100, 150, 90, 15);

        btnCerrar.setText("Cerrar");
        btnCerrar.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        btnCerrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnCerrarActionPerformed(evt);
            }
        });
        jPanel1.add(btnCerrar);
        btnCerrar.setBounds(310, 280, 70, 30);

        btnEntrar.setText("Entrar");
        btnEntrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnEntrarActionPerformed(evt);
            }
        });
        jPanel1.add(btnEntrar);
        btnEntrar.setBounds(210, 280, 63, 30);

        jLabel4.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(255, 255, 255));
        jLabel4.setText("Conectar a red");
        jPanel1.add(jLabel4);
        jLabel4.setBounds(100, 210, 90, 15);

        radioSi.setBackground(new java.awt.Color(22, 135, 176));
        radioSi.setForeground(new java.awt.Color(255, 255, 255));
        radioSi.setText("Si");
        radioSi.setBorder(null);
        jPanel1.add(radioSi);
        radioSi.setBounds(130, 230, 40, 23);

        radioNo.setBackground(new java.awt.Color(22, 135, 176));
        radioNo.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        radioNo.setForeground(new java.awt.Color(255, 255, 255));
        radioNo.setText("No");
        radioNo.setBorder(null);
        jPanel1.add(radioNo);
        radioNo.setBounds(260, 230, 40, 15);
        jPanel1.add(txtContraseña);
        txtContraseña.setBounds(100, 170, 180, 25);

        jLabel1.setBackground(new java.awt.Color(22, 135, 176));
        jLabel1.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(255, 255, 255));
        jLabel1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/fondo.png"))); // NOI18N
        jLabel1.setText("Entrar");
        jLabel1.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        jPanel1.add(jLabel1);
        jLabel1.setBounds(0, 0, 420, 330);

        getContentPane().add(jPanel1);
        jPanel1.setBounds(0, 0, 420, 330);

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void txtUsuarioActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_txtUsuarioActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_txtUsuarioActionPerformed

    private void btnCerrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnCerrarActionPerformed
        System.exit(0);
    }//GEN-LAST:event_btnCerrarActionPerformed

    private void btnEntrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnEntrarActionPerformed
        Date f = new Date();
        Long fe = f.getTime();
        java.sql.Date fechaAct = new java.sql.Date(fe);
        String usuario = txtUsuario.getText();
        String contra = txtContraseña.getText();
        boolean conRed = radioSi.isSelected();
        boolean sinRed = radioNo.isSelected();
       // LoginDB loginCon = new LoginDB();
        Connection conn = null;
        
        if (!usuario.equals("") && !contra.equals("")) {
            if (conRed == true && sinRed == true) {
                JOptionPane.showMessageDialog(null, "No puede elegir las dos opciones!");
                radioSi.setSelected(false);
                radioNo.setSelected(false);
            } else if (conRed == true) {
                if(getConnectionStatus() == true){
                    try {
                        String url = "autenticar";
                        JSONObject datos = new JSONObject();

                        datos.put("nombre_usuario", usuario);
                        datos.put("clave", contra);

                        JSONObject res = RestServer.postJSONdata(url, datos);
                        if (res.getBoolean("type") == true) {                  

                            int id = res.getJSONObject("data").getInt("id");
                            int id_persona = res.getJSONObject("data").getInt("id_persona"); 
                            int id_empresa = res.getJSONObject("data").getInt("id_empresa");
                            String nombre_usuario = res.getJSONObject("data").getString("nombre_usuario");
                            String clave = res.getJSONObject("data").getString("clave");
                            String token = res.getJSONObject("data").getString("token");
                            boolean active = res.getJSONObject("data").getBoolean("activo");
                            int comision_general = (res.getJSONObject("data").get("comision_general").toString().equals("null"))? 0:Integer.parseInt(res.getJSONObject("data").get("comision_general").toString());                      
                            int comision_activa = (res.getJSONObject("data").get("comision_activa").toString().equals("null"))? 0:Integer.parseInt(res.getJSONObject("data").get("comision_activa").toString()); 
                            String created = res.getJSONObject("data").getString("createdAt");
                            String updated = res.getJSONObject("data").getString("updatedAt");
                            boolean eliminado = false;

                            try {
                                conn = Conexion.getConnection(); 
                                //Revisamos si la conexion esta en modo autocommit 
                                //por default es autocommit == true 
                                if (conn.getAutoCommit()) { 
                                    conn.setAutoCommit(false); 
                                } 
                                LoginDB loginCon = new LoginDB(conn);
                                
                                
                                if (loginCon.existeUsuario(id) == true) {
                                    if (db.verifRegistroDiario(id, fechaAct) == true) {
                                        loginCon.actualizarUsuario(id,nombre_usuario,clave,token,active,updated);
                                        //VentasUI ventas = new VentasUI(id,id_empresa);
                                        //ventas.setVisible(true);
                                        ListarVentasUI listar = new ListarVentasUI(id, id_empresa);
                                        listar.setVisible(true);
                                        dispose();
                                    }else{
                                        loginCon.registrar(id, fechaAct);
                                        //thread de carga
                                        E1Threard carga = new E1Threard();
                                        carga.start();
                                        //thread de insertar sucursales y almacenes 
                                        insertarSucursalesAlmacenes sucursales = new insertarSucursalesAlmacenes("texto1", id_empresa);
                                        sucursales.start();   
                                        //thread de insercionde actividades
                                        insertarActividades actividades = new insertarActividades("texto2", id_empresa);
                                        actividades.start();
                                        //ingresar los productos
                                        CargaProductos productos = new CargaProductos("texto3", id, id_empresa);
                                        productos.start();

                                        loginCon.actualizarUsuario(id,nombre_usuario,clave,token,active,updated);

                                        ListarVentasUI listar = new ListarVentasUI(id, id_empresa);
                                        listar.setVisible(true);
                                        dispose();                                    
                                    }

                                }else{
                                    db.insertarRegistro(id, fechaAct);
                                    loginCon.ingresarUsuario(id,id_persona,id_empresa,nombre_usuario,clave,token,active,created,eliminado,comision_general,comision_activa);
                                   
                                      ListarVentasUI listar = new ListarVentasUI(id, id_empresa);
                                        listar.setVisible(true);
                                        dispose();  
                                }

                                conn.commit();
                            } catch (SQLException e) {
                                //Hacemos rollback en caso de error
                                try {
                                    System.out.println("Entramos al rollback");
                                //Imprimimos la excepcion a la consola
                                    e.printStackTrace(System.out);
                                //Hacemos rollback
                                    conn.rollback();
                                } catch (SQLException e1) {
                                    e1.printStackTrace(System.out);
                                }
                            }
                    }else{
                        JOptionPane.showMessageDialog(null, res.get("data"));                    
                    }

                }catch(Exception e){
                    System.out.println("Error en la conexion en el login");
                    System.out.println(e.getMessage());
                    System.out.println(e.getStackTrace());
                }
            }else{
                JOptionPane.showMessageDialog(null, "No existe conexion");
            }
                
        }else if (sinRed == true) {
                try {
                    conn = Conexion.getConnection(); 
                    //Revisamos si la conexion esta en modo autocommit 
                    //por default es autocommit == true 
                    if (conn.getAutoCommit()) { 
                        conn.setAutoCommit(false); 
                    } 
                    LoginDB loginCon = new LoginDB(conn);
                    
                    String pass = encriptaEnMD5(contra);

                    if (getConnectionStatus() == false) {
                       if(loginCon.existeUsuarioSinRed(usuario,pass) == true){
                            int id = loginCon.obtenerIdUsuario(usuario, pass);
                            int idEmpresa = loginCon.obtenerIdEmpresa(usuario, pass);
                            //VentasUI ventas = new VentasUI(id,idEmpresa);
                            //ventas.setVisible(true);
                            ListarVentasUI listar = new ListarVentasUI(id, idEmpresa);
                            listar.setVisible(true);
                            dispose();
                        }else{
                            JOptionPane.showMessageDialog(null, "No existe ese usuario o contraseña!");
                        }  
                    }else{
                        JOptionPane.showMessageDialog(null, "Existe conexion con el servidor.");
                    }
                    conn.commit();
                } catch (SQLException e) {
                    //Hacemos rollback en caso de error
                    try {
                        System.out.println("Entramos al rollback");
                    //Imprimimos la excepcion a la consola
                        e.printStackTrace(System.out);
                    //Hacemos rollback
                        conn.rollback();
                    } catch (SQLException e1) {
                        e1.printStackTrace(System.out);
                    }
                }
   
            }
        }
    }//GEN-LAST:event_btnEntrarActionPerformed

/**
 * @param args the command line arguments
 */
public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                

}
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(Login.class
.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        

} catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(Login.class
.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        

} catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(Login.class
.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        

} catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(Login.class
.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new Login().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnCerrar;
    private javax.swing.JButton btnEntrar;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JRadioButton radioNo;
    private javax.swing.JRadioButton radioSi;
    private javax.swing.JPasswordField txtContraseña;
    private javax.swing.JTextField txtUsuario;
    // End of variables declaration//GEN-END:variables
}
