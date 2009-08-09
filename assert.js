//
// Assertions and In-Test Utilities
//

doh.t = doh.assertTrue = function(/*Object*/ condition, /*String?*/ hint){
	// summary:
	//		is the passed item "truthy"?
	if(arguments.length < 1){ 
		throw new doh._AssertFailure("assertTrue failed because it was not passed at least 1 argument"); 
	} 
	if(!eval(condition)){
		throw new doh._AssertFailure("assertTrue('" + condition + "') failed", hint);
	}
}

doh.f = doh.assertFalse = function(/*Object*/ condition, /*String?*/ hint){
	// summary:
	//		is the passed item "falsey"?
	if(arguments.length < 1){ 
		throw new doh._AssertFailure("assertFalse failed because it was not passed at least 1 argument"); 
	} 
	if(eval(condition)){
		throw new doh._AssertFailure("assertFalse('" + condition + "') failed", hint);
	}
}

doh.e = doh.assertError = function(/*Error object*/expectedError, /*Object*/scope, /*String*/functionName, /*Array*/args, /*String?*/ hint){
	//	summary:
	//		Test for a certain error to be thrown by the given function.
	//	example:
	//		t.assertError(dojox.data.QueryReadStore.InvalidAttributeError, store, "getValue", [item, "NOT THERE"]);
	//		t.assertError(dojox.data.QueryReadStore.InvalidItemError, store, "getValue", ["not an item", "NOT THERE"]);
	try{
		scope[functionName].apply(scope, args);
	}catch (e){
		if(e instanceof expectedError){
			return true;
		}else{
			throw new doh._AssertFailure("assertError() failed:\n\texpected error\n\t\t"+expectedError+"\n\tbut got\n\t\t"+e+"\n\n", hint);
		}
	}
	throw new doh._AssertFailure("assertError() failed:\n\texpected error\n\t\t"+expectedError+"\n\tbut no error caught\n\n", hint);
}


doh.is = doh.assertEqual = function(/*Object*/ expected, /*Object*/ actual, /*String?*/ hint){
	// summary:
	//		are the passed expected and actual objects/values deeply
	//		equivalent?

	// Compare undefined always with three equal signs, because undefined==null
	// is true, but undefined===null is false. 
	if((expected === undefined)&&(actual === undefined)){ 
		return true;
	}
	if(arguments.length < 2){ 
		throw doh._AssertFailure("assertEqual failed because it was not passed 2 arguments"); 
	} 
	if((expected === actual)||(expected == actual)){ 
		return true;
	}
	if(	(this._isArray(expected) && this._isArray(actual))&&
		(this._arrayEq(expected, actual)) ){
		return true;
	}
	if( ((typeof expected == "object")&&((typeof actual == "object")))&&
		(this._objPropEq(expected, actual)) ){
		return true;
	}
	throw new doh._AssertFailure("assertEqual() failed:\n\texpected\n\t\t"+expected+"\n\tbut got\n\t\t"+actual+"\n\n", hint);
}

doh.isNot = doh.assertNotEqual = function(/*Object*/ notExpected, /*Object*/ actual, /*String?*/ hint){
	// summary:
	//		are the passed notexpected and actual objects/values deeply
	//		not equivalent?

	// Compare undefined always with three equal signs, because undefined==null
	// is true, but undefined===null is false. 
	if((notExpected === undefined)&&(actual === undefined)){ 
        throw new doh._AssertFailure("assertNotEqual() failed: not expected |"+notExpected+"| but got |"+actual+"|", hint);
	}
	if(arguments.length < 2){ 
		throw doh._AssertFailure("assertEqual failed because it was not passed 2 arguments"); 
	} 
	if((notExpected === actual)||(notExpected == actual)){ 
        throw new doh._AssertFailure("assertNotEqual() failed: not expected |"+notExpected+"| but got |"+actual+"|", hint);
	}
	if(	(this._isArray(notExpected) && this._isArray(actual))&&
		(this._arrayEq(notExpected, actual)) ){
		throw new doh._AssertFailure("assertNotEqual() failed: not expected |"+notExpected+"| but got |"+actual+"|", hint);
	}
	if( ((typeof notExpected == "object")&&((typeof actual == "object")))&&
		(this._objPropEq(notExpected, actual)) ){
        throw new doh._AssertFailure("assertNotEqual() failed: not expected |"+notExpected+"| but got |"+actual+"|", hint);
	}
    return true;
}

doh._arrayEq = function(expected, actual){
	if(expected.length != actual.length){ return false; }
	// FIXME: we're not handling circular refs. Do we care?
	for(var x=0; x<expected.length; x++){
		if(!doh.assertEqual(expected[x], actual[x])){ return false; }
	}
	return true;
}

doh._objPropEq = function(expected, actual){
	// Degenerate case: if they are both null, then their "properties" are equal.
	if(expected === null && actual === null){
		return true;
	}
	// If only one is null, they aren't equal.
	if(expected === null || actual === null){
		return false;
	}
	if(expected instanceof Date){
		return actual instanceof Date && expected.getTime()==actual.getTime();
	}
	var x;
	// Make sure ALL THE SAME properties are in both objects!
	for(x in actual){ // Lets check "actual" here, expected is checked below.
		if(expected[x] === undefined){
			return false;
		}
	};

	for(x in expected){
		if(!doh.assertEqual(expected[x], actual[x])){
			return false;
		}
	}
	return true;
}

doh._isArray = function(it){
	return (it && it instanceof Array || typeof it == "array" || 
		(
			!!doh.global["dojo"] &&
			doh.global["dojo"]["NodeList"] !== undefined && 
			it instanceof doh.global["dojo"]["NodeList"]
		)
	);
}


doh._AssertFailure = function(msg, hint){
	// idea for this as way of dis-ambiguating error types is from JUM. 
	// The JUM is dead! Long live the JUM!

	if(!(this instanceof doh._AssertFailure)){
		return new doh._AssertFailure(msg);
	}
	if(hint){
		msg = (new String(msg||""))+" with hint: \n\t\t"+(new String(hint)+"\n");
	}
	this.message = new String(msg||"");
	return this;
}
doh._AssertFailure.prototype = new Error();
doh._AssertFailure.prototype.constructor = doh._AssertFailure;
doh._AssertFailure.prototype.name = "doh._AssertFailure";
