const express = require('express');
const router = express.Router();
const Post = require('../../models/Post')
const Comment = require('../../models/Comment')
const {verifyToken} = require('../../helpers/jwt-verify');


router.all('/*',verifyToken,(req,res,next)=>{
    //이 파일에서 router을 실행하기전에 우선적으로 실행시켜주는 코드
    
        req.app.locals.layout = 'admin';
        req.user = req.userData['user'];
        next();
    
});


router.post('/',(req,res)=>{

    Post.findOne({_id: req.body.id}).then(post=>{

        
        const newComment = new Comment({

            user: req.user,
            post: req.body.id,
            body: req.body.body

        })
        
        post.comments.push(newComment);
        post.save().then(savedPost=>{

            newComment.save().then(savedComment=>{

                res.redirect(`/post/${post.id}`);


            })

        })

    })



})

router.get('/',(req,res)=>{

    Comment.find({user: req.user}).lean()
    .populate('user').populate('post') //user와 post의 id가 아닌 이름을 출력하기 위함
    .then(comments=>{
        res.render('admin/comments',{loggeduser: req.user, comments : comments});

    })


})

router.delete('/:id',(req,res)=>{

    Comment.deleteOne({ _id: req.params.id })
        .then(comments => {
            //mongodb(nosql)의 Update 구문 ($pull) 을 활용하여 Post의 Comment부분을 같이 삭제한다  
            Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}},(err,data)=>{

                if(err) console.log(err);
                req.flash('success_message', 'Comment was deleted successfully');
                res.redirect('/admin/comments');

            })
            

        })

})








module.exports = router;