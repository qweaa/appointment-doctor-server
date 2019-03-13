const express = require('express')
const app = express()
const serverConfig = require('./config').server
const resp = require('./config').respond

const qs = require('querystring');


const authRoute = [
    'order',
    'student',
    'book',
]

function isAuthRoute(url){
    let res = false
    for(let i of authRoute){
        if(url.indexOf('/' + i + '/') === 0){
            res = true
            break
        }
    }
    return res
}

app.all('*', function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With,Token,studentID,tokenid");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')

    if(req.method=="OPTIONS") res.sendStatus(200);/*让options请求快速返回*/
    else {
        const respond = JSON.parse(JSON.stringify(resp))
        if(isAuthRoute(req.originalUrl) && !Number(req.headers.studentid) && !Number(req.headers.tokenid)){
            res.json(Object.assign(respond, {
                data: -2,
                messages: '不受信任请求',
            }))
        }else {
            if (req.method.toUpperCase() == 'POST') {
                var postData = "";
                req.addListener("data", function (data) {
                    postData += data;
                });
                req.addListener("end", function () {
                    var query = qs.parse(postData);
                    if(!Object.keys(req.query).length){
                        req.query = Object.assign(query, req.query)
                    }
                    if(req.headers.tokenid) req.query.tokenid = req.headers.tokenid
                    else if(req.headers.studentid) req.query.tokenid = req.headers.studentid
                    next();
                });
            }else{
                if(req.headers.tokenid) req.query.tokenid = req.headers.tokenid
                else if(req.headers.studentid) req.query.tokenid = req.headers.studentid
                next();
            }
        }
        
    }

})
//图片加载,存储在public/images下的所有图片
app.get('/upload/images/*', function (req, res) {
    res.sendFile( __dirname + "/" + req.url.split('?')[0] );
})

//actions
const student = require('./action/student')
const auth = require('./action/auth')
const doctor = require('./action/doctor')
const book = require('./action/book')
const home = require('./action/home')
const note = require('./action/note')
const order = require('./action/order')
const upload = require('./action/upload')
const comment = require('./action/comment')
const time = require('./action/time')
const admin = require('./action/admin')


app.use('/student',student)
app.use('/auth',auth)
app.use('/doctor',doctor)
app.use('/book',book)
app.use('/home',home)
app.use('/note',note)
app.use('/order',order)
app.use('/upload',upload)
app.use('/comment',comment)
app.use('/time',time)
app.use('/admin',admin)



app.get('/',(req,res)=>{
    res.send('Hello Node.js')
})

const server = app.listen(serverConfig.port, _=>{
    console.log(`node server start at ${serverConfig.host}`)
})