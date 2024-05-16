package com.milestilos.website.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.milestilos.website.models.DetalleSalida;
import com.milestilos.website.models.Producto;
import com.milestilos.website.models.Salida;
import com.milestilos.website.repositories.ProductoRepository;
import com.milestilos.website.repositories.SalidaRepository;

@Service
public class SalidaService {
    private SalidaRepository salidaRepository;
    private ProductoRepository productoRepository;

    public SalidaService(SalidaRepository salidaRepository, ProductoRepository productoRepository) {
        this.salidaRepository = salidaRepository;
        this.productoRepository = productoRepository;
    }

    public List<Salida> findAll() {
        return this.salidaRepository.findAll();
    }

    public Salida save(Salida salida){
        salida.setFechaDocumento(LocalDate.now());
        // for(DetalleSalida ds : salida.getDetalleSalida()) {
        //     Producto productoComprado = this.productoRepository.findById(ds.getProductoId()).orElseThrow();
        //     productoComprado.disminuirStock(ds.getCantidad());
        //     this.productoRepository.save(productoComprado);
        // }
        return this.salidaRepository.save(salida);
    }

    public Salida actualizarCliente(Salida salida) {
        return this.salidaRepository.save(salida);
    }

    public List<Salida> findByValidadoPorIsNull() {
        return this.salidaRepository.findByValidadoPorIsNull();
    }

    public Salida getById(Integer id){
        Salida salida = this.salidaRepository.findById(id).orElseThrow();
        return salida;
    }

    public double calcularTotalVentasDelDia(LocalDate fecha) {
        List<Salida> salidasDelDia = this.salidaRepository.findByFechaDocumentoAndValidadoPorIsNotNull(fecha);

        double totalVentasDelDia = salidasDelDia.stream()
                .mapToDouble(Salida::getTotal)
                .sum();

        return totalVentasDelDia;
    }

    public Salida validarVenta(int pedidoId) {
        Salida salidaEncontrada = this.getById(pedidoId);
        salidaEncontrada.setValidadoPor(this.obtenerNombreUsuarioActual());

        for(DetalleSalida ds : salidaEncontrada.getDetalleSalida()) {
            Producto productoComprado = this.productoRepository.findById(ds.getProductoId()).orElseThrow();
            productoComprado.disminuirStock(ds.getCantidad());
            this.productoRepository.save(productoComprado);
        }
        salidaEncontrada.setFechaHoraValidacion(this.obtenerFechaYHoraActualEnPeru());

        return this.salidaRepository.save(salidaEncontrada);
    }

    private LocalDateTime obtenerFechaYHoraActualEnPeru() {
        LocalDateTime horaActual = LocalDateTime.now();
        ZoneId zonaPeru = ZoneId.of("America/Lima");
        ZonedDateTime horaPeru = ZonedDateTime.of(horaActual, zonaPeru);
        return horaPeru.toLocalDateTime();
    }

    public String obtenerNombreUsuarioActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails) {
                return ((UserDetails) principal).getUsername();
            } else {
                return principal.toString();
            }
        }
        return null;
    }
}
