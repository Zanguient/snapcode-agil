/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.sql.ResultSet;
import java.util.ArrayList;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import modelo_Concepto.TipoConcepto;
import models.Database;
import models.RenderTable;

/**
 *
 * @author AGIL
 */
public class ConfConceptosAdmin extends javax.swing.JFrame {
    public Database db = new Database();
    DefaultTableModel modeloTabla;
    
    public JButton editar;
    public ImageIcon imgEditar;
    public Icon iconEditar;
    
    public JButton eliminar;
    public ImageIcon imgEliminar;
    public Icon iconEliminar;
    
    /**
     * Creates new form ConfConceptos
     */
    public ConfConceptosAdmin() {
        initComponents();
        setLocationRelativeTo(this);
        this.setTitle("Concepto");
        String[] columnas = {"Id","Nombre Concepto","Nombre Corto","Editar"}; 
        modeloTabla = new DefaultTableModel(null,columnas);
        
        tablaConceptos.setDefaultRenderer(Object.class, new RenderTable());
        insertarBotones();
        
        optenerTipos();
    }
    

    public void insertarBotones(){
        String imgEdit = "/imagen/editar.png";
       // imgEditar = new ImageIcon(imgEdit);
        imgEditar = new ImageIcon(this.getClass().getResource(imgEdit));
        iconEditar = new ImageIcon(imgEditar.getImage().getScaledInstance(20, 20, 1));
        editar = new JButton(iconEditar);
        editar.setName("editar");
        
        String imgElim = "/imagen/delete.png";
        imgEliminar = new ImageIcon(this.getClass().getResource(imgElim));
        iconEliminar = new ImageIcon(imgEliminar.getImage().getScaledInstance(20, 20, 1));
        eliminar = new JButton(iconEliminar);
        eliminar.setName("eliminar");
        tablaConceptos.setRowHeight(33);
       
    }
   
    public void optenerTipos(){
        ResultSet rs = null;
        String nombre = "";
        String nombre_corto = "";
        int id_tipo = 0;
        String consulta = "SELECT ID,NOMBRE,NOMBRE_CORTO \n" +
            "FROM TIPO\n" +
            "WHERE ID_EMPRESA IS NULL";
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) { 
                id_tipo = rs.getInt(1);
                nombre = rs.getString(2);
                nombre_corto = rs.getString(3);
                insertarBotones();
                Object[] datos = {id_tipo,nombre,nombre_corto,editar};
                modeloTabla.addRow(datos);
            }   
            tablaConceptos.setModel(modeloTabla);
            tamañoTabla();
        
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
    }
    
    public void tamañoTabla() {
        tablaConceptos.getColumnModel().getColumn(0).setMaxWidth(0);
        tablaConceptos.getColumnModel().getColumn(0).setMinWidth(0);
        tablaConceptos.getColumnModel().getColumn(0).setPreferredWidth(0);
        
        tablaConceptos.getColumnModel().getColumn(1).setMaxWidth(200);
        tablaConceptos.getColumnModel().getColumn(1).setMinWidth(200);
        tablaConceptos.getColumnModel().getColumn(1).setPreferredWidth(200);

        tablaConceptos.getColumnModel().getColumn(2).setMaxWidth(140);
        tablaConceptos.getColumnModel().getColumn(2).setMinWidth(140);
        tablaConceptos.getColumnModel().getColumn(2).setPreferredWidth(140);

        tablaConceptos.getColumnModel().getColumn(3).setMaxWidth(60);
        tablaConceptos.getColumnModel().getColumn(3).setMinWidth(60);
        tablaConceptos.getColumnModel().getColumn(3).setPreferredWidth(60);

    }
    
    public void limpiar(){
        int tam = tablaConceptos.getRowCount();
        for (int i = tam - 1; i >= 0; i--) {
            modeloTabla.removeRow(i);
        }
        optenerTipos();
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        jButton1 = new javax.swing.JButton();
        jPanel2 = new javax.swing.JPanel();
        jLabel3 = new javax.swing.JLabel();
        jScrollPane1 = new javax.swing.JScrollPane();
        tablaConceptos = 
        new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 
                && colIndex != 3;
            }
        };
        actualizar = new javax.swing.JButton();
        jPanel3 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        filtrar = new javax.swing.JTextField();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);
        addWindowListener(new java.awt.event.WindowAdapter() {
            public void windowClosed(java.awt.event.WindowEvent evt) {
                formWindowClosed(evt);
            }
            public void windowClosing(java.awt.event.WindowEvent evt) {
                formWindowClosing(evt);
            }
        });

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel2.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(66, 139, 202));
        jLabel2.setText("CONCEPTOS");

        jButton1.setBackground(new java.awt.Color(27, 106, 170));
        jButton1.setForeground(new java.awt.Color(255, 255, 255));
        jButton1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        jButton1.setText("Nuevo");
        jButton1.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        jPanel2.setBackground(new java.awt.Color(48, 126, 204));

        jLabel3.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(255, 255, 255));
        jLabel3.setText("Lista De Conceptos");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 377, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 195, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jLabel3, javax.swing.GroupLayout.DEFAULT_SIZE, 36, Short.MAX_VALUE)
        );

        jScrollPane1.setBackground(new java.awt.Color(255, 255, 255));

        tablaConceptos.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Id", "Nombre Concepto", "Nombre Corto", "Editar"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                false, false, false, false
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        tablaConceptos.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaConceptosMouseClicked(evt);
            }
        });
        tablaConceptos.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                tablaConceptosKeyReleased(evt);
            }
        });
        jScrollPane1.setViewportView(tablaConceptos);
        if (tablaConceptos.getColumnModel().getColumnCount() > 0) {
            tablaConceptos.getColumnModel().getColumn(0).setMinWidth(0);
            tablaConceptos.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaConceptos.getColumnModel().getColumn(0).setMaxWidth(0);
            tablaConceptos.getColumnModel().getColumn(1).setResizable(false);
            tablaConceptos.getColumnModel().getColumn(1).setPreferredWidth(120);
            tablaConceptos.getColumnModel().getColumn(2).setResizable(false);
            tablaConceptos.getColumnModel().getColumn(2).setPreferredWidth(120);
            tablaConceptos.getColumnModel().getColumn(3).setResizable(false);
            tablaConceptos.getColumnModel().getColumn(3).setPreferredWidth(60);
        }

        actualizar.setBackground(new java.awt.Color(27, 106, 170));
        actualizar.setForeground(new java.awt.Color(255, 255, 255));
        actualizar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/boton-actualizar.png"))); // NOI18N
        actualizar.setText("Actualizar");
        actualizar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        actualizar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                actualizarActionPerformed(evt);
            }
        });

        jLabel1.setText("Search: ");

        filtrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                filtrarActionPerformed(evt);
            }
        });
        filtrar.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                filtrarKeyReleased(evt);
            }
        });

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel3Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(filtrar, javax.swing.GroupLayout.PREFERRED_SIZE, 74, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel1)
                    .addComponent(filtrar, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel2, javax.swing.GroupLayout.PREFERRED_SIZE, 161, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 85, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(actualizar, javax.swing.GroupLayout.PREFERRED_SIZE, 95, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addContainerGap())
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGap(81, 81, 81)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 420, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel2)
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 51, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(actualizar, javax.swing.GroupLayout.PREFERRED_SIZE, 51, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 215, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(69, Short.MAX_VALUE))
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

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
       NuevoConceptoAdmin nuevoConcepto = new NuevoConceptoAdmin(this,true);
       nuevoConcepto.setVisible(true);
    }//GEN-LAST:event_jButton1ActionPerformed

    private void actualizarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_actualizarActionPerformed
        int tam = tablaConceptos.getRowCount();
        for (int i = tam - 1; i >= 0; i--) {
            modeloTabla.removeRow(i);
        }
        optenerTipos();
    }//GEN-LAST:event_actualizarActionPerformed

    private void filtrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_filtrarActionPerformed

    }//GEN-LAST:event_filtrarActionPerformed

    private void filtrarKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_filtrarKeyReleased
        String consulta = "";
        ResultSet rs = null;
        String dato = filtrar.getText().trim();
        String nombre = "";
        String nombre_corto = "";
        int id_clase = 0;
        ArrayList<TipoConcepto> lista = new ArrayList();
        
        if (filtrar.getText().equals("")) {
            limpiar();
        }else{           
            consulta = "SELECT ID,NOMBRE,NOMBRE_CORTO\n" +
            "FROM TIPO \n" +
            "WHERE LOWER(NOMBRE) LIKE '%"+dato+"%' AND ID_EMPRESA IS NULL";
            rs = db.seleccionar(consulta);
            try {
                while(rs.next()){
                    id_clase = rs.getInt(1);
                    nombre = rs.getString(2);
                    nombre_corto = rs.getString(3);
                    
                    TipoConcepto tipo = new TipoConcepto(id_clase,nombre,nombre_corto);
                    lista.add(tipo);
                }
                
                int tam = tablaConceptos.getRowCount();
                for (int i = tam - 1; i >= 0; i--) {
                    modeloTabla.removeRow(i);
                }
                
                for (int i = 0; i < lista.size(); i++) {
                    Object[] datos = {lista.get(i).getId(),lista.get(i).getNombre(),lista.get(i).getNombre_corto(),editar,eliminar};
                    modeloTabla.addRow(datos);
                }
 
                tablaConceptos.setModel(modeloTabla);
                tamañoTabla();
                        
            } catch (Exception e) {
                System.out.println("Error "+e);
            }
        }
    }//GEN-LAST:event_filtrarKeyReleased

    private void tablaConceptosKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_tablaConceptosKeyReleased
        // TODO add your handling code here:
    }//GEN-LAST:event_tablaConceptosKeyReleased

    private void tablaConceptosMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaConceptosMouseClicked
        int columna = tablaConceptos.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaConceptos.getRowHeight();

        if (fila < tablaConceptos.getRowCount() && fila >= 0 && columna < tablaConceptos.getColumnCount() && columna >= 0) {
            Object value = tablaConceptos.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                    JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("editar")) {
                    int id = (int) tablaConceptos.getValueAt(fila, 0);
                    System.out.println(id);
                    String nombreCorto = String.valueOf(tablaConceptos.getValueAt(fila, 1));
                    EditarNuevoConceptoAdmin editNuevoConceptoAdmin = new EditarNuevoConceptoAdmin(id,nombreCorto);
                    editNuevoConceptoAdmin.setVisible(true);
                }
                if (botonAccion.getName().equals("eliminar")) {
                    int id_tipo = (int) tablaConceptos.getValueAt(fila, 0);
                    
                    String elimiClase = "DELETE FROM CLASE WHERE ID_TIPO = "+id_tipo;
                    db.eliminarProductos(elimiClase);
                    
                    String elimiTipo = "DELETE FROM TIPO WHERE ID = "+id_tipo;
                    db.eliminarProductos(elimiTipo);
                    
                    limpiar();
                }
            }
        }
    }//GEN-LAST:event_tablaConceptosMouseClicked

    private void formWindowClosing(java.awt.event.WindowEvent evt) {//GEN-FIRST:event_formWindowClosing

    }//GEN-LAST:event_formWindowClosing

    private void formWindowClosed(java.awt.event.WindowEvent evt) {//GEN-FIRST:event_formWindowClosed

    }//GEN-LAST:event_formWindowClosed

    /**
     * @param args the command line arguments
     */

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton actualizar;
    private javax.swing.JTextField filtrar;
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable tablaConceptos;
    // End of variables declaration//GEN-END:variables
}
