const express=require('express');
const app=express();
const path=require('path');
app.use(express.static(path.join(__dirname,'public')));
app.get('/register',(req,res)=>res.send('r'));
app.get('/foo',(req,res)=>res.send('p'));
app.listen(3001);
