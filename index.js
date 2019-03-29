const express = require('express')
const bodyParser  = require('body-parser')
const axios = require('axios')
const fs = require('fs')
const router = express.Router()
const app = express()
const key = 'dlkd75sdfh45fdfdkjfk0465'

Youtube = function() {
  this.link = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=12&playlistId=UUOhP0t6arWMXqmcroJjMJ7A&key=AIzaSyCEBAOKZyqFEsauVZWIJY07CdTv6-WdFdk'
  this.data = null
  this.inter = null
  this.filename = 'youtube.json'

  this.main = function () {
    let _this = this
    this.inter = setInterval(function () {
      _this.check()
    }, 60000)
  }

  this.check = function () {
    try {
      let _this = this
      axios.get(this.link)
      .then(function (response) {
        _this.data = response.data.items

        let data = JSON.stringify(_this.data, null, 2)
        fs.writeFileSync(_this.filename, data)
      })
      .catch(function (error) {
        // handle error
        console.log(error)
        let rawdata = fs.readFileSync(_this.filename)
        _this.data = JSON.parse(rawdata)
      })
      .then(function () {
        // always executed
      })
    } catch (error) {
      console.log(error)
      clearInterval(_this.inter)
      _this.main()
    }
  }

  this.getInter = function () {return this.inter}
  this.getLink= function () {return this.link}
  this.getData= function () {return this.data}
  this.getFileName= function () {return this.filename}
}

let yt = new Youtube()

yt.check()
yt.main()


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const port = process.env.PORT || 8080;

router.route('/youtube/lastvideo')
  .get(function (req, res) {
    if (req.body.token == key) {
      let data = yt.getData()
      if (data === null || !data) {
        let filename = yt.getFileName()
        let rawdata = fs.readFileSync(filename)
        data = JSON.parse(rawdata)        
      }
      res.send(data)
    } else {
      res.send(null)
    }
  })
  


app.use('/api', router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))