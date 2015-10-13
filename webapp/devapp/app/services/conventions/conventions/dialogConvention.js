define([
	'jquery',
	'knockout',
	'plugins/dialog'
], function(
	$,
	ko,
	dialog
){

	'use strict';

	var defaultModalContext = dialog.getContext('default'),
		toolkitModalContext = {
			removeDelay: 1000,

			addHost: function(theDialog){
				var body = $('body'),
					blockout = $('<div class="toolkit-modal-blackout"></div>'),
					host = $('<div class="toolkit-modal-workarea"></div>'),
					toolkitWrapper = $('<div class="ui-toolkit-wrapper toolkit-fade toolkit-rendering"></div>').appendTo(body)
				;

				blockout
					.css('zIndex', dialog.getNextZIndex())
					.appendTo(toolkitWrapper)
				;
				host
					.css('zIndex', dialog.getNextZIndex())
					.appendTo(toolkitWrapper)
				;

				theDialog.host = host.get(0);
				theDialog.blockout = blockout.get(0);
				theDialog.container = toolkitWrapper.get(0);

				if(!dialog.isOpen()) {
					$('html').scrollTop(0);
				}
			},

			attached: function(child, parent){
				$('body').addClass('toolkit-modal-opened');
				$(parent).parent().removeClass('toolkit-rendering');
			},

			removeHost: function(theDialog){
				$(theDialog.host).css('opacity', 0);
				$(theDialog.blockout).css('opacity', 0);
				$('body').removeClass('toolkit-modal-opened');

				setTimeout(function() {
					if(!!theDialog.owner.deattach){
						try{
							theDialog.owner.deattach();
						} catch(e) {}
					}

					ko.removeNode(theDialog.host);
					ko.removeNode(theDialog.blockout);
					ko.removeNode(theDialog.container);
				}, this.removeDelay);

			},

			// compositionComplete: function (child, parent, context) {
			compositionComplete: function (child) {
				var $child = $(child);
				$child.removeClass('toolkit-modal-rendering');
			}

		}
	;

	dialog.addContext('toolkit-modal', toolkitModalContext);

	var oldDefaultModalContextRemoveHost = defaultModalContext.removeHost;
	defaultModalContext.removeHost = function(theDialog) {
		var retval = oldDefaultModalContextRemoveHost.apply(this, arguments);

		if(!!theDialog.owner.deattach){
			try{
				theDialog.owner.deattach();
			} catch(e) {}
		}

		return retval;
	};

	dialog.addContext('default', defaultModalContext);

	return toolkitModalContext;

});