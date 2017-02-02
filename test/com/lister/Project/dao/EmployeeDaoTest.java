package com.lister.Project.dao;

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
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.transaction.annotation.Transactional;

import com.lister.Project.domain.Employee;
/*
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"classpath*:testconfig.xml","classpath*:DefaultServlet-servlet.xml"})
@TransactionConfiguration(transactionManager="transactionManager", defaultRollback=false)
@Transactional
*/
public class EmployeeDaoTest {
	HibernateTemplate template;  
	/**
	 * @param template
	 */
	
	public void setTemplate(HibernateTemplate template) {  
	    this.template = template;  
	}  
	//method to save employee  
	/**
	 * @param e
	 */
	//@Transactional
	//@Rollback(true)
	public void saveEmployee(Employee e){  
	    template.save(e);  
	}  
	//method to update employee  
	/**
	 * @param e
	 */
	public void updateEmployee(Employee e){  
	    template.update(e);  
	}  
	//method to delete employee  
	/**
	 * @param e
	 */
	@Transactional
	public void deleteEmployee(Employee e){  
	    template.delete(e);  
	}  
	//method to return one employee of given id  
	/**
	 * @param id
	 * @return
	 */
	public Employee getById(int id){  
	    Employee e=(Employee)template.get(Employee.class,id);  
	    return e;  
	}  
	//method to return all employees  
	/**
	 * @return
	 */
	public List<Employee> getEmployees(){  
	    List<Employee> list=new ArrayList<Employee>();  
	    list=template.loadAll(Employee.class);  
	    return list;  
	}  
	
	/**
	 * @param name
	 * @return
	 */
	public List<Employee> getEmployeeByName(String name){
		List<Employee> list=new ArrayList<Employee>();
		String param[]=new String[2];
		Object val[]=new Object[2];
		param[0]="name";
		//param[1]="salary";
		val[0]=name;
		System.out.println(name);
		list=template.findByNamedQueryAndNamedParam("findEmployeeByName","name",name);
		//list=template.findByNamedQueryAndNamedParam("findEmployeesAboveSal", param, val);
		return list;
	}
	
	public void rollback() throws HibernateException, SQLException{
		Session session=template.getSessionFactory().getCurrentSession();
	}
}
