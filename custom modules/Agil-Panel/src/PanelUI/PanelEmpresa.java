/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.sql.ResultSet;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.RowFilter;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableRowSorter;
import models.Database;
import modelo_Admin.*;

/**
 *
 * @author AGIL
 */
public class PanelEmpresa extends javax.swing.JFrame {
    Database db = new Database();
    DefaultTableModel modelTabla;
    
    JButton editar;
    ImageIcon imgEditar;
    Icon iconEditar;
    
    JButton eliminar;
    ImageIcon imgEliminar;
    Icon iconEliminar;
    TableRowSorter trs ;
    /**
     * Creates new form PanelEmpresa
     */
    public PanelEmpresa() {
        initComponents();
        setLocationRelativeTo(this);
        this.setTitle("Empresa Admin");
        String[] columnas = {"Id","#","Razón Social","Nit","Direccion","Panel","Vencimientos","Servicios","Consumos","Descuentos","Geo","Pedidos","Editar","Eliminar"};
        modelTabla = new DefaultTableModel(null,columnas);
        optenerInformacion();   
        
        tablaEmpresa.setDefaultRenderer(Object.class, new RenderTable());  
        
        tablaEmpresa.setRowHeight(33);
    }

    public void optenerInformacion(){
        ResultSet rs = null;
        int id ;
        int num = 1;
        String razonSocial;
        String nit ;
        String direccion;
        
        
        String panel = "";
        String vencimiento = "";
        String servicios = "";
        String consumos = "";
        String descuentos = "";
        String geo = "";
        String pedidos = "";
        
        String consulta = "SELECT * FROM EMPRESA WHERE ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {  
                id = rs.getInt(1);
                razonSocial = rs.getString(2);
                nit = rs.getString(3);
                direccion = rs.getString(4);
                
                if(rs.getBoolean(12) == true){panel = "si";}else{panel = "no";}
                if(rs.getBoolean(13) == true){vencimiento = "si";}else{vencimiento = "no";}
                if(rs.getBoolean(14) == true){servicios = "si";}else{servicios = "no";}
                if(rs.getBoolean(15) == true){consumos = "si";}else{consumos = "no";}
                if(rs.getBoolean(16) == true){descuentos = "si";}else{descuentos = "no";}
                if(rs.getBoolean(17) == true){geo = "si";}else{geo = "no";}
                if(rs.getBoolean(18) == true){pedidos = "si";}else{pedidos = "no";}
                
                insertarBotones();
        
                Object[] datos = {id,num,razonSocial,nit,direccion,panel,vencimiento,servicios,consumos,descuentos,geo,pedidos,editar,eliminar};
                num++;
                modelTabla.addRow(datos);
            }
            
            tablaEmpresa.setModel(modelTabla);
            tamañoTabla();
           /* pack();
            tablaEmpresa.updateUI();
            tablaEmpresa.setVisible(true);*/
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }
        
    }
    
    public void insertarBotones(){
        tablaEmpresa.setDefaultRenderer(Object.class, new RenderTable());
        String editaImg = "/imagen/editar.png";
        imgEditar = new ImageIcon(this.getClass().getResource(editaImg));
        iconEditar = new ImageIcon(imgEditar.getImage().getScaledInstance(20, 20, 1));
        editar = new JButton(iconEditar);
        editar.setName("editar");
        
        String eliminarImg = "/imagen/eliminar.png";
        imgEliminar = new ImageIcon(this.getClass().getResource(eliminarImg));
        iconEliminar = new ImageIcon(imgEliminar.getImage().getScaledInstance(20, 20, 1));
        eliminar = new JButton(iconEliminar);
        eliminar.setName("eliminar");
    }
    
    public void tamañoTabla() {
        tablaEmpresa.getColumnModel().getColumn(0).setMaxWidth(0);
        tablaEmpresa.getColumnModel().getColumn(0).setMinWidth(0);
        tablaEmpresa.getColumnModel().getColumn(0).setPreferredWidth(0);

        tablaEmpresa.getColumnModel().getColumn(1).setMaxWidth(30);
        tablaEmpresa.getColumnModel().getColumn(1).setMinWidth(30);
        tablaEmpresa.getColumnModel().getColumn(1).setPreferredWidth(30);

        tablaEmpresa.getColumnModel().getColumn(2).setMaxWidth(100);
        tablaEmpresa.getColumnModel().getColumn(2).setMinWidth(100);
        tablaEmpresa.getColumnModel().getColumn(2).setPreferredWidth(100);

        tablaEmpresa.getColumnModel().getColumn(3).setMaxWidth(80);
        tablaEmpresa.getColumnModel().getColumn(3).setMinWidth(80);
        tablaEmpresa.getColumnModel().getColumn(3).setPreferredWidth(80);

        tablaEmpresa.getColumnModel().getColumn(4).setMaxWidth(100);
        tablaEmpresa.getColumnModel().getColumn(4).setMinWidth(100);
        tablaEmpresa.getColumnModel().getColumn(4).setPreferredWidth(100);

        tablaEmpresa.getColumnModel().getColumn(6).setMaxWidth(80);
        tablaEmpresa.getColumnModel().getColumn(6).setMinWidth(80);
        tablaEmpresa.getColumnModel().getColumn(6).setPreferredWidth(80);
        
        tablaEmpresa.getColumnModel().getColumn(7).setMaxWidth(65);
        tablaEmpresa.getColumnModel().getColumn(7).setMinWidth(65);
        tablaEmpresa.getColumnModel().getColumn(7).setPreferredWidth(65);
        
        tablaEmpresa.getColumnModel().getColumn(8).setMaxWidth(80);
        tablaEmpresa.getColumnModel().getColumn(8).setMinWidth(80);
        tablaEmpresa.getColumnModel().getColumn(8).setPreferredWidth(80);
        
        tablaEmpresa.getColumnModel().getColumn(9).setMaxWidth(80);
        tablaEmpresa.getColumnModel().getColumn(9).setMinWidth(80);
        tablaEmpresa.getColumnModel().getColumn(9).setPreferredWidth(80);
        
        tablaEmpresa.getColumnModel().getColumn(10).setMaxWidth(60);
        tablaEmpresa.getColumnModel().getColumn(10).setMinWidth(60);
        tablaEmpresa.getColumnModel().getColumn(10).setPreferredWidth(60);
    }
    
    public void limpiarTabla(){
        int tam = tablaEmpresa.getRowCount();
        for (int i = tam-1; i >= 0; i--) {
            modelTabla.removeRow(i);
        }
    }
   
            
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jButton1 = new javax.swing.JButton();
        jPanel2 = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        jScrollPane1 = new javax.swing.JScrollPane();
        tablaEmpresa = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 && colIndex != 3 
                && colIndex != 4 && colIndex != 5 && colIndex != 6 && colIndex != 7
                && colIndex != 8 && colIndex != 9 && colIndex != 10 && colIndex != 11
                && colIndex != 12  ;
            }
        };
        actualizar = new javax.swing.JButton();
        jPanel3 = new javax.swing.JPanel();
        jLabel3 = new javax.swing.JLabel();
        filtro = new javax.swing.JTextField();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(71, 143, 202));
        jLabel1.setText("EMPRESAS");

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

        jPanel2.setBackground(new java.awt.Color(27, 106, 170));

        jLabel2.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("Lista de Empresas");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jLabel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jLabel2, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, 36, Short.MAX_VALUE)
        );

        tablaEmpresa.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null, null, null, null, null, null, null, null, null, null, null},
                {null, null, null, null, null, null, null, null, null, null, null, null, null, null},
                {null, null, null, null, null, null, null, null, null, null, null, null, null, null},
                {null, null, null, null, null, null, null, null, null, null, null, null, null, null}
            },
            new String [] {
                "id", "#", "Razón Social", "Nit", "Direccion", "Panel", "Vencimientos", "Servicios", "Consumos", "Descuentos", "Geo", "Pedidos", "Editar", "Eliminar"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                true, false, false, false, false, false, false, false, false, false, false, false, false, true
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        tablaEmpresa.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaEmpresaMouseClicked(evt);
            }
        });
        jScrollPane1.setViewportView(tablaEmpresa);
        if (tablaEmpresa.getColumnModel().getColumnCount() > 0) {
            tablaEmpresa.getColumnModel().getColumn(0).setMinWidth(0);
            tablaEmpresa.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaEmpresa.getColumnModel().getColumn(0).setMaxWidth(0);
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

        jLabel3.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        jLabel3.setText("Buscar:");

        filtro.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyTyped(java.awt.event.KeyEvent evt) {
                filtroKeyTyped(evt);
            }
        });

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel3Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jLabel3)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(filtro, javax.swing.GroupLayout.PREFERRED_SIZE, 65, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(33, 33, 33))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel3)
                    .addComponent(filtro, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 116, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(42, 42, 42)
                                .addComponent(actualizar, javax.swing.GroupLayout.PREFERRED_SIZE, 80, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(0, 722, Short.MAX_VALUE))
                    .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, 924, Short.MAX_VALUE))
                .addContainerGap())
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 42, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(actualizar, javax.swing.GroupLayout.PREFERRED_SIZE, 42, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 247, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(82, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGap(0, 0, 0))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        NuevoAdminEmpresaUI nuevaEmpresa = new NuevoAdminEmpresaUI(this,true);
        nuevaEmpresa.setVisible(true);
    }//GEN-LAST:event_jButton1ActionPerformed

    private void tablaEmpresaMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaEmpresaMouseClicked
        int columna = tablaEmpresa.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaEmpresa.getRowHeight();
        String idProducto;
        boolean existe = false;

        if (fila < tablaEmpresa.getRowCount() && fila >= 0 && columna < tablaEmpresa.getColumnCount() && columna >= 0) {
            Object value = tablaEmpresa.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("editar")) {
                    int id = Integer.parseInt(String.valueOf(tablaEmpresa.getValueAt(fila, 0)));
                    NuevoAdminEmpresaUI nuevaEmpresa = new NuevoAdminEmpresaUI(this,true,id);
                    nuevaEmpresa.setVisible(true);
                }
                if (botonAccion.getName().equals("eliminar")) {
                    int id = Integer.parseInt(String.valueOf(tablaEmpresa.getValueAt(fila, 0)));
                    String razonSocial = String.valueOf(tablaEmpresa.getValueAt(fila, 2));
                   
                    int resp = JOptionPane.showConfirmDialog(this, "<html>Desea eliminar la<br>empresa "+razonSocial+"?</html>", "Alerta!", JOptionPane.YES_NO_OPTION, JOptionPane.ERROR_MESSAGE);

                    if(resp == 0){
                        
                        modelTabla.removeRow(fila);
                        String consElimSuc = "UPDATE SUCURSAL SET ELIMINADO = "+true+" WHERE EMPRESA = "+id;
                        db.insertar(consElimSuc);

                        String consElimEmp = "UPDATE EMPRESA SET ELIMINADO = "+true+" WHERE ID = "+id;
                        db.insertar(consElimEmp);

                        limpiarTabla();
                        optenerInformacion();
                    }
                }
            }
        }
    }//GEN-LAST:event_tablaEmpresaMouseClicked

    private void actualizarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_actualizarActionPerformed
        limpiarTabla();
        optenerInformacion();
    }//GEN-LAST:event_actualizarActionPerformed

    private void filtroKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_filtroKeyTyped
        filtro.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
               trs.setRowFilter(RowFilter.regexFilter("(?i)"+filtro.getText(), 2));
            }  
        });      
        trs = new TableRowSorter(modelTabla);
        tablaEmpresa.setRowSorter(trs);
    }//GEN-LAST:event_filtroKeyTyped

    /**
     * @param args the command line arguments
     */

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton actualizar;
    private javax.swing.JTextField filtro;
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable tablaEmpresa;
    // End of variables declaration//GEN-END:variables
}
