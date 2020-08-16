const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const {verifyToken} = require('../../helpers/jwt-verify');

router.all('/*',verifyToken,(req,res,next)=>{
//이 파일에서 router을 실행하기전에 우선적으로 실행시켜주는 코드

    req.app.locals.layout = 'admin';
    next();

});
//기본 home 레이아웃(defaultLayout : 'home') 이 아닌 다른 레이아웃 ('admin')
//을 적용시키기 위해 위의 과정을 실행해준다 

// admin/categories
router.get('/', (req, res) => {

    Category.find({}).lean()
        .then(savedCategory => {

            res.render('admin/categories/index',{Catdata:savedCategory})
            
        });
})

router.post('/create',(req,res)=>{

    const newCategory = Category({

        name: req.body.name

    });

    newCategory.save().then(savedCategory=>{
        req.flash('success_message',`Category was created successfully`)
        res.redirect('/admin/categories');


    }).catch(err=> {console.log(err)});



});

router.get('/edit/:id', (req, res) => {

    Category.findOne({ _id: req.params.id }).lean()
        .then(category => {

            res.render('admin/categories/edit',{editcat:category})
        });


})

router.put('/edit/:id', (req, res) => {

    Category.findOne({ _id: req.params.id })
        .then(category => {
            let newdate = '';
            newdate = Date.now();
            category.name = req.body.name;
            category.date = newdate;


            category.save().then(updatedCategory => {

                req.flash('success_message',`Category was edited successfully`);

                res.redirect('/admin/categories');

            }).catch(error => {
                console.log(error);
            });
        }).catch(error => {
            console.log(error);
        });;


})

router.delete('/:id', (req, res) => {

    Category.deleteOne({ _id: req.params.id }).lean()
    .then(result => {
        req.flash('success_message','Category was deleted successfully');
        res.redirect('/admin/categories');
        
    }).catch(err => {
        console.log(err);
    })

})




module.exports = router;