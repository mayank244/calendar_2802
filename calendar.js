var app= angular.module("myApp", []);
app.controller("mycontroller",function($scope){
    $scope.day=moment();
});

app.controller("eventController", ['$scope',function($scope){
    var eventArray = [];
    $scope.eventAddvalue = function(selected_date, selected_month){
        $scope.expr=selected_date+selected_month;
        window.alert($scope.expr);
        localStorage.setItem('day_time',$scope.expr);
    };
    
    $scope.setEvent=function(data1,data2,data3,data4){
        $scope.expr2=localStorage.getItem('day_time');
        var newEvent={
          'eventDate':$scope.expr2,
          'eventName':data1,
          'eventDescr':data2,
          'eventTimeStart':data3,
        };
        eventArray.push(newEvent);
        window.alert(eventArray[0].eventDate);
        localStorage.setItem("eventdetails",JSON.stringify(eventArray));
      }
}])
app.directive("calendar",function(){
    return{
        restrict:"E",
        templateUrl : "calendar.html",
        scope : {
        selected: "="
    },
    eventClick:  function(event, jsEvent, view) {
        $('#modalTitle').html(event.title);
        $('#modalBody').html(event.description);
        $('#eventUrl').attr('href',event.url);
        $('#calendarModal').modal();
    },
        
    link: function(scope){
        scope.selected= _removeTime(scope.selected || moment());
        scope.month= scope.selected.clone();
        var start = scope.selected.clone();
        start.date(1);
        _removeTime(start.day(0));
        _buildMonth(scope,start,scope.month);
        
        scope.select = function(day){
            scope.selected = day.date;
        };
            
        scope.next = function(){
            var next = scope.month.clone();
            _removeTime(next.month(next.month()+1).date(1));
            scope.month.month(scope.month.month()+1);
            _buildMonth(scope, next, scope.month);
        }
        
        scope.previous = function(){
            var prev = scope.month.clone();
            _removeTime(prev.month(prev.month()-1).date(1));
            scope.month.month(scope.month.month()-1);
            _buildMonth(scope, prev, scope.month);
        };
        
        
    }
  };
    
    function _removeTime(date){
    return date.day(0).hour(0).minute(0).second(0).millisecond(0);
}

    function _buildMonth(scope, start, month){
        scope.weeks = [];
        var done = false;
        date = start.clone();
        monthIndex = date.month();
        count = 0;
        while(!done){
            scope.weeks.push({ days: _buildWeek(date.clone(),month)});
            date.add(1,"w");
            done = count++ >2 && monthIndex != date.month();
            monthIndex = date.month();
        }
    }
    function _buildWeek(date, month){
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
              
});