package com.lister.Project.rules;

import org.junit.runners.model.Statement;
import org.mockito.MockitoAnnotations;

public class MockitInitilizationStatement extends Statement {
	private final Statement base;
    private Object test;

    MockitInitilizationStatement(Statement base, Object test) {
        this.base = base;
        this.test = test;
    }

    @Override
    public void evaluate() throws Throwable {
        MockitoAnnotations.initMocks(test);
        base.evaluate();
    }
}
