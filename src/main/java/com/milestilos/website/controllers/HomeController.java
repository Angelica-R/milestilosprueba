package com.milestilos.website.controllers;

import java.util.ArrayList;
import java.util.List;

import com.milestilos.website.services.ProductoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.milestilos.website.models.Producto;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/")
@Slf4j
public class HomeController {

	private ProductoService productoService;
	public HomeController(ProductoService productoService){
		this.productoService = productoService;
	}
    @GetMapping("/")
	public String index(Model model) {
		List<Producto> productos =this.productoService.findTop4ByOrderByIdAsc();
		model.addAttribute("productos", productos);
		return "home/index";
	}

	@GetMapping("/productos")
	public String productos(Model model) {
		List<Producto> productos =this.productoService.findAll();
		model.addAttribute("productos", productos);
		return "home/productos";
	}

	@GetMapping("/cart")
	public String cart(Model model){

		return "home/cart";
	}

	@GetMapping("/contacto")
	public String contacto(Model model) {
		return "home/contacto";
	}
}
