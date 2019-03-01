const express = require('express')
const app = express()
const serverConfig = require('./config').server
const resp = require('./config').respond


const authRoute = [
    'order',
    'student',
    'book'
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
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With,Token,studentID");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')

    if(req.method=="OPTIONS") res.sendStatus(200);/*让options请求快速返回*/
    else {
        const respond = JSON.parse(JSON.stringify(resp))
        if(isAuthRoute(req.originalUrl) && !Number(req.headers.studentid)){
            res.json(Object.assign(respond, {
                data: -2,
                messages: '不受信任请求，请求头缺少studentID值',
            }))
        }else next();
        
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


app.use('/student',student)
app.use('/auth',auth)
app.use('/doctor',doctor)
app.use('/book',book)
app.use('/home',home)
app.use('/note',note)
app.use('/order',order)
app.use('/upload',upload)
app.use('/comment',comment)



app.get('/',(req,res)=>{
    res.send('Hello Node.js')
})

const server = app.listen(serverConfig.port, _=>{
    console.log(`node server start at ${serverConfig.host}`)
})