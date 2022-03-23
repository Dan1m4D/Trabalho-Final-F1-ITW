let ConstructorsVM = function() {

    self = this
    self.Constructors = ko.observable('http://192.168.160.58/formula1/api/constructors')

    self.error = ko.observable('');
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
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

    self.constructors = ko.observableArray([]);
    
    self.nome = ko.observable('');
    self.nacionalidade = ko.observable('');
    self.img = ko.observable('');
    self.wiki = ko.observable('');
    self.ref = ko.observable('');
    self.ConstructorId = ko.observable('');
    self.races = ko.observableArray([]);
    self.drivers = ko.observableArray([]);

    ContructorDetails = function(constructor){
        console.log("details")
        console.log(constructor)

        self.constructorId = ko.observable('http://192.168.160.58/formula1/api/constructors/constructor?id=')

        var composedUri = self.constructorId() + constructor["ConstructorId"] ;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.nome(data.Name)
            self.nacionalidade(data.Nationality)
            self.img(data.ImageUrl)
            self.wiki(data.Url)
            self.ref(data.ConstructorRef)
            self.ConstructorId(data.ConstructorId)
            self.races(data.Races)
            self.drivers(data.Drivers)
            hideLoading();
        });
        
    }

    

    self.activate = function (id) {
        console.log('CALL: getting the constructors...');
        var composedUri = self.Constructors() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            console.log(data.List)
            self.constructors(data.List)
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
    console.log('Loading Constructors...')
    ko.applyBindings(new ConstructorsVM());
    
    


});



