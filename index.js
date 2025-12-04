const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

const Producto = require("./producto");
const Venta = require("./venta");
const VentaProducto = require("./ventaproducto");
const sequelize = require("./db");
const bcrypt = require("bcryptjs");
const Usuario = require("./usuario");
const session = require("express-session");
app.use(session({
  secret: "claveUTNsupersegura",
  resave: false,
  saveUninitialized: false,
}));

// Configuración de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar asociaciones
Producto.belongsToMany(Venta, { through: VentaProducto, foreignKey: "productoId" });
Venta.belongsToMany(Producto, { through: VentaProducto, foreignKey: "ventaId" });

// Inicialización de BD básica
(async () => {
  try {
    await sequelize.authenticate();
    console.log("BD Todo ok!");
    await Producto.sync({ alter: true });
    await Venta.sync({ alter: true });
    await VentaProducto.sync({ alter: true });
    console.log("Modelos sincronizados");
  } catch (error) {
    console.log("Error al inicializar BD:", error);
  }
})();

// Crear admin default si no existe
(async () => {
  const adminEmail = "admin@admin.com";
  const adminPass = "admin123";
  const existe = await Usuario.findOne({ where: { email: adminEmail } });
  if (!existe) {
    const hash = await bcrypt.hash(adminPass, 10);
    await Usuario.create({
      nombre: "Administrador",
      email: adminEmail,
      password: hash,
      estado: true
    });
    console.log("Admin de prueba creado:", adminEmail, adminPass);
  }
})();

// Middleware para proteger rutas admin
function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.redirect("/admin/login");
}

// GET login admin
app.get("/admin/login", (req, res) => {
  res.render("admin_login", { error: null });
});

// POST login admin
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render("admin_login", { error: "Por favor completá todos los campos" });
  }
  const usuario = await Usuario.findOne({ where: { email, estado: true } });
  if (!usuario) {
    return res.render("admin_login", { error: "Usuario o contraseña incorrectos" });
  }
  const ok = await bcrypt.compare(password, usuario.password);
  if (!ok) {
    return res.render("admin_login", { error: "Usuario o contraseña incorrectos" });
  }
  // Logueo OK
  req.session.admin = {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
  };
  res.redirect("/admin");
});

// RUTA PROTEGIDA: Panel/dashboard admin
app.get("/admin", requireAdmin, async (req, res) => {
  // (próximamente: mostrar dashboard real, ahora placeholder)
  res.send(`<h2>Bienvenido al panel admin, ${req.session.admin && req.session.admin.nombre}</h2><a href='/admin/logout'>Cerrar sesión</a>`);
});

// Deslog
app.get("/admin/logout", (req, res) => { req.session.destroy(() => res.redirect("/admin/login")); });

// -------- RUTAS DE API (DEBEN IR ANTES DE ARCHIVOS ESTÁTICOS) --------

// -------- API JSON PARA PRODUCTOS --------

// GET /api/productos?tipo=libro&activo=true&page=1&limit=10
app.get("/api/productos", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};

    if (req.query.tipo) {
      where.tipo = req.query.tipo;
    }

    if (req.query.activo === "true") {
      where.estado = true;
    } else if (req.query.activo === "false") {
      where.estado = false;
    }

    const { rows, count } = await Producto.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit) || 1;

    res.json({
      data: rows,
      page,
      totalPages,
      totalItems: count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

// GET /api/productos/:id
app.get("/api/productos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno" });
  }
});

// -------- API JSON PARA VENTAS --------

// POST /api/ventas - Crear una nueva venta
app.post("/api/ventas", async (req, res) => {
  try {
    const { clienteNombre, items } = req.body;

    if (!clienteNombre || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Datos inválidos: se requiere clienteNombre e items" });
    }

    // Calcular el total y validar productos
    let total = 0;
    const productosValidos = [];

    for (const item of items) {
      const producto = await Producto.findByPk(item.productoId);
      
      if (!producto) {
        return res.status(404).json({ message: `Producto con ID ${item.productoId} no encontrado` });
      }

      if (!producto.estado) {
        return res.status(400).json({ message: `El producto "${producto.titulo}" está inactivo` });
      }

      const subtotal = parseFloat(producto.precio) * parseInt(item.cantidad);
      total += subtotal;

      productosValidos.push({
        productoId: producto.id,
        cantidad: parseInt(item.cantidad),
        precioUnitario: parseFloat(producto.precio),
        titulo: producto.titulo,
      });
    }

    // Crear la venta
    const venta = await Venta.create({
      clienteNombre,
      total: total.toFixed(2),
      fecha: new Date(),
    });

    // Crear los registros de VentaProducto
    for (const item of productosValidos) {
      await VentaProducto.create({
        ventaId: venta.id,
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
      });
    }

    res.status(201).json({
      message: "Venta creada exitosamente",
      venta: {
        id: venta.id,
        clienteNombre: venta.clienteNombre,
        fecha: venta.fecha,
        total: parseFloat(venta.total),
        items: productosValidos,
      },
    });
  } catch (error) {
    console.log("Error al crear venta:", error);
    res.status(500).json({ message: "Error interno: " + error.message });
  }
});

// GET /api/ventas/:id - Obtener una venta por ID
app.get("/api/ventas/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    const venta = await Venta.findByPk(id);

    if (!venta) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    // Obtener los productos de la venta desde VentaProducto
    const ventaProductos = await VentaProducto.findAll({
      where: { ventaId: id },
    });

    // Obtener los detalles de cada producto
    const items = [];
    for (const vp of ventaProductos) {
      const producto = await Producto.findByPk(vp.productoId);
      if (producto) {
        items.push({
          productoId: producto.id,
          titulo: producto.titulo,
          cantidad: vp.cantidad,
          precioUnitario: parseFloat(vp.precioUnitario),
        });
      }
    }

    res.json({
      id: venta.id,
      clienteNombre: venta.clienteNombre,
      fecha: venta.fecha,
      total: parseFloat(venta.total),
      items,
    });
  } catch (error) {
    console.log("Error al obtener venta:", error);
    res.status(500).json({ message: "Error interno: " + error.message });
  }
});

// -------- VISTAS EJS (después de las rutas de API) --------

app.get("/", async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.render("index", { productos });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno");
  }
});

app.get("/crear", (req, res) => {
  res.render("crear");
});

app.post("/crear", async (req, res) => {
  try {
    await Producto.create({
      titulo: req.body.titulo,
      tipo: req.body.tipo || "libro",
      descripcion: req.body.descripcion || null,
      precio: parseFloat(req.body.precio) || 0,
      fechaSalida: req.body.fechaSalida || new Date().toISOString().split('T')[0],
      estado: true,
      image: req.body.image || "",
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno: " + error.message);
  }
});

// -------- ARCHIVOS ESTÁTICOS (al final, después de todas las rutas) --------
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "..", "front")));

// Middleware de manejo de errores (debe ir al final, después de todas las rutas)
app.use((err, req, res, next) => {
  console.error("Error no manejado:", err);
  
  // Si la ruta empieza con /api, devolver JSON
  if (req.path.startsWith("/api")) {
    return res.status(500).json({ 
      message: "Error interno del servidor", 
      error: err.message 
    });
  }
  
  // Para otras rutas, devolver HTML de error
  res.status(500).send("Error interno del servidor");
});

app.listen(port, () => {
  console.log("Servidor escuchando en puerto", port);
});

