const express = require('express')
const router = express.Router()
const conn = require('../model')
const resp = require('../config').respond

//取公告列表
router.get('/getNotesList', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    
    let sql = `SELECT * from note where used = 1`

    if(req.query.used !== undefined && req.query.used !== null){
        if(Number(req.query.used) === -1){
            sql = `SELECT * from note`
        }else{
            sql = `SELECT * from note where used = ${req.query.used}`
        }
    }


    conn.query(sql, function (error, results, fields) {
        if (!error){
            res.json(Object.assign(respond, {
                success: true,
                data: results,
                messages: '取公告列表成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '取公告列表失败',
            }))
        }
    });
})

//添加公告
router.post('/addNote', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    const data = req.query
    let now = new Date().toLocaleString('chinese', {hour12: false})
    let sqlValue = [data.title, data.NoticeContent, now, data.used]
    conn.query(`INSERT INTO note(title,NoticeContent,F_CreatorTime, used) VALUES(?,?,?,?)`, sqlValue, function (error, results, fields) {
        if (!error){
            res.json(Object.assign(respond, {
                success: true,
                data: results,
                messages: '添加公告成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '添加公告失败',
            }))
        }
    });
})

//更新公告状态
router.post('/updateNoteStatus', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    const data = req.query

    if(!data.id){
        res.json(Object.assign(respond, {
            messages: 'id值不能为空',
        }))
        return
    }
    if(!data.used){
        res.json(Object.assign(respond, {
            messages: 'used值不能为空',
        }))
        return
    }
    
    const modSql = 'UPDATE note SET used = ' + data.used + ' WHERE id = ' + data.id

    conn.query(modSql, function (error, results, fields) {
        if (!error){
            res.json(Object.assign(respond, {
                success: true,
                data: results,
                messages: '更新公告状态成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '更新公告状态失败',
            }))
        }
    });
})


//更新公告内容
router.post('/updateNote', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    const data = req.query

    if(!data.id){
        res.json(Object.assign(respond, {
            messages: 'id值不能为空',
        }))
        return
    }
    if(!data.title){
        res.json(Object.assign(respond, {
            messages: '公告标题不能为空',
        }))
        return
    }
    if(!data.NoticeContent){
        res.json(Object.assign(respond, {
            messages: '公告内容不能为空',
        }))
        return
    }
    if(!data.used){
        res.json(Object.assign(respond, {
            messages: 'used值不能为空',
        }))
        return
    }
    
    const modSql = `UPDATE note SET title = ?, NoticeContent = ?, used = ? WHERE id = ?`
    const modSqlValue = [data.title, data.NoticeContent, data.used, data.id]

    conn.query(modSql, modSqlValue, function (error, results, fields) {
        if (!error){
            res.json(Object.assign(respond, {
                success: true,
                data: results,
                messages: '修改公告成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '修改公告失败',
            }))
        }
    });
})

module.exports = router
