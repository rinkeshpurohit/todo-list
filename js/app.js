(function (w) {
	function Main(id){
		this.model = new w.app.Model(w.localStorage);
		this.view = new w.app.View(id);
		this.controller = new w.app.Controller(this.view,this.model);
	}
	w.app = w.app || {};

	var home = new Main("#todo");
})(window);