const express = require('express')
const app = express()
const port = 80

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/oh-no',(req, res) => {
  res.statusCode = 500
  res.send('Some internal server error')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})