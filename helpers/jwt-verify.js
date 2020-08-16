const jwt = require('jsonwebtoken');

module.exports = {


    verifyToken: function(req, res, next) {

        const token = req.cookies['authorization']
        
        if (token == null) {
            req.flash('error_message', '로그인이 필요합니다');
            return res.redirect('/login')
        } else {
            jwt.verify(token, 'secretKey', (err, authData) => {
                if (err) res.sendStatus(403);

                if (authData) {

                    next();
    
                }
    
    
            })
        }
    
    }
};

