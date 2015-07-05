var furrycareApp = angular.module("furrycareApp",[]);

furrycareApp.controller('FurryCtrl', function($scope,$http,$location) {
// https://final-ws-furrycare.herokuapp.com
	$http.get("http://localhost:3000/get").success(function (data) {
		console.log(data);
		$scope.user = data;
		console.log("user name : "+$scope.user.userName);
        
        $scope.currAnimal = $scope.user.animals[0];        

    /*    if ( typeof $scope.user.animals !== 'undefined') {
            var len = $scope.user.animals.length;
            if (len >= 1) {
                $scope.currAnimal = $scope.user.animals[len-1];
                console.log("last animal: "+$scope.user.animals[len-1].animalName);
                console.log("curr: "+$scope.currAnimal.animalName);
            }else 
                $scope.currAnimal = $scope.user.animals[0];      
        }*/   
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
        return $scope.currAnimal._id === nowSelectedAnimalLink;
    };

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
                //$scope.user = data; /* make trubles */
                
                //$scope.checkSelectedAnimal($scope.user.animals[1]._id);
                //$scope.newAnimal = true;
                //$scope.currAnimal = $scope.user.animals[$scope.user.animals.length-1];
                //console.log("curr animal after added : "+$scope.currAnimal.animalName);
              /*  var len = $scope.user.animals.length;
                console.log("LENGTH : "+len);
                console.log($scope.currAnimal);
                if (len >= 1) {
                    $scope.currAnimal = $scope.user.animals[len-1];
                    console.log("last animal: "+$scope.user.animals[len-1].animalName);
                    console.log("curr: "+$scope.currAnimal.animalName);
                }
                else 
                    $scope.currAnimal = $scope.user.animals[0];
                */
                   
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


