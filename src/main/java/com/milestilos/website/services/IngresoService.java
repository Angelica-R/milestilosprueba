package com.milestilos.website.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.milestilos.website.models.DetalleIngreso;
import com.milestilos.website.models.Ingreso;
import com.milestilos.website.models.Producto;
import com.milestilos.website.repositories.IngresoRepository;
import com.milestilos.website.repositories.ProductoRepository;

@Service
public class IngresoService {
    
    private IngresoRepository ingresoRepository;
    private ProductoRepository productoRepository;

    public IngresoService(IngresoRepository ingresoRepository, ProductoRepository productoRepository) {
        this.ingresoRepository = ingresoRepository;
        this.productoRepository = productoRepository;
    }

    public List<Ingreso> findAll() {
        return this.ingresoRepository.findAll();
    }


    public Ingreso save(Ingreso ingreso) {
        for(DetalleIngreso di : ingreso.getDetalleIngreso()) {
            Producto productoComprado = this.productoRepository.findById(di.getProductoId()).orElseThrow();
            productoComprado.agregarStock(di.getCantidad());
            this.productoRepository.save(productoComprado);
        }
        return this.ingresoRepository.save(ingreso);
    }

    public Ingreso getById(Integer id) {
        Ingreso ingreso = this.ingresoRepository.findById(id).orElseThrow();
        return ingreso;
    }

    public double[] getTotalesMensualesPorAnio(int anio) {
        double[] totalesMensuales = new double[12];
        List<Object[]> totaleMensualesPorAnio = this.ingresoRepository.getTotalesMensualesPorAnio(anio);

        for (Object[] totalDelMes : totaleMensualesPorAnio) {
            int mes = (int) totalDelMes[0] - 1; //Se indexa el elemento 0 del array que contiene el numero del mes
            double total = Double.valueOf(totalDelMes[1].toString()); // Se indexa el elemento 1 del array que contiene la suma total del mes
            totalesMensuales[mes] = total; // Se indexa en el mes los totales.
        }
        return totalesMensuales;
    }

    public double getTotalComprasDelMes(int mes){
        double total = 0;
        List<Ingreso> ingresos = this.findAll();
        for(Ingreso ingreso : ingresos){
            if(ingreso.getFechaDocumento().getMonthValue() == mes){
                total += ingreso.getTotal();
            }
        }
        return total;
    }
}
