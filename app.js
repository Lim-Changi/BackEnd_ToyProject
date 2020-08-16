const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
const bPs = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const cookieParser = require('cookie-parser');





mongoose.connect(mongoDbUrl).then((db)=>{

    console.log('MONGODB connected');

}).catch(error=>console.log(`COULD NOT CONNECT `+ error));



app.use(express.static(path.join(__dirname,'public')));
// localhost:4500의 서버위치에 디렉토리/public 폴더안 데이터를 배치시킨다
// express.static



app.use(methodOverride('_method'));
//post데이터를 put이나 delete 방식의 데이터로 전송시켜준다

app.use(session({
    secret : 'Changi',
    resave : true,
    saveUninitialized : true

}));

//Local Variables using Middleware

app.use(flash());

app.use((req,res,next)=>{

    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');


    next();
})
// flash 모듈 사용하기
// route에서 req.flash를 쓸때는 res.redirect 전에 먼저 코드를 작성해야한다!!

// View Engine
const {select,generateTime} = require('./helpers/handlebars-helpers');
app.engine('handlebars',exphbs({defaultLayout: 'home',helpers : {select : select, generateTime: generateTime}}));
//views폴더의 layouts 폴더에서 home.handlebars 파일을 기본적으로 적용시켜준다
//어떠한 서버 위치에 handlebars파일을 적용시켜도 기본 레이아웃으로 적용시킨다
app.set('view engine','handlebars');
//handlebars 템플릿 엔진을 사용할때 위의 두줄을 꼭 포함시켜줘야 한다.

app.use(upload());
//데이터베이스에 파일을 업로드 하기위한 middleware


app.use(bPs.urlencoded({extended : true}));
app.use(bPs.json());
//bodyparser 사용

app.use(cookieParser());
// cookie 사용





//LOADING ROUTES
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');

const bodyParser = require('body-parser');

app.use('/',home);
// 홈에서 연결되는 모듈화 시킨 라우트 파일 사용
app.use('/admin',admin);
// 이미 여기서 admin 라우트에 연결시켜 주기 때문에 admin라우트 파일에선 /admin에
// 따로 연결시켜 줄 필요가 없다.
app.use('/admin/posts',posts);
app.use('/admin/categories',categories);







app.listen(4500,()=>{

    console.log(`Listening on port 4500`);

});