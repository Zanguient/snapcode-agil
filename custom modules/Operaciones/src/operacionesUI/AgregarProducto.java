/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package operacionesUI;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.*;
import java.net.*;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.util.Date;
import model_detalle_producto.detalleSolicitudProducto;
import model_detalle_producto_base.detalleSolicitudProductoBase;
import model_solicitud.solicitudReposicion;
import models.Database.*;
import models.DatabaseExportacion.*;
import models.*;
//import org.json.simple.JSONArray;
//import org.json.simple.JSONObject;
import org.json.*;



/**
 *
 * @author AGIL
 */
public class AgregarProducto extends javax.swing.JFrame implements ActionListener {

    //Login login = new Login();
    JSONObject datosUsuario;
    int id_usuario;
    int id_solicitud;
    public int id_detalle = 0;
    
    public Database db = new Database();
    public DatabaseExportacion dbExp = new DatabaseExportacion();
    DateFormat df = DateFormat.getDateInstance();
    public String nombreSucursal = null;
    JButtonProducto menu[] = null;
    JButtonProducto containFiltro;

    public ImageIcon img;
    public Icon icon;

    public ImageIcon del;
    public Icon icondel;

    public ImageIcon sub;
    public Icon iconsub;

    JTextField cantProducto;
    DefaultTableModel defaulttable;
    String imgSubtract;
    String imgDelete;
    JButton btn0;
    JButton btn1;
    JButton btn2;
    JButton btn3;
    JButton btn4;

    int id = 1;
    int idDetalle = 1;
    int cant = 1;
    String producto_pb;
    String unidadMedi_pb;
    int cantidadUnid_ideal_pb;
    int cantidadUnid_modif_pb;
    int totalIdeal_pb;
    int totalReal_pb;

    JButtonProducto boton;
    JButtonGrupos actGrupo;

    DefaultTableModel tablaDescripcion;
    JFormattedTextField formato;
    JScrollPane scrollpane;
    JTable jTable1 = new JTable();

    ArrayList<ProductosBase> prodBase = new ArrayList<>();
    ArrayList<ProductoLista> prod = new ArrayList();
    
    ArrayList<solicitudReposicion>arraySolicitud = new ArrayList();
    ArrayList<detalleSolicitudProducto>arrayDetalleProducto = new ArrayList();
    ArrayList<detalleSolicitudProductoBase>arrayDetalleProductoBase = new ArrayList();
    DecimalFormat decimales;

    boolean visible = false;

    /**
     * Creates new form AgregarProducto
     */
    private void InsertSucursal() throws JSONException {
        //int id_usu
        if(getConnectionStatus() == true){
            int IdAutenticar = this.datosUsuario.getJSONObject("data").getInt("id");
            int idEmpresa = obtenerIdEmpresa();
            String url = "/autenticar-sucursales/" + IdAutenticar;

            JSONArray res = RestServer.getJSONArray(url);
            for (int i = 0; i < res.length(); i++) {
                JSONObject data = res.getJSONObject(i);
                String nombre = (String) data.getJSONObject("sucursal").get("nombre").toString();
                int id = data.getInt("id_sucursal");

                db.insertarSucursal(id, nombre, this.id_usuario);
            }
        }
    }

    private void comboSucursal() {
        //db.SeleccionarSucursal();
        //System.out.println(this.id_usuario);
        for (int i = 0; i < db.SeleccionarSucursal(this.id_usuario).size(); i++) {
            //System.out.println("Seleccionado " + db.SeleccionarSucursal(this.id_usuario).get(i).getNombre());
            jcomboBoxSucursal.addItem(db.SeleccionarSucursal(this.id_usuario).get(i).getNombre());
        }
    }

    private void comboSetSucursal(String nom_sucursal) {
        //db.SeleccionarSucursal();
        //System.out.println(this.id_usuario);
        for (int i = 0; i < db.SeleccionarSucursal(this.id_usuario).size(); i++) {
            // System.out.println("Seleccionado "+db.SeleccionarSucursal(this.id_usuario).get(i).getNombre());
            jcomboBoxSucursal.addItem(db.SeleccionarSucursal(this.id_usuario).get(i).getNombre());
        }
        jcomboBoxSucursal.setSelectedItem(nom_sucursal);
    }

    private void InsertarAlmacen() throws JSONException {
        int IdAutenticar = this.datosUsuario.getJSONObject("data").getInt("id");

        String url = "/autenticar-sucursales/" + IdAutenticar;
        int id_almacen = 0;
        JSONArray res = RestServer.getJSONArray(url);

        for (int i = 0; i < res.length(); i++) {
            JSONObject data = res.getJSONObject(i);
            JSONArray almacenes = data.getJSONObject("sucursal").getJSONArray("almacenes");

            for (int j = 0; j < almacenes.length(); j++) {
                JSONObject recorrerAlmacen = almacenes.getJSONObject(j);
                id_almacen = recorrerAlmacen.getInt("id");
                String nombre = recorrerAlmacen.getString("nombre");
                int id_sucursal = (int) recorrerAlmacen.getInt("id_sucursal");
                
                db.InsertAlmacen(id_almacen, nombre, id_sucursal);
            }
        }
    }

    private void InsertarGruposSinRed() {
        ResultSet rs = null;
        ResultSet rsTam = null;
        ResultSet rs2 = null;
        ResultSet rsSuc = null;
        ResultSet rsAlm = null;

        JButtonGrupos grupo[];
        JButtonGrupos lista;
        ArrayList<JButtonGrupos> listado = new ArrayList();
        ArrayList<JButtonGrupos> listaGrupos = new ArrayList();

        int id;
        String nombre;
        int tam = 0;
        int j = 0;
        String almacen = jcomboBoxAlmacen.getSelectedItem().toString();
        String sucursal = jcomboBoxSucursal.getSelectedItem().toString();
        int id_suc = 0;
        int id_alm = 0;
        String consultaSu = "SELECT ID FROM APP.SUCURSAL WHERE ID_USUARIO = " + this.id_usuario;
        rsSuc = db.seleccionarGrupos(consultaSu);
        try {
            while (rsSuc.next()) {
                id_suc = rsSuc.getInt(1);

                String consultaAlm = "SELECT ID FROM ALMACEN WHERE ID_SUCURSAL = " + id_suc;
                rs = db.seleccionarGrupos(consultaAlm);
                while (rs.next()) {
                    id_alm = rs.getInt(1);

                    String consultaPro = "SELECT ID_GRUPO FROM PRODUCTO WHERE ID_ALM = " + id_alm;
                    rsAlm = db.seleccionarGrupos(consultaPro);
                    while (rsAlm.next()) {

                        String consulta = "SELECT ID, NOMBRE FROM GRUPOS WHERE ID = " + rsAlm.getInt(1);
                        rs = db.seleccionarGrupos(consulta);

                        while (rs.next()) {
                            id = rs.getInt(1);
                            nombre = rs.getString(2);

                            lista = new JButtonGrupos(id, nombre, null);
                            listado.add(lista);
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("error " + e);
        }
        int si = 0;
        for (int i = 0; i < listado.size(); i++) {
            if (listaGrupos.size() != 0) {
                for (int k = 0; k < listaGrupos.size(); k++) {
                    if (listado.get(i).getId() == listaGrupos.get(k).getId()) {
                        si++;
                    }
                }
                if (si == 0) {
                    //System.out.println("id " + listado.get(i).getId() + " nombre " + listado.get(i).getNombre());
                    JButtonGrupos listGrupos = new JButtonGrupos(listado.get(i).getId(), listado.get(i).getNombre(), listado.get(i).getNombre());
                    listaGrupos.add(listGrupos);
                    si = 0;
                } else if (si != 0) {
                    si = 0;
                }
            } else {
                JButtonGrupos listGrupos = new JButtonGrupos(listado.get(i).getId(), listado.get(i).getNombre(), listado.get(i).getNombre());
                listaGrupos.add(listGrupos);
            }
        }
        grupo = new JButtonGrupos[listaGrupos.size()];
        for (int i = 0; i < listaGrupos.size(); i++) {

            grupo[i] = new JButtonGrupos(listaGrupos.get(i).getId(), listaGrupos.get(i).getNombre(), listaGrupos.get(i).getNombre());
            grupo[i].setPreferredSize(new Dimension(100, 40));
            grupo[i].setBackground(Color.red);
            grupo[i].setForeground(Color.WHITE);

            grupo[i].addActionListener(new ActionListener() {
                public void actionPerformed(ActionEvent e) {
                    actGrupo = (JButtonGrupos) e.getSource();
                    actionGrupos(actGrupo.getId(), actGrupo.getNombre());
                    //System.out.println("ID "+actGrupo.getId()+" NOMBRE "+actGrupo.getNombre());
                }
            });
            jPanelGrupos.add(grupo[i]);
        }
        pack();
        jPanelGrupos.updateUI();
        jPanelGrupos.setVisible(true);
    }

    private void InsertarGrupos() {
        ResultSet rs = null;
        ResultSet rsTam = null;
        ResultSet rs2 = null;
        ResultSet rsSuc = null;
        ResultSet rsAlm = null;

        JButtonGrupos grupo[];
        JButtonGrupos lista;
        ArrayList<JButtonGrupos> listado = new ArrayList();
        ArrayList<JButtonGrupos> listaGrupos = new ArrayList();

        int id;
        String nombre;
        int tam = 0;
        int j = 0;
        String almacen = jcomboBoxAlmacen.getSelectedItem().toString();
        String sucursal = jcomboBoxSucursal.getSelectedItem().toString();
        int id_suc = 0;
        int id_alm = 0;

        try {
            if (getConnectionStatus() == true) {
                int id_empresa = this.datosUsuario.getJSONObject("data").getInt("id_empresa");
//                System.out.println(id_empresa);
                String url = "/grupos/empresa/" + id_empresa;
                JSONArray res = RestServer.getJSONArray(url);
                for (int i = 0; i < res.length(); i++) {
                    JSONObject data = res.getJSONObject(i);
                    id = data.getInt("id");
                    Object nombres = data.get("nombre");
                    if (nombres.equals(null)) {
//                        System.out.println("Id: "+id+" y nombre "+nombre+" fueron desechados");
                    } else if (nombres.equals("")) {
                        //System.out.println("Id: "+id+" y nombre "+nombre+" fueron desechados");
                    } else {
//                        System.out.println("Id: "+id+" Nombre: "+nombres); 
                        nombre = (String) nombres.toString();
                        db.insertarGrupoEmpresas(id, nombre);
                    }
                }
            }

            String consultaSu = "SELECT ID FROM APP.SUCURSAL WHERE ID_USUARIO = " + this.id_usuario;
            rsSuc = db.seleccionarGrupos(consultaSu);
            try {
                while (rsSuc.next()) {
                    id_suc = rsSuc.getInt(1);

                    String consultaAlm = "SELECT ID FROM ALMACEN WHERE ID_SUCURSAL = " + id_suc;
                    rs = db.seleccionarGrupos(consultaAlm);
                    while (rs.next()) {
                        id_alm = rs.getInt(1);

                        String consultaPro = "SELECT ID_GRUPO FROM PRODUCTO WHERE ID_ALM = " + id_alm;
                        rsAlm = db.seleccionarGrupos(consultaPro);
                        while (rsAlm.next()) {

                            String consulta = "SELECT ID, NOMBRE FROM GRUPOS WHERE ID = " + rsAlm.getInt(1);
                            rs = db.seleccionarGrupos(consulta);

                            while (rs.next()) {
                                id = rs.getInt(1);
                                nombre = rs.getString(2);

                                lista = new JButtonGrupos(id, nombre, null);
                                listado.add(lista);
                            }
                        }
                    }
                }
            } catch (Exception e) {
                System.out.println("error " + e);
            }
            int si = 0;
            for (int i = 0; i < listado.size(); i++) {
                if (listaGrupos.size() != 0) {
                    for (int k = 0; k < listaGrupos.size(); k++) {
                        if (listado.get(i).getId() == listaGrupos.get(k).getId()) {
                            si++;
                        }
                    }
                    if (si == 0) {
                        //System.out.println("id " + listado.get(i).getId() + " nombre " + listado.get(i).getNombre());
                        JButtonGrupos listGrupos = new JButtonGrupos(listado.get(i).getId(), listado.get(i).getNombre(), listado.get(i).getNombre());
                        listaGrupos.add(listGrupos);
                        si = 0;
                    } else if (si != 0) {
                        si = 0;
                    }
                } else {
                    JButtonGrupos listGrupos = new JButtonGrupos(listado.get(i).getId(), listado.get(i).getNombre(), listado.get(i).getNombre());
                    listaGrupos.add(listGrupos);
                }
            }
            grupo = new JButtonGrupos[listaGrupos.size()];
            for (int i = 0; i < listaGrupos.size(); i++) {

                grupo[i] = new JButtonGrupos(listaGrupos.get(i).getId(), listaGrupos.get(i).getNombre(), listaGrupos.get(i).getNombre());
                grupo[i].setPreferredSize(new Dimension(100, 40));
                grupo[i].setBackground(Color.red);
                grupo[i].setForeground(Color.WHITE);

                grupo[i].addActionListener(new ActionListener() {
                    public void actionPerformed(ActionEvent e) {
                        actGrupo = (JButtonGrupos) e.getSource();
                        actionGrupos(actGrupo.getId(), actGrupo.getNombre());
                        //System.out.println("ID "+actGrupo.getId()+" NOMBRE "+actGrupo.getNombre());
                    }
                });
                jPanelGrupos.add(grupo[i]);
            }
            pack();
            jPanelGrupos.updateUI();
            jPanelGrupos.setVisible(true);

        } catch (JSONException ex) {
            System.out.println("Error obtener los grupos: " + ex);
        }
    }
    
    public int obtenerIdAlmacen(String almacen){
        ResultSet rs = null;
        String consulta = "SELECT ID FROM ALMACEN WHERE NOMBRE = '"+almacen+"'";
        int id = 0;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener el almacen: "+e);
        }
        return id;
    }

    public void actionGrupos(int id, String nombre) {
        ResultSet rs = null;
        ResultSet rs1 = null;
        ResultSet rs2 = null;
        ResultSet rs3 = null;
        ResultSet rs4 = null;

        String consulta = "";
        int id_prod = 0;
        int id_alma = 0;

        String nombre_pro = "";
        String unid_medid = "";
        double preci_unit_pro = 0.0;

        String nombre_pb = "";
        String unid_medi_pb = "";
        double cant_uni_ide_pb = 0.0;
        int precio_unit_pb = 0;
        ArrayList<JButtonProducto> producto;
        JButtonProducto listaGrupos[];

        int tam = 0;
        int i = 0;

        int cantidad = 0;

        String almacen = jcomboBoxAlmacen.getSelectedItem().toString();
        String sucursal = jcomboBoxSucursal.getSelectedItem().toString();

        if (!almacen.equals("") && !sucursal.equals("")) {
            try {
                consulta = "SELECT ID FROM SUCURSAL WHERE NOMBRE = '" + sucursal + "'";
                rs = db.selectProductos(consulta);
                while (rs.next()) {
                    id_prod = rs.getInt(1);
                }

                consulta = "SELECT ID FROM ALMACEN WHERE ID_SUCURSAL = " + id_prod + " AND NOMBRE = '" + almacen + "'";
                rs2 = db.seleccionarTodoAlmacen(consulta);
                while (rs2.next()) {
                    id_alma = rs2.getInt(1);
                }

                String consultaTam = "SELECT * FROM PRODUCTO WHERE ID_GRUPO = " + id + " AND ID_ALM = " + id_alma;
                ResultSet rsTam = db.seleccionarGrupos(consultaTam);
                while (rsTam.next()) {
                    tam++;
                }

                consulta = "SELECT ID_PROD, NOMB_PROD,UNID_MEDID,PRECIO_UNIT FROM PRODUCTO WHERE ID_GRUPO = " + id + " AND ID_ALM = " + id_alma;
                rs3 = db.seleccionarGrupos(consulta);
                listaGrupos = new JButtonProducto[tam];
                jPanelMostrar.removeAll();

                while (rs3.next()) {
                    id_prod = rs3.getInt(1);
                    nombre_pro = rs3.getString(2);
                    unid_medid = rs3.getString(3);
                    preci_unit_pro = Double.parseDouble(rs3.getString(4));
                    //System.out.println(" - "+id_prod+" - "+nombre_pro+" - "+unid_medid+" - "+preci_unit_pro);

                    producto = new ArrayList();
                    String consulta2 = "SELECT NOMBRE_PB,UNI_MEDI_PB,CANT_UNI_IDEAL,PRECIO_UNI_PB FROM PRODUCTO_BASE WHERE ID_PRODUCTO = " + id_prod;
                    rs4 = db.selectProductosBase(consulta2);
                    while (rs4.next()) {
                        nombre_pb = rs4.getString(1);
                        unid_medi_pb = rs4.getString(2);
                        cant_uni_ide_pb = Double.parseDouble(rs4.getString(3));
                        precio_unit_pb = rs4.getInt(4);

                        JButtonProducto productoBase = new JButtonProducto(id_prod, nombre_pb, unid_medi_pb, precio_unit_pb, unid_medi_pb, id_alma, sucursal);
                        producto.add(productoBase);
                    }

                    /*ResultSet rscant = db.selectInFiltro("SELECT CANTIDAD  FROM INVENTARIO WHERE ID_PRODUCTO ="+id_prod+" AND ID_ALMACEN = "+id_alma);
                    while (rscant.next()) { 
                        cantidad = rscant.getInt(1);
                        //System.out.println(" cantidad "+rscant.getInt(1));

                    }*/
                    //System.out.println("Id: "+id+" Id Pro "+id_prod+" ID ALM " +id_alma+ " Nombre: "+nomb_prod+" Unidad "+unid_med+" Precio "+prec_unit);           
                    img = new ImageIcon(this.getClass().getResource("/imagen/icon-producto-default.png"));
                    
                    icon = new ImageIcon(img.getImage().getScaledInstance(80, 90, 1));
                    int idAlmacen = obtenerIdAlmacen(almacen);
                    int invCantidad = calcularCantidad(id_prod, idAlmacen);
                    listaGrupos[i] = new JButtonProducto(id_prod, nombre_pro, unid_medid, preci_unit_pro, producto, nombre_pro,invCantidad,i, icon);

                    if (estaActivoInventario(id_prod, idAlmacen) == true) {
                        menu[i].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: "+invCantidad+"</html>");

                    }else{
                        menu[i].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: Ilimitada</html>");      
                    }    
                    listaGrupos[i].setVerticalTextPosition(SwingConstants.BOTTOM);
                    listaGrupos[i].setHorizontalTextPosition(SwingConstants.CENTER);
                    listaGrupos[i].setPreferredSize(new Dimension(100, 150));

                    listaGrupos[i].addActionListener(this);

                    jPanelMostrar.add(listaGrupos[i]);
                    i++;
                }
                pack();
                jPanelMostrar.updateUI();
                jPanelMostrar.setVisible(true);

            } catch (Exception e) {
                System.out.println(e);
            }
        }

    }
    
    public int calcularCantidad(int id,int id_alm){
        ResultSet rs = null;
        int cantidad = 0;
        String consulta = "SELECT CANTIDAD FROM INVENTARIO WHERE ID_PRODUCTO = "+id+" AND ID_ALMACEN = "+id_alm;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                cantidad = cantidad + rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener la cantidad: "+e);
        }
        return cantidad;
    }
    
    public boolean estaActivoInventario(int id,int id_alm){
        ResultSet rs = null;
        boolean activo = false;
        String consulta = "SELECT ACTIVAR_INVENTARIO FROM PRODUCTO WHERE ID_PROD = "+id+" AND ID_ALM = "+id_alm;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                activo = true;
            }
        } catch (Exception e) {
            System.out.println("Error al ver si es un inventario activo: "+e);
        }
        return activo;
    }
    
    private void SeleccionarProductosPanelSinInternet(int id_almacen,boolean estado) {
        int id_producto = 0;
        String nombreProducto = "";
        String unidad_medida = "";
        String precio_unitario = "";
        double prec_unit = 0;
        String nombre_sucursal = "";
        int id_pb = 0;
        String imagen = "";
        int idEmp = 0;
        int tamaño = 0;

        for (int i = 0; i < db.seleccionarIdEmpresa(this.id_usuario).size(); i++) {
            idEmp = db.seleccionarIdEmpresa(this.id_usuario).get(i).getId_empresa();
        }

        int id_prod = 0;
        String nombre = "";
        String uni_med = "";
        double pre_unit = 0.0;
        int i = 0;

        ResultSet rstam = db.selectProductos("SELECT * FROM PRODUCTO WHERE ID_ALM = " + id_almacen);
        try {
            while (rstam.next()) {
                tamaño++;
            }
        } catch (SQLException ex) {
            Logger.getLogger(AgregarProducto.class.getName()).log(Level.SEVERE, null, ex);
        }

        try {
            menu = new JButtonProducto[tamaño];
            ResultSet rs = db.selectProductos("SELECT * FROM PRODUCTO WHERE ID_ALM = "+id_almacen);
            while (rs.next()) {

                id_prod = rs.getInt(2);
                nombre = rs.getString(4);
                uni_med = rs.getString(5);
                pre_unit = Double.parseDouble(rs.getString(6));

                int id_pro = 0;
                String nom_pb = "";
                String uni_med_pb = "";
                int prec_unit_pb = 0;
                String cantUni_ideal_pb = "";
                int id_Pb = 0;
                int cantidad = 0;

                ArrayList<JButtonProducto> productos = new ArrayList();
                ResultSet rs2 = db.selectProductosBase("SELECT * FROM PRODUCTO_BASE WHERE ID_PRODUCTO=" + id_prod);
                while (rs2.next()) {
                    id_pro = rs2.getInt(1);
                    nom_pb = rs2.getString(2);
                    uni_med_pb = rs2.getString(3);
                    cantUni_ideal_pb = rs2.getString(4);
                    prec_unit_pb = rs2.getInt(5);
                    id_Pb = rs2.getInt(6);

                    String consulta = "select s.NOMBRE from sucursal s inner join almacen a on a.ID_SUCURSAL = s.ID where a.ID=" + id_almacen;
                    ResultSet rss = db.SeleccionarSucursalPorId(consulta);
                    while (rss.next()) {
                        nombre_sucursal = rss.getString(1);
                    }
                    JButtonProducto productoBase = new JButtonProducto(id_pro, nom_pb, uni_med_pb, prec_unit_pb, cantUni_ideal_pb, id_almacen, nombre_sucursal);
                    productos.add(productoBase);
                }        
                String imagenIcon = "/imagen/icon-producto-default.png";

                img = new ImageIcon(this.getClass().getResource(imagenIcon));
                icon = new ImageIcon(img.getImage().getScaledInstance(80, 90, 1));
                int invCantidad = calcularCantidad(id_prod, id_almacen);
                
                if (estado == true) {                                
                    if (invCantidad > 0) {
                        menu[i] = new JButtonProducto(id_prod, nombre, uni_med, pre_unit, productos, nombre,invCantidad,i, icon);

                        if (estaActivoInventario(id_prod, id_almacen) == true) {
                            menu[i].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: "+invCantidad+"</html>");

                        }else if (estaActivoInventario(id_prod, id_almacen) == false){
                            menu[i].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: Ilimitada</html>");      
                        }              
                        menu[i].setVerticalTextPosition(SwingConstants.BOTTOM);
                        menu[i].setHorizontalTextPosition(SwingConstants.CENTER);
                        menu[i].setPreferredSize(new Dimension(100, 150));

                        menu[i].addActionListener(this);
                        jPanelMostrar.add(menu[i]);
                        i++;
                    }
                }else if (estado == false) {
                    if (invCantidad == 0) {

                        menu[i] = new JButtonProducto(id_prod, nombre, uni_med, pre_unit, productos, nombre,invCantidad,i, icon);

                        if (estaActivoInventario(id_prod, id_almacen) == true) {
                            menu[i].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: "+invCantidad+"</html>");

                        }else if (estaActivoInventario(id_prod, id_almacen) == false){
                            menu[i].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: Ilimitada</html>");      
                        }              
                        menu[i].setVerticalTextPosition(SwingConstants.BOTTOM);
                        menu[i].setHorizontalTextPosition(SwingConstants.CENTER);
                        menu[i].setPreferredSize(new Dimension(100, 150));

                        menu[i].addActionListener(this);
                        jPanelMostrar.add(menu[i]);
                        i++;
                    }
                }    
            }
        } catch (Exception e) {
            System.out.println("error: " + e.getMessage());
        }
    }

    private void SeleccionarProductosPanel(int id_almacen) {

        int id_alma = 0;
        int id_producto = 0;
        String nombreProducto = "";
        String unidad_medida = "";
        double precio_unitario = 0;
        double prec_unit = 0;
        String nombre_sucursal = "";
        int id_grupo = 0;
        int id_subgrupo = 0;
        String codigo = "";
        int id_pb = 0;
        String imagen = "";
        int idEmp = 0; 
        double utilida_esperada = 0;
        int inventario_minimo = 0;
        boolean activarInventario = false;
        
        for (int i = 0; i < db.seleccionarIdEmpresa(this.id_usuario).size(); i++) {
            idEmp = db.seleccionarIdEmpresa(this.id_usuario).get(i).getId_empresa();
        }     
        
        
        String url = "/productos-panel/empresa/"+idEmp+"/almacen/"+id_almacen+"/user/"+this.id_usuario;
             
        try {
            JSONArray res = RestServer.getJSONArray(url);
     
            int cantiInvetario = 0;
            for (int i = 0; i < res.length(); i++) {
                JSONObject data = res.getJSONObject(i);
      
                id_producto = data.getInt("id");
                nombreProducto = data.getString("nombre");
                unidad_medida = (String) data.get("unidad_medida").toString();
                precio_unitario = (data.get("precio_unitario").toString().equals("null"))? 0:Double.parseDouble(data.get("precio_unitario").toString());
                imagen = data.get("imagen").toString();
                id_alma = id_almacen;
                id_grupo = (data.get("id_grupo").toString().equals("null"))? 0:Integer.parseInt(data.get("id_grupo").toString());
                id_subgrupo = (data.get("id_subgrupo").toString().equals("null"))? 0:Integer.parseInt(data.get("id_subgrupo").toString());
                activarInventario = data.getBoolean("activar_inventario");
                codigo = (data.get("codigo_fabrica").toString().equals("null"))? "":(String)data.get("codigo_fabrica").toString();
                
                db.insertarProductos(id_alma, id_producto, nombreProducto, unidad_medida, precio_unitario, id_grupo, id_subgrupo,activarInventario,codigo);
               
                //Reecorre Inventarios
                JSONArray inventarios = data.getJSONArray("inventarios");
                for (int k = 0; k < inventarios.length(); k++) {
                    int inv_id = 0;
                    int inv_id_alma = 0;
                    int inv_id_pro = 0;
                    int inv_cant = 0;
                    int inv_cost_unit = 0;
                    int inv_cost_to = 0;
                    String inv_lote = "";
                    String inv_fecha_venci = "";
                    String inv_createdAt = "";
                    String inv_updatedAt = "";
                    JSONObject inventario = inventarios.getJSONObject(k);

                    inv_id = inventario.getInt("id");
                    inv_id_alma = inventario.getInt("id_almacen");
                    inv_id_pro = inventario.getInt("id_producto");
                    inv_cant = inventario.getInt("cantidad");
                    cantiInvetario += inv_cant;
                    inv_cost_unit = inventario.getInt("costo_unitario");
                    inv_cost_to = inventario.getInt("costo_total");

                    inv_lote = (String) inventario.get("lote").toString();

                    inv_fecha_venci = (String) inventario.get("fecha_vencimiento").toString();
                    inv_createdAt = (String) inventario.get("createdAt").toString();
                    inv_updatedAt = (String) inventario.get("updatedAt").toString();

                    db.insertarInventario(inv_id, inv_id_alma, inv_id_pro, inv_cant, inv_cost_unit, inv_cost_to, inv_fecha_venci, inv_lote, inv_createdAt, inv_updatedAt);

                }           
                
                //Ingresamos los productos  base             
                JSONArray productosBase = data.getJSONArray("productosBase");

                for (int j = 0; j < productosBase.length(); j++) {
                    JSONObject prodBase = productosBase.getJSONObject(j);
                    
                    int idPB = prodBase.getInt("id");
                    String cantU_ideal_pb = prodBase.get("formulacion").toString();
                    id_pb = (prodBase.get("id_producto_base").toString().equals("null"))? 0:Integer.parseInt(prodBase.get("id_producto_base").toString());
                    

                    if (prodBase.get("productoBase").equals("null") == true) {
                        
                        String nombre_pb = prodBase.getJSONObject("productoBase").getString("nombre");
                        String unid_med_pb = prodBase.getJSONObject("productoBase").getString("unidad_medida");
                        int precio_unit_pb = prodBase.getJSONObject("productoBase").getInt("precio_unitario");

                        db.insertarProductosBase(id_producto, id_pb, nombre_pb, unid_med_pb, precio_unit_pb, cantU_ideal_pb,idPB);

                        JSONArray inventariosPb = prodBase.getJSONObject("productoBase").getJSONArray("inventarios");
                        for (int k = 0; k < inventariosPb.length(); k++) {
                            JSONObject inventariospb = inventariosPb.getJSONObject(k);

                            int inv_id = 0;
                            int inv_id_alma = 0;
                            int inv_id_pro = 0;
                            int inv_cant = 0;
                            int inv_cost_unit = 0;
                            int inv_cost_to = 0;
                            String inv_lote = "";
                            String inv_fecha_venci = "";
                            String inv_createdAt = "";
                            String inv_updatedAt = "";

                            inv_id = inventariospb.getInt("id");
                            inv_id_alma = inventariospb.getInt("id_almacen");
                            inv_id_pro = inventariospb.getInt("id_producto");
                            inv_cant = inventariospb.getInt("cantidad");
                            inv_cost_unit = inventariospb.getInt("costo_unitario");
                            inv_cost_to = inventariospb.getInt("costo_total");
                            inv_lote = (String) inventariospb.get("lote").toString();
                            inv_fecha_venci = (String) inventariospb.get("fecha_vencimiento").toString();
                            inv_createdAt = (String) inventariospb.get("createdAt").toString();
                            inv_updatedAt = (String) inventariospb.get("updatedAt").toString();

                            db.insertarInventario(inv_id, inv_id_alma, inv_id_pro, inv_cant, inv_cost_unit, inv_cost_to, inv_fecha_venci, inv_lote, inv_createdAt, inv_updatedAt);
                        }
                    }                 
                }
            }
        } catch (Exception e) {
            System.out.println(e);
            System.out.println("Error: " + e.getMessage());
        }
        
    }

    public void FiltrarNombre(String nombre) {
        int id = 0;
        int id_prod = 0;
        int id_alma = 0;
        String nomb_prod = "";
        String unid_med = "";
        double prec_unit = 0.0;
        ArrayList<JButtonProducto> producto = new ArrayList();
        ArrayList<JButtonProducto> filtro = new ArrayList();

        int id_p = 0;
        String nomb_pb = "";
        String uni_med_pb = "";
        String cant_uni_ide_pb = "";
        int prec_uni_pb = 0;
        int id_pb = 0;
        int i = 0;

        JButtonProducto filtroPanel[];

        String nombre_almacen = (String) jcomboBoxAlmacen.getSelectedItem();
        int id_almacen = db.selectIdAlmacen(nombre_almacen);

        int cantidad = 0;

        try {

            String filtro_productos = "Select * From producto Where lower(nomb_prod) LIKE '%" + nombre + "%' and id_alm=" + id_almacen;
            ResultSet rs = db.selectProductos(filtro_productos);
            while (rs.next()) {

                id = rs.getInt(1);
                id_prod = rs.getInt(2);
                id_alma = rs.getInt(3);
                nomb_prod = rs.getString(4);
                unid_med = rs.getString(5);
                prec_unit = Double.parseDouble(rs.getString(6));

                String filtro_productos_b = "select * from producto_base where id_producto=" + id_prod;
                ResultSet rs_pb = db.selectProductos(filtro_productos_b);

                while (rs_pb.next()) {
                    id_p = rs_pb.getInt(1);
                    nomb_pb = rs_pb.getString(2);
                    uni_med_pb = rs_pb.getString(3);
                    prec_uni_pb = rs_pb.getInt(5);
                    cant_uni_ide_pb = rs_pb.getString(4);
                    id_pb = rs_pb.getInt(6);
                    //System.out.println("Id: "+rs_pb.getInt(1)+" Nombre: "+rs_pb.getString(2)+" Unidad "+rs_pb.getString(3)+" cantidad "+rs_pb.getString(4)+" Precio "+rs_pb.getInt(5)+" IdPB "+rs_pb.getInt(6));
                    //System.out.println("id alma "+id_almacen+" nombre_almacen "+nombre_almacen);
                    JButtonProducto productoBase = new JButtonProducto(id_p, nomb_pb, uni_med_pb, prec_uni_pb, cant_uni_ide_pb, id_almacen, nombre_almacen);
                    producto.add(productoBase);
                }

                /*ResultSet rscant = db.selectInFiltro("SELECT CANTIDAD  FROM INVENTARIO WHERE ID_PRODUCTO ="+id_prod+" AND ID_ALMACEN = "+id_alma);
                while (rscant.next()) { 
                    cantidad = rscant.getInt(1);
                    //System.out.println(" cantidad "+rscant.getInt(1));

                }*/
                //System.out.println("Id: "+id+" Id Pro "+id_prod+" ID ALM " +id_alma+ " Nombre: "+nomb_prod+" Unidad "+unid_med+" Precio "+prec_unit);           
                 int invCantidad = calcularCantidad(id_prod, id_almacen);
                containFiltro = new JButtonProducto(id_prod, nomb_prod, unid_med, prec_unit, producto, nomb_prod,invCantidad,0, null);
                               

                if (estaActivoInventario(id_prod, id_almacen) == true) {
                    menu[i].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: "+invCantidad+"</html>");

                }else{
                    menu[i].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: Ilimitada</html>");      
                } 
                
                filtro.add(containFiltro);

            }
        } catch (SQLException ex) {
            System.out.println("Error: " + ex);
        }

        filtroPanel = new JButtonProducto[filtro.size()];
        jPanelMostrar.removeAll();
        for (int j = 0; j < filtro.size(); j++) {
            try {
                img = new ImageIcon(this.getClass().getResource("/imagen/icon-producto-default.png"));
                icon = new ImageIcon(img.getImage().getScaledInstance(80, 90, 1));

                filtroPanel[j] = new JButtonProducto(filtro.get(j).getId(), filtro.get(j).getNombre(), filtro.get(j).getUnid_medida(), filtro.get(j).getPrecio_unitario(), filtro.get(j).getLista(), filtro.get(j).getNombre(),filtro.get(j).getCantidad(),0, icon);
                
    
                
                int invCantidad = calcularCantidad(filtro.get(j).getId(), id_almacen);
                if (estaActivoInventario(filtro.get(j).getId(), id_almacen) == true) {
                    filtroPanel[j].setToolTipText("<html>Producto:"+filtro.get(j).getNombre()+"<br>Cantidad: "+invCantidad+"</html>");
                }else{
                    filtroPanel[j].setToolTipText("<html>Producto:"+filtro.get(j).getNombre()+"<br>Cantidad: Ilimitada</html>");      
                }   
                filtroPanel[j].setVerticalTextPosition(SwingConstants.BOTTOM);
                filtroPanel[j].setHorizontalTextPosition(SwingConstants.CENTER);
                filtroPanel[j].setPreferredSize(new Dimension(100, 150));

                filtroPanel[j].addActionListener(this);
                jPanelMostrar.add(filtroPanel[j]);
            } catch (NullPointerException e) {
                System.out.println(e);
                System.out.println("error " + e.getMessage());
            }
        }
        pack();
        jPanelMostrar.updateUI();
        jPanelMostrar.setVisible(true);

    }

    public void agregarFecha() {
        Date fe = new Date();
        String feAct = (String) fe.toString();
        java.util.Date fechaParseada;
        jDate.setDate(fe);
    }

    public AgregarProducto(int id_usuario, int id_solicitud, String nombre_sucur,boolean ver, ArrayList<solicitudReposicion> arraySolicitud, ArrayList<detalleSolicitudProducto> arrayProducto,ArrayList<detalleSolicitudProductoBase>arrayProductoBase) {
        initComponents();
        setLocationRelativeTo(null);
        this.id_usuario = id_usuario;
        this.id_solicitud = id_solicitud;
        this.arraySolicitud = arraySolicitud;
        this.arrayDetalleProducto = arrayDetalleProducto;
        this.arrayDetalleProductoBase = arrayDetalleProductoBase;
        btnGuardar.setVisible(ver);
        agregarFecha();
//        int s_almacen = solicitud_almacen;
//        int s_sucursal = solicitud_sucursal;        
        comboSetSucursal(nombre_sucur);
        InsertarGruposSinRed();

        String columnas[] = {"id", "#", "Cantidad", "Producto", "Quitar", "Eliminar", "Ver"};
        defaulttable = new DefaultTableModel(null, columnas);
  
                
        //TableColumnModel columnModel = tableDetalles.getColumnModel();
        imgSubtract = "/imagen/substract.png";
        imgDelete = "/imagen/delete.png";

        del = new ImageIcon(this.getClass().getResource(imgDelete));
        icondel = new ImageIcon(del.getImage().getScaledInstance(20, 20, 1));

        sub = new ImageIcon(this.getClass().getResource(imgSubtract));
        iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));

        tableDetalles.setDefaultRenderer(Object.class, new RenderTable());

        btn0 = new JButton("Ver");
        btn0.setName("ver");
        btn1 = new JButton("-");
        btn1.setName("quitar");
        btn1.setSize(50, 30);
        btn2 = new JButton(icondel);
        btn2.setName("eliminar");
        btn2.setSize(50, 30);

        tableDetalles.setRowHeight(33);

        String[] columnNames = {"#", "Producto", "Unid. Medida", "Cant.Unid. Ideal", "Cant. Unid. Modif.", "Total Ideal", "Total Real", "Agregar", "Quitar"};
        tablaDescripcion = new DefaultTableModel(null, columnNames) {
            public boolean isCellEditable(int row, int column) {
                return column != 0 && column != 1 && column != 2 && column != 3 && column != 4 && column != 5
                        && column != 7 && column != 8;
            }
        };
        ScrollGrupos.setVisible(visible);
        ScrollGrupos.updateUI();
        jScrollFondo.updateUI();
        SolicitudesActualizar(id_solicitud, arraySolicitud,arrayProducto,arrayProductoBase);

    }
    
    public AgregarProducto(int id_usuario) throws JSONException {
        initComponents();
        setLocationRelativeTo(null);
        agregarFecha();
        this.id_usuario = id_usuario;

        comboSucursal();
        InsertarGrupos();
        String columnas[] = {"id", "#", "Cantidad", "Producto", "Quitar", "Eliminar", "Ver"};
        defaulttable = new DefaultTableModel(null, columnas);

        imgSubtract = "/imagen/substract.png";
        imgDelete = "/imagen/delete.png";

        del = new ImageIcon(this.getClass().getResource(imgDelete));
        icondel = new ImageIcon(del.getImage().getScaledInstance(20, 20, 1));

        sub = new ImageIcon(this.getClass().getResource(imgSubtract));
        iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));

        tableDetalles.setDefaultRenderer(Object.class, new RenderTable());

        btn0 = new JButton("Ver");
        btn0.setName("ver");
        btn1 = new JButton(/*icondel*/"-");
        btn1.setName("quitar");
        btn1.setSize(50, 30);
        btn2 = new JButton(iconsub);
        btn2.setName("eliminar");
        btn2.setSize(50, 30);

        tableDetalles.setRowHeight(33);

        String[] columnNames = {"#", "Producto", "Unid. Medida", "Cant.Unid. Ideal", "Cant. Unid. Modif.", "Total Ideal", "Total Real", "Agregar", "Quitar"};
        tablaDescripcion = new DefaultTableModel(null, columnNames) {
            public boolean isCellEditable(int row, int column) {
                return column != 0 && column != 1 && column != 2 && column != 3 && column != 4 && column != 5
                        && column != 7 && column != 8;
            }
        };

        ScrollGrupos.setVisible(visible);
        ScrollGrupos.updateUI();
        jScrollFondo.updateUI();
    }

    public AgregarProducto(JSONObject datosUsuarios, int id_usuario) throws JSONException {      
        initComponents();
        setLocationRelativeTo(null);
        agregarFecha();
        this.datosUsuario = datosUsuarios;
        this.id_usuario = id_usuario;
        
       // InsertSucursal();
        comboSucursal();
        //InsertarAlmacen();
        InsertarGrupos();

        String columnas[] = {"id", "#", "Cantidad", "Producto", "Quitar", "Eliminar", "Ver"};
        defaulttable = new DefaultTableModel(null, columnas);

        //TableColumnModel columnModel = tableDetalles.getColumnModel();
        imgSubtract = "/imagen/substract.png";
        imgDelete = "/imagen/delete.png";

        del = new ImageIcon(this.getClass().getResource(imgDelete));
        icondel = new ImageIcon(del.getImage().getScaledInstance(20, 20, 1));

        sub = new ImageIcon(this.getClass().getResource(imgSubtract));
        iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));

        tableDetalles.setDefaultRenderer(Object.class, new RenderTable());

        btn0 = new JButton("Ver");
        btn0.setName("ver");
        btn1 = new JButton(/*iconsub*/"-");
        btn1.setName("quitar");
        btn1.setSize(50, 30);
        btn2 = new JButton(icondel);
        btn2.setName("eliminar");
        btn2.setSize(50, 30);

        tableDetalles.setRowHeight(33);

        String[] columnNames = {"#", "Producto", "Unid. Medida", "Cant.Unid. Ideal", "Cant. Unid. Modif.", "Total Ideal", "Total Real", "Agregar", "Quitar"};
        tablaDescripcion = new DefaultTableModel(null, columnNames) {
            public boolean isCellEditable(int row, int column) {
                return column != 0 && column != 1 && column != 2 && column != 3 && column != 4 && column != 5
                        && column != 7 && column != 8;
            }
        };

        ScrollGrupos.setVisible(visible);
        ScrollGrupos.updateUI();
        jScrollFondo.updateUI();
            
    }

    public void borrarActiguosDatos(int id){
        String consulta = "SELECT DSPB.ID \n" +
            "FROM SOLICITUD_REPOSICION AS S\n" +
            "INNER JOIN DETALLE_SOLICITUD_PRODUCTO AS DSP ON S.ID = DSP.SOLICITUD\n" +
            "INNER JOIN DETALLE_SOLICITUD_PRODUCTO_BASE AS DSPB ON DSPB.DETALLE_SOLICITUD_PRODUCTO = DSP.ID\n" +
            "WHERE S.ID = "+id;
        try {
            ResultSet rs = db.selectProductosBase(consulta);
            while(rs.next()){
                int id_dspb = rs.getInt(1);
                String eliminar = "DELETE FROM DETALLE_SOLICITUD_PRODUCTO_BASE WHERE ID = "+id_dspb;
                db.eliminarProductos(eliminar);
            }
        String consulta2 = "DELETE FROM DETALLE_SOLICITUD_PRODUCTO WHERE SOLICITUD = "+id;
        db.eliminarProductos(consulta2);
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
    }
    
    public int obtenerIdSucursal(String sucursal){
        int id = 0;
        ResultSet rs = null;
        String consulta = "SELECT ID \n" +
            "FROM SUCURSAL\n" +
            "WHERE NOMBRE = '"+sucursal+"' AND ID_USUARIO = "+this.id_usuario;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al seleccionar id sucursal: "+e.getMessage());
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(AgregarProducto.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    public int obtenerIdProductoBases(String nombre){
        int id = 0;
        ResultSet rs = null;
        String consulta = "SELECT ID_PROD_BASE from PRODUCTO_BASE WHERE NOMBRE_PB = '"+nombre+"'";
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                id = rs.getInt(1);
       
            }
        } catch (Exception e) {
            System.out.println("Error al seleccionar id productos base: "+e.getMessage());
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(AgregarProducto.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    private boolean getConnectionStatus() {
        String estado = "";
        boolean respuesta = false;
        try { 

            URL ruta=new URL("http://agilsof.net/"); 
            URLConnection rutaC = ruta.openConnection(); 
            rutaC.connect(); 
            estado="Online"; 
            respuesta = true;
        }catch(Exception e){ 
            estado="Offline"; 
            respuesta  = false;
        } 
        return respuesta;   
    }
    
    public int obtenerIdEmpresa(){
        int id = 0;
        ResultSet rs = null;
        String consulta = "SELECT IDEMPRESA \n" +
            "FROM LOGIN \n" +
            "WHERE ID = "+this.id_usuario;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al recuperar el id de empresa: "+e);
        }
        return id;
    }
    
    public String obtenerNombreSucursal(int id){
        ResultSet rs = null;
        String nombre = "";
        String consulta = "SELECT S.NOMBRE\n" +
            "FROM ALMACEN AS A\n" +
            "INNER JOIN SUCURSAL AS S ON A.ID_SUCURSAL = S.ID\n" +
            "WHERE A.ID ="+id ;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                nombre = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener el nombre de la sucursal: "+e);
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(AgregarProducto.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return nombre;
    }
        
    public void sincronizar(){
        if (getConnectionStatus() == true){
            
            db.eliminarProductos("DELETE FROM SOLICITUD_REPOSICION");
            db.eliminarProductos("DELETE FROM DETALLE_SOLICITUD_PRODUCTO_BASE");
            db.eliminarProductos("DELETE FROM DETALLE_SOLICITUD_PRODUCTO");
                 
            SimpleDateFormat horaCompleta = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss:SSS");     
            SimpleDateFormat hora = new SimpleDateFormat("yyyy-MM-dd");    
            int idEmp = obtenerIdEmpresa();
            String url = "/operaciones/empresa/"+idEmp+"/vintage/"+this.id_usuario+"/capo/"+0+"/desde/"+0+"/hasta/"+0+"/suc/"+0+"/alm/"+0+"/mov/"+0+"/est/"+0+"/val/"+0+"/pagina/"+0+"/items-pagina/"+0+"/busqueda/"+0;
            try{
                JSONObject data = RestServer.getJSONObject(url);                       
                JSONArray solicitudes = data.getJSONArray("solicitudes");

                for (int j = 0; j < solicitudes.length(); j++) {
                    JSONObject resSolicitudes = solicitudes.getJSONObject(j);

                    int id = resSolicitudes.getInt("id");
                    int idAlmacen = resSolicitudes.getInt("id_almacen");

                    String f = resSolicitudes.get("fecha").toString();
                    Instant instant = Instant.parse(f);
                    LocalDateTime fe = LocalDateTime.ofInstant(instant, ZoneId.of(ZoneOffset.UTC.getId()));
                    Timestamp fecha = Timestamp.valueOf(fe);      

                    String c = resSolicitudes.get("createdAt").toString();
                    String[] cortarPC = c.split("\\.");
                    String[] cortarPPC = cortarPC[0].split("\\:");
                    String cortar = cortarPPC[0].substring(0,10);
                    Date co = hora.parse(cortar);
                    Long c1 = co.getTime();
                    java.sql.Date created = new java.sql.Date(c1);

                    String u = resSolicitudes.get("updatedAt").toString();
                    String[] cortarPU = c.split("\\.");
                    String[] cortarPPU = cortarPU[0].split("\\:");
                    String cortarU = cortarPPU[0].substring(0,10);
                    Date upda = hora.parse(cortarU);
                    Long u1 = upda.getTime();
                    java.sql.Date updated = new java.sql.Date(u1);
                    int idUsuario = resSolicitudes.getInt("id_usuario");
                    boolean activo = resSolicitudes.getBoolean("activo");
                    boolean eliminado = resSolicitudes.getBoolean("eliminado");
                    double monto = resSolicitudes.getDouble("monto");
                    String sucursal = obtenerNombreSucursal(idAlmacen);                                       
                    db.ingresarSolicitudReposicion(id, idAlmacen, fecha, idUsuario, activo, eliminado, created , monto, sucursal);

                    JSONArray solicitudesProductos = resSolicitudes.getJSONArray("solicitudesProductos");
                    for (int k = 0; k < solicitudesProductos.length(); k++) {
                        JSONObject resSolicitudesProducto =  solicitudesProductos.getJSONObject(k);

                        int idDP = resSolicitudesProducto.getInt("id");
                        int idSolicitud = resSolicitudesProducto.getInt("id_solicitud");
                        int idProducto = resSolicitudesProducto.get("id_producto").toString().equals("null")? 0:Integer.parseInt(resSolicitudesProducto.get("id_producto").toString());
                        double cantidad = resSolicitudesProducto.getDouble("cantidad");

                        String creaP = resSolicitudes.get("createdAt").toString();
                        String[] cortarPDP = creaP.split("\\.");
                        String[] cortarPPDP = cortarPDP[0].split("\\:");
                        String cortar1 = cortarPPDP[0].substring(0,10);
                        Date cDP = hora.parse(cortar1);
                        Long cDP1 = cDP.getTime();
                        java.sql.Date createdDP = new java.sql.Date(cDP1);

                        String updDP = resSolicitudes.get("updatedAt").toString();
                        String[] updatedPDP = updDP.split("\\.");
                        String[] updatedPPDP = updatedPDP[0].split("\\:");
                        String updated1 = updatedPPDP[0].substring(0,10);
                        Date uDP = hora.parse(updated1);
                        Long uDP1 = uDP.getTime();
                        java.sql.Date updatedDP = new java.sql.Date(uDP1);
                        db.insertarSolicitudProducto(idDP, idSolicitud, idProducto, cantidad, createdDP, updatedDP);

                        JSONArray detallesIngredientesProducto = resSolicitudesProducto.getJSONArray("detallesIngredientesProducto");
                        for (int l = 0; l < detallesIngredientesProducto.length(); l++) {
                            JSONObject resDetallesIngredientesProducto = detallesIngredientesProducto.getJSONObject(l);

                            int idDPB = resDetallesIngredientesProducto.getInt("id");
                            int id_detalle_solicitud_producto = resDetallesIngredientesProducto.getInt("id_detalle_solicitud_producto");
                            int id_prod_base = (resDetallesIngredientesProducto.get("id_producto_base").toString().equals("null"))? 0:Integer.parseInt(resDetallesIngredientesProducto.get("id_producto_base").toString());
                            double cantidadIdeal = (resDetallesIngredientesProducto.get("cantidad_ideal").toString().equals("null"))? 0:Double.parseDouble(resDetallesIngredientesProducto.get("cantidad_ideal").toString());
                            double cantidadReal = (resDetallesIngredientesProducto.get("cantidad_real").toString().equals("null"))? 0:Double.parseDouble(resDetallesIngredientesProducto.get("cantidad_real").toString());  
                            double total = (resDetallesIngredientesProducto.get("total").toString().equals("null"))? 0:Double.parseDouble(resDetallesIngredientesProducto.get("total").toString()); 
                            String creaDPB = resSolicitudes.get("createdAt").toString();
                            String[] cortarPDPB = creaDPB.split("\\.");
                            String[] cortarPPDPB = cortarPDPB[0].split("\\:");
                            String cortar2 = cortarPPDPB[0].substring(0,10);
                            Date cDPB = hora.parse(cortar2);
                            Long cDPB1 = cDPB.getTime();
                            java.sql.Date createdDPB = new java.sql.Date(cDPB1);

                            String updDPB = resSolicitudes.get("updatedAt").toString();
                            String[] updatedPDPB = updDPB.split("\\.");
                            String[] updatedPPDPB = updatedPDPB[0].split("\\:");
                            String updated2 = updatedPPDPB[0].substring(0,10);
                            Date uDPB = hora.parse(updated2);
                            Long uDPB1 = uDPB.getTime();
                            java.sql.Date updatedDPB = new java.sql.Date(uDPB1);
                            db.insertarDetalleSolicitudProductoBase(idDPB, id_detalle_solicitud_producto, id_prod_base, cantidadIdeal, cantidadReal, createdDPB, updatedDPB, total);
                        }
                    }
                }
            }catch(Exception e){
                JOptionPane.showMessageDialog(null, "Error al sincronizar los datos de entrada.!");
                System.out.println("Error: "+e.getMessage());  
                e.printStackTrace();
            }
        }else{
            JOptionPane.showMessageDialog(null, "<html>No se pudo sincronizar los datos de entrada conectese a una red, <br> cierre el sistema y vuelva a abrir </html> ");
        }
    }
    
    public boolean esActivo(int solicitud){
        ResultSet rs = null;
        boolean res = false;
        String consulta = "SELECT ACTIVO FROM SOLICITUD_REPOSICION WHERE ID = "+solicitud;
        try{
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                res = rs.getBoolean(1);
            }
        }catch(Exception e){
            System.out.println("Error al seleccionar el activo de solicitud: "+e);
        }
        return res;
    }
    
    public boolean tieneProductosBaseLocal(int producto){
        boolean res = false;
        for (int j = 0; j < prodBase.size(); j++) {
            int idP = prodBase.get(j).getId_pb();
            //int idDeta = prodBase.get(j).getId_detalle();             
            if (idP == producto) {
               
                    res = true;
                    break;

            }
        }
        return res;
    }
    
    public double obtenerPrecioUnitario(int idProducto, int almacen){
        double precio = 0;
        ResultSet rs = null;
        String consulta = "SELECT PRECIO_UNIT FROM PRODUCTO WHERE ID_PROD = "+idProducto+" AND ID_ALM = "+almacen;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                precio = rs.getDouble(1);
            }
        } catch (Exception e) {
            System.out.println("Error al recuperar precio del producto: "+e);
        }
        return precio;
    }
    
    public int obtenerIdProducto(String producto){
        int idProducto = 0;
        ResultSet rs = null;
        String consulta = "SELECT ID_PROD FROM PRODUCTO WHERE NOMB_PROD = '"+producto+"'";
        try { 
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                idProducto = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al recuperar el id del producto: "+e);
        }
        return idProducto;
    }
    
    public boolean tieneProductosBaseSincronizar(int detalleProducto){
        boolean respuesta = false;
        ResultSet rs = null;
        String consulta = "SELECT * "
                + "FROM DETALLE_SOLICITUD_PRODUCTO_BASE WHERE DETALLE_SOLICITUD_PRODUCTO = "+detalleProducto;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                respuesta = true;
            }
        } catch (Exception e) {
            System.out.println("Error al ver si existe el producto base en la sincronizacion: "+e);
        }
        return respuesta;
    }
    
    public void envioDatos(){
        /*ResultSet rs = null;
        String consultaSoli = "SELECT ID,ALMACEN,USUARIO,ACTIVO,ELIMINADO,MONTO,NOMBRE_SUCURSAL,FECHA "
                + "FROM SOLICITUD_REPOSICION "
                + "WHERE ELIMINADO = "+false;
        rs = dbExp.seleccionar(consultaSoli);
        try{
            while(rs.next()){
                int id = rs.getInt(1);
                int almacen = rs.getInt(2);
                int usuario = rs.getInt(3);
                boolean activo = rs.getBoolean(4);
                boolean eliminado = rs.getBoolean(5);
                double monto = rs.getDouble(6);
                String nombreSucur = rs.getString(7);
                Timestamp fecha = rs.getTimestamp(8);
                
                solicitudReposicion listaSolicitud = new solicitudReposicion(id, almacen, usuario, fecha, activo, eliminado, null, null, monto, nombreSucur);
                arraySolicitud.add(listaSolicitud);
            }
        }catch(Exception e){
            System.out.println("Error al seleccionar las solicitudes para la exportacion: "+e);
        }
        
        String consultaDetaPro = "SELECT ID,SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT FROM DETALLE_SOLICITUD_PRODUCTO";
        rs = dbExp.seleccionar(consultaDetaPro);
        try {
            while(rs.next()){
                int id = rs.getInt(1);
                int solicitud = rs.getInt(2);
                int producto = rs.getInt(3);
                double cantidad = rs.getDouble(4);
                java.sql.Date created = rs.getDate(5);
                java.sql.Date updated = rs.getDate(6);
                
                detalleSolicitudProducto listaDSP = new detalleSolicitudProducto(id, solicitud, producto, cantidad, created, updated);
                arrayDetalleProducto.add(listaDSP);
            }
        } catch (Exception e) {
            System.out.println("Error al seleccionar detalle solicitud producto al exportar: "+e);
        }
        
        String consultaDSPB = "SELECT ID,DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,TOTAL\n" +
            "FROM DETALLE_SOLICITUD_PRODUCTO_BASE";
        rs = dbExp.seleccionar(consultaDSPB);
        try {
            while (rs.next()) {                
                int id = rs.getInt(1);
                int detalleSP = rs.getInt(2);
                int producto_base = rs.getInt(3);
                double cantidadIdeal = rs.getDouble(4);
                double cantidadReal = rs.getDouble(5);
                double total = rs.getDouble(6);
                
                detalleSolicitudProductoBase listaDSPB = new detalleSolicitudProductoBase(id, detalleSP, producto_base, cantidadIdeal, cantidadReal, null, null, total);
                arrayDetalleProductoBase.add(listaDSPB);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener el detalle de solicitud del producto base de la exportacion: "+e);
        }*/
        Connection conn = null;

        try {
            conn = Conexion2.getConnection();
            if (conn.getAutoCommit()) { 
                conn.setAutoCommit(false); 
            } 
            InventarioDB invDbs = new InventarioDB(conn);
            for (int i = 0; i < invDbs.seleccionarSolicitudReposicionTodo().size(); i++) {
                int id = invDbs.seleccionarSolicitudReposicionTodo().get(i).getId();
                int almacen = invDbs.seleccionarSolicitudReposicionTodo().get(i).getAlmacen();
                int usuario = invDbs.seleccionarSolicitudReposicionTodo().get(i).getUsuario();
                boolean activo = invDbs.seleccionarSolicitudReposicionTodo().get(i).isActivo();
                boolean eliminado = invDbs.seleccionarSolicitudReposicionTodo().get(i).isEliminado();
                double monto = invDbs.seleccionarSolicitudReposicionTodo().get(i).getMonto();
                String nombreSucur = invDbs.seleccionarSolicitudReposicionTodo().get(i).getNombreSucursal();
                Timestamp fecha = (Timestamp) invDbs.seleccionarSolicitudReposicionTodo().get(i).getFecha();
                
                solicitudReposicion listaSolicitud = new solicitudReposicion(id, almacen, usuario, fecha, activo, eliminado, null, null, monto, nombreSucur);
                arraySolicitud.add(listaSolicitud);
            }
            
            for (int i = 0; i < invDbs.seleccionarSolicitudProductoTodo().size(); i++) {
                int id = invDbs.seleccionarSolicitudProductoTodo().get(i).getId();
                int solicitud = invDbs.seleccionarSolicitudProductoTodo().get(i).getSolicitud();
                int producto = invDbs.seleccionarSolicitudProductoTodo().get(i).getProducto();
                double cantidad = invDbs.seleccionarSolicitudProductoTodo().get(i).getCantidad();
                java.sql.Date created = (java.sql.Date) invDbs.seleccionarSolicitudProductoTodo().get(i).getCreatedAt();
                java.sql.Date updated = (java.sql.Date) invDbs.seleccionarSolicitudProductoTodo().get(i).getUpdatedAt();
                
                detalleSolicitudProducto listaDSP = new detalleSolicitudProducto(id, solicitud, producto, cantidad, created, updated);
                arrayDetalleProducto.add(listaDSP);
            }
            
            for (int i = 0; i < invDbs.seleccionarSolicitudProductoBaseTodo().size(); i++) {
                int id = invDbs.seleccionarSolicitudProductoBaseTodo().get(i).getId();
                int detalleSP = invDbs.seleccionarSolicitudProductoBaseTodo().get(i).getDetalle_solicitud_producto();
                int producto_base = invDbs.seleccionarSolicitudProductoBaseTodo().get(i).getProducto_base();
                double cantidadIdeal = invDbs.seleccionarSolicitudProductoBaseTodo().get(i).getCantidad_ideal();
                double cantidadReal = invDbs.seleccionarSolicitudProductoBaseTodo().get(i).getCantidad_real();
                double total = invDbs.seleccionarSolicitudProductoBaseTodo().get(i).getTotal();
                
                detalleSolicitudProductoBase listaDSPB = new detalleSolicitudProductoBase(id, detalleSP, producto_base, cantidadIdeal, cantidadReal, null, null, total);
                arrayDetalleProductoBase.add(listaDSPB);
            }
            conn.commit();
        }  catch (SQLException e) {
            //Hacemos rollback en caso de error
            try {
                System.out.println("Entramos al rollback");
            //Imprimimos la excepcion a la consola
                e.printStackTrace(System.out);
            //Hacemos rollback
                conn.rollback();
            } catch (SQLException e1) {
                e1.printStackTrace(System.out);
            }
        }
        
        
        try {
            JSONObject datos = new JSONObject();
            JSONObject idAlmacen = new JSONObject();
            JSONArray arrayDetalleIngredientesProducto = new JSONArray();
            JSONArray arrayDetalleIngredientesProductoNull = new JSONArray();
            JSONArray arraySolicitudProducto = new JSONArray();
            
            for (int i = 0; i < arraySolicitud.size(); i++) {
                int ids = arraySolicitud.get(i).getId();
                int id_almacen = arraySolicitud.get(i).getAlmacen();
                Timestamp fecha = (Timestamp) arraySolicitud.get(i).getFecha();
                int id_usuario = arraySolicitud.get(i).getUsuario();
                boolean activo = arraySolicitud.get(i).isActivo();
                double monto = arraySolicitud.get(i).getMonto();
                int id_empresa = obtenerIdEmpresa();

                idAlmacen.put("id", id_almacen);
                datos.put("almacen", idAlmacen);
                datos.put("fecha", fecha);
                datos.put("id_usuario", id_usuario);
                datos.put("activo", activo);
                datos.put("monto", monto);
                datos.put("id_empresa", id_empresa);
                
                for (int j = 0; j < arrayDetalleProducto.size(); j++) {
                    int solicitud = arrayDetalleProducto.get(j).getSolicitud();
                    JSONObject solicitudesProductos = new JSONObject();
                    JSONObject detallesIngredientesProductoNull = new JSONObject();
                    JSONObject productoSolicitado = new JSONObject();
                    JSONObject id_producto = new JSONObject();                   
                            
                    if (ids == solicitud) {
                        int idDP = arrayDetalleProducto.get(j).getId();
                        int producto = arrayDetalleProducto.get(j).getProducto();
                        double cantidad = arrayDetalleProducto.get(j).getCantidad();
                        
                        productoSolicitado.put("id", producto);
                        solicitudesProductos.put("productoSolicitado", productoSolicitado);
                        solicitudesProductos.put("cantidad", cantidad);
                                                                    
                        if (tieneProductosBaseSincronizar(idDP) == true) {
                            for (int k = 0; k < arrayDetalleProductoBase.size(); k++) {
                                int detalle_solicitud_producto = arrayDetalleProductoBase.get(k).getDetalle_solicitud_producto();

                                JSONObject detallesIngredientesProducto = new JSONObject();
                                if (idDP == detalle_solicitud_producto) {

                                    int producto_base = arrayDetalleProductoBase.get(k).getProducto_base();
                                    double cantidad_ideal = arrayDetalleProductoBase.get(k).getCantidad_ideal();
                                    double cantidad_real = arrayDetalleProductoBase.get(k).getCantidad_real();
                                    double total = arrayDetalleProductoBase.get(k).getTotal();

                                    detallesIngredientesProducto.put("cantidad_ideal", cantidad_ideal);
                                    detallesIngredientesProducto.put("cantidad_real", cantidad_real);
                                    detallesIngredientesProducto.put("id_producto_base", producto_base);
                                    detallesIngredientesProducto.put("total", total);

                                    arrayDetalleIngredientesProducto.put(detallesIngredientesProducto);
                                    solicitudesProductos.put("detallesIngredientesProducto", arrayDetalleIngredientesProducto);

                                }
                            }
                        }else{
                            Object[] pb = {};
                            solicitudesProductos.put("detallesIngredientesProducto", pb);
                        }
                        
                        arraySolicitudProducto.put(solicitudesProductos);
                        datos.put("solicitudesProductos", arraySolicitudProducto);
                    }
                }
                
                if (getConnectionStatus() == true) {
                    try {
                        int idEmp = obtenerIdEmpresa();
                        String url = "/solicitud/empresa/"+idEmp;
                        JSONObject res = RestServer.postJSONdata(url, datos);
                        
                        dbExp.eliminarProductos("DELETE FROM SOLICITUD_REPOSICION");
                        dbExp.eliminarProductos("DELETE FROM DETALLE_SOLICITUD_PRODUCTO");
                        dbExp.eliminarProductos("DELETE FROM DETALLE_SOLICITUD_PRODUCTO_BASE");
                    } catch (Exception e) {
                        System.out.println("Error: "+e);
                    }

                }else{
                    JOptionPane.showMessageDialog(null, "<html>No se pudieron cargar los datos al servido Agil.<br>Conectece a una red de internet o sincronize mas tarde</html>");
                }
            }
        } catch (Exception e) {
            System.out.println("Error al enviar el JSON:"+ e);
        }
    }
    
    public String obtenerNombrePB(int idPB){
        String nombrePB = "";
        ResultSet rs = null;
        String consulta = "SELECT NOMBRE_PB FROM PRODUCTO_BASE WHERE ID_PROD_BASE = "+idPB;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                nombrePB = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("Error al recuperar el nombre del producto base: "+e);
        }
        return nombrePB;
    }

    public void cerrarSolicitud(int idEmpresa){
       ResultSet rs = null;
        String consulta = "SELECT ACTIVO FROM SOLICITUD_REPOSICION WHERE ACTIVO = "+false;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
               
            }
        } catch (Exception e) {
            System.out.println("Error al recuperar el nombre del producto base: "+e);
        } 
    }
    
    
 
    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        PanelPrincipal = new javax.swing.JPanel();
        jPanel3 = new javax.swing.JPanel();
        jDate = new com.toedter.calendar.JDateChooser();
        jLabel1 = new javax.swing.JLabel();
        jcomboBoxSucursal = new javax.swing.JComboBox<>();
        jLabel2 = new javax.swing.JLabel();
        jcomboBoxAlmacen = new javax.swing.JComboBox<>();
        jLabel3 = new javax.swing.JLabel();
        btnGuardar = new javax.swing.JButton();
        jButton2 = new javax.swing.JButton();
        jPanel1 = new javax.swing.JPanel();
        jtxtBusqueda = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
        btnMostrar = new javax.swing.JButton();
        checkEstado = new javax.swing.JCheckBox();
        jScrollFondo = new javax.swing.JScrollPane();
        jPanel4 = new javax.swing.JPanel();
        jScrollPane1 = new javax.swing.JScrollPane();
        jPanelMostrar = new javax.swing.JPanel();
        btnTotalV = new javax.swing.JButton();
        jButtonGrupos = new javax.swing.JButton();
        ScrollGrupos = new javax.swing.JScrollPane();
        jPanelGrupos = new javax.swing.JPanel();
        jLabel5 = new javax.swing.JLabel();
        labelDesPB = new javax.swing.JLabel();
        jlabelSin = new javax.swing.JLabel();
        jPanel2 = new javax.swing.JPanel();
        jScrollPane3 = new javax.swing.JScrollPane();
        tableDetalles = 
        new JTable(){
            public boolean isCellEditable(int rowIndex, int colIndex) {
                return colIndex != 0 && colIndex != 1 && colIndex != 3 && colIndex != 4 
                && colIndex != 5 && colIndex != 6;
            }
        };
        labelDetalles = new javax.swing.JLabel();
        labelPB = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);
        setBackground(new java.awt.Color(255, 255, 255));
        setName("frame"); // NOI18N

        PanelPrincipal.setBackground(new java.awt.Color(255, 255, 255));

        jPanel3.setBackground(new java.awt.Color(255, 0, 0));

        jDate.setBorder(javax.swing.BorderFactory.createBevelBorder(javax.swing.border.BevelBorder.RAISED));
        jDate.setDateFormatString("yyyy-MM-dd HH:mm:ss");

        jLabel1.setForeground(new java.awt.Color(255, 255, 255));
        jLabel1.setText("FECHA");

        jcomboBoxSucursal.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Seleccione..." }));
        jcomboBoxSucursal.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jcomboBoxSucursalActionPerformed(evt);
            }
        });

        jLabel2.setForeground(new java.awt.Color(255, 255, 255));
        jLabel2.setText("SUCURSAL");

        jcomboBoxAlmacen.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Seleccione...", " " }));
        jcomboBoxAlmacen.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        jcomboBoxAlmacen.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jcomboBoxAlmacenActionPerformed(evt);
            }
        });

        jLabel3.setBackground(new java.awt.Color(255, 255, 255));
        jLabel3.setForeground(new java.awt.Color(255, 255, 255));
        jLabel3.setText("ALMACEN");

        btnGuardar.setBackground(new java.awt.Color(204, 204, 204));
        btnGuardar.setText("GUARDAR");
        btnGuardar.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        btnGuardar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnGuardarActionPerformed(evt);
            }
        });

        jButton2.setText("CERRAR");
        jButton2.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        jButton2.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton2ActionPerformed(evt);
            }
        });

        jPanel1.setBackground(new java.awt.Color(255, 51, 51));

        jtxtBusqueda.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jtxtBusquedaActionPerformed(evt);
            }
        });
        jtxtBusqueda.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyPressed(java.awt.event.KeyEvent evt) {
                jtxtBusquedaKeyPressed(evt);
            }
            public void keyReleased(java.awt.event.KeyEvent evt) {
                jtxtBusquedaKeyReleased(evt);
            }
        });

        jLabel4.setForeground(new java.awt.Color(255, 255, 255));
        jLabel4.setText("BÚSQUEDA");

        jLabel6.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/lupa.png"))); // NOI18N

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 94, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jtxtBusqueda, javax.swing.GroupLayout.PREFERRED_SIZE, 195, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 29, Short.MAX_VALUE)
                .addComponent(jLabel6)
                .addContainerGap())
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel4)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jtxtBusqueda))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabel6, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        btnMostrar.setBackground(new java.awt.Color(204, 204, 204));
        btnMostrar.setText("MOSTRAR");
        btnMostrar.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        btnMostrar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnMostrarActionPerformed(evt);
            }
        });

        checkEstado.setBackground(new java.awt.Color(255, 0, 0));
        checkEstado.setFont(new java.awt.Font("Arial", 1, 12)); // NOI18N
        checkEstado.setForeground(new java.awt.Color(255, 255, 255));
        checkEstado.setSelected(true);
        checkEstado.setText("Con Cantidad");
        checkEstado.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                checkEstadoActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jDate, javax.swing.GroupLayout.PREFERRED_SIZE, 0, Short.MAX_VALUE)
                    .addComponent(jLabel1, javax.swing.GroupLayout.DEFAULT_SIZE, 135, Short.MAX_VALUE))
                .addGap(18, 18, 18)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel2, javax.swing.GroupLayout.PREFERRED_SIZE, 110, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jcomboBoxSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, 136, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel3)
                    .addComponent(jcomboBoxAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, 136, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(76, 76, 76)
                .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(checkEstado)
                .addGap(18, 18, 18)
                .addComponent(btnMostrar, javax.swing.GroupLayout.PREFERRED_SIZE, 70, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(114, 114, 114)
                .addComponent(btnGuardar, javax.swing.GroupLayout.PREFERRED_SIZE, 84, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(38, 38, 38)
                .addComponent(jButton2, javax.swing.GroupLayout.PREFERRED_SIZE, 84, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(37, 37, 37))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap(15, Short.MAX_VALUE)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(jPanel3Layout.createSequentialGroup()
                        .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel3)
                            .addComponent(jLabel2)
                            .addComponent(jLabel1))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jcomboBoxAlmacen, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jcomboBoxSucursal, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                    .addComponent(jDate, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(btnGuardar, javax.swing.GroupLayout.PREFERRED_SIZE, 44, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jButton2, javax.swing.GroupLayout.PREFERRED_SIZE, 44, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(btnMostrar, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(checkEstado)))
                .addContainerGap())
        );

        jScrollFondo.setHorizontalScrollBar(null);

        jPanel4.setBackground(new java.awt.Color(255, 255, 255));

        jPanelMostrar.setLayout(new java.awt.GridLayout(3, 0));
        jScrollPane1.setViewportView(jPanelMostrar);

        btnTotalV.setBackground(new java.awt.Color(51, 51, 255));
        btnTotalV.setForeground(new java.awt.Color(255, 255, 255));
        btnTotalV.setText("Total Viveres");
        btnTotalV.setToolTipText("Ver total viveres solicitados");
        btnTotalV.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnTotalVActionPerformed(evt);
            }
        });

        jButtonGrupos.setIcon(new javax.swing.ImageIcon(getClass().getResource("/imagen/mostrar.png"))); // NOI18N
        jButtonGrupos.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonGruposActionPerformed(evt);
            }
        });

        jPanelGrupos.setLayout(new java.awt.GridLayout(3, 0));
        ScrollGrupos.setViewportView(jPanelGrupos);

        jLabel5.setForeground(new java.awt.Color(51, 51, 255));
        jLabel5.setText("  Ingredientes");

        labelDesPB.setForeground(new java.awt.Color(51, 51, 255));

        jlabelSin.setForeground(new java.awt.Color(255, 0, 0));

        jPanel2.setLayout(new java.awt.GridLayout(1, 0));

        tableDetalles.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "id", "#", "Cantidad", "Producto", "Quitar", "Eliminar", "Ver"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                false, false, true, false, false, false, false
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        tableDetalles.getTableHeader().setReorderingAllowed(false);
        tableDetalles.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                tableDetallesMouseClicked(evt);
            }
        });
        jScrollPane3.setViewportView(tableDetalles);
        if (tableDetalles.getColumnModel().getColumnCount() > 0) {
            tableDetalles.getColumnModel().getColumn(0).setMinWidth(0);
            tableDetalles.getColumnModel().getColumn(0).setPreferredWidth(0);
            tableDetalles.getColumnModel().getColumn(0).setMaxWidth(0);
        }

        labelDetalles.setBackground(java.awt.SystemColor.activeCaption);
        labelDetalles.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        labelDetalles.setText("  Detalles de orden");

        labelPB.setFont(new java.awt.Font("Tahoma", 1, 11)); // NOI18N
        labelPB.setForeground(new java.awt.Color(0, 0, 255));

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel4Layout.createSequentialGroup()
                        .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel4Layout.createSequentialGroup()
                                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(ScrollGrupos, javax.swing.GroupLayout.PREFERRED_SIZE, 372, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jButtonGrupos, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 106, Short.MAX_VALUE)
                                .addComponent(btnTotalV, javax.swing.GroupLayout.PREFERRED_SIZE, 108, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel4Layout.createSequentialGroup()
                                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(labelDetalles, javax.swing.GroupLayout.PREFERRED_SIZE, 372, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 406, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(labelPB, javax.swing.GroupLayout.PREFERRED_SIZE, 522, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addGroup(jPanel4Layout.createSequentialGroup()
                                        .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, 82, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(2, 2, 2)
                                        .addComponent(labelDesPB, javax.swing.GroupLayout.PREFERRED_SIZE, 137, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                        .addComponent(jlabelSin, javax.swing.GroupLayout.PREFERRED_SIZE, 214, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                .addGap(0, 64, Short.MAX_VALUE)))
                        .addGap(18, 18, 18)
                        .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 671, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(102, 102, 102))
                    .addGroup(jPanel4Layout.createSequentialGroup()
                        .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, 531, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))))
        );
        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel4Layout.createSequentialGroup()
                        .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel4Layout.createSequentialGroup()
                                .addGap(23, 23, 23)
                                .addComponent(btnTotalV, javax.swing.GroupLayout.PREFERRED_SIZE, 55, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel4Layout.createSequentialGroup()
                                .addGap(4, 4, 4)
                                .addComponent(jButtonGrupos)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(ScrollGrupos, javax.swing.GroupLayout.PREFERRED_SIZE, 208, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(24, 24, 24)
                        .addComponent(labelDetalles, javax.swing.GroupLayout.PREFERRED_SIZE, 19, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 126, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(labelPB, javax.swing.GroupLayout.PREFERRED_SIZE, 24, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(labelDesPB, javax.swing.GroupLayout.PREFERRED_SIZE, 18, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel5)
                            .addComponent(jlabelSin, javax.swing.GroupLayout.PREFERRED_SIZE, 18, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, 111, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel4Layout.createSequentialGroup()
                        .addGap(23, 23, 23)
                        .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 376, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(0, 41, Short.MAX_VALUE))
        );

        jScrollFondo.setViewportView(jPanel4);

        javax.swing.GroupLayout PanelPrincipalLayout = new javax.swing.GroupLayout(PanelPrincipal);
        PanelPrincipal.setLayout(PanelPrincipalLayout);
        PanelPrincipalLayout.setHorizontalGroup(
            PanelPrincipalLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(PanelPrincipalLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(PanelPrincipalLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, 1322, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jScrollFondo, javax.swing.GroupLayout.PREFERRED_SIZE, 1322, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(26, Short.MAX_VALUE))
        );
        PanelPrincipalLayout.setVerticalGroup(
            PanelPrincipalLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(PanelPrincipalLayout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollFondo, javax.swing.GroupLayout.PREFERRED_SIZE, 626, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(35, 35, 35))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(PanelPrincipal, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(PanelPrincipal, javax.swing.GroupLayout.PREFERRED_SIZE, 740, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void btnGuardarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnGuardarActionPerformed
        int idAutoIncrement = 1;
        ResultSet rsUser = null;
        ResultSet rs = null;
        Date fecha = jDate.getDate();

        Date fe = new Date();
        long dd = fe.getTime();
        java.sql.Date fechaAct = new java.sql.Date(dd);     
        
        String nom_alm_repo = (String) jcomboBoxAlmacen.getSelectedItem();
        int id_alm_repo = 0;
        
        for (int i = 0; i < db.SeleccionarTodoAlmacenPorNombre(nom_alm_repo).size(); i++) {
            id_alm_repo = db.SeleccionarTodoAlmacenPorNombre(nom_alm_repo).get(i).getId();
        }

        try {
            int id_usuario = this.id_usuario;
            
            String nombreSucursal = (String) jcomboBoxSucursal.getSelectedItem();
            int idSucursal = obtenerIdSucursal(nombreSucursal);
            String Nombre_almacen = (String) jcomboBoxAlmacen.getSelectedItem();
            int id_almacen = 0 /*db.selectIdAlmacen(nombre_almacen)*/;
            boolean activo = true;
            boolean eliminado = false;
            double monto = 0;
            double precio = 0;
            int contador = 1;
            int id_prod = 0;
           
            String nombre_pro = "";
            double cantidad_pro = 0.0;
            int id_solici_repo = 0;
            int id_Detalle_Producto = 0;
            double cant_pro = 0.0;
            
            
            int id_pb = 0;

            double total = 0.0;
            try {
                String fes = df.format(fecha);
                if (!fes.equals("")) {
                    long d = fecha.getTime();
                    java.sql.Date fechaSelec = new java.sql.Date(d);
                    java.sql.Timestamp fechaSelecHora = new java.sql.Timestamp(d);
                    for (int i = 0; i < prodBase.size(); i++) {
                        precio = prodBase.get(i).getTotal_real_pb() * prodBase.get(i).getPrecio_unitario();
                        monto += precio;
                 
                    }             
                    
                    for (int i = 0; i < this.arraySolicitud.size(); i++) {
                        id_detalle = arraySolicitud.get(i).getId();
                    }
                    
                    if(id_detalle != 0){
                        int guardado = 0;
                        int idEmp = obtenerIdEmpresa();
                        double montoPro = 0;
                        java.sql.Date fechaCreada = null;
                        
                        JSONObject objeto = new JSONObject();
                        JSONObject alm = new JSONObject();
                        JSONObject almLPS = new JSONObject();                      
                        
                        JSONObject almSP = new JSONObject();                     
                        JSONArray arraySoliciProd = new JSONArray();
                        
                        double totalReal = 0;
                        for (int i = 0; i < prod.size(); i++) {
                            int detalleProducto = prod.get(i).getId();
                            String nomProd = prod.get(i).getNombre();
                            int idPro = obtenerIdProducto(nomProd);
                            double cantPro = prod.get(i).getCantidad();
                            //detalleProducto
                            if (tieneProductosBaseLocal(idPro) == false) {
                                montoPro += (obtenerPrecioUnitario(idPro,id_alm_repo)*cantPro);
                                //monto = monto + montoPro;                            
                            }else{
                                
                                for (int j = 0; j < prodBase.size(); j++) {
                                    int idDetalleProducto = prodBase.get(j).getId_pb();
                                    String nombre = prodBase.get(j).getNombre_pb();
                                    double preUnitPB = prodBase.get(j).getPrecio_unitario();
                                    double totalRealPB = prodBase.get(j).getTotal_real_pb();
                                    if (idPro == idDetalleProducto) {
                                        //precio = prodBase.get(j).getTotal_real_pb() * prodBase.get(j).getPrecio_unitario();
                                        //monto += precio; 
                                       
                                        totalReal += totalRealPB*preUnitPB;
                                    }        
                                }
                            }                 
                        }
                        monto = 0;
                        monto = totalReal + montoPro;
                        //objeto.put("id", id_detalle);
                        objeto.put("id", id_detalle);
                        activo = esActivo(id_detalle);
                        objeto.put("activo", activo);
                        alm.put("id", id_alm_repo);
                        objeto.put("almacen", alm);
                        objeto.put("fecha", fechaSelecHora);
                        objeto.put("id_usuario", this.id_usuario);
                        objeto.put("monto",monto);
                        objeto.put("id_empresa",idEmp);
                       
                       for (int i = 0; i < prod.size(); i++) {
                            JSONObject solicitudProductos = new JSONObject();
                            JSONObject productoSolicitado = new JSONObject();
                            JSONObject id_producto = new JSONObject();
                            int idDP = 0;
                            
                            idDP = prod.get(i).getId();
                            nombre_pro = prod.get(i).getNombre();
                            id_prod = obtenerIdProducto(nombre_pro);
                            cant_pro = prod.get(i).getCantidad();
                            
                            String consulta = "SELECT ID,CREATEDAT FROM SOLICITUD_REPOSICION WHERE ID = "+id_detalle ;
                            rs = db.selectProductos(consulta);
                            while(rs.next()){
                           //     idDP = rs.getInt(1);
                                fechaCreada = rs.getDate(2);
                            }
                            
                            //solicitudProductos.put("id", idDP);
                            solicitudProductos.put("cantidad", cant_pro);
                            solicitudProductos.put("id_producto", id_prod);                            
                            solicitudProductos.put("id_solicitud", id_detalle);
                            productoSolicitado.put("id", id_prod);                           
                            solicitudProductos.put("productoSolicitado", productoSolicitado);
                            //idDP
                            
                            if (tieneProductosBaseLocal(id_prod) == true) {
                                JSONArray arrayDetallesIngredientesProducto = new JSONArray();
                                for (int j = 0; j < prodBase.size(); j++) {
                                    JSONObject detallesIngredientesProducto = new JSONObject();
                                    JSONObject detallesIngredientesProductoNull = null;

                                    int detalleProd = prodBase.get(j).getId_pb();
                                    if (id_prod == detalleProd) {
                                        int prod_base = prodBase.get(j).getId_pb();
                                        total = prodBase.get(j).getTotal_real_pb();
                                        String nomb_pb = prodBase.get(j).getNombre_pb();
                                        double canti_ideal = prodBase.get(j).getCantU_ideal_pb();
                                        double canti_real = prodBase.get(j).getCantU_modif_pb();

                                        String sucursal = "SELECT * FROM PRODUCTO_BASE WHERE ID_PRODUCTO=" + prod_base + " AND NOMBRE_PB='" + nomb_pb + "'";
                                        ResultSet rspb = db.selectProductosBase(sucursal);
                                        while (rspb.next()) {
                                            id_pb = rspb.getInt(6);

                                        }
                                        // db.insertarDetalleSolicitudProductoBase(id_Detalle_Producto, id_pb, canti_ideal, canti_real, fechaCreada, fechaAct, total);
                                        //id_pb = 0;
                                        if (!nombre_pro.equals(nomb_pb)) {
                                            
                                            detallesIngredientesProducto.put("id_detalle_solicitud_producto", idDP);
                                            //detallesIngredientesProducto.put("id", id_pb);
                                            detallesIngredientesProducto.put("id_producto_base", id_pb);
                                            detallesIngredientesProducto.put("cantidad_ideal", canti_ideal);
                                            detallesIngredientesProducto.put("cantidad_real", canti_real);
                                            detallesIngredientesProducto.put("total", total); 


                                            arrayDetallesIngredientesProducto.put(detallesIngredientesProducto);
                                            solicitudProductos.put("detallesIngredientesProducto", arrayDetallesIngredientesProducto);

                                        }
                                    }
                                }
                            }else{
                                Object[] a = {};
                                solicitudProductos.put("detallesIngredientesProducto", a);
                            }
                            arraySoliciProd.put(solicitudProductos);
                            objeto.put("solicitudesProductos", arraySoliciProd);
                        }
                       
                        if (getConnectionStatus() == true) {
                            try {
                                String url = "/solicitud/empresa/"+idEmp;
                                JSONObject res = RestServer.putJSONdata(url, objeto);      
                                guardado = 0;
                            } catch (Exception e) {
                                JOptionPane.showMessageDialog(null, "Error al guardad los datos");
                                guardado ++;
                            }
                        }else{
                            JOptionPane.showMessageDialog(null, "<html>La aplicacion no se sincronizo con el servido.<br>Conectece a una red de internet y sincronize </html>");
                            guardado ++;
                        }                      
                        if (guardado == 0) {
                            sincronizar();
                            JOptionPane.showMessageDialog(null, "Se guardaron los datos");
                            limpiar();
                            prodBase.removeAll(prodBase);
                            //jDate.setDate(null);
                            jTable1.updateUI();
                            idDetalle = 1;
                            cant = 1;
                            //dispose();
                        }
                        
                        
                    }else if(id_detalle == 0){
                        int idEmp = obtenerIdEmpresa();
                        int idDPB = 0;
                        int idDP = 0;
                        int idSolicitud = db.seleccionarSolicitudReposicionId();
                        
                        int idSolicitudEx = dbExp.seleccionarSolicitudReposicionId();
                        
                        if (idSolicitudEx == 0) {
                            System.out.println("DB exp no tiene productos");
                            if (idSolicitud == 0) {
                                idSolicitud = idAutoIncrement;
                            }else{
                                idSolicitud = idSolicitud +1;
                            }
                        }else{
                            idSolicitud = idSolicitudEx + 1;
                        }
                        
                        
                        if (db.ingresarSolicitudReposicion(idSolicitud,id_alm_repo, fechaSelecHora, id_usuario, activo, eliminado, fechaAct, monto, nombreSucursal) == true) {                       
                            id_solici_repo = db.seleccionarSolicitudReposicionId();
                          
                            dbExp.ingresarSolicitudReposicionExp(idSolicitud,id_alm_repo, fechaSelecHora, id_usuario, activo, eliminado, fechaAct, monto, nombreSucursal);

                        for (int i = 0; i < prod.size(); i++) {
                            
                            id_prod = prod.get(i).getId();
                            nombre_pro = prod.get(i).getNombre();
                            cant_pro = prod.get(i).getCantidad();
                            
                            idDP = db.seleccionarDetalleSoliciProducto();
                            int idDPEx = dbExp.seleccionarDetalleSoliciProducto();
                            
                            if (idDPEx == 0) {
                                if (idDP == 0) {
                                    idDP = idAutoIncrement;
                                }else{
                                    idDP = idDP + 1;
                                }
                            }else{
                                idDP = idDPEx + 1;
                            }
                            
                            db.insertarSolicitudProducto(idDP,id_solici_repo, id_prod, cant_pro, fechaAct,fechaAct);                           
                            id_Detalle_Producto = db.seleccionarDetalleSoliciProducto();
                            
                            dbExp.insertarSolicitudProducto(idDP,id_solici_repo, id_prod, cant_pro, fechaAct, fechaAct);                 
                            
                            int id_detalle_produc_export = dbExp.seleccionarDetalleSoliciProducto();
                            for (int j = 0; j < prodBase.size(); j++) {
                 
                                int idDetalleProducto = prodBase.get(j).getId_pb();
                                if (id_prod == idDetalleProducto) {
                                    
                                    total = prodBase.get(j).getTotal_real_pb();
                                    String nomb_pb = prodBase.get(j).getNombre_pb();
                                    int prod_base = obtenerIdProductoBases(nomb_pb);
                                    
                                    double canti_ideal = prodBase.get(j).getCantU_ideal_pb();
                                    double canti_real = prodBase.get(j).getCantU_modif_pb();
                                   
                        
                                    
                                    if (!nombre_pro.equals(nomb_pb)) {
                                        
                                        idDPB = db.seleccionarUltimoIdDetalleSolicitudProductoBase();
                                        int idDPBEx = dbExp.seleccionarUltimoIdDetalleSolicitudProductoBase();
                                        
                                        if (idDPBEx == 0) {
                                            if (idDPB == 0) {
                                                idDPB = idAutoIncrement;
                                            }else{
                                                idDPB = idDPB + 1;
                                            }
                                        }else{
                                            idDPB = idDPBEx + 1;
                                        }
                                        

                                        db.insertarDetalleSolicitudProductoBase(idDPB, id_Detalle_Producto, prod_base, canti_ideal, canti_real, fechaAct, fechaAct, total);
                                        //Guarda el detall PB en la BD de exportacion
                                        dbExp.insertarDetalleSolicitudProductoBase(idDPB,id_Detalle_Producto, prod_base, canti_ideal, canti_real, fechaAct, fechaAct, total);                                  
                                        //fin
      
                                    }
                                }
                            }
                        }                  
                    }
                        envioDatos();
                        sincronizar(); 
                        JOptionPane.showMessageDialog(null, "Se guardaron los datos");                   
                        limpiar();
                        prodBase.removeAll(prodBase);
                        //jDate.setDate(null);
                        jTable1.updateUI();
                        idDetalle = 1;
                        cant = 1;
                        
                        //dispose();            
                    }             
                }
                
            } catch (Exception e) {
                System.out.println("error: " + e);
                JOptionPane.showMessageDialog(null, "Ingrese la fecha!");
            }
        } catch (Exception ex) {
            Logger.getLogger(AgregarProducto.class.getName()).log(Level.SEVERE, null, ex);
        }
    }//GEN-LAST:event_btnGuardarActionPerformed

    private void jButton2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton2ActionPerformed

        dispose();
    }//GEN-LAST:event_jButton2ActionPerformed

    private void jcomboBoxSucursalActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jcomboBoxSucursalActionPerformed
        // TODO add your handling code here:
        jcomboBoxAlmacen.removeAllItems();
        jcomboBoxAlmacen.addItem("Selecione...");
        nombreSucursal = (String) jcomboBoxSucursal.getSelectedItem();

        for (int i = 0; i < db.SeleccionarAlmacen(nombreSucursal).size(); i++) {
            jcomboBoxAlmacen.addItem(db.SeleccionarAlmacen(nombreSucursal).get(i).getNombre());
        }
    }//GEN-LAST:event_jcomboBoxSucursalActionPerformed
    
    private void jcomboBoxAlmacenActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jcomboBoxAlmacenActionPerformed
        // TODO add your handling code here:
      
    }//GEN-LAST:event_jcomboBoxAlmacenActionPerformed

    private void jtxtBusquedaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jtxtBusquedaActionPerformed
        // TODO add your handling code here:

    }//GEN-LAST:event_jtxtBusquedaActionPerformed

    private void jtxtBusquedaKeyPressed(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_jtxtBusquedaKeyPressed

    }//GEN-LAST:event_jtxtBusquedaKeyPressed

    private void jtxtBusquedaKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_jtxtBusquedaKeyReleased

        if (jtxtBusqueda.getText().equals("")) {
            jPanelMostrar.removeAll();
            /*for (int i = 0; i < menu.length; i++) {
                menu[i].addActionListener(this);
                menu[i].setVerticalTextPosition(SwingConstants.BOTTOM);
                menu[i].setHorizontalTextPosition(SwingConstants.CENTER);
                menu[i].setPreferredSize(new Dimension(100, 150));
                jPanelMostrar.add(menu[i]);
            }
            pack();
            jPanelMostrar.updateUI();
            jPanelMostrar.setVisible(true);*/
            String almacen = (String) jcomboBoxAlmacen.getSelectedItem();
            int idAlmacen = obtenerIdAlmacen(almacen);
            SeleccionarProductosPanelSinInternet(idAlmacen,true);

        } else {
            FiltrarNombre(jtxtBusqueda.getText().trim());
        }
    }//GEN-LAST:event_jtxtBusquedaKeyReleased

    private void tableDetallesMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tableDetallesMouseClicked
        // TODO add your handling code here:
        int columna = tableDetalles.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tableDetalles.getRowHeight();
        //String idProducto;
        boolean existe = false;

        if (fila < tableDetalles.getRowCount() && fila >= 0 && columna < tableDetalles.getColumnCount() && columna >= 0) {
            Object value = tableDetalles.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("quitar")) {
                    int idProd = Integer.parseInt(String.valueOf(tableDetalles.getValueAt(fila, 0)));
                    int pos = boton.getPos();
                    int cantidad = boton.getCantidad();
                    String nombre = String.valueOf(tableDetalles.getValueAt(fila, 3));
                    String CantAumentar = String.valueOf(tableDetalles.getValueAt(fila, 2));
                    cant = Integer.parseInt(CantAumentar) - 1;
                    cantidad = cantidad + 1;
                    menu[pos].setCantidad(cantidad);
                    menu[pos].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: "+cantidad+"</html>");
                    tableDetalles.setValueAt(cant, fila, 2);
                    
                    idDetalle -= 1;
                    if (cant < 1) {
                        defaulttable.removeRow(fila);
                        cant = 1;
                        id = 1;
                        for (int i = 0; i < tableDetalles.getRowCount(); i++) {
                            tableDetalles.setValueAt(id, i, 1);
                            id++;
                        }
                        eliminarProducto(idProd);
                    }
                    disminuirCantProducto(idProd, cant);
                    actualizarProductoLista(idProd, nombre, cant);

                }
                if (botonAccion.getName().equals("eliminar")) {
                    /*id = CantAumentar - 1;
                    tableDetalles.setValueAt(id,fila+1, 1);*/
                    int idProd = Integer.parseInt(String.valueOf(tableDetalles.getValueAt(fila, 0)));
                    String nombre = String.valueOf(tableDetalles.getValueAt(fila, 3));
                    int CantAumentar = Integer.valueOf(String.valueOf(tableDetalles.getValueAt(fila, 2)));
                    int cantidad = boton.getCantidad();
                    int pos = boton.getPos();
                    cantidad = cantidad + CantAumentar;
                    menu[pos].setCantidad(cantidad);
                    menu[pos].setToolTipText("<html>Producto:"+nombre+"<br>Cantidad: "+cantidad+"</html>");
                    defaulttable.removeRow(fila);
                    /*id -= 1;
                    cant = 1;*/
                    id = 1;
                    for (int i = 0; i < tableDetalles.getRowCount(); i++) {
                        //int CantAumentar = Integer.parseInt(String.valueOf(tableDetalles.getValueAt(i, 1)));
                        tableDetalles.setValueAt(id, i, 1);
                        id++;
                    }
                    eliminarProducto(idProd);
                    eliminarProductoLista(idProd);

                }
                if (botonAccion.getName().equals("ver")) {
                    //String producto = String.valueOf(tableDetalles.getValueAt(fila, 1));                 
                    int idPT = Integer.parseInt(String.valueOf(tableDetalles.getValueAt(fila, 0)));
                    int idProducto = obtenerIdProducto(idPT);
                    String nom = String.valueOf(tableDetalles.getValueAt(fila, 3));
                    labelPB.setText(nom);
                    labelDesPB.setText(nom);

                    jTable1 = new JTable();
                    jTable1.setPreferredScrollableViewportSize(new Dimension(600, 70));
                    
                    if (id_solicitud != 0) {
                        eliminar();
                        if (prodBase.size() == 0) {
                            jlabelSin.setText("Sin producto base");
                            recorrerProductoBase();
                            agregarTablaDescripcion(idPT);
                        } else {

                            for (int i = 0; i < prodBase.size(); i++) {
                                int idP = prodBase.get(i).getId_pb();
                                int id = prodBase.get(i).getId_detalle();

                                if (idProducto == id) {
                                    jlabelSin.setName("");
                                    String producto = prodBase.get(i).getNombre_pb();
                                    String unidMedida = prodBase.get(i).getUnid_med_pb();
                                    Double cantUnidIdeal = prodBase.get(i).getCantU_ideal_pb();
                                    Double cantUnidModif = prodBase.get(i).getCantU_modif_pb();
                                    Double totalIdeal = prodBase.get(i).getTotal_ideal_pb();
                                    Double totalReal = prodBase.get(i).getTotal_real_pb();

                                    jTable1.setDefaultRenderer(Object.class, new RenderTable());
                                    btn3 = new JButton("+");
                                    btn3.setName("agregar");
                                    btn3.setSize(50, 30);

                                    imgSubtract = "/imagen/substract.png";
                                    sub = new ImageIcon(this.getClass().getResource(imgSubtract));
                                    iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));

                                    btn1 = new JButton(/*iconsub*/"-");
                                    btn1.setName("quitar");
                                    btn1.setSize(50, 30);

                                    Object[] data = {idDetalle, producto, unidMedida, cantUnidIdeal, cantUnidModif, totalIdeal, totalReal, btn3, btn1};
                                    idDetalle++;
                                    tablaDescripcion.addRow(data);

                                    existe = true;
                                }
                            }
                            if (existe == false) {
                                recorrerProductoBase();
                                agregarTablaDescripcion(idPT);
                            }
                        }
                        jTable1.setModel(tablaDescripcion);
                        scrollpane = new JScrollPane(jTable1);

                        jTable1MouseListener(jTable1, idProducto);
                        jTable1.setRowHeight(33);

                        jPanel2.removeAll();
                        jPanel2.repaint();
                        jPanel2.add(scrollpane);
                        jPanel2.setVisible(true);
                        jPanel2.updateUI();
                        
                    }else{
                    eliminar();
                    if (prodBase.size() == 0) {
                        jlabelSin.setText("Sin producto base");
                        recorrerProductoBase();
                        agregarTablaDescripcion(idPT);
                    } else {
                         
                        for (int i = 0; i < prodBase.size(); i++) {
                            int idP = prodBase.get(i).getId_pb();
                            int id = prodBase.get(i).getId_detalle();
                            
                            if (idPT == idP) {
                                jlabelSin.setName("");
                                String producto = prodBase.get(i).getNombre_pb();
                                String unidMedida = prodBase.get(i).getUnid_med_pb();
                                Double cantUnidIdeal = prodBase.get(i).getCantU_ideal_pb();
                                Double cantUnidModif = prodBase.get(i).getCantU_modif_pb();
                                Double totalIdeal = prodBase.get(i).getTotal_ideal_pb();
                                Double totalReal = prodBase.get(i).getTotal_real_pb();
                                
                                jTable1.setDefaultRenderer(Object.class, new RenderTable());
                                btn3 = new JButton("+");
                                btn3.setName("agregar");
                                btn3.setSize(50, 30);

                                imgSubtract = "/imagen/substract.png";
                                sub = new ImageIcon(this.getClass().getResource(imgSubtract));
                                iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));

                                btn1 = new JButton(/*iconsub*/"-");
                                btn1.setName("quitar");
                                btn1.setSize(50, 30);

                                Object[] data = {idDetalle, producto, unidMedida, cantUnidIdeal, cantUnidModif, totalIdeal, totalReal, btn3, btn1};
                                idDetalle++;
                                tablaDescripcion.addRow(data);

                                existe = true;
                            }
                        }
                        if (existe == false) {
                            recorrerProductoBase();
                            agregarTablaDescripcion(idPT);
                        }
                    }

                        jTable1.setModel(tablaDescripcion);
                        scrollpane = new JScrollPane(jTable1);

                        jTable1MouseListener(jTable1, idProducto);
                        jTable1.setRowHeight(33);

                        jPanel2.removeAll();
                        jPanel2.repaint();
                        jPanel2.add(scrollpane);
                        jPanel2.setVisible(true);
                        jPanel2.updateUI();
                    }
                }
            }
        }
    }//GEN-LAST:event_tableDetallesMouseClicked

    private void jButtonGruposActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonGruposActionPerformed
        // TODO add your handling code here
        String img = "";
        ImageIcon icon = null;
        Icon imgIcon = null;

        if (visible == false) {
            img = "/imagen/mostrar.png";
            icon = new ImageIcon(this.getClass().getResource(img));
            imgIcon = new ImageIcon(icon.getImage());
            jButtonGrupos.setIcon(icon);
            ScrollGrupos.updateUI();
            jScrollFondo.updateUI();
            ScrollGrupos.setVisible(false);
            visible = true;
        } else if (visible == true) {
            img = "/imagen/ocultar.png";
            icon = new ImageIcon(this.getClass().getResource(img));
            imgIcon = new ImageIcon(icon.getImage());
            jButtonGrupos.setIcon(icon);
            ScrollGrupos.updateUI();
            jScrollFondo.updateUI();
            ScrollGrupos.setVisible(true);
            visible = false;
        }
    }//GEN-LAST:event_jButtonGruposActionPerformed

    private void btnTotalVActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnTotalVActionPerformed
        // TODO add your handling code here:
        TotalViveres total = new TotalViveres(prodBase);
        total.setVisible(true);
    }//GEN-LAST:event_btnTotalVActionPerformed

    private void btnMostrarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnMostrarActionPerformed
        boolean estado = checkEstado.isSelected();
        
        String almacen = (String) jcomboBoxAlmacen.getSelectedItem();
        int id_almacen = obtenerIdAlmacen(almacen);
        
        jPanelMostrar.removeAll();
        jPanelMostrar.updateUI();
        jPanelMostrar.repaint();

        SeleccionarProductosPanelSinInternet(id_almacen,estado);
        this.pack();
    }//GEN-LAST:event_btnMostrarActionPerformed

    private void checkEstadoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_checkEstadoActionPerformed
        boolean estado = checkEstado.isSelected();
        if (estado == true) {
            checkEstado.setText("Con Cantidad");
        }else if (estado == false) {
            checkEstado.setText("Sin Cantidad");
        }
    }//GEN-LAST:event_checkEstadoActionPerformed

    /**
     * @param args the command line arguments
     */

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel PanelPrincipal;
    private javax.swing.JScrollPane ScrollGrupos;
    private javax.swing.JButton btnGuardar;
    private javax.swing.JButton btnMostrar;
    private javax.swing.JButton btnTotalV;
    private javax.swing.JCheckBox checkEstado;
    private javax.swing.JButton jButton2;
    private javax.swing.JButton jButtonGrupos;
    private com.toedter.calendar.JDateChooser jDate;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JPanel jPanelGrupos;
    private javax.swing.JPanel jPanelMostrar;
    private javax.swing.JScrollPane jScrollFondo;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane3;
    private javax.swing.JComboBox<String> jcomboBoxAlmacen;
    private javax.swing.JComboBox<String> jcomboBoxSucursal;
    private javax.swing.JLabel jlabelSin;
    private javax.swing.JTextField jtxtBusqueda;
    private javax.swing.JLabel labelDesPB;
    private javax.swing.JLabel labelDetalles;
    private javax.swing.JLabel labelPB;
    private javax.swing.JTable tableDetalles;
    // End of variables declaration//GEN-END:variables

    //@Override
    public void actionPerformed(ActionEvent e ) {
       
     
        boolean encontrado = false;

        boton = (JButtonProducto) e.getSource();
    
        int cantidad = boton.getCantidad();
        if (cantidad == 0) {
            JOptionPane.showMessageDialog(null, "El cantidad del producto es "+cantidad);
        }else{
           
            String nom = boton.getNombre();
            int idPro = boton.getId();
            int pos = boton.getPos();
            int nuevaCantidad = 0;
            String uniMedida = boton.getUnid_medida();
            double precio_unitario = boton.getPrecio_unitario();

            if (tableDetalles.getRowCount() == 0) {
                labelPB.setText(nom);
                labelDesPB.setText(nom);

                agregarTablaDetalle(idPro, nom, cantidad);
                nuevaCantidad = cantidad - 1;
                
                menu[pos].setCantidad(nuevaCantidad);
                menu[pos].setToolTipText("<html>Producto:"+nom+"<br>Cantidad: "+nuevaCantidad+"</html>");
                tableDetalles.setModel(defaulttable);

                tamañoTablaDetalles();
                
                //Se agrega la tabla de productos bases
                jTable1 = new JTable();
                jTable1.setModel(tablaDescripcion);
                tamañoTablaDescripcionPB();

                jTable1.setPreferredScrollableViewportSize(new Dimension(600, 70));

                eliminar();

                if (boton.getLista().size() != 0) {
                    if (prodBase.size() == 0) {
                        jlabelSin.setText("");
                        recorrerProductoBase();
                        agregarTablaDescripcion(idPro);

                    }
                } else {
                    jlabelSin.setText("Sin producto base");
                    int id_almacen = 0;
                    String nom_alma = (String) jcomboBoxAlmacen.getSelectedItem();
                    String nombre_sucursal = (String) jcomboBoxSucursal.getSelectedItem();

                    for (int i = 0; i < db.SeleccionarTodoAlmacenPorNombre(nom_alma).size(); i++) {
                        id_almacen = db.SeleccionarTodoAlmacenPorNombre(nom_alma).get(i).getId();
                    }

                    noProductosBase(0,idPro, nom, uniMedida, cant, precio_unitario, id_almacen, nombre_sucursal);
                }
            } else {
                for (int i = 0; i < tableDetalles.getRowCount(); i++) {
                    Object p = tableDetalles.getValueAt(i, 3);
                    if (p.equals(nom)) {
                        if (cantidad != 0) {
                            String CantAumentar = String.valueOf(tableDetalles.getValueAt(i, 2));
                            cant = Integer.parseInt(CantAumentar) + 1;
                            tableDetalles.setValueAt(cant, i, 2);
                            aumentarCantProducto(idPro, cant);
                            actualizarProductoLista(idPro, "", cant);
                                                      
                            nuevaCantidad = cantidad - cant;  
                            menu[pos].setCantidad(nuevaCantidad);
                            menu[pos].setToolTipText("<html>Producto:"+nom+"<br>Cantidad: "+nuevaCantidad+"</html>");
                            encontrado = true;
                        } else if (cantidad == 0){
                            JOptionPane.showMessageDialog(null, "No tiene Cantidades el producto");
                        }
                        
                    }
                }
                if (encontrado == false) {
                    labelPB.setText(nom);
                    labelDesPB.setText(nom);
                    agregarTablaDetalle(idPro, nom, 0);
                    tableDetalles.setModel(defaulttable);
                    tamañoTablaDetalles();

                    //Agrega la los prodcutos base a la tabla
                    jTable1 = new JTable();
                    jTable1.setPreferredScrollableViewportSize(new Dimension(600, 70));
                    eliminar();
                    if (boton.getLista().size() != 0) {
                        if (prodBase.size() != 0) {
                            jlabelSin.setText("");
                            recorrerProductoBase();
                            agregarTablaDescripcion(idPro);
                        }
                    } else {
                        try {
                            jlabelSin.setText("Sin producto base");
                            int id_almacen = 0;
                            String nom_alma = (String) jcomboBoxAlmacen.getSelectedItem();
                            String nombre_sucursal = (String) jcomboBoxSucursal.getSelectedItem();

                            for (int i = 0; i < db.SeleccionarTodoAlmacenPorNombre(nom_alma).size(); i++) {
                                id_almacen = db.SeleccionarTodoAlmacenPorNombre(nom_alma).get(i).getId();
                            }
                            noProductosBase(0,idPro, nom, uniMedida, cant, precio_unitario, id_almacen, nombre_sucursal);
                        } catch (Exception ex) {
                            System.out.println("Error: " + ex.getMessage());
                        }
                    }
                }
            }

            jTable1.setModel(tablaDescripcion);
            scrollpane = new JScrollPane(jTable1);
            jTable1MouseListener(jTable1, idPro);
            jTable1.setRowHeight(33);
            jPanel2.removeAll();
            jPanel2.repaint();
            jPanel2.add(scrollpane);
            jPanel2.setVisible(true);
            jPanel2.updateUI();
        }
    }

    public void tamañoTablaDetalles() {
        tableDetalles.getColumnModel().getColumn(0).setMaxWidth(0);
        tableDetalles.getColumnModel().getColumn(0).setMinWidth(0);
        tableDetalles.getColumnModel().getColumn(0).setPreferredWidth(0);

        tableDetalles.getColumnModel().getColumn(1).setMaxWidth(30);
        tableDetalles.getColumnModel().getColumn(1).setMinWidth(30);
        tableDetalles.getColumnModel().getColumn(1).setPreferredWidth(30);

        tableDetalles.getColumnModel().getColumn(2).setMaxWidth(60);
        tableDetalles.getColumnModel().getColumn(2).setMinWidth(60);
        tableDetalles.getColumnModel().getColumn(2).setPreferredWidth(60);

        tableDetalles.getColumnModel().getColumn(4).setMaxWidth(60);
        tableDetalles.getColumnModel().getColumn(4).setMinWidth(60);
        tableDetalles.getColumnModel().getColumn(4).setPreferredWidth(60);

        tableDetalles.getColumnModel().getColumn(5).setMaxWidth(60);
        tableDetalles.getColumnModel().getColumn(5).setMinWidth(60);
        tableDetalles.getColumnModel().getColumn(5).setPreferredWidth(60);

        tableDetalles.getColumnModel().getColumn(6).setMaxWidth(60);
        tableDetalles.getColumnModel().getColumn(6).setMinWidth(60);
        tableDetalles.getColumnModel().getColumn(6).setPreferredWidth(60);
    }

    public void tamañoTablaDescripcionPB() {
        jTable1.getColumnModel().getColumn(0).setMaxWidth(30);
        jTable1.getColumnModel().getColumn(0).setMinWidth(30);
        jTable1.getColumnModel().getColumn(0).setPreferredWidth(30);

        jTable1.getColumnModel().getColumn(7).setMaxWidth(60);
        jTable1.getColumnModel().getColumn(7).setMinWidth(60);
        jTable1.getColumnModel().getColumn(7).setPreferredWidth(60);

        jTable1.getColumnModel().getColumn(8).setMaxWidth(60);
        jTable1.getColumnModel().getColumn(8).setMinWidth(60);
        jTable1.getColumnModel().getColumn(8).setPreferredWidth(60);
    }

    public void noProductosBase(int id,int idPro, String nomb, String unidMedida, int cant, double precioUni, int id_almacen, String nombre_sucursal) {
        double cantUnidModif = cant;
        double totalIdeal = cant;
        double totalReal = cant;

        //System.out.println("No es producto base id: "+idPro+" nombre: "+nomb /*+" unidad medida: "+unidMedida+" cantidad "+cant*/);
        ProductosBase pb = new ProductosBase(id,idPro, nomb, unidMedida, cant, cantUnidModif, totalIdeal, totalReal, precioUni, id_almacen, nombre_sucursal);
        prodBase.add(pb);
    }

    public void eliminarProducto(int idProducto) {
        int tam = prodBase.size();
        for (int i = tam - 1; i >= 0; i--) {
            if (idProducto == prodBase.get(i).getId_pb()) {
                labelPB.setText("");
                labelDesPB.setText("");
                prodBase.remove(i);
            }
        }

        eliminar();
        jTable1.removeAll();
        jPanel2.removeAll();
        jPanel2.repaint();
        jPanel2.setVisible(false);
    }

    public void limpiar() {
        int tam = tableDetalles.getRowCount();
        for (int i = tam - 1; i >= 0; i--) {
            defaulttable.removeRow(i);

        }
        jTable1.removeAll();
        jPanel2.removeAll();
        jPanel2.repaint();
    }

    public void disminuirCantProducto(int idProducto, int cant) {

        ImageIcon imgDismi;
        Icon iconDismi;
        
        for (int i = 0; i < prodBase.size(); i++) {
            if (idProducto == prodBase.get(i).getId_pb()) {
                double calTotalIdeal = prodBase.get(i).getCantU_ideal_pb() * cant;
                prodBase.get(i).setTotal_ideal_pb(calTotalIdeal);
                double calTotalReal = prodBase.get(i).getCantU_ideal_pb() * cant;
                prodBase.get(i).setTotal_real_pb(calTotalIdeal);
            }
        }

        jTable1 = new JTable();
        jTable1.setPreferredScrollableViewportSize(new Dimension(600, 70));
        eliminar();

        for (int i = 0; i < prodBase.size(); i++) {
            if (idProducto == prodBase.get(i).getId_pb()) {
                String producto = prodBase.get(i).getNombre_pb();
                String unidMedida = prodBase.get(i).getUnid_med_pb();
                Double cantUnidIdeal = prodBase.get(i).getCantU_ideal_pb();
                Double cantUnidModif = prodBase.get(i).getCantU_modif_pb();
                Double totalIdeal = prodBase.get(i).getTotal_ideal_pb();
                Double totalReal = prodBase.get(i).getTotal_real_pb();
                jTable1.setDefaultRenderer(Object.class, new RenderTable());
                btn3 = new JButton("+");
                btn3.setName("agregar");
                btn3.setSize(50, 30);

                imgSubtract = "/imagen/substract.png";
                sub = new ImageIcon(this.getClass().getResource(imgSubtract));
                iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));          
                btn1 = new JButton(/*iconsub*/"-");
                btn1.setName("quitar");
                btn1.setSize(50, 30);
                Object[] data = {idDetalle, producto, unidMedida, cantUnidIdeal, cantUnidModif, totalIdeal, totalReal, btn3, btn1};
                idDetalle++;
                tablaDescripcion.addRow(data);
            }
        }
        jTable1.setModel(tablaDescripcion);
        scrollpane = new JScrollPane(jTable1);
        jTable1MouseListener(jTable1, idProducto);
        jTable1.setRowHeight(33);
        jPanel2.removeAll();
        jPanel2.repaint();
        jPanel2.add(scrollpane);
        jPanel2.setVisible(true);
        jPanel2.updateUI();
    }
    
    public int obtenerIdProductoPorProductoBase(int idPB){
        ResultSet rs = null;
        int id = 0;
        String consulta = "SELECT ID_PRODUCTO FROM PRODUCTO_BASE WHERE ID_PROD_BASE = "+idPB;
        try {
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                id = rs.getInt(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener el id del producto"+e);
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(AgregarProducto.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return id;
    }
    
    public void aumentarCantProducto(int idProducto, int cant) {
        ImageIcon imgAumentar;
        Icon iconAumentar;
        
        if (this.id_solicitud != 0) {
            for (int i = 0; i < prodBase.size(); i++) {
                int idPa = prodBase.get(i).getId_pb();
                int idProductoDPB = obtenerIdProductoPorProductoBase(idPa);
                if (idProducto == idProductoDPB) {
                    double calTotalIdeal = prodBase.get(i).getCantU_ideal_pb() * cant;
                    prodBase.get(i).setTotal_ideal_pb(calTotalIdeal); 
                    //System.out.println("cantidad: "+prodBase.get(i).getTotal_ideal_pb());

                    double calTotalReal = prodBase.get(i).getCantU_ideal_pb() * cant;
                    prodBase.get(i).setTotal_real_pb(calTotalIdeal);
                   // System.out.println("cantidad: "+prodBase.get(i).getTotal_real_pb());
                }
            }
        }else{
            for (int i = 0; i < prodBase.size(); i++) {
                int idPa = prodBase.get(i).getId_pb();
                //int idProductoDPB = obtenerIdProductoPorProductoBase(idPa);
                if (idProducto == idPa) {
                    double calTotalIdeal = prodBase.get(i).getCantU_ideal_pb() * cant;
                    prodBase.get(i).setTotal_ideal_pb(calTotalIdeal); 
                    //System.out.println("cantidad: "+prodBase.get(i).getTotal_ideal_pb());

                    double calTotalReal = prodBase.get(i).getCantU_ideal_pb() * cant;
                    prodBase.get(i).setTotal_real_pb(calTotalIdeal);
                   // System.out.println("cantidad: "+prodBase.get(i).getTotal_real_pb());
                }
            }
        }

        jTable1 = new JTable();
        jTable1.setPreferredScrollableViewportSize(new Dimension(600, 70));
        eliminar();
        

        for (int i = 0; i < prodBase.size(); i++) {
            if (idProducto == prodBase.get(i).getId_pb()) {
                String producto = prodBase.get(i).getNombre_pb();
                String unidMedida = prodBase.get(i).getUnid_med_pb();
                Double cantUnidIdeal = prodBase.get(i).getCantU_ideal_pb();
                Double cantUnidModif = prodBase.get(i).getCantU_modif_pb();
                Double totalIdeal = prodBase.get(i).getTotal_ideal_pb();
                Double totalReal = prodBase.get(i).getTotal_real_pb();
                jTable1.setDefaultRenderer(Object.class, new RenderTable());
                btn3 = new JButton("+");
                btn3.setName("agregar");
                btn3.setSize(50, 30);

                imgSubtract = "/imagen/substract.png";
                sub = new ImageIcon(this.getClass().getResource(imgSubtract));
                iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));

                btn1 = new JButton(/*imgSubtract*/"-");
                btn1.setName("quitar");
                btn1.setSize(50, 30);
                Object[] data = {idDetalle, producto, unidMedida, cantUnidIdeal, cantUnidModif, totalIdeal, totalReal, btn3, btn1};
                idDetalle++;
                tablaDescripcion.addRow(data);
            }
        }
        jTable1.setModel(tablaDescripcion);
        scrollpane = new JScrollPane(jTable1);
        jTable1MouseListener(jTable1, idProducto);
        jTable1.setRowHeight(33);
//        jPanel2.removeAll();
//        jPanel2.repaint();
        jPanel2.add(scrollpane);
        jPanel2.setVisible(true);
        jPanel2.updateUI();

    }

    public void agregarListaDescripcion(int id_prod, String producto, String unidMedida, String cantUnidIdeal, double precioUnit, int id_alma, String nom_sucu) {
        double cantUnidModif = Double.parseDouble(cantUnidIdeal);
        double totalIdeal = Double.parseDouble(cantUnidIdeal);
        double totalReal = Double.parseDouble(cantUnidIdeal);
        
        ProductosBase pb = new ProductosBase(0,id_prod, producto, unidMedida, Double.parseDouble(cantUnidIdeal), cantUnidModif, totalIdeal, totalReal, precioUnit, id_alma, nom_sucu);
        prodBase.add(pb);
    }

    public void recorrerProductoBase() {
        for (int i = 0; i < boton.getLista().size(); i++) {
            int id_prod = boton.getLista().get(i).getId();
            String nombre = boton.getLista().get(i).getNombre_pb();
            String unidadIdeal = boton.getLista().get(i).getUnid_med_pb();
            String cantUnidad = boton.getLista().get(i).getCantU_ideal_pb();
            double precioUnit = boton.getLista().get(i).getPrecio_unit_pb();
            int id_almacen = boton.getLista().get(i).getId_almacen();
            String nombre_Sucursal = boton.getLista().get(i).getNombre_sucursal();
            //System.out.println("PRODUCTO BASE "+id_prod+" nombre "+nombre);
            agregarListaDescripcion(id_prod, nombre, unidadIdeal, cantUnidad, precioUnit, id_almacen, nombre_Sucursal);
        }
    }

    public void agregarTablaDescripcion(int idProducto) {
        for (int i = 0; i < prodBase.size(); i++) {
            if (idProducto == prodBase.get(i).getId_pb()) {
                String producto = prodBase.get(i).getNombre_pb();
                String unidMedida = prodBase.get(i).getUnid_med_pb();
                Double cantUnidIdeal = prodBase.get(i).getCantU_ideal_pb();
                //System.out.println("double "+ cantUnidIdeal);
                Double cantUnidModif = prodBase.get(i).getCantU_modif_pb();
                double totalIdeal = prodBase.get(i).getTotal_ideal_pb();
                Double totalReal = prodBase.get(i).getTotal_real_pb();
                jTable1.setDefaultRenderer(Object.class, new RenderTable());

                btn3 = new JButton("+");
                btn3.setName("agregar");
                btn3.setSize(50, 30);

                imgSubtract = "/imagen/substract.png";
                sub = new ImageIcon(this.getClass().getResource(imgSubtract));
                iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));

                btn1 = new JButton(/*imgSubtract*/"-");
                btn1.setName("quitar");
                btn1.setSize(50, 30);
                Object[] data = {idDetalle, producto, unidMedida, cantUnidIdeal, cantUnidModif, totalIdeal, totalReal, btn3, btn1};
                idDetalle++;
                tablaDescripcion.addRow(data);

            }
        }
    }

    public void agregarTablaDetalle(int idPro, String nombre, int cantidad) {
        try {
            cant = 1;

            Object[] datos = {idPro, id, cant, nombre, btn1, btn2, btn0};
            id++;
            ProductoLista producto = new ProductoLista(idPro, nombre, cant);
            prod.add(producto);
            //System.out.println("PRODUCTO IDPRO "+idPro+" nombre "+nombre+" cant "+cant);
            defaulttable.addRow(datos);
            
            
            
        } catch (Exception e) {
            System.out.println("error: " + e);
            System.out.println(e.getMessage());
        }
    }

    public void eliminar() {
        tablaDescripcion.setRowCount(0);
        idDetalle = 1;
    }

    public void jTable1MouseListener(JTable tabla, int idProd) {
        tabla.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                int columna = tabla.getColumnModel().getColumnIndexAtX(evt.getX());
                int fila = evt.getY() / tabla.getRowHeight();

                if (fila < tabla.getRowCount() && fila >= 0 && columna < tabla.getColumnCount() && columna >= 0) {
                    Object value = tabla.getValueAt(fila, columna);

                    if (value instanceof JButton) {
                        ((JButton) value).doClick();
                        JButton botonAccion = (JButton) value;

                        if (botonAccion.getName().equals("agregar")) {
                            String producto = String.valueOf(jTable1.getValueAt(fila, 1));

                            double totalReal = Double.parseDouble(String.valueOf(jTable1.getValueAt(fila, 6)));
                            double redondeoTotalReal = totalReal + 0.1;
                            double calToReal = redondearDecimales(redondeoTotalReal);
                            jTable1.setValueAt(calToReal, fila, 6);

                            for (int i = 0; i < tableDetalles.getRowCount(); i++) {
                                int compara = Integer.parseInt(String.valueOf(tableDetalles.getValueAt(i, 0)));
                                int cantidad = Integer.parseInt(String.valueOf(tableDetalles.getValueAt(i, 2)));
                                for (int j = 0; j < prodBase.size(); j++) {
                                    int comp = prodBase.get(j).getId_pb();
                                    String nom = prodBase.get(j).getNombre_pb();

                                    if (compara == comp && nom.equals(producto)) {
                                        double cantModif = Double.parseDouble(String.valueOf(jTable1.getValueAt(fila, 4)));
                                        double redonCantModif = calToReal / cantidad;
                                        double calCantModif = redondearDecimales(redonCantModif);
                                        jTable1.setValueAt(calCantModif, fila, 4);

                                        calcularProductoBase(idProd, producto, calToReal, calCantModif);
                                    }
                                }

                            }
                            /*double cantModif = Double.parseDouble(String.valueOf(jTable1.getValueAt(fila, 4)));
                            double redonCantModif = cantModif + 0.1;
                            double calCantModif = redondearDecimales(redonCantModif);
                            jTable1.setValueAt(calCantModif, fila, 4);*/

                            //calcularProductoBase(idProd, producto, calToReal, calCantModif);
                        }
                        if (botonAccion.getName().equals("quitar")) {
                            // int idProd = Integer.parseInt(String.valueOf(jTable1.getValueAt(fila, 0)));
                            String producto = String.valueOf(jTable1.getValueAt(fila, 1));

                            double totalReal = Double.parseDouble(String.valueOf(jTable1.getValueAt(fila, 6)));
                            double redondeoTotalReal = totalReal - 0.1;
                            double calToReal = redondearDecimales(redondeoTotalReal);

                            double cantModif = Double.parseDouble(String.valueOf(jTable1.getValueAt(fila, 4)));
                            double redonCantModif = cantModif - 0.1;
                            double calCantModif = redondearDecimales(redonCantModif);

                            if (calToReal < 1 || calCantModif < 1) {
                                JOptionPane.showMessageDialog(null, "No puede ser menor la cantidad", "Advertencia", 0);
                            } else {
                                jTable1.setValueAt(calToReal, fila, 6);
                                jTable1.setValueAt(calCantModif, fila, 4);

                                calcularProductoBase(idProd, producto, calToReal, calCantModif);
                            }
                        }
                    }
                }
            }
        });
    }

    public static double redondearDecimales(double valorInicial) {
        double parteEntera, resultado;
        resultado = valorInicial;
        parteEntera = Math.floor(resultado);
        resultado = (resultado - parteEntera) * Math.pow(10, 2);
        resultado = Math.round(resultado);
        resultado = (resultado / Math.pow(10, 2)) + parteEntera;
        return resultado;
    }

    public void calcularProductoBase(int idProd, String nomPro, double totalReal, double cantModif) {
        for (int i = 0; i < prodBase.size(); i++) {
            if (idProd == prodBase.get(i).getId_pb() && nomPro.equals(prodBase.get(i).getNombre_pb())) {
                prodBase.get(i).setCantU_modif_pb(cantModif);
                prodBase.get(i).setTotal_real_pb(totalReal);
            }
        }
    }
    
    public int obtenerIdProducto(int id){
        ResultSet rs = null;
        String consulta = "SELECT PRODUCTO FROM DETALLE_SOLICITUD_PRODUCTO WHERE ID = "+id;
        int producto = 0; 
        try{
            rs = db.seleccionar(consulta);
            while (rs.next()) {                
                producto = rs.getInt(1);
            }         
        }catch(Exception e){
            System.out.println("Error en el id: "+e);
        }
        return producto;
    }
    
    public void actualizarProductoLista(int idProd, String nombre, int cant) {    
        if (this.id_solicitud != 0) {
            for (int i = 0; i < prod.size(); i++) {
                int id = prod.get(i).getId();
                int idP = obtenerIdProducto(id);

                if (idP == idProd) {
                    prod.get(i).setCantidad(cant);
                }
            }
        }else{
            for (int i = 0; i < prod.size(); i++) {
                int id = prod.get(i).getId();
                if (id == idProd) {
                    prod.get(i).setCantidad(cant);
                }
            }
        }

    }

    public void eliminarProductoLista(int idProd) {
        int tam = prod.size();
        for (int i = tam - 1; i >= 0; i--) {
            if (idProd == prod.get(i).getId()) {
                prod.remove(i);
            }
        }
    }
    
    public String obtenerNombreProducto(int idProducto){
        ResultSet rs = null;
        String nombre = "";
        String consulta = "SELECT NOMB_PROD \n" +
            "FROM PRODUCTO\n" +
            "WHERE ID_PROD = "+idProducto;
        try {
            rs = db.seleccionar(consulta);
            while(rs.next()){
                nombre = rs.getString(1);
            }
        } catch (Exception e) {
            System.out.println("Error al obtener el nombre del producto"+e);
            
        }finally{
            try {
                rs.close();
                db.Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(AgregarProducto.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return nombre;
    }
    
    public double obtenerPrecioUnitarioPB(int idP, int idPB){
        ResultSet rs = null;
        double precio = 0;
        String consulta = "SELECT PRECIO_UNI_PB FROM PRODUCTO_BASE WHERE ID_PROD_BASE = "+idPB+" AND ID_PRODUCTO = "+idP;
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                precio = rs.getDouble(1);
            }
        }catch(Exception e){
            System.out.println("Error al obtener el precio del producto base: "+e.getMessage());
        }
          return precio ;  
    }
    
    public String obtenerUnidadMedidaPB(int idP,int idPB){
       ResultSet rs = null;
        String unidad = "";
        String consulta = "SELECT UNI_MEDI_PB FROM PRODUCTO_BASE WHERE ID_PROD_BASE = "+idPB+" AND ID_PRODUCTO = "+idP;
        try{
            rs = db.seleccionar(consulta);
            while(rs.next()){
                unidad = rs.getString(1);
            }
        }catch(Exception e){
            System.out.println("Error al obtener el precio del producto base: "+e.getMessage());
        }
          return unidad ; 
    }
    
    public void SolicitudesActualizar(int id, ArrayList<solicitudReposicion> solicitud, ArrayList<detalleSolicitudProducto> dProducto, ArrayList<detalleSolicitudProductoBase> detallePB) {
        int idAlmacen = 0;
        int num = 1;
        
        for (int i = 0; i < solicitud.size(); i++) {
            idAlmacen = solicitud.get(i).getAlmacen();
        }
        for (int i = 0; i < dProducto.size(); i++) {
            int idDP = dProducto.get(i).getId();
            //int c=(int)Double.parseDouble(cls.get(0));
            int cantidad = (int) dProducto.get(i).getCantidad();
            int producto = dProducto.get(i).getProducto();
            String nombreProducto =  obtenerNombreProducto(producto);
 
            Object[] datos = {idDP,num,cantidad,nombreProducto,btn1, btn2, btn0};
            defaulttable.addRow(datos);
            //String nombreSucursal = obtenerNombreProducto(producto);
            ProductoLista SolicitudProducto = new ProductoLista(idDP, nombreProducto, cantidad);
            prod.add(SolicitudProducto);
            num++;
        }
        tableDetalles.setModel(defaulttable);
        tamañoTablaDetalles();
        
        
        for (int i = 0; i < dProducto.size(); i++) {
            int idDP = dProducto.get(i).getId();
            int idNombrePro = dProducto.get(i).getProducto();
            int cantPro = (int) dProducto.get(i).getCantidad();
            
            for (int j = 0; j < detallePB.size(); j++) {
                int detalleSoliciProduc = detallePB.get(j).getDetalle_solicitud_producto();
                if (idDP == detalleSoliciProduc) {
                    
                    int idPB = detallePB.get(j).getId();                  
                    int productoBase = detallePB.get(j).getProducto_base();
                    String nombreProBase = obtenerNombrePB(productoBase);
                    int detalleProductoBase = detallePB.get(j).getDetalle_solicitud_producto();
                    double cant_ideal_pb = detallePB.get(j).getCantidad_ideal();
                    double cant_real_pb = detallePB.get(j).getCantidad_real();
                    double precioUnitario = obtenerPrecioUnitarioPB(idNombrePro, productoBase);
                    String unidadMedida = obtenerUnidadMedidaPB(idNombrePro,productoBase);
                    double total = detallePB.get(j).getTotal();
                    double totalIdeal = cant_ideal_pb * cantPro ;
                    double totalReal = cant_real_pb * cantPro ;
                            
                    Object[] data = {num,nombreProBase,unidadMedida,cant_ideal_pb,cant_real_pb,totalIdeal,totalReal, btn3, btn1};
                    tablaDescripcion.addRow(data);
                     
 //ProductosBase pb = new ProductosBase(0,id_prod, producto, unidMedida, Double.parseDouble(cantUnidIdeal), cantUnidModif, totalIdeal, totalReal, precioUnit, id_alma, nom_sucu);

                    //si hay error ver el idNombreProducto o cambiar por productoBase       
                    ProductosBase listaDPB = new ProductosBase(idNombrePro, idNombrePro, nombreProBase, unidadMedida, cant_ideal_pb, cant_real_pb, totalIdeal, totalReal, precioUnitario, idAlmacen, nombreSucursal);
                    prodBase.add(listaDPB);                    
                    num = num + 1;                           
                }
            }
            jTable1.setModel(tablaDescripcion);
        }
        /*ResultSet rs1 = null;
        ResultSet rs2 = null;
        ResultSet rs3 = null;
        ResultSet rs4 = null;
        String consulta_p = "";
        String consulta1_p = "";
        String consulta2_p = "";
        String consulta3_p = "";
        int id_deta_pro = 0;
        int producto = 0;
        int cantidad = 0;
        int id_prod = 0;
        int num = 0;

        int id_pb = 0;
        String consulta_pb = "";
        String consulta1_pb = "";

        double cant_ideal_pb = 0.0;
        double cant_real_pb = 0.0;
        String nombre_pb = "";
        String nombre_p = "";
        String unid_med_pb = "";
        double total = 0.0;
        double precio_pb = 0.0;

        double totalIdeal = 0.0;
        double totalReal = 0.0;
        id_detalle = id;
        //System.out.println("id "+id+" almacen "+id_almacen);
        try {     
            
            consulta1_p = "SELECT DSP.ID, DSP.PRODUCTO,DSP.CANTIDAD, P.NOMB_PROD,P.UNID_MEDID \n" +
                "FROM DETALLE_SOLICITUD_PRODUCTO AS DSP\n" +
                "INNER JOIN PRODUCTO AS P ON DSP.PRODUCTO = P.ID_PROD\n" +
                "WHERE DSP.SOLICITUD = "+id+" AND P.ID_ALM = "+ id_almacen;
            rs1 = db.consultasSelectSolicitud(consulta1_p);
            while (rs1.next()) {
                id_deta_pro = rs1.getInt(1);
                producto = rs1.getInt(2);
                cantidad = rs1.getInt(3);
                nombre_p = rs1.getString(4);
                totalIdeal = cant_ideal_pb * cantidad;
                totalReal = cant_real_pb * cantidad;
              //  System.out.println("id prod "+id_prod+" nombre pro "+nombre_pb);
              
                tamañoTablaDetalles();
                agregarTablaDetalle(producto, nombre_p, cantidad);            
              //noProductosBase(0,rs2.getInt(2), rs2.getString(4), rs2.getString(5), cantidad, 1.0, id_almacen, nombreSucursal);
                tableDetalles.setModel(defaulttable);
                //System.out.println("id "+id_deta_pro+" prod "+producto+" cant "+cantidad+" nombre "+nombre_p);                      
                
                if (tieneProductosBase(id_deta_pro,producto) == true) {
                    int idDetaPro = id_deta_pro;
                    System.out.println("tiene "+idDetaPro);
                    //PB.ID_PRODUCTO,PB.NOMBRE_PB,PB.UNI_MEDI_PB,PB.CANT_UNI_IDEAL,PB.PRECIO_UNI_PB,DSPB.CANTIDAD_IDEAL,DSPB.CANTIDAD_REAL,DSP.CANTIDAD
                   
                    String consulta = "SELECT PB.ID_PRODUCTO,PB.NOMBRE_PB,PB.UNI_MEDI_PB,PB.PRECIO_UNI_PB,DSP.CANTIDAD,DSPB.CANTIDAD_IDEAL,DSPB.CANTIDAD_REAL\n" +
                        "from SOLICITUD_REPOSICION AS S\n" +
                        "INNER JOIN DETALLE_SOLICITUD_PRODUCTO AS DSP ON DSP.SOLICITUD = S.ID\n" +
                        "INNER JOIN DETALLE_SOLICITUD_PRODUCTO_BASE AS DSPB ON DSPB.DETALLE_SOLICITUD_PRODUCTO = DSP.ID\n" +
                        "INNER JOIN PRODUCTO_BASE AS PB ON DSPB.PRODUCTO_BASE = PB.ID_PROD_BASE\n" +
                        "INNER JOIN PRODUCTO AS P ON DSP.PRODUCTO = P.ID_PROD AND S.ALMACEN = P.ID_ALM\n" +
                        "WHERE S.ALMACEN= "+id_almacen+" AND DSP.ID = "+idDetaPro;
                    rs2 = db.selectProductosBase(consulta);
                    while (rs2.next()) {                        
                        id_prod = rs2.getInt(1);
                        nombre_pb = rs2.getString(2);
                        unid_med_pb = rs2.getString(3);
                        precio_pb = Double.parseDouble(rs2.getString(4).toString());
                        cantidad =  rs2.getInt(5);
                        cant_ideal_pb = rs2.getDouble(6);
                        cant_real_pb = rs2.getDouble(7);
                        //total = rs2.getDouble(6);
                        totalIdeal = cant_ideal_pb * cantidad;
                        totalReal = cant_real_pb * cantidad;

         ProductosBase pb = new ProductosBase(0, id_prod, nombre_pb, unid_med_pb, cant_ideal_pb, cant_real_pb, totalIdeal, totalReal, precio_pb, id_almacen, "");
                        prodBase.add(pb);
                    }
                    
                    String consulta1 = "SELECT P.ID_PROD,P.NOMB_PROD,P.UNID_MEDID,DSP.CANTIDAD,P.PRECIO_UNIT \n" +
                        "FROM DETALLE_SOLICITUD_PRODUCTO AS DSP\n" +
                        "INNER JOIN PRODUCTO AS P ON DSP.PRODUCTO =P.ID_PROD\n" +
                        "WHERE DSP.ID = "+id_deta_pro+" AND P.ID_ALM = "+id_almacen;
                    rs3 = db.selectProductos(consulta1);
                    while (rs3.next()) {                        
                        id_prod = rs3.getInt(1);
                        nombre_p = rs3.getString(2);
                        unid_med_pb = rs3.getString(3);
                        cantidad = (int) rs3.getDouble(4);
                        precio_pb = Double.parseDouble(rs3.getString(5).toString());

                        noProductosBase(0, id_prod, nombre_p, unid_med_pb, cantidad, precio_pb, id_almacen, "");
    
                    }        
                }         
            }
            for (int i = 0; i < prodBase.size(); i++) {
                System.out.println(" nombre "+prodBase.get(i).getNombre_pb());
            }
                     
        } catch (Exception e) {
            System.out.println("Error al cargar los producto: " + e.getMessage());
        }*/
    }
    
    public boolean tieneProductosBase(int id,int producto){
        boolean resultado = false;
        String consulta = "SELECT PRODUCTO_BASE FROM DETALLE_SOLICITUD_PRODUCTO_BASE WHERE DETALLE_SOLICITUD_PRODUCTO = "+id;
        ResultSet rs = db.selectProductosBase(consulta);
        try {
            while (rs.next()) {                
                if (rs.getInt(1)!=0) {
                    resultado = true;
                }
            }
        } catch (Exception e) {
            System.out.println("Error "+e);
        }
        return resultado;
    }
   
}
