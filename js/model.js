(function (a){
	function Model(localStorage) {
		this.todos = localStorage;
		if(this.todos.getItem("mytodos") === null){
			this.todos.setItem("mytodos",JSON.stringify({"todos":[]}));		
		}
		this.task = $.parseJSON(this.todos.getItem("mytodos"));
	};
	Model.prototype.create = function(values) {
		this.task.todos.push(values);
		this.todos.setItem("mytodos",JSON.stringify(this.task));
	};
	Model.prototype.changeStatusOfTask = function (status,id) {
		var taskArray = this.task.todos,self=this;
			$.each(taskArray,function(index) {
				if(id === taskArray[index].id.toString()){
					self.changeStatus(index,status);
					return false;
				}
			});
	};
	Model.prototype.changeStatusOfAll = function (status) {
		var taskArray = this.task.todos,self=this;
		$.each(taskArray,function(index) {
				self.changeStatus(index,status);
			});
	};
	Model.prototype.changeStatus = function(index,status){
		var taskStatus,taskArray = this.task.todos;
		(status) ? taskStatus = "complete" : taskStatus = "incomplete";
		taskArray[index].status = taskStatus;
		this.todos.setItem("mytodos",JSON.stringify(this.task));
	};
	Model.prototype.removeFromStorage = function(taskCount,elementId){
		var taskArray = this.task.todos;
		if(taskCount === "single") {
			$.each(taskArray,function(index){
				if(elementId === taskArray[index].id.toString()){
					taskArray.splice(index, 1);
					return false;
				}
			});
		}
		else {
			var i,len=taskArray.length;
			for(i=0;i<len;i++){
				if(taskArray[i].status === "complete"){
					taskArray.splice(i, 1);
					len--;
					i--;
				}
			}
		}
		this.todos.setItem("mytodos",JSON.stringify(this.task));
	};
	a.app={};
	app.Model = Model;
})(window);