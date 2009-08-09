// package system gunk. 																	   e
try{
	dojo.provide("doh.runner");
}catch(e){
	if(!this["doh"]){
		doh = {};
	}
}

//
// Utility Functions and Classes
//

doh.selfTest = false;

doh.global = this;

doh.hitch = function(/*Object*/thisObject, /*Function|String*/method /*, ...*/){
	var args = [];
	for(var x=2; x<arguments.length; x++){
		args.push(arguments[x]);
	}
	var fcn = ((typeof method == "string") ? thisObject[method] : method) || function(){};
	return function(){
		var ta = args.concat([]); // make a copy
		for(var x=0; x<arguments.length; x++){
			ta.push(arguments[x]);
		}
		return fcn.apply(thisObject, ta); // Function
	};
}

doh._mixin = function(/*Object*/ obj, /*Object*/ props){
	// summary:
	//		Adds all properties and methods of props to obj. This addition is
	//		"prototype extension safe", so that instances of objects will not
	//		pass along prototype defaults.
	var tobj = {};
	for(var x in props){
		// the "tobj" condition avoid copying properties in "props"
		// inherited from Object.prototype.  For example, if obj has a custom
		// toString() method, don't overwrite it with the toString() method
		// that props inherited from Object.protoype
		if(tobj[x] === undefined || tobj[x] != props[x]){
			obj[x] = props[x];
		}
	}
	// IE doesn't recognize custom toStrings in for..in
	if(	this["document"] 
		&& document.all
		&& (typeof props["toString"] == "function")
		&& (props["toString"] != obj["toString"])
		&& (props["toString"] != tobj["toString"])
	){
		obj.toString = props.toString;
	}
	return obj; // Object
}

doh.mixin = function(/*Object*/obj, /*Object...*/props){
	// summary:	Adds all properties and methods of props to obj. 
	for(var i=1, l=arguments.length; i<l; i++){
		doh._mixin(obj, arguments[i]);
	}
	return obj; // Object
}

doh.extend = function(/*Object*/ constructor, /*Object...*/ props){
	// summary:
	//		Adds all properties and methods of props to constructor's
	//		prototype, making them available to all instances created with
	//		constructor.
	for(var i=1, l=arguments.length; i<l; i++){
		doh._mixin(constructor.prototype, arguments[i]);
	}
	return constructor; // Object
}
