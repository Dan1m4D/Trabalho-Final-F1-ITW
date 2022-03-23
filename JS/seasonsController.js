let SeasonsVM = function() {

    self = this
    self.Seasons = ko.observable('http://192.168.160.58/formula1/api/seasons')

    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.error = ko.observable('');
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };

    self.seasons = ko.observableArray([]);
    
    self.nome = ko.observable('');
    self.nacionalidade = ko.observable('');
    self.img = ko.observable('');
    self.wiki = ko.observable('');
    self.ref = ko.observable('');
    self.ConstructorId = ko.observable('');
    self.races = ko.observableArray([]);
    self.seasonRaces = ko.observableArray([]);
    self.ordernar = ko.observable(true);

    self.activate = function (id) {
        console.log('CALL: getting the seasons...');
        var composedUri = self.Seasons() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data.List);
            self.seasons(data.List)
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.PageCount);
            hideLoading();
            
        });
    };

    GetSeasonRaces = function(season){
        console.log(season.Year)

        self.seansoUrl = ko.observable('http://192.168.160.58/formula1/api/seasons/season?Year=')

        var composedUri = self.seansoUrl() + season.Year ;
        
        var get = ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data.Races);
            self.seasonRaces(data.Races)
            self.raceslen(data.Races.length)
            hideLoading();
        });

        self.seasonRaces()

    }

    PageUrl = function(race){
        window.location.href = race.Url
    }

    function GetSortOrderHigh(prop) {    
        return function(a, b) {    
            if (a[prop] < b[prop]) {    
                return 1;    
            } else if (a[prop] > b[prop]) {    
                return -1;    
            }    
            return 0;    
        }    
    } 
    
    function GetSortOrderLower(prop) {    
        return function(a, b) {    
            if (a[prop] > b[prop]) {    
                return 1;    
            } else if (a[prop] < b[prop]) {    
                return -1;    
            }    
            return 0;    
        }    
    } 

    sortList = function(){
        let arr = self.seasons()
        let ordenador = self.ordernar()
        console.log(arr)

        if(ordenador == true){
            arr.sort(GetSortOrderHigh("Year"))
            self.ordernar(false)
        }
        else if (ordenador == false){
            arr.sort(GetSortOrderLower("Year"))
            self.ordernar(true)
        }
        


        self.seasons(arr)

    }
    
   
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
    console.log('Loading Seasons...')
    ko.applyBindings(new SeasonsVM());
    
    


});