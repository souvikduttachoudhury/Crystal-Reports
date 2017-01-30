package com.lister.Project.controller;


import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.crystaldecisions.sdk.occa.report.lib.ReportSDKException;
import com.lister.Project.domain.Employee;

/**
 * @author souvik.p
 *
 */
@Controller
public class HomeController {
	//DataSource dataSource;
	
	/**
	 * @param model
	 * @return
	 * @throws ReportSDKException
	 * @throws IOException
	 */
	@RequestMapping(value="/")
	public String Hello(Model model) throws ReportSDKException, IOException{
		Employee e=new Employee();
		model.addAttribute("Employee", e);
		return "welcome";
	}
}
