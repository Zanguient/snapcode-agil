/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.ComboBoxModel;
import javax.swing.DefaultComboBoxModel;
import javax.swing.JOptionPane;
import modelo_Dosificacion.Dosificacion;
import models.Database;

/**
 *
 * @author AGIL
 */
public class NuevaDosificacion extends javax.swing.JDialog {
    public Database db = new Database();
    public int id_usuario;
    public int cantVali;
    public Dosificacion dosif = new Dosificacion();
    public int id_dosificacion;
    /**
     * Creates new form NuevaDosificacion
     */
    public NuevaDosificacion(java.awt.Frame parent, boolean modal,int id_usuario) {
        super(parent,modal);
        initComponents();
        setLocationRelativeTo(this);
        this.setTitle("Dosificación");
        this.id_usuario = id_usuario;
        requerido1.setVisible(false);
        requerido2.setVisible(false);
        requerido3.setVisible(false);
        requerido4.setVisible(false);
        
        obtenerPieFactura();
    }
    
    public NuevaDosificacion(java.awt.Frame parent, boolean modal,int id_usuario,int id_dosificacion) {
        super(parent,modal);
        initComponents();
        setLocationRelativeTo(this);
        this.setTitle("Editar Dosificación");
        this.id_usuario = id_usuario;
        this.id_dosificacion = id_dosificacion;
        requerido1.setVisible(false);
        requerido2.setVisible(false);
        requerido3.setVisible(false);
        requerido4.setVisible(false);
            
        obtenerPieFactura();
        obtenerDatos();
    }
    
    public void obtenerDatos(){
        ResultSet rs = null;
        String consulta = "SELECT AUTORIZACION,CORRELATIVO,FEHCA_LIMITE_EMISION,LLAVE_DIGITAL,C.NOMBRE\n" +
            "FROM DOSIFICACION AS D\n" +
            "INNER JOIN CLASE AS C ON D.PIE_FACTURA = C.ID\n" +
            "WHERE D.ID = "+this.id_dosificacion;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {      
                BigDecimal autorizacion = rs.getBigDecimal(1);
                int correla = rs.getInt(2);
                Date fechaLimite = rs.getDate(3);
                String llaveDigital = rs.getString(4);
                String frase = rs.getString(5);
     
                textoAutorizacion.setText(autorizacion.toString());                
                textoNumCorrelativo.setText(Integer.toString(correla));
                fechaLimi.setDate(fechaLimite);
                textoLlaveDig.setText(llaveDigital);
                comboFrace.setSelectedItem(frase);
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
    
    public void validacion(){
        cantVali = 0;  
        if(textoAutorizacion.getText().equals("")){requerido1.setVisible(true);cantVali++;}else{requerido1.setVisible(false);}
        if(textoNumCorrelativo.getText().equals("")){requerido2.setVisible(true);cantVali++;}else{requerido2.setVisible(false);}
        if(fechaLimi.getDate().toString().isEmpty()){requerido3.setVisible(true);cantVali++;}else{requerido3.setVisible(false);}
        if(textoLlaveDig.getText().equals("")){requerido4.setVisible(true);cantVali++;}else{requerido4.setVisible(false);}
        
    }
    
    public void obtenerPieFactura(){
        DefaultComboBoxModel value = new DefaultComboBoxModel();
        ResultSet rs = null;
        String consulta = "SELECT C.ID, C.NOMBRE\n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON T.ID = C.ID_TIPO\n" +
            "WHERE T.ID = "+13;
        try {        
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
               comboFrace.addItem(rs.getString(2)); 
            }
        } catch (Exception e) {
            System.out.println("Error "+e);
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }   
    }
    
    public void actualizarDosificacion(){
        cantVali = 0;
        ResultSet rs = null; 
        //java.math.BigInteger autorizacion = new java.math.BigInteger((String)textoAutorizacion.getText());
        BigDecimal autorizacion = new BigDecimal((String)textoAutorizacion.getText());
        int numCorrelativo = Integer.parseInt(textoNumCorrelativo.getText());
        Date fecha = fechaLimi.getDate();
        long d = fecha.getTime();
        java.sql.Date fechaLimite = new java.sql.Date(d);
        String llaveDigi = textoLlaveDig.getText();
        String nombreDosifi = (String) comboFrace.getSelectedItem();
        int idFrase = obtenerIdPieFactura(nombreDosifi);
        int id_empresa = 0;
        Date fe = new Date();
        long dd = fe.getTime();
        java.sql.Date fechaAct = new java.sql.Date(dd);    
        try {
            rs = db.seleccionar("SELECT EMPRESA\n" +
                "FROM USUARIO\n" +
                "WHERE ID = "+this.id_usuario);
                while(rs.next()){
                    id_empresa = rs.getInt(1);
                }
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
        validacion();
        if(cantVali == 0){                  
               
            db.actualizarDosificaciones(this.id_dosificacion, id_empresa, autorizacion, numCorrelativo, fechaLimite, llaveDigi, fechaAct, idFrase, false);
            
        }else{
            JOptionPane.showMessageDialog(null, "Ingrese los campos requeridos");
        }
        JOptionPane.showMessageDialog(null, "Se guardaron los datos correctamente");
        
    }
    
    public int obtenerIdPieFactura(String nombre){
        int id = 0;
        ResultSet rs = null;
        String consulta = "SELECT ID FROM CLASE WHERE NOMBRE = '"+nombre+"'";
        try {        
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
               id = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error "+e);
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
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        textoAutorizacion = new javax.swing.JTextField();
        jLabel3 = new javax.swing.JLabel();
        textoNumCorrelativo = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        fechaLimi = new com.toedter.calendar.JDateChooser();
        jLabel5 = new javax.swing.JLabel();
        textoLlaveDig = new javax.swing.JTextField();
        jLabel6 = new javax.swing.JLabel();
        comboFrace = new javax.swing.JComboBox<>();
        requerido1 = new javax.swing.JLabel();
        requerido2 = new javax.swing.JLabel();
        requerido3 = new javax.swing.JLabel();
        requerido4 = new javax.swing.JLabel();
        guardar = new javax.swing.JButton();
        cancelar = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.DO_NOTHING_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(66, 139, 202));
        jLabel1.setText("Datos de la Dosificación");
        jLabel1.setToolTipText("");

        jLabel2.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(66, 139, 202));
        jLabel2.setText("Autorización");
        jLabel2.setToolTipText("");

        textoAutorizacion.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoAutorizacionKeyTyped(evt);
            }
        });

        jLabel3.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(66, 139, 202));
        jLabel3.setText("Número Correlativo");
        jLabel3.setToolTipText("");

        textoNumCorrelativo.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoNumCorrelativoKeyTyped(evt);
            }
        });

        jLabel4.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(66, 139, 202));
        jLabel4.setText("Fecha Límite Fac.");
        jLabel4.setToolTipText("");

        jLabel5.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(66, 139, 202));
        jLabel5.setText("LLave Digital");
        jLabel5.setToolTipText("");

        jLabel6.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel6.setForeground(new java.awt.Color(66, 139, 202));
        jLabel6.setText("Frace Pié Factura");
        jLabel6.setToolTipText("");

        comboFrace.addItemListener(new java.awt.event.ItemListener() {
            public void itemStateChanged(java.awt.event.ItemEvent evt) {
                comboFraceItemStateChanged(evt);
            }
        });

        requerido1.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido1.setForeground(new java.awt.Color(255, 51, 51));
        requerido1.setText("Requerido");

        requerido2.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido2.setForeground(new java.awt.Color(255, 51, 51));
        requerido2.setText("Requerido");

        requerido3.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido3.setForeground(new java.awt.Color(255, 51, 51));
        requerido3.setText("Requerido");

        requerido4.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        requerido4.setForeground(new java.awt.Color(255, 51, 51));
        requerido4.setText("Requerido");

        guardar.setBackground(new java.awt.Color(98, 155, 88));
        guardar.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        guardar.setText("Guardar");
        guardar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(135, 184, 127)));
        guardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                guardarActionPerformed(evt);
            }
        });

        cancelar.setBackground(new java.awt.Color(183, 70, 53));
        cancelar.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        cancelar.setText("Cancelar");
        cancelar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(209, 91, 71)));
        cancelar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cancelarActionPerformed(evt);
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
                            .addComponent(jLabel5)
                            .addComponent(requerido4)
                            .addComponent(textoLlaveDig, javax.swing.GroupLayout.PREFERRED_SIZE, 152, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGap(239, 239, 239)
                                .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(106, 106, 106)
                                .addComponent(guardar, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(50, 50, 50))
                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel6)
                                    .addComponent(comboFrace, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 510, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addContainerGap())))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel1)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel2)
                                    .addComponent(textoAutorizacion, javax.swing.GroupLayout.PREFERRED_SIZE, 110, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(requerido1))
                                .addGap(18, 18, 18)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(textoNumCorrelativo, javax.swing.GroupLayout.PREFERRED_SIZE, 115, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel3)
                                    .addComponent(requerido2))
                                .addGap(18, 18, 18)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(requerido3)
                                    .addComponent(jLabel4)
                                    .addComponent(fechaLimi, javax.swing.GroupLayout.PREFERRED_SIZE, 155, javax.swing.GroupLayout.PREFERRED_SIZE))))
                        .addGap(28, 28, 28))))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(fechaLimi, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel1)
                        .addGap(18, 18, 18)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel2)
                            .addComponent(jLabel3)
                            .addComponent(jLabel4))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(textoAutorizacion, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textoNumCorrelativo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(requerido1)
                    .addComponent(requerido2)
                    .addComponent(requerido3))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel5)
                    .addComponent(jLabel6))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoLlaveDig, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(comboFrace, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(requerido4)
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 51, Short.MAX_VALUE)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(guardar, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addContainerGap())))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void textoAutorizacionKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoAutorizacionKeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume();
    }//GEN-LAST:event_textoAutorizacionKeyTyped

    private void textoNumCorrelativoKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoNumCorrelativoKeyTyped
        char c = evt.getKeyChar(); 
        if ((c<'0' || c>'9')) evt.consume();
    }//GEN-LAST:event_textoNumCorrelativoKeyTyped

    private void cancelarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cancelarActionPerformed
        dispose();
    }//GEN-LAST:event_cancelarActionPerformed

    private void guardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_guardarActionPerformed
        cantVali = 0;
        if(this.id_dosificacion != 0){
            actualizarDosificacion();
        }else{
            ResultSet rs = null; 
            java.math.BigInteger autorizacion = new java.math.BigInteger((String)textoAutorizacion.getText());
            int numCorrelativo = Integer.parseInt(textoNumCorrelativo.getText());
            Date fecha = fechaLimi.getDate();
            long d = fecha.getTime();
            java.sql.Date fechaLimite = new java.sql.Date(d);
            String llaveDigi = textoLlaveDig.getText();
            String nombreFrase = (String) comboFrace.getSelectedItem();
            int idFrase = obtenerIdPieFactura(nombreFrase);
            int id_empresa = 0;
            Date fe = new Date();
            long dd = fe.getTime();
            java.sql.Date fechaAct = new java.sql.Date(dd);    
            try {
                rs = db.seleccionar("SELECT EMPRESA\n" +
                    "FROM USUARIO\n" +
                    "WHERE ID = "+this.id_usuario);
                    while(rs.next()){
                        id_empresa = rs.getInt(1);
                    }
            } catch (Exception e) {
                System.out.println("Error "+e);
            }
            validacion();
            if(cantVali == 0){                  
                try {     
                    rs = db.insertar("INSERT INTO DOSIFICACION (EMPRESA,AUTORIZACION,CORRELATIVO,FEHCA_LIMITE_EMISION,LLAVE_DIGITAL,CREATEDAT,UPDATEDAT,PIE_FACTURA,EXPIRADO) "
                            + "VALUES("+id_empresa+","+autorizacion+","+numCorrelativo+",'"+fechaLimite+"','"+llaveDigi+"','"+fechaAct+"','"+fechaAct+"',"+idFrase+","+false+")");

                } catch (Exception e) {
                    System.out.println("Error al insertar dosificacion "+e);
                    JOptionPane.showMessageDialog(null, "Error al insertar dosificacion");
                }
            }else{
                JOptionPane.showMessageDialog(null, "Ingrese los campos requeridos");
            }
        }  
        JOptionPane.showMessageDialog(null, "Se guardaron correctamente los datos.");
        dispose();
    }//GEN-LAST:event_guardarActionPerformed

    private void comboFraceItemStateChanged(java.awt.event.ItemEvent evt) {//GEN-FIRST:event_comboFraceItemStateChanged
        
    }//GEN-LAST:event_comboFraceItemStateChanged

    /**
     * @param args the command line arguments
     */

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton cancelar;
    private javax.swing.JComboBox<String> comboFrace;
    private com.toedter.calendar.JDateChooser fechaLimi;
    private javax.swing.JButton guardar;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JLabel requerido1;
    private javax.swing.JLabel requerido2;
    private javax.swing.JLabel requerido3;
    private javax.swing.JLabel requerido4;
    private javax.swing.JTextField textoAutorizacion;
    private javax.swing.JTextField textoLlaveDig;
    private javax.swing.JTextField textoNumCorrelativo;
    // End of variables declaration//GEN-END:variables
}
