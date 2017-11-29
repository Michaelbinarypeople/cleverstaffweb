controller.controller('PublicCompanyController', ['$scope', '$rootScope', 'serverAddress', 'Service', 'Company',
    'notificationService', '$routeParams', '$window',
    function ($scope, $rootScope, serverAddress, Service, Company, notificationService, $routeParams, $window) {
        $scope.loaded = false;

        $scope.getAllVacancyForCompany = function(){
            var string = $routeParams.nameAlias.replace('-vacancies', '');
            Company.getAllOpenVacancies(string)
                .then((resp) => {
                    $scope.orgParams = resp;
                    $window.document.title = $scope.orgParams.orgName + ' ' + 'vacancies';
                    $scope.logoLink = '/hr/getlogo?id=' + $scope.orgParams.companyLogo + '';
                    $scope.serverAddress = serverAddress;
                    $scope.loaded = true;
                    $scope.$apply();
                }, (err) => {
                    console.error(err);
                });
        };


        $scope.getAllVacancyForCompany();
    }]
);
/*** Created by вик on 07.07.2016.*/
