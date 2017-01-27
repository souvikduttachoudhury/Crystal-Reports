package com.lister.Project.controller;


import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.List;

import javax.sql.DataSource;

import org.apache.log4j.spi.LoggerFactory;

import com.businessobjects.reports.jdbinterface.connection.IConnection;
import com.businessobjects.samples.CRJavaHelper;
import com.crystaldecisions.reports.common.CrystalResources;
import com.crystaldecisions.sdk.occa.report.application.ParameterFieldController;
//import com.crystaldecisions.sdk.occa.report.application.ReportClientDocument;
import com.crystaldecisions.sdk.occa.report.data.Connection;
import com.crystaldecisions.sdk.occa.report.data.FieldValueType;
import com.crystaldecisions.sdk.occa.report.data.IDatabase;
import com.crystaldecisions.sdk.occa.report.data.IParameterField;
import com.crystaldecisions.sdk.occa.report.data.ParameterField;
import com.crystaldecisions.sdk.occa.report.data.ParameterFieldDiscreteValue;
import com.crystaldecisions.sdk.occa.report.data.ParameterFieldType;
import com.crystaldecisions.sdk.occa.report.data.Tables;
import com.crystaldecisions.sdk.occa.report.document.ReportDocument;
import com.crystaldecisions.sdk.occa.report.exportoptions.ReportExportFormat;
import com.crystaldecisions.reports.reportdefinition.ParameterType;
import com.crystaldecisions.sdk.occa.report.application.ReportClientDocument;
import com.crystaldecisions12.sdk.occa.report.data.Field;
import com.crystaldecisions12.sdk.occa.report.data.Fields;
//import com.crystaldecisions12.sdk.occa.report.data.ParameterFieldType;
import com.crystaldecisions.sdk.occa.report.data.IField;

public class ReportFunctions {
	public static void main(String args[]){
	try{
		ReportClientDocument rcd = new ReportClientDocument();
		//File thefile=new File("D://sample1.rpt");
		rcd.open("sample1.rpt",0);
		ReportDocument rd=new ReportDocument();
		System.out.println("File loaded succesfully");
		ParameterFieldController paramController = rcd.getDataDefController().getParameterFieldController();
		List<IParameterField> fld=rcd.getDataDefController().getDataDefinition().getParameterFields();
	    System.out.println(fld.size());
		for(int i=0;i<fld.size();i++){
		   System.out.println(fld.get(i).getDescription());
		}
		CRJavaHelper crj=new CRJavaHelper();
		try{
		crj.changeDataSource(rcd, "system", "kroger", "jdbc:oracle:thin:@localhost:1521:xe", "oracle.jdbc.driver.OracleDriver", "");
		crj.logonDataSource(rcd, "system", "kroger");
	    Tables tbls=rcd.getDatabaseController().getDatabase().getTables();
	    for(int i=0;i<tbls.size();i++){
	    	System.out.println(tbls.get(i).getName());
	    	List<IField> ifl=tbls.get(i).getDataFields();
	    	for(int j=0;j<ifl.size();j++){
	    		System.out.println(" "+ifl.get(j).getName());
	    	}
	    }
	       //tbls.get(0).getDataFields().get(i).
		  //crj.addDiscreteParameterValue(rcd, "", "myfield", "newval");
		}
		catch(Exception e){
			e.printStackTrace();
		}
		/*
		IParameterField pf = new ParameterField();
		pf.setParameterType(ParameterFieldType.reportParameter);
		pf.setAllowMultiValue(true);
		System.out.println(pf.getParameterType().toString());
		pf.setName("Text");
		if(paramController.isValidType(FieldValueType.stringField)){
			paramController.add(pf);
		}
		*/
		//paramController.setCurrentValue("", "myfield", "This is a new heading");
		ByteArrayInputStream byteArrayInputStream = (ByteArrayInputStream) rcd.getPrintOutputController().export(ReportExportFormat.PDF);
		rcd.close();
		File file = new File("D://myreport.pdf");
	    FileOutputStream fileOutputStream = new FileOutputStream(file);
	    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(byteArrayInputStream.available());
	    byte[] byteArray=new byte[byteArrayInputStream.available()];
		int x = byteArrayInputStream.read(byteArray, 0, byteArrayInputStream.available());
	    byteArrayOutputStream.write(byteArray, 0, x);
	    byteArrayOutputStream.writeTo(fileOutputStream);
	    System.out.println("File exported succesfully");
	    //Close streams.
	    byteArrayInputStream.close();
	    byteArrayOutputStream.close();
	    fileOutputStream.close();
	}
	catch(Exception e){
		e.printStackTrace();
	}
	}
}
