/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.Dimension;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.net.ssl.HttpsURLConnection;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import models.*;
import org.json.JSONException;
import org.json.JSONObject;
import models.Database;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.StringUtils;
import org.apache.commons.codec.digest.MessageDigestAlgorithms;

/**
 *
 * @author AGIL
 */
public class Login extends javax.swing.JFrame {

    Database db = new Database();

    /**
     * Creates new form Login
     */
    public String muestraUsuario(String archivo) throws FileNotFoundException, IOException {
        String cadena = "";
        FileReader f = new FileReader(archivo);
        BufferedReader b = new BufferedReader(f);
        String copiar = "";
        String aux = "";
        while (true) {
            aux = b.readLine();

            if (aux != null) {
                copiar = copiar + aux;
            } else {
                break;
            }
        }
        /* while (cadena!=null) {            
            cadena =  b.readLine();
            
            String x;
            x = cadena;
            String[] arreglo = x.split("");
            
            for (int i = 0; i < arreglo.length; i++) {
                System.out.println(""+arreglo[i]);
            }
            if (cadena == null){
                break;
            };
        }*/
        b.close();
        f.close();
        //System.out.println(copiar);
        return copiar;
    }

    public String muestraContra(String archivo) throws FileNotFoundException, IOException {
        String cadena = "";
        FileReader f = new FileReader(archivo);
        BufferedReader b = new BufferedReader(f);
        String copiar = "";
        String aux = "";
        while (true) {
            aux = b.readLine();

            if (aux != null) {
                copiar = copiar + aux;
            } else {
                break;
            }
        }
        b.close();
        f.close();
        //System.out.println(copiar);
        return copiar;
    }

    private String getConnectionStatus() {
        String conStatus = null;
        try {
            URL u = new URL("https://www.google.com/");
            HttpsURLConnection huc = (HttpsURLConnection) u.openConnection();
            huc.connect();
            conStatus = "Online";
        } catch (Exception e) {
            conStatus = "Offline";
        }
        return conStatus;
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
    
    public String decode(String s) {
        return StringUtils.newStringUtf8(Base64.decodeBase64(s));
    }
    
    public String encode(String s) {
        return Base64.encodeBase64String(StringUtils.getBytesUtf8(s));
    }
    

    public Login() {
        initComponents();
        setLocationRelativeTo(null);
        this.setSize(new Dimension(427, 370)); 
        this.setResizable(false); 

    }

    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jLabel1 = new javax.swing.JLabel();
        jtxtUsuarioLogin = new javax.swing.JTextField();
        jLabel2 = new javax.swing.JLabel();
        jButtonEntrar = new javax.swing.JButton();
        jButtonCerrar = new javax.swing.JButton();
        jPassword = new javax.swing.JPasswordField();
        jLabel3 = new javax.swing.JLabel();
        jRadioButtonSi = new javax.swing.JRadioButton();
        jRadioButtonNo = new javax.swing.JRadioButton();
        fondo = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        getContentPane().setLayout(null);

        jLabel1.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(255, 255, 255));
        jLabel1.setText("USUARIO");
        getContentPane().add(jLabel1);
        jLabel1.setBounds(80, 100, 122, 16);

        jtxtUsuarioLogin.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jtxtUsuarioLoginActionPerformed(evt);
            }
        });
        getContentPane().add(jtxtUsuarioLogin);
        jtxtUsuarioLogin.setBounds(80, 120, 280, 30);

        jLabel2.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("CONTRASEÑA");
        getContentPane().add(jLabel2);
        jLabel2.setBounds(80, 160, 160, 20);

        jButtonEntrar.setText("Entrar");
        jButtonEntrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonEntrarActionPerformed(evt);
            }
        });
        getContentPane().add(jButtonEntrar);
        jButtonEntrar.setBounds(120, 300, 63, 23);

        jButtonCerrar.setText("Cerrar");
        jButtonCerrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonCerrarActionPerformed(evt);
            }
        });
        getContentPane().add(jButtonCerrar);
        jButtonCerrar.setBounds(230, 300, 63, 23);

        jPassword.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jPasswordActionPerformed(evt);
            }
        });
        getContentPane().add(jPassword);
        jPassword.setBounds(80, 180, 280, 30);

        jLabel3.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(255, 255, 255));
        jLabel3.setText("Red");
        getContentPane().add(jLabel3);
        jLabel3.setBounds(80, 220, 110, 20);

        jRadioButtonSi.setBackground(new java.awt.Color(204, 204, 255));
        jRadioButtonSi.setForeground(new java.awt.Color(255, 255, 255));
        jRadioButtonSi.setText("Si");
        getContentPane().add(jRadioButtonSi);
        jRadioButtonSi.setBounds(150, 250, 50, 23);

        jRadioButtonNo.setBackground(new java.awt.Color(204, 204, 255));
        jRadioButtonNo.setForeground(new java.awt.Color(255, 255, 255));
        jRadioButtonNo.setText("No");
        jRadioButtonNo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jRadioButtonNoActionPerformed(evt);
            }
        });
        getContentPane().add(jRadioButtonNo);
        jRadioButtonNo.setBounds(230, 250, 50, 23);

        fondo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/fondo.png"))); // NOI18N
        fondo.setMaximumSize(new java.awt.Dimension(2147483647, 2147483647));
        fondo.setMinimumSize(new java.awt.Dimension(2147483647, 2147483647));
        getContentPane().add(fondo);
        fondo.setBounds(0, 0, 420, 340);

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jButtonCerrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonCerrarActionPerformed
        // TODO add your handling code here:
        System.exit(0);
    }//GEN-LAST:event_jButtonCerrarActionPerformed

    private void jtxtUsuarioLoginActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jtxtUsuarioLoginActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_jtxtUsuarioLoginActionPerformed

    private void jButtonEntrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonEntrarActionPerformed
        // TODO add your handling code here:
        String usuario = null;
        String contrasenia = null;
        int id_usuario = 0;
        String id_empresa = null;
        String txtUsuario = "";
        String txtContrasenia = "";
        String no = null;
        String si = null;
        usuario = jtxtUsuarioLogin.getText();
        contrasenia = jPassword.getText();

        if ((jRadioButtonNo.isSelected()) && (jRadioButtonSi.isSelected())) {
            JOptionPane.showMessageDialog(this, "Seleccione una opcion!");
            
        } 
        //CONECTAR SIN CONECCION
        else if (jRadioButtonNo.isSelected()) {
            String claveEncriptada = encode(contrasenia);
            AgregarProducto agregar;
            try {
                if (db.Autentificacion(usuario, claveEncriptada) == true) {
                    //int id = db.selectIdLogin(usuario, claveEncriptada);
                    int id=0;
                    int empresa=0;
                    for (int i = 0; i < db.selectIdLogin(usuario, claveEncriptada).size(); i++) {
                        id = db.selectIdLogin(usuario, claveEncriptada).get(i).getId();
                        empresa = db.selectIdLogin(usuario, claveEncriptada).get(i).getEmpresa();

                    }
                    if (empresa != 0) {
                        /*Solicitudes solicitud = new Solicitudes(id);
                        solicitud.setVisible(true);
                        dispose();*/
                        UsuarioUI usuariopanel = new UsuarioUI(id);
                        usuariopanel.setVisible(true);
                        dispose();
                    }else{
                        AdministradorUI admin = new AdministradorUI();
                        admin.setVisible(true);

                        dispose(); 
                    }
                    
                    // System.out.println(id);
                    /*agregar = new AgregarProducto(id);
                    agregar.setVisible(true);*/
                    
                } else {
                    JOptionPane.showMessageDialog(null, "El usuario o la contraseña con incorretas! ");
                }
            } catch (Exception e) {
                System.out.println("Erro al ver los roles admin empresa " + e.getMessage());
                System.out.println(e);
                
            }

        } 
        //CONECTAR CON CONEXION
        else if (jRadioButtonSi.isSelected()) {
            String url = "/autenticar";
            try {
                JSONObject datos = new JSONObject();

                datos.put("nombre_usuario", usuario);
                datos.put("clave", contrasenia);
                datos.put("id_empresa", id_empresa);
                datos.put("id", id_usuario);
                JSONObject res = RestServer.postJSONdata(url, datos);
                //System.out.println(res);
                //int jsonId = res.getJSONObject("data").getInt("id");

                if (res.getBoolean("type") == true) {
                    
                    int id = res.getJSONObject("data").getInt("id");
                    int id_persona = res.getJSONObject("data").getInt("id_persona");
                    String id_emp = (String) res.getJSONObject("data").get("id_empresa").toString();
                    String nombre = res.getJSONObject("data").getString("nombre_usuario");          
                    String claveEncriptada = encode(contrasenia);
                    String token =  res.getJSONObject("data").getString("token");
                    boolean activo = res.getJSONObject("data").getBoolean("activo");
                    String fechaCreada = res.getJSONObject("data").getString("createdAt");
                    String fechaActualiza = res.getJSONObject("data").getString("updatedAt");
                    String comision_general_texto = res.getJSONObject("data").get("comision_general").toString();                 
                    String comision_activa_texto = res.getJSONObject("data").get("comision_activa").toString();
                    int comision_general = 0;
                    int comision_activa = 0;
                    if (comision_general_texto.equals("null")){comision_general = 0;}else{comision_general = Integer.parseInt(comision_general_texto);}
                    if (comision_activa_texto.equals("null")){comision_activa = 0;}else{comision_activa = Integer.parseInt(comision_activa_texto);}

                    
                    if (id_emp == "null") {
                        int IdEmp = 0;
                        //db.InsertarUsuario(id_persona, IdEmp, nombre, claveEncriptada, token, activo, fechaCreada, fechaActualiza, comision_general, comision_activa);
                      //  db.login(id_persona, IdEmp);
                        AdministradorUI admin = new AdministradorUI();
                        admin.setVisible(true);
                        dispose(); 

                    }else{
      
                        int IdEmp = res.getJSONObject("data").getInt("id_empresa");      
                      //  db.actualizarUsuario(id, id_persona, IdEmp, nombre, claveEncriptada, token, activo, fechaCreada, fechaActualiza, comision_general, comision_activa);
                      
//                        int idPersona = res.getJSONObject("data").getJSONObject("persona").getInt("id");
//                        String nombreCompletoPersona = res.getJSONObject("data").getJSONObject("persona").getString("nombre_completo");
//                        String apellidoPaPersona = res.getJSONObject("data").getJSONObject("persona").getString("apellido_paterno");
//                        String apellidoMaPersona = res.getJSONObject("data").getJSONObject("persona").getString("apellido_materno");
//                        String nombres = res.getJSONObject("data").getJSONObject("persona").getString("nombres");
//                        String imagen = res.getJSONObject("data").getJSONObject("persona").getString("imagen");
//                        db.actualizarPersana(idPersona, nombreCompletoPersona, apellidoPaPersona, apellidoMaPersona, nombres, imagen);
                    
                        UsuarioUI usuarioConConeccion = new UsuarioUI();
                        usuarioConConeccion.setVisible(true);
                        dispose();
                        
                    }
                } else {
                    String mensaje = res.getString("data");
                    JOptionPane.showMessageDialog(this, mensaje);
                }
            } catch (JSONException ex) {
                System.out.println("Error: " + ex);
            }
        } else {
            JOptionPane.showMessageDialog(this, "Seleccione una opcion!");
        }
    }//GEN-LAST:event_jButtonEntrarActionPerformed

    private void jPasswordActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jPasswordActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_jPasswordActionPerformed

    private void jRadioButtonNoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jRadioButtonNoActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_jRadioButtonNoActionPerformed

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
            java.util.logging.Logger.getLogger(Login.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(Login.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(Login.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(Login.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new Login().setVisible(true);
                new Login().setLocationRelativeTo(null);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel fondo;
    private javax.swing.JButton jButtonCerrar;
    private javax.swing.JButton jButtonEntrar;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JPasswordField jPassword;
    private javax.swing.JRadioButton jRadioButtonNo;
    private javax.swing.JRadioButton jRadioButtonSi;
    private javax.swing.JTextField jtxtUsuarioLogin;
    // End of variables declaration//GEN-END:variables

    public JTextField getTxtUsarioLogin() {
        return jtxtUsuarioLogin;
    }

    private FileInputStream OpenFileInput(String file) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}
