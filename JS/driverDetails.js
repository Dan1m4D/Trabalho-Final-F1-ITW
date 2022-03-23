// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Formula1/api/Drivers/Driver?id=');
    self.displayName = 'Driver Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.DriverId = ko.observable('');
    self.DriverRef = ko.observable('');
    self.ImageUrl = ko.observable('');
    self.Name = ko.observable('');
    self.Nationality = ko.observable('');
    self.Number = ko.observable('');
    self.Races = ko.observableArray('');
    self.Url = ko.observable('');

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getDriver...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.DriverId(data.DriverId);
            self.DriverRef(data.DriverRef);
            self.ImageUrl(data.ImageUrl);
            self.Name(data.Name);
            self.Nationality(data.Nationality);
            self.Number(data.Number);
            self.Races(data.Races);
            self.Url(data.Url);
            hideLoading();
        });
    };
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

    //Radar chart code :


    self.statsUrl = ko.observable('http://192.168.160.58/formula1/api/statistics/driver?id=');
    self.error = ko.observable('');

    self.wins = ko.observable('');
    self.races = ko.observable('');
    self.points = ko.observable('');

    

   

    self.activate2 = function (id) {
        console.log('CALL: getting driver stats...');
        var composedUri = self.statsUrl() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.wins(data.Wins)
            self.races(data.Races)
            let len = data.Career.length
            let totalPontos = 0

            for(var index = 0; index < len; index+=1){
                //console.log(data.Career[index]["Points"])

                totalPontos += parseInt(data.Career[index]["Points"])
            }

            console.log(typeof(self.wins))


            self.points(totalPontos)
           
            hideLoading();
        });
    };


    

    

 




    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
        
    else {
        self.activate(pg);
        self.activate2(pg)
    }

    
    


    
};

$(document).ready(function () {

    // Get the modal
    var modal = document.getElementById("ImgModal");

    // Get the image and insert it inside the modal
    var img = document.getElementById("DriverImg");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    img.onclick = function(){
        modal.style.display = "block";
        modalImg.src = this.src;
    }

    //  
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    var data_1 = [
        {x: "Corridas", value: ($('.r').val())},
        {x: "Vitórias", value: ($('.vit').val())},
        {x: "Pontos", value: ($('.pt').val())},
       
      ];

      console.log($('.r').val())
      // create a chart
    var chart = anychart.radar();

    // create the first series (line) and set the data
    var series1 = chart.line(data_1);

    // create the second series (area) and set the data

    // set the chart title
    chart.title("Driver radar");

    // set the container id
    chart.container("chartContaniner");

    // initiate drawing the chart
    chart.draw();

    

    console.log("ready!");
    ko.applyBindings(new vm());
});