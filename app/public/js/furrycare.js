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
    /* reset all edit fields and opened scroll lists about current animal */
    $scope.resetEditFields = function() {
        $scope.currAnimal.editname = false;
        $scope.currAnimal.editage = false;
        $scope.currAnimal.editweight = false;
        $scope.currAnimal.vaccOpened = undefined;
        $scope.currAnimal.foodOpened = undefined;
        $scope.currAnimal.careOpened = undefined; 
    };
    $scope.updateCurrentAnimal = function(first_or_last) { 
        var len = $scope.user.animals.length;    
        if (len <= 1) {
            $scope.currAnimal = $scope.user.animals[0]; 
            return;
        }
        if (first_or_last === "first") // len > 1
            $scope.currAnimal = $scope.user.animals[0];
        else {
            console.log("on updateCurrentAnimal else... len is : "+len);
            $scope.currAnimal = $scope.user.animals[len-1];
        }
        $scope.resetEditFields();
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
        }
        /* else
            $scope.login(); */
    };

    $scope.initUserCtrl();
    
    $scope.isThisPageActive = function (pageName) {
        return $scope.page === pageName;
    };
    $scope.editWithoutDoneFixed = function() {
    /* the situation is that edit button pressed and maybe the field was changed,
        but the 'done' button wasn't pressed, so the change won't save to db.
        We want to return the previos name without refreshing the page so we do that. 
    */
        if ($scope.currAnimal.editname == true)
            $scope.currAnimal.animalName = $scope.currAnimal.pre_name;  
        if ($scope.currAnimal.editage == true)
            $scope.currAnimal.animalAge = $scope.currAnimal.pre_age;
        if ($scope.currAnimal.editweight == true)
            $scope.currAnimal.animalWeight = $scope.currAnimal.pre_weight;
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
        if (!$scope.newAnimalClicked) { // if we are not in new_animal page
            angular.forEach($scope.user.animals, function(animal) {
                if (animal._id == id) {
                    $scope.editWithoutDoneFixed();
                    $scope.currAnimal = animal;
                    $scope.resetEditFields();
                } 
            });
        }
    };
    $scope.isThisAnimalActive = function(nowSelectedAnimalLink) {
        if ($scope.newAnimalClicked)
            return false;
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

    console.log("from animalCtrl..");
    // this just for the first time..
    if (typeof $scope.$parent.currAnimal === 'undefined') {
        $scope.$parent.currAnimal = {
            editname : false,
            editage : false,
            editweight : false,
            vaccOpened : undefined,
            foodOpened : undefined,
            careOpened : undefined
        };
    }
    /* edit button of simple detail of current animal was clicked : name/age/weight */
    $scope.editDetailClicked = function(detail) {
        console.log(detail);

        if (detail === "animalName") {
            //console.log("curr animal name: "+$scope.currAnimal.animalName);
            $scope.$parent.currAnimal.pre_name = $scope.$parent.currAnimal.animalName;
            $scope.$parent.currAnimal.editname = true;
            return;
        }
        if (detail === "animalAge") {
            $scope.$parent.currAnimal.pre_age = $scope.$parent.currAnimal.animalAge;
            $scope.$parent.currAnimal.editage = true;
            return;
        }
        if (detail === "animalWeight") {
            $scope.$parent.currAnimal.pre_weight = $scope.$parent.currAnimal.animalWeight;
            $scope.$parent.currAnimal.editweight = true;
            return;
        }
    };

    $scope.isInEditMode = function(detail) {
        if (detail === "animalName")
            return $scope.$parent.currAnimal.editname;
        if (detail === "animalAge") 
            return $scope.$parent.currAnimal.editage;
        if (detail === "animalWeight")
            return $scope.$parent.currAnimal.editweight;
    };
    /* done editing button of simple detail of current animal was clicked : name/age/weight */
    $scope.doneEditClicked = function(detail) {
        var val,pre_val;
        if (detail === "animalName") {
            $scope.$parent.currAnimal.editname = false;
            val = $scope.$parent.currAnimal.animalName;
            pre_val = $scope.$parent.currAnimal.pre_name;
        }
        else if (detail === "animalAge") {
            $scope.$parent.currAnimal.editage = false;
            val = $scope.$parent.currAnimal.animalAge;
            pre_val = $scope.$parent.currAnimal.pre_age;
        } else if (detail === "animalWeight") {
            $scope.$parent.currAnimal.editweight = false;
            val = $scope.$parent.currAnimal.animalWeight;
            pre_val = $scope.$parent.currAnimal.pre_weight;
        }
        if (val !== pre_val) {
            console.log("doneEditClicked....");
            $http.get('http://localhost:3000/setAnimalField?field='+detail+'&animalId='+$scope.$parent.currAnimal._id+
                    '&animalNewVal='+rec)
                    .success(function (data){
                        $scope.$parent.user = data;
                });
        } else 
                console.log("no need to update in db.");
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
        console.log("delete animal name :"+$scope.$parent.currAnimal.animalName);
        $http.get('http://localhost:3000/deleteAnimal?animalId='+$scope.$parent.currAnimal._id)
            .success(function (data){
                $scope.$parent.user = data;
                console.log(data);
                console.log($scope.$parent.currAnimal.animalName);
                // update new current animal because last current animal was deleted.
                $scope.$parent.updateCurrentAnimal("first");
        });
    };

    $scope.openVaccList = function(item){
        if ($scope.isVaccOpen(item)){
            $scope.$parent.currAnimal.vaccOpened = undefined;
        } else {
            $scope.$parent.currAnimal.vaccOpened = item;
        }        
    };
    $scope.openFoodList = function(item){
        if ($scope.isFoodOpen(item)){
            $scope.$parent.currAnimal.foodOpened = undefined;
        } else {
            $scope.$parent.currAnimal.foodOpened = item;
        }        
    };
    $scope.openCareList = function(item){
        if ($scope.isCareOpen(item)){
            $scope.$parent.currAnimal.careOpened = undefined;
        } else {
            $scope.$parent.currAnimal.careOpened = item;
        }        
    };
    $scope.isVaccOpen = function(item){
        return $scope.$parent.currAnimal.vaccOpened === item;
    };
    $scope.isFoodOpen = function(item){
        return $scope.$parent.currAnimal.foodOpened === item;
    };
    $scope.isCareOpen = function(item){
        return $scope.$parent.currAnimal.careOpened === item;
    };
    $scope.vaccItemOpen = function() {
        return $scope.$parent.currAnimal.vaccOpened !== undefined;
    };
    $scope.foodItemOpen = function() {
        return $scope.$parent.currAnimal.foodOpened !== undefined;
    };
    $scope.careItemOpen = function() {
        return $scope.$parent.currAnimal.careOpened !== undefined;
    };
    $scope.closeVaccList = function() {
        $scope.$parent.currAnimal.vaccOpened = undefined;
    };
    $scope.closeFoodList = function() {
        $scope.$parent.currAnimal.foodOpened = undefined;
    };
    $scope.closeCareList = function() {
        $scope.$parent.currAnimal.careOpened = undefined;
    };
    $scope.isVaccListIsEmpty = function() {
        if ($scope.$parent.currAnimal.animalVaccination.length == 0)
            return true;
        return false;
    };
    $scope.isFoodListIsEmpty = function() {
        if ($scope.$parent.currAnimal.animalFood.length == 0)
            return true;
        return false;
    };
    $scope.isCareListIsEmpty = function() {
        if ($scope.$parent.currAnimal.animalCare.length == 0)
            return true;
        return false;
    };
   /* $scope.closeAllScrollLists = function() {
        $scope.vaccOpened = undefined;
        $scope.foodOpened = undefined;
        $scope.careOpened = undefined;
    };*/
    $scope.record = {
        recName : '',
        recReceivedDate : '',
        recExpiredDate : ''
    };
    $scope.createRec = function (type) {
        console.log("details of new :"+type+" : ");
        console.log($scope.$parent.currAnimal._id);
        console.log($scope.record.recName);
        console.log($scope.record.recReceivedDate);
        console.log($scope.record.recExpiredDate);
        $http.get('http://localhost:3000/createRec?recType='+type+'&currAnimalId='+$scope.$parent.currAnimal._id
            +'&recName='+$scope.record.recName+'&recReceivedDate='+new Date($scope.record.recReceivedDate)
            +'&recExpiredDate='+new Date($scope.record.recExpiredDate))
            .success(function (data){
                $scope.$parent.user = data;
                $scope.$parent.updateCurrentAnimal("first"); // maybe not first and send the number in the array :|
        }); 
    };

}]); 

furrycareApp.controller('notificationCtrl', function ($scope,$http) {
    $scope.noti = {
       notiName : '',
        receivedDate : '',
        expiredDate : ''
    };


    $scope.createNoti = function() {
        console.log("create notification to vaccination or to care.");
        // push the notification to db
        $http.get('http://localhost:3000/setNewAlarm?alarmName='+$scope.noti.notiName
            +'&alarmReceivedDate='+new Date($scope.noti.receivedDate)
            +'&alarmExpiredDate='+new Date($scope.noti.expiredDate))
            .success(function (data){
                $scope.$parent.user = data;
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
        $http.get('http://localhost:3000/setNewAlarm?alarmtype='+type+'&alarmname='+name+'&expdate='+dateToExp)
            .success(function (data){
                $scope.$parent.user = data;
        });
    };

});




