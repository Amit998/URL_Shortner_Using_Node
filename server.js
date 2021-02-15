const express=require('express')
const app=express()
const shortUrl=require('./models/sortUrl')


const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost/urlShortner',{
    useNewUrlParser:true,
    useUnifiedTopology:true,


})

app.set('views engine','ejs')
app.use(express.urlencoded({extended:true}))


app.get('/', async(req,res) =>{
    const shortUrls=await shortUrl.find()
    // console.log(shortUrls[0].full)

    res.render('index.ejs',{
        shortUrls:shortUrls,
    })
})

app.post('/sort',async  (req,res) =>{
     await shortUrl.create({ 
        full:req.body.fullUrl 
    })

    // console.log(req.body.fullUrl)
    res.redirect('/')
})

app.get('/:shortUrl',async (req,res) =>{
   
    shortUrl.findOne({ short:req.params.shortUrl } ,function(err,docs){
        

        if (docs == null ) return res.sendStatus(404)

        count = docs['click'] + 1
   

        var myquery = { short:req.params.shortUrl };
        var newvalues = { $set: {click: count } };

        shortUrl.updateOne(myquery,newvalues,function(err,res){
           
        })
        res.redirect(docs['full'])       

    })
   
    // console.log(shortUrl)

    // console.log(req.params.shortUrl)
    // res.redirect('/')
    // if(shortUrl == null) return res.sendStatus(404)

    // shortUrl.clicks++
    // shortUrl.save()
    // res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);