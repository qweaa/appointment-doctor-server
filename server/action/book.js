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

//通过week取预约时间列表
router.get('/getBookListByWeek', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // console.log("req.params: ",req.params)
    // console.log("req.query: ",req.query)
    let data = req.query
    // if(data.tokenid) data.doctorID = data.tokenid

    if(!data.doctorID){
        res.json(Object.assign(respond, {
            messages: '请传入doctorID变量值'
        }))
        return
    }
    if(!data.week){
        res.json(Object.assign(respond, {
            messages: '请传入date变量值'
        }))
        return
    }
    
    //data.doctorID date

    conn.query(`SELECT * from booked where doctor_id = ${data.doctorID} AND week = ${data.week}`, function (error, results, fields) {
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

//取医师所有的预约时间列表
router.get('/getDoctorBookAllList', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // console.log("req.params: ",req.params)
    // console.log("req.query: ",req.query)
    let data = req.query
    if(data.tokenid) data.doctorID = data.tokenid

    if(!data.doctorID){
        res.json(Object.assign(respond, {
            messages: '请传入doctorID变量值'
        }))
        return
    }

    conn.query(`SELECT * from booked where doctor_id = ${data.doctorID}`, function (error, results, fields) {
        if (!error){
            conn.query(`SELECT * from time`, function (error, qtime, fields) {
                if (!error){


                    let time = [
                        {value: 1, label: '周一', list: []},
                        {value: 2, label: '周二', list: []},
                        {value: 3, label: '周三', list: []},
                        {value: 4, label: '周四', list: []},
                        {value: 5, label: '周五', list: []},
                        {value: 6, label: '周六', list: []},
                        {value: 0, label: '周日', list: []},
                    ]
                    let r = [
                        {value: 1, label: '周一', list: []},
                        {value: 2, label: '周二', list: []},
                        {value: 3, label: '周三', list: []},
                        {value: 4, label: '周四', list: []},
                        {value: 5, label: '周五', list: []},
                        {value: 6, label: '周六', list: []},
                        {value: 0, label: '周日', list: []},
                    ]

                    
                    for(let i of results){
                        if(i.week - 1 > -1){
                            r[i.week - 1].list.push(i)
                        }else{
                            r[6].push(i)
                        }
                    }


                    for(let i=0; i<r.length; i++){
                        for(let j=0; j<qtime.length; j++){
                            if(r[i].list.length){
                                for(let k=0; k<r[i].list.length; k++){
                                    if(qtime[j].id === r[i].list[k].time_id){
                                        time[i].list.push(r[i].list[k])
                                        break;
                                    }else if(k === r[i].list.length - 1){
                                        time[i].list.push({
                                            isRecess: true,
                                            label: '休息'
                                        })
                                    }
                                }
                            }else{
                                time[i].list.push({
                                    isRecess: true,
                                    label: '休息'
                                })
                            }
                        }
                    }
                    res.json(Object.assign(respond, {
                        success: true,
                        data: time,
                        messages: '取预约时间列表成功',
                    }))
                }else{
                    res.json(Object.assign(respond, {
                        data: error,
                        messages: '取所有时间列表失败',
                    }))
                }
            });
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '取预约时间列表失败',
            }))
        }
    });

})

//添加可预约时间
router.post('/addBookTime', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // console.log("req.params: ",req.params)
    // console.log("req.query: ",req.query)
    let data = req.query
    if(data.tokenid) data.doctorID = data.tokenid
    console.log(data)

    if(!data.doctorID){
        res.json(Object.assign(respond, {
            messages: '请传入doctorID变量值'
        }))
        return
    }
    if(!data.can_book){
        res.json(Object.assign(respond, {
            messages: '请传入可预约人数'
        }))
        return
    }
    if(!data.time_id){
        res.json(Object.assign(respond, {
            messages: '请传入时间段id值'
        }))
        return
    }
    if(!data.price){
        res.json(Object.assign(respond, {
            messages: '请传入挂号费'
        }))
        return
    }
    if(!data.week){
        res.json(Object.assign(respond, {
            messages: '请传入week'
        }))
        return
    }
    
    //data.doctorID date

    conn.query(`SELECT * from book where doctor_id = ${data.doctorID} AND week = ${data.week} AND time_id = ${data.time_id}`, function (error, results, fields) {
        if (!error){
            if(results.length){
                res.json(Object.assign(respond, {
                    messages: '该时间段已存在数据',
                }))
            }else{
                let assSql = 'INSERT INTO book(doctor_id,time_id,can_book,price,week) VALUES(?,?,?,?,?)'
                let addSqlParams = [data.doctorID, data.time_id, data.can_book, data.price, data.week]
                conn.query(assSql, addSqlParams, function (error, results, fields) {
                    if (!error){
                        res.json(Object.assign(respond, {
                            success: true,
                            data: results,
                            messages: '添加成功',
                        }))
                    }else{
                        res.json(Object.assign(respond, {
                            data: error,
                            messages: '添加失败',
                        }))
                    }
                })
            }
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '取预约时间列表失败',
            }))
        }
    });

})


//根据book表id更新可预约时间
router.post('/updateBookTimeById', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // console.log("req.params: ",req.params)
    // console.log("req.query: ",req.query)
    let data = req.query
    if(data.tokenid) data.doctorID = data.tokenid
    console.log(data)

    if(!data.id){
        res.json(Object.assign(respond, {
            messages: '请传入 id 变量值'
        }))
        return
    }
    if(!data.can_book){
        res.json(Object.assign(respond, {
            messages: '请传入可预约人数'
        }))
        return
    }
    if(!data.price){
        res.json(Object.assign(respond, {
            messages: '请传入挂号费'
        }))
        return
    }
    
    //data.doctorID date

    conn.query(`SELECT * from book where id = ${data.id}`, function (error, results, fields) {
        if (!error){
            if(results.length){
                let assSql = 'UPDATE book SET can_book = ?,price = ? WHERE id = ?'
                let addSqlParams = [data.can_book, data.price, data.id]
                conn.query(assSql, addSqlParams, function (error, results, fields) {
                    if (!error){
                        res.json(Object.assign(respond, {
                            success: true,
                            data: results,
                            messages: '修改成功',
                        }))
                    }else{
                        res.json(Object.assign(respond, {
                            data: error,
                            messages: '修改失败',
                        }))
                    }
                })
            }else{
                res.json(Object.assign(respond, {
                    messages: '该时间段不存在',
                }))
            }
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '取预约时间列表失败',
            }))
        }
    });

})


//根据book表id删除可预约时间
router.post('/deleteBookTimeById', (req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // console.log("req.params: ",req.params)
    // console.log("req.query: ",req.query)
    let data = req.query
    if(data.tokenid) data.doctorID = data.tokenid
    console.log(data)

    if(!data.id){
        res.json(Object.assign(respond, {
            messages: '请传入 id 变量值'
        }))
        return
    }
    
    let assSql = 'DELETE FROM book where id = ?'
    let addSqlParams = [data.id]
    conn.query(assSql, addSqlParams, function (error, results, fields) {
        if (!error){
            res.json(Object.assign(respond, {
                success: true,
                data: results,
                messages: '操作成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: error,
                messages: '操作失败',
            }))
        }
    })

})

// conn.end();

module.exports = router
