# BackEnd_ToyProject
NodeJS / Express / MongoDB / Handlebar 를 활용한 서버구축 프로젝트

## 요약
Bootstrap 의 홈페이지 frontend (css/html) 를 가져와 이를 handlebar 템플릿으로 Nodejs express서버로 연결하여,
MongoDB (Mongoose)를 활용하여 회원가입 및 로그인 데이터베이스를 구축하고 사용자가 각자 post 데이터를 관리할 수 있는 홈페이지를 만들어보았다.

## 시작하기 앞서,
NodeJs 를 배우며 처음 시도해본 프로젝트이므로 많은 시간이 걸렸고 결과물 또한 뛰어나다고 할 수 없지만 스스로 정말 많은 것을 찾아보며 여러기능들을 습득하고 활용하는 법들을 배울 수 있었고 다음에는 여러 사람들과 함께 더 좋은 프로젝트를 할 수 있다는 자신감이 생겼다.

## 시작
    npm i modules // package.json 확인
필수 모듈들을 받아주고 app.js 에 기본적인 실행 설정들을 세팅한후 , views 폴더에 handlebar 파일, routes 폴더에 라우팅파일, models 에 사용될 데이터베이스 스키마정의, helpers 에 자주 쓰일 function들을 모듈화 하였다
프로젝트를 보다 빠르게 확인해가며 만들기 위해 nodemon 을 활용하였다



## 실행
    nodemon app.js

- localhost:4500
> MongoDBURL -> mongodb://localhost:27017/cms

1. Register
![회원가입페이지](https://user-images.githubusercontent.com/69755603/91248668-1d3c0100-e790-11ea-832f-f5143fc4341d.png)

가장먼저 위와 같이 Register 페이지에서 사용자를 등록한다 > Register를 해야 가장 중요한 ADMIN 페이지에 들어갈 수 있다. User 데이터베이스에 사용자데이터가 저장된다.
- 보안 bcrypt 해싱
> 사용자 데이터 보안을 위해 비밀번호를 bcrypt모듈을 사용하여 hashing 작업처리 한다.

2. Login
![로그인페이지](https://user-images.githubusercontent.com/69755603/91249093-24afda00-e791-11ea-80da-822f92f2d1de.png)

회원가입을 하면 로그인창으로 연결되는데 회원가입시에 입력했던 이메일과 비밀번호를 입력하면 된다. 
- 보안 JWT token
> 로그인 시에 JsonWebToken 을 발급하는 방식으로 로그데이터를 보안위협으로 부터 안전하게 만들어주었다. token은 사용자의 쿠키데이터에 저장되며 이를 통해 웹의 여러 기능들에 접근할 수 있게 해주었다. token 은 보안을 위해 30분뒤에 자동 소멸하게 만들어주었다.

3. Admin-Dashboard
![Admin-Dashboard](https://user-images.githubusercontent.com/69755603/91253562-136bcb00-e79b-11ea-9c17-92db1851403e.JPG)

위는 Admin 페이지의 전체적인 레이아웃으로 가장 기본적인 Dashboard 페이지에는 내가 저장한 Post 데이터 및 카테고리, 댓글들을 차트로 확인할 수 있다. 차트 위의 Generate Fake data 는 많은 임의의 Post 데이터를 한 번에 넣고 관리해볼 수 있게 만든 기능으로 faker 모듈을 통해 작성하였다. (사진은 차트를 보여주기 위해 미리 데이터를 삽입해준 상태이다) 또한 우측상단의 Logout을 통해 로그아웃을 할 수 있으며 로그아웃시에는, 발급해준 jwt가 소멸되므로 다시 로그인 해주어야 한다.

4. Admin-Categories
![Admin-Categories](https://user-images.githubusercontent.com/69755603/91253537-03ec8200-e79b-11ea-99fc-7be12a93b540.JPG)

Categories 페이지에선 Post 데이터를 작성하기 전, 어떤 카테고리에 속할지를 정하기 위해 카테고리를 작성할 수 있다. 작성후에, 이름 변경이나 삭제가 가능하다.
카테고리를 작성하면 Category 데이터베이스에 저장이 된다.


5. Admin-Posts
![Admin-Posts](https://user-images.githubusercontent.com/69755603/91253725-78272580-e79b-11ea-8b66-808a3ccf0676.JPG)

Posts 에는 자신이 삽입한 데이터 말고도 전체 Post 데이터를 볼 수 있는 All Posts, 자신이 삽입한 Post 데이터를 Edit,Delete 관리 할 수 My posts, Post 데이터를 직접 만드는 Create Post 가 있다.

- Create Post
![Admin-CreatePost](https://user-images.githubusercontent.com/69755603/91253546-09e26300-e79b-11ea-8546-7defb4811d4c.JPG)
Create Post 에서는 Post의 타이틀, 사진(File Upload), 카테고리, Status, 댓글여부, 설명을 작성할 수 있다.

- All Posts
![Admin-AllPosts](https://user-images.githubusercontent.com/69755603/91253509-f33c0c00-e79a-11ea-84a4-c3a6bc61398c.JPG)
All Post에선 데이터를 편집할 수 없지만 모든 데이터를 확인 할 수 있다.

- My Posts
![Admin-MyPosts](https://user-images.githubusercontent.com/69755603/91253565-15358e80-e79b-11ea-860b-f582a6fb422f.JPG)
My Post에서는 자기가 작성한 Post 데이터만 볼 수 있으며, 편집 및 삭제가 가능하다.

6. Admin-Comments
![Admin-Comments](https://user-images.githubusercontent.com/69755603/91253544-06e77280-e79b-11ea-942c-64682e14a1ba.JPG)

Comments 페이지에서는 자기가 Post데이터에 남긴 댓글들을 확인할 수 있으며 댓글공개 여부를 On/Off를 통해 설정(AJAX)할 수 있고 댓글을 삭제할 수 있다.

7. Home
![Home](https://user-images.githubusercontent.com/69755603/91253728-79585280-e79b-11ea-9b8e-f839e96c5c00.JPG)

홈페이지에는 Admin 페이지에서 입력한 Post 데이터가 출력되고 Post 데이터의 Read More-> 을 통해 해당 데이터의 Body 즉 설명과 댓글을 볼 수 있다. 또한 우측에 카테고리를 통해 카테고리별로 해당하는 Post 데이터를 모아서 볼 수 있다.

8. Home-Post
![Home-Post](https://user-images.githubusercontent.com/69755603/91254807-43689d80-e79e-11ea-9b6d-08e274992bfc.JPG)

홈페이지에서 각 Post 데이터의 정보를 보기위해 들어가면 해당 데이터의 작성자, 설명등을 볼 수 있고, 댓글공개여부가 공개상태면 댓글을 달 수 있다. 댓글은 Comment 데이터 베이스에 저장된다. (댓글은 Admin-Comments 페이지에서 관리가 가능)


