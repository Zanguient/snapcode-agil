/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.Color;
import java.sql.ResultSet;
import java.util.ArrayList;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import models.Database;
import models.RenderTable;
import modelo_Sucursal.*;

/**
 *
 * @author AGIL
 */
public class Sucursal extends javax.swing.JFrame {
    public Database db = new Database();
    public int id_usuario;
    
    public DefaultTableModel modeloTabla;
    
    public JButton editar;
    public ImageIcon imgEditar;
    public Icon iconEditar;
    
    public JButton Noeditar;
    public ImageIcon imgNoEditar;
    public Icon iconNoEditar;
    
    public JButton eliminar;
    public ImageIcon imgEliminar;
    public Icon iconEliminar;
    
    public JButton Noeliminar;
    public ImageIcon imgNoEliminar;
    public Icon iconNoEliminar;
    
    public JButton correlativo;
    public ImageIcon imgCorrela;
    public Icon iconCorrela;
    
    public boolean modificar;
    public boolean borrar;
    
    public Sucursal(int id_usuario) {
        initComponents();
        setLocationRelativeTo(this);
        this.id_usuario = id_usuario;
        
        String[] columnas = {"Id","Nombre","Nro Sucursal","Dirección","Telefono1","Telefono2","Telefono3","Departamento","Municipio","Editar","Eliminar","Dat.Correlativo"};
        modeloTabla = new DefaultTableModel(null,columnas);
        tablaSucursales.setDefaultRenderer(Object.class, new RenderTable());
        insertarBotones();
        obtenerSucursal();
    }
    
     public Sucursal(boolean crear,boolean modificar,boolean borrar, int id_usuario) {
        initComponents();
        setLocationRelativeTo(this);
        this.id_usuario = id_usuario;
        this.modificar = modificar;
        this.borrar = borrar;
        btnNuevo.setVisible(crear);
        
        String[] columnas = {"Id","Nombre","Nro Sucursal","Dirección","Telefono1","Telefono2","Telefono3","Departamento","Municipio","Editar","Eliminar","<html>Datos<br>Correlativo</html>"};
        modeloTabla = new DefaultTableModel(null,columnas);
        tablaSucursales.setDefaultRenderer(Object.class, new RenderTable());
        
        tablaSucursales.getTableHeader().setPreferredSize(new java.awt.Dimension(0, 33));
        tablaSucursales.setDefaultRenderer(Object.class, new RenderTable());  
        tablaSucursales.getTableHeader().setBackground(Color.cyan);
        tablaSucursales.getTableHeader().setForeground(Color.blue);

        alinearTextoTabla();
        insertarBotones();
        obtenerSucursal();
        
        
    }
      
     
    public void alinearTextoTabla(){
        TableCellRenderer rendererFromHeader = tablaSucursales.getTableHeader().getDefaultRenderer();
        JLabel headerLabel = (JLabel) rendererFromHeader;
        headerLabel.setHorizontalAlignment(JLabel.CENTER);
    }

    public void obtenerSucursal(){
        ResultSet rs = null;
        String nombre;
        int id;
        int numero;
        String direccion;
        String telefono1;
        String telefono2;
        String telefono3;
        String departamento;
        String municipio;

        String consulta = "SELECT S.ID,S.NOMBRE,S.NUMERO,S.DIRECCION,S.TELEFONO1,S.TELEFONO2,S.TELEFONO3,C.NOMBRE,CL.NOMBRE\n" +
            "FROM USUARIO AS U \n" +
            "INNER JOIN SUCURSAL AS S ON S.EMPRESA = U.EMPRESA\n" +
            "LEFT JOIN CLASE AS C ON S.DEPARTAMENTO = C.ID \n" +
            "LEFT JOIN CLASE AS CL ON CL.ID = S.MUNICIPIO\n" +
            "WHERE U.ID = "+this.id_usuario+" AND S.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {     
                id = rs.getInt(1);
                nombre = rs.getString(2);
                numero = rs.getInt(3);
                direccion = rs.getString(4);
                telefono1 = rs.getString(5);
                telefono2 = rs.getString(6);
                telefono3 = rs.getString(7);
                departamento = rs.getString(8);
                municipio = rs.getString(9);
                
                if(this.modificar == false && this.borrar == false){
                    Object[] datos = {id,nombre,numero,direccion,telefono1,telefono2,telefono3,departamento,municipio,Noeditar,Noeliminar,correlativo};
                    modeloTabla.addRow(datos);
                }else if (this.modificar == false) {
                    Object[] datos = {id,nombre,numero,direccion,telefono1,telefono2,telefono3,departamento,municipio,Noeditar,eliminar,correlativo};
                    modeloTabla.addRow(datos);
                }else if (this.borrar == false) {
                    Object[] datos = {id,nombre,numero,direccion,telefono1,telefono2,telefono3,departamento,municipio,editar,Noeliminar,correlativo};
                    modeloTabla.addRow(datos);
                }else{
                    Object[] datos = {id,nombre,numero,direccion,telefono1,telefono2,telefono3,departamento,municipio,editar,eliminar,correlativo};
                    modeloTabla.addRow(datos);
                }
            }
            tablaSucursales.setModel(modeloTabla);
            tamañoTabla();
            
        } catch (Exception e) {
            System.out.println("Error al seleccionar las sucursales "+e);
        }
    }
    
    public void insertarBotones(){
        String imgEdit = "/imagen/editar.png";
        imgEditar = new ImageIcon(this.getClass().getResource(imgEdit));
        iconEditar = new ImageIcon(imgEditar.getImage().getScaledInstance(20, 20, 1));
        editar = new JButton(iconEditar);
        editar.setName("editar");
        
        String imgNoEdit = "/imagen/noeditar.png";
        imgNoEditar = new ImageIcon(this.getClass().getResource(imgNoEdit));
        iconNoEditar = new ImageIcon(imgNoEditar.getImage().getScaledInstance(20, 20, 1));
        Noeditar = new JButton(iconNoEditar);
        Noeditar.setName("NoEditar");
        
        String imgElim = "/imagen/delete.png";
        imgEliminar = new ImageIcon(this.getClass().getResource(imgElim));
        iconEliminar = new ImageIcon(imgEliminar.getImage().getScaledInstance(20, 20, 1));
        eliminar = new JButton(iconEliminar);
        eliminar.setName("eliminar");
        tablaSucursales.setRowHeight(33);
        
        String imgNoElim = "/imagen/delete.png";
        imgNoEliminar = new ImageIcon(this.getClass().getResource(imgNoElim));
        iconNoEliminar = new ImageIcon(imgNoEliminar.getImage().getScaledInstance(20, 20, 1));
        Noeliminar = new JButton(iconNoEliminar);
        Noeliminar.setName("Noeliminar");
        tablaSucursales.setRowHeight(33);
        
        String imgCorre = "/imagen/relacion.png";
        imgCorrela = new ImageIcon(this.getClass().getResource(imgCorre));
        iconCorrela = new ImageIcon(imgCorrela.getImage().getScaledInstance(20, 20, 1));
        correlativo = new JButton(iconCorrela);
        correlativo.setName("correlativo");
        tablaSucursales.setRowHeight(33);
    }
    
    public void tamañoTabla() {
        tablaSucursales.getColumnModel().getColumn(0).setMaxWidth(0);
        tablaSucursales.getColumnModel().getColumn(0).setMinWidth(0);
        tablaSucursales.getColumnModel().getColumn(0).setPreferredWidth(0);
        
        /*tablaSucursales.getColumnModel().getColumn(1).setMaxWidth(100);
        tablaSucursales.getColumnModel().getColumn(1).setMinWidth(100);
        tablaSucursales.getColumnModel().getColumn(1).setPreferredWidth(100);
        
        tablaSucursales.getColumnModel().getColumn(2).setMaxWidth(100);
        tablaSucursales.getColumnModel().getColumn(2).setMinWidth(100);
        tablaSucursales.getColumnModel().getColumn(2).setPreferredWidth(100);
        
        tablaSucursales.getColumnModel().getColumn(3).setMaxWidth(100);
        tablaSucursales.getColumnModel().getColumn(3).setMinWidth(100);
        tablaSucursales.getColumnModel().getColumn(3).setPreferredWidth(100);
        
        tablaSucursales.getColumnModel().getColumn(4).setMaxWidth(80);
        tablaSucursales.getColumnModel().getColumn(4).setMinWidth(80);
        tablaSucursales.getColumnModel().getColumn(4).setPreferredWidth(80);
        
        tablaSucursales.getColumnModel().getColumn(5).setMaxWidth(80);
        tablaSucursales.getColumnModel().getColumn(5).setMinWidth(80);
        tablaSucursales.getColumnModel().getColumn(5).setPreferredWidth(80);
        
        tablaSucursales.getColumnModel().getColumn(6).setMaxWidth(80);
        tablaSucursales.getColumnModel().getColumn(6).setMinWidth(80);
        tablaSucursales.getColumnModel().getColumn(6).setPreferredWidth(80);
        
        tablaSucursales.getColumnModel().getColumn(7).setMaxWidth(100);
        tablaSucursales.getColumnModel().getColumn(7).setMinWidth(100);
        tablaSucursales.getColumnModel().getColumn(7).setPreferredWidth(100);
        
        tablaSucursales.getColumnModel().getColumn(8).setMaxWidth(100);
        tablaSucursales.getColumnModel().getColumn(8).setMinWidth(100);
        tablaSucursales.getColumnModel().getColumn(8).setPreferredWidth(100);
        
        tablaSucursales.getColumnModel().getColumn(9).setMaxWidth(60);
        tablaSucursales.getColumnModel().getColumn(9).setMinWidth(60);
        tablaSucursales.getColumnModel().getColumn(9).setPreferredWidth(60);
        
        tablaSucursales.getColumnModel().getColumn(10).setMaxWidth(60);
        tablaSucursales.getColumnModel().getColumn(10).setMinWidth(60);
        tablaSucursales.getColumnModel().getColumn(10).setPreferredWidth(60);
        
        tablaSucursales.getColumnModel().getColumn(11).setMaxWidth(80);
        tablaSucursales.getColumnModel().getColumn(11).setMinWidth(80);
        tablaSucursales.getColumnModel().getColumn(11).setPreferredWidth(80);*/
    }
    
    public void limpiar(){
        int tam = tablaSucursales.getRowCount();
        for (int i = tam-1; i >= 0; i--) {
            modeloTabla.removeRow(i);
        }
        obtenerSucursal();
    }
    
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        btnNuevo = new javax.swing.JButton();
        jPanel2 = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        jPanel3 = new javax.swing.JPanel();
        jLabel3 = new javax.swing.JLabel();
        filtrar = new javax.swing.JTextField();
        jScrollPane1 = new javax.swing.JScrollPane();
        tablaSucursales = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 2 
                && colIndex != 3 && colIndex != 4 && colIndex != 5
                && colIndex != 6 && colIndex != 7 && colIndex != 8
                && colIndex != 9 && colIndex != 10 && colIndex != 11;
            }
        };
        btnNuevo1 = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(71, 143, 202));
        jLabel1.setText("SUCURSALES");

        btnNuevo.setBackground(new java.awt.Color(27, 106, 170));
        btnNuevo.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        btnNuevo.setForeground(new java.awt.Color(255, 255, 255));
        btnNuevo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        btnNuevo.setText("Nuevo");
        btnNuevo.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(71, 143, 202)));
        btnNuevo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnNuevoActionPerformed(evt);
            }
        });

        jPanel2.setBackground(new java.awt.Color(71, 143, 202));

        jLabel2.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("Lista de Sucursales");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addComponent(jLabel2, javax.swing.GroupLayout.PREFERRED_SIZE, 321, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jLabel2, javax.swing.GroupLayout.DEFAULT_SIZE, 39, Short.MAX_VALUE)
        );

        jLabel3.setText("Search:");

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
                .addComponent(jLabel3)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(filtrar, javax.swing.GroupLayout.PREFERRED_SIZE, 68, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(25, 25, 25))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel3)
                    .addComponent(filtrar, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        tablaSucursales.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Id", "Nombre Sucursal", "Nro. Sucursal", "Dirección", "Teléfono1", "Teléfono2", "Teléfono3", "Departamento", "Municipio", "Editar", "Eliminar", "Dat. Correlativo"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                true, true, true, true, true, false, true, true, true, true, false, true
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        tablaSucursales.setFillsViewportHeight(true);
        tablaSucursales.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaSucursalesMouseClicked(evt);
            }
        });
        jScrollPane1.setViewportView(tablaSucursales);
        if (tablaSucursales.getColumnModel().getColumnCount() > 0) {
            tablaSucursales.getColumnModel().getColumn(0).setMinWidth(0);
            tablaSucursales.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaSucursales.getColumnModel().getColumn(0).setMaxWidth(0);
        }

        btnNuevo1.setBackground(new java.awt.Color(27, 106, 170));
        btnNuevo1.setFont(new java.awt.Font("Arial", 0, 12)); // NOI18N
        btnNuevo1.setForeground(new java.awt.Color(255, 255, 255));
        btnNuevo1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/boton-actualizar.png"))); // NOI18N
        btnNuevo1.setText("Actualizar");
        btnNuevo1.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(71, 143, 202)));
        btnNuevo1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnNuevo1ActionPerformed(evt);
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
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel1)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(btnNuevo, javax.swing.GroupLayout.PREFERRED_SIZE, 81, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 18, 18)
                                .addComponent(btnNuevo1, javax.swing.GroupLayout.PREFERRED_SIZE, 104, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 961, javax.swing.GroupLayout.PREFERRED_SIZE))
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
                    .addComponent(btnNuevo, javax.swing.GroupLayout.PREFERRED_SIZE, 45, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(btnNuevo1, javax.swing.GroupLayout.PREFERRED_SIZE, 45, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 224, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(25, Short.MAX_VALUE))
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

    private void btnNuevoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnNuevoActionPerformed
        NuevaSucursal nuevaSucural = new NuevaSucursal(this,true,id_usuario);
        nuevaSucural.setVisible(true);
    }//GEN-LAST:event_btnNuevoActionPerformed

    private void tablaSucursalesMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaSucursalesMouseClicked
        int columna = tablaSucursales.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaSucursales.getRowHeight();

        if (fila < tablaSucursales.getRowCount() && fila >= 0 && columna < tablaSucursales.getColumnCount() && columna >= 0) {
            Object value = tablaSucursales.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                    JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("editar")) {
                    int id = Integer.parseInt(String.valueOf(tablaSucursales.getValueAt(fila, 0)));
                    String nombre = String.valueOf(tablaSucursales.getValueAt(fila, 1));
                    NuevaSucursal nuevaSucursal = new NuevaSucursal(this,true,id,this.id_usuario);
                    nuevaSucursal.setVisible(true);
                }
                if (botonAccion.getName().equals("eliminar")) {
                    int id = Integer.parseInt(String.valueOf(tablaSucursales.getValueAt(fila, 0)));
                    String nombre = String.valueOf(tablaSucursales.getValueAt(fila, 1));
                    
                    int resp = JOptionPane.showConfirmDialog(null, "<html>Desea eliminar la<br> sucursal "+nombre+"</html>", "Alerta!", JOptionPane.YES_NO_OPTION, JOptionPane.ERROR_MESSAGE);
                    if (resp == 0) {
                        modeloTabla.removeRow(fila);
                        /*String elimiSucDosifi = "DELETE FROM APP.SUCURSAL_ACTIVIDAD_DOSIFICACION WHERE SUCURSAL = "+id;
                        db.eliminarProductos(elimiSucDosifi);*/
                        
                        String elimiSucu = "UPDATE APP.SUCURSAL SET ELIMINADO = "+true+" WHERE ID = "+id;
                        db.insertar(elimiSucu);
                    }     
                } 
                
                if(botonAccion.getName().equals("correlativo")){
                    int id = Integer.parseInt(String.valueOf(tablaSucursales.getValueAt(fila, 0)));
                    
                    SucursalDatosCorrelativos datosCorrelativos = new SucursalDatosCorrelativos(id,id_usuario);
                    datosCorrelativos.setVisible(true);
                }
            }
        }
    }//GEN-LAST:event_tablaSucursalesMouseClicked

    private void filtrarKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_filtrarKeyReleased
        String consulta = "";
        ResultSet rs = null;
        String dato = filtrar.getText().trim();
        int id_clase = 0;
        String nombre;
        int id;
        int numero;
        String direccion;
        String telefono1;
        String telefono2;
        String telefono3;
        String departamento;
        String municipio;
        ArrayList<ListaSucursal> lista = new ArrayList();
        
        if (filtrar.getText().equals("")) {
            limpiar();
        }else{           
            consulta = "SELECT S.ID,S.NOMBRE,S.NUMERO,S.DIRECCION,S.TELEFONO1,S.TELEFONO2,S.TELEFONO3,C.NOMBRE,CL.NOMBRE\n" +
            "FROM USUARIO AS U \n" +
            "INNER JOIN SUCURSAL AS S ON S.EMPRESA = U.EMPRESA\n" +
            "INNER JOIN CLASE AS C ON S.DEPARTAMENTO = C.ID \n" +
            "LEFT JOIN CLASE AS CL ON CL.ID = S.MUNICIPIO\n" +
            "WHERE LOWER(S.NOMBRE) LIKE '%"+dato+"%'";
            rs = db.seleccionar(consulta);
            try {
                while(rs.next()){
                    id = rs.getInt(1);
                    nombre = rs.getString(2);
                    numero = rs.getInt(3);
                    direccion = rs.getString(4);
                    telefono1 = rs.getString(5);
                    telefono2 = rs.getString(6);
                    telefono3 = rs.getString(7);
                    departamento = rs.getString(8);
                    municipio = rs.getString(9);
                    
                    ListaSucursal sucursal = new ListaSucursal(id, nombre, numero, direccion, telefono1, telefono2, telefono3, departamento, municipio);
                    lista.add(sucursal);
                }
                
                int tam = tablaSucursales.getRowCount();
                for (int i = tam - 1; i >= 0; i--) {
                    modeloTabla.removeRow(i);
                }
                
                for (int i = 0; i < lista.size(); i++) {
                    Object[] datos = {lista.get(i).getId(),lista.get(i).getNombre(),lista.get(i).getNumero(),lista.get(i).getDireccion(),lista.get(i).getTelefono1(),lista.get(i).getTelefono2(),lista.get(i).getTelefono3(),lista.get(i).getDepartamento(),lista.get(i).getMunicipio(),editar,eliminar,correlativo};
                    modeloTabla.addRow(datos);
                }
 
                tablaSucursales.setModel(modeloTabla);
                tamañoTabla();
                        
            } catch (Exception e) {
                System.out.println("Error "+e);
            }
        }
    }//GEN-LAST:event_filtrarKeyReleased

    private void btnNuevo1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnNuevo1ActionPerformed
        limpiar();
    }//GEN-LAST:event_btnNuevo1ActionPerformed

    private void filtrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_filtrarActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_filtrarActionPerformed

    /**
     * @param args the command line arguments
     */

    // Variables declaration - do not modify//GEN-BEGIN:variables
    public javax.swing.JButton btnNuevo;
    public javax.swing.JButton btnNuevo1;
    private javax.swing.JTextField filtrar;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable tablaSucursales;
    // End of variables declaration//GEN-END:variables
}
