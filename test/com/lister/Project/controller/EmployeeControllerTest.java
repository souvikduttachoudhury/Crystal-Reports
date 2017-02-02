package com.lister.Project.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Map;
import java.util.Properties;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestRule;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.*;
import org.mockito.junit.MockitoRule;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.MessageSource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MockMvcBuilder;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.setup.StandaloneMockMvcBuilder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import com.crystaldecisions.sdk.occa.report.lib.ReportSDKException;
import com.lister.Project.dao.EmployeeDao;
import com.lister.Project.dao.EmployeeDaoTest;
import com.lister.Project.domain.Employee;
import com.lister.Project.rules.MockitoInitializerRule;
import com.lister.Project.service.EmployeeService;

@SuppressWarnings("unused")
//@RunWith(MockitoJUnitRunner.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"classpath*:testconfig.xml","classpath*:DefaultServlet-servlet.xml"})
@TransactionConfiguration(transactionManager="transactionManager", defaultRollback=true)
@Transactional
public class EmployeeControllerTest {
	    private MockMvc mockMvc;
	    private int initialReportCount;
	    private File directory;
	    
	    private EmployeeDaoTest empdaotest;
		private Resource r;
		private BeanFactory factory;
	    
	    @Autowired
	    ApplicationContext context;
	    
	    @Mock
	    EmployeeService es;
	    
	    @InjectMocks
	    EmployeeController object;
	    
	    
	   // @Mock
	   // Map<String,Object> model;
	    
	    @InjectMocks
	    Employee emp;
	    
	    
	    
	    @BeforeClass
		public static void initHomeController() throws IOException{
			
		}
	    
	    @Before
	    @Rollback(false)
		public void setup() throws Exception{
			
			MockitoAnnotations.initMocks(this);
			this.mockMvc = MockMvcBuilders.standaloneSetup(object).build();
			System.out.println("Testing Started");
			r=new ClassPathResource("testconfig.xml");  	
		    factory=new XmlBeanFactory(r);  
		    empdaotest=(EmployeeDaoTest)factory.getBean("d");
		    
		    
		    directory=new File("D://GeneratedReports");
		    initialReportCount=directory.listFiles().length;
		    
		    
		}
	    
	    @After
		public void cleanUp() throws ReportSDKException, IOException{
			
	    	System.out.println("Testing completed");
		}
	    
	    
	    
	    @SuppressWarnings("deprecation")
		@Test
		@Transactional
	    @Rollback(true)
		public void testSaveEmployee() throws Exception {
			emp.setName("Rohan");
			emp.setSalary(45000);
			object.es=new EmployeeService();
			this.mockMvc.perform(post("/save").param("name", emp.getName()).param("salary", Float.toString(emp.getSalary())))
				.andExpect(status().isOk())
				.andExpect(view().name("employeedtls"))
				.andDo(print());	
			Assert.assertEquals(45000, empdaotest.getEmployeeByName("Rohan").get(0).getSalary(),0.001);
		}
	    
	    
	    
	    
	    @Test
	    @Transactional
	    @Rollback(true)
		public void testDeleteEmployee() throws Exception {
	    	object.es=new EmployeeService();
			this.mockMvc.perform(post("/delete").param("id", Integer.toString(empdaotest.getEmployeeByName("Rohan").get(0).getId())))
			.andExpect(status().isOk())
			.andExpect(view().name("employeedtls"))
			.andDo(print());
			Assert.assertEquals(null, empdaotest.getById(emp.getId()));
	    }
	    
	    
	    @Test
	    public void checkReport() throws Exception{
	    	object.es=new EmployeeService();
	    	ResultActions rac=this.mockMvc.perform(get("/generate"))
	    	.andExpect(status().isOk())
	    	.andExpect(view().name("reportlist"))
	    	.andExpect(model().attributeExists("reports"));
	    	//.andExpect(model().attributeHasNoErrors("reports"));
	    	Assert.assertEquals(initialReportCount+1, directory.listFiles().length);
	    	//System.out.println(rac.andReturn().getResponse().getContentAsString());
	    	if(initialReportCount==(directory.listFiles().length-1)){
		    	File files[]=directory.listFiles();
		    	Arrays.sort(files, (a, b) -> Long.compare(a.lastModified(), b.lastModified()));
		        File removable=files[files.length-1];
		        removable.delete();
	    	}
	    }
	    
}
