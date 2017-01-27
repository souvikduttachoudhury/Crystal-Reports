package com.lister.Project.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import static javax.persistence.GenerationType.SEQUENCE;

@NamedQueries({
	  @NamedQuery(name="findEmployeeByName",query="from Employee e where e.name= :name"),
	  @NamedQuery(name="deleteEmployeeByID",query="delete from Employee e where e.id= :id")
	})
	

@Entity
@Table(name="Employee_kroger")
public class Employee {
	private int id;  
	private String name;  
	private float salary;
	
	@Id
	@GeneratedValue(strategy = SEQUENCE)
	@Column(name = "ID")
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	@Column(name = "NAME")
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "SALARY")
	public float getSalary() {
		return salary;
	}
	public void setSalary(float salary) {
		this.salary = salary;
	}
	@Override
	public String toString() {
		return "Employee [id=" + id + ", name=" + name + ", salary=" + salary + "]";
	}  
}
