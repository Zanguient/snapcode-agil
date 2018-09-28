/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.Color;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import models.RenderTable;
import models.Database;

/**
 *
 * @author AGIL
 */
public class PanelUsuario extends javax.swing.JFrame {
    Database db = new Database();
    DefaultTableModel modelTable;
    public int num ;

    JButton editar;
    ImageIcon imgEditar;
    Icon iconEditar;
    
    JButton eliminar;
    ImageIcon imgEliminar;
    Icon iconEliminar;
    /**
     * Creates new form PanelUsuario
     */
    public PanelUsuario() {
        initComponents();
        setLocationRelativeTo(this);
        
        String[] columnas = {"Id","#","Nombre","Primer Apellido","Segundo Apellido","Nombre de Usuario","Rol","Empresa","Activo","Editar","Eliminar"};
        modelTable = new DefaultTableModel(null, columnas);
        alinearTextoTabla();
            
        tablaUsuarios.setDefaultRenderer(Object.class, new RenderTable());  
        tablaUsuarios.getTableHeader().setBackground(Color.cyan);
        tablaUsuarios.getTableHeader().setForeground(Color.blue);
        tablaUsuarios.setRowHeight(33);
        
        insertarBotones();
        optenerDatos();
    }   

   public void alinearTextoTabla(){
        TableCellRenderer rendererFromHeader = tablaUsuarios.getTableHeader().getDefaultRenderer();
        JLabel headerLabel = (JLabel) rendererFromHeader;
        headerLabel.setHorizontalAlignment(JLabel.CENTER);
    }
   
    public void optenerDatos(){
        ResultSet rs = null;
        num = 1;
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
            "INNER JOIN EMPRESA AS E ON E.ID = U.EMPRESA\n"+
            "WHERE P.ELIMINADO = "+false+" and U.ELIMINADO = "+false;
        
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
                    modelTable.addRow(data);
                }else if (activo == false){
                    id_persona = rs.getInt(1);
                    nombre_persona = rs.getString(2);
                    apellidoP_persona = rs.getString(3);
                    apellidoM_persona = rs.getString(4);
                    nombreUser = rs.getString(5);
                    rol = rs.getString(6);
                    empresa = rs.getString(7);
                    //insertarBotones();
                    Object[] data = {id_persona,num++,nombre_persona,apellidoP_persona,apellidoM_persona,nombreUser,rol,empresa,"<html><span style=' color:RED;'>No<span></html>",editar,eliminar};
                    num++;
                    modelTable.addRow(data);
                }
            }
            tablaUsuarios.setModel(modelTable);    
            tamañoTabla();
           
            
        } catch (Exception e) {
            System.out.println("Error: "+e);
        }
    }
    
    public void tamañoTabla() {
        tablaUsuarios.getColumnModel().getColumn(0).setMaxWidth(0);
        tablaUsuarios.getColumnModel().getColumn(0).setMinWidth(0);
        tablaUsuarios.getColumnModel().getColumn(0).setPreferredWidth(0);

        tablaUsuarios.getColumnModel().getColumn(1).setMaxWidth(30);
        tablaUsuarios.getColumnModel().getColumn(1).setMinWidth(30);
        tablaUsuarios.getColumnModel().getColumn(1).setPreferredWidth(30);

        tablaUsuarios.getColumnModel().getColumn(2).setMaxWidth(80);
        tablaUsuarios.getColumnModel().getColumn(2).setMinWidth(80);
        tablaUsuarios.getColumnModel().getColumn(2).setPreferredWidth(80);

        tablaUsuarios.getColumnModel().getColumn(3).setMaxWidth(100);
        tablaUsuarios.getColumnModel().getColumn(3).setMinWidth(100);
        tablaUsuarios.getColumnModel().getColumn(3).setPreferredWidth(100);

        tablaUsuarios.getColumnModel().getColumn(4).setMaxWidth(110);
        tablaUsuarios.getColumnModel().getColumn(4).setMinWidth(110);
        tablaUsuarios.getColumnModel().getColumn(4).setPreferredWidth(110);
        
        tablaUsuarios.getColumnModel().getColumn(5).setMaxWidth(130);
        tablaUsuarios.getColumnModel().getColumn(5).setMinWidth(130);
        tablaUsuarios.getColumnModel().getColumn(5).setPreferredWidth(130);
        
        tablaUsuarios.getColumnModel().getColumn(6).setMaxWidth(130);
        tablaUsuarios.getColumnModel().getColumn(6).setMinWidth(130);
        tablaUsuarios.getColumnModel().getColumn(6).setPreferredWidth(130);
        
        tablaUsuarios.getColumnModel().getColumn(7).setMaxWidth(100);
        tablaUsuarios.getColumnModel().getColumn(7).setMinWidth(100);
        tablaUsuarios.getColumnModel().getColumn(7).setPreferredWidth(100);
        
        tablaUsuarios.getColumnModel().getColumn(8).setMaxWidth(100);
        tablaUsuarios.getColumnModel().getColumn(8).setMinWidth(100);
        tablaUsuarios.getColumnModel().getColumn(8).setPreferredWidth(100);
//        
//        tablaEmpresa.getColumnModel().getColumn(10).setMaxWidth(60);
//        tablaEmpresa.getColumnModel().getColumn(10).setMinWidth(60);
//        tablaEmpresa.getColumnModel().getColumn(10).setPreferredWidth(60);
    }
    
    public void insertarBotones(){
        tablaUsuarios.setDefaultRenderer(Object.class, new RenderTable());
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
    
    public int obtenerIdPersona(int id_usuario){
        int id_persona = 0;
        ResultSet rs = null;
        try {
            rs = db.seleccionar("SELECT PERSONA FROM USUARIO WHERE ID = "+id_usuario);
            while (rs.next()) {                            
                id_persona = rs.getInt(1);
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
        return id_persona;
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
        tablaUsuarios = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 && colIndex != 3 
                && colIndex != 4 && colIndex != 5 && colIndex != 6 && colIndex != 7
                && colIndex != 8 && colIndex != 9 && colIndex != 10 && colIndex != 11
                && colIndex != 12  ;
            }
        };
        actualizar = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 0, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(71, 143, 202));
        jLabel1.setText("USUARIOS");

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

        jLabel2.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("Lista De Usuarios");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addComponent(jLabel2, javax.swing.GroupLayout.PREFERRED_SIZE, 519, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 436, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jLabel2, javax.swing.GroupLayout.DEFAULT_SIZE, 30, Short.MAX_VALUE)
        );

        tablaUsuarios.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null, null, null, null, null, null, null},
                {null, null, null, null, null, null, null, null, null, null},
                {null, null, null, null, null, null, null, null, null, null},
                {null, null, null, null, null, null, null, null, null, null}
            },
            new String [] {
                "Id", "#", "Nombre", "Primer  Apellido", "Segundo Apellido", "Nombre Usuario", "Rol", "Empresa", "Activo", "Acciones"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                false, false, false, false, false, false, false, false, true, false
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        tablaUsuarios.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaUsuariosMouseClicked(evt);
            }
        });
        jScrollPane1.setViewportView(tablaUsuarios);
        if (tablaUsuarios.getColumnModel().getColumnCount() > 0) {
            tablaUsuarios.getColumnModel().getColumn(0).setMinWidth(0);
            tablaUsuarios.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaUsuarios.getColumnModel().getColumn(0).setMaxWidth(0);
            tablaUsuarios.getColumnModel().getColumn(1).setResizable(false);
            tablaUsuarios.getColumnModel().getColumn(1).setPreferredWidth(30);
            tablaUsuarios.getColumnModel().getColumn(2).setResizable(false);
            tablaUsuarios.getColumnModel().getColumn(3).setResizable(false);
            tablaUsuarios.getColumnModel().getColumn(4).setResizable(false);
            tablaUsuarios.getColumnModel().getColumn(5).setResizable(false);
            tablaUsuarios.getColumnModel().getColumn(6).setResizable(false);
            tablaUsuarios.getColumnModel().getColumn(7).setResizable(false);
            tablaUsuarios.getColumnModel().getColumn(8).setResizable(false);
            tablaUsuarios.getColumnModel().getColumn(9).setResizable(false);
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

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jScrollPane1)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 106, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 94, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(36, 36, 36)
                                .addComponent(actualizar, javax.swing.GroupLayout.PREFERRED_SIZE, 95, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addContainerGap())
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addGap(18, 18, 18)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 44, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(actualizar, javax.swing.GroupLayout.PREFERRED_SIZE, 44, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 265, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(85, Short.MAX_VALUE))
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
        NuevoAdminUsuarioUI nuevoUsuario = new NuevoAdminUsuarioUI(this,true);
        nuevoUsuario.setVisible(true);
    }//GEN-LAST:event_jButton1ActionPerformed

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
                    int id = Integer.parseInt(String.valueOf(tablaUsuarios.getValueAt(fila, 0)));
                    NuevoAdminUsuarioUI nuevoUsuario = new NuevoAdminUsuarioUI(this,true,id);
                    nuevoUsuario.setVisible(true);
                }
                if (botonAccion.getName().equals("eliminar")) {
                    
                    int id = Integer.parseInt(String.valueOf(tablaUsuarios.getValueAt(fila, 0)));
                    String nombre = String.valueOf(tablaUsuarios.getValueAt(fila, 2));
                    String apellido = String.valueOf(tablaUsuarios.getValueAt(fila, 3));
                    
                    int resp = JOptionPane.showConfirmDialog(this, "<html>Desea eliminar al<br>usuario "+nombre+""+apellido+"?</html>", "Alerta!", JOptionPane.YES_NO_OPTION, JOptionPane.ERROR_MESSAGE);
                    if (resp == 0) {
                        int num = 1;               
                        modelTable.removeRow(fila);
                        
                        for (int i = 0; i < tablaUsuarios.getRowCount(); i++) {
                            tablaUsuarios.setValueAt(num, fila, 1);
                            num++;
                        }
                        String elimUsuSuc = "UPDATE USUARIO_SUCURSAL SET ELIMINADO = "+true+" WHERE USUARIO = "+id;
                        db.insertar(elimUsuSuc);

                        /*String elimUsuApli = "DELETE FROM APP.USUARIO_APLICACION WHERE USUARIO = "+id;
                        db.eliminarProductos(elimUsuApli);*/

                        String elimUsuRol = "UPDATE USUARIO_ROL SET ELIMINADO = "+true+" WHERE USUARIO = "+id;
                        db.insertar(elimUsuRol);

                        int id_persona = obtenerIdPersona(id);
                        String elimPerso = "UPDATE PERSONA SET ELIMINADO = "+true+" WHERE ID = "+id_persona;
                        db.eliminarProductos(elimPerso);

                        String elimUsua = "UPDATE USUARIO SET ELIMINADO = "+true+" WHERE ID = "+id;
                        db.eliminarProductos(elimUsua);
                    }
                }
            }
        }
    }//GEN-LAST:event_tablaUsuariosMouseClicked

    private void actualizarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_actualizarActionPerformed
        int tam = tablaUsuarios.getRowCount();
        for (int i = tam - 1; i >= 0; i--) {
            modelTable.removeRow(i);
        }
        optenerDatos();
    }//GEN-LAST:event_actualizarActionPerformed

    /**
     * @param args the command line arguments
     */

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton actualizar;
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable tablaUsuarios;
    // End of variables declaration//GEN-END:variables
}
