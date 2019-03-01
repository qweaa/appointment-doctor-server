const express = require('express')
const router = express.Router()
const resp = require('../config').respond
const fs = require('fs')

// const multer = require('multer')
const path = require('path')
const formidable = require('formidable')


router.post('/image', function (req, res, next) {
    const respond = JSON.parse(JSON.stringify(resp))
    var form = new formidable.IncomingForm()
    form.uploadDir = path.normalize(__dirname + '/../upload/images/student') //------图片上传目录
    form.parse(req, function (err, fields, files) {
        var oldpath = files.file.path
        var newpath = path.normalize(__dirname + '/../upload/images/student') + '\\' + req.headers.studentid + '.png'    //-------//给上传的图片重命名
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                res.json(Object.assign(respond, {
                    data: err,
                    messages: '上传图片失败',
                }))
                return
            }
            if (newpath) {
                let avatarPath = '/upload/images/student/' + req.headers.studentid + '.png'  //------//存入数据库的图片地址(相对于页面)

                res.json(Object.assign(respond, {
                    success: true,
                    data: avatarPath,
                    messages: '上传图片成功',
                }))

                // global['setCopyFun' + req.headers.studentid] = ({onsuccess, onfail})=>{
                //     fs.readFile(__dirname+"/uploadTemp/images/student/"+req.headers.studentid+".png",function(err,originBuffer){  //读取图片位置（路径）
                //         fs.writeFile(__dirname+"/upload/images/student/"+req.headers.studentid+".png",originBuffer,function(err){  //生成图片2(把buffer写入到图片文件)
                //             if (!err) {
                //                 if(typeof onsuccess == 'function') onsuccess({
                //                     messages: '拷贝图片成功',
                //                     data: '',
                //                     success: true
                //                 })
                //             }else{
                //                 if(typeof onfail == 'function') onfail({
                //                     messages: '拷贝图片失败',
                //                     data: err,
                //                     success: false
                //                 })
                //             }
                //         });
                //     })
                // }
            }
        })
    })
})



module.exports = router
