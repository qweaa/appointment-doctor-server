const express = require('express')
const router = express.Router()
const conn = require('../model')
const resp = require('../config').respond
const serverConfig = require('../config').server

const server_address = serverConfig.host

//取banner
router.get('/getBannersList', (req,res)=>{
    
    const respond = JSON.parse(JSON.stringify(resp))
    conn.query(`SELECT * from banner where used = 1`, function (error, results, fields) {
        if (!error){
            for(let i of results){
                i.img = server_address + i.img
            }
            if(results.length === 0){
                res.json(Object.assign(respond, {
                    messages: '您还未设置banner图',
                }))
            }else{
                res.json(Object.assign(respond, {
                    success: true,
                    data: results,
                    messages: '取banner 图列表成功',
                }))
            }
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '取banner 图列表失败',
            }))
        }
    });
})

module.exports = router
