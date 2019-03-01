const express = require('express')
const router = express.Router()
const conn = require('../model')
const resp = require('../config').respond

//取预约时间列表
router.get('/getBookList', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // console.log("req.params: ",req.params)
    // console.log("req.query: ",req.query)
    let data = req.query

    if(!data.doctorID){
        res.json(Object.assign(respond, {
            messages: '请传入doctorID变量值'
        }))
        return
    }
    if(!data.date){
        res.json(Object.assign(respond, {
            messages: '请传入date变量值'
        }))
        return
    }
    let date,
        list = []

    if(Number(data.date)) date = data.date              //传入的是getTime()
    else date = new Date(data.date + ' 00:00:00').getTime()     //传入的是yyyy-MM-dd

    //new Date('asdf 00:00:00') => NaN
    if(!date){
        res.json(Object.assign(respond, {
            messages: '请传入date变量值应该为时间格式：yyyy-MM-dd或getTime()等'
        }))
        return
    }
    
    //data.doctorID date

    conn.query(`SELECT * from booked where doctor_id = ${data.doctorID} AND date = ${date}`, function (error, results, fields) {
        if (!error){
            res.json(Object.assign(respond, {
                success: true,
                data: results,
                messages: '取预约时间列表成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '取预约时间列表失败',
            }))
        }
    });

})

module.exports = router
