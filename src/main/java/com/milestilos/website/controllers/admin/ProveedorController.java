package com.milestilos.website.controllers.admin;

import java.io.IOException;
import java.util.List;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.milestilos.website.models.Proveedor;
import com.milestilos.website.services.ProveedorService;

@Controller
@RequestMapping("/admin/proveedores")
public class ProveedorController {
    
    private ProveedorService proveedorService;

	public ProveedorController(ProveedorService proveedorService) {
		this.proveedorService = proveedorService;
	}

	@GetMapping()
	public String index(Model model) {
		List<Proveedor> proveedores = this.proveedorService.findAll();
		model.addAttribute("proveedores", proveedores);
		return "admin/proveedores/index";
	}

    @GetMapping("/buscar-proveedor-api")
	@ResponseBody
	public List<Proveedor> buscarProductos(@RequestParam("nombre") String nombre) {
		List<Proveedor> proveedores = this.proveedorService.findByNombreContaining(nombre);
		return proveedores;
	}

	@GetMapping("/add")
	public String add() {
		return "admin/proveedores/create";
	}

	@GetMapping("/{id}")
	public String details(@PathVariable Integer id, Model model) {
		Proveedor proveedor = this.proveedorService.getById(id);
		model.addAttribute("proveedor", proveedor);
		return "admin/proveedores/details";
	}

	@PostMapping("/save")
	public String save(@ModelAttribute("proveedor") Proveedor proveedor) throws IOException {
		//log.info("Guardando nuevo proveedor: {}", proveedor.toString());
		this.proveedorService.save(proveedor);
		return "redirect:/admin/proveedores";
	}

	@GetMapping("/edit/{id}")
	public String edit(@PathVariable Integer id, Model model) {
		Proveedor proveedor = this.proveedorService.getById(id);
		model.addAttribute("proveedor", proveedor);
		return "admin/proveedores/edit";
	}

	@PostMapping("/update/{id}")
	public String updateStudent(@PathVariable Integer id, @ModelAttribute("proveedor") Proveedor proveedor) throws IOException {
		Proveedor proveedorExistente = this.proveedorService.getById(id);
		proveedorExistente.setNombre(proveedor.getNombre());
		proveedorExistente.setRuc(proveedor.getRuc());
		proveedorExistente.setTelefono(proveedor.getTelefono());
		proveedorExistente.setEmail(proveedor.getEmail());

		// guardar el producto actualizado
		this.proveedorService.save(proveedorExistente);

		return "redirect:/admin/proveedores";
	}

	@GetMapping("/delete/{id}")
	public String delete(@PathVariable Integer id) {
		proveedorService.deleteById(id);
		return "redirect:/admin/proveedores";
	}
    
}
