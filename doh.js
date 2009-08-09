doh = {
	
	// This is a temporary structure which points to the current data.
	_current:{
		group:null,
		groupIndex:-1,
		test:null,
		testIndex:-1
	},
	// A helper property, which stores a reference to a test group by name.
	_groupsByName:{},
	
	// Statistical data.
	_numTests:0, // The total number of tests.
	_numTestsExecuted:0, // Number of tests already executed.
	
	// Stats about the test results.
	_numErrors:0,
	_numFailures:0,
	
	//
	_isPaused:false,
	_defaultTimeout:1000,
	_testInFlight:false,
	
	// The groups must be an array, since an object does not necessarily maintain
	// it's order, but tests should be executed in the order as added.
	// This might become even more important when test dependencies will be added,
	// which means only execute test2 if test1 succeeded.
	_groups:[],
	
	pause:function(){
		this._isPaused = true;
	},
	
	register:function(groupName, tests){
		// summary: Register the given tests to the group with the given name.
		// description: The tests are internally stored in "_groups", an array
		// 		which contains all the tests per group. The new tests are added
		// 		to the group with the given name, if it didnt exist yet it is created.
		var group = null;
		if (this._groupsByName[groupName]){
			group = this._groupsByName[groupName];
		} else {
			this._groups.push({name:groupName, tests:[]});
			group = this._groupsByName[groupName] = this._groups[this._groups.length-1];
		}
		for (var i=0, l=tests.length, t; i<l; i++){
			t = {};
			doh.mixin(t, tests[i]);
			//t.test = doh.hitch(this, "_makeDeferred", [t.test]);
			group.tests.push(t);
		}
	},
	
	run:function(){
		this._isPaused = false;
		if (this._testInFlight){
			return;
		}
		if (this._makeNextTestCurrent()){
			this._runTest();
		}
	},
	
	_getAssertWrapper:function(d){
		// summary: This returns an object which provides all the assert methods, and wraps a Deferred instance.
		// description: Why that? The interface for doh tests should be the same
		// 		for synchronous and asynchronous tests. The old version required
		// 		you to "know" and "think" when writing asynch tests, and the
		// 		assert methods had not been available directly when writing
		// 		asynchronous tests, you had to use doh.callback/errback.
		// 		This allows to ONLY use assert*() methods. See the selftests
		// 		for examples.
		var myT = new function(){
			this._assertClosure = function(method, args){
				// If the Deferred instance is already "done", means callback or errback
				// had already been called dont do it again.
				// This might be the case when e.g. the test timed out.
				if (d.fired > -1){
					return;
				}
				try{
					var ret = doh[method].apply(doh, args);
					d.callback(ret || true);
				}catch(e){
					d.errback(e);
				}
			};
			for (var methodName in doh){
				if (methodName.indexOf("assert")===0){
					this[methodName] = (function(methodName){return function(){
						this._assertClosure(methodName, arguments);
					}})(methodName);
				}
			}
		};
		return myT;
	},
	
	_makeNextTestCurrent:function(){
		var c = this._current;
		// Is there a test left in this group?
		if (c.group && c.testIndex < c.group.tests.length-1){
			c.testIndex++;
		} else {
			// First test in the next group, if there is another group.
			if (c.groupIndex < this._groups.length-1){
				c.groupIndex++;
				c.group = this._groups[c.groupIndex];
				c.testIndex = 0;
			} else {
				return false;
			}
		}
		c.test = c.group.tests[c.testIndex];
		return true;
	},

	_runNextTest:function(){
		// summary: Only called from internally after a test has finished.
		if (this._isPaused){
			return;
		}
		if (this._makeNextTestCurrent()){
			this._runTest();
		}
	},
	
	_runTest:function(){
		// summary: This executes the current test.
		// description: This method starts the "test" method of the test object
		// 		and finishes by setting the internal state "_testInFlight" to true,
		// 		which is resolved by the call to "_runNextTest()" which
		// 		automatically happens after the (asynchronous) test has "landed".
		var g = this._current.group,
			t = this._current.test;
		this._testStarted(g, t);
		
		// let doh reference "this.group.thinger..." which can be set by
		// another test or group-level setUp function
		t.group = g; 
		var deferred = new doh.Deferred(),
			assertWrapperObject = this._getAssertWrapper(deferred);
		if(t.setUp){
			t.setUp(assertWrapperObject);
		}
		if(!t.test){
			t.test = function(){deferred.errback(new Error("Test missing."));}
		}
		deferred.groupName = g.name;
		deferred.test = t;
		
		deferred.addErrback(function(err){
			doh._handleFailure(g, t, err);
		});
	
		var retEnd = function(){
			t.endTime = new Date();
			if(t.tearDown){
				t.tearDown(assertWrapperObject);
			}
			doh._testEnd(g, t, deferred.results[0]);
		}
	
		var timer = setTimeout(function(){
			deferred.errback(new Error("test timeout in " + t.name.toString()));
		}, t.timeout || doh._defaultTimeout);
	
		deferred.addBoth(doh.hitch(this, function(arg){
			clearTimeout(timer);
			retEnd();
			this._testInFlight = false;
			setTimeout(doh.hitch(this, "_runNextTest"), 1);
		}));
		this._testInFlight = true;

		t.startTime = new Date();
		t.test(assertWrapperObject);
	}
}




doh._testRegistered = function(group, fixture){
	// slot to be filled in
}

doh._groupStarted = function(group){
	// slot to be filled in
}

doh._groupFinished = function(group, success){
	// slot to be filled in
}

doh._testStarted = function(group, fixture){
	// slot to be filled in
}

doh._testFinished = function(group, fixture, success){
	// slot to be filled in
}






doh._testEnd = function(g, t, result){
	doh._currentTestCount++;
	doh._testFinished(g, t, result);
	if((!g.inFlight)&&(g.iterated)){
		doh._groupFinished(group.name, !g.failures);
	}
}

