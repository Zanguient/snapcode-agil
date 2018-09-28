
package models;

import com.agil.nuevo.Almacen;
import com.agil.nuevo.Autentificacion;
import com.agil.nuevo.Sucursal;
import java.io.PrintStream;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Database{
  public Connection con = null;
  Connection con2;
  
public Connection Conectar(){
    try {
        //con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\dbOperaciones");   
        con = DriverManager.getConnection("jdbc:derby:.\\dbOperaciones");   

    } catch (Exception e) {
        System.out.println("error en la conexion "+ e);
    }
    return con;
}
  public void PurebaConectar()
  {
    ResultSet rs = null;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      rs = stmt.executeQuery("select * from sucursal");
      while (rs.next()) {
        System.out.printf(rs.getInt(1) + rs.getString(2), new Object[0]);
      }
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
  }
  
  public void login(int id, int idEmp)
  {
    Conectar();
    PreparedStatement pstmt = null;
    Statement stmt = null;
    ResultSet rs = null;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      stmt = this.con.createStatement();
      
      Statement orden = this.con.createStatement();
      
      rs = stmt.executeQuery("select * from login where id = " + id);
      if (rs.next())
      {
        String sql = "UPDATE login SET ID = ?, IDEMPRESA = ? WHERE ID=?";
        PreparedStatement statement = this.con.prepareStatement(sql);
        statement.setInt(1, id);
        statement.setInt(2, idEmp);
        statement.setInt(3, id);
        statement.executeUpdate();
      }
      else
      {
        String insertar = "insert into login (ID, IDEMPRESA) values(" + id + "," + idEmp + ")";
        orden.executeUpdate(insertar);
      }
      this.con.commit();
      stmt.close();
      rs.close();
    }
    catch (SQLException ex)
    {
      System.out.println("Error insertar login: " + ex);
    }
  }
  
  public int selectIdLogin(String nombre, String clave){
    Conectar();
    int id = 0;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      ResultSet rs = stmt.executeQuery("select id from usuario where nombre_usuario='" + nombre + "' and clave='" + clave + "'");
      while (rs.next()) {
        id = rs.getInt(1);
      }
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
    return id;
  }
  
  public ArrayList<Autentificacion> seleccionarIdEmpresa(int id){
    Conectar();
    PreparedStatement pstmt = null;
    Statement stmt = null;
    ResultSet rs = null;
    ArrayList<Autentificacion> autentificacion = new ArrayList();
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:C:\\Users\\AGIL\\Documents\\Agil\\custom modules\\agil");
      this.con.setAutoCommit(false);
      stmt = this.con.createStatement();
      
      Statement orden = this.con.createStatement();
      
      rs = stmt.executeQuery("select * from login where id = " + id);
      while (rs.next())
      {
        Autentificacion autentif = new Autentificacion(rs.getInt(1), rs.getInt(2));
        autentificacion.add(autentif);
      }
      this.con.commit();
      stmt.close();
      rs.close();
    }
    catch (SQLException ex)
    {
      System.out.println("Error seleccionar tabla autentificaci�n: " + ex);
    }
    return autentificacion;
  }
  
  public boolean Autentificacion(String usuario, String clave){
    Conectar();
    PreparedStatement pstmt = null;
    Statement stmt = null;
    ResultSet rs = null;
    
    boolean resultado = false;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      stmt = this.con.createStatement();
      
      Statement orden = this.con.createStatement();
      
      rs = stmt.executeQuery("select * from usuario where nombre_usuario ='" + usuario + "' and clave='" + clave + "'");
      if (rs.next()) {
        resultado = true;
      }
      this.con.commit();
      stmt.close();
      rs.close();
    }
    catch (Exception ex)
    {
      System.out.println("Error seleccionar tabla autentificaci�n: " + ex.getMessage());
    }
    return resultado;
  }
  
  public void insertarSucursal(int id, String nombre, int id_usuario){
    Conectar();
    PreparedStatement pstmt = null;
    Statement stmt = null;
    ResultSet rs = null;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      con.setAutoCommit(false);
      stmt = con.createStatement();
      
      Statement orden = con.createStatement();
      
      rs = stmt.executeQuery("select * from sucursal where id = " + id );
      if (rs.next())
      {
        String sql = "UPDATE sucursal SET id=?, nombre=?, id_usuario=? WHERE id=? ";
        PreparedStatement statement = con.prepareStatement(sql);
        statement.setInt(1, id);
        statement.setString(2, nombre);
        statement.setInt(3, id_usuario);
        
        statement.setInt(4, id);

        statement.executeUpdate();
        statement.close();
      }
      else
      {
        String insertar = "insert into sucursal(ID, NOMBRE, ID_USUARIO) values(" + id + ",'" + nombre + "'," + id_usuario + ")";
        orden.executeUpdate(insertar);
      }
      con.commit();
    }
    catch (SQLException ex)
    {
      System.out.println(ex.getMessage());
      System.out.println("Error al insertar las sucursales: " + ex);
    }
  }
  
  public ArrayList<Sucursal> SeleccionarSucursal(int id_user){
    Conectar();
    ArrayList<Sucursal> sucursales = new ArrayList();
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      ResultSet rs = stmt.executeQuery("select * from sucursal where id_usuario=" + id_user);
      while (rs.next())
      {
        Sucursal sucursal = new Sucursal(rs.getInt(1), rs.getString(2), rs.getInt(3));
        sucursales.add(sucursal);
      }
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
    return sucursales;
  }
  
  public ResultSet SeleccionarSucursalPorId(String consulta){
    Conectar();
    ResultSet rs = null;
    try
    {
     // this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      rs = stmt.executeQuery(consulta);
      
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
    return rs;
  }
  
  public ArrayList<Sucursal> SeleccionarSucursalPorNombre(String nombre_sucursal){
    Conectar();
      ArrayList<Sucursal> sucursales = new ArrayList();
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      ResultSet rs = stmt.executeQuery("select * from sucursal where nombre = '" + nombre_sucursal + "'");
      while (rs.next())
      {
        Sucursal sucursal = new Sucursal(rs.getInt(1), rs.getString(2), rs.getInt(3));
        sucursales.add(sucursal);
      }
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
    return sucursales;
  }
  
  public void InsertAlmacen(int id, String nombre, int id_sucursal){
    Conectar();  
    PreparedStatement pstmt = null;
    Statement stmt = null;
    ResultSet rs = null;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      stmt = this.con.createStatement();
      Statement orden = this.con.createStatement();
      rs = stmt.executeQuery("select * from almacen where id = " + id);
      if (rs.next())
      {
        String sql = "UPDATE almacen SET id=?, nombre=?, id_sucursal=? WHERE id=?";
        PreparedStatement statement = this.con.prepareStatement(sql);
        statement.setInt(1, id);
        statement.setString(2, nombre);
        statement.setInt(3, id_sucursal);
        statement.setInt(4, id);
      }
      else
      {
        String insertar = "insert into almacen(ID, NOMBRE,ID_SUCURSAL) values(" + id + ",'" + nombre + "'," + id_sucursal + ")";
        orden.executeUpdate(insertar);
      }
      this.con.commit();
    }
    catch (SQLException ex)
    {
      System.out.println("Error al insertar almacen: " + ex);
    }
  }
  
  public ArrayList<Almacen> SeleccionarAlmacen(String nombre){
      Conectar();
    ArrayList<Almacen> almacenes = new ArrayList();
    int id_suc = 0;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      String seleccionarId = "select * from sucursal where nombre = '" + nombre + "'";
      ResultSet rsid = stmt.executeQuery(seleccionarId);
      while (rsid.next()) {
        id_suc = rsid.getInt(1);
      }
      String seleccionar = "select * from almacen where id_sucursal = " + id_suc;
      ResultSet rs = stmt.executeQuery(seleccionar);
      while (rs.next())
      {
        Almacen almacen = new Almacen(rs.getInt(1), rs.getString(2), rs.getInt(3));
        almacenes.add(almacen);
      }
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println("Error al seleccionar almacen: " + e);
    }
    return almacenes;
  }
  
  public ResultSet seleccionarTodoAlmacen(String consulta){
      Conectar();
    ResultSet rs = null;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      rs = stmt.executeQuery(consulta);
      
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
    return rs;
  }
  
  public ArrayList<Almacen> SeleccionarTodoAlmacenPorNombre(String nombre){
    Conectar();
      ArrayList<Almacen> almacenes = new ArrayList();
    int id_suc = 0;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      String seleccionar = "select * from almacen where nombre = '" + nombre + "'";
      ResultSet rs = stmt.executeQuery(seleccionar);
      while (rs.next())
      {
        Almacen almacen = new Almacen(rs.getInt(1), rs.getString(2), rs.getInt(3));
        almacenes.add(almacen);
      }
      this.con.commit();
      this.con.close();
    }
    catch (Exception e)
    {
      System.out.println("Error al seleccionar todo almacen: " + e);
    }
    return almacenes;
  }
  
  public void insertarGrupoEmpresas(int id, String nombre){
      Conectar();
    PreparedStatement pstmt = null;
    Statement stmt = null;
    ResultSet rs = null;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement orden = this.con.createStatement();
      stmt = this.con.createStatement();
      String seleccionar = "select * from grupos where id = " + id;
      rs = stmt.executeQuery(seleccionar);
      if (rs.next())
      {
        String sql = "UPDATE grupos SET id=?, nombre=? WHERE id=?";
        PreparedStatement statement = this.con.prepareStatement(sql);
        statement.setInt(1, id);
        statement.setString(2, nombre);
        statement.setInt(3, id);
      }
      else
      {
        String insertar = "insert into grupos(id, nombre) values(" + id + ",'" + nombre + "')";
        orden.executeUpdate(insertar);
      }
      this.con.commit();
    }
    catch (SQLException ex)
    {
      System.out.println("Error insertar grupos empresa: " + ex);
    }
  }
  
  public int selectIdAlmacen(String nombre_Almacen){
    Conectar();
      ArrayList<Almacen> almacenes = new ArrayList();
    int id_almacen = 0;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      String seleccionarId = "select * from almacen where nombre = '" + nombre_Almacen + "'";
      ResultSet rsid = stmt.executeQuery(seleccionarId);
      while (rsid.next()) {
        id_almacen = rsid.getInt(1);
      }
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println("Error al seleccionar el id del almacen: " + e);
    }
    return id_almacen;
  }
  
  public ArrayList<Almacen> selectAlmacenById(int id_sucursal){
    Conectar();
    ArrayList<Almacen> almacenes = new ArrayList();
    int id_almacen = 0;
    String nombre = "";
    int id_sucu = 0;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      String seleccionar = "select * from almacen where id_sucursal=" + id_sucursal;
      ResultSet rs = stmt.executeQuery(seleccionar);
      while (rs.next())
      {
        id_almacen = rs.getInt(1);
        nombre = rs.getString(2);
        id_sucu = rs.getInt(3);
        Almacen almacen = new Almacen(id_almacen, nombre, id_sucu);
        almacenes.add(almacen);
      }
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println("Error al seleccionar el id del almacen: " + e);
    }
    return almacenes;
  }
  
  public boolean ingresarSolicitudReposicion(int id,int id_almacen, java.sql.Timestamp fecha, int id_usuario, boolean activo, boolean eliminado, Date fechaAct, double monto, String nombre_sucursal){
    Conectar();
    ResultSet rs = null;
    boolean valor = false;
    try
    {
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();

      String seleccionar = "select * from solicitud_reposicion where id = " + id;
      rs = stmt.executeQuery(seleccionar);
      if (rs.next())
      {
        String sql = "UPDATE solicitud_reposicion SET almacen=?,usuario=?,activo=?,eliminado=?,createdat=?,updatedat=?,monto=?,nombre_sucursal=?,fecha=? WHERE id=?";
        PreparedStatement statement = this.con.prepareStatement(sql);
        statement.setInt(1, id_almacen);
        statement.setInt(2, id_usuario);
        statement.setBoolean(3, activo);
        statement.setBoolean(4, eliminado);
        statement.setDate(5, fechaAct);
        statement.setDate(6, fechaAct);
        statement.setDouble(7, monto);
        statement.setString(8, nombre_sucursal);
        statement.setTimestamp(9, fecha);
        statement.setInt(10, id);
      }else{
        PreparedStatement pstmt = this.con.prepareStatement("insert into solicitud_reposicion(id,almacen,usuario,activo,eliminado,createdat,updatedat,monto,nombre_sucursal,fecha) values(?,?,?,?,?,?,?,?,?,?)"); 
        pstmt.setInt(1, id);
        pstmt.setInt(2, id_almacen);
        pstmt.setInt(3, id_usuario);
        pstmt.setBoolean(4, activo);
        pstmt.setBoolean(5, eliminado);
        pstmt.setDate(6, fechaAct);
        pstmt.setDate(7, fechaAct);
        pstmt.setDouble(8, monto);
        pstmt.setString(9, nombre_sucursal);
        pstmt.setTimestamp(10, fecha);
        pstmt.executeUpdate();
        valor = true;
      }
      this.con.commit();
      
     
    }
    catch (Exception e)
    {
      System.out.println("Error al insertar " + e);
    }
    return valor;
  }
  
  public void actualizarSolicitudReposicion(int id_detalle, int id_alm_repo, Date fecha, int id_usuario, boolean activo, boolean eliminado, Date fechaAct, double monto, String Nombre_Sucursal){
      Conectar();
    ResultSet rs = null;
    ResultSet rsDSP = null;
    ResultSet rsDSPB = null;
    PreparedStatement statement = null;
    
    int id_soliRepo = 0;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");   
      Statement stmt = this.con.createStatement();
      
      String sql = "UPDATE SOLICITUD_REPOSICION SET FECHA = ?, UPDATEDAT = ? WHERE ID = ?";
      statement = this.con.prepareStatement(sql);
      statement.setDate(1, fecha);
      statement.setDate(2, fechaAct);
      statement.setInt(3, id_detalle);
      
      statement.executeUpdate();
      this.con.close();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
  }
  
  public void insertarProductosBase(int id, int id_pb, String nombre_pb, String unid_med_pb, int precio_unit_pb, String cantU_ideal_pb, int idPB){
    Conectar();
      ResultSet rs = null;
    boolean valor = false;
    try{
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement orden = this.con.createStatement();
      Statement stmt = this.con.createStatement();
      String seleccionar = "select * from producto_base where id_prod_base = " + id_pb + " and id_producto=" + id;
      rs = stmt.executeQuery(seleccionar);
      if (rs.next())
      {
        String sql = "UPDATE producto_base SET id_producto=?, nombre_pb=?,uni_medi_pb=?,cant_uni_ideal=?,precio_uni_pb=?,id_prod_base=?,IDPB=? WHERE id_prod_base=? and id_producto=?";
        PreparedStatement statement = this.con.prepareStatement(sql);
        statement.setInt(1, id);
        statement.setString(2, nombre_pb);
        statement.setString(3, unid_med_pb);
        statement.setString(4, cantU_ideal_pb);
        statement.setInt(5, precio_unit_pb);
        statement.setInt(6, id_pb);
        statement.setInt(7, idPB);
        statement.setInt(8, id_pb);
        statement.setInt(9, id);
      }
      else
      {
        PreparedStatement pstmt = this.con.prepareStatement("insert into producto_base(id_producto,nombre_pb,uni_medi_pb,cant_uni_ideal,precio_uni_pb,id_prod_base,IDPB) values(?,?,?,?,?,?,?)");
        pstmt.setInt(1, id);
        pstmt.setString(2, nombre_pb);
        pstmt.setString(3, unid_med_pb);
        pstmt.setString(4, cantU_ideal_pb);
        pstmt.setInt(5, precio_unit_pb);
        pstmt.setInt(6, id_pb);
        pstmt.setInt(7, idPB);
        
        pstmt.executeUpdate();
      }
      this.con.commit();
      stmt.close();
      orden.close();
    }
    catch (SQLException ex)
    {
      System.out.println("Error al insertar producto base: " + ex);
      System.out.println(ex.getMessage());
      System.out.println(nombre_pb);
    }
  }
  
  public void insertarProductos(int id_almacen, int id_prod, String nomb_prod, String unidad_medida, double precio_unitario, int id_grupo, int id_subgrupos,boolean activarInv, String codigo){
    Conectar();
    ResultSet rs = null;

    try{

      this.con.setAutoCommit(false);
      Statement orden = this.con.createStatement();
      Statement stmt = this.con.createStatement();
      String seleccionar = "select * from producto where id_prod=" + id_prod + " and id_alm=" + id_almacen;
      rs = stmt.executeQuery(seleccionar);
      if (rs.next())
      {
        String sql = "UPDATE producto SET  id_prod=?,id_alm=?, nomb_prod=?,unid_medid=?,precio_unit=?,id_grupo=?,id_subgrupos=?,codigo=?,activar_inventario=? WHERE id_prod=? and id_alm=?";
        PreparedStatement statement = this.con.prepareStatement(sql);
        statement.setInt(1, id_prod);
        statement.setInt(2, id_almacen);
        statement.setString(3, nomb_prod);
        statement.setString(4, unidad_medida);
        statement.setDouble(5, precio_unitario);
        statement.setInt(6, id_grupo);
        statement.setInt(7, id_subgrupos);
        statement.setString(8, codigo);
        statement.setBoolean(9, activarInv);
        statement.setInt(10, id_prod);
        statement.setInt(11, id_almacen);
       
        
        statement.executeUpdate();
      }
      else
      {
        PreparedStatement pstmt = this.con.prepareStatement("insert into producto(id_prod,id_alm,nomb_prod,unid_medid,precio_unit,id_grupo,id_subgrupos,codigo,activar_inventario) values(?,?,?,?,?,?,?,?,?)");
        pstmt.setInt(1, id_prod);
        pstmt.setInt(2, id_almacen);
        pstmt.setString(3, nomb_prod);
        pstmt.setString(4, unidad_medida);
        pstmt.setDouble(5, precio_unitario);
        pstmt.setInt(6, id_grupo);
        pstmt.setInt(7, id_subgrupos);
        pstmt.setString(8, codigo);
        pstmt.setBoolean(9, activarInv);

        pstmt.executeUpdate();
      }
      this.con.commit();

    }
    catch (SQLException ex)
    {
      System.out.println("Error al insertar producto: " + ex);
      System.out.println(ex.getMessage());
    }
  }
  
  public ResultSet selectProductos(String consulta){
    Conectar();
      ResultSet rs = null;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      rs = stmt.executeQuery(consulta);
      
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
    return rs;
  }
  
  public ResultSet selectProductosBase(String consulta){
      Conectar();
    ResultSet rs = null;
    try{
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      rs = stmt.executeQuery(consulta);
      
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
    return rs;
  }
  
  public void insertarInventario(int inv_id, int inv_id_alma, int inv_id_pro, int inv_cant, int inv_cost_unit, int inv_cost_to, String inv_fecha_venci, String inv_lote, String inv_createdAt, String inv_updatedAt){
      Conectar();
    ResultSet rs = null;
    boolean valor = false;
    try{
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement orden = this.con.createStatement();
      Statement stmt = this.con.createStatement();
      String seleccionar = "select * from inventario where id=" + inv_id;
      rs = stmt.executeQuery(seleccionar);
      if (rs.next())
      {
        String sql = "UPDATE inventario SET id=?, id_almacen=?,id_producto=?,cantidad=?,costo_unitario=?,costo_total=?,fecha_venci=?,lote=?,createdat=?,updatedat=? WHERE id=?";
        PreparedStatement statement = this.con.prepareStatement(sql);
        statement.setInt(1, inv_id);
        statement.setInt(2, inv_id_alma);
        statement.setInt(3, inv_id_pro);
        statement.setInt(4, inv_cant);
        statement.setInt(5, inv_cost_unit);
        statement.setInt(6, inv_cost_to);
        statement.setString(7, inv_fecha_venci);
        
        statement.setString(8, inv_lote);
        statement.setString(9, inv_createdAt);
        statement.setString(10, inv_updatedAt);
        statement.setInt(11, inv_id);
        
        statement.executeUpdate();
      }
      else
      {
        PreparedStatement pstmt = this.con.prepareStatement("insert into inventario(id,id_almacen,id_producto,cantidad,costo_unitario,costo_total,fecha_venci,lote,createdat,updatedat) values(?,?,?,?,?,?,?,?,?,?)");
        
        pstmt.setInt(1, inv_id);
        pstmt.setInt(2, inv_id_alma);
        pstmt.setInt(3, inv_id_pro);
        pstmt.setInt(4, inv_cant);
        pstmt.setInt(5, inv_cost_unit);
        pstmt.setInt(6, inv_cost_to);
        pstmt.setString(7, inv_fecha_venci);
        
        pstmt.setString(8, inv_lote);
        pstmt.setString(9, inv_createdAt);
        pstmt.setString(10, inv_updatedAt);
        
        pstmt.executeUpdate();
      }
      this.con.commit();
      this.con.close();
    }
    catch (SQLException ex)
    {
      System.out.println("Error al insertar inventario: " + ex);
    }
  }
  
  public ResultSet selectInFiltro(String consulta){
    Conectar();
    ResultSet rs = null;
    try
    {
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      rs = stmt.executeQuery(consulta);
      
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
    return rs;
  }
  
  public void InsertarUsuario(int id, String nombre, String clave){
    Conectar();
    PreparedStatement pstmt = null;
    Statement stmt = null;
    ResultSet rs = null;
    try
    {
      this.con.setAutoCommit(false);
      Statement orden = this.con.createStatement();
      stmt = this.con.createStatement();
      String seleccionar = "select * from usuario where id = " + id;
      rs = stmt.executeQuery(seleccionar);
      if (rs.next())
      {
        String sql = "update usuario SET id=?, nombre_usuario=?, clave=? WHERE id=?";
        PreparedStatement statement = this.con.prepareStatement(sql);
        statement.setInt(1, id);
        statement.setString(2, nombre);
        statement.setString(3, clave);
        statement.setInt(4, id);
      }
      else
      {
        String insertar = "insert into usuario(id, nombre_usuario, clave) values(" + id + ",'" + nombre + "','" + clave + "')";
        orden.executeUpdate(insertar);
      }
      this.con.commit();
    }
    catch (SQLException ex)
    {
      System.out.println("Error insertar el usuario: " + ex);
    }
  }
  
  public int seleccionarSolicitudReposicionId(){
    Conectar();
    int id_solicitud_repo = 0;
    try{
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      String seleccionar = "SELECT Max(ID) FROM SOLICITUD_REPOSICION";
      ResultSet rs = stmt.executeQuery(seleccionar);
      while (rs.next()) {
        id_solicitud_repo = rs.getInt(1);
      }
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println("Error al seleccionar el id del solicitud: " + e);
    }
    return id_solicitud_repo;
  }
  
  public int seleccionarDetalleSoliciProducto(){
     Conectar();
    int id_solicitud_repo = 0;
    try
    {

      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      String seleccionar = "SELECT Max(ID) FROM DETALLE_SOLICITUD_PRODUCTO";
      ResultSet rs = stmt.executeQuery(seleccionar);
      while (rs.next()) {
        id_solicitud_repo = rs.getInt(1);
      }
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println("Error al seleccionar el id del almacen: " + e);
    }
    return id_solicitud_repo;
  }
  
    public int seleccionarUltimoIdDetalleSolicitudProductoBase(){
        Conectar();
        int id_solicitud_repo = 0;
        try{

            this.con.setAutoCommit(false);
            Statement stmt = this.con.createStatement();

            String seleccionar = "SELECT Max(ID) FROM DETALLE_SOLICITUD_PRODUCTO_BASE";
            ResultSet rs = stmt.executeQuery(seleccionar);
            while (rs.next()) {
              id_solicitud_repo = rs.getInt(1);
            }
            this.con.commit();
        }catch (Exception e){
          System.out.println("Error al seleccionar el id del detalle de la solicitud del producto base: " + e);
        }
        return id_solicitud_repo;
    }
      
  public void insertarSolicitudProducto(int id, int solicitud, int id_pro, double cantidad, java.sql.Date fechaCreada, java.sql.Date fechaActualizada){
    Conectar();
    PreparedStatement pstmt = null;
    Statement stmt = null;
    ResultSet rs = null;
    try{

        this.con.setAutoCommit(false);
        Statement orden = this.con.createStatement();
        stmt = this.con.createStatement();

        pstmt = this.con.prepareStatement("INSERT INTO DETALLE_SOLICITUD_PRODUCTO (ID,SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT) VALUES(?,?,?,?,?,?)");
        pstmt.setInt(1, id);
        pstmt.setInt(2, solicitud);
        pstmt.setInt(3, id_pro);
        pstmt.setDouble(4, cantidad);
        pstmt.setDate(5, fechaCreada);
        pstmt.setDate(6, fechaActualizada);

        pstmt.executeUpdate();

        this.con.commit();
    }
    catch (SQLException ex)
    {
      System.out.println("Error insertar el id detalle producto: " + ex);
    }
  }
  
  public void insertarDetalleSolicitudProductoBase(int id,int deta_solici_prod, int prod_base, double canti_ideal, double canti_real, Date fechaActual, Date fechaActualizada, double total){
    Conectar();
    PreparedStatement pstmt = null;
    Statement stmt = null;
    ResultSet rs = null;
    try{
     // this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement orden = this.con.createStatement();
      stmt = this.con.createStatement();
      
      pstmt = this.con.prepareStatement("INSERT INTO DETALLE_SOLICITUD_PRODUCTO_BASE (ID,DETALLE_SOLICITUD_PRODUCTO,PRODUCTO_BASE,CANTIDAD_IDEAL,CANTIDAD_REAL,CREATEDAT,UPDATEDAT,TOTAL) VALUES(?,?,?,?,?,?,?,?)");
      pstmt.setInt(1, id);
      pstmt.setInt(2, deta_solici_prod);
      pstmt.setInt(3, prod_base);
      pstmt.setDouble(4, canti_ideal);
      pstmt.setDouble(5, canti_real);
      pstmt.setDate(6, fechaActual);
      pstmt.setDate(7, fechaActualizada);
      pstmt.setDouble(8, total);
      
      pstmt.executeUpdate();
      
      this.con.commit();
    }
    catch (SQLException ex)
    {
      System.out.println("Error insertar el detalle producto base: " + ex);
    }
  }
  
  public ResultSet seleccionarUsuario(String consulta){
      Conectar();
    ResultSet rs = null;
    try{
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      rs = stmt.executeQuery(consulta);
      
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
    return rs;
  }
  
  /*public void UpdateTablaSolicitudes(int id){
      Conectar();
    ResultSet rs = null;
    boolean activo = false;
    try{
     
      Statement stmt = this.con.createStatement();
      
      String sql = "UPDATE SOLICITUD_REPOSICION SET ACTIVO = ? WHERE ID = ?";
      PreparedStatement statement = this.con.prepareStatement(sql);
      statement.setBoolean(1, false);
      statement.setInt(2, id);
      
      statement.executeUpdate();
      
      this.con.close();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
  }*/
  
  public void UpdateTablaDetalleSolicitudProducto(int id){
    Conectar();
      ResultSet rs = null;
    boolean activo = false;
    try{
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      Statement stmt = this.con.createStatement();
      
      String sql = "UPDATE SOLICITUD_REPOSICION SET ACTIVO = ? WHERE ID = ?";
      PreparedStatement statement = this.con.prepareStatement(sql);
      statement.setBoolean(1, false);
      statement.setInt(2, id);
      
      statement.executeUpdate();
      
      this.con.close();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
  }
  
  public ResultSet consultasSelectSolicitud(String consulta){
    Conectar();
      ResultSet rs = null;
    try
    {
     // this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      rs = stmt.executeQuery(consulta);
      
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println("Error al duplicar los productos " + e.getMessage());
    }
    return rs;
  }
  
  public ResultSet seleccionarGrupos(String consulta){
      Conectar();
    ResultSet rs = null;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      rs = stmt.executeQuery(consulta);
      
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
    return rs;
  }
  
  public boolean existeEldato(String consulta)
  {
      Conectar();
    boolean res = false;
    
    ResultSet rs = null;
    try
    {
     // this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      rs = stmt.executeQuery(consulta);
      while (rs.next()) {
        res = true;
      }
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
    return res;
  }
  
  public ResultSet insertarProductos(String consulta){
      Conectar();
    ResultSet rs = null;
    try
    {
      //this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement stmt = this.con.createStatement();
      
      PreparedStatement pstmt = this.con.prepareStatement(consulta);
      
      pstmt.executeUpdate();
      this.con.commit();
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
    }
    return rs;
  }
  
  public void insertarProductosConDatos(int solicitud, int producto, double cantidad, java.sql.Date createdat, java.sql.Date updatedat){
      Conectar();
    ResultSet rs = null;
    try
    {
     // this.con = DriverManager.getConnection("jdbc:derby:.\\agil");
      this.con.setAutoCommit(false);
      Statement orden = this.con.createStatement();
      Statement stmt = this.con.createStatement();
      
      PreparedStatement pstmt = this.con.prepareStatement("INSERT INTO DETALLE_SOLICITUD_PRODUCTO (SOLICITUD,PRODUCTO,CANTIDAD,CREATEDAT,UPDATEDAT) VALUES(?,?,?,?,?)");
      pstmt.setInt(1, solicitud);
      pstmt.setInt(2, producto);
      pstmt.setDouble(3, cantidad);
      pstmt.setDate(4, createdat);
      pstmt.setDate(5, updatedat);
      
      pstmt.executeUpdate();
      
      this.con.commit();
    }
    catch (SQLException ex)
    {
      System.out.println("Error insertar el id detalle producto: " + ex);
    }
  }
    
    public void eliminarProductos(String consulta){
        Conectar();
        ResultSet rs = null;
        try
        {
          this.con.setAutoCommit(false);
          Statement stmt = this.con.createStatement();
          stmt.execute(consulta);

          stmt.close();
          this.con.commit();
        }
        catch (Exception e){
          System.out.println(e.getMessage());
        }finally{
            try {

                Conectar().close();
            } catch (SQLException ex) {
                Logger.getLogger(Database.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
  
    public ResultSet seleccionar(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();
            rs = stmt.executeQuery(consulta);
           
            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return rs;
    }
    
    public ResultSet insertar(String consulta) {
        Conectar();
        PreparedStatement pstmt;
        Statement stmt;
        ResultSet rs = null;
        try {
            con.setAutoCommit(false);
            stmt = con.createStatement();

            pstmt = con.prepareStatement(consulta);

            pstmt.executeUpdate();
            pstmt.close();
            con.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return rs;
    }
    
    public void insertarRegistro(int usuario, java.sql.Date fecha){
        Conectar();
        PreparedStatement pstmt = null;
        Statement stmt = null;
        ResultSet rs = null;
        try{
          this.con.setAutoCommit(false);
          Statement orden = this.con.createStatement();
          stmt = this.con.createStatement();

          pstmt = this.con.prepareStatement("INSERT INTO REGISTRO(USUARIO,FECHA) VALUES(?,?)");
          pstmt.setInt(1, usuario);
          pstmt.setDate(2, fecha);
          
          pstmt.executeUpdate();

          this.con.commit();
        }
        catch (SQLException ex){
          System.out.println("Error insertar el registro: " + ex);
        }
    }
}
