const express = require('express')
var app = express();
const port = 3000;

const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize({
  dialect:'sqlite',
  storage:'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  content: {
    type: DataTypes.STRING,
    allowNull: false // 비어있어도 되니? false = 안돼
  },
});

(async() => {
await Comments.sync();
console.log("The table create")
})();


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('view engine', 'ejs');

app.get('/', async function(req, res) {
  const comments = await Comments.findAll();
  res.render('index',{comments: comments}); 
});

app.post('/create', async function(req, res) {
  console.log(req.body);
  const { content } = req.body;
  
  await Comments.create({ content: content});
  res.redirect('/');
});

app.post('/update/:id', async function(req, res) {

  const { content } = req.body;
  const { id } = req.params;

  await Comments.update(
    { content: content },  // 수정할 값
    { where: { id: id } }  // 수정 조건
  );

  res.redirect('/');
});


app.post('/delete/:id', async function(req, res) {

  const { id } = req.params;

  await Comments.destroy({
    where:{
      id: id
    }
  });
  
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});