const express = require('express')
const router = express.Router()
const conn = require('../model')
const resp = require('../config').respond
const serverConfig = require('../config').server

const server_address = serverConfig.host

//取管理员详细信息
router.get('/getAdminModule', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // console.log("req.params: ",req.params)
    // console.log("req.query: ",req.query)
    const id = req.query.id
    if(id){
        conn.query(`SELECT * from admin where ID = ${id}`, function (error, results, fields) {
            if (!error){
                for(let i of results){
                    i.avatarUrl = server_address + i.avatarUrl
                }
                res.json(Object.assign(respond, {
                    success: true,
                    data: results,
                    messages: '取管理员详细信息成功',
                }))
            }else{
                res.json(Object.assign(respond, {
                    data: error,
                    messages: '取管理员详细信息失败',
                }))
            }
        });
    }else{
        res.json(Object.assign(respond, {
            messages: '请求参数不能为空',
        }))
    }
})
//取管理员列表
router.get('/getAdminList', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // console.log("req.params: ",req.params)
    // console.log("req.query: ",req.query)
    conn.query(`SELECT * from admin`, function (error, results, fields) {
        if (!error){
            for(let i of results){
                i.avatarUrl = server_address + i.avatarUrl
            }
            res.json(Object.assign(respond, {
                success: true,
                data: results,
                messages: '取管理员列表成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '取管理员列表失败',
            }))
        }
    });
})

//添加管理员
router.post('/addAdmin',(req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // const data = req.query
    const data = req.query

    if(!data.Name){
        res.json(Object.assign(respond, {
            messages: '管理员姓名不能为空',
        }))
        return
    }
    if(!data.NickName){
        res.json(Object.assign(respond, {
            messages: '昵称不能为空',
        }))
        return
    }


    const modSql = 'INSERT INTO admin( Name, NickName ) VALUES( ?, ? )'
    const modSqlValue = [data.Name, data.NickName]

    conn.query(`SELECT * from admin where NickName = '${data.NickName}'`, function (error, results, fields) {
        if (!error){
            if(results.length === 0){
                //改
                conn.query(modSql, modSqlValue, function (err, result) {
                    if(!err){
                        res.json(Object.assign(respond, {
                            success: true,
                            data: result,
                            messages: '添加成功',
                        }))
                    }else{
                        res.json(Object.assign(respond, {
                            data: err,
                            messages: '添加失败',
                        }))
                    }
                });
            }else{
                res.json(Object.assign(respond, {
                    data: results,
                    messages: '昵称已存在',
                }))
            }
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '取管理员信息详情失败',
            }))
        }
    });
})

//修改密码
router.post('/changePassword',(req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // const data = req.query
    const data = req.query

    if(!data.ID && data.tokenid) data.ID = data.tokenid 

    if(!data.ID){
        res.json(Object.assign(respond, {
            messages: '管理员ID不能为空',
        }))
        return
    }
    if(!data.password){
        res.json(Object.assign(respond, {
            messages: '密码不能为空',
        }))
        return
    }


    // const modSql = 'UPDATE admin SET Password = ' + data.password + ' WHERE ID = ' + data.ID
    const modSql = `UPDATE admin SET Password = ? WHERE ID = ?`
    const modSqlValue = [data.password, data.ID]

    //改
    conn.query(modSql, modSqlValue, function (err, result) {
        if(!err){
            res.json(Object.assign(respond, {
                success: true,
                data: result,
                messages: '修改成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: err,
                messages: '修改失败',
            }))
        }
    });
})


//修改管理员信息
router.post('/updateAdmin',(req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // const data = req.query
    const data = req.query

    if(!data.ID && data.tokenid) data.ID = data.tokenid 

    if(!data.ID){
        res.json(Object.assign(respond, {
            messages: '管理员ID不能为空',
        }))
        return
    }
    if(!data.Name){
        res.json(Object.assign(respond, {
            messages: '姓名不能为空',
        }))
        return
    }
    if(!data.NickName){
        res.json(Object.assign(respond, {
            messages: '昵称不能为空',
        }))
        return
    }


    const modSql = 'UPDATE admin SET Name = ?, NickName = ? WHERE ID = ?'
    const modSqlValue = [data.Name, data.NickName, data.ID]

    //改
    conn.query(modSql,modSqlValue,function (err, result) {
        if(!err){
            res.json(Object.assign(respond, {
                success: true,
                data: result,
                messages: '修改成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: err,
                messages: '修改失败',
            }))
        }
    });
})

module.exports = router