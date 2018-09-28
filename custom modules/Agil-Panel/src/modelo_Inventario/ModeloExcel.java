/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo_Inventario;

import modelo_Inventario.*;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.xssf.usermodel.*;

/**
 *
 * @author ricardo
 */
public class ModeloExcel {
    Workbook wb;
    
    public String Importar(File archivo, JTable tablaD){
        /*String respuesta="No se pudo realizar la importación.";
        DefaultTableModel modeloT = new DefaultTableModel();
        tablaD.setModel(modeloT);
        tablaD.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        try {
            wb = WorkbookFactory.create(new FileInputStream(archivo));
            Sheet hoja = wb.getSheetAt(0);
            Iterator filaIterator = hoja.rowIterator();
            int indiceFila=-1;
            while (filaIterator.hasNext()) {                
                indiceFila++;
                Row fila = (Row) filaIterator.next();
                Iterator columnaIterator = fila.cellIterator();
                Object[] listaColumna = new Object[1000];
                int indiceColumna=-1;
                while (columnaIterator.hasNext()) {                    
                    indiceColumna++;
                    Cell celda = (Cell) columnaIterator.next();
                    if(indiceFila==0){
                        modeloT.addColumn(celda.getStringCellValue());                   
                    }else{
                        if(celda!=null){
                            switch(celda.getCellType()){
                                case Cell.CELL_TYPE_NUMERIC:
                                    listaColumna[indiceColumna]= (int)Math.round(celda.getNumericCellValue());
                                    break;
                                case Cell.CELL_TYPE_STRING:
                                    listaColumna[indiceColumna]= celda.getStringCellValue();
                                    break;
                                case Cell.CELL_TYPE_BOOLEAN:
                                    listaColumna[indiceColumna]= celda.getBooleanCellValue();
                                    break;  
                                case Cell.CELL_TYPE_BLANK:
                                    listaColumna[indiceColumna]= "";
                                    break;
                                case Cell.CELL_TYPE_ERROR:
                                    listaColumna[indiceColumna]= "ERROR";
                                    break;
                                default:
                                    listaColumna[indiceColumna]=celda.getDateCellValue();
                                    break;
                            }
                            //System.out.println("col"+indiceColumna+" valor: true - "+celda+".");
                        }                  
                    }
                }
                if(indiceFila!=0)modeloT.addRow(listaColumna);
            }
            respuesta="Importación exitosa";
        } catch (IOException | InvalidFormatException | EncryptedDocumentException e) {
            System.err.println(e.getMessage());
        }
        return respuesta;*/
         String answer = "Unable to import";
    DefaultTableModel modeloT = new DefaultTableModel();
    tablaD.setModel(modeloT);
    tablaD.getModel();
    tablaD.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);

    try {
        wb = WorkbookFactory.create(new FileInputStream(archivo));
        int nsheets = wb.getNumberOfSheets();

        for (int i = 0; i < nsheets; i++) {
    
            Sheet sheet = wb.getSheetAt(i);
            Iterator filaIterator = sheet.rowIterator();
   
            int rownum = -1;
            while (filaIterator.hasNext()) {
                rownum++;
                Row fila = (Row) filaIterator.next();
                /*if (i > 0) {//se o nr da ficha atual for maior que 0, começa a escrever as linhas apartir da row 0 da tabela
                    modeloT.moveRow(modeloT.getRowCount() -1, modeloT.getRowCount() - 1, 0);
                }*/
                for(int cn=0; cn<fila.getLastCellNum(); cn++) {
                    // Si falta la celda del archivo, genera una casilla en blanco
                    // (Funciona especificando un MissingCellPolicy)
                      Cell cell = fila.getCell(cn, Row.CREATE_NULL_AS_BLANK);
                      //System.out.println("CELL: " + cn + " --> " + cell.toString());
                  }
                Iterator columnaIterator = fila.cellIterator();
                Object[] listaColumna = new Object[1000];
                int columnnum = -1;
                while (columnaIterator.hasNext()) {
                    columnnum++;
                    Cell celda = (Cell) columnaIterator.next();

                    if (rownum == 0) {
                        modeloT.addColumn(celda.getStringCellValue());
                    } else {
                        SimpleDateFormat formatoFecha = new SimpleDateFormat("dd-MMM-yyyy");
                        if (celda != null) {
                            switch (celda.getCellType()) {
                                case Cell.CELL_TYPE_NUMERIC:
                                    if(DateUtil.isCellDateFormatted(celda)){
                                        listaColumna[columnnum] = formatoFecha.format(celda.getDateCellValue());
                                    }else{
                                        listaColumna[columnnum] = (int) Math.round(celda.getNumericCellValue());
                                    }
                                    break;
                                case Cell.CELL_TYPE_STRING:
                                    listaColumna[columnnum] = celda.getStringCellValue();
                                    break;
                                case Cell.CELL_TYPE_BOOLEAN:
                                    listaColumna[columnnum] = celda.getBooleanCellValue();
                                    break;
                                case Cell.CELL_TYPE_BLANK:
                                    listaColumna[columnnum] = "";
                                    break;
                                default:
                                    listaColumna[columnnum] = celda.getDateCellValue();
                                    break;
                            }//end switch case
                           // System.out.println("Column:" + columnnum + " Row:" + rownum + " value:" + celda + ".");

                        }                     
                    }
                }//end while column Iterator
                if (rownum != 0) {
                    modeloT.addRow(listaColumna);
                }
            }//end while row iterator
        }//end for
        answer = "Imported with success";

    } catch (IOException | InvalidFormatException | EncryptedDocumentException e) {
        System.err.println(e.getMessage());
    }
    return answer;
    }
    
    public String Exportar(File archivo, JTable tablaD){
        String respuesta="No se realizo con exito la exportación.";
        int numFila=tablaD.getRowCount(), numColumna=tablaD.getColumnCount();
        if(archivo.getName().endsWith("xls")){
            wb = new HSSFWorkbook();
        }else{
            wb = new XSSFWorkbook();
        }
        Sheet hoja = wb.createSheet("Pruebita");
        
        try {
            for (int i = -1; i < numFila; i++) {
                Row fila = hoja.createRow(i+1);
                for (int j = 0; j < numColumna; j++) {
                    Cell celda = fila.createCell(j);
                    if(i==-1){
                        celda.setCellValue(String.valueOf(tablaD.getColumnName(j)));
                    }else{
                        celda.setCellValue(String.valueOf(tablaD.getValueAt(i, j)));
                    }
                    wb.write(new FileOutputStream(archivo));
                }
            }
            respuesta="Exportación exitosa.";
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
        return respuesta;
    }
}
