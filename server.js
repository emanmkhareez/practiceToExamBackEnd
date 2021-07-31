'use strict'
const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const axios=require('axios')

require('dotenv').config()
const server=express()
server.use(cors());
const PORT=process.env.PORT
mongoose.connect('mongodb://localhost:27017/testExam', {useNewUrlParser: true, useUnifiedTopology: true});

const GamSchema= new mongoose.Schema({
    name:String,
    typeGam:String
})
const ownerSchema= new mongoose.Schema({
    email:String,
    Gam:[GamSchema]
})
const GamModel=mongoose.model('game',GamSchema)
const ownerModel=mongoose.model('owner',ownerSchema)



server.listen(PORT,()=>{
    console.log('listen to ',PORT)
})

function seedData (){
    const eman= new ownerModel({
        email:'emkhareez19@gmail.com',
        Gam:[
            {
                name:"barbie",
                typeGam:"giral"
                 
            },
            {
                name:'strawberry',
                typeGam:"giral"
            }
        ]

    })

    const Razan=new ownerModel({
        email:'razan@.com',
        Gam:[{
            name:"Fulla gam",
            typeGam:"giral"

        }]
    })

    Razan.save()
    eman.save()
  


}
// seedData()

//  http://localhost:3001/game?email=emkhareez19@gmail.com
server.get('/game',GAMEDATA)

// https://api.themoviedb.org/3/search/movie?api_key=bec06652a4cb9591d54fceb6bc996e54&type=Action
server.get('/movies',getDataFromMovies)
// http://localhost:3001/movies?api_key=bec06652a4cb9591d54fceb6bc996e54&=Action
//http://localhost:3001/addMovies?api_key=bec06652a4cb9591d54fceb6bc996e54&=Action
server.post('/addMovies/:email',AddHandeler)

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
console.log('dfbbbbbb',req.body);
    // let userEmail=req.params.email
    // let {}
    
}
 class Movie {
    constructor(item) {
        this.title = item.title;
        this.overview = item.overview;
        this.average_votes = item.vote_average;

        this.total_votes = item.vote_count;
        this.image_url = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        this.popularity = item.popularity;
        this.released_on = item.release_date;
        // movieResult.push(this)
    }
}
 