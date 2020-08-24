const jwt = require('jsonwebtoken');

module.exports = {


    verifyToken: function(req, res, next) {

        const token = req.cookies['authorization']
        
        if (token == null) {
            req.flash('error_message', '로그인이 필요합니다');
            return res.redirect('/login')
        } else {
            jwt.verify(token, 'secretKey', (err, authData) => {
                if (err){
                    req.flash('error_message', '로그인이 필요합니다');
                    return res.redirect('/login')

                }
                if (authData) {
                    req.userData = authData;
                    //미들웨어에서 변수를 넘기는 방법!! >> 여기서 넘어가는 authData 는 array 변수 이므로 여기서 userData를 쓰기 위해서는
                    //userData['user']을 써야한다
                    next();
    
                }
    
    
            })
        }
    
    }
};

