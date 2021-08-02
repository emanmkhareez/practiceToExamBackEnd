'use strict'
const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const axios=require('axios')

require('dotenv').config()
const server=express()
server.use(cors());
server.use(express.json())
const PORT=process.env.PORT


mongoose.connect('mongodb://localhost:27017/testExam', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.connect(`${process.env.DB_ATLS}`, {
//     useNewUrlParser: true, useUnifiedTopology: true});

const MovieSchema= new mongoose.Schema({
    image_url:String,
    title:String
    
})
const ownerSchema= new mongoose.Schema({
    email:String,
    movie:[MovieSchema]
})
const Moviemodel=mongoose.model('Movie',MovieSchema)
const ownerModel=mongoose.model('owner',ownerSchema)



server.listen(PORT,()=>{
    console.log('listen to ',PORT)
})

function seedData (){
    const eman= new ownerModel({
        email:'emkhareez19@gmail.com',
        movie:[
            {
                image_url:"https://image.tmdb.org/t/p/w500/pNrQaH0ATrz9wFrNpwfB1aU4MpK.jpg",

                title:"giral"
                 
            }
           
        ]

    })

    // const Razan=new ownerModel({
    //     email:'razan@.com',
    //     Gam:[{
    //         name:"Fulla gam",
    //         typeGam:"giral"

    //     }]
    // })

    // Razan.save()
    eman.save()
  


}
// seedData()

//  http://localhost:3001/game?email=emkhareez19@gmail.com
server.get('/game',GAMEDATA)

// https://api.themoviedb.org/3/search/movie?api_key=bec06652a4cb9591d54fceb6bc996e54&query=Action

// http://localhost:3001/movies?api_key=bec06652a4cb9591d54fceb6bc996e54&=Action
server.get('/movies',getDataFromMovies)

//http://localhost:3001/addMovies?api_key=bec06652a4cb9591d54fceb6bc996e54&query=Action
server.post('/addMovies',AddHandeler)
http://localhost:3001/getData/:email
server.get('/GetFavData',GetHandeler)
server.delete('/delData/:id',deleteHandeling)

//http:localhost3001/UpdateFun/1
server.put('/UpdateFun/:index',HandelingUpdate)



function GAMEDATA(req,res){
    const userEmail=req.query.email
    ownerModel.find({email:userEmail},function(error,storData){
        if(error)
        res.send(error,'not work')
        else{
            res.send(storData.map(item=>{
                return item.Gam
            }))
                
                // .map(item2=>{
                //     return item2
                
               
            // }))

        }
    })


}
let movieResult=[]
 function  getDataFromMovies(req,res){

     const searchQury=req.query.query
    let liveURl=`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_MOVIES}&query=${searchQury}`
    axios
    .get(liveURl)
    .then(MovieArray=>{
        movieResult=MovieArray.data.results.map(item=>{
          return new Movie(item)
            //    item.genre_ids.map(item2=>{
                 
            //     return res.send(item2)
            //    })
              
           
        })
        res.send(movieResult)
       

    })
 }

function AddHandeler(req,res){
//  let{image_url,title}=req.body
console.log('fffffffffff',req.query)
 console.log('ddddd',req.body)
 let userEmail=req.query.email
 let {image_url,title}=req.body
 
 ownerModel.find({email:userEmail},(error,result)=>{
     if(error){
         res.send(error)
     }
     else{
         result[0].movie.push({
            image_url:image_url,
             title:title


             
         })
        
        //  console.log('nbvcxz',movie);
        
         result[0].save()
         res.send(result[0].movie)
         console.log('resulttttttttttttttt',result[0].movie)
     }
     
 })
}


 function GetHandeler(req,res){
    let  email=req.query.email
     console.log('hgfdsdfghjkjhgfd',email)
     ownerModel.find({email:email},(error,result)=>{
         if(error){
             res.send(error)
         }
         else{
             res.send(result[0].movie)
         }
     })

 }

function deleteHandeling(req,res){
    console.log('gggggg',req.params)
    console.log('bbbbbbbbbbb',req.query)
    let id=Number(req.params.id)
    let email=req.query.email
    console.log('idddd',id);
    ownerModel.find({email:email},(error,data)=>{
        if(error){
            res.send(error)
        }
      else{
        let dataAfterDel=data[0].movie.filter((item,index)=>{
            return index!==id
        })
        data[0].movie=dataAfterDel
        console.log('data after del',data[0].movie)
        data[0].save()
        res.send(data[0].movie)
    }
    })

}
function HandelingUpdate(req,res){
    console.log('params',req.params)
    console.log('body',req.body)
    let index=Number(req.params.index)
    let {email, image_url,title}=req.body
    ownerModel.find({email:email},(error,updateData)=>{
        if(error){
            res.send('not found')
        }
        else{
            //one way
            // updateData[0].movie[index].image_url=image_url
            // updateData[0].movie[index].title=title

           // anotherWay
           updateData[0].movie.splice(index,1,{
            image_url:image_url,
            title:title
           })
        }
        console.log(updateData[0])
        updateData[0].save()
        res.send(updateData[0].movie)


    })
}




 class Movie {
    constructor(item) {
        this.title = item.title;
        this.image_url = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        
    }
}
 