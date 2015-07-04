var furrycareApp = angular.module("furrycareApp",[]);

furrycareApp.controller('FurryCtrl', function($scope,$http,$location) {
// https://final-ws-furrycare.herokuapp.com
	$http.get("http://localhost:3000/get").success(function (data) {
		console.log(data);
		$scope.user = data;
		console.log("user name : "+$scope.user.userName);
        $scope.currAnimal = data.animals[0];
	});

    $scope.checkSelectedAnimal = function(id) {
        console.log("id= "+id);
        //$scope.currAnimal = $scope.user.animals[id]; 
        angular.forEach($scope.user.animals, function(animal) {
            console.log(animal._id);
            if (animal._id == id) {
                $scope.currAnimal = animal;
            } 
        });
    };
    $scope.isActive = function (nowSelectedAnimalLink) {
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
            +'&animalWeight='+$scope.animal.animalWeight+'&animalPic='+$scope.animal.animalPic).success(function (data){
            $scope.user = data;
        });
        window.location.href = "index.html";    
    };

});

