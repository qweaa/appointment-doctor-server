const express = require('express')
const router = express.Router()
const conn = require('../model')
const resp = require('../config').respond
const serverConfig = require('../config').server

//取所有时间列表
router.get('/getTimeList', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    conn.query(`SELECT * from time`, function (error, results, fields) {
        if (!error){
            res.json(Object.assign(respond, {
                success: true,
                data: results,
                messages: '取所有时间列表成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '取所有时间列表失败',
            }))
        }
    });
})

module.exports = router