const express = require('express')
const router = express.Router()
const conn = require('../model')
const resp = require('../config').respond
const serverConfig = require('../config').server

const server_address = serverConfig.host

router.get('/getStudentModule', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // console.log("req.params: ",req.params)
    // console.log("req.query: ",req.query)
    // const studentID = req.query.studentID
    const studentID = req.headers.studentid
    if(studentID){
        conn.query(`SELECT * from student where studentID = ${studentID}`, function (error, results, fields) {
            if (!error){
                for(let i of results){
                    i.avatarUrl = server_address + i.avatarUrl + '?t=' + new Date().getTime();
                }
                res.json(Object.assign(respond, {
                    success: true,
                    data: results,
                    messages: '取学生信息详情成功',
                }))
            }else{
                res.json(Object.assign(respond, {
                    data: error,
                    messages: '取学生信息详情失败',
                }))
            }
        });
    }else{
        res.json(Object.assign(respond, {
            messages: '请求参数不能为空',
        }))
    }
})

//取学生列表
router.get('/getStudentList',(req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    conn.query(`SELECT * from student`, function (error, results, fields) {
        if (!error){
            for(let i of results){
                i.avatarUrl = server_address + i.avatarUrl
            }
            res.json(Object.assign(respond, {
                success: true,
                data: results,
                messages: '取学生列表成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '取学生列表失败',
            }))
        }
    });
})

router.post('/updateStudentModule',(req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // const data = req.query
    const data = req.query

    if(!data.studentID){
        res.json(Object.assign(respond, {
            messages: '学生ID不能为空',
        }))
        return
    }

    //学生表所包含的键
    const studentTableKeys = ['studentID','password','realName','NickName','age','gender','avatarUrl','province','city','country','info', 'birthady', 'idcard']

    //存储传过来错误的变量名
    const errorKeys = []
    //["name = ?", "id = ?] => name = ?,id = ?
    const sql = []
    const sqlValue = []
    
    //遍历传入的请求对象
    for(let i in data){
        if(studentTableKeys.indexOf(i) > -1){
            if(i !== 'studentID'){
                sql.push(i + ' = ?')
                sqlValue.push(data[i])
            }
        }else{
            errorKeys.push(i)
        }
    }

    //如果表单只有studentID，返回错误：请提供需要修改的键值对
    if(sqlValue.length === 0){
        res.json(Object.assign(respond, {
            messages: '请提供需要修改的键值对',
        }))
        return
    }

    //如果提交的表单含有错误变量，返回错误提示
    if(errorKeys.length > 0){
        res.json(Object.assign(respond, {
            data: errorKeys,
            messages: '提交的参数中含有错误的变量名，请检查拼写是否正确',
        }))
        return
    }

    const modSql = 'UPDATE student SET ' + sql.join(',') + ' WHERE studentID = ' + data.studentID

    //改
    conn.query(modSql,sqlValue,function (err, result) {
        if(!err){
            res.json(Object.assign(respond, {
                success: true,
                data: result,
                messages: '更新学生信息成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: err,
                messages: '更新学生信息失败',
            }))
        }
    });
})

module.exports = router