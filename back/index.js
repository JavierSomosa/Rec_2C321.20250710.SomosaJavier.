const express =require("express");
const app = express();
const ejs=require("ejs");
const port=3000;
const multer=require("multer");
const  upload  =  multer ( {  dest : 'public/'  } );

app.set('view engine', 'ejs');
app.set('views', './views');


const Producto=require("./producto");
const sequelize=require("./db");
//const productRoute=require("./routes/producto.routes");
//app.use("/",productRoute);

app.use("/public",express.static("images"));
app.use(express.json());
app.use(express.urlencoded());


//const enrutadorAdmin = require( "./routes/admin.routes");

//app.use("/admin",enrutadorAdmin);



/*
app.post("/producto", async (req, res) => {
  try {
    const creado = await Producto.create({
      titulo: "ficciones4",
      tipo: "libro",
      descripcion: "prueba",
      precio: "20000",
      fechaSalida: "1930-10-10",
      estado: "true",
      image : " ",
      
    });

    // 200 -> OK
    // 201 -> CREATED
    res.status(201).send(creado);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error interno" });
  }
});

*/


// Sincronización
// // https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
// User.sync() - This creates the table if it doesn't exist (and does nothing if it already exists)
// User.sync({ force: true }) Usar solo en desarrollo-Fuerza los cambios- This creates the table, dropping it first if it already existed
// User.sync({ alter: true }) comprueba y altera los campos- This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.

async function sincronizar() {
  try {
    await Producto.sync({ alter: true });
    console.log("Sincronizado");
  } catch (error) {
    console.log(error);
  }
}

sincronizar();


// Testeo de conexión
async function probarConexion() {
  try {
    await sequelize.authenticate();
    console.log("BD Todo ok!");
  } catch (error) {
    console.log(error);
    console.log("BD Nada ok!");
  }
};

probarConexion();



app.get("/",async (req,res) =>{
    const productos= await Producto.findAll();    
    res.render("index", {productos: productos});
});

app.get("/crear",(req,res)=>{
    res.render("crear");
});

//app.post("/crear",upload.single("imgProd"));
app.post("/crear", async (req, res) => {
  try {
    const creado = await Producto.create({
      titulo: req.body.titulo,
      tipo: "libro",
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      fechaSalida: "1930-10-10",
      estado: "true",
      image : " ",
      
    });
    //console.log(req.file);

    // 200 -> OK
    // 201 -> CREATED
   // res.status(201).send(creado);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error interno" });
  }
  res.redirect("/");
});


//app.get("/admin", (peticion, respuesta) => {
 // respuesta.send("Pagina principal admin");
//});

app.listen(port, () => {
  // callback que se ejecuta al levantar el servidor
  console.log("levantó bien");
});

