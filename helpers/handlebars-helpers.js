const moment = require('moment');
const { options } = require('../routes/home');
//시간을 깔끔하게 출력시켜주는 모듈

module.exports = {


    select : function(selected, options){


        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected = "selected"');
            
    },//RegExp 는 하나라도 잘못되면 제대로 작동하지 않는다!!
  
    generateTime: function(date,format){
        return moment(date).format(format);


    },

    paginate: function(options){

        let output = '';
        if(options.hash.current ===1){
            output += `<li class = "page-item disabled"><a class= "page-link">First</a></li>`;

        }else{

            output += `<li class = "page-item"><a href = "?page=1" class= "page-link">First</a></li>`;

        }

        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);

        if(i !== 1){

            output += `<li class = "page-item disabled"><a class= "page-link">...</a></li>`;

        }
        

        for(;i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; i++ ){

            if(i === options.hash.current){

                output += `<li class = "page-item active"><a class= "page-link">${i}</a></li>`;

            }else{

                output += `<li class = "page-item "><a href = "?page=${i}" class= "page-link">${i}</a></li>`;

            }
            if(i === Number(options.hash.current)+ 4 && i < options.hash.pages){

                output += `<li class = "page-item disabled"><a class= "page-link">...</a></li>`;
    
            }

            

        }

        if(options.hash.current === options.hash.pages || options.hash.pages === 0){

            output += `<li class = "page-item disabled "><a class= "page-link">Last</a></li>`;


        }else{
            output += `<li class = "page-item "><a href = "?page=${options.hash.pages}" class= "page-link">Last</a></li>`;

        }


        return output;
        // console.log(options.hash.current);


    }

}





