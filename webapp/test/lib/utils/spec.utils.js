function getHashData(){
//	var data = false;
//	if(window.location.search.substring(0, 6) === '?data='){
//		data = JSON.parse( decodeURIComponent(window.location.search.substring(6)) );
//	}
//	return data;
//	
	var m = window.location.search.toString().match(/[?&]specFile=([^&]*)/);
	var specFile = (m !== null && !!m[1]) ? decodeURIComponent(m[1]) : false;
	if(specFile === false){
		return false;
	}else{
		return {spec: specFile, id: specToId(specFile)};
	}
}

function getStressTestData(){
	var m = window.location.search.toString().match(/[?&]stressTest=([^&]*)/);
	var specFile = (m !== null && !!m[1]) ? decodeURIComponent(m[1]) : false;
	
	if(specFile !== false){
		
		var m = window.location.search.toString().match(/[?&]stressIter=([^&]*)/);
		var times = parseInt( (m !== null && !!m[1]) ? decodeURIComponent(m[1]) : 10, 10);
		var specs = [];
		for(var i =0; i < times; i++ ){
			specs.push(specFile);
		}
		return specs;
	}else{
		return false;
	}
}

function __log(){
	if(!!window.console && !!window.console.log){
		window.console.log.apply(window.console, arguments);
	}
}

function getSrcForSpec(spec){
	return window.location.toString() + '?specFile=' + spec;
}

var WINDOWS = {}, WINLIST = [];
function createIframeForSpec(spec){
	var container = document.createElement('li'),
		a  = document.createElement('a'),
		iframe = document.createElement('iframe'),
		id = specToId(spec),
		src = getSrcForSpec(spec)
	;

	container.title = spec;
	
	a.innerHTML = spec;
	a.href = src + '&runalone';
	a.target = '_blank';

	__log('New PopUp', src);
	var win = window.open(src, 'currentTest', 'width=880, height=600, left=1020, top=50, scrollbars=yes, resizable=yes');
	WINLIST.push(win);
	WINDOWS[spec] = win;
//	win.focus();

	container.id = id;
	container.className = 'SpecContainer';
	container.appendChild(a);

	return container;
}

function markAsFailed(spec){
	document.getElementById(specToId(spec)).className = 'failed';
}

function markAsPassed(spec){
	document.getElementById(specToId(spec)).className = 'passed';
}

function isRunAlone(){
	var m = window.location.search.toString().match(/[?&]runalone([^&]*)/);
	return m !== null;
}

function getReporter(){
	return !!window.reporter ? window.reporter : false;
}

function specToId(id){
	id = id.toString().replace(/^[0-9]|[\s\W]/g, '');
	id = id.toString().replace(/^([0-9])/g, '_$1');

	return id;
}

function fixReporter(){
	var parentRunner = jasmine.getEnv().currentRunner(),
		reporter = getReporter()
	;

	var childSpecs = [],
		childSuites = {},
		childTopLevelSuites = [],
		suites = 0;
		oMethods = {},
		functionNames = [
             "reportRunnerStarting",
             "reportRunnerResults",
	         "reportSuiteResults",
	         "reportSpecStarting",
	         "reportSpecResults",
	         "log"
       ],
       queue = []
	;

	function proxyMethod(method){
		if(!!reporter[method]){
			oMethods[method] = reporter[method];
			reporter[method] = function(){
				queue.push([method, arguments]);
			};
		}
	}

	parentRunner.specs = function(){
		return childSpecs;
	};
	parentRunner.topLevelSuites = function(){
		return childTopLevelSuites;
	};

	for(var i = 0; i < functionNames.length; i++){
		proxyMethod(functionNames[i]);
	}

	reporter.reportRunnerStarting = function(runner){
		var specs = runner.specs(),
			topSuites = runner.topLevelSuites()
		;
		for(var i = 0; i < specs.length; i++){
			childSpecs.push(specs[i]);
		}
		for(var i = 0; i < topSuites.length; i++){
			childTopLevelSuites.push(topSuites[i]);
		}
	};
	reporter.reportRunnerResults = function(){};
	if(!!reporter.summarize_){
		reporter.summarize_ = function(suiteOrSpec) {
			var isSuite = !!suiteOrSpec.before_ && suiteOrSpec.after_;
			var summary = {
			    id : suiteOrSpec.id,
			    name : suiteOrSpec.description,
			    type : isSuite ? 'suite' : 'spec',
			    children : []
			};

			if (isSuite) {
				var children = suiteOrSpec.children();
				for ( var i = 0; i < children.length; i++) {
					summary.children.push(this.summarize_(children[i]));
				}
			}
			return summary;
		};
	}

	reporter.onFinishSuite = function(){
		var specs = parentRunner.specs(), spec;
		// FIX SUITES IDS
		for(var i = 0; i < specs.length; i++){
			spec = specs[i];
			spec.id = i;
			if(!childSuites.hasOwnProperty(spec.suite.getFullName()) ){
				spec.suite.id = ++suites;
				childSuites[ spec.suite.getFullName() ] = spec.suite;
			}
		}

		if(!!oMethods.reportRunnerStarting){
			oMethods.reportRunnerStarting.call(reporter, parentRunner);
			var q = document.getElementById('HTMLReporter'),
				o = document.getElementById('Reporter');
			if(q){
				o.appendChild(q.parentNode.removeChild(q));
			}
		}
		var a;
		for(var i = 0; i < queue.length; i++){
			a = queue[i];
			method = a[0];
			args = a[1];

			if(!!oMethods[ method ]){
				oMethods[ method ].apply(reporter, args);
			}
		}

		if(!!oMethods.reportRunnerResults){
			oMethods.reportRunnerResults(reporter, parentRunner);
		}else{
			runner.finished = true;
		}
	};

}

function __remove__(id){}
/*function __remove__(id){
	document.getElementById(id).parentNode.removeChild(document.getElementById(id));
}*/

function mustExecuteWholeSuite(){
	var response = false;

	if(window.location.search.toString().indexOf('?spec=') !== -1){
		response = true;
	}else if(window.location.search.toString().indexOf('?whole') !== -1){
		response = true;
	}else if(window.reporterClass === 'JsApiReporter'){
		response = false;
	}
	return response;
}

window.setHeight = function(iframeId, win){};
/*window.setHeight = function(iframeId, win){
	try{
		var height = win.getComputedStyle(win.document.body).height;
		height = parseInt(height.replace('px', ''), 10) + 20;
	
		var e = document.getElementById(iframeId);
		if(e){
			e.style.height = height + 'px';
		}
	}catch(e){
		
	}
};*/

var SpecIterator = {
	specs: [],

	onFinishSuite: null,
	_onFinishSuite: null,

	init: function(specs, onFinishSuite){
		fixReporter();

		if(!!getReporter()){
			var me = this;

			this._onFinishSuite = function(){
				if(!!onFinishSuite){
					onFinishSuite();
				}
				getReporter().onFinishSuite();
				getReporter().finished = true;
				
				printReporter();
			};
		}else{
			this._onFinishSuite = onFinishSuite;
		}

		this.specs = specs;
		this.specs.reverse();
		this.ix = -1;
		this._loadNext();
	},
	
	onFinishSuite: function(){
		WINLIST[WINLIST.length - 1].close();
		this._onFinishSuite();
	},

	loadNext: function(reporter){
		clearTimeout(this._watchDog);
		var me = this;

		if(reporter){
			printReporter(reporter);
			var spec = this.specs[this.ix];
			this._checkIsValid(reporter, spec);
		}

		setTimeout(function(){
			me._loadNext();
		}, 1);
	},

	_loadNext: function(){
//		this._sim(1);

		if(WINLIST.length > 0){
			WINLIST[WINLIST.length-1].close();
		}
		this.ix++;
		var b = document.getElementById('Specs'), container, specFile;
		if(this.ix < this.specs.length){
			specFile = this.specs[this.ix];
			this._currentSpec = specFile;
			_specFile = '/' + specFile;
	 		container = createIframeForSpec(_specFile);
	 		__log('Loading: ' + _specFile);
	 		b.appendChild(container);
	 		document.getElementById('Specs').scrollTop = 100000;
	 		this._setDumbPreventerWatchDog(specFile);
		}else{
			if(!!this.onFinishSuite){
				this.onFinishSuite();
			}
		}

	},

	_runned: {},
	
	markAsRunning: function(){
		var specFile = this.specs[this.ix];
		this._runned[specFile] = true;
		clearTimeout( this._dumbPreventerWatchDog );
	},

	runCurrent: function(){
		this._runCurrent();
		// watchdog
		var me = this;
		
		this._watchDog = setTimeout(function(){
			me._valid(false);
			me.loadNext(false);
		}, 60000);
	},

	_runCurrent: function(){
		var b = document.body, specFile;
		if(this.ix < this.specs.length){
			specFile = this.specs[this.ix];

			__log('Running: ' + specFile);
			var win = WINDOWS['/'+specFile];
			win.executeTests();
		}
	},

	_setDumbPreventerWatchDog: function(specFile){
		var me = this;
		var win = WINDOWS['/'+specFile];
		this._runned[specFile] = false;
		this._dumbPreventerWatchDog = setTimeout(function(){
			if(me._runned[specFile] === false){
				__log('(DUMB PREVENTER) REFRESHING...');
				createIframeForSpec(specFile);
				me._setDumbPreventerWatchDog();
			}
		}, 1500);
	},
	
	_checkIsValid: function(reporter, spec){
		var valid = false, results = reporter.results(), result, id;
		for( id in results){
			result = results[id];
			valid = result.result === 'passed';
			if(!valid){
				break;
			}
		}
		this._valid(valid);
	},
	
	_valid: function(valid){
		spec = this.specs[this.ix];
		
		valid ? markAsPassed(spec) : markAsFailed(spec);  
		
//		if(!valid){
//			document.getElementById('ErrorSpecs').style.display = 'block';
//			var li = document.createElement('li');
//			var a = document.createElement('a');
//			a.href = getSrcForSpec(spec);
//			a.innerHTML = spec;
//			a.target = '_blank';
//			li.appendChild(a);
//			document.getElementById('ErrorSpecs_list').appendChild(li);
//		}else if(window.RemoveSpecIframes === true){
//			id = specToId(spec)+'_container';
//			__remove__(id);
//		}
		
	},

	_sim: function(n){
		if(this.ix === n){
			this.ix = this.specs.length;
		}
	}

};

function printReporter(reporter){
	var txt = '';
	
	if(reporter === undefined){
		reporter = window.reporter;
	}
	
	
	if(!!reporter && window.reporterClass == 'JsApiReporter'){
		var results = reporter.results();
		var suites =  reporter.suites();
		var i;
		
		for(i in suites){
			if(suites.hasOwnProperty(i)){
				txt += printSuite(suites[i], results) + '\n';
			}
		}
		
		var passed=0, failed=0, total=0;
		for(i in results){
			if(results.hasOwnProperty(i)){
				total++;
				if(results[i].result === 'passed'){
					passed++;
				}else{
					failed++;
				}
			}
		}
		txt += '\n\n TOTAL: ' + total + ' | Failed: ' + failed + ' | Passed: ' + passed;
		__log(txt);
	}
	
}

function printSuite(suite, results, tabs){
	if(undefined === tabs){
		tabs = '\t';
	}
	
	var result = results[suite.id], m;
	if(!!result){
		
		var txt = suite.name + ': ' + result.result.toUpperCase();
		var i;
		
		if(result.result !== 'passed'){
			for(i in result.messages){
				if(result.messages.hasOwnProperty(i)){
					m = result.messages[i];
					txt += '\n' + tabs +'\t' + m.type + ' ' + m.actual + ' ' + m.matcherName + ' ' + m.expected;
				}
			}
		}
		
		
		for(i in suite.children){
			if(suite.children.hasOwnProperty(i)){
				txt += '\n' + tabs + printSuite(suite.children[i], results, tabs + '\t');
			}
		}
		
		return txt;
	}else{
		return suite.name + ': unknow';
		
	}
}



