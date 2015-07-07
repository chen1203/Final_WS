var furrycareApp = angular.module("furrycareApp",['ngCookies','ngRoute']);
furrycareApp.config(function($routeProvider){
      $routeProvider
          .when('/',{
                templateUrl: 'pages/login.html',
                controller: 'loginCtrl'
          })
          .when('/notification',{
                templateUrl: 'pages/notification.html',
                controller: 'notificationCtrl'
          })
          .when('/home',{
                templateUrl: 'pages/home.html',
                controller: 'FurryCtrl'
          })
          .when('/new_animal',{
                templateUrl: 'pages/new_animal.html',
                controller: 'animalCtrl'
          });
         /* .otherwise({
                redirectTo : 'pages/home'
          });*/          
});

furrycareApp.service('sharedProperties', function () {
        //var property = 'First';
        var property = 'First';

        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    });

furrycareApp.controller('loginCtrl',['$scope','$rootScope','$http','$cookies','$cookieStore','$window', 'sharedProperties',
                                                       function ($scope,$rootScope,$http,$cookies,$cookieStore,$window,sharedProperties) {       
                            
                                                       
                $rootScope.$broadcast('yes','wooowwwwww');
/*    $scope.editname = false;
    $scope.editage = false;
    $scope.editweight = false;                       */

    // checking of the user is allready connected (has a cookie)
    if (typeof $cookies.userMail !== 'undefined')
        window.location.href = "index.html#/home"; 
    else
        console.log("cookie: "+$cookies.userMail);

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
                    alert("There is no such email in the system. move to sign in.");
                    // delete history
                    window.location.href = "error.html"; // sign in ?
                } else {
                    console.log(data.email);
                    console.log(data.pass);
                    console.log($scope.user.pass);
                    if (data.pass === $scope.user.pass)  {
                         // delete history
                         //$cookies.put('userMail', data.email);                     
                         $cookies.userMail = data.email;
                         console.log("FROM LOGIN- COOKIE : "+$cookies.userMail);
                         window.location.href = "index.html#/home"; 
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
}]);

furrycareApp.controller('FurryCtrl', ['$scope','$rootScope','$http','$cookies','$cookieStore','$window','$location','sharedProperties',
                                                    function ($scope,$rootScope,$http,$cookies,$cookieStore,$window,$location,sharedProperties) {   
// https://final-ws-furrycare.herokuapp.com
    $scope.$on('yes',function(event, arg){
            $scope.receiver = arg;
            console.log(arg);
    });

    console.log("user mail from cookies: "+$cookies.userMail);

    $http.get('http://localhost:3000/getUser?userMail='+$cookies.userMail).success(function (data) {
           
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
        //console.log("id= "+id); 
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

    $scope.editClicked = function(detail) {
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
    }

    $scope.doneClicked = function(detail) {
        if (detail === "animalName") {
            $scope.editname = false;
            console.log("edit name: "+$scope.currAnimal.animalName);
            if ($scope.currAnimal.animalName !== $scope.pre_name) {
                console.log("new name.. need update in db.");
                // update in db
                $http.get('http://localhost:3000/setAnimalField?field='+detail+'&animalId='+$scope.currAnimal._id+
                    '&animalNewVal='+$scope.currAnimal.animalName)
                    .success(function (data){
                        $scope.user = data;
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
                        $scope.user = data;
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
                        $scope.user = data;
                });
            }
            else 
                console.log("no need to update in db.");
            return;
        }
    }

}]);

//furrycareApp.controller('NewAnimalCtrl', function ($scope,$http) {


//furrycareApp.controller('ListController', function ($scope) {
furrycareApp.controller('animalCtrl', function ($scope) {

 

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
                window.location.href = "index.html#/home"; 
                console.log("after redirect...");
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
});    

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
/*
furrycareApp.controller('ItemController', function ($scope) {

});
*/



