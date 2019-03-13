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

//跟新状态
router.post('/updateDoctorStatus',(req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // const data = req.query
    const data = req.query

    if(!data.doctorID){
        res.json(Object.assign(respond, {
            messages: '医师ID不能为空',
        }))
        return
    }
    if(!data.status){
        res.json(Object.assign(respond, {
            messages: '状态值不能为空',
        }))
        return
    }


    const modSql = 'UPDATE doctor SET status = ' + data.status + ' WHERE doctorID = ' + data.doctorID

    //改
    conn.query(modSql,function (err, result) {
        if(!err){
            res.json(Object.assign(respond, {
                success: true,
                data: result,
                messages: '操作成功',
            }))
        }else{
            res.json(Object.assign(respond, {
                data: err,
                messages: '操作失败',
            }))
        }
    });
})

//添加医师
router.post('/addDoctor',(req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    if(req.query.tokenid) delete req.query.tokenid
    
    // const data = req.params
    const data = Object.assign({
        doctorID: '',
        password: '',
        NickName: '',
        realName: '',
        age: '',
        gender: 1,
        recommend: 0,
        province: '',
        city: '',
        country: '',
        info: '',
        status: 1,
    },req.query)

    if(!data.password || !data.NickName || !data.realName || !data.doctorID){
        res.json(Object.assign(respond, {
            data: data,
            messages: '参数不能为空',
        }))
        return
    }

    let key = Object.keys(data)
    let value = []
    let values = []
    for(let i of key){
        value.push('?')
        values.push(data[i])
    }

    conn.query(`SELECT * from doctor where doctorID = '${data.doctorID}' OR NickName = '${data.NickName}'`, function (error, results, fields) {
        if (!error){
            if(results.length === 0){
                const  addSql = 'INSERT INTO doctor( '+key.join(',')+' ) VALUES( '+value.join(',')+' )';
                const  addSqlParams = values;
                //增
                conn.query(addSql,addSqlParams,function (err, result) {
                    if(!err){
                        res.json(Object.assign(respond, {
                            success: true,
                            data: result,
                            messages: '添加成功',
                        }))
                    }else{
                        res.json(Object.assign(respond, {
                            data: err,
                            messages: '添加失败 ',
                        }))
                    }
                });
            }else{
                res.json(Object.assign(respond, {
                    data: results,
                    messages: '工号或昵称已存在',
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


//修改密码
router.post('/changePassword',(req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))
    // const data = req.query
    const data = req.query

    if(!data.doctorID && data.tokenid) data.doctorID = data.tokenid 

    if(!data.doctorID){
        res.json(Object.assign(respond, {
            messages: '医师ID不能为空',
        }))
        return
    }
    if(!data.password){
        res.json(Object.assign(respond, {
            messages: '密码不能为空',
        }))
        return
    }


    // const modSql = 'UPDATE doctor SET password = ' + data.password + ' WHERE doctorID = ' + data.doctorID
    const modSql = 'UPDATE doctor SET password = ? WHERE doctorID = ?'
    const modSqlValue = [data.password, data.doctorID]

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


//更新医师
router.post('/updateDoctor',(req,res)=>{
    const respond = JSON.parse(JSON.stringify(resp))

    if(!req.query.id){
        res.json(Object.assign(respond, {
            data: req.query,
            messages: '请传入id',
        }))
        return
    }

    const id = Number(req.query.id)
    delete req.query.id
    if(req.query.tokenid) delete req.query.tokenid
    
    // const data = req.params
    const data = Object.assign({
        doctorID: '',
        NickName: '',
        realName: '',
        age: '',
        gender: 1,
        recommend: 0,
        province: '',
        city: '',
        country: '',
        info: '',
        status: 1,
    },req.query)

    if(!data.NickName || !data.realName || !data.doctorID){
        res.json(Object.assign(respond, {
            data: data,
            messages: '参数不能为空',
        }))
        return
    }

    let key = Object.keys(data)
    let value = []
    let values = []
    for(let i of key){
        value.push(i + ' = ?')
        values.push(data[i])
    }

    conn.query(`SELECT * from doctor where id = '${id}'`, function (error, results, fields) {
        if (!error){
            if(results.length){
                const  addSql = `UPDATE doctor SET ${value.join(',')} WHERE id = '${id}'`;
                const  addSqlParams = values;
                //增
                conn.query(addSql,addSqlParams,function (err, result) {
                    if(!err){
                        res.json(Object.assign(respond, {
                            success: true,
                            data: result,
                            messages: '修改成功',
                        }))
                    }else{
                        res.json(Object.assign(respond, {
                            data: err,
                            messages: '修改失败 ',
                        }))
                    }
                });
            }else{
                res.json(Object.assign(respond, {
                    data: results,
                    messages: '工号或昵称不存在',
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
