/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import java.awt.Desktop;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.ResultSet;
import java.util.ArrayList;
import javax.imageio.ImageIO;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import models.Database;
import models.RenderTable;
import modelo_Productos.*;

/**
 *
 * @author AGIL
 */
public class Productos extends javax.swing.JFrame {
    public int id_usuario;
    public Database db = new Database();
    DefaultTableModel modeloTabla;
    
    public JButton editar;
    public ImageIcon imgEditar;
    public Icon iconEditar;
    
    public JButton eliminar;
    public ImageIcon imgEliminar;
    public Icon iconEliminar;
    
    public JButton Noeditar;
    public ImageIcon imgNoEditar;
    public Icon iconNoEditar;
    
    public JButton Noeliminar;
    public ImageIcon imgNoEliminar;
    public Icon iconNoEliminar;
    
    public int num ;
    
    public boolean nuevo;
    public boolean modificar;
    public boolean borrar;
    
    /**
     * Creates new form Productos
     */
    public Productos(boolean nuevo,boolean modificar,boolean borrar,int id_usuario) {
        initComponents();
        setLocationRelativeTo(this);
        btnNuevo.setVisible(nuevo);
        this.modificar = modificar;
        this.eliminar = eliminar;
        this.id_usuario = id_usuario;       
        String[] columnas = {"Id","N°","Publicacion Panel","Activar Inventario","Codigo","Nombre","Imagen","Unid.Medida","Precio Unit.","Invent.Minimo","Descripcion","Grupo","SubGrupo","Editar","Eliminar"};
        // modeloTabla = new DefaultTableModel(null, columnas);
        //modeloTabla = new DefaultTableModel(null,columnas);
        modeloTabla = (DefaultTableModel)tablaProducto.getModel();

        tablaProducto.setDefaultRenderer(Object.class, new RenderTable());
        insertarBotones(); 
        
        obtenerDatos();
    }

    public void obtenerDatos(){
        ResultSet rs = null;
        ArrayList<listarProductos> productos = new ArrayList();
        int id;
        boolean publi_panel ;
        boolean activar_inventario ;
        String codigo;
        String nombre;
        String unidadMedida;
        double precioUnit;
        int inventMinimo;
        String descripcion;
        int grupo;
        int subGrupo;
        String imagen;
        int num = 1;
        
        String consulta = "SELECT P.ID,P.PUBLICAR_PANEL,P.ACTIVAR_INVENTARIO,P.CODIGO,P.NOMBRE,P.UNIDAD_MEDIDA,P.PRECIO_UNITARIO,P.INVENTARIO_MINIMO,P.DESCRIPCION,P.GRUPO,P.SUBGRUPO, P.IMAGEN \n" +
            "FROM USUARIO AS U\n" +
            "INNER JOIN PRODUCTO AS P ON P.EMPRESA = U.EMPRESA\n" +
            "WHERE U.ID = "+this.id_usuario+" AND P.ELIMINADO = "+false+" AND U.ELIMINADO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                id = rs.getInt(1);
                publi_panel = rs.getBoolean(2);
                activar_inventario = rs.getBoolean(3);
                codigo = rs.getString(4);
                nombre = rs.getString(5);
                unidadMedida = rs.getString(6);
                precioUnit = rs.getDouble(7);
                inventMinimo = rs.getInt(8);
                descripcion = rs.getString(9);
                grupo = rs.getInt(10);
                subGrupo = rs.getInt(11);
                imagen = rs.getString(12);
                
                listarProductos lista = new listarProductos(id, new Boolean(publi_panel) , activar_inventario, codigo, nombre, unidadMedida, precioUnit, inventMinimo, descripcion, grupo, subGrupo, imagen);
                productos.add(lista);
                
                
            }                   
        } catch (Exception e) {
            System.out.println("Error al seleccionar los productos "+e);
        }       
        String nombre_grupo = "";
        String nombre_subGrupo = "";
        String imag = "";
        ImageIcon img ;
        Icon imgIcon ;
        for (int i = 0; i < productos.size(); i++) {
                id = productos.get(i).getId();
                publi_panel = productos.get(i).isPubli_panel();
                activar_inventario = productos.get(i).isActivar_inventario();
                codigo = productos.get(i).getCodigo();
                nombre = productos.get(i).getNombre();
                unidadMedida = productos.get(i).getUnidadMedida();
                precioUnit = productos.get(i).getPrecioUnit();
                inventMinimo = productos.get(i).getInventMinimo();
                descripcion = productos.get(i).getDescripcion();
                nombre_grupo = obtenerNombreGrupo(productos.get(i).getGrupo());
                nombre_subGrupo = obtenerNombreSubGrupo(productos.get(i).getSubGrupo());
                imag = productos.get(i).getImagen();
                img = /*new ImageIcon(this.getClass().getResource(imag)); */ new ImageIcon(imag); 
                imgIcon = new ImageIcon(img.getImage().getScaledInstance(32, 32, 1));
                
                if (this.modificar == false && this.borrar == false) {
                    Object[] dato = {id,num,publi_panel,activar_inventario,codigo,nombre,new JLabel(imgIcon),unidadMedida, precioUnit,inventMinimo,descripcion,nombre_grupo,nombre_subGrupo,Noeditar,Noeliminar};
                    num++;
                    modeloTabla.addRow(dato);
                }else if (this.modificar == false) {
                    Object[] dato = {id,num,publi_panel,activar_inventario,codigo,nombre,new JLabel(imgIcon),unidadMedida, precioUnit,inventMinimo,descripcion,nombre_grupo,nombre_subGrupo,Noeditar,eliminar};
                    num++;
                    modeloTabla.addRow(dato);
                }else if (this.borrar == false) {
                    Object[] dato = {id,num,publi_panel,activar_inventario,codigo,nombre,new JLabel(imgIcon),unidadMedida, precioUnit,inventMinimo,descripcion,nombre_grupo,nombre_subGrupo,editar,Noeliminar};
                    num++;
                    modeloTabla.addRow(dato);
                }else{
                    Object[] dato = {id,num,publi_panel,activar_inventario,codigo,nombre,new JLabel(imgIcon),unidadMedida, precioUnit,inventMinimo,descripcion,nombre_grupo,nombre_subGrupo,editar,eliminar};
                    num++;
                    modeloTabla.addRow(dato);
                }
        }
        tablaProducto.setModel(modeloTabla);
    }
    
    public String obtenerNombreSubGrupo(int id_SubGrupo){
        String nombre = "";
        ResultSet rs = null;
        try {
            String consulta = "SELECT NOMBRE FROM CLASE WHERE ID = "+id_SubGrupo;
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                nombre = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener los nombres de los sub grupos "+e);
        }
        return nombre;
    }
     
    public String obtenerNombreGrupo(int id_grupo){
        String nombre = "";
        ResultSet rs = null;
        try {
            String consulta = "SELECT NOMBRE FROM TIPO WHERE ID = "+id_grupo;
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                nombre = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener los nombres de grupos "+e);
        }
        return nombre;
    }
    
    public void tamañoTabla() {
        tablaProducto.getColumnModel().getColumn(0).setMaxWidth(0);
        tablaProducto.getColumnModel().getColumn(0).setMinWidth(0);
        tablaProducto.getColumnModel().getColumn(0).setPreferredWidth(0);
        
        /*tablaProductosBase.getColumnModel().getColumn(1).setMaxWidth(120);
        tablaProductosBase.getColumnModel().getColumn(1).setMinWidth(120);
        tablaProductosBase.getColumnModel().getColumn(1).setPreferredWidth(120);

        tablaProductosBase.getColumnModel().getColumn(2).setMaxWidth(120);
        tablaProductosBase.getColumnModel().getColumn(2).setMinWidth(120);
        tablaProductosBase.getColumnModel().getColumn(2).setPreferredWidth(120);

        tablaProductosBase.getColumnModel().getColumn(3).setMaxWidth(60);
        tablaProductosBase.getColumnModel().getColumn(3).setMinWidth(60);
        tablaProductosBase.getColumnModel().getColumn(3).setPreferredWidth(60);

        tablaProductosBase.getColumnModel().getColumn(4).setMaxWidth(60);
        tablaProductosBase.getColumnModel().getColumn(4).setMinWidth(60);
        tablaProductosBase.getColumnModel().getColumn(4).setPreferredWidth(60);*/
    }
    
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
        
        String imgNoEdit = "/imagen/noeditar.png";
        imgNoEditar = new ImageIcon(this.getClass().getResource(imgNoEdit));
        iconNoEditar = new ImageIcon(imgNoEditar.getImage().getScaledInstance(20, 20, 1));
        Noeditar = new JButton(iconNoEditar);
        Noeditar.setName("NoEditar");
        
        String imgNoElim = "/imagen/delete.png";
        imgNoEliminar = new ImageIcon(this.getClass().getResource(imgNoElim));
        iconNoEliminar = new ImageIcon(imgNoEliminar.getImage().getScaledInstance(20, 20, 1));
        Noeliminar = new JButton(iconNoEliminar);
        Noeliminar.setName("Noeliminar");
        
        tablaProducto.setRowHeight(33);
    }
    
    public void limpiar(){
        int tam = tablaProducto.getRowCount();
        for (int i = tam - 1; i >=0; i--) {
            modeloTabla.removeRow(i);
        }
        obtenerDatos();
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

        jPanel4 = new javax.swing.JPanel();
        btnNuevo = new javax.swing.JButton();
        jLabel1 = new javax.swing.JLabel();
        jPanel1 = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        jPanel2 = new javax.swing.JPanel();
        jLabel3 = new javax.swing.JLabel();
        filtro = new javax.swing.JTextField();
        jScrollPane1 = new javax.swing.JScrollPane();
        tablaProducto = new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1  
                && colIndex != 4 && colIndex != 5
                && colIndex != 6 && colIndex != 7 && colIndex != 8
                && colIndex != 9 && colIndex != 10 && colIndex != 11
                && colIndex != 12 && colIndex != 13 && colIndex != 14
                && colIndex != 15;
            }
        };
        actualizar = new javax.swing.JButton();
        AbrirImportar = new javax.swing.JButton();
        ejemplo = new javax.swing.JButton();
        AbrirExportacion = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);

        jPanel4.setBackground(new java.awt.Color(255, 255, 255));

        btnNuevo.setBackground(new java.awt.Color(27, 106, 170));
        btnNuevo.setFont(new java.awt.Font("Arial", 1, 11)); // NOI18N
        btnNuevo.setForeground(new java.awt.Color(255, 255, 255));
        btnNuevo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/addition-white.png"))); // NOI18N
        btnNuevo.setText("Nuevo");
        btnNuevo.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        btnNuevo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnNuevoActionPerformed(evt);
            }
        });

        jLabel1.setFont(new java.awt.Font("Arial", 1, 14)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(48, 126, 204));
        jLabel1.setText("PRODUCTOS");

        jPanel1.setBackground(new java.awt.Color(48, 126, 204));

        jLabel2.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("Lista de Productos");

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addComponent(jLabel2)
                .addGap(0, 0, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel2)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jLabel3.setFont(new java.awt.Font("Arial", 0, 11)); // NOI18N
        jLabel3.setText("Search:");

        filtro.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                filtroKeyReleased(evt);
            }
        });

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jLabel3)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(filtro, javax.swing.GroupLayout.PREFERRED_SIZE, 64, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(20, 20, 20))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel3)
                    .addComponent(filtro, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap())
        );

        tablaProducto.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "ID", "N°", "Publicar Panel", "Activar Inventario", "Codigo", "Nombre", "Imagen", "Unid.Medidal", "Precio Unit.", "Invent. Minimo", "Descripcion", "Grupo", "SubGrupo", "Editar", "Eliminar"
            }
        ) {
            Class[] types = new Class [] {
                java.lang.Object.class, java.lang.Object.class, java.lang.Boolean.class, java.lang.Boolean.class, java.lang.Object.class, java.lang.Object.class, java.lang.Object.class, java.lang.Object.class, java.lang.Object.class, java.lang.Object.class, java.lang.Object.class, java.lang.Object.class, java.lang.Object.class, java.lang.Object.class, java.lang.Object.class
            };

            public Class getColumnClass(int columnIndex) {
                return types [columnIndex];
            }
        });
        tablaProducto.setFillsViewportHeight(true);
        tablaProducto.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tablaProductoMouseClicked(evt);
            }
            public void mousePressed(java.awt.event.MouseEvent evt) {
                tablaProductoMousePressed(evt);
            }
            public void mouseReleased(java.awt.event.MouseEvent evt) {
                tablaProductoMouseReleased(evt);
            }
        });
        jScrollPane1.setViewportView(tablaProducto);
        if (tablaProducto.getColumnModel().getColumnCount() > 0) {
            tablaProducto.getColumnModel().getColumn(0).setMinWidth(0);
            tablaProducto.getColumnModel().getColumn(0).setPreferredWidth(0);
            tablaProducto.getColumnModel().getColumn(0).setMaxWidth(0);
            tablaProducto.getColumnModel().getColumn(1).setMinWidth(30);
            tablaProducto.getColumnModel().getColumn(1).setPreferredWidth(30);
            tablaProducto.getColumnModel().getColumn(1).setMaxWidth(30);
        }

        actualizar.setBackground(new java.awt.Color(27, 106, 170));
        actualizar.setFont(new java.awt.Font("Arial", 1, 11)); // NOI18N
        actualizar.setForeground(new java.awt.Color(255, 255, 255));
        actualizar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/boton-actualizar.png"))); // NOI18N
        actualizar.setText("Actualizar");
        actualizar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        actualizar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                actualizarActionPerformed(evt);
            }
        });

        AbrirImportar.setBackground(new java.awt.Color(27, 106, 170));
        AbrirImportar.setFont(new java.awt.Font("Arial", 1, 11)); // NOI18N
        AbrirImportar.setForeground(new java.awt.Color(255, 255, 255));
        AbrirImportar.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/subir.png"))); // NOI18N
        AbrirImportar.setText("Importar");
        AbrirImportar.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        AbrirImportar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                AbrirImportarActionPerformed(evt);
            }
        });

        ejemplo.setBackground(new java.awt.Color(27, 106, 170));
        ejemplo.setFont(new java.awt.Font("Arial", 1, 11)); // NOI18N
        ejemplo.setForeground(new java.awt.Color(255, 255, 255));
        ejemplo.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/excel.png"))); // NOI18N
        ejemplo.setText("Ejemplo Importacion");
        ejemplo.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        ejemplo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                ejemploActionPerformed(evt);
            }
        });

        AbrirExportacion.setBackground(new java.awt.Color(27, 106, 170));
        AbrirExportacion.setFont(new java.awt.Font("Arial", 1, 11)); // NOI18N
        AbrirExportacion.setForeground(new java.awt.Color(255, 255, 255));
        AbrirExportacion.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/exportar.png"))); // NOI18N
        AbrirExportacion.setText("Exportar");
        AbrirExportacion.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(66, 139, 202)));
        AbrirExportacion.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                AbrirExportacionActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 970, Short.MAX_VALUE)
                    .addGroup(jPanel4Layout.createSequentialGroup()
                        .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel1)
                            .addGroup(jPanel4Layout.createSequentialGroup()
                                .addComponent(btnNuevo, javax.swing.GroupLayout.PREFERRED_SIZE, 77, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(actualizar, javax.swing.GroupLayout.PREFERRED_SIZE, 97, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(AbrirImportar, javax.swing.GroupLayout.PREFERRED_SIZE, 97, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(ejemplo, javax.swing.GroupLayout.PREFERRED_SIZE, 157, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(AbrirExportacion, javax.swing.GroupLayout.PREFERRED_SIZE, 97, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addContainerGap())
        );
        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addGap(18, 18, 18)
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(actualizar, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(AbrirImportar, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(ejemplo, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(AbrirExportacion, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(btnNuevo, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 279, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(49, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel4, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel4, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnNuevoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnNuevoActionPerformed
        NuevoProducto nuevoProducto = new NuevoProducto(this,true,this.id_usuario);
        nuevoProducto.setVisible(true);
    }//GEN-LAST:event_btnNuevoActionPerformed

    private void tablaProductoMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaProductoMouseClicked
        int columna = tablaProducto.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaProducto.getRowHeight();

        if (fila < tablaProducto.getRowCount() && fila >= 0 && columna < tablaProducto.getColumnCount() && columna >= 0) {
            Object value = tablaProducto.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                    JButton botonAccion = (JButton) value;

                if(botonAccion.getName().equals("editar")) {
                    int id_producto = (int)tablaProducto.getValueAt(fila, 0);
                    NuevoProducto editarProducto = new NuevoProducto(this,true,id_producto,id_usuario);
                    editarProducto.setVisible(true);
                }
                if(botonAccion.getName().equals("eliminar")){
                    ResultSet rs = null;
                    int id = Integer.parseInt(String.valueOf(tablaProducto.getValueAt(fila, 0)));
                    String nombre = String.valueOf(tablaProducto.getValueAt(fila, 5));
                    int resp = JOptionPane.showConfirmDialog(this, "<html>Desea eliminar el<br>producto "+nombre+"?</html>", "Alerta!", JOptionPane.YES_NO_OPTION, JOptionPane.ERROR_MESSAGE);

                    if(resp == 0){
                        modeloTabla.removeRow(fila);
                        num = 1;
                        for (int i = 0; i < tablaProducto.getRowCount(); i++) {
                            tablaProducto.setValueAt(num, i, 0);
                            num++;
                        }

                        String eliminarProducto = "UPDATE APP.PRODUCTO SET ELIMINADO = "+true+" WHERE ID = "+id;
                        db.insertar(eliminarProducto);

                        String consulta = "SELECT * FROM PRODUCTO_BASE WHERE PRODUCTO = "+id;
                        rs = db.seleccionar(consulta);
                        try {
                            if (rs.next()) {
                                String eliminarProdBase = "UPDATE APP.PRODUCTO_BASE SET ELIMINADO = "+true+" WHERE PRODUCTO = "+id;
                                db.insertar(eliminarProdBase);
                            }
                        } catch (Exception e) {
                            System.out.println("Error al eliminar producto "+e);
                        }
                    }
                   
                }
               
            }
        }
    }//GEN-LAST:event_tablaProductoMouseClicked

    private void actualizarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_actualizarActionPerformed
       limpiar();
    }//GEN-LAST:event_actualizarActionPerformed

    private void filtroKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_filtroKeyReleased
       ResultSet rs = null;
       
       ArrayList<listarProductos> productos = new ArrayList();
        int id;
        boolean publi_panel ;
        boolean activar_inventario ;
        String codigo;
        String nombre;
        String unidadMedida;
        double precioUnit;
        int inventMinimo;
        String descripcion;
        int grupo;
        int subGrupo;
        String imagen;
        int num = 1;
        String dato = "";
        if (!filtro.getText().equals("")) {
            dato = filtro.getText().trim();
            String consulta = "SELECT P.ID,P.PUBLICAR_PANEL,P.ACTIVAR_INVENTARIO,P.CODIGO,P.NOMBRE,P.IMAGEN,P.UNIDAD_MEDIDA,P.PRECIO_UNITARIO, \n" +
             "P.INVENTARIO_MINIMO,P.DESCRIPCION,P.GRUPO,P.SUBGRUPO\n" +
             "FROM USUARIO AS  U\n" +
             "INNER JOIN PRODUCTO AS P ON P.EMPRESA = U.EMPRESA\n" +
             "WHERE U.ID = "+this.id_usuario+" AND LOWER(P.NOMBRE) LIKE '%"+dato+"%'";
            try {
                rs = db.seleccionar(consulta);
                while(rs.next()){
                    id = rs.getInt(1);
                    publi_panel = rs.getBoolean(2);
                    activar_inventario = rs.getBoolean(3);
                    codigo = rs.getString(4);
                    nombre = rs.getString(5);
                    imagen = rs.getString(6);
                    unidadMedida = rs.getString(7);
                    precioUnit = rs.getDouble(8);
                    inventMinimo = rs.getInt(9);
                    descripcion = rs.getString(10);
                    grupo = rs.getInt(11);
                    subGrupo = rs.getInt(12);
                    

                    listarProductos lista = new listarProductos(id, publi_panel, activar_inventario, codigo, nombre, unidadMedida, precioUnit, inventMinimo, descripcion, grupo, subGrupo, imagen);
                    productos.add(lista);
                }
            } catch (Exception e) {
               System.out.println("Error al fitrar los productos "+e);
            }
            
            int tam = tablaProducto.getRowCount();
            for (int i = tam - 1; i >=0; i--) {
                modeloTabla.removeRow(i);
            }
            String nombre_grupo = "";
            String nombre_subGrupo = "";

            for (int i = 0; i < productos.size(); i++) {
                   
                    id = productos.get(i).getId();
                    publi_panel = productos.get(i).isPubli_panel();
                    activar_inventario = productos.get(i).isActivar_inventario();
                    codigo = productos.get(i).getCodigo();
                    nombre = productos.get(i).getNombre();
                    unidadMedida = productos.get(i).getUnidadMedida();
                    precioUnit = productos.get(i).getPrecioUnit();
                    inventMinimo = productos.get(i).getInventMinimo();
                    descripcion = productos.get(i).getDescripcion();
                    nombre_grupo = obtenerNombreGrupo(productos.get(i).getGrupo());
                    nombre_subGrupo = obtenerNombreSubGrupo(productos.get(i).getSubGrupo());
                    ImageIcon img = new ImageIcon(productos.get(i).getImagen());
                    Icon imgIcon = new ImageIcon(img.getImage().getScaledInstance(32, 32, 1));

                    Object[] datos = {id,num,publi_panel,activar_inventario,codigo,nombre,new JLabel(imgIcon),unidadMedida, precioUnit,inventMinimo,descripcion,nombre_grupo,nombre_subGrupo,editar,eliminar};
                    num++;
                    modeloTabla.addRow(datos);
            }
            tablaProducto.setModel(modeloTabla);
       }else{
            limpiar();
        
        }
    }//GEN-LAST:event_filtroKeyReleased

    private void tablaProductoMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaProductoMousePressed

    }//GEN-LAST:event_tablaProductoMousePressed

    private void tablaProductoMouseReleased(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tablaProductoMouseReleased
        int columna = tablaProducto.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tablaProducto.getRowHeight();

        if (fila < tablaProducto.getRowCount() && fila >= 0 && columna < tablaProducto.getColumnCount() && columna >= 0) {
            Object value = tablaProducto.getValueAt(fila, columna);
            
            if (value instanceof Boolean) {
                
                if (columna == 2) {
                    boolean panel = Boolean.valueOf(String.valueOf(tablaProducto.getValueAt(fila, columna)));
                    int id = Integer.parseInt(String.valueOf(tablaProducto.getValueAt(fila, 0)));
                    
                    db.actualizarPanelTabla(id, panel);
                }
                
                if (columna == 3) {
                    boolean panel = Boolean.valueOf(String.valueOf(tablaProducto.getValueAt(fila, columna)));
                    int id = Integer.parseInt(String.valueOf(tablaProducto.getValueAt(fila, 0)));
                    
                    db.actualizarActivarInventaTabla(id, panel);
                }
            }
            
        }
    }//GEN-LAST:event_tablaProductoMouseReleased

    private void AbrirImportarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_AbrirImportarActionPerformed
        ModeloExcel modeloE = new ModeloExcel();
        VistaExcel vistaE = new VistaExcel(this.id_usuario);
        ControladorExcel contraControladorExcel = new ControladorExcel(vistaE, modeloE);
        vistaE.setVisible(true);
        vistaE.setLocationRelativeTo(null);
    }//GEN-LAST:event_AbrirImportarActionPerformed

    private void ejemploActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_ejemploActionPerformed
        abrirarchivo(".\\EjemploFormatos\\excelPrueba2.xlsx");
    }//GEN-LAST:event_ejemploActionPerformed

    private void AbrirExportacionActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_AbrirExportacionActionPerformed
        //ModeloExcel modeloE = new ModeloExcel();
        vistaExportarUI vistaExport = new vistaExportarUI(this.id_usuario);
        //ControladorExcel contraControladorExcel = new ControladorExcel(vistaExport, modeloE);
        vistaExport.setVisible(true);
        vistaExport.setLocationRelativeTo(null);
    }//GEN-LAST:event_AbrirExportacionActionPerformed

    /**
     * @param args the command line arguments
     */
  

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton AbrirExportacion;
    private javax.swing.JButton AbrirImportar;
    private javax.swing.JButton actualizar;
    private javax.swing.JButton btnNuevo;
    private javax.swing.JButton ejemplo;
    private javax.swing.JTextField filtro;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable tablaProducto;
    // End of variables declaration//GEN-END:variables
}
