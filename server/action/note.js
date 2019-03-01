const express = require('express')
const router = express.Router()
const conn = require('../model')
const resp = require('../config').respond

//取公告列表
router.get('/getNotesList', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    conn.query(`SELECT * from note where used = 1`, function (error, results, fields) {
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

module.exports = router
