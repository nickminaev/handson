const express = require('express')
const app = express()
const port = 80

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/fail', (req, res)=> {
  res.status(500).send("A very nasty erro")
  console.log("A very nasty error happened in the process. I'm exiting")
  process.exit(1)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
