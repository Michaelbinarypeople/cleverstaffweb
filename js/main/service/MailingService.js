angular.module('services.mailing',[]
).factory('Mailing', [ 'serverAddress', '$location', '$resource', '$q', '$state', 'notificationService','$translate', '$filter', '$rootScope','$window','$localStorage', 'Vacancy',
    function (serverAddress, $location, $resource, $q, $state, notificationService, $translate, $filter, $rootScope, $window, $localStorage, Vacancy) {

    let service = $resource(serverAddress + '/:service/:action', {service: "compaign", action: "@action"}, {
        setList: {
            method: "POST",
            params: {
                action: "addSubscribersAndList"
            }
        },
        updateSubscriberList: {
            method: "POST",
            params: {
                action: "updateSubscriberList"
            }
        },
        createCompaign: {
            method: "POST",
            params: {
                action: "createCompaign"
            }
        },
        sandCompaign: {
            method: "GET",
            params: {
                action: "sandCompaign"
            }
        },
        updateCompaign: {
            method: "POST",
            params: {
                action: "updateCompaign"
            }
        },
        getAllCompaigns: {
            method: "POST",
            params: {
                action: "getAllCompaigns"
            }
        },
        getCompaign: {
            method: "GET",
            params: {
                action: "getCompaign"
            }
        },
        getSubscriberList: {
            method: "GET",
            params: {
                action: "getSubscriberList"
            }
        },
        sandTestCompaign: {
            method: "POST",
            params: {
                action: "sandTestCompaign"
            }
        },
        deleteCompaign: {
            method: "POST",
            params: {
                action: "deleteCompaign"
            }
        },
        getAnalytics: {
            method: "GET",
            params: {
                action: "getAnalytics"
            }
        },
        cloneMailing: {
            method: "POST",
            params: {
                action: "cloneCompaign"
            }
        },
        enableMailing : {
            method: "POST",
            params: {
                action: "enableMailing"
            }
        },
        getCompaignPriceForMailing : {
            method: "POST",
            params: {
                action: "getCompaignPrice"
            }
        }

    });

    service.getCurrentStep = function () {
        try {
            return JSON.parse($localStorage.get('currentStep')) || "mailing-details";
        } catch (err){
            console.log('Error in parse JSON service.currentStep', err);
            return "mailing-details";
        }
    };


    service.candidatesForMailing = [];
    service.listObject = {};
    service.savedCampaigns = {};
    service.internalName = '';


    service.updateInternal = function (internal) {
        service.internalName = internal;
    };


    service.getInternal = function () {
        return service.internalName;
    };


    service.setStep = function (step) {
        $localStorage.set('currentStep', JSON.stringify(step));
        $state.go(step);
    };


    service.getMailingDetails = function () {
        try {
            return JSON.parse($localStorage.get('subscriberListParams'));
        } catch (error) {
            console.log('getMailingDetails Error');
            return null;
        }
    };


    service.newMailing = function () {
        $localStorage.remove('mailingRecipientsSource');
        $localStorage.remove('candidatesForMailing');
        $localStorage.remove('subscriberListParams');
        $localStorage.remove('currentStep');
        $localStorage.remove('stepClickable');
        service.setStep("mailing-details");
        $location.url("/mailing");
    };


    service.showSentCompaignById = function (id) {
      service.getCompaign({"compaignId": id}, (resp) => {
          if(resp.status != 'error') {
              service.toSentPreview(resp.object);
          } else {
              notificationService.error(resp.message)
          }
      }, (error) => {
            notificationService.error(error.message)
      })
    };


    service.updateSubList = function (internal, candidates) {
        let paramsObject = {};
        let newListParams = {};
        paramsObject = subscriberListParamsPrepared(internal, candidates);
        let existedList = service.getMailingDetails();
        if(existedList && existedList.subscriberLists) {
            paramsObject.subscriberListId = existedList.subscriberLists[0].subscriberListId;
        }
        let recipientsSource = JSON.parse($localStorage.get('mailingRecipientsSource'));
        if(recipientsSource) {
            paramsObject.vacancyId = recipientsSource.vacancyId;
            paramsObject.vacancyName = recipientsSource.localId;
            paramsObject.stageId = recipientsSource.state;
            paramsObject.stageName = recipientsSource.stageName;
        }
        return $q((resolve, reject) => {
            if(paramsObject.subscriberListId && !existedList.compaignId) {
                service.updateSubscriberList(paramsObject, (resp) => {
                    if(resp.status != 'error') {
                        resolve(resp);
                    } else {
                        reject(resp);
                    }
                }, (error) => {
                    reject(error);
                })
            } else {
                service.setList(paramsObject, (resp) => {
                    if(resp.object && resp.object.subscriberListId) {
                        if(existedList) {
                            existedList.subscriberLists = [{subscriberListId: resp.object.subscriberListId}];
                            existedList.name = resp.object.name;
                            $localStorage.set('subscriberListParams', JSON.stringify(existedList));
                            service.saveMailing().then(result => {
                                    resolve('new list')
                                },
                                error => {
                                    reject('New subList save and compaign update error', error.message)
                                });
                        } else {
                            paramsObject.subscriberLists = [{subscriberListId: resp.object.subscriberListId}];
                            $localStorage.set('subscriberListParams', JSON.stringify(paramsObject));
                        }
                    }

                }, (error) => {
                    reject('New subList save error', error.message)
                })
            }
        });
    };

    
    function isFirstStepHasChanges(allParams) {
        let currentCandidatesList = [];
        allParams.candidates.forEach(candidate => {
            if(candidate.mailing) {
                currentCandidatesList.push({
                    email: candidate.candidateId.email,
                    firstName: candidate.candidateId.firstName,
                    lastName: candidate.candidateId.lastName,
                    localId: candidate.candidateId.localId
                });
            }
        });
        if(allParams.savedMailing) {
            if(!angular.equals(allParams.savedRecipientsSource, allParams.recipientsSource))
                return true;
            if(allParams.internalName !== allParams.savedMailing.internalName)
                return true;
            if(!angular.equals(allParams.savedMailing.subscribers,currentCandidatesList))
                return true;
            return false
        } else {
            return true
        }
    };


    service.saveSubscribersList = function (topic, internal, Name, Mail, candidates, savedRecipientsSource, goToEditor) {
        let savedMailing = JSON.parse($localStorage.get('subscriberListParams'));
        let mailingText = savedMailing&&savedMailing.text?savedMailing.text:'...';
        $rootScope.loading = true;
        let paramsObject = {};
        paramsObject = subscriberListParamsPrepared(topic, candidates);
        let existedList = service.getMailingDetails();
        let recipientsSource = JSON.parse($localStorage.get('mailingRecipientsSource'));
        if(recipientsSource) {
            paramsObject.vacancyId = recipientsSource.vacancyId;
            paramsObject.vacancyName = recipientsSource.localId;
            paramsObject.stageId = recipientsSource.state;
            paramsObject.stageName = recipientsSource.stageName;
        }
        if(existedList && existedList.subscriberLists && !existedList.compaignId) {
            paramsObject.subscriberListId = existedList.subscriberLists[0].subscriberListId;
            updateList();
        } else  {
            if(isFirstStepHasChanges({
                    internalName:internal,
                    candidates: candidates, 
                    savedMailing: savedMailing, 
                    savedRecipientsSource: savedRecipientsSource, 
                    recipientsSource: recipientsSource
            })) {
                saveNewList();
            } else {
                $rootScope.loading = false;
                if(goToEditor)
                    service.setStep('mailing-editor');
            }
        }
        function saveNewList() {
            service.setList(paramsObject, function (resp) {
                if(resp.object && resp.object.subscriberListId) {
                    paramsObject.fromName = Name;
                    paramsObject.fromMail = Mail;
                    paramsObject.subscriberLists = [{subscriberListId: resp.object.subscriberListId}];
                    paramsObject.subject = topic;
                    paramsObject.internalName = internal;
                    paramsObject.compaignId = existedList?existedList.compaignId:null;
                    $localStorage.set('subscriberListParams', JSON.stringify(paramsObject));
                    service.saveMailing(mailingText).then(
                        result => {
                            notificationService.success($filter('translate')('Changes are saved'));
                            if(goToEditor)
                                service.setStep('mailing-editor');
                        },
                        error => {
                            console.log('Error: /createCompaign ' + error.status + ' ' + error.statusText);
                        }
                    );
                } else {
                    if(resp.code == 'incorrectEmail') {
                        notificationService.error($filter('translate')('Candidate incorrect email'))
                    } else {
                        notificationService.error(resp.message)
                    }
                }
                $rootScope.loading = false;
            }, function (error) {
                $rootScope.loading = false;
                notificationService.error(error)
            });
        }
        function updateList() {
            service.updateSubscriberList(paramsObject, function (resp) {
                if(resp.object && resp.object.subscriberListId) {
                    existedList.subscribers = paramsObject.subscribers;
                    existedList.name = paramsObject.name;
                    existedList.fromName = Name;
                    existedList.fromMail = Mail;
                    existedList.subject = topic;
                    existedList.internalName = internal;
                    $localStorage.set('subscriberListParams', JSON.stringify(existedList));
                    service.saveMailing(mailingText).then(
                        result => {
                            notificationService.success($filter('translate')('Changes are saved'));
                            if(goToEditor)
                                service.setStep('mailing-editor');
                        },
                        error => {
                            console.log('Error: /createCompaign ' + error.status + ' ' + error.statusText);
                        }
                    );
                } else {
                    if(resp.code == 'incorrectEmail') {
                        notificationService.error($filter('translate')('Candidate incorrect email'))
                    } else {
                        notificationService.error(resp.message)
                    }
                }
                $rootScope.loading = false;
            }, function (error) {
                $rootScope.loading = false;
                notificationService.error(error)
            });
        }
    };


    service.saveTestSubscribersList = function (mail) {
        let params = {
            name: 'testList',
            subscribers: [{
                email: mail,
                firstName: "firstName",
                lastName: "lastName"
            }]
        };
        return new Promise((resolve, reject) => {
            service.setList(params, function (resp) {
                if(resp.object && resp.object.subscriberListId) {
                    resolve(resp.object.subscriberListId);
                } else {
                    reject(resp)
                }
            }, function (err) {
                reject(err);
                console.log('error in saveTestSubscribersList--setList', err);
            })
        });
    };


    service.toCreateMailing = function ($uibModal, $scope, candidates, mailingSource) {
        candidatesForMailing = [];
        delete $rootScope.VacancyStatusFiltered;
        $localStorage.remove('candidatesForMailing');
        $localStorage.remove('subscriberListParams');
        $localStorage.remove('currentStep');
        $localStorage.remove('stepClickable');
        $localStorage.set('mailingRecipientsSource', JSON.stringify(mailingSource));
        angular.forEach(candidates, function (candidate) {
            if(candidate.mailing) {
                candidatesForMailing.push(candidate);
            }
        });
        $scope.toTheMailing = function () {
            service.setStep("mailing-details");
            $localStorage.set('candidatesForMailing', candidatesForMailing);
            $location.url("/mailing");
        };
        if(candidatesForMailing.length != 0) {
            $scope.toTheMailing();
        } else {
            notificationService.error($filter('translate')('Please pick the candidates'));
        }
    };


    service.updateCompaignFromEditor = function (htmlText, topic, fromName, fromMail) {
        let newMailing = JSON.parse($localStorage.get('subscriberListParams'));
        let mailingForSend = {
            subject: topic,
            html: htmlText,
            fromName: fromName,
            fromEmail: fromMail,
            subscriberLists: newMailing.subscriberLists,
            compaignId: newMailing.compaignId,
            internalName: newMailing.internalName
        };
        newMailing.text = htmlText;
        newMailing.fromName = fromName;
        newMailing.fromMail = fromMail;
        newMailing.name = topic;
        newMailing.subject = topic;
        let recipientsSource = JSON.parse($localStorage.get('mailingRecipientsSource'));
        if(recipientsSource) {
            newMailing.vacancyId = recipientsSource.vacancyId;
            newMailing.vacancyName = recipientsSource.localId;
            newMailing.stageId = recipientsSource.state;
            newMailing.stageName = recipientsSource.stageName;
        }
        function saveNewList(resolve, reject) {
            service.setList({name: newMailing.name,
                subscribers: newMailing.subscribers,
                vacancyId: newMailing.vacancyId,
                vacancyName: newMailing.vacancyName,
                stageId: newMailing.stageId,
                stageName: newMailing.stageName
            }, function (resp) {
                if(resp.object && resp.object.subscriberListId) {
                    mailingForSend.subscriberLists = [{subscriberListId: resp.object.subscriberListId}];
                    $localStorage.set('subscriberListParams', JSON.stringify(newMailing));
                    if(mailingForSend.compaignId) {
                        service.updateCompaign(mailingForSend, function (res) {
                            if(res.status != 'error') {
                                resolve(res);
                            } else {
                                notificationService.error(res.message || res.status);
                                reject(res.status);
                            }
                        }, function (err) {
                            reject(err);
                        })
                    }
                } else {
                    if(resp.code == 'incorrectEmail') {
                        notificationService.error($filter('translate')('Candidate incorrect email'))
                    } else {
                        notificationService.error(resp.message)
                    }
                }
                $rootScope.loading = false;
            }, function (error) {
                $rootScope.loading = false;
                notificationService.error(error)
            });
        }
        return new Promise((resolve, reject) => {
            saveNewList(resolve,reject)
        });
    };


    service.saveMailing = function (text) {
        let newMailing = JSON.parse($localStorage.get('subscriberListParams'));
        let mailingForSend = {
            subject: newMailing.subject,
            internalName: newMailing.internalName,
            html: text || newMailing.text,
            fromName: newMailing.fromName,
            fromEmail: newMailing.fromMail,
            subscriberLists: newMailing.subscriberLists,
            compaignId: newMailing.compaignId
        };
        newMailing.text = text || newMailing.text;
        $localStorage.set('subscriberListParams', JSON.stringify(newMailing));
        return new Promise((resolve, reject) => {
            if(mailingForSend.compaignId) {
                service.updateCompaign(mailingForSend, function (res) {
                    if(res.status != 'error') {
                        resolve(res);
                    } else {
                        notificationService.error(res.message || res.status);
                        reject(res.status);
                    }
                }, function (err) {
                    reject(err);
                })
            } else {
                service.createCompaign(mailingForSend, function (res) {
                    if(res.status != 'error') {
                        newMailing.compaignId = res.object.compaignId;
                        $localStorage.set('subscriberListParams', JSON.stringify(newMailing));
                        resolve(res);
                    } else {
                        notificationService.error(res.message || res.status);
                        reject(res.status);
                    }
                }, function (err) {
                    reject(err);
                })
            }
        });
    };


    service.createTestCampaign = function (subscriberListId) {
        let newMailing = JSON.parse($localStorage.get('subscriberListParams'));
        let mailingForSend = {
            subject: newMailing.subject + ' -- TEST',
            html: newMailing.text,
            internalName: newMailing.internalName,
            fromName: newMailing.fromName,
            fromEmail: newMailing.fromMail,
            subscriberLists: [{subscriberListId: subscriberListId}]
        };
        return new Promise((resolve, reject) => {
            service.createCompaign(mailingForSend, function (res) {
                if(res.status != 'error') {
                    resolve(res.object.compaignId);
                } else {
                    notificationService.error(res.message || res.status);
                    reject(res.status);
                }
            }, function (err) {
                reject(err);
            })
        })
    };


    service.toThePreview = function (text) {
        let htmlText = '';
        if(text) {
            htmlText =  text ;
        } else {
            htmlText = service.getMailingDetails().text
        }
        if(text) {
            service.saveMailing(htmlText).then(
                result => {
                    service.setStep('mailing-preview');
                },
                error => {
                    service.setStep('mailing-preview');
                    console.log('Error: /createCompaign ' + error.status + ' ' + error.statusText);
                }
            )
        } else {
            service.setStep('mailing-preview');
        }
    };


    service.sendCampaign = function (campaignId) {
      let details = service.getMailingDetails();
      return $q((resolve, reject) => {
          if(details && details.compaignId) {
              service.sandCompaign({"compaignId": campaignId?campaignId:details.compaignId}, function (resp) {
                  if(resp.status != 'error') {
                      resolve(resp);
                      notificationService.success($filter('translate')('Mailing sent'))
                  } else {
                      reject(resp);
                      notificationService.error(resp.message);
                  }
              });
          } else {
              reject('no details.compaignId');
              notificationService.error('Nothing to send');
          }
      })
    };


    service.sendTestMail = function (testEmail) {
        let newMailing = JSON.parse($localStorage.get('subscriberListParams'));
        let requestData = {
            subscriberList: {
                name: 'testSubscriberListName',
                subscribers: [{
                    email: testEmail,
                    firstName: "firstName",
                    lastName: "lastName"
                }],
            },
            compaign: {
                subject: newMailing.subject,
                internalName: newMailing.internalName,
                html: newMailing.text,
                fromName: newMailing.fromName,
                fromEmail: newMailing.fromMail
            }
        };
        return $q((resolve, reject) => {
            service.sandTestCompaign(requestData, function (resp) {
                if(resp.status != 'error') {
                    notificationService.success($filter('translate')('Sent test email'));
                    resolve('ok');
                } else {
                    notificationService.error(resp.message);
                    reject(resp.message);
                }
            }, function (error) {
                notificationService.error('request Error');
                reject(error);
            });
        });
    };


    service.afterSending = function () {
        //$localStorage.remove('candidatesForMailing');
        //$localStorage.remove('subscriberListParams');
        //$localStorage.remove('currentStep');
        $location.url("/mailings");
        //$state.go('mailings-saved').then(() => $location.url("/mailings"));
    };


    service.makeStepClickable = function (step) {
        let currentStepProgress = $localStorage.get('stepClickable');
        if( !currentStepProgress || step > currentStepProgress) {
            $localStorage.set('stepClickable', step);
            currentStepProgress = step;
        }
        if( currentStepProgress > 2 ) {
          $('#step_3').addClass('clickable');
        }
    };


    service.toEditMailing = function (mailingForEdit) {
        let candidatesContacts = [];
        let candidatesForMailing = [];
        let subscriberListParams = {};
        let mailingName = '';
        let vacancySelectParam = {};
        let subListId = mailingForEdit.subscriberListIds[0];
        if(subListId) {
            service.getSubscriberList({
                subscriberListId: subListId
            }, function (resp) {
                if(resp.status != 'error') {
                    mailingName = resp.object.name;
                    vacancySelectParam = {
                        localId: resp.object.vacancyName,
                        vacancyId: resp.object.vacancyId,
                        state: resp.object.stageId,
                        stageName: resp.object.stageName
                    };
                    resp.object.subscribers.forEach((currentValue) => {
                        candidatesContacts.push(_.pick(currentValue, ['firstName', 'lastName', 'email', 'localId']))
                    });
                    candidatesContacts.forEach((currentValue) => {
                        currentValue.fullName = currentValue.firstName + ' ' + currentValue.lastName;
                        candidatesForMailing.push({
                            candidateId: currentValue,
                            mailing: true
                        })
                    });
                    subscriberListParams = {
                        subscribers: candidatesContacts,
                        name: mailingName,
                        fromName: mailingForEdit.fromName,
                        fromMail: mailingForEdit.fromEmail,
                        subscriberLists: [
                            {
                                subscriberListId: subListId
                            }
                        ],
                        subject: mailingForEdit.subject,
                        internalName: mailingForEdit.internalName,
                        text: mailingForEdit.html,
                        compaignId: mailingForEdit.compaignId
                    };
                    $localStorage.remove('mailingRecipientsSource');
                    $localStorage.set('mailingRecipientsSource', JSON.stringify(vacancySelectParam));
                    $localStorage.set('candidatesForMailing', candidatesForMailing);
                    $localStorage.set('subscriberListParams', subscriberListParams);
                    $localStorage.set('currentStep', JSON.stringify("mailing-details"));
                    $localStorage.set('stepClickable', 3);
                    $location.url('/mailing');
                }
            });
        } else {
            subscriberListParams = {
                fromName: mailingForEdit.fromName,
                fromMail: mailingForEdit.fromEmail,
                subject: mailingForEdit.subject,
                internalName: mailingForEdit.internalName,
                text: mailingForEdit.html,
                compaignId: mailingForEdit.compaignId
            };
            $localStorage.remove('mailingRecipientsSource');
            $localStorage.remove('candidatesForMailing');
            $localStorage.set('subscriberListParams', subscriberListParams);
            $localStorage.set('stepClickable', 2);
            $localStorage.set('currentStep', JSON.stringify("mailing-details"));
            $location.url('/mailing');
        }
    };


    service.toSentMailingFromHistory = function (mailingId) {
        service.getCompaign({"compaignId": mailingId}, resp => {
            if(resp.status != 'error') {
                service.toSentPreview(resp.object);
            } else {
                notificationService.error(resp.message)
            }
        }, error => {
            console.log('Error in toSentMailingFromHistory')
        })
    };


    service.toSentPreview = function (mailing) {
        let id = mailing.subscriberListIds?mailing.subscriberListIds[0]:mailing;
        let sentPreviewObj = {};
        let candidatesContacts = [];
        service.getSubscriberList({
            subscriberListId: id
        }, (resp) =>{
            if(resp.status != 'error') {
                resp.object.subscribers.forEach((currentValue) => {
                    candidatesContacts.push(_.pick(currentValue, ['firstName', 'lastName', 'email', 'localId']))
                });
                candidatesContacts.forEach((currentValue) => {
                    currentValue.fullName = currentValue.firstName + ' ' + currentValue.lastName;
                });
                sentPreviewObj = {
                    name: resp.object.name,
                    fromEmail: mailing.fromEmail,
                    fromName: mailing.fromName,
                    html: mailing.html,
                    sendDate: mailing.sendDate,
                    subject: mailing.subject,
                    internalName: mailing.internalName,
                    receivers: candidatesContacts,
                    compaignId: mailing.compaignId
                };

                $localStorage.set('sentMailing', JSON.stringify(sentPreviewObj));
                $location.url('/mailing-sent')
            } else {
                notificationService.error(resp.message)
            }
        },(error) => {
            notificationService.error(error.message);
        });
    };


    service.emailValidation = function (email) {
        let regForValidation =  /^[a-zA-Z0-9а-яёА-ЯЁ.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9а-яёА-ЯЁ](?:[a-zA-Z0-9а-яёА-ЯЁ.!#$%&'*+\/=?^_`{|}~-]{0,61}[a-zA-Z0-9а-яёА-ЯЁ])?(?:\.[a-zA-Z0-9а-яёА-ЯЁ](?:[a-zA-Z0-9а-яёА-ЯЁ]{0,61}[a-zA-Z0-9а-яёА-ЯЁ])?)*$/;
        return regForValidation.test(email)
    };


    function isSecondStepHasChanges(savedParams, currentParams) {
        for(propName in currentParams) {
            if(currentParams[propName] !== savedParams[propName])
                return true
        }
        return false
    };


    service.editorChangeStep = function (text, topic, fromName, fromMail, step) {
        let htmlText = text ;
        return $q((resolve,reject) => {
            let savedDetails = JSON.parse($localStorage.get('subscriberListParams'));
            if(isSecondStepHasChanges(savedDetails, {
                    text: text,
                    subject: topic,
                    fromName: fromName,
                    fromMail: fromMail
                })) {
                service.updateCompaignFromEditor(htmlText, topic, fromName, fromMail).then(
                    result => {
                        notificationService.success($filter('translate')('Changes are saved'));
                        resolve(result);
                        if(step == 'details') {
                            service.setStep('mailing-details');
                        } else {
                            if(step == 'preview')
                                service.setStep('mailing-preview');
                        }
                    },
                    error => {
                        reject(error);
                        console.log('Error: /service.editorToDetails ' + error.status + ' ' + error.statusText);
                    }
                )
            } else {
                resolve('no changes');
                if(step == 'details') {
                    service.setStep('mailing-details');
                } else {
                    if(step == 'preview')
                        service.setStep('mailing-preview');
                }
            }
        })
    };


    service.getVacancyParams = function (localId) {
        return new Promise((resolve, reject) => {
            Vacancy.one({localId: localId}, (result) => {
                if(result && result.status != 'error') {
                    resolve({
                        vacancyId: result.object.vacancyId,
                        position: result.object.position,
                        statuses: result.object.interviewStatus
                    });
                } else {
                    reject(result.message)
                }
            }, (error) => {
                reject(error.message)
            })
        });
    };


    service.getCompaignPrice = function(params) {
        return new Promise((resolve, reject) => {
            service.getCompaignPriceForMailing(params, resp => {
                if(resp.status === 'ok') {
                    resolve(resp);
                } else {
                    reject(resp);
                }
            }, error => reject(error));
        });
    };


    service.enableMailingService = function(params) {
        return new Promise((resolve, reject) => {
            service.enableMailing(params, resp => {
                if(resp.status === 'ok') {
                    resolve(resp);
                } else {
                    reject(resp);
                }
            });
        });
    };

    service.sortCandidatesList = function (candidatesList) {
        let incorrectEmails = false;
        //find not valid-----------------
        angular.forEach(candidatesList, (candidate)=>{
            if(candidate.mailing) {
                if(candidate.candidateId.email) {
                    if(!service.emailValidation(candidate.candidateId.email)) {
                        candidate.wrongEmail = true;
                        candidate.mailing = false;
                        incorrectEmails = true;
                    }
                } else {
                    candidate.wrongEmail = true;
                    candidate.mailing = false;
                    incorrectEmails = true;
                }
            }
        });
        //sort by name (for duplicates search) and validity-----------------
        candidatesList.sort((prev,next) => {
            if(prev.wrongEmail && !next.wrongEmail)
                return -1;
            if(!prev.wrongEmail && next.wrongEmail)
                return 1;
            if((prev.wrongEmail && next.wrongEmail) || (!prev.wrongEmail && !next.wrongEmail)) {
                if(prev.candidateId.email > next.candidateId.email)
                    return 1;
                if(prev.candidateId.email < next.candidateId.email)
                    return -1;
            }
        });
        let duplicateGroupId = 0;
        let duplicatedEmail = '';
        let duplicatesExist = false;
        //find duplicates-----------------
        for(let i = 0; i < candidatesList.length - 1; i++) {
            if(!candidatesList[i].wrongEmail) {
                if(candidatesList[i].candidateId.email == candidatesList[i + 1].candidateId.email) {
                    duplicatesExist = true;
                    if(duplicatedEmail !== candidatesList[i].candidateId.email)
                        duplicateGroupId++;
                    candidatesList[i+1].duplicateGroupId = candidatesList[i].duplicateGroupId = duplicateGroupId;
                    duplicatedEmail = candidatesList[i].candidateId.email;
                }
            }
        }
        console.log('candidatesList',candidatesList)
        //sort validity->duplicates->other -----------------
        candidatesList.sort((prev,next) => {
            if(prev.wrongEmail && !next.wrongEmail)
                return -1;
            if(!prev.wrongEmail && next.wrongEmail)
                return 1;
            //----
            if(prev.duplicateGroupId === undefined && next.duplicateGroupId !== undefined)
                return 1;
            if(prev.duplicateGroupId !== undefined && next.duplicateGroupId === undefined)
                return -1;
            return prev.duplicateGroupId - next.duplicateGroupId
        });
        return {
            candidatesList: candidatesList,
            isIncorrectEmails: incorrectEmails,
            isDuplicatedEmails: duplicatesExist
        }
    };

    function subscriberListParamsPrepared(internal, candidates) {
        let prepared = {
            name: internal,
            subscribers: []
        };
        candidates.forEach(function (o) {
            if(o.mailing) {
                let neededFields = {};
                neededFields.firstName = o.candidateId.fullName.split(' ')[0];
                neededFields.lastName = o.candidateId.fullName.split(' ')[1]?o.candidateId.fullName.split(' ')[1]:'';
                neededFields.email = o.candidateId.email;
                neededFields.localId = o.candidateId.localId;
                prepared.subscribers.push(neededFields);
            }
        });
        return prepared
    }


    return service;
}]);