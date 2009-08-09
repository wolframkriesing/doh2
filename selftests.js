
doh.register("Synchronously written tests.",
	[
		{
			name:"fail: simple assertTrue",
			test:function(t){
				t.assertTrue(false);
			}
		},{
			name:"success: simple assertTrue",
			test:function(t){
				t.assertTrue(true);
			}
		},{
			name:"fail: timeout, assert() missing",
			test:function(t){
			}
		},{
			// This test will fail, because it has no implementation of the test method.
			name:"fail: test() missing"
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
			name:"fail: timeout",
			timeout:100, // This timeout is shorter than the setTimeout below, this test should fail.
			test:function(t){
				setTimeout(function(){
					t.assertTrue(true);
				}, 1000);
			}
		},
	]
);

doh.register("Other features.",
	[
		{
			name:"success: pause after this test",
			test:function(t){
				t.assertTrue(true);
				doh.pause();
			}
		},
	]
);