package com.lister.Project.rules;

import org.junit.rules.TestRule;
import org.junit.runner.Description;
import org.junit.runners.model.Statement;

public class MockitoInitializerRule implements TestRule {

	private Object test;

    public MockitoInitializerRule(Object test) {
        this.test = test;
    }
	
    @Override
    public Statement apply(Statement base, Description description) {
        return new MockitInitilizationStatement(base, test);
    }

}
