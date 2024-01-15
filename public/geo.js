var walkingSpeedElement = document.getElementById('walkingSpeed');
var maximumHeartRateElement = document.getElementById('maximumHeartRate');
var walkingSpeed = parseFloat(walkingSpeedElement.getAttribute('data-walkingSpeed'));
var maximumHeartRate = parseFloat(maximumHeartRateElement.getAttribute('data-maximumHeartRate'));


var map, startMarker, endMarker, routingControl, polyline;
var mapInitialized = false;
var clickCount = 0;
var fromLatLng, toLatLng; // 변수를 상단에서 선언


function findElevation(e, geojson) {
  console.log("GeoJSON String:", geojson);

  console.log(e);

  var latlng = e;

  var nearestFeature = turf.nearestPoint(turf.point([latlng.lng, latlng.lat]), geojson);
  var elevation = nearestFeature.properties.elevation;


  console.log(nearestFeature);
  console.log(elevation);

  return elevation;

}

  function calculateDistance(fromLatLng, toLatLng) {
    var radianLat1 = fromLatLng.lat * (Math.PI / 180);
    var radianLat2 = toLatLng.lat * (Math.PI / 180);
    var deltaLat = radianLat2 - radianLat1;
    var deltaLng = (toLatLng.lng - fromLatLng.lng) * (Math.PI / 180);
  
    var a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(radianLat1) * Math.cos(radianLat2) *
      Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = 6371000 * c; // 지구 반지름 * 중심 각

    var roundDistance = Math.round(distance);
  
    return roundDistance;
  }

  console.log(fromLatLng);
  console.log(toLatLng);


function calculateSlope(fromLatLng, toLatLng, geojson) {
  // var geojson = JSON.stringify(geojson); // geojson 객체를 JSON 문자열로 변환

  var elevationFrom = findElevation(fromLatLng, geojson); // 출발지 고도 (미터)
  var elevationTo = findElevation(toLatLng, geojson); // 목적지 고도 (미터)

  // var elevationChange = elevationTo - elevationFrom;
  var horizontalDistance = calculateDistance(fromLatLng, toLatLng); // 가로 길이 (미터)

  var slope = (elevationTo - elevationFrom) / horizontalDistance * 100; // 경사도 계산
  var slopeOut = document.getElementById('slopeOut');
  slopeOut.innerHTML = "<p><strong>경사도:</strong> " + slope.toFixed(2) + "%</p>"; // 백분율로 변환하여 표시

  calculateIncrementHr(slope)

  return slope; // 예상 시간 반환
}
// 심박수 증가폭에 대한 예상 시간 계산
function calculateIncrementHr(slope) {
  // 주어진 논문의 식을 적용하여 심박수 증가폭에 대한 예상 시간을 계산
  var incrementHr = 10.2025 * Math.pow(slope, 0.4392);
  
  var roundedIncrementHr = Math.round(incrementHr);


  console.log("Increment Heart Rate:", roundedIncrementHr);


  return roundedIncrementHr;
}




// var geojsonString = JSON.stringify(geojson); // GeoJSON 데이터를 문자열로 변환

function initMap() {
  if (mapInitialized) {
    return;
  }


  map = L.map("map").setView([35.14883, 129.005836], 14);



  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

 

  // var slopeOut = document.getElementById('slopeOut');

  var geojson = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.003285, 35.150232]
        },
        "properties": {
          "elevation": 16
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.0073197604798, 35.14605181990699]
        },
        "properties": {
          "elevation": 85
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.0125640091498, 35.15112861117825]
        },
        "properties": {
          "elevation": 40
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.010188, 35.149893]
        },
        "properties": {
          "elevation": 42
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.010502, 35.147304]
        },
        "properties": {
          "elevation": 89
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.008916, 35.150066]
        },
        "properties": {
          "elevation": 29
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.010073, 35.150832]
        },
        "properties": {
          "elevation": 28
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.012041, 35.151198]
        },
        "properties": {
          "elevation": 34
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.007506, 35.149569]
        },
        "properties": {
          "elevation": 33
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.008472, 35.147217]
        },
        "properties": {
          "elevation": 80
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.00944, 35.14663]
        },
        "properties": {
          "elevation": 97
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.009087, 35.148282]
        },
        "properties": {
          "elevation": 62
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.010502, 35.147304]
        },
        "properties": {
          "elevation": 89
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.010108, 35.150548]
        },
        "properties": {
          "elevation": 32
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [129.010171, 35.150028]
        },
        "properties": {
          "elevation": 40
        }
      }        
    ]
  };



  map.on('click', function(e) {
    console.log("Click event object:", e);
    if (clickCount === 0) {
      startMarker = L.marker(e.latlng).addTo(map).bindPopup("Start").openPopup();
      fromLatLng = e.latlng; // 변수에 값 할당
    } else if (clickCount === 1) {
      endMarker = L.marker(e.latlng).addTo(map).bindPopup("End").openPopup();
      toLatLng = e.latlng; // 변수에 값 할당
  
      // 추가: 출발지와 목적지 좌표값이 할당되었는지 확인하고 calculateRoute 함수 호출
      if (fromLatLng && toLatLng) {
        calculateRoute(fromLatLng, toLatLng); // 변수 이름 변경
        var slope = calculateSlope(fromLatLng, toLatLng, geojson); // 변수 이름 변경
        var slopeOut = document.getElementById('slopeOut');
        slopeOut.innerHTML = "<p><strong>경사도:</strong> " + slope.toFixed(2) + "%</p>";
      } else {
        alert("Please select both start and end markers on the map.");
      }
    } else {
      return;
    }
    clickCount++;
  });


  
  routingControl = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true
  }).addTo(map);

  routingControl.on('routesfound', function (e) {
    var routes = e.routes;
    var summary = routes[0].summary;
    var distance = summary.totalDistance;
    var time = summary.totalTime;

    var output = document.getElementById('output');
    output.innerHTML = "<p><strong>거리:</strong> " + Math.round(distance) + " m</p>";
                      // + "<p><strong>예상 시간:</strong> " + formatTime(time) + "</p>";

                    

    if (polyline) {
      map.removeLayer(polyline);
    }
    polyline = L.Routing.line(routes[0]).addTo(map);

    var walkingTime = calculateWalkingTime(distance, walkingSpeed, maximumHeartRate, slope);

    var fromLatLng = startMarker.getLatLng();
    var toLatLng = endMarker.getLatLng();
    
    var slope = calculateSlope(fromLatLng, toLatLng, geojson); // 변수 이름 변경
    var slopeOut = document.getElementById('slopeOut');
    slopeOut.innerHTML = "<p><strong>경사도:</strong> " + slope.toFixed(2) + "%</p>";

  // 기존 output 내용 유지하면서 walkingTime 정보 추가
    output.innerHTML += "<p><strong>예상 도보 시간:</strong> " + walkingTime.toFixed(2) + " 분";
});
    
  
  
  
  function calculateRoute(fromLatLng, toLatLng) {
    if (!fromLatLng || !toLatLng) {
      alert("Please select start and end markers on the map.");
      return;
    }
  
    routingControl.setWaypoints([fromLatLng, toLatLng]);
  
    routingControl.route(function(routes) {
      var route = routes[0];
      if (route) {
        // 경로 정보를 가져올 수 있습니다.
        var distance = route.summary.totalDistance;
        var time = route.summary.totalTime;
  
        var output = document.getElementById('output');
        // output.innerHTML = "<p><strong>거리:</strong> " + distance + " km</p>" +
        //                    "<p><strong>예상 시간:</strong> " + formatTime(time) + "</p>";

  
        if (polyline) {
          map.removeLayer(polyline);
        }
  
        polyline = L.Routing.line(route).addTo(map);

        var slope = calculateSlope(fromLatLng, toLatLng, geojson); // 변수 이름 변경
        var slopeOut = document.getElementById('slopeOut');
        slopeOut.innerHTML += "<p><strong>경사도:</strong> " + slope.toFixed(2) + "%</p>";
      

        var walkingTime = calculateWalkingTime(distance, walkingSpeed, maximumHeartRate, slope);
        var walkingTimeOutput = "<p><strong>예상 도보 시간:</strong> " + walkingTime.toFixed(2) + " 분";



        output.innerHTML = walkingTimeOutput;


      }
    });
  
    
  


      // 좌표값을 배열로 변환
    // var fromArray = [fromLatLng.lat, fromLatLng.lng];
    // var toArray = [toLatLng.lat, toLatLng.lng];

    // routingControl.setWaypoints([fromLatLng, toLatLng]);
    // routingControl.route();
  }

  function calculateWalkingTime(distance, walkingSpeed, maximumHeartRate, slope) {
    // 걷는 속도를 킬로미터/분으로 변환
    walkingSpeed = walkingSpeed / 60;
    // calculateSlope 함수를 호출하여 경사도 값을 얻음
    var slope = calculateSlope(fromLatLng, toLatLng, geojson); // 변수 이름 변경
    // 걷는 속도를 킬로미터/분으로 변환
    var incrementHr = calculateIncrementHr(slope); // 예상 심박수 증가량
    var estimatedTime = (distance / 1000) / (walkingSpeed * (1 + incrementHr / maximumHeartRate));
    

    return estimatedTime;

  }


  

  
  function formatTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    var remainingSeconds = seconds % 3600;
    var minutes = Math.floor(remainingSeconds / 60);
    var seconds = remainingSeconds % 60;


    var timeString = "";
    if (hours > 0) {
      timeString += hours + "시간 ";
    }
    if (minutes > 0) {
      timeString += minutes + "분 ";
    }
    if (seconds > 0) {
      timeString += seconds + "초";
    }

    return timeString;
  }

  

  


}








  
