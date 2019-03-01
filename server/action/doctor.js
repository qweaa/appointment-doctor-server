const express = require('express')
const router = express.Router()
const conn = require('../model')
const resp = require('../config').respond
const serverConfig = require('../config').server

const server_address = serverConfig.host

//取医师详细信息
router.get('/getDoctorModule', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // console.log("req.params: ",req.params)
    // console.log("req.query: ",req.query)
    const doctorID = req.query.doctorID
    if(doctorID){
        conn.query(`SELECT * from doctor where doctorID = ${doctorID}`, function (error, results, fields) {
            if (!error){
                for(let i of results){
                    i.avatarUrl = server_address + i.avatarUrl
                }
                res.json(Object.assign(respond, {
                    success: true,
                    data: results,
                    messages: '取医师详细信息成功',
                }))
            }else{
                res.json(Object.assign(respond, {
                    data: error,
                    messages: '取医师详细信息失败',
                }))
            }
        });
    }else{
        res.json(Object.assign(respond, {
            messages: '请求参数不能为空',
        }))
    }
})

//取推荐医师列表
router.get('/getRecommentsList', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    conn.query(`SELECT * from doctor where recommend = 1`, function (error, results, fields) {
        if (!error){
            for(let i of results){
                i.avatarUrl = server_address + i.avatarUrl
            }
            res.json(Object.assign(respond, {
                success: true,
                data: results,
                messages: '取推荐医师列表成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '取推荐医师列表失败',
            }))
        }
    });
})

//取所有医师列表
router.get('/getDoctorList', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    conn.query(`SELECT * from doctor`, function (error, results, fields) {
        if (!error){
            for(let i of results){
                i.avatarUrl = server_address + i.avatarUrl
            }
            res.json(Object.assign(respond, {
                success: true,
                data: results,
                messages: '取医师列表成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '取医师列表失败',
            }))
        }
    });
})

//搜索医师
router.get('/getSearch', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))

    let key = req.query.key

    if(!key){
        res.json(Object.assign(respond, {
            messages: '请传入key值',
        }))
        return
    }else key = '%' + key + '%'



    conn.query(`SELECT * from doctor where doctorID like ? or NickName like ?  or realName like ?`, [key, key, key], function (error, results, fields) {
        if (!error){
            for(let i of results){
                i.avatarUrl = server_address + i.avatarUrl
            }
            res.json(Object.assign(respond, {
                success: true,
                data: results,
                messages: '搜索医师成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '搜索医师失败',
            }))
        }
    });
})

module.exports = router
