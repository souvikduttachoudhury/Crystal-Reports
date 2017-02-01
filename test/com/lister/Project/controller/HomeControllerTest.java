package com.lister.Project.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import java.io.IOException;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.MessageSource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MockMvcBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.setup.StandaloneMockMvcBuilder;
import org.springframework.ui.Model;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import com.crystaldecisions.sdk.occa.report.lib.ReportSDKException;
import com.lister.Project.domain.Employee;
import com.lister.Project.rules.MockitoInitializerRule;
import com.lister.Project.controller.HomeController;

/*
@WebAppConfiguration
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"classpath*:DefaultServlet-servlet.xml"})
*/
@RunWith(MockitoJUnitRunner.class)
public class HomeControllerTest {

	    private MockMvc mockMvc;
	    
	    @Autowired
	    ApplicationContext context;
	    
	    @InjectMocks
	    HomeController object;
	    
	    @Mock
	    Model model;
	    
	    
	    @Rule
	    public TestRule mockitoInitializerRule = new MockitoInitializerRule(this);
	    
	    //View mockview;
	
		@BeforeClass
		public static void initHomeController() throws IOException{
			
		}
		
		@Before
		public void setup() throws Exception{
			
			MockitoAnnotations.initMocks(this);
			this.mockMvc = MockMvcBuilders.standaloneSetup((new HomeController())).build();
			
			System.out.println("Testing Started");
		}
		
		
		@After
		public void afterTest() throws ReportSDKException, IOException{
			System.out.println("Testing completed");
		}
		
		@Test
		public void testHandleLogin() throws Exception {
			
			String s = object.Hello(model);
			Assert.assertEquals("welcome", s);
			this.mockMvc.perform(get("/"))
				.andExpect(status().isOk())
				.andExpect(view().name("welcome"));
		}
	
}
