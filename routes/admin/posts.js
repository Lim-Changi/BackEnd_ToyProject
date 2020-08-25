const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
//경로 설정시 ( ../  >> 상위폴더  ./ >> 하위폴더 !!)
const fs = require('fs');
const {verifyToken} = require('../../helpers/jwt-verify');



router.all('/*',verifyToken, (req, res, next) => {
    //이 파일에서 router을 실행하기전에 우선적으로 실행시켜주는 코드

    req.app.locals.layout = 'admin';
    req.user = req.userData['user'];
    next();

});
//기본 레이아웃이 home으로 설정되어 있으므로 admin 레이아웃으로 설정


router.get('/create', (req, res) => {

    Category.find({}).lean()
    .then(categories=>{

        res.render('admin/posts/create',{categories:categories,loggeduser: req.user});
    
    });

});

router.get('/', (req, res) => {

    Post.find({}).lean()
        .populate('category') //category의 id가 아닌 이름을 출력하기 위함
        .then(posts => {

            res.render('admin/posts/index', { postdata: posts, loggeduser: req.user })
            //여기서 postdata:posts 에서 왼쪽 postdata가 flag 역할을 한다
        });
})
// handlebars 파일에서 데이터베이스에 있는 레코드를 찾아주는 코드

router.get('/my-posts', (req, res) => {


    Post.find({user: req.user._id}).lean()
        .populate('category') //category의 id가 아닌 이름을 출력하기 위함
        .then(posts => {

            res.render('admin/posts/my-posts', { postdata: posts, loggeduser: req.user })
            //여기서 postdata:posts 에서 왼쪽 postdata가 flag 역할을 한다
        });
})



router.get('/edit/:id', (req, res) => {

    Post.findOne({ _id: req.params.id }).lean()
        .then(posts => {
            
            Category.find({}).lean()
                .then(categories => {

                    res.render('admin/posts/edit', { editpost: posts, categories: categories,loggeduser: req.user });

                });
        });
})

//UPDATING DATA

router.put('/edit/:id', (req, res) => {

    Post.findOne({ _id: req.params.id })
        .then(post => {

            fs.unlink(uploadDir + post.file, () => { });

            let newfilename = '';
            let newdate = '';

            newdate = Date.now()

            if (!isEmpty(req.files)) {

                let file = req.files.file;
                newfilename = Date.now() + '_' + file.name;

                file.mv('./public/uploads/' + newfilename, (err) => {

                    if (err) return err;

                });
            }

            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = false;
            }
            //put 데이터, 즉 update를 사용할때엔 find에서 사용하던 lean() function을 사용하면 안된다!!!!!!
            //아래의 save() function과 같이 쓰지 못한다            
            post.title = req.body.title;
            post.allowComments = allowComments;
            post.body = req.body.body;
            post.status = req.body.status;
            post.file = newfilename;
            post.date = newdate;
            post.category = req.body.category;

            post.save().then(updatedPost => {

                req.flash('success_message',`Post was edited successfully`);

                // console.log('Post Updated');
                res.redirect('/admin/posts/my-posts');

            }).catch(error => {
                console.log(error);
            });


        }).catch(error => {
            console.log(error);
        });

})


//DELETING DATA

router.delete('/:id', (req, res) => {

    Post.findOne({ _id: req.params.id })
        .populate('comments')
        .then(post => {

            if (!post.comments.length < 1) {

                post.comments.forEach(comment => {
                    comment.remove();
                });
            }
            // POST 데이터와 연결된 댓글 데이터를 연쇄적으로 다 같이 삭제하는 작업 >>>> lean() 과 같이 쓰면 안된다!!!!!!!!!!!!!!!!!!!!!

            fs.unlink(uploadDir + post.file, () => { });

        }).catch(error => {

            console.log(error);

        });
    //데이터와 연결된 파일을 먼저 삭제해주는 작업 > fs.unlink 

    Post.deleteOne({ _id: req.params.id }).lean()
        .then(result => {


            req.flash('success_message', 'Post was deleted successfully');
            res.redirect('/admin/posts/my-posts');
            // console.log('Post Deleted');

        }).catch(err => {
            console.log(err);
        })
    //데이터 삭제작업

})

//Saving Data

router.post('/create', (req, res) => {

    let errors = [];

    if (!req.body.title) {
        errors.push({ message: 'Please add a Title' });
    }

    if (!req.body.body) {
        errors.push({ message: 'Please add a Description' });
    }

    if (errors.length > 0) {

        res.render('admin/posts/create', {
            errors: errors
        })

    } else {
        let filename = '';

        if (!isEmpty(req.files)) {

            let file = req.files.file;
            filename = Date.now() + '_' + file.name;
            // 같은 파일이 upload 돼도 구별짓기 위해 upload 시간을 붙혀준다

            file.mv('./public/uploads/' + filename, (err) => {

                if (err) return err;

            });
        }
        //업로드한 파일을 public/uploads 폴더에 저장하는 과정


        let allowComments = true;
        if (req.body.allowComments) {

            allowComments = true;

        } else {

            allowComments = false;

        }
        //BOOLEAN 타입을 true/false 로 입력받는 방법

        const newPost = new Post({
            user: req.user,
            title: req.body.title,
            status: req.body.status,
            allowComments: allowComments,
            body: req.body.body,
            category: req.body.category,
            file: filename
            
        });




        newPost.save().then(savedPost => {

            req.flash('success_message',`Post was created successfully`);

            // console.log('Post Saved');
            res.redirect('/admin/my-posts');


        }).catch(error => {
            console.log('could not save post data   ' + error);
        });

        //console.log(req.body.allowComments);


    }

});


module.exports = router;
