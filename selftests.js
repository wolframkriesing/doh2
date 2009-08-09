// TODO write a test that verifies that the test run in the order as added.
// Write tets for setUp and tearDown

doh.register("Synchronously written tests.",
	[
		//
		//	assertTrue
		//
		{
			name:"fail: assertTrue",
			test:function(t){
				t.assertTrue(false);
			}
		},{
			name:"success: assertTrue",
			test:function(t){
				t.assertTrue(true);
			}
		},
		//
		//	assertFalse
		//
		{
			name:"fail: assertFalse",
			test:function(t){
				t.assertFalse(true);
			}
		},{
			name:"success: assertFalse",
			test:function(t){
				t.assertFalse(false);
			}
		},
		//
		//	assertEqual
		//
		{
			name:"fail: assertEqual bools",
			test:function(t){
				t.assertEqual(true, false);
			}
		},{
			name:"success: assertFalse bools",
			test:function(t){
				t.assertEqual(true, true);
			}
		},
		{
			name:"fail: assertEqual numbers",
			test:function(t){
				t.assertEqual(1, "2");
			}
		},{
			name:"success: assertEqual numbers",
			test:function(t){
				t.assertEqual(1, "1");
			}
		},
		{
			name:"fail: assertEqual arrays",
			test:function(t){
				t.assertEqual([1,2], [2,1]);
			}
		},{
			name:"success: assertEqual arrays",
			test:function(t){
				t.assertEqual([2,3], [2,3]);
			}
		},
		
		
		
		
		
		
		
		
		
		{
			// A missing assert call.
			name:"error: timeout, assert() missing",
			test:function(t){
			}
		},{
			// This test will fail, because it has no implementation of the test method.
			name:"error: test() missing"
		}
	]
);


doh.register("Asynchronous tests.",
	[
		{
			// Inside of an asynch test case you can (and should) still use the assert() methods.
			// No return necessary anymore!!!
			name:"fail: simple asynch",
			timeout:2000,
			test:function(t){
				setTimeout(function(){
					t.assertTrue(false);
				}, 1000);
			}
		},
		{
			name:"success: simple asynch",
			timeout:2000,
			test:function(t){
				setTimeout(function(){
					t.assertTrue(true);
				}, 1000);
			}
		},
		{
			name:"error: timeout",
			timeout:100, // This timeout is shorter than the setTimeout below, this test should fail.
			test:function(t){
				setTimeout(function(){
					t.assertTrue(true);
				}, 1000);
			}
		},
	]
);

var timeDiff;
doh.register("Test doh.pause()",
	[
		{
			// Test that calling pause() from inside a test does pause the test
			// suite and do also test that run() does continue.
			name:"success: pause after this test (and run again)",
			test:function(t){
				t.assertTrue(true);
				doh.pause();
				timeDiff = new Date().getTime();
				setTimeout(function(){doh.run()}, 3500);
			}
		},
		{
			// This test basically measures the time that the test before had
			// paused the test execution and it should be between 3-4 secs.
			name:"success: measure paused time",
			test:function(t){
				var diff = new Date().getTime() - timeDiff
				t.assertTrue(diff > 3000 && diff < 4000, "The pause should be between 3-4 seconds.");
			}
		},
	]
);

// When writing a GUI for the tests it happens that you also want to show the
// test cases that succeeded and maybe with what value, that is what the return
// values are for.
// E.g.
//	test:function(){
//		assertEqual(expectedGeoLocation, actualGeoLocation);
//		return actualGeoLocation;
//	}
// Returning the actual value allows the doh.ui methods to show this value to the user.

(function(){
	var testObject = {
		// We will check if this object has the return value set after the test.
		name:"success: Simple return",
		test:function(t){
			t.assertTrue(true);
			return "jojo";
		}
	};
	doh.register("Return values",
		[
			testObject,
			{
				name:"success: Verify return value from last test",
				test:function(t){
					t.assertEqual(testObject.result, "jojo");
				}
			},
		]
	);
})();

// If the test contains asynch parts you can set the "result" property of the test explicitly instead
// of returning a value, like so.
(function(){
	var testObject = {
		// We will check if this object has the return value set after the test.
		name:"success: Simple return",
		test:function(t){
			setTimeout(function(){
				t.assertTrue(true);
				t.result = "jaja";
			}, 100);
		}
	};
	doh.register("Return values in asynch test",
		[
			testObject,
			{
// Still fails :-(
				name:"success: Verify result value from last test",
				test:function(t){
					t.assertEqual(testObject.result, "jaja");
				}
			},
		]
	);
})();

