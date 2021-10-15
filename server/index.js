const express = require("express")
const path = require('path')
const app = express()
const PORT = 3001 

app.use(express.static(path.join(__dirname, "..", "build")))
app.use(express.static(path.join(__dirname, "..", "public")))

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})

// const passThroughRoutes = [
//   '/login',
//   '/signup',
//   '/login/forgot',
//   '/dashboard',
//   '/collection',
//   '/activity',
//   '/workflow/new',
//   '/new',
//   '/run',
//   '/changes',
//   '/search',
//   '/notifications',
//   '/notification_settings',
//   '/:username',
//   '/:username/following'
// ]

// passThroughRoutes.forEach((route) => {
//   app.use(route, (req, res, next) => {
//     console.log(route, "req url", req.url, req.params, req.path, req.query)
//     res.sendFile(
//       path.join(__dirname, "..", "build", "index.html")
//     )
//   })
// })

app.use('/:username/:name', async function(req, res) {
  // Retrieve the ref from our URL path
  var username = req.params.username
  var name = req.params.name

  if (username === "ipfs") return
  console.log("username/name", username, name)
  res.sendFile(path.join(__dirname, "..", "build", "hello_world.html"))
})

app.use('/', (req, res, next) => {
  console.log(req.url)
  res.sendFile(
    path.join(__dirname, "..", "build", "index.html")
  ) 
})

// app.use('*', (req, res, next) => {
//   console.log("use *", req.url, req.params, req.path, req.query)
//   res.sendFile(
//     path.join(__dirname, "..", "build", "index.html")
//   )
// })
