(function (app) {
	function View (id) {
		var mainCtn = $(id);
		this.el={ 
			taskInput : mainCtn.find("#taskInput"),
			selectAll : mainCtn.find(".selectAll"),
			listCheck : mainCtn.find(".check"),
			taskDelete : mainCtn.find(".delete"),
			tasks : mainCtn.find("#tasks"),
			footer : mainCtn.find("#footer"),
			template : Handlebars.compile($("#template").html()),
			counter : mainCtn.find('#leftItems'),
			clearComp : mainCtn.find('#clear')
		};
	};
	//Binding of eventHandlers
	View.prototype.bind = function(e,handler) {
		var $elements = this.el;
		if(e === "taskInput") {
			$elements.taskInput.on('keypress',function(event) {
				var keyCode = event.which,value = $elements.taskInput.val();
				if(keyCode === 13 && value){
					handler(value);
				}
			});
		}
		else if (e === "tasks") {
			$elements.tasks.on('click',function (event) {
				var target = event.target;
				handler(target,$(target).data('action'));
			});
		}
		else if (e === "toggleAll") {
			$elements.selectAll.on('click',function (event) {
				var target = event.target;
				handler(target,target.checked);
			});
		}
		else if (e === "footer"){
			$elements.footer.on('click',function (event) {
				var target = event.target;
				handler(target,$(target).data('btn'));
			});
		}
	};
	View.prototype.render = function (cmd,parameter,isReturning) {
		var elements = this.el,values;
		switch (cmd) {
			case 'addItem' : 
				values=this.addTemplateToList(parameter);
				break;
			case 'clearInput' :
				elements.taskInput.val("");
				break;
			case 'footerVisibility' :
				var $footer = elements.footer;
				(this.totalTasks().length === 0) ? $footer.addClass('hidden') : $footer.removeClass('hidden');
				break;
			case 'clearCompVisibility' :
				var $clearComp = this.el.clearComp , len = this.totalTasks().length;
				(this.getCheckedTasks().length !== 0) ? $clearComp.removeClass('hidden') : $clearComp.addClass('hidden');
				if(len === 0){$clearComp.addClass('hidden');}
				break;
			case 'updateCount' :
				var val = this.getUncheckedTasks().length,$counter=this.el.counter;
				(val === 1) ? $counter.text(val + " task left") : $counter.text(val + " tasks left");
				break;
			case 'check4ToggleAll' :
				var $selectAll = this.el.selectAll , len =this.totalTasks().length,state;
				(this.getCheckedTasks().length === len) ?  state=true: state=false;
				$selectAll.prop('checked',state);
				if(len === 0){
					$selectAll.prop({'checked':false,'disabled':true});
				}
				else { $selectAll.prop('disabled',false);}
				break;
			case 'removeItem' :
				$(parameter).closest('li').remove();
				break;
		}
		if(isReturning){
			return values;
		}

	};
	View.prototype.getTime = function (){
		return  new Date().getTime();
	};
	View.prototype.setClassOfTask = function(values) {
		var $target = $("#"+values.id);
		if($target.data('status') === "complete"){
			$target.addClass('complete');
		}
		if(this.getActiveTab() === "completed"){
			$target.addClass('hidden');
		}  
	}
	View.prototype.loadSavedTasks = function (savedTasks) {
		var $element = this.el,self = this;
		$.each(savedTasks,function(index) {
			$element.tasks.prepend($element.template(savedTasks[index]));	
			self.setClassOfTask(savedTasks[index]);
			self.setTaskAttributes("fromSaved",savedTasks[index].status,savedTasks[index].id);	
		});
	}
	View.prototype.addTemplateToList = function(data,nameOfClass) {
		var $element = this.el;
		var values = {
			id : this.getTime(),
			status : 'incomplete',
			task : data
		};
		$element.tasks.prepend($element.template(values));
		return values;
	};
	View.prototype.getUncheckedTasks = function () {
			return this.el.tasks.children('li[data-status=incomplete]');
	}
	View.prototype.getCheckedTasks = function () {
			return this.el.tasks.children('li[data-status=complete]');
	};
	View.prototype.totalTasks = function (){
		return this.el.tasks.children('li');
	};

	/* performs required tasks such as text-decotation 
	 * toggling the checkbox and 
	 * altering the data attribute of all the tasks as required */
	View.prototype.setTaskAttributes = function (target,state,id) {
		if(target.className === "check"){
			$(target).closest('li').toggleClass('complete');
		}
		else if(target === "fromSaved"){
			var checkbox = $("#"+id).find('.check');
			(state === "complete") ? $(checkbox).prop('checked',true) : $(checkbox).prop('checked',false);
		}
		else {
			var $liElements = this.totalTasks(),$checkBoxes = this.el.tasks.find('.check');
			if(state){
				$liElements.addClass('complete');
				$liElements.attr('data-status','complete') ;
				$checkBoxes.prop('checked',true);
			}
			else{
				$liElements.removeClass('complete') ;
				$liElements.attr('data-status','incomplete') ;
				$checkBoxes.prop('checked',false) ;
			}
			
		}
	};
	//change the data property of particular task to "complete" or "incomplete"
	View.prototype.changeStatus = function (target,state) {
		var parent = $(target).closest('li'),status;
		(state) ? status="complete" : status = "incomplete";
		$(parent).attr('data-status',status);
	};
	View.prototype.getActiveTab = function () {
		return this.el.footer.find(".current").data('btn');
	};
	//Show or hide the tasks on the basis of current tab
	View.prototype.setTaskVisibility = function (target,state) {
		var $activeTab = this.getActiveTab(),$target = $(target),$parent = $target.closest('li');
		if($target.hasClass('check')){
			if($activeTab === "active" && state){
				$parent.addClass("hidden");
			}
			else if ($activeTab === "completed" && !state) {
				 $parent.addClass("hidden");
			}
		}
		else if($target.hasClass('selectAll')) {
			var elements = this.totalTasks();
			(state && $activeTab === "active") ? elements.addClass('hidden') : elements.removeClass('hidden');
			if(!state && $activeTab === "completed") { elements.addClass('hidden');}
		}
		else {
			var $elements = this.totalTasks(),$checked = this.getCheckedTasks(), $unchecked = this.getUncheckedTasks(),btn = $(target).data('btn');
			switch (btn) {
				case "all" :
					$elements.removeClass('hidden');
					break;
				case "active" : 
					$checked.addClass('hidden');
					$unchecked.removeClass('hidden');
					break;
				case "completed" :
					$unchecked.addClass('hidden');
					$checked.removeClass('hidden');
					break;
			}
		}
	};
	View.prototype.changeCurrentTab = function (target) {
		this.el.footer.find('button').removeClass('current');
		$(target).addClass('current');
	};
	View.prototype.clearCompleted = function () {
		this.getCheckedTasks().remove();
	};
	
	app.View = View;
})(window.app);