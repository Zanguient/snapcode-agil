/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.table.DefaultTableModel;
import modelo_Concepto.TipoConcepto;
import models.Database;
import models.RenderTable;

/**
 *
 * @author AGIL
 */
public class EditarNuevoConceptoAdmin extends javax.swing.JFrame {
    public Database db = new Database();
    public DefaultTableModel modalTabla;
    public int id_tipo;
    public String nombreCorto;
    
    public JButton editar;
    public ImageIcon imgEditar;
    public Icon iconEditar;
    
    public JButton eliminar;
    public ImageIcon imgEliminar;
    public Icon iconEliminar;
    
    public int idClaseGlobal = 0;
    /**
     * Creates new form EditarNuevoConcepto
     */
    public EditarNuevoConceptoAdmin(int id_tipo,String nombreCorto) {
        initComponents();
        setLocationRelativeTo(this);
        this.setTitle("Editar Concepto");
        this.id_tipo = id_tipo;
        this.nombreCorto = nombreCorto;
        btnEditar.setVisible(false);
        
        String[] columnas = {"Id","Nombre","Nombre Corto","Editar","Eliminar"};
        modalTabla = new DefaultTableModel(null,columnas);
     
         
        tablaEditConcepto.setDefaultRenderer(Object.class, new RenderTable());
        insertarBotones();
        optenerInformacion();
    }

    public void insertarBotones(){
        String imgEdit = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\editar.png";
        imgEditar = new ImageIcon(imgEdit);
        iconEditar = new ImageIcon(imgEditar.getImage().getScaledInstance(20, 20, 1));
        editar = new JButton(iconEditar);
        editar.setName("editar");
        String imgElim = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\delete.png";
        imgEliminar = new ImageIcon(imgElim);
        iconEliminar = new ImageIcon(imgEliminar.getImage().getScaledInstance(20, 20, 1));
        eliminar = new JButton(iconEliminar);
        eliminar.setName("eliminar");
        tablaEditConcepto.setRowHeight(33);
    }
    
    public void optenerInformacion(){
        ResultSet rs = null;
        
        String tipoNombre = "";
        String tipoNomCort = "";
        String ClaseNombre = "";
        String ClaseNomCort = "";
        ArrayList<TipoConcepto> lista = new ArrayList();
        
        String consulta = "SELECT C.ID,T.NOMBRE,T.NOMBRE_CORTO,C.NOMBRE,C.NOMBRE_CORTO\n" +
            "FROM TIPO AS T\n" +
            "INNER JOIN CLASE AS C ON C.ID_TIPO = T.ID\n" +
            "WHERE T.ID = "+this.id_tipo;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){  
                int id = rs.getInt(1);
                tipoNombre = rs.getString(2);
                tipoNomCort = rs.getString(3);
                ClaseNombre = rs.getString(4);
                ClaseNomCort = rs.getString(5);
                
                TipoConcepto concepto = new TipoConcepto(id, ClaseNombre, ClaseNomCort);
                lista.add(concepto);
            }
            textoTipoNombre.setText(tipoNombre);
            textoTipoNomCort.setText(tipoNomCort);
            for (int i = 0; i < lista.size(); i++) {
                Object[] dato = {lista.get(i).getId(),lista.get(i).getNombre(),lista.get(i).getNombre_corto(),editar,eliminar};
                modalTabla.addRow(dato);
            }
            
            tablaEditConcepto.setModel(modalTabla);
            tamañoTabla();
            
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
    }
   
    public void tamañoTabla() {
        tablaEditConcepto.getColumnModel().getColumn(0).setMaxWidth(0);
        tablaEditConcepto.getColumnModel().getColumn(0).setMinWidth(0);
        tablaEditConcepto.getColumnModel().getColumn(0).setPreferredWidth(0);
      }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        textoTipoNombre = new javax.swing.JTextField();
        jLabel3 = new javax.swing.JLabel();
        textoTipoNomCort = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        textoDatosNombre = new javax.swing.JTextField();
        textoDatosNombCort = new javax.swing.JTextField();
        jScrollPane1 = new javax.swing.JScrollPane();
        tablaEditConcepto = new javax.swing.JTable();
        add = new javax.swing.JButton();
        btnEditar = new javax.swing.JButton();
        guardar = new javax.swing.JButton();
        cancelar = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(66, 139, 202));
        jLabel1.setText("Datos Tipo");

        jLabel2.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(66, 139, 202));
        jLabel2.setText("Nombre");

        textoTipoNombre.setEditable(false);

        jLabel3.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel3.setForeground(new java.awt.Color(66, 139, 202));
        jLabel3.setText("Nombre Corto");

        textoTipoNomCort.setEditable(false);

        jLabel4.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel4.setForeground(new java.awt.Color(66, 139, 202));
        jLabel4.setText("Nombre");

        jLabel5.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel5.setForeground(new java.awt.Color(66, 139, 202));
        jLabel5.setText("Nombre");

        tablaEditConcepto.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null, null},
                {null, null, null, null, null},
                {null, null, null, null, null},
                {null, null, null, null, null}
            },
            new String [] {
                "Id", "Nombre", "Nombre Corto", "Editar", "Eliminar"
            }
        ));
        tablaEditConcepto.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaEditConceptoMouseClicked(evt);
            }
        });
        jScrollPane1.setViewportView(tablaEditConcepto);
        if (tablaEditConcepto.getColumnModel().getColumnCount() > 0) {
            tablaEditConcepto.getColumnModel().getColumn(0).setMinWidth(0);
            tablaEditConcepto.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaEditConcepto.getColumnModel().getColumn(0).setMaxWidth(0);
        }

        add.setBackground(new java.awt.Color(66, 139, 202));
        add.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        add.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(27, 106, 170)));
        add.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                addActionPerformed(evt);
            }
        });
        add.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyPressed(java.awt.event.KeyEvent evt) {
                addKeyPressed(evt);
            }
        });

        btnEditar.setBackground(new java.awt.Color(66, 139, 202));
        btnEditar.setForeground(new java.awt.Color(255, 255, 255));
        btnEditar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        btnEditar.setText("Editar");
        btnEditar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(27, 106, 170)));
        btnEditar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnEditarActionPerformed(evt);
            }
        });
        btnEditar.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyPressed(java.awt.event.KeyEvent evt) {
                btnEditarKeyPressed(evt);
            }
        });

        guardar.setBackground(new java.awt.Color(98, 155, 88));
        guardar.setForeground(new java.awt.Color(255, 255, 255));
        guardar.setText("Guardar");
        guardar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(134, 183, 126)));
        guardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                guardarActionPerformed(evt);
            }
        });

        cancelar.setBackground(new java.awt.Color(183, 70, 53));
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
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                            .addComponent(textoDatosNombre)
                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(jLabel1, javax.swing.GroupLayout.DEFAULT_SIZE, 90, Short.MAX_VALUE)
                                    .addComponent(jLabel2, javax.swing.GroupLayout.PREFERRED_SIZE, 66, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(textoTipoNombre))
                                .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 66, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(18, 18, 18)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, 66, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textoTipoNomCort)
                            .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 89, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textoDatosNombCort, javax.swing.GroupLayout.DEFAULT_SIZE, 94, Short.MAX_VALUE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(add, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(btnEditar, javax.swing.GroupLayout.PREFERRED_SIZE, 74, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 375, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(19, Short.MAX_VALUE))
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 72, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(guardar, javax.swing.GroupLayout.PREFERRED_SIZE, 75, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(53, 53, 53))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel1)
                        .addGap(18, 18, 18)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel2)
                            .addComponent(jLabel3))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(textoTipoNombre, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(textoTipoNomCort, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel4)
                            .addComponent(jLabel5))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(add, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                .addComponent(textoDatosNombre, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addComponent(textoDatosNombCort, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))))
                    .addComponent(btnEditar, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 163, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(31, 31, 31)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(guardar, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(cancelar, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(29, Short.MAX_VALUE))
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

    private void tablaEditConceptoMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaEditConceptoMouseClicked
       int columna = tablaEditConcepto.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaEditConcepto.getRowHeight();

        if (fila < tablaEditConcepto.getRowCount() && fila >= 0 && columna < tablaEditConcepto.getColumnCount() && columna >= 0) {
            Object value = tablaEditConcepto.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                    JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("editar")) {
                    idClaseGlobal = (int) tablaEditConcepto.getValueAt(fila, 0);
                    String nombreCorto = String.valueOf(tablaEditConcepto.getValueAt(fila, 2));
                    String nombre = String.valueOf(tablaEditConcepto.getValueAt(fila, 1));
                    textoDatosNombre.setText(nombre);
                    textoDatosNombCort.setText(nombreCorto);
                    btnEditar.setVisible(true);
                    add.setVisible(false);
                }
                if(botonAccion.getName().equals("eliminar")){
                    idClaseGlobal = (int) tablaEditConcepto.getValueAt(fila, 0);

                    String consulta = "DELETE FROM CLASE WHERE ID = "+idClaseGlobal;
                    db.eliminarProductos(consulta);
                    dispose();
                }
            }
        }
    }//GEN-LAST:event_tablaEditConceptoMouseClicked

    private void addKeyPressed(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_addKeyPressed

    }//GEN-LAST:event_addKeyPressed

    private void addActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_addActionPerformed
        String nombre = textoDatosNombre.getText();
       String nombreCorto = textoDatosNombCort.getText();
       int existe = 0;
        for (int i = 0; i < tablaEditConcepto.getRowCount(); i++) {
            if (tablaEditConcepto.getValueAt(i, 2).equals(nombreCorto) ) {            
                 existe++;
            }
        }
        if(existe == 0){
            Object[] dato = {0,nombre,nombreCorto,editar,eliminar};
            modalTabla.addRow(dato);
            tablaEditConcepto.setModel(modalTabla);

            textoDatosNombre.setText("");
            textoDatosNombCort.setText("");
        }else{
            JOptionPane.showMessageDialog(null, "Ya existe este grupo");
        }
       
    }//GEN-LAST:event_addActionPerformed

    private void btnEditarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnEditarActionPerformed

        String nombre = textoDatosNombre.getText();
        String nombreCorto = textoDatosNombCort.getText();
        
        for (int i = 0; i < tablaEditConcepto.getRowCount(); i++) {
            if (tablaEditConcepto.getValueAt(i, 0).equals(idClaseGlobal)) {
                tablaEditConcepto.setValueAt(nombre, i, 1);
                tablaEditConcepto.setValueAt(nombreCorto, i, 2);
            }
        }
        textoDatosNombre.setText("");
        textoDatosNombCort.setText("");
        btnEditar.setVisible(false);
        add.setVisible(true);
    }//GEN-LAST:event_btnEditarActionPerformed

    private void btnEditarKeyPressed(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_btnEditarKeyPressed
        // TODO add your handling code here:
    }//GEN-LAST:event_btnEditarKeyPressed

    private void cancelarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cancelarActionPerformed
        dispose();
    }//GEN-LAST:event_cancelarActionPerformed

    private void guardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_guardarActionPerformed
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        
        java.util.Date fe = new java.util.Date();
        long d = fe.getTime();
        java.sql.Date updated = new java.sql.Date(d);
        String updatedat = sdf.format(updated);
        int id;
        String nombre;
        String nombre_corto;
        
        for (int i = 0; i < tablaEditConcepto.getRowCount(); i++) {
            id = (int) tablaEditConcepto.getValueAt(i, 0);
            nombre = (String) tablaEditConcepto.getValueAt(i, 1);
            nombre_corto = (String) tablaEditConcepto.getValueAt(i, 2);
            boolean habilitar = false;
            
            if (id == 0) {
                int recogerId = db.seleccionarUltimoIdClase();
                int ultimoId = recogerId + 1;
                
                db.InsertarClasesConcepto(ultimoId,this.id_tipo, nombre, nombre_corto, habilitar, updatedat, updatedat);
                
            }else{
                try { 
                    
                    db.InsertarClasesConcepto(id, this.id_tipo, nombre, nombre_corto, habilitar, updatedat, updatedat);
                    
                } catch (Exception e) {
                    System.out.println("Error "+e);
                }
            }
        }
        dispose();
    }//GEN-LAST:event_guardarActionPerformed

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
    private javax.swing.JPanel jPanel1;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable tablaEditConcepto;
    private javax.swing.JTextField textoDatosNombCort;
    private javax.swing.JTextField textoDatosNombre;
    private javax.swing.JTextField textoTipoNomCort;
    private javax.swing.JTextField textoTipoNombre;
    // End of variables declaration//GEN-END:variables
}
