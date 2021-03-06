const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const faker = require('faker');
const User = require('../../models/User');
const {verifyToken} = require('../../helpers/jwt-verify');
const jwt = require('jsonwebtoken');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');


router.all('/*',verifyToken,(req,res,next)=>{
//이 파일에서 router을 실행하기전에 우선적으로 실행시켜주는 코드

    req.app.locals.layout = 'admin';
    req.user = req.userData['user'];
    next();

});
//기본 home 레이아웃(defaultLayout : 'home') 이 아닌 다른 레이아웃 ('admin')
//을 적용시키기 위해 위의 과정을 실행해준다 


router.get('/', (req, res) => {

    const promises = [

        Post.countDocuments().exec(),
        Post.countDocuments({user: req.user}).exec(),
        Category.countDocuments().exec(),
        Comment.countDocuments({user: req.user}).exec(),

    ];

    Promise.all(promises).then(([postCount,mypostCount,categCount,mycomCount])=>{
        res.render('admin/index', { 
            loggeduser: req.user,
            postCount: postCount,
            categCount: categCount,
            mycomCount: mycomCount,
            mypostCount: mypostCount 
        });


    }) //아래와 같지만 훨씬 간단한 방법으로 코드를 짤 수 있는 장점이 존재한다! >>> 순서를 잘 지켜야한다 !!!

    // Post.countDocuments().then(postCount => {
    //     Post.countDocuments({ user: req.user }).then(mypostCount => {
    //         Category.countDocuments().then(categCount => {
    //             Comment.countDocuments({user: req.user}).then(mycomCount => {
    //                 res.render('admin/index', { 
    //                     loggeduser: req.user,
    //                     postCount: postCount,
    //                     categCount: categCount,
    //                     mycomCount: mycomCount,
    //                     mypostCount: mypostCount 
    //                 });
    //             })
    //         })
    //     })
    // })
})

router.post('/generate-fake-posts',(req,res)=>{

    let i = 0;
    for(i; i < req.body.amount; i++){

        let post = new Post();
        post.user = req.user;
        post.title = faker.name.title();
        post.status = faker.random.arrayElement(["Public","Draft","Private"]); //랜덤 배열에서 가짜 데이터 삽입
        post.body = faker.lorem.sentences();
        post.allowComments = faker.random.boolean();

        post.save().then(savedPost =>{
        })

    }

    res.redirect('/admin/posts');
    //for문에서 계속 redirect를 시켜주어 오류가 발생하였다.. 모든 fake 데이터를 집어넣은 후에 
    //redirect 시켜주도록 하자
    console.log( i + ` Amounts of fake data inserted.`);

})
// 많은 데이터가 제대로 들어가는지 확인하기 위해 faker 모듈을 사용해 가상의 데이터를 넣어주어 확인하는 방식
// 여러 가짜 데이터형식을 넣을 수 있다 https://www.npmjs.com/package/faker 확인해보기



module.exports = router;