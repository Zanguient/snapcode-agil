/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package UI;

import Conexion.DataBase;
import Conexion.RestServer;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author AGIL
 */
public class insertarSucursalesAlmacenes extends Thread{
    public int idEmpresa;
    public DataBase db = new DataBase();

    public insertarSucursalesAlmacenes(String texto, int idEmpresa) {
        super(texto);
        this.idEmpresa = idEmpresa;
    }
    
    public void SucursalAlmacen(){
        System.out.println("Entro Sucursal Almacen");
        String url = "/sucursales/empresa/"+this.idEmpresa;
        JSONArray sucursales = RestServer.getJSONArray(url);
       
        try {
            for (int i = 0; i < sucursales.length(); i++) {
                JSONObject sucursal = sucursales.getJSONObject(i);

                int id = sucursal.getInt("id");
                int id_empresa = sucursal.getInt("id_empresa");
                String nombre = sucursal.getString("nombre");
                int numero = (sucursal.get("numero").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("numero").toString());
                String direccion = (sucursal.get("direccion").toString().equals("null"))? "":(String)sucursal.get("direccion").toString();
                String telefono1 = (String)sucursal.get("telefono1").toString();//.equals("null")? 0:Integer.parseInt(sucursal.get("telefono1").toString());
                String telefono2 = sucursal.get("telefono2").toString();//.equals("null")? 0:Integer.parseInt(sucursal.get("telefono2").toString());
                String telefono3 = sucursal.get("telefono3").toString();//.equals("null")? 0:Integer.parseInt(sucursal.get("telefono3").toString());
                int id_departamento = (sucursal.get("id_departamento").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("id_departamento").toString());
                int id_municipio = sucursal.get("id_municipio").toString().equals("null")? 0:Integer.parseInt(sucursal.get("id_municipio").toString());
                String created = sucursal.get("createdAt").toString().equals("null")? "": (String)sucursal.get("createdAt").toString();
                String updated = sucursal.get("updatedAt").toString().equals("null")? "":(String)sucursal.get("updatedAt").toString();
                int nota_venta_correlativo = sucursal.getInt("nota_venta_correlativo");//.toString().equals("null")? 0:Integer.parseInt(sucursal.get("nota_venta_correlativo").toString());
                int nota_traspaso_correlativo = sucursal.getInt("nota_traspaso_correlativo");//.toString().equals("null")? 0:Integer.parseInt(sucursal.get("nota_traspaso_correlativo").toString());
                int nota_baja_correlativo = sucursal.getInt("nota_baja_correlativo");//.toString().equals("null")? 0:Integer.parseInt(sucursal.get("nota_baja_correlativo").toString());
                int pedido_correlativo = sucursal.getInt("pedido_correlativo");//.toString().equals("null")? 0:Integer.parseInt(sucursal.get("pedido_correlativo").toString());
                int copias_impresion_pedido = sucursal.getInt("copias_impresion_pedido");//.toString().equals("null")? 0:Integer.parseInt(sucursal.get("copias_impresion_pedido").toString());
                String frase_pedido = sucursal.get("frase_pedido").toString().equals("null")? "":(String)sucursal.get("frase_pedido").toString();
                int nota_recibo_correlativo = sucursal.getInt("nota_recibo_correlativo");//.toString().equals("null")? 0:Integer.parseInt(sucursal.get("nota_recibo_correlativo").toString());
                int cotizacion_correlativo = (sucursal.get("cotizacion_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("cotizacion_correlativo").toString());
                int pre_factura_correlativo = (sucursal.get("pre_factura_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("pre_factura_correlativo").toString());
                int comprobante_ingreso_correlativo = (sucursal.get("comprobante_ingreso_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("comprobante_ingreso_correlativo").toString());
                int comprobante_egreso_correlativo = (sucursal.get("comprobante_egreso_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("comprobante_egreso_correlativo").toString());
                int comprobante_traspaso_correlativo = (sucursal.get("comprobante_traspaso_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("comprobante_traspaso_correlativo").toString());
                int comprobante_caja_chica_correlativo = (sucursal.get("comprobante_caja_chica_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("comprobante_caja_chica_correlativo").toString());
                String fecha_reinicio_correlativo = (sucursal.get("fecha_reinicio_correlativo").toString().equals("null"))? "":(String)sucursal.get("fecha_reinicio_correlativo").toString();
                int nota_venta_farmacia_correlativo = (sucursal.get("nota_venta_farmacia_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("nota_venta_farmacia_correlativo").toString());
                int despacho_correlativo = (sucursal.get("despacho_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("despacho_correlativo").toString());
                int despacho_recivo_correlativo = (sucursal.get("despacho_recivo_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("despacho_recivo_correlativo").toString());
                int ropa_trabajo_correlativo = (sucursal.get("ropa_trabajo_correlativo").toString().equals("null"))? 0:Integer.parseInt(sucursal.get("ropa_trabajo_correlativo").toString());
                boolean reini_compro_ingreso_correla = sucursal.getBoolean("reiniciar_comprobante_ingreso_correlativo");
                boolean reini_compro_egreso_correla = sucursal.getBoolean("reiniciar_comprobante_egreso_correlativo");
                boolean reini_compro_traspaso_correla = sucursal.getBoolean("reiniciar_comprobante_traspaso_correlativo");
                boolean reini_compro_caja_chica_correla = sucursal.getBoolean("reiniciar_comprobante_caja_chica_correlativo");
                boolean imprimir_pedido_corto = sucursal.getBoolean("imprimir_pedido_corto");

                db.insertarSucursalSuc(id, id_empresa, nombre, numero, direccion, telefono1, telefono2, telefono3, id_departamento, id_municipio, created, updated, nota_venta_correlativo, nota_traspaso_correlativo, nota_baja_correlativo, pedido_correlativo, copias_impresion_pedido, frase_pedido, nota_recibo_correlativo, cotizacion_correlativo, pre_factura_correlativo, comprobante_ingreso_correlativo, comprobante_egreso_correlativo, comprobante_traspaso_correlativo, comprobante_caja_chica_correlativo, fecha_reinicio_correlativo, nota_venta_farmacia_correlativo, despacho_correlativo, ropa_trabajo_correlativo, reini_compro_ingreso_correla, reini_compro_traspaso_correla, reini_compro_egreso_correla, reini_compro_caja_chica_correla, imprimir_pedido_corto, false, despacho_recivo_correlativo);

                JSONArray almacenes = sucursal.getJSONArray("almacenes");
                for (int j = 0; j < almacenes.length(); j++) {
                    JSONObject almacen = almacenes.getJSONObject(j);
                    int id_almacen = almacen.getInt("id");
                    int id_sucursalc = almacen.getInt("id_sucursal");
                    String nombre_almacen = almacen.getString("nombre");
                    int numero_almacen = (almacen.get("numero").toString().equals("null"))? 0:Integer.parseInt(almacen.get("numero").toString());
                    String direccion_almacen = (almacen.get("direccion").toString().equals("null"))? "":(String)almacen.get("direccion").toString();
                    String telefono = (String) almacen.get("telefono").toString();       
                    String created_almacen = (String)almacen.get("createdAt").toString();
                    String updated_almacen = (String)almacen.get("updatedAt").toString();

                    db.insertarAlmacenSuc(id_almacen, id_sucursalc, nombre_almacen, numero_almacen, direccion_almacen, telefono, created_almacen, updated_almacen);
                }
            }

        } catch (JSONException ex) {
            System.out.println(ex);
            Logger.getLogger(VentasUI.class.getName()).log(Level.SEVERE, null, ex);
        }  
        System.out.println("Salio Sucursal Almacen");
    }
    
    @Override
    public void run(){
        SucursalAlmacen();
    }
}
