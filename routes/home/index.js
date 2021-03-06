const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { verifyToken } = require('../../helpers/jwt-verify');


router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'home';
    next();

});

router.get('/', (req, res) => {

    const perPage = 10;
    const page = req.query.page || 1;

    Post.find({}).lean()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate('user')
        .then(posts => {

            Post.countDocuments().then(postCount=>{

                Category.find({}).lean().
                then(categories => {

                    res.render('home/index', { 
                        posts: posts,
                        categories: categories,
                        current: parseInt(page),
                        pages: Math.ceil(postCount / perPage) 
                    });

                })



            })

            

        })

    //res.render 은 views 폴더에 있는 템플릿 엔진파일들을 서버에 전송시켜준다
    //home/index.handlebars  템플릿 엔진 사용 > 위에서 기본 레이아웃 설정한 home.handlebars 적용

})

router.get('/about',(req,res)=>{

    res.render('home/about');
// /about 라우트에 /views/home/about.handlebars 적용
// > /views/layouts/home.handlebars파일은 우선적으로 기본적용

})

router.get('/login',(req,res)=>{

    res.render('home/login');

})

router.get('/logout',(req,res)=>{

    res.clearCookie('authorization');

    res.redirect('/login')

})


//로그인시, jwt 발급 cookie에 저장
router.post('/login', (req, res) => {

    User.findOne({ email: req.body.email }).lean()
        .then(log => {
            if (!log) {
                req.flash('error_message', '아이디가 존재하지 않습니다');
                res.redirect('/login');
            } else {
                bcrypt.compare(req.body.password, log.password, (err, matched) => {

                    if (err) res.sendStatus(403);
                    if (matched) {
                        jwt.sign({ user: log }, 'secretKey', {expiresIn : '1h'}, (err, token) => {
                            res.cookie('authorization', token);
                            res.redirect('/admin');
                        })

                    }else{
                        req.flash('error_message', '비밀번호가 일치하지 않습니다');
                        res.redirect('/login');
                    }

                })

            }


        });

})


router.get('/category/:id', (req, res) => {

    Category.find({}).lean()
        .then(categories => {
            Category.findOne({ _id: req.params.id }).lean()
                .then(category => {


                    Post.find({ category: req.params.id }).lean()
                        .then(posts => {

                            res.render('home/category', { posts: posts, category: category, categories : categories });

                        })

                });
        });

})

router.get('/register',(req,res)=>{

    res.render('home/register');

})

router.post('/register', (req, res) => {


    User.findOne({email : req.body.email})
    .then(user=>{
        if(user){

            req.flash('error_message', '이메일이 이미 존재합니다');

            res.redirect('/register');


        }else{
            if(req.body.password !== req.body.passwordConfirm)
            {
                req.flash('error_message', '비밀번호 확인이 일치하지 않습니다');
                res.redirect('/register');
            }else{
                const newUser = new User({

                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
            
            
                });
            
                //해싱 작업 bcrypt 모듈 사용
            
                bcrypt.genSalt(10, (err, salt) => {
            
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
            
                        newUser.password = hash;
            
                        newUser.save().then(savedUser => {
            
                            req.flash('success_message', 'You are now registerd, Please Login');
            
                            res.redirect('/login');
            
            
                        });
            
                    })
            
                })

            }
           

        }


    })



})


router.get('/post/:id',verifyToken, (req, res) => {

    Post.findOne({ _id: req.params.id }).lean()
    .populate({path:'comments', match: {approveComment: true} ,populate: {path: 'user', moedel: 'users'}}) 
    // 연쇄적으로 poplulate 하는 방식! 여러번 엮인 테이블들의 데이터를 불러올 수 있다.
    // 위의 match: {approveComment: true} 방식을 통해 approveComment가 true인 comment 데이터만 populate 함으로써 댓글창에 출력되게 해준다
    .populate('user')
        .then(post => {

            Category.find({}).lean()
            .then(categories => {
                res.render('home/post', { post: post, categories: categories, loggeduser: req.userData['user'] });
            })
        });

})


module.exports = router;