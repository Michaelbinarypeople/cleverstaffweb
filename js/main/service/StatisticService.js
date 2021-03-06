 angular.module('services.statistic', [
    'ngResource'
]).factory('Statistic', ['$resource', 'serverAddress', function($resource, serverAddress) {
    var service = $resource(serverAddress + '/stat/:action', {action: "@action"}, {
        getOrgInfo: {
            method: "GET",
            params: {
                action: "getOrgInfo"
            }
        },
        getOrgInfoWithParams: {
            method: "POST",
            params: {
                action: "getOrgInfo"
            }
        },
        getSalesFunnel: {
            method: "POST",
            params: {
                action: "getSalesFunnel"
            }
        },
        getGroupActionInterviewForStateNew: {
            method: "POST",
            params: {
                action: "getGroupActionInterviewForStateNew"
            }
        },
        getVacancyInterviewDetalInfo: {
            method: "POST",
            params: {
                action: "getVacancyInterviewDetalInfo"
            }
        },
        getVacancyInterviewDetalInfoFile: {
            method: "POST",
            params: {
                action: "getVacancyInterviewDetalInfoFile"
            }
        },
        getDailyReport: {
            method: "POST",
            params: {
                action: "getDailyReport"
            }
        }
    });

    service.parameters = {};

    service.setParam = function (key, value) {
        if(key)
        service.parameters[key] = value;
    };

    service.getParam = function (key) {
        if(key)
            return service.parameters[key];
    };

    return service;
}]);
