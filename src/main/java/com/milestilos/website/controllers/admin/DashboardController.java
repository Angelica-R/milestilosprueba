package com.milestilos.website.controllers.admin;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.milestilos.website.models.Salida;
import com.milestilos.website.services.IngresoService;
import com.milestilos.website.services.SalidaService;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/admin/dashboard")
public class DashboardController {

    private IngresoService ingresoService;
    private SalidaService salidaService;

    public DashboardController(IngresoService ingresoService, SalidaService salidaService) {
        this.ingresoService = ingresoService;
        this.salidaService = salidaService;
    }
    @GetMapping()
	public String index(Model model) {
		double[] ventasDelAnio = this.ingresoService.getTotalesMensualesPorAnio(2024);
		model.addAttribute("ventasDelAnio", ventasDelAnio);
        double totalComprasDelMes = this.ingresoService.getTotalComprasDelMes(LocalDate.now().getMonthValue());
        model.addAttribute("totalComprasDelMes", totalComprasDelMes);
        List<Salida> ventasPorValidar = this.salidaService.findByValidadoPorIsNull();
        model.addAttribute("ventasPorValidar", ventasPorValidar);
        double totalVentasDelDia = this.salidaService.calcularTotalVentasDelDia(LocalDate.now());
        model.addAttribute("fechaHoy",LocalDate.now().toString());
        model.addAttribute("mesActual",LocalDate.now().getMonth().getDisplayName(TextStyle.FULL, Locale.getDefault()));


        model.addAttribute("totalVentasDelDia", totalVentasDelDia);
		return "admin/dashboard/index";
	}

    @GetMapping("/totalesMensualesPorAnio")
    @ResponseBody
    public double[] getTotalesMensualesPorAnio(@RequestParam("anio") int anio){
        System.out.println("ANIO:" + anio);
        return this.ingresoService.getTotalesMensualesPorAnio(anio);
    }
}
