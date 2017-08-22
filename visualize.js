var drawingManager;
var selectedShape;
var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
var selectedColor;
var colorButtons = {};

var polygon;

function initialize () {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: new google.maps.LatLng(33.444892, -118.484664),
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: false,
        zoomControl: true
    });

    // Creates a drawing manager attached to the map that allows the user to draw
    // markers, lines, and shapes.
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        markerOptions: {
            draggable: true
        },
        polygonOptions: {
            strokeWeight: 0,
            fillOpacity: 0.45,
            editable: true,
            draggable: true
        },
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

        polygon = e.getPath();
        polygon.forEach(function(vert, index) { console.log(vert.toString())})
    });
}

function savePolygon() {

    var csvRows = ["Latitude, Longitude"];

    polygon.forEach(function(vert, index) 
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

google.maps.event.addDomListener(window, 'load', initialize);