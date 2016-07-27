﻿wwt.controllers.controller('CurrentTourController', ['$scope', '$rootScope','Util', function($scope,$rootScope,util) {
    var tourEdit = $scope.tourEdit = wwtlib.WWTControl.singleton.tourEdit;
    var tour;
    $scope.init = function (curTour) {
        $rootScope.currentTour = $scope.tour = tour = tourEdit.get_tour();
        tourEdit.tourStopList.refreshCallback = mapStops;
        mapStops();
        //$rootScope.$on('escKey', function () {
            //$scope.$applyAsync(showTourSlides);
        //});
        $rootScope.$watch('editingTour', function () { });
        if (true){//util.isDebug) {
            showTourSlides();
        }
        $('#contextmenu,#popoutmenu').on('click', mapStops);
    };

    var showTourSlides = function () {
        $('#ribbon,.top-panel,.context-panel,.layer-manager').removeClass('hide').fadeIn(400);
        //tourEdit.pauseTour();
        $rootScope.tourPaused = true;
        $scope.escaped = true;
        //if (util.isDebug) {
            $rootScope.editingTour = true;
        //}
        setTimeout(function () {
            $rootScope.stopScroller = $('.scroller').jScrollPane({ scrollByY: 155, horizontalDragMinWidth: 155 });
        }, 200);
    };

    $scope.showContextMenu = function (index,e) {
        if (e) {
            tour.set_currentTourstopIndex(index);
            tourEdit.tourStopList_MouseClick(index, e);
            $scope.activeIndex = index;
        }
    };
    $scope.selectStop = function (index, e) {
        tour.set_currentTourstopIndex(index);
        $scope.activeIndex = index;
    };

    $scope.showStartCameraPosition = function (index) {
        tour.set_currentTourstopIndex(index);
        tourEdit.tourStopList_ShowStartPosition();
    };
    $scope.showEndCameraPosition = function (index) {
        tour.set_currentTourstopIndex(index);
        tourEdit.tourStopList_ShowEndPosition();
    };

    $scope.pauseTourEdit = function () {
        if (tourEdit.playing) {
            tourEdit.pauseTour();
        }
        else if ($scope.activeIndex) {
            tourEdit.playFromCurrentTourstop();
        } else {
            tourEdit.playNow(true);
        }
        $rootScope.tourPaused = !wwtlib.WWTControl.singleton.tourEdit.playing;
    };

    var mapStops = function () {
        $scope.$applyAsync(function () { 
            tour.duration = 0;
            $scope.tourStops = tour.get_tourStops().map(function (s) {
                s.description = s.get_description();
                s.thumb = s.get_thumbnail();
                s.duration = s.get_duration();
                s.secDuration = Math.round(s.duration / 1000);
                if (s.secDuration < 10) {
                    s.secDuration = '0' + s.secDuration;
                }
                s.secDuration = '0:' + s.secDuration;
                tour.duration += s.duration;

            //placeholder values until transition api is there
                s.atime = 2;
                s.btime = 2;
                s.holdtime = 4;

                s.transitionType = s.get__transition();

                return s;
            });
            tour.minuteDuration = Math.floor(tour.duration / 60000);
            tour.secDuration = Math.floor((tour.duration % 60000) / 1000);
            $scope.tour = tour;
            
           
        });
    }

    
}]);

    