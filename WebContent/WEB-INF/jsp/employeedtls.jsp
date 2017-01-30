<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="form" uri="http://www.springframework.org/tags/form"%>    
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
	<div class="wrapper" style="margin-left:30%;margin-top:1%">
	<h2>&nbsp;&nbsp;&nbsp;&nbsp;List of Employees</h2>
	<table style="left:33%;top:33%;border-spacing:8px">
    <thead>
	<tr>
			<td>ID</td>
			<td>Name</td>
			<td>Salary</td>
	</tr>
	</thead>
	<c:forEach items="${Employees}" var="employee">
		<tr>
			<td>${employee.id}</td>
			<td>${employee.name}</td>
			<td>${employee.salary}</td>
			<td>
			<form name="deleteform" action="delete" method="post">
				<input type="hidden" name="id" value="${employee.id}"/>
				<button  type="submit">Delete</button>
			</form>
			</td>
		</tr>
	</c:forEach>
	</table>
	<form name="Generate_Report" action="generate" method="post">
				<button  type="submit">Publish Report</button><br/>
				<div id="msg" style="color:red">${message}</div>
	</form>
	</div>
</body>
</html>