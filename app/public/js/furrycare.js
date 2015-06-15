var furrycareApp = angular.module("furrycareApp",[]);

furrycareApp.controller('FurryCtrl', function($scope,$http,$location) {

	$http.get("https://final-ws-furrycare.herokuapp.com/get").success(function (data) {
		console.log(data);
		$scope.user = data;
		console.log("user name : "+$scope.user.userName);
        $scope.currAnimal = data.animals[0];
        console.log("exp : "+ $scope.currAnimal.animalCare[0].careExpire);
	});

    $scope.checkSelectedAnimal = function(id) {
        console.log("id= "+id);
        $scope.currAnimal = $scope.user.animals[id]; 
    };
    $scope.isActive = function (nowSelectedAnimalLink) {
        return $scope.currAnimal.animalId === nowSelectedAnimalLink;
    };

    $scope.createNoti = function(type,name,dateToExp) {
        console.log("create notification to vaccination or to care.");
        console.log(dateToExp);
        // push the notification to db
        $http.get('https://final-ws-furrycare.herokuapp.com/setNewAlarm?alarmtype='+type+'&alarmname='+name+'&expdate='+dateToExp)
                .success(function (data){
                    $scope.user = data;
        });

    };
    $scope.createFoodNoti = function(type,name,weight,dailyUse) {
        console.log("create notification to food.");
        console.log(type);
        daysleft = (weight * 1000) / dailyUse;
        // NEED TO CALCULATE DATE HERE!!!!

        // add daysleft for today date....
        var dateToExp = '1.1.11';
        // push the notification to db
        $http.get('https://final-ws-furrycare.herokuapp.com/setNewAlarm?alarmtype='+type+'&alarmname='+name+'&expdate='+dateToExp).success(function (data){
            $scope.user = data;
        });
    };

});

furrycareApp.controller('MainNavCtrl',function($scope,$location){
    //in first run the selected li in main nav be the alertshttp://localhost:8080/index.html
    console.log($location.path());
    $scope.selectedMainNavLink = $location.path();
    console.log($scope.selectedMainNavLink);
    if ($scope.selectedMainNavLink == ""){
        $scope.selectedMainNavLink ="index.html";
    }
    // when user click on one of mainNav link he send a 'string' contain the name of li
    $scope.checkSelectedLink = function (nowSelectedLink) {
        $scope.selectedMainNavLink = nowSelectedLink;
    };
    // then the li class check if is active by the 'string' above
    $scope.isActive = function (nowSelectedLink) {
        return $scope.selectedMainNavLink === nowSelectedLink;
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