<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@taglib prefix="form" uri="http://www.springframework.org/tags/form"%>    
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Employee Details</title>
</head>
<body>
	<div class="wrapper" style="margin-left:30%;margin-top:12.5%">
	<h1>Welcome to Kroger</h1>
	<form:form id="empform" action="save" modelAttribute="Employee">
		<label>Name&nbsp;&nbsp;</label><form:input type="text" path="name" placeholder="enter the name of the employee"/><br/><br/><br/>
		<label>Salary&nbsp;</label><form:input type="number" path="salary" placeholder="enter the salary in rupees"/><br/><br/><br/>
		<label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><input type="submit" value="Save"/>
	</form:form>
	</div>
</body>
</html>