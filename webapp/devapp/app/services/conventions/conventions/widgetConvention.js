//define(['plugins/widget', 'widget', 'durandal/viewEngine'], function(widget, widgetLoader, viewEngine){
define(['plugins/widget', 'widget'], function(widget, widgetLoader){
	'use strict';

	function useConvention(){
		widget.convertKindToModulePath = function(kind){
			if(kind.substring(0,7) === 'widget!'){
//				return widgetLoader.parseName( kind.substring(7) );
				return kind;
			} else {
				// Backwards compatible
//				deprecatedAlert(kind);
				return 'widgets/' + kind + '/' + kind + 'Widget';
			}
		};
		widget.convertKindToViewPath = function(kind){
			if(kind.substring(0,7) === 'widget!'){
				var viewModelPath = widgetLoader.parseName( kind.substring(7) );

				return viewModelPath.substring(0, viewModelPath.length - 6) + 'View.html';
			}else{
				return 'widgets/' + kind + '/' + kind + 'View';
			}
		};
	}

	// STUPID THINGS TO ALERT YOU WHEN YOU FORGET TO USE THE NEW RULE widget!kind OR widget!module/kind
/*
	var oldConvertViewIdToRequirePath = viewEngine.convertViewIdToRequirePath,
		lastViewPath
	;

	viewEngine.convertViewIdToRequirePath = function(){
		var view = oldConvertViewIdToRequirePath.apply(this, arguments);
		lastViewPath = view;
		return view;
	};

	var alertedWidgets = [];
	function deprecatedAlert(widgetKind){
		if(alertedWidgets.indexOf(widgetKind) === -1){
			alertedWidgets.push(widgetKind);

			var stack, tmp, i;
			try{
				throw new Error('Deprecated way to refer a widget Widget Kind: ' + widgetKind + ' Posible View: ' + lastViewPath);
			}catch(e){
				stack = e.stack;
			}

			tmp = stack.split('\n');
			stack = [];

			for(i = 0; i < tmp.length; i++){
				if(tmp[i].indexOf('widgetConvention.js') === -1){
					stack.push(tmp[i]);
				}
			}

			system.error(stack.join('\n'));
		}
	}
*/
	return useConvention;

});