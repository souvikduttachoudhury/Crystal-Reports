package com.lister.Project.dao;

import java.util.ArrayList;
import java.util.List;



import org.springframework.orm.hibernate3.HibernateTemplate;

import com.lister.Project.domain.Employee;


public class EmployeeDao {
	HibernateTemplate template;  
	public void setTemplate(HibernateTemplate template) {  
	    this.template = template;  
	}  
	//method to save employee  
	public void saveEmployee(Employee e){  
	    template.save(e);  
	}  
	//method to update employee  
	public void updateEmployee(Employee e){  
	    template.update(e);  
	}  
	//method to delete employee  
	public void deleteEmployee(Employee e){  
	    template.delete(e);  
	}  
	//method to return one employee of given id  
	public Employee getById(int id){  
	    Employee e=(Employee)template.get(Employee.class,id);  
	    return e;  
	}  
	//method to return all employees  
	public List<Employee> getEmployees(){  
	    List<Employee> list=new ArrayList<Employee>();  
	    list=template.loadAll(Employee.class);  
	    return list;  
	}  
	
	public List<Employee> getEmployeeByName(String name){
		List<Employee> list=new ArrayList<Employee>();
		String param[]=new String[2];
		Object val[]=new Object[2];
		param[0]="name";
		//param[1]="salary";
		val[0]=name;
		//int sal=(int)salary;
		//System.out.println(sal);
		//val[1]=salary;
		System.out.println(name);
		list=template.findByNamedQueryAndNamedParam("findEmployeeByName","name",name);
		//list=template.findByNamedQueryAndNamedParam("findEmployeesAboveSal", param, val);
		return list;
	}
}
