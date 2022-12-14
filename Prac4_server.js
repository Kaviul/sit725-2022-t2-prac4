const express = require("express")
const app = express()
const cors = require("cors")

let projectCollection;

app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const MongoClient = require('mongoDb').MongoClient; 

const uri = "mongodb+srv://kaviuln1:kaviuln@kncluster-1.ieurp6n.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri, {useNewUrlParser: true});

const createCollection = (collectionName) => {
    client.connect((err,db) => {
        projectCollection = client.db().collection(collectionName);
        if(!err) {
            console.log('Database MongoDb Connected!')
        }
        else{
            console.log("No DB connected, err: ", err);
            process.exit(1);
        }
    })
}

const insertProjects = (project, callback) => {
  projectCollection.insert(project,callback);

}

const getProjects = (callback) => {
  projectCollection.find({}).toArray(callback);

}


const cardList = [
  {
      title: "Keira Knightley",
      image: "images/kk1.jpg",
      link: "About Keira",
      desciption: "Demo"
  },
  {
      title: "Olivia Wilde",
      image: "images/od.jpg",
      link: "About Olivia",
      desciption: "Demo"
  }
]

app.get("/api/projects", (req, res) => {
  //res.json({statusCode: 200, data: cardList, message: "Successful"})
    getProjects((err,result)=> {
        if(err){
            res.json({statusCode: 400, message: err})
        }
        else{
            res.json({statusCode: 200, message: "Get Project Successful", data: result})
        }
    
  })
})
  
  app.post("/api/projects", (req, res) => {
    console.log("New project added", req.body)
    var newProject = req.body;
    insertProjects(newProject,(err,result) => {
      if(err) {
        res.json({statusCode: 400, message: err})
      }
      else {
        res.json({statusCode: 200, data: result, message:"Project successfully added"})
      }
    })
  })

var port = process.env.port || 8080;

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/public/Prac4_index.html');
})

app.listen(port,()=>{
    console.log("Listening on: " + port)
    createCollection("Celebrities")
})