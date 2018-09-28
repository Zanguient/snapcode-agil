/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package operacionesUI;

import java.awt.Dimension;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;
import java.security.MessageDigest;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.net.ssl.HttpsURLConnection;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JProgressBar;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import models.*;
import org.json.JSONException;
import org.json.JSONObject;
import models.Database;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.StringUtils;
import org.apache.commons.codec.digest.MessageDigestAlgorithms;
import org.json.JSONArray;

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

    public static String estadoConexion(){ 
    String estado; 
        try { 

            URL ruta=new URL("http://agilsof.net/"); 
            URLConnection rutaC = ruta.openConnection(); 
            rutaC.connect(); 
            estado="activo"; 
           }catch(Exception e){ 

            estado="desactivado"; 
        } 
        return estado; 
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
    
    private void InsertSucursal(int id_usuario, int idEmpresa) {

       if(getConnectionStatus() == true){
           try{
            String url = "/autenticar-sucursales/" + id_usuario;

            JSONArray res = RestServer.getJSONArray(url);
            for (int i = 0; i < res.length(); i++) {
                JSONObject data = res.getJSONObject(i);
                String nombre = (String) data.getJSONObject("sucursal").get("nombre").toString();
                int id = data.getInt("id_sucursal");

                db.insertarSucursal(id, nombre, id_usuario);
                
                JSONArray almacenes = data.getJSONObject("sucursal").getJSONArray("almacenes");

                for (int j = 0; j < almacenes.length(); j++) {
                    JSONObject recorrerAlmacen = almacenes.getJSONObject(j);
                    int id_almacen = recorrerAlmacen.getInt("id");
                    String nombre_almacen = recorrerAlmacen.getString("nombre");
                    int id_sucursal = (int) recorrerAlmacen.getInt("id_sucursal");

                    db.InsertAlmacen(id_almacen, nombre_almacen, id_sucursal);
                }
            }
           }catch(Exception e){
               System.out.println("Error: "+e);
           }
        }
    }
    
    public void obtenerAlmacen(int id_usuario, int idEmp){
        int idAlmacen = 0;
        ResultSet rs = null;
        String consulta = "SELECT A.ID\n" +
            "FROM ALMACEN AS A\n" +
            "INNER JOIN SUCURSAL AS S ON S.ID = A.ID_SUCURSAL\n" +
            "WHERE S.ID_USUARIO = "+id_usuario;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                idAlmacen = rs.getInt(1);
                if (idAlmacen != 0) {
                    SeleccionarProductosPanel(id_usuario, idAlmacen, idEmp);
                }
            }
        } catch (Exception e) {
            System.out.println("Error al seleccionar id sucursal: "+e.getMessage());
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(AgregarProducto.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
     
    }
    
    private void SeleccionarProductosPanel(int id_usuario, int id_almacen,int idEmp) {

        int id_alma = 0;
        int id_producto = 0;
        String nombreProducto = "";
        String unidad_medida = "";
        double precio_unitario = 0;
        double prec_unit = 0;
        String nombre_sucursal = "";
        int id_grupo = 0;
        int id_subgrupo = 0;
        String codigo = "";
        int id_pb = 0;
        String imagen = "";
        //int idEmp = 0; 
        double utilida_esperada = 0;
        int inventario_minimo = 0;
        boolean activarInventario = false;
        
//        for (int i = 0; i < db.seleccionarIdEmpresa(id_usuario).size(); i++) {
//            idEmp = db.seleccionarIdEmpresa(id_usuario).get(i).getId_empresa();
//        }     
        
        
        String url = "/productos-panel/empresa/"+idEmp+"/almacen/"+id_almacen+"/user/"+id_usuario;
             
        try {
            JSONArray res = RestServer.getJSONArray(url);
     
            int cantiInvetario = 0;
            for (int i = 0; i < res.length(); i++) {
                JSONObject data = res.getJSONObject(i);
      
                id_producto = data.getInt("id");
                nombreProducto = data.getString("nombre");
                unidad_medida = (String) data.get("unidad_medida").toString();
                precio_unitario = (data.get("precio_unitario").toString().equals("null"))? 0:Double.parseDouble(data.get("precio_unitario").toString());
                imagen = data.get("imagen").toString();
                id_alma = id_almacen;
                id_grupo = (data.get("id_grupo").toString().equals("null"))? 0:Integer.parseInt(data.get("id_grupo").toString());
                id_subgrupo = (data.get("id_subgrupo").toString().equals("null"))? 0:Integer.parseInt(data.get("id_subgrupo").toString());
                activarInventario = data.getBoolean("activar_inventario");
                codigo = (data.get("codigo_fabrica").toString().equals("null"))? "":(String)data.get("codigo_fabrica").toString();
                
                db.insertarProductos(id_alma, id_producto, nombreProducto, unidad_medida, precio_unitario, id_grupo, id_subgrupo,activarInventario,codigo);
               
                //Reecorre Inventarios
                JSONArray inventarios = data.getJSONArray("inventarios");
                for (int k = 0; k < inventarios.length(); k++) {
                    int inv_id = 0;
                    int inv_id_alma = 0;
                    int inv_id_pro = 0;
                    int inv_cant = 0;
                    int inv_cost_unit = 0;
                    int inv_cost_to = 0;
                    String inv_lote = "";
                    String inv_fecha_venci = "";
                    String inv_createdAt = "";
                    String inv_updatedAt = "";
                    JSONObject inventario = inventarios.getJSONObject(k);

                    inv_id = inventario.getInt("id");
                    inv_id_alma = inventario.getInt("id_almacen");
                    inv_id_pro = inventario.getInt("id_producto");
                    inv_cant = inventario.getInt("cantidad");
                    cantiInvetario += inv_cant;
                    inv_cost_unit = inventario.getInt("costo_unitario");
                    inv_cost_to = inventario.getInt("costo_total");

                    inv_lote = (String) inventario.get("lote").toString();

                    inv_fecha_venci = (String) inventario.get("fecha_vencimiento").toString();
                    inv_createdAt = (String) inventario.get("createdAt").toString();
                    inv_updatedAt = (String) inventario.get("updatedAt").toString();

                    db.insertarInventario(inv_id, inv_id_alma, inv_id_pro, inv_cant, inv_cost_unit, inv_cost_to, inv_fecha_venci, inv_lote, inv_createdAt, inv_updatedAt);

                }           
                
                //Ingresamos los productos  base             
                JSONArray productosBase = data.getJSONArray("productosBase");

                for (int j = 0; j < productosBase.length(); j++) {
                    JSONObject prodBase = productosBase.getJSONObject(j);
                    
                    int idPB = prodBase.getInt("id");
                    String cantU_ideal_pb = prodBase.get("formulacion").toString();
                    id_pb = (prodBase.get("id_producto_base").toString().equals("null"))? 0:Integer.parseInt(prodBase.get("id_producto_base").toString());
                    

                    if (prodBase.get("productoBase").equals("null") == true) {
                        
                        String nombre_pb = prodBase.getJSONObject("productoBase").getString("nombre");
                        String unid_med_pb = prodBase.getJSONObject("productoBase").getString("unidad_medida");
                        int precio_unit_pb = prodBase.getJSONObject("productoBase").getInt("precio_unitario");

                        db.insertarProductosBase(id_producto, id_pb, nombre_pb, unid_med_pb, precio_unit_pb, cantU_ideal_pb,idPB);

                        JSONArray inventariosPb = prodBase.getJSONObject("productoBase").getJSONArray("inventarios");
                        for (int k = 0; k < inventariosPb.length(); k++) {
                            JSONObject inventariospb = inventariosPb.getJSONObject(k);

                            int inv_id = 0;
                            int inv_id_alma = 0;
                            int inv_id_pro = 0;
                            int inv_cant = 0;
                            int inv_cost_unit = 0;
                            int inv_cost_to = 0;
                            String inv_lote = "";
                            String inv_fecha_venci = "";
                            String inv_createdAt = "";
                            String inv_updatedAt = "";

                            inv_id = inventariospb.getInt("id");
                            inv_id_alma = inventariospb.getInt("id_almacen");
                            inv_id_pro = inventariospb.getInt("id_producto");
                            inv_cant = inventariospb.getInt("cantidad");
                            inv_cost_unit = inventariospb.getInt("costo_unitario");
                            inv_cost_to = inventariospb.getInt("costo_total");
                            inv_lote = (String) inventariospb.get("lote").toString();
                            inv_fecha_venci = (String) inventariospb.get("fecha_vencimiento").toString();
                            inv_createdAt = (String) inventariospb.get("createdAt").toString();
                            inv_updatedAt = (String) inventariospb.get("updatedAt").toString();

                            db.insertarInventario(inv_id, inv_id_alma, inv_id_pro, inv_cant, inv_cost_unit, inv_cost_to, inv_fecha_venci, inv_lote, inv_createdAt, inv_updatedAt);
                        }
                    }                 
                }
            }
        } catch (Exception e) {
            System.out.println(e);
            System.out.println("Error: " + e.getMessage());
        }
        
    }
    
    private boolean ingresoDiario(int idUsuario, java.sql.Date fecha){
        ResultSet rs = null;
        boolean result = false;
        String consulta = "SELECT * \n" +
        "FROM REGISTRO\n" +
        "WHERE USUARIO = "+idUsuario+" AND FECHA = '"+fecha+"'";
        try {
            rs = db.seleccionar(consulta);
            if (rs.next()) {
                result = true;
            }else{
                result = false;
            }
        } catch (Exception e) {
            System.out.println("Error al verificar el ingreso: "+e);
        }    
        return result;
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
        jLabel1.setBounds(80, 90, 122, 16);

        jtxtUsuarioLogin.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jtxtUsuarioLoginActionPerformed(evt);
            }
        });
        getContentPane().add(jtxtUsuarioLogin);
        jtxtUsuarioLogin.setBounds(80, 110, 280, 30);

        jLabel2.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("CONTRASEÑA");
        getContentPane().add(jLabel2);
        jLabel2.setBounds(80, 150, 160, 20);

        jButtonEntrar.setText("Entrar");
        jButtonEntrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonEntrarActionPerformed(evt);
            }
        });
        getContentPane().add(jButtonEntrar);
        jButtonEntrar.setBounds(150, 270, 63, 23);

        jButtonCerrar.setText("Cerrar");
        jButtonCerrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonCerrarActionPerformed(evt);
            }
        });
        getContentPane().add(jButtonCerrar);
        jButtonCerrar.setBounds(230, 270, 63, 23);

        jPassword.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jPasswordActionPerformed(evt);
            }
        });
        getContentPane().add(jPassword);
        jPassword.setBounds(80, 170, 280, 30);

        jLabel3.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(255, 255, 255));
        jLabel3.setText("Red");
        getContentPane().add(jLabel3);
        jLabel3.setBounds(80, 200, 40, 20);

        jRadioButtonSi.setBackground(new java.awt.Color(22, 135, 176));
        jRadioButtonSi.setForeground(new java.awt.Color(255, 255, 255));
        jRadioButtonSi.setText("Si");
        getContentPane().add(jRadioButtonSi);
        jRadioButtonSi.setBounds(130, 230, 50, 23);

        jRadioButtonNo.setBackground(new java.awt.Color(22, 135, 176));
        jRadioButtonNo.setForeground(new java.awt.Color(255, 255, 255));
        jRadioButtonNo.setText("No");
        jRadioButtonNo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jRadioButtonNoActionPerformed(evt);
            }
        });
        getContentPane().add(jRadioButtonNo);
        jRadioButtonNo.setBounds(270, 230, 50, 23);

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
        
        Date f = new Date();
        long fe = f.getTime();
        java.sql.Date fecha = new java.sql.Date(fe);
        String usuario = null;
        String contrasenia = null;
        int id_usuario = 0;
        String id_empresa = null;
        String txtUsuario = "";
        String txtContrasenia = "";
        String no = null;
        String si = null;
        usuario = this.jtxtUsuarioLogin.getText();
        contrasenia = this.jPassword.getText();
        if ((this.jRadioButtonNo.isSelected()) && (this.jRadioButtonSi.isSelected())) {
            JOptionPane.showMessageDialog(this, "Seleccione una opcion!");
        } else if (this.jRadioButtonNo.isSelected()) {
            String claveEncriptada = Encriptar(contrasenia);
            try {
                if (this.db.Autentificacion(usuario, claveEncriptada) == true) {
                    int id = this.db.selectIdLogin(usuario, claveEncriptada);

                    Solicitudes solicitud = new Solicitudes(id);
                    solicitud.setVisible(true);
                    
                    dispose();
                } else {
                    JOptionPane.showMessageDialog(null, "El usuario o la contraseña con incorretas! ");
                }
            } catch (Exception e) {
                System.out.println("Error al mostrar la vista de productos " + e.getMessage());
                System.out.println(e);
            }JSONObject datos = new JSONObject();
        } else if (this.jRadioButtonSi.isSelected()) {
            String url = "/autenticar";
            try {
                JSONObject datos = new JSONObject();

                datos.put("nombre_usuario", usuario);
                datos.put("clave", contrasenia);
                datos.put("id_empresa", id_empresa);
                datos.put("id", id_usuario);
                JSONObject res = RestServer.postJSONdata(url, datos);
                if (res.getBoolean("type") == true) {
                    int id = res.getJSONObject("data").getInt("id");
                    String nombre = res.getJSONObject("data").getString("nombre_usuario");

                    String claveEncriptada = Encriptar(contrasenia);
                    int IdEmp = res.getJSONObject("data").getInt("id_empresa");
                    
                    this.db.InsertarUsuario(id, nombre, claveEncriptada);
                    this.db.login(id, IdEmp);
                    

                    if (ingresoDiario(id,fecha) != true) { 
                        JOptionPane.showMessageDialog(null, "<html>Espere mientras se carga los componentes<br>esto tardara unos minutos</html>");
                        db.insertarRegistro(id, fecha);
                        E1Threard saludo1 = new E1Threard();                    
                        InsertarSucursales sucursales = new InsertarSucursales("Test 3",id, IdEmp);
                        CargaProductos productos = new CargaProductos("Test4", id, IdEmp);
                        saludo1.start(); 
                        sucursales.start();
                        productos.start();
            
                        Solicitudes solicitud = new Solicitudes(res, id);
                        solicitud.setVisible(true);
                        dispose();
                        
                    }else{
                        Solicitudes solicitud = new Solicitudes(res, id);
                        solicitud.setVisible(true);
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
