let CircuitPageVM = function() {

    self = this
    self.CircuitUrl = ko.observable('http://192.168.160.58/Formula1/api/circuits/circuit?id=')

    self.circuitId = ko.observable('')
    self.error = ko.observable('');
    self.CircuitName = ko.observable('')
    self.circuitImgUrl = ko.observable('')
    self.lat = ko.observable('')
    self.long = ko.observable('')
    self.alt = ko.observable('')
    self.location = ko.observable('')
    self.country = ko.observable('')

    self.Races = ko.observableArray([])

    //dados das races individualmente : 
    self.raceName = ko.observable('')
    
    self.drivername1 = ko.observable('')
    self.drivername2 = ko.observable('')
    self.drivername3 = ko.observable('')

    self.driverConstructor1 = ko.observable('')
    self.driverConstructor2 = ko.observable('')
    self.driverConstructor3 = ko.observable('')
    
    self.DriveImg1 = ko.observable('')
    getRaceDet = function(race){
        self.RaceUrl = ko.observable("http://192.168.160.58/formula1/api/races/race?id=")
        console.log('CALL: getting the race details...');


        var composedUri = self.RaceUrl() + race.RaceId;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            console.log(data.Results)
            self.drivername1(data.Results[0].DriverName)
            self.drivername2(data.Results[1].DriverName)
            self.drivername3(data.Results[2].DriverName)

            self.driverConstructor1(data.Results[0].ConstructorName)
            self.driverConstructor2(data.Results[1].ConstructorName)
            self.driverConstructor3(data.Results[2].ConstructorName)

            
            
            hideLoading();
        });

       

    }
//data-bs-toggle="modal" data-bs-target="#exampleModal"
    textModal = function(){
        return "driver"
    }

    
    
    

    self.activate = function (id) {
        console.log('CALL: getting the circuit...');
        var composedUri = self.CircuitUrl() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.circuitId(data.CircuitId)
            self.CircuitName(data.Name)
            self.circuitImgUrl(data.ImageUrl)
            self.lat(data.Lat)
            self.long(data.Lng)
            self.alt(data.Alt)
            self.location(data.Location)
            self.country(data.Country)
            self.Races(data.Races)

            var map = L.map('map').setView([self.lat(), self.long()], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiZGFuMWVydXNhbTQiLCJhIjoiY2t6NGx1a21iMDVveTJ1cXc5Y2V2a3M2aCJ9.W5gwZMRw-s1XagpGKcRTOg'
            }).addTo(map);
            var marker = L.marker([lat(),long()]).addTo(map);


            hideLoading();
        });
        
    };
    
    
    //data-bs-toggle="modal" data-bs-target="#exampleModal"

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });

    }

    function showLoading() {
        $('#myModal').modal('show',{
            backdrop: 'static',
            keyboard: false
        });
    }

    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    
}


$(document).ready(function () {
    


    console.log('Loading Circuit...')
    ko.applyBindings(new CircuitPageVM());

});



