/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.Color;
import models.RenderTable;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import CodigoControl.ControlCode;
import java.awt.Desktop;
import java.io.File;
import java.io.InputStream;
import java.net.URL;
import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.filechooser.FileNameExtensionFilter;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;

/**
 *
 * @author AGIL
 */
public class CertCodControlUI extends javax.swing.JFrame {
    public DefaultTableModel modelTabla;
    /**
     * Creates new form CertCodControlUI
     */
    public CertCodControlUI() {
        initComponents();
        setLocationRelativeTo(this);
        
        modelTabla = (DefaultTableModel) tablaCodControl.getModel();
        
        tablaCodControl.getTableHeader().setPreferredSize(new java.awt.Dimension(0, 33));
        tablaCodControl.setDefaultRenderer(Object.class, new RenderTable());  
        tablaCodControl.getTableHeader().setBackground(Color.cyan);
        tablaCodControl.getTableHeader().setForeground(Color.blue);
        tablaCodControl.setRowHeight(33);
        
        alinearTextoTabla();
    }

    public void alinearTextoTabla(){
        TableCellRenderer rendererFromHeader = tablaCodControl.getTableHeader().getDefaultRenderer();
        JLabel headerLabel = (JLabel) rendererFromHeader;
        headerLabel.setHorizontalAlignment(JLabel.CENTER);
    }
    
    public void pasarTabla(Object[] datos){
        modelTabla.addRow(datos);      
        tablaCodControl.setModel(modelTabla);
    }
    
    public void abrirarchivo(String archivo){
        try {
               File objetofile = new File (archivo);
               Desktop.getDesktop().open(objetofile);
        }catch (IOException ex) {
               System.out.println(ex);
        }
    }   
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        btnImportar = new javax.swing.JButton();
        jPanel2 = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        jScrollPane1 = new javax.swing.JScrollPane();
        tablaCodControl = new javax.swing.JTable();
        jButton1 = new javax.swing.JButton();
        btnImportar1 = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);
        setBackground(new java.awt.Color(255, 255, 255));

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(70, 143, 204));
        jLabel1.setText("Validar Codigo de Control");

        btnImportar.setBackground(new java.awt.Color(98, 155, 88));
        btnImportar.setForeground(new java.awt.Color(255, 255, 255));
        btnImportar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/subir.png"))); // NOI18N
        btnImportar.setText("Importar");
        btnImportar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(135, 184, 127)));
        btnImportar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnImportarActionPerformed(evt);
            }
        });

        jPanel2.setBackground(new java.awt.Color(70, 143, 204));

        jLabel2.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("Lista de Pruebas");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel2)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel2)
                .addContainerGap(12, Short.MAX_VALUE))
        );

        tablaCodControl.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Autorización", "<html>Número<br>Factura</html>", "NIT/CI", "Fecha", "Monto", "Llave digital", "<html>Código<br>Control</html>"
            }
        ));
        tablaCodControl.setFillsViewportHeight(true);
        jScrollPane1.setViewportView(tablaCodControl);
        if (tablaCodControl.getColumnModel().getColumnCount() > 0) {
            tablaCodControl.getColumnModel().getColumn(0).setMinWidth(110);
            tablaCodControl.getColumnModel().getColumn(0).setPreferredWidth(110);
            tablaCodControl.getColumnModel().getColumn(0).setMaxWidth(110);
            tablaCodControl.getColumnModel().getColumn(1).setMinWidth(80);
            tablaCodControl.getColumnModel().getColumn(1).setPreferredWidth(80);
            tablaCodControl.getColumnModel().getColumn(1).setMaxWidth(80);
            tablaCodControl.getColumnModel().getColumn(2).setMinWidth(80);
            tablaCodControl.getColumnModel().getColumn(2).setPreferredWidth(80);
            tablaCodControl.getColumnModel().getColumn(2).setMaxWidth(80);
            tablaCodControl.getColumnModel().getColumn(3).setMinWidth(80);
            tablaCodControl.getColumnModel().getColumn(3).setPreferredWidth(80);
            tablaCodControl.getColumnModel().getColumn(3).setMaxWidth(80);
            tablaCodControl.getColumnModel().getColumn(4).setMinWidth(80);
            tablaCodControl.getColumnModel().getColumn(4).setPreferredWidth(80);
            tablaCodControl.getColumnModel().getColumn(4).setMaxWidth(80);
            tablaCodControl.getColumnModel().getColumn(6).setMinWidth(100);
            tablaCodControl.getColumnModel().getColumn(6).setPreferredWidth(100);
            tablaCodControl.getColumnModel().getColumn(6).setMaxWidth(100);
        }

        jButton1.setBackground(new java.awt.Color(178, 68, 52));
        jButton1.setForeground(new java.awt.Color(255, 255, 255));
        jButton1.setText("Cerrar");
        jButton1.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(209, 91, 71)));
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        btnImportar1.setBackground(new java.awt.Color(98, 155, 88));
        btnImportar1.setForeground(new java.awt.Color(255, 255, 255));
        btnImportar1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/archivoTXT.png"))); // NOI18N
        btnImportar1.setText("Ejemplo Codigo Control");
        btnImportar1.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(135, 184, 127)));
        btnImportar1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnImportar1ActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 940, Short.MAX_VALUE)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel1)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(btnImportar, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(29, 29, 29)
                                .addComponent(btnImportar1, javax.swing.GroupLayout.PREFERRED_SIZE, 164, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addContainerGap())
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(197, 197, 197))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btnImportar, javax.swing.GroupLayout.PREFERRED_SIZE, 33, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnImportar1, javax.swing.GroupLayout.PREFERRED_SIZE, 33, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 236, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 33, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(44, Short.MAX_VALUE))
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

    private void btnImportarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnImportarActionPerformed
        ControlCode controlCode = new ControlCode();                
        
        JFileChooser file = new JFileChooser();
        FileNameExtensionFilter filtro = new FileNameExtensionFilter("TXT", "txt");
        file.setFileFilter(filtro);
        //file.setFileSelectionMode(JFileChooser.FILES_AND_DIRECTORIES);
        int resultado = file.showOpenDialog(this);
        if (resultado == JFileChooser.APPROVE_OPTION) {
            String archivo = file.getSelectedFile().getAbsolutePath();
        
            //direccion del archivo de texto
            String fileName = archivo;        

            int count=0;        
            int fiveDigitsVerhoeffCount=0;
            int stringDKeyCount=0;
            int sumProductCount=0;
            int base64SINCount=0;
            int ccCount=0;

            try (BufferedReader br = new BufferedReader(new FileReader(fileName))) {
                String line;
                while ((line = br.readLine()) != null) {
                    count+=1;
                    //reemplaza "|" por "/-/" por no ser compatible con el metodo split
                    line = line.replace("|", "/-/");
                    String[] ary = line.split("/-/");
                    //genera codigo de control
                    String cc = controlCode.generate(ary[0], ary[1], ary[2], ary[3].replace("/", ""), ary[4], ary[5]);  
                    
                    Object[] datos = {ary[0],ary[1],ary[2],ary[3],ary[4],ary[5],cc,"Editar","Eliminar"};                   
                    pasarTabla(datos);
                    //System.out.println(ary[0]+" - "+" - "+ary[1]+" - "+ary[2]+" - "+ary[3]+" - "+ary[4]+" - "+ary[5]+" - "+ary[10]+" - "+cc);


                     //controla errores       
                    if(!ary[6].equals(controlCode.getFiveDigitsVerhoeff()))fiveDigitsVerhoeffCount+=1;                
                    if(!ary[7].equals(controlCode.getStringDKey()))stringDKeyCount+=1;                
                    if(!ary[8].equals(String.valueOf(controlCode.getSumProduct())))sumProductCount+=1;                      
                    if(!ary[9].equals(String.valueOf(controlCode.getBase64SIN())))base64SINCount+=1;                   
                    if(!ary[10].equals(cc))ccCount+=1;
                }
            } catch (IOException e) {
                System.err.println(e.getMessage());
            }
            

            System.out.println("Error 5 digitos Verhoeff: " + fiveDigitsVerhoeffCount);
            System.out.println("Error Cadena de dosificación: " + stringDKeyCount);
            System.out.println("Error Suma Producto: " + sumProductCount);
            System.out.println("Error Base64: " + base64SINCount);
            System.out.println("Error codigo de control: " + ccCount);
            System.out.println("---------------------------------------------");
            System.out.println("Total Registros testeados: " + count); 
            JOptionPane.showMessageDialog(null, "<html>Error 5 digitos Verhoeff: "+fiveDigitsVerhoeffCount+"<br>"
                    + "Error Cadena de dosificación: " + stringDKeyCount+"<br>"
                    + "Error Suma Producto: " + sumProductCount+"<br>"
                    + "Error Base64: " + base64SINCount+"<br>"
                    + "Error codigo de control: " + ccCount+"<br>"
                    + "--------------------------------------------- <br>"
                    + "Total Registros testeados: " + count+" </html>");
            
        } 
    }//GEN-LAST:event_btnImportarActionPerformed

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        dispose();
    }//GEN-LAST:event_jButton1ActionPerformed

    private void btnImportar1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnImportar1ActionPerformed
        abrirarchivo(".\\EjemploFormatos\\5000CasosPruebaCCVer7.txt");
        
        //System.out.println(is);
    }//GEN-LAST:event_btnImportar1ActionPerformed

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
            java.util.logging.Logger.getLogger(CertCodControlUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(CertCodControlUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(CertCodControlUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(CertCodControlUI.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new CertCodControlUI().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnImportar;
    private javax.swing.JButton btnImportar1;
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable tablaCodControl;
    // End of variables declaration//GEN-END:variables
}
