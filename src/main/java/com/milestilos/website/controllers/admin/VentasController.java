package com.milestilos.website.controllers.admin;

import java.util.List;
import java.util.Map;

import com.milestilos.website.models.Ingreso;
import com.milestilos.website.models.Proveedor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.milestilos.website.models.Salida;
import com.milestilos.website.services.SalidaService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/admin/ventas")
public class VentasController {
    private SalidaService salidaService;

    public VentasController(SalidaService salidaService) {
        this.salidaService = salidaService;
    }

    @GetMapping()
	public String index(Model model) {
		List<Salida> salidas = this.salidaService.findAll();
		model.addAttribute("salidas", salidas);
		return "admin/ventas/index";
	}

    @GetMapping("/create")
	public String nuevaVenta() {
		return "admin/ventas/create";
	}

	@GetMapping("/{id}")
	public String details(@PathVariable Integer id, Model model) {
		Salida salida = this.salidaService.getById(id);
		model.addAttribute("salida", salida);
		return "admin/ventas/details";
	}

	@PostMapping("/validar-venta")
	@ResponseBody
	public Salida validarVenta(@RequestBody Map<String, Object> requestBody) {
		int pedidoId = (int) requestBody.get("idPedido");
		Salida salidaValidada = this.salidaService.validarVenta(pedidoId);
		return salidaValidada;
	}

	@PostMapping("/save")
	@ResponseBody
	public Salida save(@RequestBody Salida salida) {
		log.info("Guardando nueva venta: {}", salida);
		salida.setVendedor(this.salidaService.obtenerNombreUsuarioActual());
		Salida nuevaSalida = this.salidaService.save(salida);
		this.salidaService.validarVenta(salida.getId());
		return nuevaSalida;
	}
}
