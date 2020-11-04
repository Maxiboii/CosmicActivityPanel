const earthSize = 12742
const dateSpan = document.getElementById('date')

function drawBody(radius, canvas) {
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d')

    var circle = new Path2D()
    circle.arc(150, 75, 75*radius/earthSize, 0, 2 * Math.PI)

    ctx.fill(circle)
  }
}

function getDate(epoch) {
  let sec = Math.floor((epoch - Date.now())/1000)
  let min = Math.floor((epoch - Date.now())/60000)
  let hr = Math.floor((epoch - Date.now())/3600000)
  sec - min * 60 < 10 ? sec = '0' + (sec - min * 60).toString() : sec = (sec - min * 60).toString()
  min - hr * 60 < 10 ? min = '0' + (min - hr * 60).toString() : min = (min - hr * 60).toString()
  hr < 10 ? hr = '0' + hr.toString() : hr.toString()
  if (epoch - Date.now() < 0) {
    return 'passed'
  } else {
    return hr + ':' + min + ':' + sec
  }
}


// drawBody(earthSize, document.getElementById('canvas'))
const [todayMonth, todayDate, todayYear] = new Date().toLocaleDateString("en-US").split("/")
apiDate = todayYear + '-' + todayMonth + '-' + todayDate

const approachTime = []

var request = new XMLHttpRequest()
const apiKey = '5bbsCyWbCHbQfeQmEEd9e3jYjVwXRh8VGAiINvNr'
// const daysHeading = document.getElementById('days')
const content = document.getElementById('content')

request.open('GET', 'https://api.nasa.gov/neo/rest/v1/feed?start_date=' +
  apiDate + '&end_date=' + apiDate + '&api_key=' + apiKey, true)
request.onload = function () {
  dateSpan.innerHTML = new Date()
  setInterval(() => {
    dateSpan.innerHTML = new Date()  
  }, 1000);
  
  // Begin accessing JSON data here
  var data = JSON.parse(this.response)

  if (request.status >= 200 && request.status < 400) {
    const asteroidData = data['near_earth_objects']
  
    
      for (let i in asteroidData) {
          console.log(asteroidData[i])
          

          for (let asteroid in asteroidData[i]) {
            const tr = document.createElement('tr')
            const name = document.createElement('td')
            const size = document.createElement('td')
            const isDangerous = document.createElement('td')
            const closeApproach = document.createElement('td')
            const bodyPicture = document.createElement('td')
            const bodyPictureCanvas = document.createElement('canvas')
            const laser = document.createElement('td')
            const laserButton = document.createElement('button')
            const laserSpan = document.createElement('span')

            name.textContent = asteroidData[i][asteroid].name
            tr.appendChild(name)
            size.textContent = asteroidData[i][asteroid]['estimated_diameter'].kilometers['estimated_diameter_max']
            tr.appendChild(size)
            if (asteroidData[i][asteroid].is_potentially_hazardous_asteroid == true) {
              isDangerous.textContent = 'YES'
            } else {
              isDangerous.textContent = 'NO'
            }
            tr.appendChild(isDangerous)
            closeApproach.textContent = getDate(asteroidData[i][asteroid]['close_approach_data']['0']
            ['epoch_date_close_approach'])
            closeApproach.setAttribute('class', 'countdown')
            approachTime.push(asteroidData[i][asteroid]['close_approach_data']['0']
            ['epoch_date_close_approach'])
            tr.appendChild(closeApproach)
            drawBody(parseFloat(size.textContent) * 15000, bodyPictureCanvas)
            bodyPicture.appendChild(bodyPictureCanvas)
            tr.appendChild(bodyPicture)
            laserButton.textContent = 'Laser it!'
            laser.appendChild(laserButton)
            laserSpan.textContent = 'Just a joke'
            laser.appendChild(laserSpan)
            tr.appendChild(laser)

            content.appendChild(tr)
          }
          
          // content.innerHTML = asteroidData[i]
      }
    // data.forEach((movie) => {
    //   console.log(movie)
    // })
    const countdown = document.getElementsByClassName('countdown')
    setInterval(() => {
      for (let i = 0; i < approachTime.length; i++ ){
        countdown[i].innerHTML = getDate(approachTime[i])
      }
    }, 1000);
    
  } else {
    console.log('error')
  }
}

request.send()

