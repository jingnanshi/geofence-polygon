var drawingManager;
var selectedShape;
var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
var selectedColor;
var colorButtons = {};

var polygon = [];
var map;
var polygon_options = {
            strokeWeight: 0,
            fillOpacity: 0.45,
            editable: true,
            draggable: true
        };

function initialize () {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: new google.maps.LatLng(33.444892, -118.484664),
        mapTypeId: google.maps.MapTypeId.HYBRID,
        disableDefaultUI: false,
        zoomControl: true,
        scaleControl: true
    });

    // Creates a drawing manager attached to the map that allows the user to draw
    // markers, lines, and shapes.
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        markerOptions: {
            draggable: true
        },
        polygonOptions: polygon_options,
        map: map
    });


    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {        
        
        if (e.type !== google.maps.drawing.OverlayType.MARKER) {
            // Switch back to non-drawing mode after drawing a shape.
            drawingManager.setDrawingMode(null);
        }
    });

    // save the polygon out
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (e) {

        cpolygon = e.getPath();
        polygon.push(cpolygon);
        cpolygon.forEach(function(vert, index) { console.log(vert.toString())})
    });
}

function savePolygon() {

    for (i = 0; i < polygon.length; i++)
    {
        var csvRows = ["Latitude,Longitude"];
        
            polygon[i].forEach(function(vert, index) 
                { 
                    var cRow = vert.toString();
        
                    csvRows.push(cRow.substring(1, cRow.length - 1));
        
                })
        
            console.log(csvRows);
        
            var csvString = csvRows.join("\r\n");
            var a         = document.createElement('a');
            a.href        = 'data:attachment/csv,' +  encodeURIComponent(csvString);
            a.target      = '_blank';
            a.download    = 'path.csv';
        
            document.body.appendChild(a);
            a.click();
    }

}


function readCSVPolygonFile (evt) {

    if (polygon != null)
    {
        polygon.setMap(null);
    }

    var files = evt.target.files;
    var file = files[0];           
    var reader = new FileReader();
    reader.onload = function() {
     
    console.log(this.result); 
    
    var data = d3.csvParse(this.result);

    var latlngArray = [];

    for (var i = 0; i < data.length; i++) {
        console.log(data[i].Latitude, data[i].Longitude);
        if (data[i].Latitude != 0 && data[i].Longitude != 0)
        {
            latlngArray.push(new google.maps.LatLng(data[i].Latitude, data[i].Longitude))
        }
        
    }

    // draw polygon
    polygon = new google.maps.Polygon({
        paths: latlngArray,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });
    polygon.setMap(map);
    
    }
    
    reader.readAsText(file);
}

google.maps.event.addDomListener(window, 'load', initialize);
document.getElementById('csvfile').addEventListener('change', readCSVPolygonFile, false);
