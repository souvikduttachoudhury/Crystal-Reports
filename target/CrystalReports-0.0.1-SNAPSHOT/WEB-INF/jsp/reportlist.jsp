<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>    
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Download</title>
<script type="text/javascript">
	function down(r){
		var url="dwld"+"/"+r;
		window.open(url,"_self");
	}
</script>
</head>
<body>
<div class="wrapper" style="margin-left:30%;margin-top:1%">
<h2>&nbsp;&nbsp;&nbsp;&nbsp;Generated Reports</h2>
	<table>
	<c:set var="serial" scope="session" value="${0}"/>
    <c:forEach items="${reports}" var="report">
		<tr>
		    <c:set var="serial" scope="session" value="${serial+1}"/>
			<td><c:out value="${serial}"/></td>
			<td style="padding:20px"><a href="#" style="text-decoration:none" onclick="down('${report}')">${report}</a></td>
		</tr>
	</c:forEach>
	</table>
</div>	
</body>
</html>