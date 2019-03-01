const express = require('express')
const router = express.Router()
const conn = require('../model')
const resp = require('../config').respond

//登陆
router.post('/login', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    const data = req.query

    if(data.studentID){
        conn.query(`SELECT * from student where studentID = ${data.studentID}`, function (error, results, fields) {
            if (!error){
                if(results.length === 0){
                    res.json(Object.assign(respond, {
                        messages: '账户不存在',
                    }))
                }else{
                    if(data.password === results[0].password){
                        res.json(Object.assign(respond, {
                            success: true,
                            messages: '学生登陆成功',
                        }))
                    }else{
                        res.json(Object.assign(respond, {
                            messages: '密码错误',
                        }))
                    }
                }
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

//注册
router.post('/register',(req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // const data = req.params
    const data = req.query

    if(!data.studentID || !data.password || !data.NickName){
        res.json(Object.assign(respond, {
            messages: '参数不能为空',
        }))
        return
    }

    conn.query(`SELECT * from student where studentID = ${data.studentID}`, function (error, results, fields) {
        if (!error){
            if(results.length === 0){
                const  addSql = 'INSERT INTO student(studentID,password,NickName) VALUES(?,?,?)';
                const  addSqlParams = [data.studentID, data.password,data.NickName];
                //增
                conn.query(addSql,addSqlParams,function (err, result) {
                    if(!err){
                        res.json(Object.assign(respond, {
                            success: true,
                            data: result,
                            messages: '插入成功',
                        }))
                    }else{
                        res.json(Object.assign(respond, {
                            data: err,
                            messages: '插入失败 ',
                        }))
                    }
                });
            }else{
                res.json(Object.assign(respond, {
                    data: results,
                    messages: data.studentID + '已存在',
                }))
            }
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '取学生信息详情失败',
            }))
        }
    });

})

module.exports = router
