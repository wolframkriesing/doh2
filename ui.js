doh.ui = {

	started:function(){
		// summary: This is called when run() was called the first time.
		console.log(doh._numTests + " tests registered, in " + doh._groups.length + " groups");
		console.log("--------");
	},

	testRegistered:function(group, test){
	},
	
	groupStarted:function(group){
		console.log("Starting group '" + group.name + "', " + group.tests.length + " tests");
	},
	
	groupFinished:function(group){
		console.log(group.numTestsExecuted + " tests ran, " +
					group.numFailures + " failures, " +
					group.numErrors + " errors");
		console.log("--------");
	},

	testStarted:function(group, test){
	},

	testFailed:function(group, test, error){
		console.log(test.name + " FAILED, " + error);
	},

	testFinished:function(group, test, success){
	},
	
	report:function(){
		console.log(doh._numTestsExecuted + " tests ran, " +
					doh._numFailures + " failures, " +
					doh._numErrors + " errors");
		console.log("========");
	}
}