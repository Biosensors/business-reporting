'use strict';
var appConfig=(function(){
	var instance;
	function AppConfig(){var config; };
	AppConfig.prototype.setEnv=function(env){
		this.config = require("./../config/conn-config-"+env+".json");
	}
	AppConfig.prototype.getSapConnParam=function(){
		var param = {};
		Object.assign(param,this.config.sapConnParams);
		return param;
	}
	return {
		getInstance : function(){
				if (instance == null) {
						instance = new AppConfig();
						// Hide the constructor so the returned objected can't be new'd...
						instance.constructor = null;
				}
				return instance;
		}
};
})();

module.exports = appConfig;
