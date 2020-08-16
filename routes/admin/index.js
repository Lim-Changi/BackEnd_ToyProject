const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const faker = require('faker');
const User = require('../../models/User');
const {verifyToken} = require('../../helpers/jwt-verify');
const jwt = require('jsonwebtoken');


router.all('/*',verifyToken,(req,res,next)=>{
//이 파일에서 router을 실행하기전에 우선적으로 실행시켜주는 코드

    req.app.locals.layout = 'admin';
    next();

});
//기본 home 레이아웃(defaultLayout : 'home') 이 아닌 다른 레이아웃 ('admin')
//을 적용시키기 위해 위의 과정을 실행해준다 


router.get('/', (req, res) => {

    const token = req.cookies['authorization']

    jwt.verify(token, 'secretKey', (err, authData) => {
        if (err) res.sendStatus(403);

        if (authData) {

            res.render('admin/index',{loggeduser: authData.user});
        }


    })
})

router.post('/generate-fake-posts',(req,res)=>{

    let i = 0;
    for(i; i < req.body.amount; i++){

        let post = new Post();
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