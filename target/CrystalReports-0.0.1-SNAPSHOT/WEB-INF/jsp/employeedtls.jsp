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
	<table style="left:33%;top:33%;border-spacing:8px">
	<tr>
			<td>ID</td>
			<td>Name</td>
			<td>Salary</td>
	</tr>
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
</body>
</html>