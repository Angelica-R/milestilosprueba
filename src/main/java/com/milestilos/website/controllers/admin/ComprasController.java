package com.milestilos.website.controllers.admin;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.milestilos.website.models.Ingreso;
import com.milestilos.website.services.IngresoService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/admin/compras")
public class ComprasController {

	private IngresoService ingresoService;

	public ComprasController(IngresoService ingresoService) {
		this.ingresoService = ingresoService;
	}

    @GetMapping()
	public String index(Model model) {
		List<Ingreso> ingresos = this.ingresoService.findAll();
		model.addAttribute("ingresos", ingresos);
		return "admin/compras/index";
	}
	
	@GetMapping("/{id}")
	public String details(@PathVariable Integer id, Model model) {
		Ingreso ingreso = this.ingresoService.getById(id);
		model.addAttribute("ingreso", ingreso);
		return "admin/compras/details";
	}

	@GetMapping("/create")
	public String nuevaCompra() {
		return "admin/compras/create";
	}

	@PostMapping("/save")
	@ResponseBody
	public Ingreso save(@RequestBody Ingreso ingreso) {
		log.info("Guardando nuevo compra: {}", ingreso);
		Ingreso nuevoIngreso = this.ingresoService.save(ingreso);
		return nuevoIngreso;
	}
}
