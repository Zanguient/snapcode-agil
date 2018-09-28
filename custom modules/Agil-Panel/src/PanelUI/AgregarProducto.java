/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package PanelUI;

import com.agil.nuevo.*;
import static com.sun.org.apache.xalan.internal.lib.ExsltDatetime.date;
import static com.sun.org.apache.xalan.internal.lib.ExsltDatetime.date;
import static com.sun.org.apache.xalan.internal.lib.ExsltDatetime.date;
import com.sun.prism.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.*;
import java.awt.event.ComponentListener;
import java.awt.event.*;
import java.awt.image.*;
import java.net.*;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableColumn;
import javax.swing.table.TableColumnModel;
import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.net.ssl.HttpsURLConnection;
import models.Database.*;
import models.*;
import org.json.*;

import models.*;

/**
 *
 * @author AGIL
 */
public class AgregarProducto extends javax.swing.JFrame implements ActionListener {

    Login login = new Login();
    JSONObject datosUsuario;
    int id_usuario;
    int id_solicitud;
    int id_detalle = 0;
    
    Database db = new Database();
    DateFormat df = DateFormat.getDateInstance();
    public String nombreSucursal = null;
    JButtonProducto menu[] = null;
    JButtonProducto containFiltro;

    ImageIcon img;
    Icon icon;

    ImageIcon del;
    Icon icondel;

    ImageIcon sub;
    Icon iconsub;

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
    DecimalFormat decimales;

    boolean visible = false;

    /**
     * Creates new form AgregarProducto
     */
    private void InsertSucursal(int id_usu) throws JSONException {

        int IdAutenticar = this.datosUsuario.getJSONObject("data").getInt("id");

        String url = "/autenticar-sucursales/" + IdAutenticar;

        JSONArray res = RestServer.getJSONArray(url);
        for (int i = 0; i < res.length(); i++) {
            JSONObject data = res.getJSONObject(i);
            String nombre = data.getJSONObject("sucursal").getString("nombre");
            int id = data.getInt("id_sucursal");
           
         //   db.insertarSucursal(id, nombre, id_usu);
        }
    }

    private void comboSucursal() {
        
        //for (int i = 0; i < db.SeleccionarSucursal(this.id_usuario).size(); i++) {
            //System.out.println("Seleccionado " + db.SeleccionarSucursal(this.id_usuario).get(i).getNombre());
            //jcomboBoxSucursal.addItem(db.SeleccionarSucursal(this.id_usuario).get(i).getNombre());
        //}
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
                    img = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\icon-producto-default.png");
                    icon = new ImageIcon(img.getImage().getScaledInstance(80, 90, 1));

                    listaGrupos[i] = new JButtonProducto(id_prod, nombre_pro, unid_medid, preci_unit_pro, producto, nombre_pro, icon);

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

    private void SeleccionarProductosPanelSinInternet(int id_almacen) {

        //int id_alma = 0;
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
            ResultSet rs = db.selectProductos("SELECT * FROM PRODUCTO WHERE ID_ALM = " + id_almacen);
            while (rs.next()) {

                id_prod = rs.getInt(2);
                nombre = rs.getString(4);
                uni_med = rs.getString(5);
                pre_unit = Double.parseDouble(rs.getString(6));
                //System.out.println("Id: " + rs.getInt(1) + " Id Pro" + rs.getInt(2) + " ID ALM" + rs.getInt(3) + " Nombre: " + rs.getString(4) + " Unidad " + rs.getString(5) + " Precio " + rs.getString(6));

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
                    // System.out.println(" - "+id_pro+" - "+nom_pb );

                    String consulta = "select s.NOMBRE from sucursal s inner join almacen a on a.ID_SUCURSAL = s.ID where a.ID=" + id_almacen;
                    ResultSet rss = db.SeleccionarSucursalPorId(consulta);
                    while (rss.next()) {
                        nombre_sucursal = rss.getString(1);
                        //System.out.println("nombre: "+rss.getString(1)+" id alm "+id_alma+" nombre producto "+nombre);
                    }
                    JButtonProducto productoBase = new JButtonProducto(id_pro, nom_pb, uni_med_pb, prec_unit_pb, cantUni_ideal_pb, id_almacen, nombre_sucursal);
                    productos.add(productoBase);
                }

                String imagenIcon = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\icon-producto-default.png";

                img = new ImageIcon(imagenIcon);
                icon = new ImageIcon(img.getImage().getScaledInstance(80, 90, 1));
                menu[i] = new JButtonProducto(id_prod, nombre, uni_med, pre_unit, productos, nombre, icon);
                menu[i].setVerticalTextPosition(SwingConstants.BOTTOM);
                menu[i].setHorizontalTextPosition(SwingConstants.CENTER);
                menu[i].setPreferredSize(new Dimension(100, 150));

                menu[i].addActionListener(this);
                jPanelMostrar.add(menu[i]);
                i++;

            }
        } catch (Exception e) {
            System.out.println("error: " + e.getMessage());
        }
    }

    private void SeleccionarProductosPanel(int id_almacen) /*throws JSONException*/ {

        int id_alma = 0;
        int id_producto = 0;
        String nombreProducto = "";
        String unidad_medida = "";
        String precio_unitario = "";
        double prec_unit = 0;
        String nombre_sucursal = "";
        int id_grupo = 0;
        int id_subgrupo = 0;
        int id_pb = 0;
        String imagen = "";
        int idEmp = 0; 
        
        for (int i = 0; i < db.seleccionarIdEmpresa(this.id_usuario).size(); i++) {
            idEmp = db.seleccionarIdEmpresa(this.id_usuario).get(i).getId_empresa();
        }     
        //jPanelMostrar.removeAll();
        String url = "/productos-panel/empresa/"+idEmp+"/almacen/"+id_almacen+"/user/"+this.id_usuario;
             
        try {
            JSONArray res = RestServer.getJSONArray(url);
            Thread.sleep(1100); 
            
           // menu = new JButtonProducto[res.length()];

            for (int i = 0; i < res.length(); i++) {
                JSONObject data = res.getJSONObject(i);
           //     System.out.println(data);
                id_producto = data.getInt("id");
                nombreProducto = data.getString("nombre");
                unidad_medida = (String) data.get("unidad_medida").toString();
                precio_unitario = (String) data.get("precio_unitario").toString();
                imagen = data.get("imagen").toString();
                id_alma = id_almacen;
                id_grupo = ((String) data.get("id_grupo").toString() == "null") ? 0 : Integer.parseInt(data.get("id_grupo").toString());
                id_subgrupo = ((String) data.get("id_subgrupo").toString() == "null") ? 0 : Integer.parseInt(data.get("id_subgrupo").toString());

                if (precio_unitario == "null" || precio_unitario == null) {
                    prec_unit = 0.0;
                    db.insertarProductos(id_alma, id_producto, nombreProducto, unidad_medida, prec_unit, id_grupo, id_subgrupo);
                } else if (precio_unitario != "null" || precio_unitario != null) {
                    prec_unit = Double.parseDouble(precio_unitario);
                    db.insertarProductos(id_alma, id_producto, nombreProducto, unidad_medida, prec_unit, id_grupo, id_subgrupo);
//                    System.out.println("almacen " + id_alma + " id_producto " + id_producto + " nombre " + nombreProducto + " unidad " + unidad_medida
//                            + " precio " + prec_unit);
                }

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
                    inv_cost_unit = inventario.getInt("costo_unitario");
                    inv_cost_to = inventario.getInt("costo_total");

                    inv_lote = (String) inventario.get("lote").toString();

                    inv_fecha_venci = (String) inventario.get("fecha_vencimiento").toString();
                    inv_createdAt = (String) inventario.get("createdAt").toString();
                    inv_updatedAt = (String) inventario.get("updatedAt").toString();

    //System.out.println("id "+inv_id+" id_alma "+inv_id_alma+" id pro "+inv_id_pro+" cant "+inv_cant);                
                    db.insertarInventario(inv_id, inv_id_alma, inv_id_pro, inv_cant, inv_cost_unit, inv_cost_to, inv_fecha_venci, inv_lote, inv_createdAt, inv_updatedAt);

                }

          //      ArrayList<JButtonProducto> productos = new ArrayList();

                //Ingresamos los productos  base             
                JSONArray productosBase = data.getJSONArray("productosBase");

                for (int j = 0; j < productosBase.length(); j++) {
                    JSONObject prodBase = productosBase.getJSONObject(j);
        
                    String cantU_ideal_pb = prodBase.getString("formulacion");
                    id_pb = prodBase.getInt("id_producto_base");

                    String nombre_pb = prodBase.getJSONObject("productoBase").getString("nombre");
                    String unid_med_pb = prodBase.getJSONObject("productoBase").getString("unidad_medida");
                    int precio_unit_pb = prodBase.getJSONObject("productoBase").getInt("precio_unitario");
                    
                    //System.out.println("cant: "+cantU_ideal_pb+" nombre "+nombre_pb+" unidad "+unid_med_pb+" precio "+precio_unit_pb);
                    db.insertarProductosBase(id_producto, id_pb, nombre_pb, unid_med_pb, precio_unit_pb, cantU_ideal_pb);

                    JSONArray inventariosPb = prodBase.getJSONObject("productoBase").getJSONArray("inventarios");
                    for (int k = 0; k < inventariosPb.length(); k++) {
                        JSONObject inventariospb = inventariosPb.getJSONObject(k);
                      //  System.out.println(inventariospb);
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

        //System.out.println("id "+inv_id+" id_alma "+inv_id_alma+" id pro "+inv_id_pro+" cant "+inv_cant);                
                        db.insertarInventario(inv_id, inv_id_alma, inv_id_pro, inv_cant, inv_cost_unit, inv_cost_to, inv_fecha_venci, inv_lote, inv_createdAt, inv_updatedAt);
                    }
                    
            
                  /*  int id_pro = 0;
                    String nom_pb = "";
                    String uni_med_pb = "";
                    int prec_unit_pb = 0;
                    String cantUni_ideal_pb = "";
                    int id_Pb = 0;
                    ResultSet rs = db.selectProductosBase("SELECT * FROM PRODUCTO_BASE WHERE ID_PRODUCTO=" + id_producto + " AND ID_PROD_BASE=" + id_pb);
                    while (rs.next()) {
                        id_pro = rs.getInt(1);
                        nom_pb = rs.getString(2);
                        uni_med_pb = rs.getString(3);
                        cantUni_ideal_pb = rs.getString(4);
                        prec_unit_pb = rs.getInt(5);
                        id_Pb = rs.getInt(6);
                        
       //     System.out.println("SELECCIONO PRODUCTOS BASE");            
       //     System.out.println("Id: "+rs.getInt(1)+" Nombre: "+rs.getString(2)+" Unidad "+rs.getString(3)+" cantidad "+rs.getString(4)+" Precio "+rs.getInt(5)+" IdPB "+rs.getInt(6));
                  
                    }
                    JButtonProducto productoBase = new JButtonProducto(id_pro, nom_pb, uni_med_pb, prec_unit_pb, cantUni_ideal_pb, id_alma, nombre_sucursal);
                    productos.add(productoBase);*/

                }
            /*    String imagenIcon = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\icon-producto-default.png";

                img = new ImageIcon(imagenIcon);
                icon = new ImageIcon(img.getImage().getScaledInstance(80, 90, 1));
                //menu[i] = new JButtonProducto(id_prod, nombreP,unidad_medida,precio_unit,productos, nombreP, null);
                int id_prod = 0;
                String nombre = "";
                String uni_med = "";
                double pre_unit = 0.0;
                int cantidad = 0;
                try {
                    ResultSet rs = db.selectProductos("SELECT * FROM PRODUCTO WHERE ID_PROD=" + id_producto + " and ID_ALM=" + id_alma);
                    while (rs.next()) {
                        id_prod = rs.getInt(2);
                        nombre = rs.getString(4);
                        uni_med = rs.getString(5);
                        pre_unit = Double.parseDouble(rs.getString(6));
                
                    }

                    String consulta = "select s.NOMBRE from sucursal s inner join almacen a on a.ID_SUCURSAL = s.ID where a.ID=" + id_alma;
                    ResultSet rss = db.SeleccionarSucursalPorId(consulta);
                    while (rss.next()) {
                        nombre_sucursal = rss.getString(1);
                        //System.out.println("nombre: "+rss.getString(1)+" id alm "+id_alma+" nombre producto "+nombre);
                    }

                } catch (Exception e) {
                    System.out.println("error: " + e.getMessage());
                }

                menu[i] = new JButtonProducto(id_prod, nombre, uni_med, pre_unit, productos, nombre, icon);
                // menu[i].setToolTipText("Cantidad ");
                menu[i].setVerticalTextPosition(SwingConstants.BOTTOM);
                menu[i].setHorizontalTextPosition(SwingConstants.CENTER);
                menu[i].setPreferredSize(new Dimension(100, 150));
                //se copia los menus a un filtro           

                menu[i].addActionListener(this);
                jPanelMostrar.add(menu[i]);*/
            }
        } catch (Exception e) {
            System.out.println(e);
            System.out.println("Error: " + e.getMessage());
        }
      /*  pack();
        jPanelMostrar.updateUI();
        jPanelMostrar.setVisible(true);*/

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
        //System.out.println(id_almacen);

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
                containFiltro = new JButtonProducto(id_prod, nomb_prod, unid_med, prec_unit, producto, nomb_prod, null);
                filtro.add(containFiltro);

            }
        } catch (SQLException ex) {
            System.out.println("Error: " + ex);
        }

        filtroPanel = new JButtonProducto[filtro.size()];
        jPanelMostrar.removeAll();
        for (int j = 0; j < filtro.size(); j++) {
            try {
                img = new ImageIcon("C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\icon-producto-default.png");
                icon = new ImageIcon(img.getImage().getScaledInstance(80, 90, 1));

                filtroPanel[j] = new JButtonProducto(filtro.get(j).getId(), filtro.get(j).getNombre(), filtro.get(j).getUnid_medida(), filtro.get(j).getPrecio_unitario(), filtro.get(j).getLista(), filtro.get(j).getNombre(), icon);
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

    public AgregarProducto(int id_usuario, int id_solicitud, int id_almacen, String nombre_sucur,boolean ver) {
        initComponents();
        setLocationRelativeTo(null);
        this.id_usuario = id_usuario;
        jButton1.setVisible(ver);
        agregarFecha();
//        int s_almacen = solicitud_almacen;
//        int s_sucursal = solicitud_sucursal;        
        comboSetSucursal(nombre_sucur);
        InsertarGruposSinRed();

        String columnas[] = {"id", "#", "Cantidad", "Producto", "Quitar", "Eliminar", "Ver"};
        defaulttable = new DefaultTableModel(null, columnas);

        //TableColumnModel columnModel = tableDetalles.getColumnModel();
        imgSubtract = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\substract.png";
        imgDelete = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\delete.png";

        del = new ImageIcon(imgDelete);
        icondel = new ImageIcon(del.getImage().getScaledInstance(20, 20, 1));

        sub = new ImageIcon(imgSubtract);
        iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));

        tableDetalles.setDefaultRenderer(Object.class, new RenderTable());

        btn0 = new JButton("Ver");
        btn0.setName("ver");
        btn1 = new JButton(iconsub);
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
        SolicitudesActualizar(id_solicitud, id_almacen);

    }

    public AgregarProducto(int id_usuario) throws JSONException {
        initComponents();
        setLocationRelativeTo(null);
        agregarFecha();
        this.id_usuario = id_usuario;

     /*   comboSucursal();
        InsertarGrupos();
        String columnas[] = {"id", "#", "Cantidad", "Producto", "Quitar", "Eliminar", "Ver"};
        defaulttable = new DefaultTableModel(null, columnas);

        imgSubtract = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\substract.png";
        imgDelete = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\delete.png";

        del = new ImageIcon(imgDelete);
        icondel = new ImageIcon(del.getImage().getScaledInstance(20, 20, 1));

        sub = new ImageIcon(imgSubtract);
        iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));

        tableDetalles.setDefaultRenderer(Object.class, new RenderTable());

        btn0 = new JButton("Ver");
        btn0.setName("ver");
        btn1 = new JButton(icondel);
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
        jScrollFondo.updateUI();*/
    }

    public AgregarProducto(JSONObject datosUsuarios, int id_usuario) throws JSONException {

        initComponents();
        setLocationRelativeTo(null);
        agregarFecha();
        this.datosUsuario = datosUsuarios;
        this.id_usuario = id_usuario;

        // filtro = new ArrayList();
       // InsertSucursal(this.id_usuario);
       // comboSucursal();
       // InsertarAlmacen();
      //  InsertarGrupos();

        String columnas[] = {"id", "#", "Cantidad", "Producto", "Quitar", "Eliminar", "Ver"};
        defaulttable = new DefaultTableModel(null, columnas);

        //TableColumnModel columnModel = tableDetalles.getColumnModel();
        imgSubtract = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\substract.png";
        imgDelete = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\delete.png";

        del = new ImageIcon(imgDelete);
        icondel = new ImageIcon(del.getImage().getScaledInstance(20, 20, 1));

        sub = new ImageIcon(imgSubtract);
        iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));

        tableDetalles.setDefaultRenderer(Object.class, new RenderTable());

        btn0 = new JButton("Ver");
        btn0.setName("ver");
        btn1 = new JButton(iconsub);
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
        jButton1 = new javax.swing.JButton();
        jButton2 = new javax.swing.JButton();
        jPanel1 = new javax.swing.JPanel();
        jtxtBusqueda = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
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

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setBackground(new java.awt.Color(255, 255, 255));
        setName("frame"); // NOI18N

        PanelPrincipal.setBackground(new java.awt.Color(255, 255, 255));

        jPanel3.setBackground(new java.awt.Color(255, 0, 0));

        jDate.setBorder(javax.swing.BorderFactory.createBevelBorder(javax.swing.border.BevelBorder.RAISED));

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

        jcomboBoxAlmacen.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Seleccione..." }));
        jcomboBoxAlmacen.setCursor(new java.awt.Cursor(java.awt.Cursor.DEFAULT_CURSOR));
        jcomboBoxAlmacen.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jcomboBoxAlmacenActionPerformed(evt);
            }
        });

        jLabel3.setBackground(new java.awt.Color(255, 255, 255));
        jLabel3.setForeground(new java.awt.Color(255, 255, 255));
        jLabel3.setText("ALMACEN");

        jButton1.setBackground(new java.awt.Color(204, 204, 204));
        jButton1.setText("GUARDAR");
        jButton1.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
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

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jDate, javax.swing.GroupLayout.DEFAULT_SIZE, 135, Short.MAX_VALUE)
                    .addComponent(jLabel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
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
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 304, Short.MAX_VALUE)
                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 84, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(28, 28, 28)
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
                        .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 44, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jButton2, javax.swing.GroupLayout.PREFERRED_SIZE, 44, javax.swing.GroupLayout.PREFERRED_SIZE)))
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
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
            .addGroup(PanelPrincipalLayout.createSequentialGroup()
                .addComponent(jScrollFondo, javax.swing.GroupLayout.PREFERRED_SIZE, 1322, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
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
            .addComponent(PanelPrincipal, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addGap(0, 11, Short.MAX_VALUE)
                .addComponent(PanelPrincipal, javax.swing.GroupLayout.PREFERRED_SIZE, 729, javax.swing.GroupLayout.PREFERRED_SIZE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
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
            //prodBase
            int id_usuario = this.id_usuario;

            String Nombre_Sucursal = (String) jcomboBoxAlmacen.getSelectedItem();
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
                if (!this.jDate.getDate().toString().isEmpty()) {
                    long d = fecha.getTime();
                    java.sql.Date fechaSelec = new java.sql.Date(d);
                    for (int i = 0; i < prodBase.size(); i++) {
                        precio = prodBase.get(i).getTotal_real_pb() * prodBase.get(i).getPrecio_unitario();
                        monto += precio;
                 
                    }             
                    //System.out.println(id_detalle);
                    if(id_detalle != 0){
                        java.sql.Date fechaCreada = null;
                        db.actualizarSolicitudReposicion(id_detalle,id_alm_repo,fechaSelec,id_usuario,activo,eliminado,fechaAct,monto,Nombre_Sucursal);
                        id_solici_repo = db.seleccionarSolicitudReposicionId();
                        
                        borrarActiguosDatos(id_detalle);
                        
                        for (int i = 0; i < prod.size(); i++) {
                            id_prod = prod.get(i).getId();
                            nombre_pro = prod.get(i).getNombre();
                            cant_pro = prod.get(i).getCantidad();
                            // System.out.println("id "+prod.get(i).getId()+" nombre "+prod.get(i).getNombre()+" cant "+prod.get(i).getCantidad());  
                            
                            String consulta = "SELECT CREATEDAT FROM SOLICITUD_REPOSICION WHERE ID = "+id_detalle ;
                            rs = db.selectProductos(consulta);
                            while(rs.next()){
                                fechaCreada = rs.getDate(1);
                            }
                            db.insertarSolicitudProducto(id_solici_repo, id_prod, cant_pro, fechaCreada ,fechaAct);

                            id_Detalle_Producto = db.seleccionarDetalleSoliciProducto();
                            for (int j = 0; j < prodBase.size(); j++) {
                                if (id_prod == prodBase.get(j).getId_pb()) {
                                    int prod_base = prodBase.get(j).getId_pb();
                                    total = prodBase.get(j).getTotal_real_pb();
                                    String nomb_pb = prodBase.get(j).getNombre_pb();
                                    double canti_ideal = prodBase.get(j).getCantU_ideal_pb();
                                    double canti_real = prodBase.get(j).getCantU_modif_pb();

                                    String sucursal = "SELECT * FROM PRODUCTO_BASE WHERE ID_PRODUCTO=" + prod_base + " AND NOMBRE_PB='" + nomb_pb + "'";
                                    ResultSet rspb = db.selectProductosBase(sucursal);
                                    while (rspb.next()) {
                                        id_pb = rspb.getInt(6);
//                                  System.out.println("Id pro "+rspb.getInt(6)+"nombre "+nomb_pb+
//                                  " canti ideal "+canti_ideal+" canti real "+canti_real+" fecha "+fechaAct+" monto "+total);               
                                    }
                                    db.insertarDetalleSolicitudProductoBase(id_Detalle_Producto, id_pb, canti_ideal, canti_real, fechaCreada, fechaAct, total);
                                    id_pb = 0;
                                }
                            }
                        }
                        JOptionPane.showMessageDialog(null, "Se guardaron los datos");
                        limpiar();
                        prodBase.removeAll(prodBase);
                        //jDate.setDate(null);
                        jTable1.updateUI();
                        idDetalle = 1;
                        cant = 1;
                        
                    }else if(id_detalle == 0){
                       
                        if (db.ingresarSolicitudReposicion(id_alm_repo, fechaSelec, id_usuario, activo, eliminado, fechaAct, monto, Nombre_Sucursal) == true) {
                        id_solici_repo = db.seleccionarSolicitudReposicionId();
                        for (int i = 0; i < prod.size(); i++) {
                            id_prod = prod.get(i).getId();
                            nombre_pro = prod.get(i).getNombre();
                            cant_pro = prod.get(i).getCantidad();
                            //System.out.println("id "+id_prod+" nombre "+nombre_pro+" cant "+cant_pro);         
                            db.insertarSolicitudProducto(id_solici_repo, id_prod, cant_pro, fechaAct,fechaAct);

                            id_Detalle_Producto = db.seleccionarDetalleSoliciProducto();
                            for (int j = 0; j < prodBase.size(); j++) {
                                if (id_prod == prodBase.get(j).getId_pb()) {
                                    int prod_base = prodBase.get(j).getId_pb();
                                    total = prodBase.get(j).getTotal_real_pb();
                                    String nomb_pb = prodBase.get(j).getNombre_pb();
                                    double canti_ideal = prodBase.get(j).getCantU_ideal_pb();
                                    double canti_real = prodBase.get(j).getCantU_modif_pb();

                                    String sucursal = "SELECT * FROM PRODUCTO_BASE WHERE ID_PRODUCTO=" + prod_base + " AND NOMBRE_PB='" + nomb_pb + "'";
                                    ResultSet rspb = db.selectProductosBase(sucursal);
                                    while (rspb.next()) {
                                        id_pb = rspb.getInt(6);
                         //         System.out.println("Id pro "+rspb.getInt(6)+"nombre "+nomb_pb+
                         //         " canti ideal "+canti_ideal+" canti real "+canti_real+" fecha "+fechaAct+" monto "+total);               
                                    }
                        //            System.out.println("id"+id_Detalle_Producto+" id Pro "+id_pb+" cant ide "+canti_ideal);                                  
                                   db.insertarDetalleSolicitudProductoBase(id_Detalle_Producto, id_pb, canti_ideal, canti_real, fechaAct, fechaAct, total);
                                   id_pb = 0;
                                }
                            }
                        }
                        JOptionPane.showMessageDialog(null, "Se guardaron los datos");
                        limpiar();
                        prodBase.removeAll(prodBase);
                        //jDate.setDate(null);
                        jTable1.updateUI();
                        idDetalle = 1;
                        cant = 1;
                    }
                    }

                }
            } catch (Exception e) {
                //System.out.println("error: " + e);
                JOptionPane.showMessageDialog(null, "Ingrese la fecha!");
            }
        } catch (Exception ex) {
            Logger.getLogger(AgregarProducto.class.getName()).log(Level.SEVERE, null, ex);
        }
    }//GEN-LAST:event_jButton1ActionPerformed

    private void jButton2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton2ActionPerformed
        // TODO add your handling code here:
        /*System.exit(0);*/
        dispose();
    }//GEN-LAST:event_jButton2ActionPerformed

    private void jcomboBoxSucursalActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jcomboBoxSucursalActionPerformed
        // TODO add your handling code here:
        jcomboBoxAlmacen.removeAllItems();
        nombreSucursal = (String) jcomboBoxSucursal.getSelectedItem();

        for (int i = 0; i < db.SeleccionarAlmacen(nombreSucursal).size(); i++) {
            jcomboBoxAlmacen.addItem(db.SeleccionarAlmacen(nombreSucursal).get(i).getNombre());
        }
    }//GEN-LAST:event_jcomboBoxSucursalActionPerformed

    private void jcomboBoxAlmacenActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jcomboBoxAlmacenActionPerformed
        // TODO add your handling code here:
        String nombre_almacen = (String) jcomboBoxAlmacen.getSelectedItem();
        int id_alma = db.selectIdAlmacen(nombre_almacen);
        System.out.println(id_alma);
        if (id_alma != 0) {
                try {
                    SeleccionarProductosPanel(id_alma);
                    Thread.sleep(1100); 
                if (getConnectionStatus() == true) {
                    jPanelMostrar.removeAll();
                    SeleccionarProductosPanelSinInternet(id_alma);            
                } else {
                    jPanelMostrar.removeAll();
                    SeleccionarProductosPanelSinInternet(id_alma);
                }
            } catch (Exception e) {
                    JOptionPane.showMessageDialog(null, "Error al cargar productos");
                    System.out.println("Error: "+e);
            }
        }
    }//GEN-LAST:event_jcomboBoxAlmacenActionPerformed

    private boolean getConnectionStatus() {
        boolean conStatus = false;
        try {
            URL u = new URL("https://www.google.com/");
            HttpsURLConnection huc = (HttpsURLConnection) u.openConnection();
            huc.connect();
            conStatus = true;
            //JOptionPane.showMessageDialog(null, conStatus);

        } catch (Exception e) {
            conStatus = false;
            //JOptionPane.showMessageDialog(null, conStatus);

        }
        return conStatus;
    }

    private void jtxtBusquedaActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jtxtBusquedaActionPerformed
        // TODO add your handling code here:

    }//GEN-LAST:event_jtxtBusquedaActionPerformed

    private void jtxtBusquedaKeyPressed(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_jtxtBusquedaKeyPressed

    }//GEN-LAST:event_jtxtBusquedaKeyPressed

    private void jtxtBusquedaKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_jtxtBusquedaKeyReleased

        if (jtxtBusqueda.getText().equals("")) {
            jPanelMostrar.removeAll();
            for (int i = 0; i < menu.length; i++) {
                menu[i].addActionListener(this);
                menu[i].setVerticalTextPosition(SwingConstants.BOTTOM);
                menu[i].setHorizontalTextPosition(SwingConstants.CENTER);
                menu[i].setPreferredSize(new Dimension(100, 150));
                jPanelMostrar.add(menu[i]);
            }
            pack();
            jPanelMostrar.updateUI();
            jPanelMostrar.setVisible(true);

        } else {
            FiltrarNombre(jtxtBusqueda.getText().trim());
        }
    }//GEN-LAST:event_jtxtBusquedaKeyReleased

    private void tableDetallesMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_tableDetallesMouseClicked
        // TODO add your handling code here:
        int columna = tableDetalles.getColumnModel().getColumnIndexAtX(evt.getX());
        int fila = evt.getY() / tableDetalles.getRowHeight();
        String idProducto;
        boolean existe = false;

        if (fila < tableDetalles.getRowCount() && fila >= 0 && columna < tableDetalles.getColumnCount() && columna >= 0) {
            Object value = tableDetalles.getValueAt(fila, columna);

            if (value instanceof JButton) {
                ((JButton) value).doClick();
                JButton botonAccion = (JButton) value;

                if (botonAccion.getName().equals("quitar")) {
                    int idProd = Integer.parseInt(String.valueOf(tableDetalles.getValueAt(fila, 0)));
                    String nombre = String.valueOf(tableDetalles.getValueAt(fila, 3));
                    String CantAumentar = String.valueOf(tableDetalles.getValueAt(fila, 2));
                    cant = Integer.parseInt(CantAumentar) - 1;
                    tableDetalles.setValueAt(cant, fila, 2);
                    idDetalle -= 1;
                    if (cant < 1) {
                        defaulttable.removeRow(fila);
                        cant = 1;
                        id = 1;
                        for (int i = 0; i < tableDetalles.getRowCount(); i++) {
                            //int CantAumentar = Integer.parseInt(String.valueOf(tableDetalles.getValueAt(i, 1)));
                            tableDetalles.setValueAt(id, i, 1);
                            id++;
                           // System.out.println(CantAumentar);
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
                    defaulttable.removeRow(fila);
                    /*id -= 1;
                    cant = 1;*/
                    id = 1;
                    for (int i = 0; i < tableDetalles.getRowCount(); i++) {
                        int CantAumentar = Integer.parseInt(String.valueOf(tableDetalles.getValueAt(i, 1)));
                        tableDetalles.setValueAt(id, i, 1);
                        id++;
                        //System.out.println(CantAumentar);
                    }
                    eliminarProducto(idProd);
                    eliminarProductoLista(idProd);

                }
                if (botonAccion.getName().equals("ver")) {
                    //                  String id = String.valueOf(tableDetalles.getValueAt(fila, 0));
                    //                  String producto = String.valueOf(tableDetalles.getValueAt(fila, 1));
                    idProducto = String.valueOf(tableDetalles.getValueAt(fila, 0));
                    String nom = String.valueOf(tableDetalles.getValueAt(fila, 3));
                    labelPB.setText(nom);
                    labelDesPB.setText(nom);

                    jTable1 = new JTable();
                    jTable1.setPreferredScrollableViewportSize(new Dimension(600, 70));

                    eliminar();
                    if (prodBase.size() == 0) {
                        jlabelSin.setText("Sin producto base");
                        recorrerProductoBase();
                        agregarTablaDescripcion(Integer.parseInt(idProducto));
                    } else {
                         
                        for (int i = 0; i < prodBase.size(); i++) {
                            if (Integer.parseInt(idProducto) == prodBase.get(i).getId_pb()) {
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

                                imgSubtract = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\substract.png";

                                sub = new ImageIcon(imgSubtract);
                                iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));

                                btn1 = new JButton(new ImageIcon(imgSubtract));
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
                            agregarTablaDescripcion(Integer.parseInt(idProducto));
                        }

                    }

                    jTable1.setModel(tablaDescripcion);
                    scrollpane = new JScrollPane(jTable1);

                    jTable1MouseListener(jTable1, Integer.parseInt(idProducto));
                    jTable1.setRowHeight(33);

                    jPanel2.removeAll();
                    jPanel2.repaint();
                    jPanel2.add(scrollpane);
                    jPanel2.setVisible(true);
                    jPanel2.updateUI();
                }
            }
        }
    }//GEN-LAST:event_tableDetallesMouseClicked

    private void jButtonGruposActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonGruposActionPerformed
        // TODO add your handling code here
        String img = "";
        ImageIcon icon = null;

        if (visible == false) {
            img = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\mostrar.png";
            icon = new ImageIcon(img);
            jButtonGrupos.setIcon(icon);
            ScrollGrupos.updateUI();
            jScrollFondo.updateUI();
            ScrollGrupos.setVisible(false);
            visible = true;
        } else if (visible == true) {
            img = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\ocultar.png";
            icon = new ImageIcon(img);
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

    /**
     * @param args the command line arguments
     */

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel PanelPrincipal;
    private javax.swing.JScrollPane ScrollGrupos;
    private javax.swing.JButton btnTotalV;
    private javax.swing.JButton jButton1;
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

    @Override
    public void actionPerformed(ActionEvent e) {
        boolean encontrado = false;

        boton = (JButtonProducto) e.getSource();
        String nom = boton.getNombre();
        int idPro = boton.getId();
        String uniMedida = boton.getUnid_medida();
        double precio_unitario = boton.getPrecio_unitario();

        if (tableDetalles.getRowCount() == 0) {
            labelPB.setText(nom);
            labelDesPB.setText(nom);

            agregarTablaDetalle(idPro, nom, 0);
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
               // System.out.println(p);
                if (p.equals(nom)) {
                    String CantAumentar = String.valueOf(tableDetalles.getValueAt(i, 2));
                    cant = Integer.parseInt(CantAumentar) + 1;
                    tableDetalles.setValueAt(cant, i, 2);
                    aumentarCantProducto(idPro, cant);
                    actualizarProductoLista(idPro, "", cant);
                    encontrado = true;
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

                imgSubtract = "src/imagen/substract.png";
                btn1 = new JButton(new ImageIcon(imgSubtract));
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

    public void aumentarCantProducto(int idProducto, int cant) {

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

                imgSubtract = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\substract.png";
                sub = new ImageIcon(imgSubtract);
                iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));

                btn1 = new JButton(new ImageIcon(imgSubtract));
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

                imgSubtract = "C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\Operaciones\\src\\imagen\\substract.png";
                sub = new ImageIcon(imgSubtract);
                iconsub = new ImageIcon(sub.getImage().getScaledInstance(20, 20, 1));

                btn1 = new JButton(new ImageIcon(imgSubtract));
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

    public void actualizarProductoLista(int idProd, String nombre, int cant) {
        for (int i = 0; i < prod.size(); i++) {
            if (prod.get(i).getId() == idProd) {
                prod.get(i).setCantidad(cant);
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

    public void SolicitudesActualizar(int id, int id_almacen) {
        ResultSet rs1 = null;
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
                System.out.println("id "+id_deta_pro+" prod "+producto+" cant "+cantidad+" nombre "+nombre_p);                      
                
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
                  //      System.out.println("Tiene productos id "+id_prod+" nombre "+nombre_pb);
         ProductosBase pb = new ProductosBase(0, id_prod, nombre_pb, unid_med_pb, cant_ideal_pb, cant_real_pb, totalIdeal, totalReal, precio_pb, id_almacen, "");
                        prodBase.add(pb);
                    }
                }else{
                    System.out.println("no tiene "+id_deta_pro);
                    
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
                        System.out.println("No es producto base "+id_prod+" nombre "+nombre_p);
                        noProductosBase(0, id_prod, nombre_p, unid_med_pb, cantidad, precio_pb, id_almacen, "");
    
                    }        
                }
               
            }
            for (int i = 0; i < prodBase.size(); i++) {
                System.out.println(" nombre "+prodBase.get(i).getNombre_pb());
            }
                     
        } catch (Exception e) {
            System.out.println("Error al cargar los producto: " + e.getMessage());
        }
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
