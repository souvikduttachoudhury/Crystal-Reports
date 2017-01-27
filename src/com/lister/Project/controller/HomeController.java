package com.lister.Project.controller;


import java.io.IOException;

import javax.sql.DataSource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.crystaldecisions.sdk.occa.report.lib.ReportSDKException;
import com.lister.Project.domain.Employee;

@Controller
public class HomeController {
	//DataSource dataSource;
	
	@RequestMapping(value="/")
	public String Hello(Model model) throws ReportSDKException, IOException{
		Employee e=new Employee();
		model.addAttribute("Employee", e);
		return "welcome";
	}
}
