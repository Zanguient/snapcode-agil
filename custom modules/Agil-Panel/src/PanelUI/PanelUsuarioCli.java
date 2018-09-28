/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.Color;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JTable;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import javax.swing.table.TableRowSorter;
import models.Database;
import models.RenderTable;

/**
 *
 * @author AGIL
 */
public class PanelUsuarioCli extends javax.swing.JFrame {
    public int id_usuario;
    public Database db = new Database();
    DefaultTableModel modelUsuarioTabla;
    TableRowSorter trs ;
    
    JButton editar;
    ImageIcon imgEditar;
    Icon iconEditar;
    
    JButton eliminar;
    ImageIcon imgEliminar;
    Icon iconEliminar;
    
    /**
     * Creates new form PaneUsuarioCli
     */
    public PanelUsuarioCli(int id_usuario) {
        initComponents();
        this.id_usuario = id_usuario;
        setLocationRelativeTo(this);

        String[] columnas = {"Id","#","Nombre","<html>Primer<br>Apellido</html>","<html>Segundo<br>Apellido</html>","Usuario","Rol","Empresa","Activo","Editar","Eliminar"};
        modelUsuarioTabla = (DefaultTableModel) tablaUsuarios.getModel();//new DefaultTableModel(null,columnas);
        tablaUsuarios.setDefaultRenderer(Object.class, new RenderTable());
        
        tablaUsuarios.getTableHeader().setPreferredSize(new java.awt.Dimension(0, 33));
        tablaUsuarios.setDefaultRenderer(Object.class, new RenderTable());  
        tablaUsuarios.getTableHeader().setBackground(Color.cyan);
        tablaUsuarios.getTableHeader().setForeground(Color.blue);
       
        centrar_datos();
        alinearTextoTabla();
        insertarBotones();
        mostrarDatosUsuario();
    }
    
    public void centrar_datos(){  
        DefaultTableCellRenderer modelocentrar = new DefaultTableCellRenderer(); 
        modelocentrar.setHorizontalAlignment(SwingConstants.CENTER); 
        tablaUsuarios.getColumnModel().getColumn(1).setCellRenderer(modelocentrar); 
        tablaUsuarios.getColumnModel().getColumn(2).setCellRenderer(modelocentrar);
        tablaUsuarios.getColumnModel().getColumn(3).setCellRenderer(modelocentrar);
        tablaUsuarios.getColumnModel().getColumn(4).setCellRenderer(modelocentrar);
        tablaUsuarios.getColumnModel().getColumn(5).setCellRenderer(modelocentrar);
        tablaUsuarios.getColumnModel().getColumn(6).setCellRenderer(modelocentrar);
        tablaUsuarios.getColumnModel().getColumn(7).setCellRenderer(modelocentrar);
        tablaUsuarios.getColumnModel().getColumn(8).setCellRenderer(modelocentrar);   
    } 
       
    public void alinearTextoTabla(){
        TableCellRenderer rendererFromHeader = tablaUsuarios.getTableHeader().getDefaultRenderer();
        JLabel headerLabel = (JLabel) rendererFromHeader;
        headerLabel.setHorizontalAlignment(JLabel.CENTER);
    }
    
    public void insertarBotones(){
        tablaUsuarios.setDefaultRenderer(Object.class, new modelo_Admin.RenderTable());
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
    
    public int obtenerIdEmpresa(){
        ResultSet rs = null;
        String consulta = "SELECT EMPRESA \n" +
            "FROM USUARIO\n" +
            "WHERE ID = "+this.id_usuario;
        int id = 0;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                id = rs.getInt(1);
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
        return id;
    }
    
    public void mostrarDatosUsuario(){
        ResultSet rs = null;
        int num = 1;
        int idEmpresa = obtenerIdEmpresa();
        int id_persona = 0;
        String nombre_persona = "";
        String apellidoP_persona = "";
        String apellidoM_persona = "";
        String nombreUser = "";
        String rol = "";
        String empresa = "";
        boolean activo = false;
        String consulta = "SELECT P.ID,P.NOMBRES,P.APELLIDO_PATERNO,P.APELLIDO_MATERNO,U.NOMBRE_USUARIO,R.NOMBRE,E.RAZON_SOCIAL,U.ACTIVO\n" +
            "FROM PERSONA AS P\n" +
            "INNER JOIN USUARIO AS U ON U.PERSONA = P.ID\n" +
            "INNER JOIN USUARIO_ROL AS UROL ON UROL.USUARIO = U.ID\n" +
            "INNER JOIN ROL AS R ON R.ID = UROL.ROL\n" +
            "INNER JOIN EMPRESA AS E ON E.ID = U.EMPRESA\n" +
            "WHERE U.EMPRESA = "+idEmpresa+" AND P.ELIMINADO = "+false+" and U.ELIMINADO = "+false;       
        try {
            rs =  db.seleccionar(consulta);
            while(rs.next()){
                activo = rs.getBoolean(8);
                if(activo == true){
                    id_persona = rs.getInt(1);
                    nombre_persona = rs.getString(2);
                    apellidoP_persona = rs.getString(3);
                    apellidoM_persona = rs.getString(4);
                    nombreUser = rs.getString(5);
                    rol = rs.getString(6);
                    empresa = rs.getString(7);
                    
                    Object[] data = {id_persona,num,nombre_persona,apellidoP_persona,apellidoM_persona,nombreUser,rol,empresa,"<html><span style=' color:GREEN;'>Si<span></html>",editar,eliminar};
                    num++;
                    modelUsuarioTabla.addRow(data);
                }else if (activo == false){
                    id_persona = rs.getInt(1);
                    nombre_persona = rs.getString(2);
                    apellidoP_persona = rs.getString(3);
                    apellidoM_persona = rs.getString(4);
                    nombreUser = rs.getString(5);
                    rol = rs.getString(6);
                    empresa = rs.getString(7);
                    
                    Object[] data = {id_persona,num++,nombre_persona,apellidoP_persona,apellidoM_persona,nombreUser,rol,empresa,"<html><span style=' color:RED;'>No<span></html>",editar,eliminar};
                    num++;
                    modelUsuarioTabla.addRow(data);
                }
            }
            tablaUsuarios.setModel(modelUsuarioTabla);    
            tamañoTabla();
           
            
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }   
    }
    
    public void tamañoTabla() {
        tablaUsuarios.getColumnModel().getColumn(0).setMaxWidth(0);
        tablaUsuarios.getColumnModel().getColumn(0).setMinWidth(0);
        tablaUsuarios.getColumnModel().getColumn(0).setPreferredWidth(0);

        tablaUsuarios.getColumnModel().getColumn(1).setMaxWidth(30);
        tablaUsuarios.getColumnModel().getColumn(1).setMinWidth(30);
        tablaUsuarios.getColumnModel().getColumn(1).setPreferredWidth(30);

        tablaUsuarios.getColumnModel().getColumn(2).setMaxWidth(100);
        tablaUsuarios.getColumnModel().getColumn(2).setMinWidth(100);
        tablaUsuarios.getColumnModel().getColumn(2).setPreferredWidth(100);

        tablaUsuarios.getColumnModel().getColumn(3).setMaxWidth(80);
        tablaUsuarios.getColumnModel().getColumn(3).setMinWidth(80);
        tablaUsuarios.getColumnModel().getColumn(3).setPreferredWidth(80);

        tablaUsuarios.getColumnModel().getColumn(4).setMaxWidth(80);
        tablaUsuarios.getColumnModel().getColumn(4).setMinWidth(80);
        tablaUsuarios.getColumnModel().getColumn(4).setPreferredWidth(80);
        
        tablaUsuarios.getColumnModel().getColumn(5).setMaxWidth(800);
        tablaUsuarios.getColumnModel().getColumn(5).setMinWidth(80);
        tablaUsuarios.getColumnModel().getColumn(5).setPreferredWidth(80);
        
        tablaUsuarios.getColumnModel().getColumn(6).setMaxWidth(130);
        tablaUsuarios.getColumnModel().getColumn(6).setMinWidth(130);
        tablaUsuarios.getColumnModel().getColumn(6).setPreferredWidth(130);
        
        tablaUsuarios.getColumnModel().getColumn(7).setMaxWidth(100);
        tablaUsuarios.getColumnModel().getColumn(7).setMinWidth(100);
        tablaUsuarios.getColumnModel().getColumn(7).setPreferredWidth(100);
        
        tablaUsuarios.getColumnModel().getColumn(8).setMaxWidth(100);
        tablaUsuarios.getColumnModel().getColumn(8).setMinWidth(100);
        tablaUsuarios.getColumnModel().getColumn(8).setPreferredWidth(100);
        
         tablaUsuarios.getColumnModel().getColumn(8).setMaxWidth(80);
        tablaUsuarios.getColumnModel().getColumn(8).setMinWidth(80);
        tablaUsuarios.getColumnModel().getColumn(8).setPreferredWidth(80);
        
//        
//        tablaEmpresa.getColumnModel().getColumn(10).setMaxWidth(60);
//        tablaEmpresa.getColumnModel().getColumn(10).setMinWidth(60);
//        tablaEmpresa.getColumnModel().getColumn(10).setPreferredWidth(60);

        tablaUsuarios.setRowHeight(33);
    }
     
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        btnNuevo = new javax.swing.JButton();
        jPanel2 = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        jScrollPane1 = new javax.swing.JScrollPane();
        tablaUsuarios = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 && colIndex != 3 
                && colIndex != 4 && colIndex != 5 && colIndex != 6 && colIndex != 7
                && colIndex != 8 && colIndex != 9 && colIndex != 10 && colIndex != 11
                && colIndex != 12  ;
            }
        };
        jPanel3 = new javax.swing.JPanel();
        jLabel3 = new javax.swing.JLabel();
        filtro = new javax.swing.JTextField();
        btnActualizar = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(71, 143, 202));
        jLabel1.setText("Usuarios");

        btnNuevo.setBackground(new java.awt.Color(27, 106, 170));
        btnNuevo.setForeground(new java.awt.Color(255, 255, 255));
        btnNuevo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        btnNuevo.setText("Nuevo");
        btnNuevo.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        btnNuevo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnNuevoActionPerformed(evt);
            }
        });

        jPanel2.setBackground(new java.awt.Color(66, 139, 202));

        jLabel2.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("Lista de los usuarios");

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
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        tablaUsuarios.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Id", "#", "Nombre", "<html>Primer<br>Apellido</html>", "<html>Segundo<br>Apellido</html>", "Usuario", "Rol", "Empresa", "Activo", "Editar", "Eliminar"
            }
        ));
        tablaUsuarios.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaUsuariosMouseClicked(evt);
            }
        });
        tablaUsuarios.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyPressed(java.awt.event.KeyEvent evt) {
                tablaUsuariosKeyPressed(evt);
            }
        });
        jScrollPane1.setViewportView(tablaUsuarios);
        if (tablaUsuarios.getColumnModel().getColumnCount() > 0) {
            tablaUsuarios.getColumnModel().getColumn(0).setMinWidth(0);
            tablaUsuarios.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaUsuarios.getColumnModel().getColumn(0).setMaxWidth(0);
            tablaUsuarios.getColumnModel().getColumn(1).setMinWidth(40);
            tablaUsuarios.getColumnModel().getColumn(1).setPreferredWidth(40);
            tablaUsuarios.getColumnModel().getColumn(1).setMaxWidth(40);
        }

        jLabel3.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel3.setText("Buscar: ");

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
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(filtro, javax.swing.GroupLayout.PREFERRED_SIZE, 67, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(41, 41, 41))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(filtro, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel3))
                .addContainerGap())
        );

        btnActualizar.setBackground(new java.awt.Color(27, 106, 170));
        btnActualizar.setForeground(new java.awt.Color(255, 255, 255));
        btnActualizar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/boton-actualizar.png"))); // NOI18N
        btnActualizar.setText("Actualizar");
        btnActualizar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        btnActualizar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnActualizarActionPerformed(evt);
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
                    .addComponent(jPanel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, 864, Short.MAX_VALUE)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 76, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(btnNuevo, javax.swing.GroupLayout.PREFERRED_SIZE, 88, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(btnActualizar, javax.swing.GroupLayout.PREFERRED_SIZE, 95, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addContainerGap())
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btnNuevo, javax.swing.GroupLayout.PREFERRED_SIZE, 38, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnActualizar, javax.swing.GroupLayout.PREFERRED_SIZE, 38, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 314, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(76, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnNuevoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnNuevoActionPerformed
        NuevoPanelUsuarioCli nuevoUsuarioCli = new NuevoPanelUsuarioCli(this,true,this.id_usuario);
        nuevoUsuarioCli.setVisible(true);
    }//GEN-LAST:event_btnNuevoActionPerformed

    private void filtroKeyTyped(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_filtroKeyTyped
        
        filtro.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
               trs.setRowFilter(RowFilter.regexFilter("(?i)"+filtro.getText(), 2));
            }            
        });
        trs = new TableRowSorter(modelUsuarioTabla);
        tablaUsuarios.setRowSorter(trs);
    }//GEN-LAST:event_filtroKeyTyped

    private void tablaUsuariosKeyPressed(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_tablaUsuariosKeyPressed
        
    }//GEN-LAST:event_tablaUsuariosKeyPressed

    private void tablaUsuariosMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaUsuariosMouseClicked
        int columna = tablaUsuarios.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaUsuarios.getRowHeight();
        String idProducto;
        boolean existe = false;

        if (fila < tablaUsuarios.getRowCount() && fila >= 0 && columna < tablaUsuarios.getColumnCount() && columna >= 0) {
            Object value = tablaUsuarios.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("editar")) {
                    int idPersona = Integer.parseInt(String.valueOf(tablaUsuarios.getValueAt(fila, 0)));
                    //System.out.println(idPersona);
                    NuevoPanelUsuarioCli nuevoUsuario = new NuevoPanelUsuarioCli(this,true,this.id_usuario,idPersona);
                    nuevoUsuario.setVisible(true);
                }
            }
        }
    }//GEN-LAST:event_tablaUsuariosMouseClicked

    private void btnActualizarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnActualizarActionPerformed
        int tam = tablaUsuarios.getRowCount();
        for (int i = tam - 1; i >= 0; i--) {
            modelUsuarioTabla.removeRow(i);
        }
        mostrarDatosUsuario();
    }//GEN-LAST:event_btnActualizarActionPerformed

    /**
     * @param args the command line arguments
     */
    

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnActualizar;
    private javax.swing.JButton btnNuevo;
    private javax.swing.JTextField filtro;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable tablaUsuarios;
    // End of variables declaration//GEN-END:variables
}
