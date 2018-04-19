component.component('mailingDetails', {
    templateUrl: "partials/mailing/mailing-details.html",
    controller: function ($location, $scope, $rootScope, $localStorage, notificationService, $filter, $uibModal, $http, $state, Mailing, vacancyStages, Person) {
        $scope.candidatesForMailing = $localStorage.get('candidatesForMailing')?JSON.parse($localStorage.get('candidatesForMailing')):[];
        let olderAvailableStep = $localStorage.get('stepClickable');
        let recipientsSource = JSON.parse($localStorage.get('mailingRecipientsSource'));
        $scope.newRecipient = {};
        $scope.editFromName = false;
        $scope.topic = '';
        $scope.allChecked = true;
        $scope.vacancy = {};
        let regForMailSplit = /[\s,;]+/;
        $scope.emptyEmails = {
            count: 0,
            translateType: 0,
            getTranslateType: function () {
                if(this.count !== 1) {
                    let remainder = this.count%10;
                    if(remainder > 1 && remainder < 5) {
                        return 1
                    } else {
                        return 2
                    }
                } else {
                    return 0
                }
            }
        };

        $scope.mailingDetails = Mailing.getMailingDetails();

        if($scope.mailingDetails) {
            $scope.topic = $scope.mailingDetails.subject;
            $scope.fromName = $scope.mailingDetails.fromName;
            $scope.fromMail = $scope.mailingDetails.fromMail;
        } else {
            $scope.fromName = $rootScope.me.fullName;
            $scope.fromMail = "";
            for(let i = $scope.candidatesForMailing.length - 1; i >= 0; i-- ) {
                if($scope.candidatesForMailing[i].candidateId.email)
                    $scope.candidatesForMailing[i].candidateId.email = $scope.candidatesForMailing[i].candidateId.email.split(regForMailSplit)[0];
                $scope.candidatesForMailing[i].mailing = true;
            }
        }
        //Set new params or get already set -- end


        $scope.checkAll = function () {
            if($scope.allChecked) {
                for(let i = $scope.candidatesForMailing.length - 1; i >= 0; i-- ) {
                    $scope.candidatesForMailing[i].mailing = true;
                }
            } else {
                for(let i = $scope.candidatesForMailing.length - 1; i >= 0; i-- ) {
                    $scope.candidatesForMailing[i].mailing = false;
                }
            }
        };


        $scope.saveCandidateContacts = function (candidate, newEmail, newName) {
            if(!candidate.localId) {
                notificationService.error('There is no candidate Id. This mailing is broken. Please, create new mailing');
                return
            }
            if(newName && newName.trim().length > 0) {
                if(Mailing.emailValidation(newEmail)) {
                    candidate.email = newEmail;
                    candidate.fullName = newName;
                    candidate.mailing = true;
                    editCandidate(candidate);
                } else {
                    notificationService.error($filter('translate')('wrong_email'));
                }
            } else {
                notificationService.error($filter('translate')('Please enter the name of the recipient'));
            }

        };


        $scope.cancelSavingCandidateContacts = function (localId) {
            hideEditInput(localId)
        };


        $scope.deleteCandidates = function (candidateObj) {
            $scope.candidateForDelete = candidateObj;
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/delete-candidates-from-mailing.html?1',
                size: '',
                scope: $scope,
                resolve: function(){
                }
            });
        };


        $scope.addRecipient = function () {
            if($scope.newRecipient) {
                let preparedCandidate = candidateTransform($scope.newRecipient);
                preparedCandidate.mailing = true;
                if(preparedCandidate) {
                    $scope.candidatesForMailing.unshift(preparedCandidate);
                    $localStorage.set('candidatesForMailing', $scope.candidatesForMailing);
                    $scope.modalInstance.close();
                } else {
                    console.log('preparedCandidate is:',preparedCandidate)
                }
            } else {
                console.log('$scope.newRecipient is:',$scope.newRecipient)
            }

            function candidateTransform(candidate) {
                let candidateTransformed = {
                    candidateId: {}
                };
                candidateTransformed.candidateId.localId = candidate.id;
                candidateTransformed.candidateId.firstName = candidate.text.split(' ')[0];
                candidateTransformed.candidateId.lastName = candidate.text.split(' ')[1]?candidate.text.split(' ')[1]:'';
                candidateTransformed.candidateId.fullName = candidate.text;
                if(candidate.contacts) {
                    candidate.contacts.some((contact) => {
                        if(contact.type == 'email') {
                            candidateTransformed.candidateId.email = contact.value;
                            return true
                        }
                    });
                }

                return candidateTransformed
            }

        };


        $scope.deleteCandidatesWithoutEmails = function () {
            _.remove($scope.candidatesForMailing, function (obj) {
                return (!obj.candidateId.email || obj.candidateId.email.trim().length === 0 );
            });
            $localStorage.set('candidatesForMailing', $scope.candidatesForMailing);
            $scope.emptyEmails.count = 0;
            if($scope.candidatesForMailing.length === 1) {
                notificationService.success($filter('translate')('Candidate removed'));
            } else {
                notificationService.success($filter('translate')('Candidates removed'));
            }
        };


        $scope.confirmDelete = function (candidateObj) {
            if($scope.candidatesForMailing.length > 1) {
                let beforeDeleting = angular.copy($scope.candidatesForMailing);
                _.remove($scope.candidatesForMailing, function (obj) {
                    return (obj.candidateId.localId == candidateObj.localId) && obj.candidateId.localId && obj.candidateId.localId;
                });
                $scope.modalInstance.close();
                $localStorage.set('candidatesForMailing', $scope.candidatesForMailing);
                Mailing.updateSubList(Mailing.getInternal(), $scope.candidatesForMailing).then((response) => {
                    notificationService.success($filter('translate')('deleted'));
                }, (error) => {
                    $scope.candidatesForMailing = angular.copy(beforeDeleting);
                    notificationService.error(error.message);
                });
            } else {
                notificationService.error($filter('translate')('Must be at least one recipient'));
            }
        };


        $scope.toTheEditor = function (toThePreview) {
            let notValid = false;
            $('.required').each(function () {
                let element = $(this);
                element.removeClass('empty');
                if(element[0].value.trim().length == 0) {
                    element.addClass('empty');
                    notValid = true;
                }
            });
            if(notValid) {
                $('html, body').animate({scrollTop: 0}, 500, 'easeOutQuart');
                notificationService.error($filter('translate')('You should fill all obligatory fields.'))
            } else {
                $localStorage.set('candidatesForMailing', $scope.candidatesForMailing);
                if($scope.candidatesForMailing && $scope.candidatesForMailing.length > 0) {
                    if($scope.candidatesForMailing.length > 1000) {
                        notificationService.error($filter('translate')('Count of recipients should be less than 1000'));
                        return
                    }
                    let sortedCandidates = Mailing.sortCandidatesList($scope.candidatesForMailing);
                    if(!sortedCandidates.isIncorrectEmails) {
                        if(!sortedCandidates.isDuplicatedEmails) {
                            if(!sortedCandidates.isChangesNotSaved) {
                                if(toThePreview) {
                                    Mailing.saveSubscribersList($scope.topic, Mailing.getInternal(), $scope.fromName, $scope.fromMail, $scope.candidatesForMailing, recipientsSource);
                                    Mailing.toThePreview();
                                } else {
                                    Mailing.saveSubscribersList($scope.topic, Mailing.getInternal(), $scope.fromName, $scope.fromMail, $scope.candidatesForMailing, recipientsSource, true);
                                }
                            } else {
                                $scope.changesNotSaved = true;
                                notificationService.error($filter('translate')('Please save the changes'))
                            }
                        } else {
                            $scope.candidatesForMailing = sortedCandidates.candidatesList;
                            notificationService.error($filter('translate')('Mailing duplicated emails'))
                        }
                    } else {
                        $scope.emptyEmails.count = sortedCandidates.emptyEmails;
                        $scope.emptyEmails.translateType = $scope.emptyEmails.getTranslateType();
                        $scope.candidatesForMailing = sortedCandidates.candidatesList;
                        notificationService.error($filter('translate')('Wrong emails'))
                    }

                } else {
                    notificationService.error($filter('translate')('Please pick the candidates'));
                }
            }
        };


        $scope.addRecipientModal = function () {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/mailing-add-recipient.html',
                size: '',
                scope: $scope,
                resolve: function(){

                }
            });
        };

        $scope.candidateCheckbox = function (candidate) {
            updateCheckboxState(candidate);
        };


        function toPreview() {
            $scope.toTheEditor(true);
        }


        function editCandidate(candidate) {
            hideEditInput(candidate.localId);
            updateContactsInLocalStorage(candidate);
            notificationService.success($filter('translate')('Changes are saved'));
        }


        function hideEditInput(localId) {
            $scope.candidatesForMailing.some(function (candidate) {
                if(candidate.candidateId.localId == localId) {
                    candidate.editable = false;
                    return true
                }
            });
        }


        function updateContactsInLocalStorage(candidate) {
            $scope.candidatesForMailing.some(function (obj) {
                if(obj.candidateId.localId == candidate.localId) {
                    obj.candidateId.fullName = candidate.fullName;
                    obj.candidateId.contacts = candidate.contacts;
                    if(obj.wrongEmail) {
                        delete obj.wrongEmail;
                        obj.mailing = candidate.mailing;
                    }
                    return true
                }
                return false
            });
            $localStorage.set('candidatesForMailing', $scope.candidatesForMailing);
        }


        function updateCheckboxState(candidate) {
            $scope.candidatesForMailing.some(function (obj) {
                if(obj.candidateId.localId == candidate.localId) {
                    obj.mailing = !obj.mailing;
                    return true
                }
                return false
            });
            $localStorage.set('candidatesForMailing', $scope.candidatesForMailing);
        }


        //Get custom stages for vacancyAutocompleter
        if(!$rootScope.customStages) {
            vacancyStages.get(function(resp){
                $rootScope.customStages = resp.object.interviewStates;
            });
        }

        $scope.closeModal = function() {
            $scope.modalInstance.close();
        };

        $scope.openMailingInfoModal = function() {
            if($rootScope.me && $rootScope.me.personParams.mailingNews === "true") {
                $scope.mailingModal();
            }
        };

        $scope.mailingModal = function() {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../partials/modal/mailingServiceInfo.html',
                size: '',
                scope: $scope,
                backdrop: 'static',
                resolve: function(){}
            });

            $scope.modalInstance.result.then(function () {
                if($rootScope.me && $rootScope.me.personParams.mailingNews === "true") {
                    Person.changeUserParam({
                        userId: $rootScope.me.userId,
                        name: 'mailingNews',
                        value: false
                    });
                }
            });
        };

        $scope.openMailingInfoModal();

        $('#step_1').unbind();
        $('#step_2').unbind().on('click',() => {
            $scope.toTheEditor();
            $rootScope.$$phase || $scope.$apply();
        });
        if(olderAvailableStep == 3) {
            $('#step_3').addClass('clickable').unbind().on('click', () => {
                toPreview();
                $rootScope.$$phase || $scope.$apply();
            });
        } else {
            $('#step_3').removeClass('clickable').unbind();
        }
    }
});