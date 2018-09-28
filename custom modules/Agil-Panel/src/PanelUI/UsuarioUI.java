/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.net.URL;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import javax.net.ssl.HttpsURLConnection;
import modelo_Usuario.listaRoles;
import models.Database;
import models.RestServer;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author AGIL
 */
public class UsuarioUI extends javax.swing.JFrame {
    public Database db = new Database();
    public int id;
    public boolean SucurCrearNuevo = false ;
    public boolean SucurModificar = false;
    public boolean SucurEliminar = false;
    
    public boolean ConcepCrearNuevo = false ;
    public boolean ConcepModificar = false;
    public boolean ConcepEliminar = false;
    
    public boolean ProducCrearNuevo = false ;
    public boolean ProducModificar = false;
    public boolean ProducEliminar = false;
    
    public boolean DosifiCrearNuevo = false ;
    public boolean DosifiModificar = false;
    public boolean DosifiEliminar = false;
    
    public boolean FacturasNuevo = false;
    public boolean FacturasModificar = false;
    public boolean FacturasEliminar = false;
    
    public boolean CertCodFactNuevo = false;
    public boolean CertCodFactModificar = false;
    public boolean CertCodFactEliminar = false;
    
    public boolean InventarioNuevo = false;
    public boolean InventarioModificar = false;
    public boolean InvenarioEliminar = false;
    /**
     * Creates new form UsuarioUI
     */
    public UsuarioUI() {
       
        initComponents();
        setLocationRelativeTo(this);
        this.setExtendedState(this.MAXIMIZED_BOTH);
        insertarTipos("TPS");
        VerificarDosifiExpira();
    }

    public UsuarioUI(int id){
        
        initComponents();
        setLocationRelativeTo(this);
        this.setExtendedState(this.MAXIMIZED_BOTH);
        this.id = id;
        LabelUsuario(this.id);
        insertarTipos("TPS");
        Roles();
        VerificarDosifiExpira();

    }
 
    private void Roles(){
        Sucursal sucursal = new Sucursal(this.id);
        if (esActivo() == true) {
            for (int i = 0; i < rol().size(); i++) {
                String nombre = rol().get(i).getAplicacion();
                boolean ver = rol().get(i).isVer();
                boolean crear = rol().get(i).isCrear();
                boolean modificar = rol().get(i).isModificar();
                boolean eliminar = rol().get(i).isEliminar();
                if (nombre.equals("SUCURSALES")) {                    
                    menuSucursal.setVisible(ver);
                    SucurCrearNuevo = crear;  
                    SucurModificar = modificar;
                    SucurEliminar = eliminar;
                }
                if (nombre.equals("CONCEPTOS")) {                    
                    menuConceptos.setVisible(ver);
                    ConcepCrearNuevo = crear;  
                    ConcepModificar = modificar;
                    ConcepEliminar = eliminar;
                }
                if (nombre.equals("PRODUCTOS")) {                    
                    menuProductos.setVisible(ver);
                    ProducCrearNuevo = crear;  
                    ProducModificar = modificar;
                    ProducEliminar = eliminar;
                }
                if (nombre.equals("DOSIFICACIONES")) {                    
                    menuDosificaiones.setVisible(ver);
                    DosifiCrearNuevo = crear;  
                    DosifiModificar = modificar;
                    DosifiEliminar = eliminar;
                }
                if (nombre.equals("FACTURAS")) {
                    menuFacturas.setVisible(ver);
                    FacturasNuevo = crear;
                    FacturasModificar = modificar;
                    FacturasEliminar = eliminar;
                }
                if (nombre.equals("CERT. COD. DE CONTROL")) {
                    menuCodigoControl.setVisible(ver);
                    CertCodFactNuevo = crear;
                    CertCodFactModificar = modificar;
                    CertCodFactEliminar = eliminar;
                }
                if (nombre.equals("INVENTARIO")) {
                    menuInventario.setVisible(ver);
                    InventarioNuevo = crear;
                    InventarioModificar = modificar;
                    InvenarioEliminar = eliminar;
                }
            }
        }
 
    }
    
    private boolean esActivo(){
        ResultSet rs = null;
        boolean existe = false;
        String consulta = "SELECT * \n" +
            "FROM USUARIO\n" +
            "WHERE ID = "+this.id+" AND ACTIVO = "+true;
        try {
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
        }
        return existe;
    }
    
    private ArrayList<listaRoles> rol(){
        ResultSet rs = null;
        ArrayList<listaRoles> lista = new ArrayList();
        String consulta = "SELECT A.TITULO,UA.PUEDE_VER,UA.PUEDE_CREAR,UA.PUEDE_MODIFICAR,UA.PUEDE_ELIMINAR\n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN USUARIO_APLICACION AS UA ON UA.USUARIO = U.ID\n" +
            "INNER JOIN APLICACION AS A ON A.ID = UA.APLICACION\n" +
            "WHERE U.PERSONA = "+this.id;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {
                listaRoles roles = new listaRoles(rs.getString(1),rs.getBoolean(2),rs.getBoolean(3),rs.getBoolean(4),rs.getBoolean(5));
                lista.add(roles);
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
        return lista;
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
    
    private void insertarTipos(String tipo){
        int id;
        String nombre;
        String nombre_corto;
        String idEmpresa;
        String creadAt;
        String updatedAt;
        
        if (getConnectionStatus() == true) {
            try {
                 String url = "/tipos/"+tipo;
                
                JSONObject tipos = RestServer.getJSONObject(url);
                id = tipos.getInt("id");
                nombre = tipos.getString("nombre");
                nombre_corto = tipos.getString("nombre_corto");
                idEmpresa = (String) tipos.get("id_empresa").toString();
                creadAt = tipos.getString("createdAt").substring(0,10);
                updatedAt = tipos.getString("updatedAt").substring(0,10);
               
                
                JSONArray clases  = tipos.getJSONArray("clases");
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
     
    public void LabelUsuario(int id_usuario){
        
        ResultSet rs = null;
        rs = db.seleccionar("SELECT P.NOMBRE_COMPLETO\n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN PERSONA AS P ON P.ID = U.PERSONA\n" +
            "WHERE U.ID ="+id_usuario);
        try {
            while (rs.next()) {                
               LabelUsuario.setText(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }    
    }
     
    public void VerificarDosifiExpira(){
        ResultSet rs = null;
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");  
        LocalDateTime date = LocalDateTime.now();
        String fecha = dtf.format(date);
        boolean exipira = false;
        String existe = "SELECT * \n" +
                "FROM DOSIFICACION\n" +
                "WHERE FEHCA_LIMITE_EMISION < '"+fecha+"'";
        if (db.existeEldato(existe) == true) {
            
            try {
                rs = db.seleccionar("SELECT ID \n" +
                "FROM DOSIFICACION\n" +
                "WHERE FEHCA_LIMITE_EMISION < '"+fecha+"'");
                
                while (rs.next()) {                    
                    int id = rs.getInt(1);                   
                    db.insertar("UPDATE DOSIFICACION SET EXPIRADO = "+true+" WHERE FEHCA_LIMITE_EMISION < '"+fecha+"'AND ID = "+id);
                    db.insertar("UPDATE APP.SUCURSAL_ACTIVIDAD_DOSIFICACION SET EXPIRADO = "+true+" WHERE DOSIFICACION = "+id);           
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
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jMenuItem3 = new javax.swing.JMenuItem();
        jMenu4 = new javax.swing.JMenu();
        jMenuItem4 = new javax.swing.JMenuItem();
        menuVentas = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        LabelUsuario = new javax.swing.JLabel();
        jMenuBar1 = new javax.swing.JMenuBar();
        jMenu1 = new javax.swing.JMenu();
        jMenuItem2 = new javax.swing.JMenuItem();
        jMenuItem1 = new javax.swing.JMenuItem();
        jMenu2 = new javax.swing.JMenu();
        menuFacturas = new javax.swing.JMenuItem();
        menuCodigoControl = new javax.swing.JMenuItem();
        menuConceptos = new javax.swing.JMenuItem();
        jMenu3 = new javax.swing.JMenu();
        menuUsuario = new javax.swing.JMenuItem();
        menuSucursal = new javax.swing.JMenuItem();
        menuProductos = new javax.swing.JMenuItem();
        menuDosificaiones = new javax.swing.JMenuItem();
        jMenu5 = new javax.swing.JMenu();
        menuInventario = new javax.swing.JMenuItem();
        menuCompras = new javax.swing.JMenuItem();

        jMenuItem3.setText("jMenuItem3");

        jMenu4.setText("jMenu4");

        jMenuItem4.setText("jMenuItem4");

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        menuVentas.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/marca-agil.png"))); // NOI18N

        jLabel2.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(43, 125, 188));
        jLabel2.setText("Bienvenido Usuario ");

        LabelUsuario.setFont(new java.awt.Font("Arial", 2, 11)); // NOI18N
        LabelUsuario.setForeground(new java.awt.Color(43, 125, 188));

        javax.swing.GroupLayout menuVentasLayout = new javax.swing.GroupLayout(menuVentas);
        menuVentas.setLayout(menuVentasLayout);
        menuVentasLayout.setHorizontalGroup(
            menuVentasLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(menuVentasLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 361, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 208, Short.MAX_VALUE)
                .addComponent(jLabel2)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(LabelUsuario, javax.swing.GroupLayout.PREFERRED_SIZE, 118, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );
        menuVentasLayout.setVerticalGroup(
            menuVentasLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(menuVentasLayout.createSequentialGroup()
                .addGroup(menuVentasLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(menuVentasLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                        .addComponent(jLabel2, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(LabelUsuario, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(menuVentasLayout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 196, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(188, Short.MAX_VALUE))
        );

        jMenu1.setText("Archivo");

        jMenuItem2.setText("Cerrar Sesion");
        jMenuItem2.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem2ActionPerformed(evt);
            }
        });
        jMenu1.add(jMenuItem2);

        jMenuItem1.setText("Salir");
        jMenuItem1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem1ActionPerformed(evt);
            }
        });
        jMenu1.add(jMenuItem1);

        jMenuBar1.add(jMenu1);

        jMenu2.setText("Configuracion");

        menuFacturas.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/factura.png"))); // NOI18N
        menuFacturas.setText("Facturas");
        menuFacturas.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                menuFacturasActionPerformed(evt);
            }
        });
        jMenu2.add(menuFacturas);

        menuCodigoControl.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/listaCod.png"))); // NOI18N
        menuCodigoControl.setText("Gene.Cod.Control");
        menuCodigoControl.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                menuCodigoControlActionPerformed(evt);
            }
        });
        jMenu2.add(menuCodigoControl);

        menuConceptos.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/conceptos.png"))); // NOI18N
        menuConceptos.setText("Conceptos");
        menuConceptos.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                menuConceptosActionPerformed(evt);
            }
        });
        jMenu2.add(menuConceptos);

        jMenuBar1.add(jMenu2);

        jMenu3.setText("Actividades");

        menuUsuario.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/usuario.png"))); // NOI18N
        menuUsuario.setText("Usuario");
        menuUsuario.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                menuUsuarioActionPerformed(evt);
            }
        });
        jMenu3.add(menuUsuario);

        menuSucursal.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/tienda.png"))); // NOI18N
        menuSucursal.setText("Sucursales");
        menuSucursal.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                menuSucursalActionPerformed(evt);
            }
        });
        jMenu3.add(menuSucursal);

        menuProductos.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/menu.png"))); // NOI18N
        menuProductos.setText("Productos");
        menuProductos.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                menuProductosActionPerformed(evt);
            }
        });
        jMenu3.add(menuProductos);

        menuDosificaiones.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/dosificacion.png"))); // NOI18N
        menuDosificaiones.setText("Dosificaciones");
        menuDosificaiones.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                menuDosificaionesActionPerformed(evt);
            }
        });
        jMenu3.add(menuDosificaiones);

        jMenuBar1.add(jMenu3);

        jMenu5.setText("Productos");

        menuInventario.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/planning.png"))); // NOI18N
        menuInventario.setText("Inventario");
        menuInventario.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                menuInventarioActionPerformed(evt);
            }
        });
        jMenu5.add(menuInventario);

        menuCompras.setText("Compras");
        menuCompras.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                menuComprasActionPerformed(evt);
            }
        });
        jMenu5.add(menuCompras);

        jMenuBar1.add(jMenu5);

        setJMenuBar(jMenuBar1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(menuVentas, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(menuVentas, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jMenuItem1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem1ActionPerformed
        System.exit(0);
    }//GEN-LAST:event_jMenuItem1ActionPerformed

    private void menuProductosActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_menuProductosActionPerformed
        Productos productos = new Productos(ProducCrearNuevo,ProducModificar,ProducEliminar,this.id);
        productos.setVisible(true);
    }//GEN-LAST:event_menuProductosActionPerformed

    private void menuConceptosActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_menuConceptosActionPerformed
        ConfConceptos conceptos = new ConfConceptos(ConcepCrearNuevo,ConcepModificar,ConcepEliminar,this.id);
        conceptos.setVisible(true);
    }//GEN-LAST:event_menuConceptosActionPerformed

    private void menuDosificaionesActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_menuDosificaionesActionPerformed
        Dosificaciones dosificaciones = new Dosificaciones(DosifiCrearNuevo,DosifiModificar,DosifiEliminar,this.id);
        dosificaciones.setVisible(true);
    }//GEN-LAST:event_menuDosificaionesActionPerformed

    private void menuSucursalActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_menuSucursalActionPerformed
        Sucursal sucursal = new Sucursal(SucurCrearNuevo,SucurModificar,SucurEliminar,this.id);
        sucursal.setVisible(true);
    }//GEN-LAST:event_menuSucursalActionPerformed

    private void menuUsuarioActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_menuUsuarioActionPerformed
        PanelUsuarioCli usuarioCli = new PanelUsuarioCli(this.id);
        usuarioCli.setVisible(true);
    }//GEN-LAST:event_menuUsuarioActionPerformed

    private void jMenuItem2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem2ActionPerformed
        Login login = new Login();
        login.setVisible(true);
        dispose();
    }//GEN-LAST:event_jMenuItem2ActionPerformed

    private void menuFacturasActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_menuFacturasActionPerformed
        confFacturas factura = new confFacturas(FacturasModificar,this.id);
        factura.setVisible(true);
    }//GEN-LAST:event_menuFacturasActionPerformed

    private void menuCodigoControlActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_menuCodigoControlActionPerformed
        CertCodControlUI codigoControl = new CertCodControlUI();
        codigoControl.setVisible(true);
    }//GEN-LAST:event_menuCodigoControlActionPerformed

    private void menuComprasActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_menuComprasActionPerformed
        Compras compras = new Compras(this.id);
        compras.setVisible(true);
    }//GEN-LAST:event_menuComprasActionPerformed

    private void menuInventarioActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_menuInventarioActionPerformed
        Inventario inventario = new Inventario(InventarioNuevo,this.id);
        inventario.setVisible(true);
    }//GEN-LAST:event_menuInventarioActionPerformed

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
            java.util.logging.Logger.getLogger(UsuarioUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(UsuarioUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(UsuarioUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(UsuarioUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new UsuarioUI().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel LabelUsuario;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JMenu jMenu1;
    private javax.swing.JMenu jMenu2;
    private javax.swing.JMenu jMenu3;
    private javax.swing.JMenu jMenu4;
    private javax.swing.JMenu jMenu5;
    private javax.swing.JMenuBar jMenuBar1;
    private javax.swing.JMenuItem jMenuItem1;
    private javax.swing.JMenuItem jMenuItem2;
    private javax.swing.JMenuItem jMenuItem3;
    private javax.swing.JMenuItem jMenuItem4;
    private javax.swing.JMenuItem menuCodigoControl;
    private javax.swing.JMenuItem menuCompras;
    private javax.swing.JMenuItem menuConceptos;
    private javax.swing.JMenuItem menuDosificaiones;
    private javax.swing.JMenuItem menuFacturas;
    private javax.swing.JMenuItem menuInventario;
    private javax.swing.JMenuItem menuProductos;
    public javax.swing.JMenuItem menuSucursal;
    private javax.swing.JMenuItem menuUsuario;
    private javax.swing.JPanel menuVentas;
    // End of variables declaration//GEN-END:variables
}
