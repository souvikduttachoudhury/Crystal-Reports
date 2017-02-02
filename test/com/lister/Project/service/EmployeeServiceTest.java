package com.lister.Project.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
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
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import com.crystaldecisions.sdk.occa.report.lib.ReportSDKException;
import com.lister.Project.controller.EmployeeController;
import com.lister.Project.dao.EmployeeDao;
import com.lister.Project.dao.EmployeeDaoReadTest;
import com.lister.Project.dao.EmployeeDaoTest;
import com.lister.Project.dao.GenerateReport;
import com.lister.Project.domain.Employee;
import com.lister.Project.rules.MockitoInitializerRule;
import com.lister.Project.service.EmployeeService;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.transaction.annotation.Transactional;

import com.lister.Project.domain.Employee;



//@RunWith(MockitoJUnitRunner.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"classpath*:testconfig.xml","classpath*:DefaultServlet-servlet.xml"})
//@TransactionConfiguration(transactionManager="transactionManager", defaultRollback=false)
//@Transactional(isolation=Isolation.READ_UNCOMMITTED)
public class EmployeeServiceTest {
	private MockMvc mockMvc;
    
    private EmployeeDaoTest empdaotest;
    private EmployeeDaoReadTest empdaoreadtest;
	private Resource rtest;
	private BeanFactory factorytest;
    
    @Autowired
    ApplicationContext context;
    
    
    @InjectMocks
    EmployeeService es;
    
    
    @Mock
    Map<String,Object> model;
    
    @InjectMocks
    Employee emp;
    
    @Before
    //@Rollback(false)
	public void setup() throws Exception{
		MockitoAnnotations.initMocks(this);
		this.mockMvc = MockMvcBuilders.standaloneSetup(es).build();
		System.out.println("Testing Started");
		rtest=new ClassPathResource("testconfig.xml");  	
	    factorytest=new XmlBeanFactory(rtest);  
	    empdaotest=(EmployeeDaoTest)factorytest.getBean("d");
	    
	    emp.setName("Rishabh");
	    emp.setSalary(23000);
	    empdaoreadtest=new EmployeeDaoReadTest();
	    empdaoreadtest.saveEmployee(emp);
	    System.out.println("Inside setup: "+empdaoreadtest.getEmployees().size());
	}
    
    @Test
    public void getEmployee(){
    	System.out.println("Inside test :"+empdaoreadtest.getEmployees().size());
    	Assert.assertEquals(1, empdaoreadtest.getEmployees().size());
    }
    
    @After
    public void terminate() throws SQLException{
    	empdaoreadtest.rollback();
    }
}
