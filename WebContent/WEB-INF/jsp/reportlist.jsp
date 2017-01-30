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
<table>
    <c:forEach items="${reports}" var="report">
		<tr>
			<td style="padding:20px">${report}</td>
			<td>
				<a href="#" onclick="down('${report}')">Download</a>
			</td>
		</tr>
	</c:forEach>
	</table>
</body>
</html>