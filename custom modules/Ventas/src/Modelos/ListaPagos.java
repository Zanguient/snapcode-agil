/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Modelos;

/**
 *
 * @author AGIL
 */
public class ListaPagos {
    //DIAS_CREDITO, A_CUENTA,SALDO,TOTAL,FECHA,CLIENTE
    private int dias_credito;
    private int a_cuenta;
    private double saldo;
    private double total;
    private String fecha;
    private int cliente;

    public ListaPagos(int dias_credito, int a_cuenta, double saldo, double total, String fecha, int cliente) {
        this.dias_credito = dias_credito;
        this.a_cuenta = a_cuenta;
        this.saldo = saldo;
        this.total = total;
        this.fecha = fecha;
        this.cliente = cliente;
    }

    public int getDias_credito() {
        return dias_credito;
    }

    public void setDias_credito(int dias_credito) {
        this.dias_credito = dias_credito;
    }

    public int getA_cuenta() {
        return a_cuenta;
    }

    public void setA_cuenta(int a_cuenta) {
        this.a_cuenta = a_cuenta;
    }

    public double getSaldo() {
        return saldo;
    }

    public void setSaldo(double saldo) {
        this.saldo = saldo;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public int getCliente() {
        return cliente;
    }

    public void setCliente(int cliente) {
        this.cliente = cliente;
    }
    
    
}
