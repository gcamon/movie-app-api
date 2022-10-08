const router = require('express').Router()
const Movie = require('../models/Movie')
const verifyToken = require('../verifyTokens')

//CREATE
router.post("/", verifyToken, async (req,res) => {
  if(req.user.isAdmin){
    const newMovie = new Movie(req.body)
    try {
       const saveMovie = await newMovie.save();
       res.status(200).json(saveMovie);
    } catch(err) {
        res.status(500).json(err)
    }
  } else {
      res.status(403).json("Permission denied!")
  }
});

//UPDATE
router.put("/:id", verifyToken, async (req,res) => {
    if(req.user?.isAdmin){
      try {
         const updateMovie = await Movie.findByIdAndUpdate(req.params.id,{
             $set: req.body,
         },{
             new: true,
         });
         res.status(200).json(updateMovie);
      } catch(err) {
          res.status(500).json(err)
      }
    } else {
        res.status(403).json("Permission denied!")
    }
})
  
//DELETE
router.delete("/:id", verifyToken, async (req,res) => {
    if(req.user?.isAdmin){
      try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json("Movie has been deleted!")
      } catch(err) {
          res.status(500).json(err)
      }
    } else {
        res.status(403).json("Permission denied!")
    }
})

//GET
router.get("/find/:id", async (req,res) => { 
    try {
        const movie = await Movie.findById(req.params.id)     
        res.status(200).json(movie);
    } catch(err) {
        res.status(500).json(err)
    }
})

//GET RANDOM
router.get("/random", async (req,res) => {   
    const type = req.query?.type;
    try {
        const movie = (type === "series") ? 
        await Movie.aggregate([
            { $match: { isSeries: true } },
            {$sample: { size: 1 } }
        ]) : 
        await Movie.aggregate([
            { $match: { isSeries: false } },
            { $sample: { size: 1} }
        ]);
        res.status(200).json(movie)
    } catch(err) {
        res.status(500).json(err)
    }
})

//GET ALL
router.get("/", verifyToken, async (req,res) => {
    if(req.user?.isAdmin){
      try {
            const movies = await Movie.find();
            res.status(200).json(movies.reverse())
      } catch(err) {
          res.status(500).json(err)
      }
    } else {
        res.status(403).json("Permission denied!")
    }
})

module.exports = router;