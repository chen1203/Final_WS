var furrycareApp = angular.module("furrycareApp",[]);

furrycareApp.controller('LoginCtrl', function ($scope,$http) {       

    $scope.tries = 0;
    $scope.login = function() {
        
        console.log("mail: "+ $scope.user.email);
        console.log("pass: "+ $scope.user.pass);
        console.log("try number: "+$scope.tries);       

        $http.get('http://localhost:3000/getUser?userMail='+$scope.user.email)
            .success(function (data){
                console.log("login...");
                console.log("data(user) returned from ws ");  
                console.log(data);
                
                if (data == null) {
                    alert("There is no such mail in the system. move to sign in.");
                    // delete history
                    window.location.href = "error.html"; // sign in ?
                } else {
                    console.log(data.email);
                    console.log(data.pass);
                    console.log($scope.user.pass);
                    if (data.pass === $scope.user.pass)  {
                         // delete history
                         window.location.href = "index.html?mail="+data.email; 
                    } else {
                         alert("incorrect password.");
                         //clear input
                         $scope.user.pass = "";
                         // increament number of tries
                         $scope.tries +=1;
                         if ($scope.tries >= 3) {
                            alert("You have been tring too many times.\nYou can try login again later..");
                            // delete history
                            window.location.href = "error.html";
                         }
                     }
                }    
        });
    };
});

furrycareApp.controller('FurryCtrl', function ($scope,$http,$location) {
// https://final-ws-furrycare.herokuapp.com

    var url = $location.$$absUrl;
    var a = document.createElement('a');
    a.href = url;
    var str = a.search;
    var index = str.indexOf("=");
    var userMail = str.slice(index+1);
    console.log(userMail);
    $scope.editname = false;

	$http.get('http://localhost:3000/getUser?userMail='+userMail).success(function (data) {
	       
        console.log(data);
        $scope.user = data;
        console.log("user name : "+$scope.user.userName);
        //if ( typeof $scope.user.animals !== 'undefined') {
        var len = $scope.user.animals.length;    
        if (len > 0) {
            console.log(len);
            $scope.currAnimal = $scope.user.animals[len-1];
            console.log("curr: "+$scope.currAnimal.animalName);
        } else
               $scope.currAnimal = $scope.user.animals[0];               
	});

    $scope.checkSelectedAnimal = function(id) {
        console.log("id= "+id); 
        angular.forEach($scope.user.animals, function(animal) {
            console.log(animal._id);
            if (animal._id == id) {
                $scope.currAnimal = animal;
            } 
        });
    };
    $scope.isActive = function(nowSelectedAnimalLink) {
        console.log("from is active..."+$scope.currAnimal.animalName);
        return $scope.currAnimal._id === nowSelectedAnimalLink;
    };

    $scope.editClicked = function(detail) {
        console.log(detail);
        if (detail === "animalName") {
            console.log("edit animal name mode...");
            // change to edit name mode
            $scope.editname = true;

        }        
    };

    $scope.isInEditNameMode = function() {
        return $scope.editname;
    }

    $scope.doneClicked = function() {
         $scope.editname = false;
    }

    $scope.createNoti = function(type,name,dateToExp) {
        console.log("create notification to vaccination or to care.");
        console.log(dateToExp);
        var dateObj = new Date(dateToExp);
        // push the notification to db
        $http.get('http://localhost:3000/setNewAlarm?alarmtype='+type+'&alarmname='+name+'&expdate='+dateObj)
                .success(function (data){
                    $scope.user = data;
        });

    };
    $scope.createFoodNoti = function(type,name,weight,dailyUse) {
        console.log("create notification to food.");
        console.log(type);
        daysleft = (weight * 1000) / dailyUse;
        var dateToExp = new Date();
        dateToExp.setDate(dateToExp.getDate() + daysleft); 
        console.log(dateToExp);
        // push the notification to db
        $http.get('http://localhost:3000/setNewAlarm?alarmtype='+type+'&alarmname='+name+'&expdate='+dateToExp).success(function (data){
            $scope.user = data;
        });
    };

});

furrycareApp.controller('NewAnimalCtrl', function ($scope,$http) {
     $scope.animal = {
                animalName: '',
                animalAge: '',
                animalWeight: '',
                animalPic: 'animal1.png'
            };
    $scope.addNewAnimal = function() {
        console.log("name: "+ $scope.animal.animalName);
        console.log("age: "+ $scope.animal.animalAge);
        console.log("weight: "+ $scope.animal.animalWeight);
        console.log("pic: "+ $scope.animal.animalPic);

        $http.get('http://localhost:3000/setNewAnimal?animalName='+$scope.animal.animalName+'&animalAge='+$scope.animal.animalAge
            +'&animalWeight='+$scope.animal.animalWeight+'&animalPic='+$scope.animal.animalPic)
            .success(function (data){
                console.log("set new animal successfully...");
                console.log(data);  
                window.location.href = "index.html"; 
                console.log("after redirect...");
        });
       
    };
});

furrycareApp.controller('ListController', function ($scope) {
    
    $scope.open = function(item){
        if ($scope.isOpen(item)){
            $scope.opened = undefined;
        } else {
            $scope.opened = item;
        }        
    };
    
    $scope.isOpen = function(item){
        return $scope.opened === item;
    };
    
    $scope.anyItemOpen = function() {
        return $scope.opened !== undefined;
    };
    
    $scope.close = function() {
        $scope.opened = undefined;
    };
});    

furrycareApp.controller('ItemController', function ($scope) {

});


