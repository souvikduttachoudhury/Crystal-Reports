package com.lister.Project.controller;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.crystaldecisions.sdk.occa.report.lib.ReportSDKException;
import com.lister.Project.domain.Employee;
import com.lister.Project.service.EmployeeService;

/**
 * @author souvik.p
 *
 */
@Controller
@RequestMapping("/dwld")
public class ReportController {
	
	@Autowired
	EmployeeService es;
	
	/**
	 * @param response
	 * @param fname
	 * @throws ReportSDKException
	 * @throws IOException
	 */
	@RequestMapping(value="/{fname}")
	public void Download(HttpServletResponse response,@PathVariable(value="fname") String fname) throws ReportSDKException, IOException{
		//String delimiter="\"";
		//Path f=new Path("D://GeneratedReports/Employee.pdf");
		fname=fname+".pdf";
		//System.out.println("Into this controller"+fname);
	    Path file = Paths.get("D://GeneratedReports", fname);
		//FileOutputStream fileOutputStream = new FileOutputStream(f);
		if (Files.exists(file)) 
        {
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename="+fname);
            try
            {   
            	OutputStream out=response.getOutputStream();
                Files.copy(file, out);
                out.flush();
                out.close();
                //response.flushBuffer();
            } 
            catch (IOException ex) {
                ex.printStackTrace();
            }
        }
		//fileOutputStream.close();
		//return "welcome";
	}
}
