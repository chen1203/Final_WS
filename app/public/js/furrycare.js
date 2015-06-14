var furrycareApp = angular.module("furrycareApp",[]);

furrycareApp.controller('FurryCtrl', function($scope,$http) {
	
	$http.get("http://localhost:3000/get").success(function (data) {
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

    $scope.createVaccNoti = function(dateToExp) {
        console.log("create notification to vaccination.");
        console.log(dateToExp);

        // create alarm object
        
        // push it to db
        
        // create notify ?
    };

});

furrycareApp.controller('MainNavCtrl',function($scope){
    //in first run the selected li in main nav be the alerts
    $scope.selectedMainNavLink = 'animals';
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