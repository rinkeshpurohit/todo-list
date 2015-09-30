(function (app) {
	function Controller(view,model) {
		this.view = view;
		this.model = model;
		this.savedTasks = this.model.task.todos;
		var self = this;
		this.view.bind("taskInput",function (value) {
			self.createNewTask(value);
		});
		this.view.bind("tasks",function (target,action) {
			self.actionsOnTasks(target,action);
		});
		this.view.bind('toggleAll',function (target,state) {
			self.toggleSelectAll(target,state);
		});
		this.view.bind("footer",function (target,val) {
			self.actionsOnFooter(target,val);
		});
		if(this.savedTasks.length){
			this.showSavesTasks(this.savedTasks);
		}
	};
	Controller.prototype.showSavesTasks = function (savedTasks) {
		this.view.loadSavedTasks(savedTasks);
		this.view.render('footerVisibility');
		this.view.render('clearCompVisibility');
		this.view.render('updateCount');
		this.view.render('check4ToggleAll');
	}
	Controller.prototype.createNewTask = function (value) {
		var values = this.view.render('addItem',value,true);
		this.model.create(values);
		this.view.setClassOfTask(values);
		this.view.render("clearInput");
		this.view.render('footerVisibility');
		this.view.render('clearCompVisibility');
		this.view.render('updateCount');
		this.view.render('check4ToggleAll');
	};
	//Actions on a single task such as check,uncheck or delete
	Controller.prototype.actionsOnTasks = function(target,action) {
		var targetClass = $(target).attr('class'),parentId = $(target).closest('li').attr('id');
		switch (action) {
			case 'check' :
			this.view.setTaskAttributes(target);
			this.view.changeStatus(target,target.checked);
			this.view.setTaskVisibility(target,target.checked);
			this.model.changeStatusOfTask(target.checked,parentId);
			break;
			case 'delete' :
			this.view.render('removeItem',target);
			this.view.render('footerVisibility');
			this.model.removeFromStorage("single",parentId);
			break;
		}
		this.view.render('clearCompVisibility');
		this.view.render('check4ToggleAll');
		this.view.render('updateCount');
	};
	Controller.prototype.toggleSelectAll = function(target,state) {
		this.view.setTaskAttributes(target,state);
		this.view.setTaskVisibility(target,state);
		this.model.changeStatusOfAll(target.checked);
		this.view.render('updateCount');
		this.view.render('clearCompVisibility');
	};
	// Changing the tab and removing completed tasks handled here
	Controller.prototype.actionsOnFooter = function(target,val) {
		if(val ==='all' || val === 'completed' || val === 'active'){
			this.view.setTaskVisibility(target,val);
			this.view.changeCurrentTab(target);
		}
		else if(val === "clear"){
			this.view.clearCompleted();
			this.model.removeFromStorage("multiple");
			this.view.render('updateCount');
			this.view.render('check4ToggleAll');
			this.view.render('clearCompVisibility');
			this.view.render('footerVisibility');
		}
	};

	app.Controller = Controller;
})(window.app);