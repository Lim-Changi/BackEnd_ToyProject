const path = require('path');

module.exports = {


    uploadDir: path.join(__dirname, '../public/uploads/'),


    isEmpty: function(obj){


        for(let key in obj){

            if(obj.hasOwnProperty(key)){
                return false;
            }
            

        }
        return true;
    }

};
//hasOwnProperty() 메소드는 객체가 특정 property를 가지고 있는지를  나타내는 boolean 값을 반환한다.




