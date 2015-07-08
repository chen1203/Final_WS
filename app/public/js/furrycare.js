var furrycareApp = angular.module("furrycareApp",['ngCookies','ngRoute']);

furrycareApp.config(function($routeProvider){
      $routeProvider
          .when('/animal',{
                templateUrl: 'pages/animal.html',
                controller: 'animalCtrl'
          })
          .when('/notification',{
                templateUrl: 'pages/notification.html',
                controller: 'notificationCtrl'
          })
          .when('/new_animal',{
                templateUrl: 'pages/new_animal.html',
                controller: 'animalCtrl'
          });
         /* .otherwise({
                redirectTo : 'pages/home'
          });*/          
});

furrycareApp.controller('userCtrl', ['$scope','$rootScope','$http','$cookies','$cookieStore','$window','$location',
                                                    function ($scope,$rootScope,$http,$cookies,$cookieStore,$window,$location) {   
// https://final-ws-furrycare.herokuapp.com
    $scope.page = 'animal';

    $scope.isUserLogedIn = function() {
        //console.log("on logedIn...");
        if (typeof $cookies.userMail !== 'undefined') 
            return true;
        return false;
    };

    $scope.updateCurrentAnimal = function(first_or_last) { 
        var len = $scope.user.animals.length;    
        if (len <= 1) {
            $scope.currAnimal = $scope.user.animals[0]; 
            return;
        }
        if (first_or_last === "first") // len > 1
            $scope.currAnimal = $scope.user.animals[0];
        else
            $scope.currAnimal = $scope.user.animals[len-1];

        console.log("curr animal name: "+$scope.currAnimal.animalName);
    };

    $scope.getUser = function() {
        console.log("getUser is called!!! so the user is updated!");
        $http.get('http://localhost:3000/getUser?userMail='+$cookies.userMail).success(function (data) {
            console.log(data);
            $scope.user = data;
            console.log("user name : "+$scope.user.userName);
            //if ( typeof $scope.user.animals !== 'undefined') {
            $scope.updateCurrentAnimal("first");        
        });
    };

    $scope.tries = 0; // need enter to func login()
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
                    alert("There is no such email in the system. move to sign in.");
                    // delete history
                    $location.path("/error"); // sign in ?
                } else {
                    console.log(data.email);
                    console.log(data.pass);
                    console.log($scope.user.pass);
                    if (data.pass === $scope.user.pass)  {
                        // delete history                     
                        $cookies.userMail = data.email;
                        console.log("FROM LOGIN- COOKIE : "+$cookies.userMail);
                        // need it ?
                        $scope.user = data;
                        $scope.updateCurrentAnimal("first");
                        $scope.newAnimalClicked = false;
                        $location.path("/animal");
                    } else {
                         alert("incorrect password.");
                         //clear input
                         $scope.user.pass = "";
                         // increament number of tries
                         $scope.tries +=1;
                         if ($scope.tries >= 3) {
                            alert("You have been tring too many times.\nYou can try login again later..");
                            // delete history
                            $location.path("/error");
                         }
                     }
                }    
        });
    };

    $scope.initUserCtrl = function() {
        console.log("in userCtrl");
        if ($scope.isUserLogedIn()) {
            $scope.getUser();
            $scope.newAnimalClicked = false;
            $location.path("/animal");
        } else
            $scope.login();
    };

    $scope.initUserCtrl();

    $scope.isThisPageActive = function (pageName) {
        return $scope.page === pageName;
    };

    $scope.selectedPage = function (pageName) {
        $scope.page = pageName;
        // if we are in noti page, and someone change the db from mongo directly.
        // we will come back to animal page and the data won't be updated.
        // if we want he will be update we need to call : getUser (include inside the update)
        // if not, just updateCurrentAnimal
        //$scope.updateCurrentAnimal("first");

        $scope.user = $scope.getUser();
        $scope.newAnimalClicked = false;
        $location.path("/"+$scope.page);
    };

    $scope.checkSelectedAnimal = function(id) {
        //console.log("id= "+id);
        angular.forEach($scope.user.animals, function(animal) {
            if (animal._id == id) {
                $scope.currAnimal = animal;
            } 
        });
    };
    $scope.isThisAnimalActive = function(nowSelectedAnimalLink) {
        return $scope.currAnimal._id === nowSelectedAnimalLink;
    };

    $scope.moveToAddNewAnimalPage = function() {
        console.log("moveToAddNewAnimalPage");
        $scope.newAnimalClicked = true;
        $location.path("/new_animal");
    };

}]);

furrycareApp.controller('animalCtrl', ['$scope','$rootScope','$http','$cookies','$cookieStore','$window','$location',
                                                    function ($scope,$rootScope,$http,$cookies,$cookieStore,$window,$location) { 
    $scope.editname = false;
    $scope.editage = false;
    $scope.editweight = false;                       
    /* edit button of simple detail of current animal was clicked : name/age/weight */
    $scope.editDetailClicked = function(detail) {
        console.log(detail);

        if (detail === "animalName") {
            $scope.pre_name = $scope.currAnimal.animalName;
            $scope.editname = true;
            return;
        }
        if (detail === "animalAge") {
            $scope.pre_age = $scope.currAnimal.animalAge;
            $scope.editage = true;
            return;
        }
        if (detail === "animalWeight") {
            $scope.pre_weight = $scope.currAnimal.animalWeight;
            $scope.editweight = true;
            return;
        }
    };

    $scope.isInEditMode = function(detail) {
        if (detail === "animalName")
            return $scope.editname;
        if (detail === "animalAge") 
            return $scope.editage;
        if (detail === "animalWeight")
            return $scope.editweight;
    };
    /* done editing button of simple detail of current animal was clicked : name/age/weight */
    $scope.doneEditClicked = function(detail) {
        if (detail === "animalName") {
            $scope.editname = false;
            console.log("edit name: "+$scope.currAnimal.animalName);
            if ($scope.currAnimal.animalName !== $scope.pre_name) {
                console.log("new name.. need update in db.");
                // update in db
                $http.get('http://localhost:3000/setAnimalField?field='+detail+'&animalId='+$scope.currAnimal._id+
                    '&animalNewVal='+$scope.currAnimal.animalName)
                    .success(function (data){

                        $scope.$parent.user = data;
                });
            }
            else 
                console.log("no need to update in db.");
            return;
        }
        if (detail === "animalAge") {
            $scope.editage = false;
            console.log("edit age: "+$scope.currAnimal.animalAge);
            if ($scope.currAnimal.animalAge !== $scope.pre_age) {
                console.log("new age.. need update in db.");
                // update in db
                $http.get('http://localhost:3000/setAnimalField?field='+detail+'&animalId='+$scope.currAnimal._id+
                    '&animalNewVal='+$scope.currAnimal.animalAge)
                    .success(function (data){
                        $scope.$parent.user = data;
                });
            }
            else 
                console.log("no need to update in db.");
            return;
        }
        if (detail === "animalWeight") {
            $scope.editweight = false;
            console.log("edit weight: "+$scope.currAnimal.animalWeight);
            if ($scope.currAnimal.animalWeight !== $scope.pre_weight) {
                console.log("new weight.. need update in db.");
                // update in db
                 $http.get('http://localhost:3000/setAnimalField?field='+detail+'&animalId='+$scope.currAnimal._id+
                    '&animalNewVal='+$scope.currAnimal.animalWeight)
                    .success(function (data){
                        $scope.$parent.user = data;
                });
            }
            else 
                console.log("no need to update in db.");
            return;
        }
    };
    /* add animal button was clicked */
    $scope.addNewAnimal = function() {
        $scope.$parent.newAnimalClicked = false;
        console.log("name: "+ $scope.animal.animalName);
        console.log("age: "+ $scope.animal.animalAge);
        console.log("weight: "+ $scope.animal.animalWeight);
        $scope.animal.animalPic = "animal1.png";
        console.log("pic: "+ $scope.animal.animalPic);

        $http.get('http://localhost:3000/setNewAnimal?animalName='+$scope.animal.animalName+'&animalAge='+$scope.animal.animalAge
            +'&animalWeight='+$scope.animal.animalWeight+'&animalPic='+$scope.animal.animalPic)
            .success(function (data){
                console.log("set new animal successfully...");
                console.log(data); 
                // update user with the new animal
                $scope.$parent.user = data;
                $scope.$parent.updateCurrentAnimal("last"); 
                $location.path("/animal");
        });
    };
    /* delete the current animal from animals of the user */
    $scope.deleteAnimal = function() {
        console.log("delete animal name :"+$scope.currAnimal.animalName);
        $http.get('http://localhost:3000/deleteAnimal?animalId='+$scope.currAnimal._id)
            .success(function (data){
                $scope.$parent.user = data;
                console.log(data);
                console.log($scope.currAnimal.animalName);
                // update new current animal because last current animal was deleted.
                $scope.$parent.updateCurrentAnimal("first");
        });
    };

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
}]); 

furrycareApp.controller('notificationCtrl', function ($scope) {

/*
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
    };*/

});




