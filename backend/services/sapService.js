'use strict';
  const logger = require("../utils/logger"); 
 const r3connect = require('r3connect');
 var client;
 const Promise = require('Promise').default;
//  const configuration =require("../../db-config/.db-config.json").sapConnParams;
 const configuration =require('./appConfig').getInstance().getSapConnParam();
exports.getInventoryReport=function(args){
	let param = {
    PSPMON:args.ymdate,//e.g. 201806
    S_WERKS:[
      { SIGN:"I", OPTION:"EQ", PLANT_LOW:"2100" },
      { SIGN:"I", OPTION:"EQ", PLANT_LOW:"2101" },
      { SIGN:"I", OPTION:"EQ", PLANT_LOW:"2102" },
      { SIGN:"I", OPTION:"EQ", PLANT_LOW:"2103" },
      { SIGN:"I", OPTION:"EQ", PLANT_LOW:"2104" }
    ],
    S_MATNR:[
      { SIGN:"I", OPTION:"EQ", MATERIAL_LOW:"BFR1-3028", MATERIAL_HIGH:"BFR1-4018" }
    ]
  }
  return invokeBAPI("ZIM_INVENTORY_REPORTX",param);
};


var invokeBAPI = function(bapiName,param){
	return new Promise(function(resolve,reject){
    r3connect.Pool.get(configuration).acquire()
    .then(function (rfcClient) {
      // Actually call the back-end
      client = rfcClient;
      return client.invoke(bapiName, param);
    })
    .then(function (response) {
          var res=response[0];
          if (res&&res.RETURN&&res.RETURN.length>0&&res.RETURN[0].TYPE==='E'){ 
            console.log("Invoking "+bapiName+" failed:"+res.RETURN[0].MESSAGE);
            throw new Error(res.RETURN[0].MESSAGE);
          }else {
            console.log("Invoking "+bapiName+" successfully");
            return response;
          }
    })
    .then(function(response){
           resolve(response[0]);
    })
    .catch(function (error) {
      // Output error
        console.error('Error invoking'+bapiName+' :', error);

        logger.error({bapiName:bapiName,param:param,error:(error.message||error)});
        reject (error);
    });
    });
}
