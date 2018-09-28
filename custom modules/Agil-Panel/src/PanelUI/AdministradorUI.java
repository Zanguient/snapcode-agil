/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;
import static com.itextpdf.text.pdf.PdfFileSpecification.url;
import com.sun.java.swing.plaf.windows.resources.windows;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.net.ssl.HttpsURLConnection;
import javax.swing.JOptionPane;
import models.Database;
import models.RestServer;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
/**
 *
 * @author AGIL
 */
public class AdministradorUI extends javax.swing.JFrame {
    Database db = new Database();
    public ConfConceptosAdmin confConceptoAdmin = new ConfConceptosAdmin();
    public PanelEmpresa empresa = new PanelEmpresa();
    public PanelUsuario usuarios = new PanelUsuario();

    /**
     * Creates new form Administrador
     */
    public AdministradorUI() {
        initComponents();
        setLocationRelativeTo(this);
        this.setExtendedState(this.MAXIMIZED_BOTH);
        this.setTitle("Super Administrador");
        
        
        //insertarRoles();
        //insertarTipoDepartamento("-bol");
    }
    
    private boolean getConnectionStatus() {
        String conStatus = null;
        boolean estado = false;
        try {
            URL u = new URL("http://agilsof.net/");
            HttpsURLConnection huc = (HttpsURLConnection) u.openConnection();
            huc.connect();
            conStatus = "Online";
            estado = true;

        } catch (Exception e) {
            conStatus = "Offline";
            estado = false;

        }
        return estado;
    }
    
    private void insertarTipoDepartamento(String tipo){
        int id;
        String nombre;
        String nombre_corto;
        String idEmpresa;
        String creadAt;
        String updatedAt;
        
        if (getConnectionStatus() == true) {
            try {
                 String url = "/paises/"+tipo;
                
                JSONArray clases  = RestServer.getJSONArray(url);
                for (int i = 0; i < clases.length(); i++) {
                    JSONObject clase = clases.getJSONObject(i);
                    int id_clase = clase.getInt("id");
                    int id_tipo = clase.getInt("id_tipo");
                    String nombre_clase = clase.getString("nombre");
                    String nombre_corto_clase = clase.getString("nombre_corto");
                    boolean habilitado = clase.getBoolean("habilitado");
                    String created_clase =  clase.getString("createdAt").substring(0,10);
                    String updated_clase =  clase.getString("updatedAt").substring(0,10);
                    db.InsertarClases(id_clase, id_tipo, nombre_clase, nombre_corto_clase, habilitado, created_clase, updated_clase);
                    
                 
                    JSONObject departamento = clase.getJSONObject("tipo");
                    id = departamento.getInt("id");
                    nombre = departamento.getString("nombre");
                    nombre_corto = departamento.getString("nombre_corto");
                    idEmpresa = (String) departamento.get("id_empresa").toString();
                    creadAt = departamento.getString("createdAt").substring(0,10);
                    updatedAt = departamento.getString("updatedAt").substring(0,10);
                    if (idEmpresa.equals("null")) {
                        db.InsertarTiposEmpresaNula(id, nombre, nombre_corto, creadAt, updatedAt);
                    }else{
                        int id_empresa = Integer.parseInt(idEmpresa);
                        db.InsertarTipos(id, nombre, nombre_corto, creadAt, updatedAt, id_empresa);
                    }
                }
            } catch (Exception e) {
                System.out.println("Error: "+e);
            }     
        }
    }  
            
    public void insertarRoles(){
        String url = "/roles";
        JSONArray res = RestServer.getJSONArray(url);    
        int id_rol;
        String nombre_rol;
        String createdat;
        String updatedat;
        
        int id_aplicacion;
        int id_rol_apli;
        int id_apli;
        boolean puede_ver;
        boolean puede_crear;
        boolean puede_modificar;
        boolean puede_eliminar;
        String createdat_aplicacion;
        String updatedat_aplicacion;
        
         if (getConnectionStatus() == true) {
            try {
                for (int i = 0; i < res.length(); i++) {
                    JSONObject rol = res.getJSONObject(i);
                    id_rol = rol.getInt("id");
                    nombre_rol = rol.getString("nombre");
                    createdat = rol.getString("createdAt").substring(0,10);
                    updatedat = rol.getString("updatedAt").substring(0,10);                   
                    db.InsertarRoles(id_rol, nombre_rol, createdat, updatedat);
                    
                    JSONArray resApliRol = rol.getJSONArray("aplicacionesRol");
                    for (int j = 0; j < resApliRol.length(); j++) {
                        JSONObject aplicacionRol = resApliRol.getJSONObject(j);
                        id_aplicacion = aplicacionRol.getInt("id");
                        id_rol_apli = aplicacionRol.getInt("id_rol");
                        id_apli = aplicacionRol.getInt("id_aplicacion");
                        puede_ver = aplicacionRol.getBoolean("puede_ver");
                        puede_crear = aplicacionRol.getBoolean("puede_crear");
                        puede_modificar = aplicacionRol.getBoolean("puede_modificar");
                        puede_eliminar = aplicacionRol.getBoolean("puede_eliminar");
                        db.InsertarRolesAplicacion(id_aplicacion,id_rol_apli,id_apli,puede_ver,puede_crear,puede_modificar,puede_eliminar,createdat,updatedat);
                        
                        int id_aplica = aplicacionRol.getJSONObject("aplicacion").getInt("id");
                        String titulo = aplicacionRol.getJSONObject("aplicacion").getString("titulo");
                        String atributo_clase = aplicacionRol.getJSONObject("aplicacion").getString("atributo_clase");
                        String url_apli = aplicacionRol.getJSONObject("aplicacion").getString("url");
                        String id_padre = aplicacionRol.getJSONObject("aplicacion").get("id_padre").toString();
                        if (id_padre.equals("null")) {
                            //int id_apli_padre = 0;
                            db.InsertarAplicacionNull(id_apli, titulo, atributo_clase, url_apli);
                        }else{
                            int id_apli_padre  = Integer.parseInt(id_padre);
                            db.InsertarAplicacion(id_aplica, titulo, atributo_clase, url_apli, id_apli_padre);
                        }
                     // String createdApli = aplicacionRol.getJSONObject("aplicacion").getString("createdAt").substring(0,10);
                     //   String updatedApli = aplicacionRol.getJSONObject("aplicacion").getString("updatedAt").substring(0,10);
                    }
                }
            } catch (JSONException ex) {
                Logger.getLogger(AdministradorUI.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        panelPrincipal = new javax.swing.JPanel();
        jPanel1 = new javax.swing.JPanel();
        jButton1 = new javax.swing.JButton();
        jButton2 = new javax.swing.JButton();
        conceptos = new javax.swing.JButton();
        login = new javax.swing.JButton();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        panelPrincipal.setBackground(new java.awt.Color(255, 255, 255));

        jButton1.setBackground(new java.awt.Color(255, 255, 255));
        jButton1.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        jButton1.setForeground(new java.awt.Color(43, 125, 188));
        jButton1.setText("USUARIOS");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        jButton2.setBackground(new java.awt.Color(255, 255, 255));
        jButton2.setForeground(new java.awt.Color(43, 125, 188));
        jButton2.setText("EMPRESAS");
        jButton2.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton2ActionPerformed(evt);
            }
        });

        conceptos.setBackground(new java.awt.Color(255, 255, 255));
        conceptos.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        conceptos.setForeground(new java.awt.Color(43, 125, 188));
        conceptos.setText("CONCEPTOS");
        conceptos.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                conceptosActionPerformed(evt);
            }
        });

        login.setBackground(new java.awt.Color(255, 255, 255));
        login.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        login.setForeground(new java.awt.Color(43, 125, 188));
        login.setText("Cerrar Sesion");
        login.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                loginActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(conceptos)
                .addGap(18, 18, 18)
                .addComponent(jButton2)
                .addGap(18, 18, 18)
                .addComponent(jButton1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(login)
                .addContainerGap())
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE, false)
                    .addComponent(conceptos, javax.swing.GroupLayout.PREFERRED_SIZE, 67, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jButton2, javax.swing.GroupLayout.PREFERRED_SIZE, 67, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 67, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(login, javax.swing.GroupLayout.PREFERRED_SIZE, 67, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jLabel1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/marca-agil.png"))); // NOI18N

        jLabel2.setIcon(new javax.swing.ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\inventario.png")); // NOI18N

        jLabel3.setIcon(new javax.swing.ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\restaurante.png")); // NOI18N

        jLabel4.setIcon(new javax.swing.ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\inventario.png")); // NOI18N

        jLabel5.setIcon(new javax.swing.ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\geo.png")); // NOI18N

        jLabel6.setIcon(new javax.swing.ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\restaurante.png")); // NOI18N

        jLabel7.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel7.setText("<html>Somos una empresa que cuenta con un amplio portafolio de Soluciones, Especializadas<br><br> porque sabemos que tu negocio tiene necesidades propias, bien sean a nivel<br> <br> Administrativo Comercial Industrial, Educativo y de Servicios  Contamos con un <br><br> equipo multidiciplinario comprometido a generar proyectos con resultados optimos <br><br> dando siempre lo mejor de cada talento.</html>");

        javax.swing.GroupLayout panelPrincipalLayout = new javax.swing.GroupLayout(panelPrincipal);
        panelPrincipal.setLayout(panelPrincipalLayout);
        panelPrincipalLayout.setHorizontalGroup(
            panelPrincipalLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addGroup(panelPrincipalLayout.createSequentialGroup()
                .addGap(21, 21, 21)
                .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 401, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, panelPrincipalLayout.createSequentialGroup()
                .addGap(199, 199, 199)
                .addGroup(panelPrincipalLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, panelPrincipalLayout.createSequentialGroup()
                        .addGap(19, 19, 19)
                        .addComponent(jLabel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGap(18, 18, 18)
                        .addComponent(jLabel4, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGap(18, 18, 18)
                        .addComponent(jLabel5, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGap(18, 18, 18)
                        .addComponent(jLabel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGap(18, 18, 18)
                        .addComponent(jLabel6, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGap(118, 118, 118))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, panelPrincipalLayout.createSequentialGroup()
                        .addComponent(jLabel7)
                        .addGap(101, 101, 101))))
        );
        panelPrincipalLayout.setVerticalGroup(
            panelPrincipalLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(panelPrincipalLayout.createSequentialGroup()
                .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(29, 29, 29)
                .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 111, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(jLabel7)
                .addGap(42, 42, 42)
                .addGroup(panelPrincipalLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(jLabel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jLabel4, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jLabel5, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jLabel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jLabel6, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(90, 90, 90))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(panelPrincipal, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(panelPrincipal, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        // TODO add your handling code here:
        //usuarios = new PanelUsuario();
        usuarios.setVisible(true);
    }//GEN-LAST:event_jButton1ActionPerformed

    private void jButton2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton2ActionPerformed
        //empresa = new PanelEmpresa();
        empresa.setVisible(true);
    }//GEN-LAST:event_jButton2ActionPerformed

    private void conceptosActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_conceptosActionPerformed
        //confConceptoAdmin = new ConfConceptosAdmin();
        confConceptoAdmin.setVisible(true);
    }//GEN-LAST:event_conceptosActionPerformed

    private void loginActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_loginActionPerformed
        
        
        Login login  = new Login();
     
   try{
        if (confConceptoAdmin.isShowing()) {
           confConceptoAdmin.dispose();        
        }
        if (empresa.isShowing()) {
            empresa.dispose();
        }
        if (usuarios.isShowing()) {
            empresa.dispose();
        }
        
   }catch(Exception e){
       e.printStackTrace();
   }    
       
        login.setVisible(true);
        dispose();
    }//GEN-LAST:event_loginActionPerformed

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
            java.util.logging.Logger.getLogger(AdministradorUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(AdministradorUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(AdministradorUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(AdministradorUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new AdministradorUI().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton conceptos;
    private javax.swing.JButton jButton1;
    private javax.swing.JButton jButton2;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JButton login;
    private javax.swing.JPanel panelPrincipal;
    // End of variables declaration//GEN-END:variables
}
