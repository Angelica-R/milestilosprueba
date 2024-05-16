package com.milestilos.website.controllers;

import org.springframework.web.bind.annotation.*;

import com.milestilos.website.models.Producto;
import com.milestilos.website.models.ProductoDTO;
import com.milestilos.website.services.ProductoService;

import java.io.IOException;

import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/productos")
public class ProductoPublicController {
    private ProductoService productoService;

	public ProductoPublicController(ProductoService productoService) {
		this.productoService = productoService;
	}

    @GetMapping("/buscar-producto-codigo")
	public ProductoDTO buscarProductoPorCodigo(@RequestParam("codigo") String codigo) {
		ProductoDTO producto = this.productoService.findByCodigo(codigo);
		return producto;
	}

	@GetMapping(path = "/images/{fileName}", produces = IMAGE_PNG_VALUE)
	@ResponseBody
	public byte[] getServerImage(@PathVariable String fileName) throws IOException {
		return this.productoService.getImageBytes(fileName);
	}

	@PostMapping("/{id}")
	public Producto getProductoById(@PathVariable int id) {
		return this.productoService.getById(id);
	}


}
