package com.milestilos.website.controllers.admin;

import java.io.IOException;
import java.util.List;

import com.milestilos.website.services.ProductoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.milestilos.website.models.Producto;
import org.springframework.web.multipart.MultipartFile;

import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@Controller
@RequestMapping("/admin/productos")
@Slf4j
public class ProductoController {

	private ProductoService productoService;

	public ProductoController(ProductoService productoService) {
		this.productoService = productoService;
	}

	// TODO: aqui se crearaá el metodo que devolverá el precio y disponiblidad.
    
    @GetMapping("/buscar")
	public String greeting(@RequestParam(name="name", required=false, defaultValue="World") String name, Model model) {
		return "productos/buscar";
	}

	@GetMapping("/buscar-productos-api")
	@ResponseBody
	public List<Producto> buscarProductos(@RequestParam("nombre") String nombre) {
		List<Producto> productos = this.productoService.findByDescripcionContaining(nombre);
		return productos;
	}

	@GetMapping("/buscar-productos-disponibles-api")
	@ResponseBody
	public List<Producto> buscarProductosConStockDisponible(@RequestParam("nombre") String nombre) {
		List<Producto> productos = this.productoService.findByDescripcionContainingAndStockGreaterThanEqual(nombre, 1);
		return productos;
	}

	@GetMapping()
	public String index(Model model) {
		List<Producto> productos = this.productoService.findAll();
		model.addAttribute("productos",productos);
		return "admin/productos/index";
	}

	@GetMapping("/add")
	public String add() {
		return "admin/productos/create";
	}

	@GetMapping("/{id}")
	public String details(@PathVariable Integer id, Model model) {
		Producto producto = this.productoService.getById(id);
		model.addAttribute("producto", producto);
		return "admin/productos/details";
	}
	@PostMapping("/save")
	public String save(@ModelAttribute("producto") Producto producto, @RequestParam("image") MultipartFile multipartFile) throws IOException {
		log.info("Guardando nuevo producto: {}", producto.toString());
		this.productoService.save(producto, multipartFile);
		return "redirect:/admin/productos";
	}

	@GetMapping("/edit/{id}")
	public String edit(@PathVariable Integer id, Model model) {
		Producto producto = this.productoService.getById(id);
		model.addAttribute("producto", producto);
		return "admin/productos/edit";
	}

	@PostMapping("/update/{id}")
	public String updateStudent(@PathVariable Integer id, @ModelAttribute("producto") Producto producto, @RequestParam("image") MultipartFile multipartFile) throws IOException {
		Producto productoExistente = this.productoService.getById(id);
		productoExistente.setDescripcion(producto.getDescripcion());
		productoExistente.setCategoria(producto.getCategoria());
		productoExistente.setMarca(producto.getMarca());
		productoExistente.setPrecioVenta(producto.getPrecioVenta());
		productoExistente.setStockMinimo(producto.getStockMinimo());
		productoExistente.setInformacionGeneral(producto.getInformacionGeneral());

		// guardar el producto actualizado
		this.productoService.save(productoExistente, multipartFile);

		return "redirect:/admin/productos";
	}

	@GetMapping("/delete/{id}")
	public String delete(@PathVariable Integer id) {
		productoService.deleteById(id);
		return "redirect:/admin/productos";
	}


}
