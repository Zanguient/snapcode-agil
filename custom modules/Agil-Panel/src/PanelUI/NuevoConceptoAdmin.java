/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.SimpleFormatter;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import models.Database;
import models.RenderTable;
/**
 *
 * @author AGIL
 */
public class NuevoConceptoAdmin extends javax.swing.JDialog {
    public Database db = new Database();
    public DefaultTableModel modeloTabla;
    public String NombreClaseGlobal;
    public int id_usuario;
    
    public JButton editar;
    public ImageIcon imgEditar;
    public Icon iconEditar;
    
    public JButton eliminar;
    public ImageIcon imgEliminar;
    public Icon iconEliminar;
    
    
    public NuevoConceptoAdmin(java.awt.Frame parent, boolean modal){
        super(parent,modal);
        initComponents();
        setLocationRelativeTo(this);
        btnEditar.setVisible(false);
        
        String[] columnas = {"Nombre","Nombre Corto","Editar","Eliminar"};
        modeloTabla = new DefaultTableModel(null, columnas);
        
        tablaConceptos.setDefaultRenderer(Object.class, new RenderTable());
        insertarBotones();  
    }
    /**
     * Creates new form NuevoConcepto
     */
    

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
        tablaConceptos.setRowHeight(33);
    }
    
    public void limpiar(){
        textoTipoNombre.setText("");
        textoTipoNombCort.setText("");
        int tam = tablaConceptos.getRowCount();
        for (int i = tam -1; i >= 0; i--) {
            modeloTabla.removeRow(i);
        }
        JOptionPane.showMessageDialog(null, "Se guardaron los datos");
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        textoTipoNombre = new javax.swing.JTextField();
        jLabel3 = new javax.swing.JLabel();
        textoTipoNombCort = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        textoNombreClase = new javax.swing.JTextField();
        jLabel6 = new javax.swing.JLabel();
        add = new javax.swing.JButton();
        jScrollPane1 = new javax.swing.JScrollPane();
        tablaConceptos = 
        new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 
                && colIndex != 3;
            }
        };
        cancelar = new javax.swing.JButton();
        guardar = new javax.swing.JButton();
        textoNomCortoClase = new javax.swing.JTextField();
        btnEditar = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.DO_NOTHING_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(82, 147, 196));
        jLabel1.setText("Datos Tipo");

        jLabel2.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(82, 147, 196));
        jLabel2.setText("Nombre");

        jLabel3.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(82, 147, 196));
        jLabel3.setText("Nombre Corto");

        textoTipoNombCort.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                textoTipoNombCortActionPerformed(evt);
            }
        });
        textoTipoNombCort.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyPressed(java.awt.event.KeyEvent evt) {
                textoTipoNombCortKeyPressed(evt);
            }
            public void keyReleased(java.awt.event.KeyEvent evt) {
                textoTipoNombCortKeyReleased(evt);
            }
            public void keyTyped(java.awt.event.KeyEvent evt) {
                textoTipoNombCortKeyTyped(evt);
            }
        });

        jLabel4.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(82, 147, 196));
        jLabel4.setText("Datos Clases");

        jLabel5.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(82, 147, 196));
        jLabel5.setText("Nombre Clase");

        jLabel6.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel6.setForeground(new java.awt.Color(82, 147, 196));
        jLabel6.setText("Nombre Corto Clase");

        add.setBackground(new java.awt.Color(66, 139, 202));
        add.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        add.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        add.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(27, 106, 170)));
        add.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                addActionPerformed(evt);
            }
        });

        tablaConceptos.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Nombre", "Nombre Corto", "Editar", "Eliminar"
            }
        ));
        tablaConceptos.setFillsViewportHeight(true);
        tablaConceptos.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaConceptosMouseClicked(evt);
            }
        });
        jScrollPane1.setViewportView(tablaConceptos);

        cancelar.setBackground(new java.awt.Color(183, 70, 53));
        cancelar.setForeground(new java.awt.Color(255, 255, 255));
        cancelar.setText("Cancelar");
        cancelar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(209, 91, 71)));
        cancelar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cancelarActionPerformed(evt);
            }
        });

        guardar.setBackground(new java.awt.Color(98, 155, 88));
        guardar.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        guardar.setForeground(new java.awt.Color(255, 255, 255));
        guardar.setText("Guardar");
        guardar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(135, 184, 127)));
        guardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                guardarActionPerformed(evt);
            }
        });

        btnEditar.setBackground(new java.awt.Color(66, 139, 202));
        btnEditar.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        btnEditar.setForeground(new java.awt.Color(255, 255, 255));
        btnEditar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        btnEditar.setText("Editar");
        btnEditar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(27, 106, 170)));
        btnEditar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnEditarActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 81, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(46, 46, 46)
                        .addComponent(guardar, javax.swing.GroupLayout.PREFERRED_SIZE, 86, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jLabel1, javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.PREFERRED_SIZE, 452, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel4, javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                        .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                .addComponent(jLabel2)
                                .addComponent(textoTipoNombre, javax.swing.GroupLayout.PREFERRED_SIZE, 160, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                .addComponent(jLabel3)
                                .addComponent(textoTipoNombCort, javax.swing.GroupLayout.PREFERRED_SIZE, 160, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGroup(javax.swing.GroupLayout.Alignment.LEADING, jPanel1Layout.createSequentialGroup()
                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                .addComponent(jLabel5)
                                .addGroup(jPanel1Layout.createSequentialGroup()
                                    .addComponent(textoNombreClase, javax.swing.GroupLayout.DEFAULT_SIZE, 91, Short.MAX_VALUE)
                                    .addGap(8, 8, 8)))
                            .addGap(10, 10, 10)
                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                .addComponent(textoNomCortoClase, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addComponent(jLabel6))
                            .addGap(18, 18, 18)
                            .addComponent(add, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGap(18, 18, 18)
                            .addComponent(btnEditar, javax.swing.GroupLayout.PREFERRED_SIZE, 71, javax.swing.GroupLayout.PREFERRED_SIZE))))
                .addContainerGap(52, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel2)
                    .addComponent(jLabel3))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(textoTipoNombre, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(textoTipoNombCort, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel4)
                        .addGap(13, 13, 13)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel5)
                            .addComponent(jLabel6))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(textoNombreClase, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textoNomCortoClase, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(26, 26, 26))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(btnEditar, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(add, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(18, 18, 18)))
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 106, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 40, Short.MAX_VALUE)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(guardar, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(20, 20, 20))
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

    private void addActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_addActionPerformed
        String claseNombre = textoNombreClase.getText();
        String claseNombreCorto = textoNomCortoClase.getText();
        
        Object[] datos = {claseNombre,claseNombreCorto,editar,eliminar};
        modeloTabla.addRow(datos);
        
        tablaConceptos.setModel(modeloTabla);
        
        textoNombreClase.setText("");
        textoNomCortoClase.setText("");
    }//GEN-LAST:event_addActionPerformed

    private void cancelarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cancelarActionPerformed
       dispose();
    }//GEN-LAST:event_cancelarActionPerformed

    private void guardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_guardarActionPerformed
        ResultSet rs = null;
        Date fe = new Date();
        long dd = fe.getTime();
        java.sql.Date fecha = new java.sql.Date(dd); 
        SimpleDateFormat ft = new SimpleDateFormat("dd-MM-yyyy");
        String fechaAct = ft.format(fecha);
        String tipoNombre = textoTipoNombre.getText();
        String tipoNombreCorto = textoTipoNombCort.getText();
        
        try {
           
           int existe =0;
           String consulta = "SELECT ID FROM TIPO WHERE NOMBRE_CORTO = '"+tipoNombreCorto+"'";
           rs = db.seleccionar(consulta);
            while (rs.next()) {
                existe = rs.getInt(1);
               // System.out.println(rs.getInt(1));
            }
            if (existe != 0) {
                JOptionPane.showMessageDialog(null, "Ya existe este grupo");
            }else{
    
                int id = db.seleccionarUltimoIdTipo();
                id = id + 1;
                db.InsertarTiposEmpresaNula(id, tipoNombre, tipoNombreCorto, fechaAct, consulta);

                int ultimoIdTip = db.seleccionarUltimoIdTipo();
               
                for (int i = 0; i < tablaConceptos.getRowCount(); i++) {
                    int idClase = db.seleccionarUltimoIdClase();
                    idClase = idClase + 1 ;
                    String nombreClase = String.valueOf(tablaConceptos.getValueAt(i, 0));
                    String nombreCortoClase = String.valueOf(tablaConceptos.getValueAt(i, 1));

                    db.InsertarClases(idClase, ultimoIdTip, nombreClase, nombreCortoClase, true, fechaAct, fechaAct);
                }
                limpiar();
                dispose();
            }
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
    }//GEN-LAST:event_guardarActionPerformed

    private void textoTipoNombCortKeyPressed(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoTipoNombCortKeyPressed
       
    }//GEN-LAST:event_textoTipoNombCortKeyPressed

    private void textoTipoNombCortActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_textoTipoNombCortActionPerformed

    }//GEN-LAST:event_textoTipoNombCortActionPerformed

    private void textoTipoNombCortKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoTipoNombCortKeyReleased
    
    }//GEN-LAST:event_textoTipoNombCortKeyReleased
 
    private void textoTipoNombCortKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_textoTipoNombCortKeyTyped

    }//GEN-LAST:event_textoTipoNombCortKeyTyped

    private void tablaConceptosMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaConceptosMouseClicked
        int columna = tablaConceptos.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaConceptos.getRowHeight();

        if (fila < tablaConceptos.getRowCount() && fila >= 0 && columna < tablaConceptos.getColumnCount() && columna >= 0) {
            Object value = tablaConceptos.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                    JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("editar")) {
                    String nombre = String.valueOf(tablaConceptos.getValueAt(fila, 0));
                    String nombreCorto = String.valueOf(tablaConceptos.getValueAt(fila, 1));
                    NombreClaseGlobal = nombre;
                    textoNombreClase.setText(nombre);
                    textoNomCortoClase.setText(nombreCorto);
                    
                    add.setVisible(false);
                    btnEditar.setVisible(true);
                }
                if(botonAccion.getName().equals("eliminar")){
                    String nombre = String.valueOf(tablaConceptos.getValueAt(fila, 0));
                    
                    for (int i = 0; i < tablaConceptos.getRowCount(); i++) {
                        if (tablaConceptos.getValueAt(i, 0).equals(nombre)) {
                            modeloTabla.removeRow(i);
                            textoNombreClase.setText("");
                            textoNomCortoClase.setText("");
                        }
                    }
                }
            }
        }
    }//GEN-LAST:event_tablaConceptosMouseClicked

    private void btnEditarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnEditarActionPerformed
       ResultSet rs = null;
        String nombre = textoNombreClase.getText();
        String nombreCorto = textoNomCortoClase.getText();
        
        for (int i = 0; i < tablaConceptos.getRowCount(); i++) {
            if (tablaConceptos.getValueAt(i, 0).equals(NombreClaseGlobal)) {
                tablaConceptos.setValueAt(nombre, i, 0);
                tablaConceptos.setValueAt(nombreCorto, i, 1);
            }
        }
        textoNombreClase.setText("");
        textoNomCortoClase.setText("");
        btnEditar.setVisible(false);
        add.setVisible(true);
    }//GEN-LAST:event_btnEditarActionPerformed

    /**
     * @param args the command line arguments
     */
    

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton add;
    private javax.swing.JButton btnEditar;
    private javax.swing.JButton cancelar;
    private javax.swing.JButton guardar;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable tablaConceptos;
    private javax.swing.JTextField textoNomCortoClase;
    private javax.swing.JTextField textoNombreClase;
    private javax.swing.JTextField textoTipoNombCort;
    private javax.swing.JTextField textoTipoNombre;
    // End of variables declaration//GEN-END:variables
}
