/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package operacionesUI;

import java.net.URL;
import java.net.URLConnection;
import models.Database;
import models.RestServer;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author AGIL
 */
public class InsertarSucursales extends Thread{
    public Database db = new Database();
    public int id_usuario;
    public int idEmpresa;



    public InsertarSucursales(String nombre,int id_usuario, int idEmpresa) {
        super(nombre);
        this.id_usuario = id_usuario;
        this.idEmpresa = idEmpresa;
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
     
    private void InsertSucursal() {

       if(getConnectionStatus() == true){
           try{
            String url = "/autenticar-sucursales/" + id_usuario;

            JSONArray res = RestServer.getJSONArray(url);
            for (int i = 0; i < res.length(); i++) {
                JSONObject data = res.getJSONObject(i);
                String nombre = (String) data.getJSONObject("sucursal").get("nombre").toString();
                int id = data.getInt("id_sucursal");

                db.insertarSucursal(id, nombre, id_usuario);
                
                JSONArray almacenes = data.getJSONObject("sucursal").getJSONArray("almacenes");

                for (int j = 0; j < almacenes.length(); j++) {
                    JSONObject recorrerAlmacen = almacenes.getJSONObject(j);
                    int id_almacen = recorrerAlmacen.getInt("id");
                    String nombre_almacen = recorrerAlmacen.getString("nombre");
                    int id_sucursal = (int) recorrerAlmacen.getInt("id_sucursal");

                    db.InsertAlmacen(id_almacen, nombre_almacen, id_sucursal);
                }
            }
           }catch(Exception e){
               System.out.println("Error: "+e);
           }
        }
               System.out.println("Salio de insertar");

    }
    
    @Override
    public void run(){
        System.out.println("entro a insertar");
        InsertSucursal();
    }
}
