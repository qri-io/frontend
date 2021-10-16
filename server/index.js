const express = require("express")
const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')
const composeHeadData = require('./util').composeHeadData
const composeJSONLD = require('./util').composeJSONLD

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:2503'
const PORT = 3000 

const app = express()

app.use(express.static(path.join(__dirname, "..", "build")))
app.use(express.static(path.join(__dirname, "..", "public")))

var server = app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})

// reservedUsernames are a list of words that may be mistaken for usernames
// during a url regex match of `/:username/:name`, because of how our routes
// are formed
// must be updated if routes change, particularly routes with 2 segments as
// those are the routes at risk for being incorrectly matched
const reservedUsernames = ['ipfs', 'login', 'workflow'] 


// reservedNames are a list of words that may be mistaken for dataset names
// during a url regex match of `/:username/:name`, because of how our routes
// are formed
// must be updated if routes change, particularly routes with 2 segments as
// those are the routes at risk for being incorrectly matched
const reservedNames = ['following']

const indexPath = path.join(__dirname, "..", "build", "index.html")

fs.access(indexPath, fs.constants.F_OK, (err) => {
  if (err !== null) {
    console.error(`File ${indexPath} does not exist: ${err}.\nApp must be built before attempting to host it.`)
    server.close(() => {
      process.exit(1)
    }) 
  }
})

app.use('/:username/:name', async (req, res) => {
  const username = req.params.username
  if (reservedUsernames.some((u) => {
    return u === username
  })) {
    return res.sendFile(indexPath)
  }

  const name = req.params.name
  if (reservedNames.some((n) => {
    return n === name
  })) {
    return res.sendFile(indexPath)
  }

  const datasetPreviewURL = `${API_BASE_URL}/ds/get/${username}/${name}`
  var dataset = {}
  try {
    dataset = await fetch(datasetPreviewURL)
                      .then(res => res.json())
                      .then(res => res.data )
  } catch (e) {
    console.log(`error fetching dataset ${username}/${name}: ${e}`)
    return res.sendFile(indexPath)
  }

  var indexHTML = ""
  try {
    indexHTML = fs.readFileSync(indexPath, { encoding: 'utf8' })
  } catch (e) {
    console.log(`error reading index.html file: ${e}`)
    return res.sendFile(indexPath)
  }

  try {
    const headData = composeHeadData(dataset)
    const jld = composeJSONLD(dataset)
    indexHTML = indexHTML.replace('<head>', headData+jld)
  } catch (e) {
    console.log(`error composing dataset ${username/name} data into html tags: ${e}`)
    return res.sendFile(indexPath)
  }

  res.contentType('text/html')
  res.status(200)
  return res.send(indexHTML)
})

app.use('/', async (req, res) => {
  return res.sendFile(indexPath)
})