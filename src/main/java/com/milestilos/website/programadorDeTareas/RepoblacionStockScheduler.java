package com.milestilos.website.programadorDeTareas;

import com.milestilos.website.models.DetalleSalida;
import com.milestilos.website.models.Producto;
import com.milestilos.website.models.Salida;
import com.milestilos.website.services.ProductoService;
import com.milestilos.website.services.SalidaService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class RepoblacionStockScheduler {
    private SalidaService salidaService;

    private ProductoService productoService;

    public RepoblacionStockScheduler(SalidaService salidaService, ProductoService productoService) {
        this.salidaService = salidaService;
        this.productoService = productoService;
    }

    @PostConstruct
    public void init() {
        // Programar la tarea para ejecutarse cada 1 hora
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(this::verificarYRepoblarStock, 0, 1, TimeUnit.HOURS);
    }

    private void verificarYRepoblarStock() {

        List<Salida> pedidosPorReponer = this.salidaService.findByValidadoPorIsNull();

        for (Salida salida : pedidosPorReponer) {
            if(RepoblacionStockScheduler.haPasadoUnaHora(salida.getFechaHoraRegistro())) {
                for(DetalleSalida ds : salida.getDetalleSalida()) {
                    Integer productoId = ds.getProductoId();
                    Producto producto = productoService.getById(productoId);
                    producto.setStock(producto.getStock() + ds.getCantidad());
                    this.productoService.actualizarProducto(producto);
                }
            }
        }
    }

    public static boolean haPasadoUnaHora(LocalDateTime horaInicio) {
        LocalDateTime horaFin = LocalDateTime.now();
        Duration duracion = Duration.between(horaInicio, horaFin);
        Duration unaHora = Duration.ofHours(1);
        return duracion.compareTo(unaHora) >= 0;
    }
}
