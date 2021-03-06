controller.controller('PublicCompanyController', ['$scope', '$rootScope', 'serverAddress', 'Service', 'Company',
    'notificationService', '$routeParams', '$window','$filter',
    function ($scope, $rootScope, serverAddress, Service, Company, notificationService, $routeParams, $window, $filter) {

        $scope.loaded = false;
        $scope.hideSearchPositions = true;
        $scope.hideSearchLocations = true;
        $scope.showFilterSettings = false;

        $scope.vacanciesLocation = null;
        $scope.vacanciesPosition = null;
        $scope.vacanciesPositionFiltered = null;

        $scope.errorHandler = {
          vacanciesFilter: {
              positionError: false,
              locationError: false,
              error: {
                  show: false,
                  msg: "No vacancies found"
              }
          }
        };

        let filteredVacancies = [],
            selectedPosition = null,
            selectedLocation = null;

        $('body').on(
            {
                mousedown: () => closeVacanciesFilterLists(event)
            }
        );


        $scope.toggleLocationSelect = function() {
            $scope.hideSearchLocations = !$scope.hideSearchLocations;
        };

        $scope.toggleFilter = function() {
          if($scope.showFilterSettings) {
              $scope.showFilter();
          } else {
              $scope.hideFilter();
          }
        };

        $scope.hideFilter = function() {
            $scope.showFilterSettings = false;
            $scope.errorHandler.vacanciesFilter.error.show = false;
            $scope.resetPosition();
            resetLocation();
        };

        $scope.showFilter = function() {
            $scope.showFilterSettings = true;
        };

        $scope.filter = function(vacancy) {
            let criteria = {};

            if(!selectedLocation || vacancy.region && vacancy.region.country.toLowerCase() === selectedLocation.toLowerCase()
                || $filter('translate')(selectedLocation) === $filter('translate')('Location')
                || $filter('translate')(selectedLocation) === $filter('translate')('Any')
                || (vacancy.employmentType === 'telework' && selectedLocation === $filter('translate')('telework_1')))  {
                criteria.location = true;
            }

            if(!selectedPosition || vacancy.position.toLowerCase() === selectedPosition.toLowerCase()
                || vacancy.position.toLowerCase().indexOf(selectedPosition.toLowerCase()) !== -1) {
                criteria.position = true;
            }

            if(criteria.position && criteria.location && filteredVacancies.indexOf(vacancy) === -1) filteredVacancies.push(vacancy);

            if(filteredVacancies.length === 0) {
                $scope.errorHandler.vacanciesFilter.error.show = true;
            } else {
                $scope.errorHandler.vacanciesFilter.error.show = false;
            }

            return criteria.position && criteria.location;
        };

        $scope.setAutoCompleteString = function(event) {
            if(event.keyCode === 13) return;
            $scope.vacanciesPositionFiltered = Company.positionAutoCompleteResult(event.target.value);

            if($scope.vacanciesPositionFiltered.length !== $scope.orgParams.objects.length) {
                checkAutoCompletePosition();
            } else {
                $scope.vacanciesPositionFiltered = [];
                $scope.hideSearchPositions = true;
                $scope.errorHandler.vacanciesFilter.positionError = false;
            }
        };

        $scope.selectPosition = function(position) {
            $('input.vacancy-position').val(position);
            $scope.vacanciesPositionFiltered = null;
            $scope.errorHandler.vacanciesFilter.positionError = false;
            $scope.hideSearchPositions = true;
        };

        $scope.selectLocation = function(location) {
          $('span.location').text(($filter)('translate')(location));
          $scope.hideSearchLocations = true;
        };

        $scope.showFilteredVacancies = function() {
          filteredVacancies = [];
          selectedLocation = $('.locations-wrap span.location').text();
          selectedPosition = $('.positions-wrap input.vacancy-position').val();
        };

        $scope.resetPosition = function() {
            $scope.hideSearchPositions = true;
            $scope.errorHandler.vacanciesFilter.positionError = false;
            $('.positions-wrap input.vacancy-position').val("");
            selectedPosition = null;
        };

        (function getAllVacancyForCompany(){
            let string = $routeParams.nameAlias.replace('-vacancies', '');
            Company.getAllOpenVacancies(string)
                .then((resp) => {
                    $scope.orgParams = resp;

                    $window.document.title = $scope.orgParams.orgName + ' ' + 'vacancies';
                    $scope.logoLink = '/hr/getlogo?id=' + $scope.orgParams.companyLogo + '';
                    $scope.serverAddress = serverAddress;

                    $scope.vacanciesLocation = Company.getVacanciesLocation();
                    $scope.vacanciesPosition = Company.getVacanciesPosition();
                    $scope.loaded = true;
                    $scope.$apply();
                }, (err) => {
                    console.error(err);
                });
        })();

        function checkAutoCompletePosition() {
            let inputPosition = $('.positions-wrap input.vacancy-position'),
                checked = false;

            $scope.vacanciesPosition.forEach((position) => {
                if(position.toLowerCase() === inputPosition.val().toLowerCase() || position.toLowerCase().indexOf(inputPosition.val().toLowerCase()) !== -1 ) {
                    checked = true;
                }
            });

            if(checked) {
                $scope.hideSearchPositions = false;
                $scope.errorHandler.vacanciesFilter.positionError = false;
            } else {
                $scope.hideSearchPositions = false;
                $scope.errorHandler.vacanciesFilter.positionError = true;
            }
        }

        function closeVacanciesFilterLists(e) {
            if(!$scope.hideSearchPositions && !$(e.target).hasClass('auto-complete-position')) {
                checkAutoCompletePosition();
                $scope.hideSearchPositions = true;
                $scope.vacanciesPositionFiltered = [];
                $scope.$apply();
            } else if(!$scope.hideSearchLocations && !$(e.target).hasClass('location-search')){
                $scope.hideSearchLocations = true;
                $scope.$apply();
            }
        }

        function resetLocation() {
            $('.locations-wrap span.location').text($filter('translate')('Location'));
            $scope.errorHandler.vacanciesFilter.locationError = false;
            selectedLocation = null;
        }

    }]
);
