package com.lister.Project.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.crystaldecisions.sdk.occa.report.lib.ReportSDKException;
import com.lister.Project.domain.Employee;
import com.lister.Project.service.EmployeeService;

@Controller
public class EmployeeController {
	
	@RequestMapping("/save")
	public String show(@ModelAttribute Employee emp,Map<String,Object> model){
		EmployeeService es=new EmployeeService();
		es.addemployee(emp);
		List<Employee> le=es.getEmployeeList();
		model.put("Employees", le);
		return "employeedtls";
	}
	
	@RequestMapping("/delete")
	public String remove(@RequestParam  int id,Map<String,Object> model){
		EmployeeService es=new EmployeeService();
		es.removeEmployeeByID(id);
		List<Employee> le=es.getEmployeeList();
		model.put("Employees", le);
		return "employeedtls";
	}
	
	@RequestMapping("generate")
	public String generate(Model model) throws ReportSDKException, IOException{
		EmployeeService es=new EmployeeService();
		es.generate();
		List<Employee> le=es.getEmployeeList();
		model.addAttribute("Employees", le);
		return "employeedtls";
	}
}
