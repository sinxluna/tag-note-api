var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');

//const pg = require('pg');
const Sequelize = require('sequelize');

//const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/tag-note-db');
const sequelize = new Sequelize('postgres://db_aws:monkey123!@jl-aws-db.cy0bihyodrey.ap-southeast-1.rds.amazonaws.com:5432/db_aws');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/tag', function(req, resp){

sequelize.query('SELECT distinct tag FROM "tag_note"."tagNotes" ORDER BY tag ASC').then(result => { 
    resp.send(result[0]);
}).catch(e => resp.status(500).send(e.stack))
 
});


app.post('/searchtag', function(req, resp){
 
   var data = [];
    var err = [];
    var query = 'SELECT * FROM "tag_note"."tagNotes" WHERE tag in (:tagName) ORDER BY tag ASC';
    var tags = [];
    
    for(var i = 0; i < req.body.tag.length; i++)
    { 
        tags.push(req.body.tag[i].id);
    }
              
         sequelize.query(query, { 
        replacements: {    
            tagName: tags
        }
    }).then(result => { 
     
              resp.send(result[0]);
         }).catch(e =>  resp.status(500).send(e))
        
 
   
   
});


app.post('/addnotes', function(req, resp){
 
  
    var err = [];
             
      sequelize.query('INSERT INTO "tag_note"."tagNotes" (id,tag,notes) VALUES(:id,:tag,:notes)', { 
        replacements: {
            id: req.body.id,
            tag: req.body.tag,
            notes: req.body.notes
        }
    }).then(result => { 
    resp.send(result[0])
}).catch(e => resp.status(500).send(e));

                
   
   
});

app.post('/deletenotes', function(req,resp){
  
    var err = [];
  
    
    sequelize.query('DELETE from "tag_note"."tagNotes" where id = :id', { 
        replacements: {
            id: req.body.id           
        }
    }).then(result => { 
    resp.send(result[0]);
}).catch(e => resp.status(500).send(e));
    
  
});

app.listen(9000, function() {
    console.log("Tag Note API running on port 9000...");
});