controller.controller('vacancySuggestionController', ["$rootScope", "$scope", "Vacancy", "$location",
    "$routeParams", "notificationService", "$filter", "$translate","vacancySuggestions","$uibModal",
    function($rootScope, $scope, Vacancy, $location, $routeParams, notificationService, $filter,
             $translate,vacancySuggestions,$uibModal) {
        $scope.candidates = [];
        $scope.vacancyEmptyRequiredFields = [];
        $scope.candidatesEmptyRequiredFields = [];
        $scope.suggestionTab = 'exactMatching';

        $scope.SuggestionsSortCriteria = 'scorePersent';
        $scope.reverseSort = true;

        $scope.$on('suggestions', function() {
            if(checkRequiredFieldsCompletion($scope.vacancy).invalid) {
                $scope.vacancyEmptyRequiredFields = checkRequiredFieldsCompletion($scope.vacancy).emptyFields;
                openSuggestionModal();
            } else {
                getSuggestions();
            }
        });

        $scope.closeModal = function(){
            $scope.modalInstance.close();
        };

        $scope.setSuggestionTab = function(tab) {
            $scope.suggestionTab = tab;
            if(tab === 'exactMatching') {
                $scope.suggestedCandidates = filterCandidatesByMatching($scope.candidates, true);
                console.log($scope.suggestedCandidates);
            } else {
                $scope.suggestedCandidates = filterCandidatesByMatching($scope.candidates, false);
                getCandidatesEmptyFields();
            }
        };

        $scope.saveVacancyFromSuggestion = function() {
            if(checkRequiredFieldsCompletion($scope.vacancy).invalid) {
                notificationService.error($filter('translate')('Fill all fields'));
                return;
            }
            vacancySuggestions.saveVacancy($scope.vacancy)
                .then(resp => {
                    if(resp.status === 'ok') {
                        notificationService.success($filter('translate')('vacancy_save_1') + $scope.vacancy.position + $filter('translate')('vacancy_save_2'));
                        $scope.closeModal();
                        getSuggestions();
                    } else {
                        notificationService.error(resp.message);
                    }
                }, error => notificationService.error(error));
        };

        $scope.saveCandidateFromSuggestions = function(candidate) {
            vacancySuggestions.addCandidateToVacancy({
                vacancyId: $scope.vacancy.vacancyId,
                position: $scope.vacancy.position,
                candidateId: candidate.candidateId,
                comment: "",
                interviewState: "longlist",
                date: null,
            }).then(resp => {
                $scope.suggestedCandidates[$scope.suggestedCandidates.indexOf(candidate)].adviceType = 'has';
                $scope.$apply();
                notificationService.success($filter('translate')('added_candidate'));
            }, error => {
                notificationService.error(error.message);
            });
        };

        $scope.sortCandidatesBy = function(head) {
            if(head !== $scope.SuggestionsSortCriteria) {
                $scope.SuggestionsSortCriteria = head;
                $scope.reverseSort = true;
            } else {
                $scope.reverseSort = !$scope.reverseSort;
            }
        };

        function getSuggestions() {
            $rootScope.loading = true;
            vacancySuggestions.getSuggestions({"vacancyId": $scope.vacancy.vacancyId})
                .then(resp => {
                    $scope.candidates = resp['objects'];
                    $scope.suggestedCandidates = filterCandidatesByMatching($scope.candidates, true);
                    $scope.suggestionTab = 'exactMatching';
                    $rootScope.loading = false;
                    $scope.$apply();
                });
        }

        function filterCandidatesByMatching(candidates, exactMatching) {
             return candidates.filter(candidate => {
                 return candidate.exactlyAppropriate === exactMatching;
             });
        }

        function getCandidatesEmptyFields() {
            const candidateRequiredFields = vacancySuggestions.getCandidateRequiredFields($scope.vacancy);
            $scope.suggestedCandidates.forEach(candidate => {
                candidate.emptyFields = checkRequiredFieldsCompletion(candidate, candidateRequiredFields).emptyFields;
                console.log(candidate.emptyFields);
            });
        }

        function checkRequiredFieldsCompletion(object, requiredFields = vacancySuggestions.getVacancyRequiredFields($scope.vacancy)) {
            let emptyFields = [];

            Object.keys(object).forEach(key => {
                requiredFields.forEach(field => {
                    if(key === field && !object[key] && object[key] !== 0) {
                        if(emptyFields.indexOf(key) === -1) {
                            emptyFields.push(key);
                        }
                    }
                    if(!object[field] && object[field] !== 0) {
                        if(emptyFields.indexOf(field) === -1) {
                            emptyFields.push(field);
                        }
                    }
                    if(key === 'region' && !object[key].city) {
                        if(emptyFields.indexOf(key) === -1) {
                            emptyFields.push(key);
                        }
                    }
                });
            });

            return { emptyFields: emptyFields, invalid: Boolean(emptyFields.length) };
        }

        function openSuggestionModal() {
            if($scope.vacancyEmptyRequiredFields.length) {
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/vacancy-suggestion-check-fields.html',
                    size: '',
                    scope: $scope
                });

                $scope.modalInstance.result.then(() => {
                    if(checkRequiredFieldsCompletion($scope.vacancy).invalid) $scope.$parent.VacanciesInfCandidTaskHistClientFunc('candidate');
                },() => {
                    if(checkRequiredFieldsCompletion($scope.vacancy).invalid) $scope.$parent.VacanciesInfCandidTaskHistClientFunc('candidate');
                });
            }
        }
    }
]);



