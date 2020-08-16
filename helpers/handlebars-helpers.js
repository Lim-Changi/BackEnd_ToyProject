const moment = require('moment');
//시간을 깔끔하게 출력시켜주는 모듈

module.exports = {


    select : function(selected, options){


        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected = "selected"');
            
    },//RegExp 는 하나라도 잘못되면 제대로 작동하지 않는다!!
  
    generateTime: function(date,format){
        return moment(date).format(format);


    }

}





