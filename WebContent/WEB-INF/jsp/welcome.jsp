<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@taglib prefix="form" uri="http://www.springframework.org/tags/form"%>    
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
	<h1>Welcome to Kroger</h1>
	<form:form id="empform" action="save" modelAttribute="Employee">
		<label>Name</label><form:input type="text" path="name" placeholder="enter the name of the employee"/><br/>
		<label>Salary</label><form:input type="number" path="salary" placeholder="enter the salary in rupees"/><br/>
		<input type="submit" value="Save"/>
	</form:form>
</body>
</html>