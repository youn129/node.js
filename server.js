const express = require('express')
const app = express()
var path = require('path');
const http = require('http').createServer(app);
const {Server} = require('socket.io');
const io = new Server(http);
const axios = require("axios");
const { spawn } = require('child_process');
const { ObjectId } = require('mongodb');
app.use(express.urlencoded({ extended: true }));
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
require('dotenv').config();
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

var db;
  MongoClient.connect(process.env.DB_URL, function(err, client){
  if (err) return console.log(err)
  db = client.db('mapdata');

  app.get('/', function (요청, 응답) {
    응답.render('index.ejs');
  });


  http.listen(process.env.PORT, function () {
    console.log('listening on 8080')
  });


  app.use(express.static(path.join(__dirname, 'react-shop/build')));

  app.get('/shoes', function (요청, 응답) {
    응답.sendFile(path.join(__dirname, 'react-shop/build/index.html'));
  })

})


app.get('/search', function(요청, 응답) {
  var 검색조건 = [
    {
      $search: {
        index: 'titleSearch',
        text: {
          query: 요청.query.value,
          path: '제목'
        }
      }
    },
    { $sort : { _id : 1} },
    { $limit : 10 }
  ]
  db.collection('post').aggregate(검색조건).toArray(function(에러, 결과) {
    console.log(결과);
    응답.render('search.ejs', { posts : 결과 });
  });
   
});


app.get('/list', function(요청, 응답) {
  
  db.collection('post').find().toArray(function(에러, 결과) {
    console.log(결과);
    응답.render('list.ejs', { posts : 결과 });
  });
   
});

app.get('/write', function(req, res){
  res.render('write.ejs')
});




app.get('/detail/:id', function(요청, 응답) {
  db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과) {
    console.log(결과);
    응답.render('detail.ejs', { data : 결과 });
  });
});



app.get('/edit/:id', function(요청, 응답) {
  db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과) {
  응답.render('edit.ejs', { post : 결과 })
  });

});

app.put('/edit', function(요청, 응답) {
  db.collection('post').updateOne({ _id : parseInt(요청.body.id)},{ $set : { 제목 : 요청.body.title, 날짜 : 요청.body.password}}, function(에러, 결과) {
    console.log('수정완료')
    응답.redirect('/list')
  })
});


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


let multer = require('multer');
var storage = multer.diskStorage({

  destination : function(req, file, cb){
    cb(null, './public/image')
  },
  filename : function(req, file, cb){
    cb(null, file.originalname )
  }

});

var path = require('path');

var upload = multer({storage : storage});

app.get('/upload', function(요청, 응답) {
  응답.render('upload.ejs')
});

app.post('/upload', upload.single('profile'), function(요청, 응답) {
  응답.send('업로드 완료')
});

app.get('/image/:imageName', function(요청, 응답){
  응답.sendFile( __dirname + '/public/image/' + 요청.params.imageName )
})


app.get('/login', function(요청, 응답) {
  응답.render('login.ejs')
});

app.post('/login', passport.authenticate('local', {
  failureRedirect : '/fail'
}), function(요청, 응답) {
  응답.redirect('/')
});



app.post('/input', function(요청, 응답) {

  var age = parseInt(요청.body.age);
  var averageHeartRate = parseInt(요청.body.hr);
  var maximumHeartRate = parseInt(요청.body.max);
  var walkingSpeed = parseInt(요청.body.speed);
    if (isNaN(maximumHeartRate) || isNaN(walkingSpeed)) {
    // 숫자가 아닌 값이 입력되었을 때의 처리 (예: 오류 메시지 전송 또는 리디렉션)
      응답.send('유효하지 않은 값이 입력되었습니다.');
  } else {

  var 데이터 = {
    title : '개인데이터',
    member : 요청.user,
    age : age,
    averageHeartRate : averageHeartRate,
    maximumHeartRate : maximumHeartRate,
    walkingSpeed : walkingSpeed,
    date : new Date()
  }
  db.collection('input').insertOne(데이터).then((결과)=>{
    // 응답.send('입력완료')
    console.log('입력완료')
    응답.redirect('/mypage')
  });
  }
});


app.get('/mypage', 로그인, function(요청, 응답) {
  console.log(요청.user);
  console.log('maximumHeartRate:', parseInt(요청.user.maximumHeartRate));
  console.log('walkingSpeed:', parseInt(요청.user.walkingSpeed));
  db.collection('input').findOne({ member: 요청.user }, function(err, 사용자데이터) {
    if (err) {
      // 에러 처리
      return res.status(500).send('데이터를 가져오는 중 에러가 발생했습니다.');
    }
    if (!사용자데이터) {
      // 사용자 데이터를 찾지 못한 경우
      // 다른 처리를 추가하거나 에러 메시지를 보낼 수 있습니다.
      return res.status(404).send('사용자 데이터를 찾을 수 없습니다.');
    }
  응답.render('geo.ejs', {
      사용자: 요청.user,
      age : parseInt(사용자데이터.age),
      averageHeartRate : parseInt(사용자데이터.hr),
      maximumHeartRate: parseInt(사용자데이터.maximumHeartRate),
      walkingSpeed: parseInt(사용자데이터.walkingSpeed)
  });
});
});

app.get('/input', 로그인, function(요청, 응답) {
  console.log(요청.user);
  응답.render('input.ejs', {
    사용자 : 요청.user,
    maximumHeartRate: parseInt(요청.user.maximumHeartRate),
    walkingSpeed: parseInt(요청.user.walkingSpeed)
  });
});

function 로그인(요청, 응답, next) {
  if (요청.user) { 
    next() 
  } 
  else { 
    응답.send('You have to Log on.') 
  } 
}


passport.use(new LocalStrategy({
  usernameField: 'id',
  passwordField: 'pw',
  session: true,
  passReqToCallback: false,
}, function (입력한아이디, 입력한비번, done) {
  db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
    if (에러) return done(에러)

    if (!결과) return done(null, false, { message: '존재하지않는 아이디입니다.' })
    if (입력한비번 == 결과.pw) {
      return done(null, 결과)
    } else {
      return done(null, false, { message: '비번틀렸어요' })
    }
  })
}));

passport.serializeUser(function (user, done) {
  done(null, user.id)
});

passport.deserializeUser(function (아이디, done) {
  db.collection('login').findOne({id : 아이디}, function(에러, 결과) {
    if (에러) return done(에러);

    if (결과) {
      // 사용자의 정보와 함께 maximumHeartRate 및 walkingSpeed 설정
      결과.maximumHeartRate = parseInt(결과.maximumHeartRate);
      결과.walkingSpeed = parseInt(결과.walkingSpeed); 
    }

    done(null, 결과);
  });
  
}); 


app.post('/register', function(요청,응답){
  db.collection('login').insertOne( {id : 요청.body.id, pw : 요청.body.pw}, function(에러, 결과) {
    응답.redirect('/')
  })
});



app.post('/add', function (요청, 응답) {
    
  응답.send('전송완료');
  db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과) {
    console.log(결과.totalPost)
    var 총게시물갯수 = 결과.totalPost;
    var post = {_id : 총게시물갯수 + 1, 작성자 : 요청.user._id, 제목 : 요청.body.title, 날짜 : 요청.body.password}

    db.collection('post').insertOne(post , function(에러, 결과) {
      console.log('저장완료');
      db.collection('counter').updateOne({name:'게시물갯수'}, { $inc : {totalPost:1} }, function(에러, 결과) {
        if(에러) {
          return console.log(에러)
        }
      })
    });


  });
  
});


app.post('/chatroom', 로그인, function(요청, 응답) {
  var 저장할거 = {
    title : '채팅방',
    member : [ObjectId(요청.body.당한사람id), 요청.user._id],
    date : new Date()
  }
  db.collection('chatroom').insertOne(저장할거).then((결과)=>{
    응답.send('채팅방연결')
  })
})

app.get('/chat', 로그인, function(요청, 응답) {
  db.collection('chatroom').find({ member : 요청.user._id }).toArray().then((결과)=>{
    응답.render('chat.ejs', { data : 결과 });
  });
});

app.post('/message', 로그인, function(요청, 응답) {
  var 저장할채팅 = {
    parent: 요청.body.parent,
    content : 요청.body.content,
    userid : 요청.user._id,
    date : new Date()
  }
  db.collection('message').insertOne(저장할채팅).then(()=>{
    console.log('DB저장성공')
    응답.send('DB저장성공')
  })
});

app.get('/message/:id', 로그인, function(요청, 응답){

  응답.writeHead(200, {
    "Connection": "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  db.collection('message').find({ parent : 요청.params.id }).toArray()
  .then((결과)=>{
    응답.write('event: test\n');
    응답.write('data: ' + JSON.stringify(결과) +'\n\n');
  })

  const 찾을문서 = [
    { $match: { 'fullDocument.parent' : 요청.params.id } }
  ];
  
  const collection = db.collection('message');
  const changeStream = collection.watch(찾을문서);
  changeStream.on('change', (result) => {
      응답.write('event: test\n');
      응답.write('data: ' + JSON.stringify([result.fullDocument]) + '\n\n');
  });

});

app.get('/socket', 로그인, function(요청, 응답) {
  응답.render('socket.ejs', { 사용자: 요청.user })
})

io.on('connection', function(socket) {
  console.log('접속됨')
  

  socket.on('room1-send', function(data) {
    io.to('room1').emit('broadcast',  { sender: socket.id, message: data });
  });


  socket.on('joinroom', function(data) {
    socket.join('room1')
  });

  socket.on('user-send', function(data) {
    io.emit('broadcast', { sender: socket.id, message: data });
  });
});

app.delete('/delete', function(요청, 응답){
  요청.body._id = parseInt(요청.body._id);

  var 삭제할데이터 = { _id : 요청.body._id, 작성자 : 요청.user._id }

  db.collection('post').deleteOne(삭제할데이터, function(에러, 결과) {
    console.log('삭제완료');
    if (에러) {console.log(에러)}
    응답.status(200).send({ message: '성공했습니다' });
  })
});

app.use('/shop', require('./routes/shop.js'));
app.use('/board/sub', require('./routes/board.js'));
// app.get('*', function(요청, 응답) {
//   응답.sendFile(path.join(__dirname, 'react-shop/build/index.html'));
// });

