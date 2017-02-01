package com.lister.Project.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import java.io.IOException;
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
@ContextConfiguration(locations={"classpath*:testconfig.xml"})
@TransactionConfiguration(transactionManager="transactionManager", defaultRollback=false)
@Transactional
public class EmployeeControllerTest {
	    private MockMvc mockMvc;
	    
	    private EmployeeDaoTest empdaotest;
		private Resource r;
		private BeanFactory factory;
	    
	    @Autowired
	    ApplicationContext context;
	    
	    @Mock
	    EmployeeService es;
	    
	    @InjectMocks
	    EmployeeController object;
	    
	    
	    @Mock
	    Map<String,Object> model;
	    
	    @InjectMocks
	    Employee emp;
	    
	    
	    
	    @BeforeClass
		public static void initHomeController() throws IOException{
			
		}
	    
	    @Before
		public void setup() throws Exception{
			
			MockitoAnnotations.initMocks(this);
			this.mockMvc = MockMvcBuilders.standaloneSetup(object).build();
			System.out.println("Testing Started");
			r=new ClassPathResource("testconfig.xml");  	
		    factory=new XmlBeanFactory(r);  
		    empdaotest=(EmployeeDaoTest)factory.getBean("d");
		}
	    
	    @After
		public void afterTest() throws ReportSDKException, IOException{
			System.out.println("Testing completed");
		}
	    
	    
	    @SuppressWarnings("deprecation")
		@Test
	    @Rollback(true)
		public void testSaveEmployee() throws Exception {
			emp.setName("Ramaya");
			emp.setSalary(45000);
			object.es=new EmployeeService();
			this.mockMvc.perform(post("/save").param("name", emp.getName()).param("salary", Float.toString(emp.getSalary())))
				.andExpect(status().isOk())
				.andExpect(view().name("employeedtls"))
				.andDo(print());	
			Assert.assertEquals(45000, empdaotest.getEmployeeByName("Ramaya").get(0).getSalary(),0.001);
		}
	    
	    @Test
	    @Rollback(true)
		public void testDeleteEmployee() throws Exception {
	    	object.es=new EmployeeService();
	    	System.out.println(empdaotest.getEmployeeByName("Ramaya").get(0).getId());
			this.mockMvc.perform(post("/delete").param("id", Integer.toString(empdaotest.getEmployeeByName("Ramaya").get(0).getId())))
			.andExpect(status().isOk())
			.andExpect(view().name("employeedtls"))
			.andDo(print());
			
			Assert.assertEquals(null, empdaotest.getById(emp.getId()));
			
	    }
	    
}
