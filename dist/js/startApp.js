
// Declare app level module which depends on filters, and services
var app = angular.module('RecruitingAppStart', [
    'ngRoute',
    'ngCookies',
    'RecruitingAppStart.filters',
    'services',
    'RecruitingAppStart.directives',
    'RecruitingAppStart.controllers',
    'ui.notify',
    'ui.tinymce',
    'ui.select2',
    'oi.file',
    'oi.list',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'pasvaz.bindonce',
    'uiGmapgoogle-maps',
    'ngMeta',
    'ui.bootstrap',
    'ngAnimate'
]).constant('serverAddress', '/hr').config(['$routeProvider', 'ngMetaProvider', function($routeProvider, ngMetaProvider) {
    $routeProvider
        .when('/confirmRegistration/finishReg/:personId/:key', {
            templateUrl: 'partials/start/finishreg.html',
            controller: 'ConfirmController',
            title: "Confirm |"
        })
        .when('/signup', {
            templateUrl: 'partials/start/invitereg.html',
            controller: 'SignupController',
            title: "Регистрация |"
        })
        .when('/pv/:vacancyId', {
            templateUrl: 'partials/public/vacancy.html',
            controller: 'PublicVacancyController',
            title: "Vacancy |"
        })
        .when('/vacancy-:vacancyId', {
            title: "Vacancy |",
            templateUrl: 'partials/public/vacancy.html',
            controller: 'PublicVacancyController',
            meta: {
                description: 'Vacancy in CleverStaff Recruitment Software'
            }
        })
        .when('/:nameAlias', {
            templateUrl: 'partials/public/company.html',
            controller: 'PublicCompanyController',
            title: "Company |",
            pageName: "Public vacancy for candidate",
            meta: {
                description: 'Vacancies in CleverStaff Recruitment Software'
            }
        })
        .when('/pass_the_test/:id', {
            templateUrl: 'partials/public/testCandidate.html',
            controller: 'PublicTestController',
            title: "Test |",
            pageName: "Public test candidate",
            meta: {
                description: 'Test in CleverStaff Recruitment Software'
            }
        })
        .when('/pc/:candidateId', {
            templateUrl: 'partials/public/candidate.html',
            controller: 'PublicCandidateController',
            title: "Candidate |"
        })
        .when('/duzhe_potribna_robota', {
            templateUrl: 'partials/public/vacancyAdd.html',
            controller: 'PublicVacancyAddController',
            title: "Форма додавання вакансії"
        })
        .when('/in/:id/:key', {
            templateUrl: 'partials/start/finishreg.html',
            controller: 'InController'
        })
        .when('/restore/:id/:key', {
            templateUrl: 'partials/start/restore_password.html',
            controller: 'RestorePasswordController',
            title: "CleverStaff |"
        })
        .when('/redirect', {
            templateUrl: "partials/start/finishreg.html",
            controller: 'test_redirect_controller',
            title: 'Redirect'
        })
        .otherwise({
            templateUrl: "404.html"
        });
}]).config(function($translateProvider,tmhDynamicLocaleProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'languange/locale-',
        suffix: '.json?b=15'
    });
    $translateProvider.translations('en');
    $translateProvider.translations('ru');
    $translateProvider.translations('ua');
    var userLang = navigator.language || navigator.userLanguage;
    var lST = userLang.substring(0, 2);
    if (lST == "ru" || lST == "be") {
        $translateProvider.preferredLanguage('ru');
    } else if (lST == "uk") {
        $translateProvider.preferredLanguage('ua');
    } else {
        $translateProvider.preferredLanguage('en');
    }
    $translateProvider.useLocalStorage();
    /************************************/
    tmhDynamicLocaleProvider.localeLocationPattern('lib/angular/i18n/angular-locale_{{locale}}.js');
    tmhDynamicLocaleProvider.useCookieStorage();
    /************************************/
}).run(['$location', '$rootScope', 'ngMeta', function($location, $rootScope, ngMeta) {
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        //$rootScope.title = current.$$route.title + " CleverStaff";
        $rootScope.activeController = current.$$route?current.$$route.controller:null;
    });
    ngMeta.init();
}]);


'use strict';

/* Controllers */

var controller = angular.module('RecruitingAppStart.controllers', []);

controller.controller('mainController' ,function($scope, $location, $window) {
    $scope.toSignUp = function() {
        $location.path("/registration/");
        $("#signUpButtonDiv").hide();
        $("#signInButtonDiv").show();
    };
    $scope.toSingIn = function() {
        $location.path('/');
        $("#signInButtonDiv").hide();
        $("#signUpButtonDiv").show();
    };
    $scope.toLanding = function() {
        $window.location.href = '/';
    };
})
    .controller('test_redirect_controller', function($location) {
        window.location.replace($location.$$protocol + "://" + $location.$$host)

    })
    .controller('ConfirmController', function($scope, $translate, $location, $routeParams, Person, notificationService, $window) {
        var lang = localStorage.getItem("NG_TRANSLATE_LANG_KEY") ? localStorage.getItem("NG_TRANSLATE_LANG_KEY") : "en";
        Person.finishReg({
            personId: $routeParams.personId,
            key: $routeParams.key,
            timeZoneOffset: new Date().getTimezoneOffset(),
            lang: lang
        }, function(resp) {
            if (resp.status && resp.status === 'error' && resp.message) {
                $("#confirmRegistrationFailReconfirmation").css('display', 'block');
                var userLang = localStorage.getItem("NG_TRANSLATE_LANG_KEY");

                if (userLang == "ru") {
                    $("#confirmRegistrationFailReconfirmation_ru").css('display', 'block');
                } else if (userLang == "ua") {
                    $("#confirmRegistrationFailReconfirmation_ua").css('display', 'block');
                } else {
                    $("#confirmRegistrationFailReconfirmation_en").css('display', 'block');
                }
            } else {
                notificationService.success("success");
                $window.location.replace('!#/organizer');
            }
        }, function(resp) {
            notificationService.error('Service is temporarily unavailable');
        });
    })
    .controller('InController', function($scope, $translate, $location, $routeParams, Person, notificationService, $window) {
        Person.getMe(function(resp) {
            if (resp.personId) {
                localStorage.setItem("link_redirect", window.location.hash);
                if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'ru'){
                    $window.location.replace('/ru/signin.html');
                }else{
                    $window.location.replace('/signin.html');
                }
            } else {
                $scope.in();
            }
        }, function(resp) {
            $scope.in();
        });

        $scope.in = function() {
            var lang = localStorage.getItem("NG_TRANSLATE_LANG_KEY") ? localStorage.getItem("NG_TRANSLATE_LANG_KEY") : "en";
            Person.in({
                personId: $routeParams.id,
                key: $routeParams.key,
                lang: lang,
                timeZoneOffset: new Date().getTimezoneOffset()
            }, function(resp) {
                if (resp.personId) {
                    $window.location.replace('/!#/organizer');
                } else {
                    $window.location.replace('/');
                }
            }, function(resp) {
                $window.location.replace('/');
            });
        }
    })
    .controller('RestorePasswordController', function($scope, $rootScope, $filter, $translate, $location, $routeParams, Person, notificationService, $window) {
        Person.checkKey({name: "forgotPasswordKey", id: $routeParams.id, key: $routeParams.key}, function(resp){
            if (resp && resp.status == "ok") {
                $scope.showRestoreForm = true;
            } else if (resp && resp.status == "error") {
                $scope.showRestoreForm = false;
            }
        }, function (resp) {
            $location.path("/");
        });
        //$rootScope.title = $filter('translate')('Change Password') + " | CleverStaff";
        var messages = {
            enter_password: "Пожалуйста введите пароль",
            wrong1_password: "Пароль должен содержать только цифры и латинские буквы",
            wrong2_password: "Пароль должен содержать хотя бы одну латинскую букву",
            wrong3_password: "Пароль должен содержать хотя бы одну цифру",
            wrong4_password: "Пароль должен быть длиной 8-30 символов",
            wrong_password2: "Пароль не совпадает с предыдущим"
        };
        $.fn.form.settings.rules.password1 = function(value) {
            var password1 = /^[a-zA-Z0-9]{0,99}$/;
            return password1.test(value);
        };
        $.fn.form.settings.rules.password2 = function(value) {
            var password2 = /.*[a-zA-Z].*/;
            return password2.test(value);
        };
        $.fn.form.settings.rules.password3 = function(value) {
            var password3 = /.*\d.*/;
            return password3.test(value);
        };
        $.fn.form.settings.rules.password4 = function(value) {
            return (value.length > 7 && value.length < 31);
        };
        $.fn.serializeObject = function() {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };
        //var rules = {
        //    password: {
        //        identifier: 'password',
        //        rules: [
        //            {
        //                type: 'empty',
        //                prompt: $filter('translate')('Please enter your password')
        //            },
        //            {
        //                type: 'password1',
        //                prompt: $filter('translate')('Password should contain only numbers and latin letters')
        //            },
        //            {
        //                type: 'password2',
        //                prompt: $filter('translate')('Password should contain at least one latin letter')
        //            },
        //            {
        //                type: 'password3',
        //                prompt: $filter('translate')('Password should contain at least one number')
        //            },
        //            {
        //                type: 'password4',
        //                prompt: $filter('translate')('Password must be 8-30 characters long')
        //            }
        //        ]
        //    },
        //    password2: {
        //        identifier: 'password2',
        //        rules: [
        //            {
        //                type: 'match[password]',
        //                prompt: $filter('translate')("The password doesn't match to previous")
        //            }
        //        ]
        //    }
        //};
        //var events = {
        //    inline: true,
        //    on: 'blur',
        //    onSuccess: restoreForm
        //};
        //$('#signup').form(rules, events);
        //
        //function restoreForm() {
        //}
        //
        //$("form").submit(function() {
        //    return false;
        //});

        $scope.resetError = function(){
            $('#password').removeClass('error');
            $scope.showError = false;
        };
        $scope.restore = function() {
            $scope.resetError();
            var password1 = /^[a-zA-Z0-9!,.?%$#@*_\-+=\\|/[\]{}()]{8,30}$/;
            var password2 = /.*[a-zA-Z].*/;
            var password3 = /.*\d.*/;
            var checkpassword1 = password1.test($scope.password);
            var checkpassword2 = password2.test($scope.password);
            var checkpassword3 = password3.test($scope.password);
            if($scope.password){
                var checkpassword4 = $scope.password.length > 7 && $scope.password.length < 31;
            }
            if ($scope.password == $scope.password2 && $scope.restoreForm.$valid) {
                Person.changePasswordByKey({
                    personId: $routeParams.id,
                    key: $routeParams.key,
                    newPass: $scope.password,
                    lang: $translate.use()
                }, function(resp) {
                    if (resp.personId) {
                        $window.location.replace('!#/organizer');
                    } else {
                        if (resp.message) {
                            if (resp.message.trim() == 'Incorrect confirm key' || resp.message.trim() == 'Неверный код подтверждения' || resp.message.trim() == 'Неправильний код підтвердження') {
                                notificationService.error($filter('translate')('You have already changed the password on this special link. For safety reasons it can not be done enough on this link. Please ask for a password reset again on') + "   <a href=\"https://cleverstaff.net?q=restore\">https://cleverstaff.net?q=restore</a>");
                            } else {
                                notificationService.error(resp.message);
                            }

                        }
                    }
                }, function(resp) {
                    if (resp.message) {
                        notificationService.error(resp.message);
                    }

                });
            }else{
                if($scope.password){
                    if($scope.password.length == 0){
                        notificationService.error($filter('translate')('enter_password'));
                        $scope.showError = true;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorEnterNumber = false;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $('#password').addClass('error');
                    }
                    if(!checkpassword3 && !checkpassword4){
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterNumberCharacters = true;
                        $scope.showErrorEnterNumber = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword2 && !checkpassword4){
                        console.log(!checkpassword2);
                        console.log(!checkpassword4);
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterLatinCharacters = true;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword1 && !checkpassword4){
                        console.log(!checkpassword1);
                        console.log(!checkpassword4);
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterCharacters = true;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword2){
                        $('#password').addClass('error');
                        $scope.errorMessage = $filter('translate')('Password should contain at least one latin letter');
                        console.log('qwerty');
                        $scope.showError = true;
                        $scope.showErrorEnterLatin = true;
                        $scope.showErrorEnterNumber = false;
                        $scope.showErrorEnterCharacters = false;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword3){
                        $scope.errorMessage = $filter('translate')('Password should contain at least one number');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterNumber = true;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterCharacters = false;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword4){
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword1){
                        $scope.errorMessage = $filter('translate')('Password should contain only numbers and latin letters, allowed characters: !,.?%$#@*_-+=\\|/[]{}()');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        return false;
                    }
                    if($scope.password.length > 0){
                        $scope.showErrorGoodSuccess = true;
                    }
                }else{
                    notificationService.error($filter('translate')('enter_password'));
                    $scope.showError = true;
                    $scope.showErrorGoodSuccess = false;
                    $scope.showErrorEnterPassword = false;
                    $scope.showErrorEnterNumber = false;
                    $scope.showErrorEnterLatin = false;
                    $scope.showErrorEnterNumberCharacters = false;
                    $scope.showErrorEnterLatinCharacters = false;
                    $('#password').addClass('error');
                }
                if($scope.password != $scope.password2){
                    notificationService.error($filter('translate')('wrong_password2'));
                    $scope.showErrorEnterPassword = false;
                    $scope.showErrorEnterNumber = false;
                    $scope.showErrorEnterCharacters = false;
                    $scope.showErrorEnterLatin = false;
                    $scope.showErrorEnterNumberCharacters = false;
                    $scope.showErrorEnterLatinCharacters = false;
                    //$scope.showErrorGoodSuccess = true;
                }else{
                    console.log('form is not valid')
                }
            }
        }
    })
    .controller('SignupController', function($scope, $rootScope, $filter, $location, $translate, $cookies, Person, notificationService, $window) {
        $rootScope.title = $filter('translate')('Sign Up') + " | CleverStaff";
        $scope.checkPrivacyOrTerms = false;
        $("#signUpButtonDiv").hide();
        $("#signInButtonDiv").show();
        $scope.key = $location.search().key;
        $scope.registration = {};
        Person.inviteInfo({inviteKey: $scope.key}, function(resp) {
            if (false) {
                $rootScope.inviteState = resp.code;
                $scope.redirectToSigning = function () {
                    if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'ru'){
                        $window.location.replace('/ru/signin.html');
                    }else{
                        $window.location.replace('/signin.html');
                    }
                };
            } else {
                $scope.info = resp;
                $scope.registration.login = $scope.info.email;
                $scope.registration.orgName = $scope.info.orgName;
                $scope.registration.inviteKey = $scope.key;
                $scope.registration.inviter = $scope.info.inviter;
                $scope.registration.role = $scope.info.role;
                $rootScope.inviteState = 'activeInvite';
            }
        }, function(resp) {
            $location.path("/");
            notificationService.error('Service is temporarily unavailable');
        });
        $scope.resetError = function(){
            $('#firstName').removeClass('error');
            $('#password').removeClass('error');
            $scope.showError = false;
        };
        $scope.ngClickRegistration = function() {
            $scope.resetError();
            var password1 = /^[a-zA-Z0-9!,.?%$#@*_\-+=\\|/[\]{}()]{8,30}$/;
            var password2 = /.*[a-zA-Z].*/;
            var password3 = /.*\d.*/;
            var checkpassword1 = password1.test($scope.password);
            var checkpassword2 = password2.test($scope.password);
            var checkpassword3 = password3.test($scope.password);
            if($scope.password){
                var checkpassword4 = $scope.password.length > 7 && $scope.password.length < 31;
            }
            if ($scope.password == $scope.password2 && $scope.registration.firstName && $scope.registration.phone && $scope.registrationForm.$valid  && (checkpassword1 && checkpassword2 && checkpassword3 && checkpassword4)) {
                $scope.registration.password = $scope.password;


                if($scope.registration.phone == null){
                    $scope.registration.phone = +$('.select2-selection__rendered')[0].title.replace(/[A-z]/g, "").replace(/\(*\)*\+*\.*\s*/g,"").replace(/,/g,"") + $scope.registration.phone;
                }else{
                    $scope.registration.phone = +$("#countryCustom").text(localStorage.getItem('phone').replace(/-/g,"") + $scope.registration.phone)[0].textContent;
                }
                if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'ru'){
                    $scope.registration.lang = 'ru';
                }else{
                    $scope.registration.lang = 'en';
                }

                if(!$scope.checkPrivacyOrTerms){
                    notificationService.error($filter('translate')('Please read and accept the Privacy Policy and the Terms and Conditions'));
                    return
                }

                $rootScope.loading = true;
                Person.joinInvited($scope.registration, function(resp) {
                    if (resp.status && resp.status === 'error' && resp.message) {
                        $rootScope.loading = false;
                        notificationService.error(resp.message);
                    } else {
                        Person.authorization({
                            login: $scope.registration.login,
                            password: $scope.registration.password,
                            lang: $translate.use(),
                            timeZoneOffset: new Date().getTimezoneOffset()
                        }, function(resp) {
                            $rootScope.loading = false;
                            if (resp.object.personId) {
                                localStorage.removeItem('phone');
                                $window.location.replace('!#/organizer');
                            } else {
                                if (resp.message) {
                                    if (resp.message.trim() == 'Incorrect confirm key' || resp.message.trim() == 'Неверный код подтверждения' || resp.message.trim() == 'Неправильний код підтвердження') {
                                        notificationService.error($filter('translate')('You have already changed the password on this special link. For safety reasons it can not be done enough on this link. Please ask for a password reset again on') + "   <a href=\"https://cleverstaff.net?q=restore\">https://cleverstaff.net?q=restore</a>");
                                    } else {
                                        notificationService.error(resp.message);
                                    }

                                }
                            }
                        }, function(resp) {
                            $rootScope.loading = false;
                            if (resp.message) {
                                notificationService.error(resp.message);
                            }

                        });
                    }
                })
            }else{
                if ($scope.registration.firstName){
                    if ($scope.registration.firstName.length == 0){
                        $scope.errorMessage = $filter('translate')('wrong_name');
                        $scope.showErrorName = true;
                        $scope.showError = false;
                        $scope.showErrorPhone = false;
                        $('#firstName').addClass('error');
                        return false;
                    }
                }else{
                    $scope.errorMessage = $filter('translate')('wrong_name');
                    $scope.showErrorName = true;
                    $scope.showError = false;
                    $scope.showErrorPhone = false;
                    $('#firstName').addClass('error');
                    return false;
                }
                if ($scope.registration.phone){
                    $('#phone').removeClass('error');
                    if ($scope.registration.phone.length == 0){
                        $scope.errorMessage = $filter('translate')('enter_phone');
                        $scope.showErrorPhone = true;
                        $scope.showErrorName = false;
                        $scope.showError = false;
                        $('#phone').addClass('error');
                        return false;
                    }
                }else{
                    if ($('input[name=phone]').val().length > 15){
                        $scope.errorMessage = $filter('translate')('enter_phone_length');
                        $scope.showErrorPhone = true;
                        $scope.showErrorName = false;
                        $scope.showError = false;
                        $('#phone').addClass('error');
                        return false;
                    }
                    $scope.errorMessage = $filter('translate')('enter_phone');
                    $scope.showErrorPhone = true;
                    $scope.showErrorName = false;
                    $scope.showError = false;
                    $('#phone').addClass('error');
                    return false;
                }
                if($scope.password){
                    if($scope.password.length == 0){
                        $scope.errorMessage = $filter('translate')('enter_password');
                        $scope.showError = true;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $('#password').addClass('error');
                        return false;
                    }
                    if(!checkpassword3 && !checkpassword4){
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterNumberCharacters = true;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    } else if(!checkpassword1 && !checkpassword4){
                        console.log(!checkpassword1);
                        console.log(!checkpassword4);
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterLatinCharacters = true;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    }else if(!checkpassword2){
                        $('#password').addClass('error');
                        $scope.errorMessage = $filter('translate')('Password should contain at least one latin letter');
                        $scope.showError = true;
                        $scope.showErrorEnterLatin = true;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    } else if(!checkpassword3){
                        $scope.errorMessage = $filter('translate')('Password should contain at least one number');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterNumber = true;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    } else if(!checkpassword4){
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    } else if(!checkpassword1){
                        $scope.errorMessage = $filter('translate')('Password should contain only numbers and latin letters, allowed characters: !,.?%$#@*_-+=\\|/[]{}()');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    }
                }else{
                    $scope.errorMessage = $filter('translate')('enter_password');
                    $scope.showError = true;
                    $scope.showErrorEnterPassword = true;
                    $scope.showErrorGoodSuccess = false;
                    $scope.showErrorName = false;
                    $scope.showErrorPhone = false;
                    $('#password').addClass('error');
                    return false;
                }
                if($scope.password != $scope.password2){
                    notificationService.error($filter('translate')('wrong_password2'));
                    $scope.showErrorEnterPassword = false;
                    $scope.showErrorEnterNumber = false;
                    $scope.showErrorEnterLatin = false;
                    $scope.showErrorEnterNumberCharacters = false;
                    $scope.showErrorEnterLatinCharacters = false;
                    $scope.showErrorGoodSuccess = true;
                    $('#password2').addClass('error');
                    return false;
                }else{
                    console.log('form is not valid')
                }
            }
        };

        setTimeout(function(){
            var isoCountries = [
                { id: 'AF', text: 'Afghanistan (+93)', value: '+93'},
                { id: 'AX', text: 'Aland Islands (+358)', value: '+358'},
                { id: 'AL', text: 'Albania (+355)', value: '+355'},
                { id: 'DZ', text: 'Algeria (+213)', value: '+213'},
                { id: 'AS', text: 'American Samoa (+1)', value: '+1'},
                { id: 'AD', text: 'Andorra (+376)', value: '+376'},
                { id: 'AO', text: 'Angola (+244)', value: '+244'},
                { id: 'AI', text: 'Anguilla (+1264)', value: '+1264'},
                { id: 'AQ', text: 'Antarctica (+672)', value: '+672'},
                { id: 'AG', text: 'Antigua And Barbuda (+1268)', value: '+1268'},
                { id: 'AR', text: 'Argentina (+54)', value: '+54'},
                { id: 'AM', text: 'Armenia (+374)', value: '+374'},
                { id: 'AW', text: 'Aruba (+297)', value: '+297'},
                { id: 'AU', text: 'Australia (+61)', value: '+61'},
                { id: 'AT', text: 'Austria (+43)', value: '+43'},
                { id: 'AZ', text: 'Azerbaijan (+994)', value: '+994'},
                { id: 'BS', text: 'Bahamas (+1242)', value: '+1242'},
                { id: 'BH', text: 'Bahrain (+973)', value: '+973'},
                { id: 'BD', text: 'Bangladesh (+880)', value: '+880'},
                { id: 'BB', text: 'Barbados (+1246)', value: '+1246'},
                { id: 'BY', text: 'Belarus (+375)', value: '+375'},
                { id: 'BE', text: 'Belgium (+32)', value: '+32'},
                { id: 'BZ', text: 'Belize (+501)', value: '+501'},
                { id: 'BJ', text: 'Benin (+229)', value: '+229'},
                { id: 'BM', text: 'Bermuda (+1441)', value: '+1441'},
                { id: 'BT', text: 'Bhutan (+975)', value: '+975'},
                { id: 'BO', text: 'Bolivia (+591)', value: '+591'},
                { id: 'BA', text: 'Bosnia And Herzegovina (+387)', value: '+387'},
                { id: 'BW', text: 'Botswana (+267)', value: '+267'},
                { id: 'BV', text: 'Bouvet Island (+47)', value: '+47'},
                { id: 'BR', text: 'Brazil (+55)', value: '+55'},
                { id: 'IO', text: 'British Indian Ocean Territory (+246)', value: '+246'},
                { id: 'BN', text: 'Brunei Darussalam (+673)', value: '+673'},
                { id: 'BG', text: 'Bulgaria (+359)', value: '+359'},
                { id: 'BF', text: 'Burkina Faso (+226)', value: '+226'},
                { id: 'BI', text: 'Burundi (+257)', value: '+257'},
                { id: 'KH', text: 'Cambodia (+855)', value: '+855'},
                { id: 'CM', text: 'Cameroon (+237)', value: '+237'},
                { id: 'CA', text: 'Canada (+1)', value: '+1'},
                { id: 'CV', text: 'Cape Verde Islands (+238)', value: '+238'},
                { id: 'KY', text: 'Cayman Islands (+1345)', value: '+1345'},
                { id: 'CF', text: 'Central African Republic (+236)', value: '+236'},
                { id: 'TD', text: 'Chad (+235)', value: '+235'},
                { id: 'CL', text: 'Chile (+56)', value: '+56'},
                { id: 'CN', text: 'China (+86)', value: '+86'},
                { id: 'CX', text: 'Christmas Island (+672)', value: '+672'},
                { id: 'CC', text: 'Cocos (Keeling) Islands (+225)', value: '+225'},
                { id: 'CO', text: 'Colombia (+57)', value: '+57'},
                { id: 'KM', text: 'Comoros (+269)', value: '+269'},
                { id: 'CG', text: 'Congo (+242)', value: '+242'},
                { id: 'CD', text: 'Congo, Democratic Republic (+243)', value: '+243'},
                { id: 'CK', text: 'Cook Islands (+682)', value: '+682'},
                { id: 'CR', text: 'Costa Rica (+506)', value: '+506'},
                { id: 'CI', text: 'Cote D\'Ivoire (+225)', value: '+225'},
                { id: 'HR', text: 'Croatia (+385)', value: '+385'},
                { id: 'CU', text: 'Cuba (+53)', value: '+53'},
                { id: 'CY', text: 'Cyprus (+90)', value: '+90'},
                { id: 'CZ', text: 'Czech Republic (+420)', value: '+420'},
                { id: 'DK', text: 'Denmark (+45)', value: '+45'},
                { id: 'DJ', text: 'Djibouti (+253)', value: '+253'},
                { id: 'DM', text: 'Dominica (+1809)', value: '+1809'},
                { id: 'DO', text: 'Dominican Republic (+1809)', value: '+1809'},
                { id: 'EC', text: 'Ecuador (+593)', value: '+593'},
                { id: 'EG', text: 'Egypt (+20)', value: '+20'},
                { id: 'SV', text: 'El Salvador (+503)', value: '+503'},
                { id: 'GQ', text: 'Equatorial Guinea (+240)', value: '+240'},
                { id: 'ER', text: 'Eritrea (+291)', value: '+291'},
                { id: 'EE', text: 'Estonia (+372)', value: '+372'},
                { id: 'ET', text: 'Ethiopia (+251)', value: '+251'},
                { id: 'FK', text: 'Falkland Islands (Malvinas) (+500)', value: '+500'},
                { id: 'FO', text: 'Faroe Islands (+298)', value: '+298'},
                { id: 'FJ', text: 'Fiji (+679)', value: '+679'},
                { id: 'FI', text: 'Finland (+358)', value: '+358'},
                { id: 'FR', text: 'France (+33)', value: '+33'},
                { id: 'GF', text: 'French Guiana (+594)', value: '+594'},
                { id: 'PF', text: 'French Polynesia (+689)', value: '+689'},
                { id: 'TF', text: 'French Southern Territories (+689)', value: '+689'},
                { id: 'GA', text: 'Gabon (+241)', value: '+241'},
                { id: 'GM', text: 'Gambia (+220)', value: '+220'},
                { id: 'GE', text: 'Georgia (+7880)', value: '+7880'},
                { id: 'DE', text: 'Germany (+49)', value: '+49'},
                { id: 'GH', text: 'Ghana (+233)', value: '+233'},
                { id: 'GI', text: 'Gibraltar (+350)', value: '+350'},
                { id: 'GR', text: 'Greece (+30)', value: '+30'},
                { id: 'GL', text: 'Greenland (+299)', value: '+299'},
                { id: 'GD', text: 'Grenada (+1473)', value: '+1473'},
                { id: 'GP', text: 'Guadeloupe (+590)', value: '+590'},
                { id: 'GU', text: 'Guam (+671)', value: '+671'},
                { id: 'GT', text: 'Guatemala (+502)', value: '+502'},
                { id: 'GG', text: 'Guernsey (+44)', value: '+44'},
                { id: 'GN', text: 'Guinea (+224)', value: '+224'},
                { id: 'GW', text: 'Guinea-Bissau (+245)', value: '+245'},
                { id: 'GY', text: 'Guyana (+592)', value: '+592'},
                { id: 'HT', text: 'Haiti (+509)', value: '+509'},
                { id: 'HM', text: 'Heard Island & Mcdonald Islands (+61)', value: '+61'},
                { id: 'VA', text: 'Holy See (Vatican City State) (+39)', value: '+39'},
                { id: 'HN', text: 'Honduras (+504)', value: '+504'},
                { id: 'HK', text: 'Hong Kong (+852)', value: '+852'},
                { id: 'HU', text: 'Hungary (+36)', value: '+36'},
                { id: 'IS', text: 'Iceland (+354)', value: '+354'},
                { id: 'IN', text: 'India(+91)', value: '+91'},
                { id: 'ID', text: 'Indonesia (+62)', value: '+62'},
                { id: 'IR', text: 'Iran, Islamic Republic Of (+98)', value: '+98'},
                { id: 'IQ', text: 'Iraq (+964)', value: '+964'},
                { id: 'IE', text: 'Ireland (+353)', value: '+353'},
                { id: 'IM', text: 'Isle Of Man (+44)', value: '+44'},
                { id: 'IL', text: 'Israel (+972)', value: '+975'},
                { id: 'IT', text: 'Italy (+39)', value: '+39'},
                { id: 'JM', text: 'Jamaica (+1876)', value: '+1876'},
                { id: 'JP', text: 'Japan (+81)', value: '+81'},
                { id: 'JE', text: 'Jersey (+44-1534)', value: '+44-1534'},
                { id: 'JO', text: 'Jordan (+962)', value: '+962'},
                { id: 'KZ', text: 'Kazakhstan (+7)', value: '+7'},
                { id: 'KE', text: 'Kenya (+254)', value: '+254'},
                { id: 'KI', text: 'Kiribati (+686)', value: '+686'},
                { id: 'KP', text: 'Korea - North (+850)', value: '+850'},
                { id: 'KR', text: 'Korea - South (+82)', value: '+82'},
                { id: 'KW', text: 'Kuwait (+965)', value: '+965'},
                { id: 'KG', text: 'Kyrgyzstan (+996)', value: '+996'},
                { id: 'LA', text: 'Lao People\'s Democratic Republic (+856)', value: '+856'},
                { id: 'LV', text: 'Latvia (+371)', value: '+371'},
                { id: 'LB', text: 'Lebanon (+961)', value: '+961'},
                { id: 'LS', text: 'Lesotho (+266)', value: '+266'},
                { id: 'LR', text: 'Liberia (+231)', value: '+231'},
                { id: 'LY', text: 'Libyan Arab Jamahiriya (+218)', value: '+218'},
                { id: 'LI', text: 'Liechtenstein (+417)', value: '+417'},
                { id: 'LT', text: 'Lithuania (+370)', value: '+370'},
                { id: 'LU', text: 'Luxembourg (+352)', value: '+352'},
                { id: 'MO', text: 'Macao (+853)', value: '+853'},
                { id: 'MK', text: 'Macedonia (+389)', value: '+389'},
                { id: 'MG', text: 'Madagascar (+261)', value: '+261'},
                { id: 'MW', text: 'Malawi (+265)', value: '+265'},
                { id: 'MY', text: 'Malaysia (+60)', value: '+60'},
                { id: 'MV', text: 'Maldives (+960)', value: '+960'},
                { id: 'ML', text: 'Mali (+223)', value: '+223'},
                { id: 'MT', text: 'Malta (+356)', value: '+356'},
                { id: 'MH', text: 'Marshall Islands (+692)', value: '+692'},
                { id: 'MQ', text: 'Martinique (+596)', value: '+596'},
                { id: 'MR', text: 'Mauritania (+222)', value: '+222'},
                { id: 'MU', text: 'Mauritius (+230)', value: '+230'},
                { id: 'YT', text: 'Mayotte (+269)', value: '+269'},
                { id: 'MX', text: 'Mexico (+52)', value: '+52'},
                { id: 'FM', text: 'Micronesia, Federated States Of (+691)', value: '+691'},
                { id: 'MD', text: 'Moldova (+373)', value: '+373'},
                { id: 'MC', text: 'Monaco (+377)', value: '+377'},
                { id: 'MN', text: 'Mongolia (+976)', value: '+976'},
                { id: 'ME', text: 'Montenegro (+382)', value: '+382'},
                { id: 'MS', text: 'Montserrat (+1664)', value: '+1664'},
                { id: 'MA', text: 'Morocco (+212)', value: '+212'},
                { id: 'MZ', text: 'Mozambique (+258)', value: '+258'},
                { id: 'MM', text: 'Myanmar (+95)', value: '+95'},
                { id: 'NA', text: 'Namibia (+264)', value: '+264'},
                { id: 'NR', text: 'Nauru (+674)', value: '+674'},
                { id: 'NP', text: 'Nepal (+977)', value: '+977'},
                { id: 'NL', text: 'Netherlands (+31)', value: '+31'},
                { id: 'AN', text: 'Netherlands Antilles (+599)', value: '+599'},
                { id: 'NC', text: 'New Caledonia (+687)', value: '+687'},
                { id: 'NZ', text: 'New Zealand (+64)', value: '+64'},
                { id: 'NI', text: 'Nicaragua (+505)', value: '+505'},
                { id: 'NE', text: 'Niger (+227)', value: '+227'},
                { id: 'NG', text: 'Nigeria (+234)', value: '+234'},
                { id: 'NU', text: 'Niue (+683)', value: '+683'},
                { id: 'NF', text: 'Norfolk Island (+672)', value: '+672'},
                { id: 'MP', text: 'Northern Mariana Islands (+670)', value: '+670'},
                { id: 'NO', text: 'Norway (+47)', value: '+47'},
                { id: 'OM', text: 'Oman (+968)', value: '+968'},
                { id: 'PK', text: 'Pakistan (+92)', value: '+92'},
                { id: 'PW', text: 'Palau (+680)', value: '+680'},
                { id: 'PS', text: 'Palestinian Territory (+970)', value: '+970'},
                { id: 'PA', text: 'Panama (+507)', value: '+507'},
                { id: 'PG', text: 'Papua New Guinea (+675)', value: '+675'},
                { id: 'PY', text: 'Paraguay (+595)', value: '+595'},
                { id: 'PE', text: 'Peru (+51)', value: '+51'},
                { id: 'PH', text: 'Philippines (+63)', value: '+63'},
                { id: 'PN', text: 'Pitcairn (+64)', value: '+64'},
                { id: 'PL', text: 'Poland (+48)', value: '+48'},
                { id: 'PT', text: 'Portugal (+351)', value: '+351'},
                { id: 'PR', text: 'Puerto Rico (+1787)', value: '+1787'},
                { id: 'QA', text: 'Qatar (+974)', value: '+974'},
                { id: 'RE', text: 'Reunion (+262)', value: '+262'},
                { id: 'RO', text: 'Romania (+40)', value: '+40'},
                { id: 'RU', text: 'Russian Federation (+7)', value: '+7'},
                { id: 'RW', text: 'Rwanda (+250)', value: '+250'},
                { id: 'BL', text: 'Saint Barthelemy (+590)', value: '+590'},
                { id: 'SH', text: 'Saint Helena (+290)', value: '+94'},
                { id: 'KN', text: 'Saint Kitts And Nevis (+1869)', value: '+94'},
                { id: 'LC', text: 'Saint Lucia (+1758)', value: '+94'},
                { id: 'MF', text: 'Saint Martin (+590)', value: '+590'},
                { id: 'PM', text: 'Saint Pierre And Miquelon (+508)', value: '+508'},
                { id: 'VC', text: 'Saint Vincent And Grenadines (+1-784)', value: '+1-784'},
                { id: 'WS', text: 'Samoa (+685)', value: '+685'},
                { id: 'SM', text: 'San Marino (+378)', value: '+378'},
                { id: 'ST', text: 'Sao Tome And Principe (+239)', value: '+239'},
                { id: 'SA', text: 'Saudi Arabia (+966)', value: '+966'},
                { id: 'SN', text: 'Senegal (+221)', value: '+221'},
                { id: 'RS', text: 'Serbia (+381)', value: '+381'},
                { id: 'SC', text: 'Seychelles (+248)', value: '+248'},
                { id: 'SL', text: 'Sierra Leone (+232)', value: '+232'},
                { id: 'SG', text: 'Singapore (+65)', value: '+65'},
                { id: 'SK', text: 'Slovakia (+421)', value: '+421'},
                { id: 'SI', text: 'Slovenia (+386)', value: '+386'},
                { id: 'SB', text: 'Solomon Islands (+677)', value: '+677'},
                { id: 'SO', text: 'Somalia (+252)', value: '+252'},
                { id: 'ZA', text: 'South Africa (+27)', value: '+27'},
                { id: 'GS', text: 'South Georgia And Sandwich Isl. (+500)', value: '+500'},
                { id: 'ES', text: 'Spain (+34)', value: '+34'},
                { id: 'LK', text: 'Sri Lanka (+94)', value: '+94'},
                { id: 'SD', text: 'Sudan (+249)', value: '+249'},
                { id: 'SR', text: 'Suriname (+597)', value: '+597'},
                { id: 'SJ', text: 'Svalbard And Jan Mayen (+47)', value: '+47'},
                { id: 'SZ', text: 'Swaziland (+268)', value: '+268'},
                { id: 'SE', text: 'Sweden (+46)', value: '+46'},
                { id: 'CH', text: 'Switzerland (+41)', value: '+41'},
                { id: 'SY', text: 'Syrian Arab Republic (+963)', value: '+963'},
                { id: 'TW', text: 'Taiwan (+886)', value: '+886'},
                { id: 'TJ', text: 'Tajikistan (+992)', value: '+992'},
                { id: 'TZ', text: 'Tanzania (+255)', value: '+255'},
                { id: 'TH', text: 'Thailand (+66)', value: '+66'},
                { id: 'TL', text: 'Timor-Leste (+670)', value: '+670'},
                { id: 'TG', text: 'Togo (+228)', value: '+228'},
                { id: 'TK', text: 'Tokelau (+690)', value: '+690'},
                { id: 'TO', text: 'Tonga (+676)', value: '+676'},
                { id: 'TT', text: 'Trinidad And Tobago (+1868)', value: '+1868'},
                { id: 'TN', text: 'Tunisia (+216)', value: '+216'},
                { id: 'TR', text: 'Turkey (+90)', value: '+90'},
                { id: 'TM', text: 'Turkmenistan (+993)', value: '+993'},
                { id: 'TC', text: 'Turks And Caicos Islands (+1649)', value: '+1649'},
                { id: 'TV', text: 'Tuvalu (+688)', value: '+668'},
                { id: 'UG', text: 'Uganda (+256)', value: '+256'},
                { id: 'UA', text: 'Ukraine (+380)', value: '+380'},
                { id: 'AE', text: 'United Arab Emirates (+971)', value: '+971'},
                { id: 'GB', text: 'United Kingdom (+44)', value: '+44'},
                { id: 'US', text: 'United States (+1)', value: '+1'},
                { id: 'UM', text: 'United States Outlying Islands (+1-340)', value: '+1-340'},
                { id: 'UY', text: 'Uruguay (+598)', value: '+598'},
                { id: 'UZ', text: 'Uzbekistan (+998)', value: '+998'},
                { id: 'VU', text: 'Vanuatu (+678)', value: '+678'},
                { id: 'VE', text: 'Venezuela (+58)', value: '+58'},
                { id: 'VN', text: 'Vietnam (+84)', value: '+84'},
                { id: 'VG', text: 'Virgin Islands, British (+1)', value: '+1'},
                { id: 'VI', text: 'Virgin Islands, U.S. (+1)', value: '+1'},
                { id: 'WF', text: 'Wallis And Futuna (+681)', value: '+681'},
                { id: 'EH', text: 'Western Sahara (+212)', value: '+212'},
                { id: 'YE', text: 'Yemen (North)(+969)', value: '+969'},
                { id: 'YE', text: 'Yemen (South)(+967)', value: '+967'},
                { id: 'ZM', text: 'Zambia (+260)', value: '+260'},
                { id: 'ZW', text: 'Zimbabwe (+263)', value: '+263'}
            ];
            $.ajax({
                url: "/hr/public/getUserLocation",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                complete: function(resp){
                    $.each(isoCountries, function(index, value) {
                        if(resp.responseJSON.countryCode != undefined && resp.responseJSON.countryCode == value.id){
                            $('.select2-chosen')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"")+"</span>";
                            $('.select2-chosen')[0].title = value.text;
                            var country = $('input[name=country]');
                            country.val(value.text);
                            var phone = $('#countryCustom');
                            phone.value = value.value.replace("+","");
                            localStorage.setItem("phone",  phone.value);
                        }
                    });
                }
            });
        }, 0);

        var userLang = navigator.language || navigator.userLanguage;
        var lST = userLang.substring(0, 2);
    })
    .controller('PublicVacancyController', ["$rootScope", "$scope", "$filter", "$location", "$routeParams", "$sce" , "$translate", "Service",
        "notificationService", "FileInit", "serverAddress", "$window", "Company", "$uibModal" ,
        function($rootScope, $scope, $filter, $location, $routeParams, $sce , $translate, Service,
                 notificationService, FileInit, serverAddress, $window, Company, $uibModal) {


            $rootScope.closeModal = function(){
                $scope.modalInstance.close();
                $('body').removeClass('modal-open-public-vacancy-form');
            };

            if($location.$$absUrl.indexOf('/pv/') >= 0){
                var string = $location.$$path;
                string = string.replace("/pv/", "vacancy-");
                console.log(string);
                $window.location.replace('/i#/' + string);
            }
            $("#signUpButtonDiv").hide();
            $("#signInButtonDiv").hide();
            $scope.message = 'def';
            $rootScope.header = "two";
            $scope.serverAddress = serverAddress;
            $scope.request = {
                name: null,
                lastName: null,
                phone: null,
                message: null,
                vacancyId: $scope.vacancyId,
                fileId: null
            };

            $.getScript("https://platform.linkedin.com/in.js?async=true", function success() {
                IN.init({
                    api_key: apiKey.linkedIn.api_key,
                    scope: "r_emailaddress w_share"
                });
            });
            $.getScript('//connect.facebook.net/en_UK/all.js', function () {
                FB.init({
                    appId: apiKey.facebook.appId,
                    version: 'v2.9'
                });
            });

            $(window).scroll(function(){
                if($('.vacancy-info').offset() && $(window).scrollTop() >= $('.vacancy-info').offset().top - 10) {
                    $('.apply-buttons').addClass("fixed")
                } else {
                    if($('.apply-buttons').hasClass("fixed")) {
                        $('.apply-buttons').removeClass("fixed");
                    }
                }
            });


            $scope.share = function (sourse) {
                if ($scope.companyLogo != undefined && $scope.companyLogo !== '') {
                    $scope.publicImgLink = $location.$$protocol + "://" + $location.$$host + $scope.serverAddress + '/getlogo?id=' + $scope.companyLogo;
                } else {
                    $scope.publicImgLink = "https://cleverstaff.net/images/sprite/icon_128_128_png.png";
                }
                $scope.publicDescr = '';
                var link = $location.$$protocol + "://" + $location.$$host + "/i#/pv/" + $scope.vacancy.localId;
                angular.forEach(angular.element($scope.vacancy.descr).text().replace("\r\n", "\n").split("\n"), function (val) {
                    if (val !== undefined && val !== '') {
                        $scope.publicDescr += val + " ";
                    }
                });

                if ($scope.serverAddress === '/hrdemo') {
                    link = $location.$$protocol + "://" + $location.$$host + "/di#/pv/" + $scope.vacancy.localId;
                }
                if (sourse === 'linkedin') {
                    if (!IN.User.isAuthorized()) {
                        IN.User.authorize(function () {
                            IN.API.Raw("/people/~/shares")
                                .method("POST")
                                .body(JSON.stringify({
                                    "content": {
                                        "title": $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                        "description": $scope.publicDescr,
                                        "submitted-url": link,
                                        "submitted-image-url": $scope.publicImgLink
                                    },
                                    "visibility": {
                                        "code": "anyone"
                                    },
                                    "comment": ''
                                }))
                                .result(function (r) {
                                    notificationService.success($filter('translate')('Vacancy posted on your LinkedIn'));
                                })
                                .error(function (r) {
                                    notificationService.error(r.message);
                                });
                        }, "w_share");
                    } else {
                        IN.API.Raw("/people/~/shares")
                            .method("POST")
                            .body(JSON.stringify({
                                "content": {
                                    "title": $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                    "description": $scope.publicDescr,
                                    "submitted-url": link,
                                    "submitted-image-url": $scope.publicImgLink
                                },
                                "visibility": {
                                    "code": "anyone"
                                },
                                "comment": ""
                            }))
                            .result(function (r) {
                                notificationService.success($filter('translate')('Vacancy posted on your LinkedIn'));
                            })
                            .error(function (r) {
                                notificationService.error(r.message);
                            });
                    }
                }
                if (sourse === 'facebook') {

                    FB.getLoginStatus(function (response) {
                        if (response.status === 'connected') {
                            FB.ui({
                                    method: 'feed',
                                    name: $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                    caption: '',
                                    description: $scope.publicDescr,
                                    link: link,
                                    picture: $scope.publicImgLink
                                },
                                function (response) {
                                    if (response && response.post_id) {
                                        notificationService.success($filter('translate')('Vacancy posted on your Facebook'));
                                    } else {
                                        notificationService.error($filter('translate')('Vacancy hasn\'t shared'));
                                    }
                                });
                        }
                        else {
                            FB.login(function () {
                                FB.ui({
                                        method: 'feed',
                                        name: $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                        caption: '',
                                        description: $scope.publicDescr,
                                        link: link,
                                        picture: $scope.publicImgLink
                                    },
                                    function (response) {
                                        if (response && response.post_id) {
                                            a;
                                            notificationSecvice.success($filter('translate')('Vacancy posted on your Facebook'));
                                        } else {
                                            notificationService.error($filter('translate')('Vacancy hasn\'t shared'));
                                        }
                                    });
                            });
                        }
                    });
                }
            };

            $scope.addRecallFromLinkedIn = function () {
                IN.User.authorize(function () {
                    IN.API.Profile("me").fields(["site-standard-profile-request", "public-profile-url", "first-name", "last-name", "email-address", "phone-numbers", "bound-account-types", "headline", "summary", "specialties", "positions", "educations"]).result(function (me) {
                        parseLinkedInInformationForRecall(me, $scope);
                        $scope.showRecallFromModal();
                    });
                });
            };
            $scope.show = true;
            FileInit.initFileOption($scope, "public", {
                allowedType: ["docx", "doc", "pdf", "odt"],
                maxSize: 5242880
            }, $filter);
            $scope.filesForRecall = [];
            $scope.callbackFile = function (var1, var2) {
                $scope.message = 'def';
                $scope.filesForRecall.push({name: var2, attId: var1})
            };

            $scope.callbackFileError = function () {
                $scope.message = 'error_file';
            };
            var vacancyId = null;
            if ($routeParams.vacancyId.indexOf("#") != -1) {
                vacancyId = $routeParams.vacancyId.split("#")[0];
            } else {
                vacancyId = $routeParams.vacancyId;
            }
            $scope.getCompanyParams = function(){
                Company.getParams(function(resp){
                    $scope.companyParams = resp.object;
                    $rootScope.publicLink = $location.$$protocol + "://" + $location.$$host + ":8080/i#/" + $scope.companyParams.nameAlias + "-vacancies";
                });
            };
            // $scope.getCompanyParams();
            $scope.orgName = null;
            $scope.loadStatusForPublicVacancy = false;
            Service.publicVacancy({id: vacancyId, host: document.referrer}, function (resp) {
                console.log(resp);
                if (resp.status && resp.status === 'error' && resp.message) {
                    $scope.vacancyFound = false;
                } else {
                    $scope.vacancyId = resp.object.vacancyId;
                    $scope.request.vacancyId = resp.object.vacancyId;
                    $rootScope.title = resp.object.position + " - " + $filter('translate')('vacancy_in') + " CleverStaff";
                    $rootScope.vacancyName = resp.object.position;
                    if (resp.object.region != undefined) {
                        $rootScope.region = resp.object.region.fullName;
                    }
                    $scope.vacancy = resp.object;
                    $scope.companyPublicInfo = {};
                    $scope.companyPublicInfo.fb = $scope.vacancy.linkToCompanyFaceBookPage;
                    $scope.companyPublicInfo.companyWebSite = $scope.vacancy.linkToCompanySite;
                    $scope.companyPublicInfo.orgName = $scope.vacancy.orgName;
                    $scope.vacancyFound = true;
                    //$location.hash('');
                    $location.search($filter('transliteration')(resp.object.position.replace(/\W+/g, '_'))).replace();
                    $scope.loadStatusForPublicVacancy = true;
                    //setTimeout(function(){
                    //    if (performance.navigation.type == 1) {
                    //        $location.$$absUrl
                    //    } else {
                    //        history.pushState(null, "", $rootScope.publicLink);
                    //    }
                    //    if($location.$$host == '127.0.0.1'){
                    //        history.pushState(null, "", $location.$$protocol + "://" + $location.$$host + ":8080/i#" + $location.$$path + "?" + deleteTenSpaces);
                    //    }else{
                    //        history.pushState(null, "", $location.$$protocol + "://" + $location.$$host + "/i#" + $location.$$path + "?" + deleteTenSpaces);
                    //    }
                    //}, 1000);
                    // Service.getOrgLogoId({orgId: resp.object.orgId}, function (logoResp) {
                    //     if (logoResp.status && logoResp.status === 'ok') {
                    //         $scope.companyLogo = logoResp.object;
                    //     }
                    // });
                }
            }, function () {
            });
            $scope.to_trusted = function (html_code) {
                return $sce.trustAsHtml(html_code);
            };
            $scope.removeFile = function (id) {
                angular.forEach($scope.filesForRecall, function (val, ind) {
                    if (val.attId == id) {
                        $scope.filesForRecall.splice(ind, 1);
                    }
                });
            };
            $scope.showErrorEmailMessage = false;
            $scope.incorrectPhoneNumber = false;
            $('#email2').on('input', function () {
                $scope.request.email = $(this).val();
                $scope.changeEmail();
                $scope.$apply();
            });
            $rootScope.changeEmail = function(email){
                if(email.length > 0){
                    $scope.showErrorEmailMessage = false;
                }
            };
            $scope.showErrorPhoneMessage = false;
            $('#phone').on('input', function () {
                $scope.showErrorPhoneMessage = false;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
            $scope.changeEmail = function () {
                if ($scope.request.email == undefined) {
                    $scope.showErrorEmailMessage = true;
                } else $scope.showErrorEmailMessage = $scope.request.email.length == 0;
            };
            $scope.enterPhoneNumber = false;
            $scope.changePhone = function (phone) {
                //$scope.recallForm.phone.$invalid = false;
                if(phone == undefined){
                    $scope.enterPhoneNumber = true;
                    $scope.incorrectPhoneNumber = false;
                    $scope.showErrorPhoneMessage = true;
                }else if(phone.length > 0){
                    $scope.showErrorPhoneMessage = false;
                }
            };
            $scope.$watch('request.phone', function (newVal, oldVal) {
                if(newVal != undefined && oldVal != newVal){
                    $scope.showErrorPhoneMessage = false;
                }
            });

            $scope.showModalInfoAboutVacancy = function() {
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/vacancy-added-response.html',
                    size: '',
                    resolve: {

                    }
                });
            };



            $scope.showRecallFromModal = function() {
                $scope.showErrorEmailMessage = false;
                $scope.showErrorPhoneMessage = false;
                $scope.showErrorCvFileMessage = false;
                $('body').addClass('modal-open-public-vacancy-form');

                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/public-vacancy-form.html?b=11',
                    size: '',
                    scope: $scope,
                    resolve: {

                    }
                });

            };

            $scope.sendRequest = function (recallForm) {
                $scope.recallForm = recallForm;
                $scope.showErrorCvFileMessage = true;
                if ($scope.recallForm.$valid) {
                    if ($scope.request.email != undefined && $scope.request.email.length == 0) {
                        $scope.request.email = "";
                    }
                    if (validEmail($scope.request.email)) {
                        $scope.showErrorEmailMessage = true;
                        return;
                    }else{
                        $scope.showErrorEmailMessage = false;
                    }
                    if ($scope.filesForRecall.length != 0) {
                        angular.forEach($scope.filesForRecall, function (resp) {
                            delete resp.$$hashKey;
                        });
                        $scope.request.fileId = JSON.stringify($scope.filesForRecall);
                    }
                    if ($scope.request.message != undefined && $scope.request.message.length == 0) {
                        $scope.request.message = "";
                    } else if ($scope.request.message == undefined) {
                        $scope.request.message = "";
                    }
                    $scope.request.lang = $translate.use();
                    $scope.request.email = $('#email2').val();
                    $scope.request.phone = String($scope.request.phone);
                    if ($scope.request.phone == undefined || $scope.request.phone.match(/^[\(\)\s\-\+\d]{9,20}$/) == null) {
                        $scope.showErrorPhoneMessage = true;
                        $scope.enterPhoneNumber = false;
                        $scope.incorrectPhoneNumber = true;
                        return false;
                    }else{
                        $scope.showErrorPhoneMessage = false;
                    }
                    if($scope.filesForRecall.length == 0){
                        $scope.showErrorCvFileMessage = true;
                    }else{
                        Service.addCandidate($scope.request, function (resp) {
                            if (resp.status && resp.status === 'error' && resp.message) {
                                $scope.message = "error";
                            } else {
                                $scope.message = "success";
                                $scope.request = {
                                    name: "",
                                    lastName: "",
                                    phone: "",
                                    message: "",
                                    vacancyId: $scope.vacancyId,
                                    fileId: null
                                };
                                // $("#email2").val("");
                                $scope.filesForRecall = [];
                                $scope.recallForm.name.$pristine = true;
                                $scope.recallForm.last_name.$pristine = true;
                                $scope.recallForm.phone.$pristine = true;
                                $scope.recallForm.phone.$invalid = false;
                                $scope.recallForm.email2.$invalid = false;
                                $scope.recallForm.email2.$pristine = false;
                                $scope.showErrorEmailMessage = false;
                                $('body').removeClass('modal-open-public-vacancy-form');
                                $rootScope.closeModal();
                                $scope.showModalInfoAboutVacancy();
                            }

                        }, function (resp) {
                            $scope.message = "error";
                        });
                    }
                } else {
                    $scope.recallForm.name.$pristine = false;
                    $scope.recallForm.last_name.$pristine = false;
                    if (validEmail($scope.request.email)) {
                        $scope.showErrorEmailMessage = true;
                    }
                    $scope.recallForm.phone.$pristine = false;
                    if($scope.request.phone == null || $scope.request.phone.length == 0){
                        $scope.enterPhoneNumber = true;
                    }else if($scope.request.phone.length < 9 || $scope.request.phone.length > 20){
                        $scope.showErrorPhoneMessage = true;
                        $scope.incorrectPhoneNumber = true;
                        $scope.enterPhoneNumber = false;
                    }else{
                        $scope.incorrectPhoneNumber = true;
                        $scope.enterPhoneNumber = false;
                    }
                }
            };
        }])
    .controller('PublicVacancyAddController', function($rootScope, $scope, $filter, $location, $translate, Service, notificationService) {
            $rootScope.hasJS = true;
            $scope.orgId = 'c0f3bac6a94e4c2290618907e8dba636';
            Service.saveAccessLogEntry({value: $scope.orgId, host: document.referrer, type: "public_add_vacancy"});


            $rootScope.title = "Форма додавання вакансії";
            $translate.use("ua");

            var google_url = "https://accounts.google.com/o/oauth2/auth" +
                "?client_id=" + apiKey.google.client_id +
                "&scope=email%20profile" +
                "&state=/profile" +
                "&redirect_uri=" + location.protocol + "//" + document.domain + "/white.html" +
                "&response_type=code%20token" +
                "&approval_prompt=auto";

            $scope.employmentType = Service.employmentType();
            Service.genderTwo($scope);
            $scope.currency = Service.currency();
            $scope.langs = ["Англійський розмовний",
                "Англійський професійний",
                "Англійський середній",
                "Англійський починаючий",
                "Російський розмовний",
                "Російський професійний",
                "Російський середній",
                "Російський починаючий",
                "Український розмовний",
                "Український професійний",
                "Український середній",
                "Український починаючий",
                "Білоруський розмовний",
                "Білоруський професійний",
                "Білоруський середній",
                "Білоруський починаючий",
                "Казахський розмовний",
                "Казахський професійний",
                "Казахський середній",
                "Казахський починаючий",
                "Молдавський розмовний",
                "Молдавський професійний",
                "Молдавський середній",
                "Молдавський починаючий"];
            $scope.industries = Service.getIndustries();

            $('.select2-lang').select2({
                tags: $scope.langs,
                tokenSeparators: [",", " "]
            });

            $scope.errorMessage = {
                show: false,
                message: ""
            };
            $scope.map = {
                center: {
                    latitude: 48.379433,
                    longitude: 31.165579999999977
                },
                zoom: 5,
                options: {
                    panControl: true,
                    zoomControl: true,
                    scaleControl: true,
                    mapTypeControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
            };
            $scope.marker = {
                id: 1,
                title: "",
                coords: {
                    latitude: null,
                    longitude: null
                }
            };
            $scope.companyData = {
                input: "",
                inputFocused: false,
                clients: [],
                clientsAfterSearch: [],
                wrongName: false
            };
            $scope.company = {
                name: "",
                firstName: "",
                phone: "",
                email: "",
                industry: "",
                site: "",
                descr: ""
            };

            $scope.focusOffCompany = function() {
                var checkName = false;
                angular.forEach($scope.companyData.clients, function(val) {
                    if (val == $scope.companyData.input) {
                        checkName = true;
                    }
                });
                if (checkName) {
                    $scope.companyData.wrongName = false;
                } else {
                    $scope.companyData.wrongName = $scope.companyData.input && $scope.companyData.input.length != 0;
                }
                $scope.companyData.inputFocused = true;
            };


            Service.getClientNames({orgId: $scope.orgId}, function(resp) {
                $scope.companyData.clients = resp.object;
                var arr = [];
                angular.forEach($scope.companyData.clients, function(val) {
                    arr.push({id: val, text: val})
                });

                $(".search-client-name").select2({
                    data: arr,
                    minimumInputLength: 2,
                    selectOnBlur: true,
                    formatInputTooShort: function() {
                        return "";
                    },
                    createSearchChoice: function(term, data) {
                        if ($(data).filter(function() {
                            return this.text.localeCompare(term) === 0;
                        }).length === 0) {
                            return {id: term, text: term};
                        }
                    }
                }).on("select2-close", function(e) {
                    $scope.companyData.input = $(this).select2('data').id;
                    var valueExist = false;
                    angular.forEach($scope.companyData.clients, function(resp) {
                        if (resp == $scope.companyData.input) {
                            valueExist = true;
                        }
                    });
                    if (valueExist) {
                        $scope.companyData.wrongName = false;
                        $scope.goToStepTwo();

                    } else {
                        $scope.companyData.wrongName = $scope.companyData.input && $scope.companyData.input.length != 0;
                    }
                    $scope.companyData.inputFocused = true;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });

            });

            $scope.goToStepTwo = function(withoutContacts) {
                if (!withoutContacts) {
                    $("#pac-input").wrap('<div class="ui labeled input">');
                    $("#pac-input").after('<div class="ui corner label"><i class="asterisk icon"></i></div>');
                }
                if ($scope.companyData.wrongName && !$scope.companyForm.$valid) {
                    $scope.companyForm.email.$pristine = false;
                    $scope.companyForm.phone.$pristine = false;
                    $scope.companyForm.firstName.$pristine = false;
                    return;
                }
                if ($scope.validCompanyData()) {
                    $scope.company.name = $scope.companyData.input;
                    $scope.client = {
                        name: $scope.companyData.input,
                        industry: $scope.company.industry,
                        site: $scope.company.site,
                        descr: $scope.company.descr
                    };
                    if ($scope.companyData.wrongName && !withoutContacts) {
                        $scope.contacts = [
                            {
                                firstName: $scope.company.firstName,
                                contacts: [
                                    {
                                        type: "mphone",
                                        value: $scope.company.phone
                                    },
                                    {
                                        type: "email",
                                        value: $scope.company.email
                                    }
                                ]
                            }
                        ]
                    } else {
                        $scope.contacts = [];
                    }
                    $scope.step = 2;
                    $scope.companyForm2.position.$pristine = true;
                } else {

                }
            };

            $scope.goToStepThree = function() {
                $scope.vacancy = {};
                $('.select2-lang').select2('data', null);
                $("#pac-input").val("");
                $scope.region = {};
                $scope.step = 3;
                $scope.companyForm2.position.$pristine = true;
            };

            $scope.changeStep = function(step) {
                if ($scope.step > step) {
                    $scope.step = step;
                }
            };

            $scope.validCompanyData = function() {
                if ($scope.companyData.wrongName == false && $scope.companyData.input.length > 0) {
                    return true;
                }
                if ($scope.company.firstName.length > 0 && $scope.company.phone.length > 0 && $scope.company.email.length > 0) {
                    return true;
                }
                return false;
            };

            $("#pac-input").on("change", function() {
                if ($(this).val().length == 0) {
                    $("#pac-input").parent().parent().parent().addClass("error");
                    $("#pac-input").css("border-color", "#E7BEBE");
                    $("#pac-input").css("box-shadow", ".3em 0 0 0 #D95C5C inset");
                } else {
                    $("#pac-input").parent().parent().parent().removeClass("error");
                    $("#pac-input").css("border-color", "");
                    $("#pac-input").css("box-shadow", "");
                }
            });

            $scope.$watch('regionInput', function(newValue, oldValue) {
                if (newValue && newValue.length == 0) {
                    $("#pac-input").parent().parent().parent().addClass("error");
                    $("#pac-input").css("border-color", "#E7BEBE");
                    $("#pac-input").css("box-shadow", ".3em 0 0 0 #D95C5C inset");
                } else {
                    $("#pac-input").parent().parent().parent().removeClass("error");
                    $("#pac-input").css("border-color", "");
                    $("#pac-input").css("box-shadow", "");
                }
            });

            $scope.saveFacebook = function() {
                var r = false;
                if (!$scope.companyForm2.$valid) {
                    $scope.companyForm2.position.$pristine = false;
                    notificationService.error("Будь-ласка, заповніть назву вакансії");
                    r = true;
                }
                if ($("#pac-input").val().length == 0) {
                    $("#pac-input").parent().parent().parent().addClass("error");
                    $("#pac-input").css("border-color", "#E7BEBE");
                    $("#pac-input").css("box-shadow", ".3em 0 0 0 #D95C5C inset");
                    notificationService.error("Будь-ласка, заповніть регіон");
                    r = true;
                }
                if (r) return;
                FB.login(function(response) {
                    if (response.authResponse) {
                        var code = response.authResponse.accessToken; //get access token
                        FB.api('/me', function(u) {
                            var user = {
                                id: u.id,
                                name: u.name,
                                email: u.email,
                                source: "facebook"
                            };
                            save(user)

                        });
                    }
                }, {
                    scope: 'email'
                });

            };

            $scope.saveGoogle = function() {
                var r = false;
                if (!$scope.companyForm2.$valid) {
                    $scope.companyForm2.position.$pristine = false;
                    notificationService.error("Будь-ласка, заповніть назву вакансії");
                    r = true;
                }
                if ($("#pac-input").val().length == 0) {
                    $("#pac-input").parent().parent().parent().addClass("error");
                    $("#pac-input").css("border-color", "#E7BEBE");
                    $("#pac-input").css("box-shadow", ".3em 0 0 0 #D95C5C inset");
                    notificationService.error("Будь-ласка, заповніть регіон");
                    r = true;
                }
                if (r) return;
                var win = window.open(google_url, "windowname3", getPopupParams());
                var pollTimer = window.setInterval(function() {
                    try {
                        if (win.document.URL.indexOf(gup(google_url, 'redirect_uri')) !== -1) {
                            window.clearInterval(pollTimer);
                            var url = win.document.URL;
                            var code = gup(url, 'code');
                            var access_token = gup(url, 'access_token');
                            win.close();
                            $.ajax({
                                url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + access_token,
                                data: null,
                                success: function(u) {
                                    var user = {
                                        id: u.id,
                                        name: u.name,
                                        email: u.email,
                                        source: "googleplus"
                                    };
                                    save(user)
                                },
                                dataType: "jsonp"
                            });
                        }
                    } catch (e) {
                    }
                }, 500);

            };

            function save(user) {
                if ($("#pac-input").val().length == 0) {
                    $scope.vacancy.region = null;
                } else if ($("#pac-input").val().length > 0) {
                    $scope.vacancy.region = $scope.region;
                }
                $scope.vacancy.langs = $('.select2-lang').select2('val').toString();
                var saveObject = {
                    history: user,
                    orgId: $scope.orgId,
                    client: $scope.client,
                    contacts: $scope.contacts,
                    vacancies: [
                        $scope.vacancy
                    ]
                };
                Service.addVacancyPackage(saveObject,
                    function(resp) {
                        if (resp && resp.status == "ok") {
                            $scope.goToStepThree();
                        }
                    }, function(resp) {
                    }
                );

            }

            window.fbAsyncInit = function() {
                FB.init({
                    appId: apiKey.facebook.appId,
                    oauth: true,
                    status: true, // check login status
                    cookie: true, // enable cookies to allow the server to access the session
                    xfbml: true, // parse XFBML
                    version: 'v2.9'
                });
            };
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id))
                    return;
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=" + apiKey.facebook.appId + "&version=v2.9";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    );


function validEmail(email, notificationService) {
    if (email == undefined) return true;
    var r = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;
    return !email.match(r);
}

function gup(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    if (results === null)
        return "";
    else
        return results[1];
}
function getPopupParams() {
    var w = 650;
    var h = 550;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    return 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left;
}'use strict';

/* Controllers */

var controller = angular.module('RecruitingAppStart.controllers', []);

controller.controller('mainController' ,function($scope, $location, $window) {
    $scope.toSignUp = function() {
        $location.path("/registration/");
        $("#signUpButtonDiv").hide();
        $("#signInButtonDiv").show();
    };
    $scope.toSingIn = function() {
        $location.path('/');
        $("#signInButtonDiv").hide();
        $("#signUpButtonDiv").show();
    };
    $scope.toLanding = function() {
        $window.location.href = '/';
    };
})
    .controller('test_redirect_controller', function($location) {
        window.location.replace($location.$$protocol + "://" + $location.$$host)

    })
    .controller('ConfirmController', function($scope, $translate, $location, $routeParams, Person, notificationService, $window) {
        var lang = localStorage.getItem("NG_TRANSLATE_LANG_KEY") ? localStorage.getItem("NG_TRANSLATE_LANG_KEY") : "en";
        $scope.loaded = false;
        Person.finishReg({
            personId: $routeParams.personId,
            key: $routeParams.key,
            timeZoneOffset: new Date().getTimezoneOffset(),
            lang: lang
        }, function(resp) {
            if (resp.status && resp.status === 'error' && resp.message) {
                $("#confirmRegistrationFailReconfirmation").css('display', 'block');
                var userLang = localStorage.getItem("NG_TRANSLATE_LANG_KEY");

                if(resp.code === 'invalidCode') {
                    $scope.alreadyRegistered = true;
                }
            } else {
                notificationService.success("success");
                $window.location.replace('!#/organizer');
            }
        }, function(resp) {
            notificationService.error('Service is temporarily unavailable');
        });
        $scope.loaded = true;
    })
    .controller('InController', function($scope, $translate, $location, $routeParams, Person, notificationService, $window) {
        Person.getMe(function(resp) {
            if (resp.personId) {
                localStorage.setItem("link_redirect", window.location.hash);
                if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'ru'){
                    $window.location.replace('/ru/signin.html');
                }else{
                    $window.location.replace('/signin.html');
                }
            } else {
                $scope.in();
            }
        }, function(resp) {
            $scope.in();
        });

        $scope.in = function() {
            var lang = localStorage.getItem("NG_TRANSLATE_LANG_KEY") ? localStorage.getItem("NG_TRANSLATE_LANG_KEY") : "en";
            Person.in({
                personId: $routeParams.id,
                key: $routeParams.key,
                lang: lang,
                timeZoneOffset: new Date().getTimezoneOffset()
            }, function(resp) {
                if (resp.personId) {
                    $window.location.replace('/!#/organizer');
                } else {
                    $window.location.replace('/');
                }
            }, function(resp) {
                $window.location.replace('/');
            });
        }
    })
    .controller('RestorePasswordController', function($scope, $rootScope, $filter, $translate, $location, $routeParams, Person, notificationService, $window) {
        Person.checkKey({name: "forgotPasswordKey", id: $routeParams.id, key: $routeParams.key}, function(resp){
            if (resp && resp.status == "ok") {
                $scope.showRestoreForm = true;
            } else if (resp && resp.status == "error") {
                $scope.showRestoreForm = false;
            }
        }, function (resp) {
            $location.path("/");
        });
        //$rootScope.title = $filter('translate')('Change Password') + " | CleverStaff";
        var messages = {
            enter_password: "Пожалуйста введите пароль",
            wrong1_password: "Пароль должен содержать только цифры и латинские буквы",
            wrong2_password: "Пароль должен содержать хотя бы одну латинскую букву",
            wrong3_password: "Пароль должен содержать хотя бы одну цифру",
            wrong4_password: "Пароль должен быть длиной 8-30 символов",
            wrong_password2: "Пароль не совпадает с предыдущим"
        };
        $.fn.form.settings.rules.password1 = function(value) {
            var password1 = /^[a-zA-Z0-9]{0,99}$/;
            return password1.test(value);
        };
        $.fn.form.settings.rules.password2 = function(value) {
            var password2 = /.*[a-zA-Z].*/;
            return password2.test(value);
        };
        $.fn.form.settings.rules.password3 = function(value) {
            var password3 = /.*\d.*/;
            return password3.test(value);
        };
        $.fn.form.settings.rules.password4 = function(value) {
            return (value.length > 7 && value.length < 31);
        };
        $.fn.serializeObject = function() {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };
        //var rules = {
        //    password: {
        //        identifier: 'password',
        //        rules: [
        //            {
        //                type: 'empty',
        //                prompt: $filter('translate')('Please enter your password')
        //            },
        //            {
        //                type: 'password1',
        //                prompt: $filter('translate')('Password should contain only numbers and latin letters')
        //            },
        //            {
        //                type: 'password2',
        //                prompt: $filter('translate')('Password should contain at least one latin letter')
        //            },
        //            {
        //                type: 'password3',
        //                prompt: $filter('translate')('Password should contain at least one number')
        //            },
        //            {
        //                type: 'password4',
        //                prompt: $filter('translate')('Password must be 8-30 characters long')
        //            }
        //        ]
        //    },
        //    password2: {
        //        identifier: 'password2',
        //        rules: [
        //            {
        //                type: 'match[password]',
        //                prompt: $filter('translate')("The password doesn't match to previous")
        //            }
        //        ]
        //    }
        //};
        //var events = {
        //    inline: true,
        //    on: 'blur',
        //    onSuccess: restoreForm
        //};
        //$('#signup').form(rules, events);
        //
        //function restoreForm() {
        //}
        //
        //$("form").submit(function() {
        //    return false;
        //});

        $scope.resetError = function(){
            $('#password').removeClass('error');
            $scope.showError = false;
        };
        $scope.restore = function() {
            $scope.resetError();
            var password1 = /^[a-zA-Z0-9!,.?%$#@*_\-+=\\|/[\]{}()]{8,30}$/;
            var password2 = /.*[a-zA-Z].*/;
            var password3 = /.*\d.*/;
            var checkpassword1 = password1.test($scope.password);
            var checkpassword2 = password2.test($scope.password);
            var checkpassword3 = password3.test($scope.password);
            if($scope.password){
                var checkpassword4 = $scope.password.length > 7 && $scope.password.length < 31;
            }
            if ($scope.password == $scope.password2 && $scope.restoreForm.$valid) {
                Person.changePasswordByKey({
                    personId: $routeParams.id,
                    key: $routeParams.key,
                    newPass: $scope.password,
                    lang: $translate.use()
                }, function(resp) {
                    if (resp.personId) {
                        $window.location.replace('!#/organizer');
                    } else {
                        if (resp.message) {
                            if (resp.message.trim() == 'Incorrect confirm key' || resp.message.trim() == 'Неверный код подтверждения' || resp.message.trim() == 'Неправильний код підтвердження') {
                                notificationService.error($filter('translate')('You have already changed the password on this special link. For safety reasons it can not be done enough on this link. Please ask for a password reset again on') + "   <a href=\"https://cleverstaff.net?q=restore\">https://cleverstaff.net?q=restore</a>");
                            } else {
                                notificationService.error(resp.message);
                            }

                        }
                    }
                }, function(resp) {
                    if (resp.message) {
                        notificationService.error(resp.message);
                    }

                });
            }else{
                if($scope.password){
                    if($scope.password.length == 0){
                        notificationService.error($filter('translate')('enter_password'));
                        $scope.showError = true;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorEnterNumber = false;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $('#password').addClass('error');
                    }
                    if(!checkpassword3 && !checkpassword4){
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterNumberCharacters = true;
                        $scope.showErrorEnterNumber = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword2 && !checkpassword4){
                        console.log(!checkpassword2);
                        console.log(!checkpassword4);
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterLatinCharacters = true;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword1 && !checkpassword4){
                        console.log(!checkpassword1);
                        console.log(!checkpassword4);
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterCharacters = true;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword2){
                        $('#password').addClass('error');
                        $scope.errorMessage = $filter('translate')('Password should contain at least one latin letter');
                        console.log('qwerty');
                        $scope.showError = true;
                        $scope.showErrorEnterLatin = true;
                        $scope.showErrorEnterNumber = false;
                        $scope.showErrorEnterCharacters = false;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword3){
                        $scope.errorMessage = $filter('translate')('Password should contain at least one number');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterNumber = true;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterCharacters = false;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword4){
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterPassword = false;
                        return false;
                    } else if(!checkpassword1){
                        $scope.errorMessage = $filter('translate')('Password should contain only numbers and latin letters, allowed characters: !,.?%$#@*_-+=\\|/[]{}()');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        return false;
                    }
                    if($scope.password.length > 0){
                        $scope.showErrorGoodSuccess = true;
                    }
                }else{
                    notificationService.error($filter('translate')('enter_password'));
                    $scope.showError = true;
                    $scope.showErrorGoodSuccess = false;
                    $scope.showErrorEnterPassword = false;
                    $scope.showErrorEnterNumber = false;
                    $scope.showErrorEnterLatin = false;
                    $scope.showErrorEnterNumberCharacters = false;
                    $scope.showErrorEnterLatinCharacters = false;
                    $('#password').addClass('error');
                }
                if($scope.password != $scope.password2){
                    notificationService.error($filter('translate')('wrong_password2'));
                    $scope.showErrorEnterPassword = false;
                    $scope.showErrorEnterNumber = false;
                    $scope.showErrorEnterCharacters = false;
                    $scope.showErrorEnterLatin = false;
                    $scope.showErrorEnterNumberCharacters = false;
                    $scope.showErrorEnterLatinCharacters = false;
                    //$scope.showErrorGoodSuccess = true;
                }else{
                    console.log('form is not valid')
                }
            }
        }
    })
    .controller('SignupController', function($scope, $rootScope, $filter, $location, $translate, $cookies, Person, notificationService, $window) {
        $rootScope.title = $filter('translate')('Sign Up') + " | CleverStaff";
        $scope.checkPrivacyOrTerms = false;
        $("#signUpButtonDiv").hide();
        $("#signInButtonDiv").show();
        $scope.key = $location.search().key;
        $scope.registration = {};
        Person.inviteInfo({inviteKey: $scope.key}, function(resp) {
            if (false) {
                $rootScope.inviteState = resp.code;
                $scope.redirectToSigning = function () {
                    if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'ru'){
                        $window.location.replace('/ru/signin.html');
                    }else{
                        $window.location.replace('/signin.html');
                    }
                };
            } else {
                $scope.info = resp;
                $scope.registration.login = $scope.info.email;
                $scope.registration.orgName = $scope.info.orgName;
                $scope.registration.inviteKey = $scope.key;
                $scope.registration.inviter = $scope.info.inviter;
                $scope.registration.role = $scope.info.role;
                $rootScope.inviteState = 'activeInvite';
            }
        }, function(resp) {
            $location.path("/");
            notificationService.error('Service is temporarily unavailable');
        });
        $scope.resetError = function(){
            $('#firstName').removeClass('error');
            $('#password').removeClass('error');
            $scope.showError = false;
        };
        $scope.ngClickRegistration = function() {
            $scope.resetError();
            var password1 = /^[a-zA-Z0-9!,.?%$#@*_\-+=\\|/[\]{}()]{8,30}$/;
            var password2 = /.*[a-zA-Z].*/;
            var password3 = /.*\d.*/;
            var checkpassword1 = password1.test($scope.password);
            var checkpassword2 = password2.test($scope.password);
            var checkpassword3 = password3.test($scope.password);
            if($scope.password){
                var checkpassword4 = $scope.password.length > 7 && $scope.password.length < 31;
            }
            if ($scope.password == $scope.password2 && $scope.registration.firstName && $scope.registration.phone && $scope.registrationForm.$valid  && (checkpassword1 && checkpassword2 && checkpassword3 && checkpassword4)) {
                $scope.registration.password = $scope.password;


                if($scope.registration.phone == null){
                    $scope.registration.phone = +$('.select2-selection__rendered')[0].title.replace(/[A-z]/g, "").replace(/\(*\)*\+*\.*\s*/g,"").replace(/,/g,"") + $scope.registration.phone;
                }else{
                    if(!$("#countryCustom").text()){
                        $scope.registration.phone = +$("#countryCustom").text(localStorage.getItem('phone').replace(/-/g,"") + $scope.registration.phone)[0].textContent;
                    }
                }

                if(localStorage.getItem("NG_TRANSLATE_LANG_KEY") == 'ru'){
                    $scope.registration.lang = 'ru';
                }else{
                    $scope.registration.lang = 'en';
                }

                if(!$scope.checkPrivacyOrTerms){
                    notificationService.error($filter('translate')('Please read and accept the Privacy Policy and the Terms and Conditions'));
                    return;
                }

                $rootScope.loading = true;
                Person.joinInvited($scope.registration, function(resp) {
                    if (resp.status && resp.status === 'error' && resp.message) {
                        $rootScope.loading = false;
                        notificationService.error(resp.message);
                    } else {
                        Person.authorization({
                            login: $scope.registration.login,
                            password: $scope.registration.password,
                            lang: $translate.use(),
                            timeZoneOffset: new Date().getTimezoneOffset()
                        }, function(resp) {
                            $rootScope.loading = false;
                            if (resp.object.personId) {
                                localStorage.removeItem('phone');
                                $window.location.replace('!#/organizer');
                            } else {
                                if (resp.message) {
                                    if (resp.message.trim() == 'Incorrect confirm key' || resp.message.trim() == 'Неверный код подтверждения' || resp.message.trim() == 'Неправильний код підтвердження') {
                                        notificationService.error($filter('translate')('You have already changed the password on this special link. For safety reasons it can not be done enough on this link. Please ask for a password reset again on') + "   <a href=\"https://cleverstaff.net?q=restore\">https://cleverstaff.net?q=restore</a>");
                                    } else {
                                        notificationService.error(resp.message);
                                    }

                                }
                            }
                        }, function(resp) {
                            $rootScope.loading = false;
                            if (resp.message) {
                                notificationService.error(resp.message);
                            }

                        });
                    }
                })
            }else{
                if ($scope.registration.firstName){
                    if ($scope.registration.firstName.length == 0){
                        $scope.errorMessage = $filter('translate')('wrong_name');
                        $scope.showErrorName = true;
                        $scope.showError = false;
                        $scope.showErrorPhone = false;
                        $('#firstName').addClass('error');
                        return false;
                    }
                }else{
                    $scope.errorMessage = $filter('translate')('wrong_name');
                    $scope.showErrorName = true;
                    $scope.showError = false;
                    $scope.showErrorPhone = false;
                    $('#firstName').addClass('error');
                    return false;
                }
                if ($scope.registration.phone){
                    $('#phone').removeClass('error');
                    if ($scope.registration.phone.length == 0){
                        $scope.errorMessage = $filter('translate')('enter_phone');
                        $scope.showErrorPhone = true;
                        $scope.showErrorName = false;
                        $scope.showError = false;
                        $('#phone').addClass('error');
                        return false;
                    }
                }else{
                    if ($('input[name=phone]').val().length > 15){
                        $scope.errorMessage = $filter('translate')('enter_phone_length');
                        $scope.showErrorPhone = true;
                        $scope.showErrorName = false;
                        $scope.showError = false;
                        $('#phone').addClass('error');
                        return false;
                    }
                    $scope.errorMessage = $filter('translate')('enter_phone');
                    $scope.showErrorPhone = true;
                    $scope.showErrorName = false;
                    $scope.showError = false;
                    $('#phone').addClass('error');
                    return false;
                }
                if($scope.password){
                    if($scope.password.length == 0){
                        $scope.errorMessage = $filter('translate')('enter_password');
                        $scope.showError = true;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $('#password').addClass('error');
                        return false;
                    }
                    if(!checkpassword3 && !checkpassword4){
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterNumberCharacters = true;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    } else if(!checkpassword1 && !checkpassword4){
                        console.log(!checkpassword1);
                        console.log(!checkpassword4);
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterLatinCharacters = true;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorGoodSuccess = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    }else if(!checkpassword2){
                        $('#password').addClass('error');
                        $scope.errorMessage = $filter('translate')('Password should contain at least one latin letter');
                        $scope.showError = true;
                        $scope.showErrorEnterLatin = true;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    } else if(!checkpassword3){
                        $scope.errorMessage = $filter('translate')('Password should contain at least one number');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterNumber = true;
                        $scope.showErrorEnterNumberCharacters = false;
                        $scope.showErrorEnterLatinCharacters = false;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorEnterLatin = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    } else if(!checkpassword4){
                        $scope.errorMessage = $filter('translate')('Password must be 8-30 characters long');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorEnterPassword = false;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    } else if(!checkpassword1){
                        $scope.errorMessage = $filter('translate')('Password should contain only numbers and latin letters, allowed characters: !,.?%$#@*_-+=\\|/[]{}()');
                        $('#password').addClass('error');
                        $scope.showError = true;
                        $scope.showErrorName = false;
                        $scope.showErrorPhone = false;
                        return false;
                    }
                }else{
                    $scope.errorMessage = $filter('translate')('enter_password');
                    $scope.showError = true;
                    $scope.showErrorEnterPassword = true;
                    $scope.showErrorGoodSuccess = false;
                    $scope.showErrorName = false;
                    $scope.showErrorPhone = false;
                    $('#password').addClass('error');
                    return false;
                }
                if($scope.password != $scope.password2){
                    notificationService.error($filter('translate')('wrong_password2'));
                    $scope.showErrorEnterPassword = false;
                    $scope.showErrorEnterNumber = false;
                    $scope.showErrorEnterLatin = false;
                    $scope.showErrorEnterNumberCharacters = false;
                    $scope.showErrorEnterLatinCharacters = false;
                    $scope.showErrorGoodSuccess = true;
                    $('#password2').addClass('error');
                    return false;
                }else{
                    console.log('form is not valid')
                }
            }
        };

        setTimeout(function(){
            var isoCountries = [
                { id: 'AF', text: 'Afghanistan (+93)', value: '+93'},
                { id: 'AX', text: 'Aland Islands (+358)', value: '+358'},
                { id: 'AL', text: 'Albania (+355)', value: '+355'},
                { id: 'DZ', text: 'Algeria (+213)', value: '+213'},
                { id: 'AS', text: 'American Samoa (+1)', value: '+1'},
                { id: 'AD', text: 'Andorra (+376)', value: '+376'},
                { id: 'AO', text: 'Angola (+244)', value: '+244'},
                { id: 'AI', text: 'Anguilla (+1264)', value: '+1264'},
                { id: 'AQ', text: 'Antarctica (+672)', value: '+672'},
                { id: 'AG', text: 'Antigua And Barbuda (+1268)', value: '+1268'},
                { id: 'AR', text: 'Argentina (+54)', value: '+54'},
                { id: 'AM', text: 'Armenia (+374)', value: '+374'},
                { id: 'AW', text: 'Aruba (+297)', value: '+297'},
                { id: 'AU', text: 'Australia (+61)', value: '+61'},
                { id: 'AT', text: 'Austria (+43)', value: '+43'},
                { id: 'AZ', text: 'Azerbaijan (+994)', value: '+994'},
                { id: 'BS', text: 'Bahamas (+1242)', value: '+1242'},
                { id: 'BH', text: 'Bahrain (+973)', value: '+973'},
                { id: 'BD', text: 'Bangladesh (+880)', value: '+880'},
                { id: 'BB', text: 'Barbados (+1246)', value: '+1246'},
                { id: 'BY', text: 'Belarus (+375)', value: '+375'},
                { id: 'BE', text: 'Belgium (+32)', value: '+32'},
                { id: 'BZ', text: 'Belize (+501)', value: '+501'},
                { id: 'BJ', text: 'Benin (+229)', value: '+229'},
                { id: 'BM', text: 'Bermuda (+1441)', value: '+1441'},
                { id: 'BT', text: 'Bhutan (+975)', value: '+975'},
                { id: 'BO', text: 'Bolivia (+591)', value: '+591'},
                { id: 'BA', text: 'Bosnia And Herzegovina (+387)', value: '+387'},
                { id: 'BW', text: 'Botswana (+267)', value: '+267'},
                { id: 'BV', text: 'Bouvet Island (+47)', value: '+47'},
                { id: 'BR', text: 'Brazil (+55)', value: '+55'},
                { id: 'IO', text: 'British Indian Ocean Territory (+246)', value: '+246'},
                { id: 'BN', text: 'Brunei Darussalam (+673)', value: '+673'},
                { id: 'BG', text: 'Bulgaria (+359)', value: '+359'},
                { id: 'BF', text: 'Burkina Faso (+226)', value: '+226'},
                { id: 'BI', text: 'Burundi (+257)', value: '+257'},
                { id: 'KH', text: 'Cambodia (+855)', value: '+855'},
                { id: 'CM', text: 'Cameroon (+237)', value: '+237'},
                { id: 'CA', text: 'Canada (+1)', value: '+1'},
                { id: 'CV', text: 'Cape Verde Islands (+238)', value: '+238'},
                { id: 'KY', text: 'Cayman Islands (+1345)', value: '+1345'},
                { id: 'CF', text: 'Central African Republic (+236)', value: '+236'},
                { id: 'TD', text: 'Chad (+235)', value: '+235'},
                { id: 'CL', text: 'Chile (+56)', value: '+56'},
                { id: 'CN', text: 'China (+86)', value: '+86'},
                { id: 'CX', text: 'Christmas Island (+672)', value: '+672'},
                { id: 'CC', text: 'Cocos (Keeling) Islands (+225)', value: '+225'},
                { id: 'CO', text: 'Colombia (+57)', value: '+57'},
                { id: 'KM', text: 'Comoros (+269)', value: '+269'},
                { id: 'CG', text: 'Congo (+242)', value: '+242'},
                { id: 'CD', text: 'Congo, Democratic Republic (+243)', value: '+243'},
                { id: 'CK', text: 'Cook Islands (+682)', value: '+682'},
                { id: 'CR', text: 'Costa Rica (+506)', value: '+506'},
                { id: 'CI', text: 'Cote D\'Ivoire (+225)', value: '+225'},
                { id: 'HR', text: 'Croatia (+385)', value: '+385'},
                { id: 'CU', text: 'Cuba (+53)', value: '+53'},
                { id: 'CY', text: 'Cyprus (+90)', value: '+90'},
                { id: 'CZ', text: 'Czech Republic (+420)', value: '+420'},
                { id: 'DK', text: 'Denmark (+45)', value: '+45'},
                { id: 'DJ', text: 'Djibouti (+253)', value: '+253'},
                { id: 'DM', text: 'Dominica (+1809)', value: '+1809'},
                { id: 'DO', text: 'Dominican Republic (+1809)', value: '+1809'},
                { id: 'EC', text: 'Ecuador (+593)', value: '+593'},
                { id: 'EG', text: 'Egypt (+20)', value: '+20'},
                { id: 'SV', text: 'El Salvador (+503)', value: '+503'},
                { id: 'GQ', text: 'Equatorial Guinea (+240)', value: '+240'},
                { id: 'ER', text: 'Eritrea (+291)', value: '+291'},
                { id: 'EE', text: 'Estonia (+372)', value: '+372'},
                { id: 'ET', text: 'Ethiopia (+251)', value: '+251'},
                { id: 'FK', text: 'Falkland Islands (Malvinas) (+500)', value: '+500'},
                { id: 'FO', text: 'Faroe Islands (+298)', value: '+298'},
                { id: 'FJ', text: 'Fiji (+679)', value: '+679'},
                { id: 'FI', text: 'Finland (+358)', value: '+358'},
                { id: 'FR', text: 'France (+33)', value: '+33'},
                { id: 'GF', text: 'French Guiana (+594)', value: '+594'},
                { id: 'PF', text: 'French Polynesia (+689)', value: '+689'},
                { id: 'TF', text: 'French Southern Territories (+689)', value: '+689'},
                { id: 'GA', text: 'Gabon (+241)', value: '+241'},
                { id: 'GM', text: 'Gambia (+220)', value: '+220'},
                { id: 'GE', text: 'Georgia (+7880)', value: '+7880'},
                { id: 'DE', text: 'Germany (+49)', value: '+49'},
                { id: 'GH', text: 'Ghana (+233)', value: '+233'},
                { id: 'GI', text: 'Gibraltar (+350)', value: '+350'},
                { id: 'GR', text: 'Greece (+30)', value: '+30'},
                { id: 'GL', text: 'Greenland (+299)', value: '+299'},
                { id: 'GD', text: 'Grenada (+1473)', value: '+1473'},
                { id: 'GP', text: 'Guadeloupe (+590)', value: '+590'},
                { id: 'GU', text: 'Guam (+671)', value: '+671'},
                { id: 'GT', text: 'Guatemala (+502)', value: '+502'},
                { id: 'GG', text: 'Guernsey (+44)', value: '+44'},
                { id: 'GN', text: 'Guinea (+224)', value: '+224'},
                { id: 'GW', text: 'Guinea-Bissau (+245)', value: '+245'},
                { id: 'GY', text: 'Guyana (+592)', value: '+592'},
                { id: 'HT', text: 'Haiti (+509)', value: '+509'},
                { id: 'HM', text: 'Heard Island & Mcdonald Islands (+61)', value: '+61'},
                { id: 'VA', text: 'Holy See (Vatican City State) (+39)', value: '+39'},
                { id: 'HN', text: 'Honduras (+504)', value: '+504'},
                { id: 'HK', text: 'Hong Kong (+852)', value: '+852'},
                { id: 'HU', text: 'Hungary (+36)', value: '+36'},
                { id: 'IS', text: 'Iceland (+354)', value: '+354'},
                { id: 'IN', text: 'India(+91)', value: '+91'},
                { id: 'ID', text: 'Indonesia (+62)', value: '+62'},
                { id: 'IR', text: 'Iran, Islamic Republic Of (+98)', value: '+98'},
                { id: 'IQ', text: 'Iraq (+964)', value: '+964'},
                { id: 'IE', text: 'Ireland (+353)', value: '+353'},
                { id: 'IM', text: 'Isle Of Man (+44)', value: '+44'},
                { id: 'IL', text: 'Israel (+972)', value: '+975'},
                { id: 'IT', text: 'Italy (+39)', value: '+39'},
                { id: 'JM', text: 'Jamaica (+1876)', value: '+1876'},
                { id: 'JP', text: 'Japan (+81)', value: '+81'},
                { id: 'JE', text: 'Jersey (+44-1534)', value: '+44-1534'},
                { id: 'JO', text: 'Jordan (+962)', value: '+962'},
                { id: 'KZ', text: 'Kazakhstan (+7)', value: '+7'},
                { id: 'KE', text: 'Kenya (+254)', value: '+254'},
                { id: 'KI', text: 'Kiribati (+686)', value: '+686'},
                { id: 'KP', text: 'Korea - North (+850)', value: '+850'},
                { id: 'KR', text: 'Korea - South (+82)', value: '+82'},
                { id: 'KW', text: 'Kuwait (+965)', value: '+965'},
                { id: 'KG', text: 'Kyrgyzstan (+996)', value: '+996'},
                { id: 'LA', text: 'Lao People\'s Democratic Republic (+856)', value: '+856'},
                { id: 'LV', text: 'Latvia (+371)', value: '+371'},
                { id: 'LB', text: 'Lebanon (+961)', value: '+961'},
                { id: 'LS', text: 'Lesotho (+266)', value: '+266'},
                { id: 'LR', text: 'Liberia (+231)', value: '+231'},
                { id: 'LY', text: 'Libyan Arab Jamahiriya (+218)', value: '+218'},
                { id: 'LI', text: 'Liechtenstein (+417)', value: '+417'},
                { id: 'LT', text: 'Lithuania (+370)', value: '+370'},
                { id: 'LU', text: 'Luxembourg (+352)', value: '+352'},
                { id: 'MO', text: 'Macao (+853)', value: '+853'},
                { id: 'MK', text: 'Macedonia (+389)', value: '+389'},
                { id: 'MG', text: 'Madagascar (+261)', value: '+261'},
                { id: 'MW', text: 'Malawi (+265)', value: '+265'},
                { id: 'MY', text: 'Malaysia (+60)', value: '+60'},
                { id: 'MV', text: 'Maldives (+960)', value: '+960'},
                { id: 'ML', text: 'Mali (+223)', value: '+223'},
                { id: 'MT', text: 'Malta (+356)', value: '+356'},
                { id: 'MH', text: 'Marshall Islands (+692)', value: '+692'},
                { id: 'MQ', text: 'Martinique (+596)', value: '+596'},
                { id: 'MR', text: 'Mauritania (+222)', value: '+222'},
                { id: 'MU', text: 'Mauritius (+230)', value: '+230'},
                { id: 'YT', text: 'Mayotte (+269)', value: '+269'},
                { id: 'MX', text: 'Mexico (+52)', value: '+52'},
                { id: 'FM', text: 'Micronesia, Federated States Of (+691)', value: '+691'},
                { id: 'MD', text: 'Moldova (+373)', value: '+373'},
                { id: 'MC', text: 'Monaco (+377)', value: '+377'},
                { id: 'MN', text: 'Mongolia (+976)', value: '+976'},
                { id: 'ME', text: 'Montenegro (+382)', value: '+382'},
                { id: 'MS', text: 'Montserrat (+1664)', value: '+1664'},
                { id: 'MA', text: 'Morocco (+212)', value: '+212'},
                { id: 'MZ', text: 'Mozambique (+258)', value: '+258'},
                { id: 'MM', text: 'Myanmar (+95)', value: '+95'},
                { id: 'NA', text: 'Namibia (+264)', value: '+264'},
                { id: 'NR', text: 'Nauru (+674)', value: '+674'},
                { id: 'NP', text: 'Nepal (+977)', value: '+977'},
                { id: 'NL', text: 'Netherlands (+31)', value: '+31'},
                { id: 'AN', text: 'Netherlands Antilles (+599)', value: '+599'},
                { id: 'NC', text: 'New Caledonia (+687)', value: '+687'},
                { id: 'NZ', text: 'New Zealand (+64)', value: '+64'},
                { id: 'NI', text: 'Nicaragua (+505)', value: '+505'},
                { id: 'NE', text: 'Niger (+227)', value: '+227'},
                { id: 'NG', text: 'Nigeria (+234)', value: '+234'},
                { id: 'NU', text: 'Niue (+683)', value: '+683'},
                { id: 'NF', text: 'Norfolk Island (+672)', value: '+672'},
                { id: 'MP', text: 'Northern Mariana Islands (+670)', value: '+670'},
                { id: 'NO', text: 'Norway (+47)', value: '+47'},
                { id: 'OM', text: 'Oman (+968)', value: '+968'},
                { id: 'PK', text: 'Pakistan (+92)', value: '+92'},
                { id: 'PW', text: 'Palau (+680)', value: '+680'},
                { id: 'PS', text: 'Palestinian Territory (+970)', value: '+970'},
                { id: 'PA', text: 'Panama (+507)', value: '+507'},
                { id: 'PG', text: 'Papua New Guinea (+675)', value: '+675'},
                { id: 'PY', text: 'Paraguay (+595)', value: '+595'},
                { id: 'PE', text: 'Peru (+51)', value: '+51'},
                { id: 'PH', text: 'Philippines (+63)', value: '+63'},
                { id: 'PN', text: 'Pitcairn (+64)', value: '+64'},
                { id: 'PL', text: 'Poland (+48)', value: '+48'},
                { id: 'PT', text: 'Portugal (+351)', value: '+351'},
                { id: 'PR', text: 'Puerto Rico (+1787)', value: '+1787'},
                { id: 'QA', text: 'Qatar (+974)', value: '+974'},
                { id: 'RE', text: 'Reunion (+262)', value: '+262'},
                { id: 'RO', text: 'Romania (+40)', value: '+40'},
                { id: 'RU', text: 'Russian Federation (+7)', value: '+7'},
                { id: 'RW', text: 'Rwanda (+250)', value: '+250'},
                { id: 'BL', text: 'Saint Barthelemy (+590)', value: '+590'},
                { id: 'SH', text: 'Saint Helena (+290)', value: '+94'},
                { id: 'KN', text: 'Saint Kitts And Nevis (+1869)', value: '+94'},
                { id: 'LC', text: 'Saint Lucia (+1758)', value: '+94'},
                { id: 'MF', text: 'Saint Martin (+590)', value: '+590'},
                { id: 'PM', text: 'Saint Pierre And Miquelon (+508)', value: '+508'},
                { id: 'VC', text: 'Saint Vincent And Grenadines (+1-784)', value: '+1-784'},
                { id: 'WS', text: 'Samoa (+685)', value: '+685'},
                { id: 'SM', text: 'San Marino (+378)', value: '+378'},
                { id: 'ST', text: 'Sao Tome And Principe (+239)', value: '+239'},
                { id: 'SA', text: 'Saudi Arabia (+966)', value: '+966'},
                { id: 'SN', text: 'Senegal (+221)', value: '+221'},
                { id: 'RS', text: 'Serbia (+381)', value: '+381'},
                { id: 'SC', text: 'Seychelles (+248)', value: '+248'},
                { id: 'SL', text: 'Sierra Leone (+232)', value: '+232'},
                { id: 'SG', text: 'Singapore (+65)', value: '+65'},
                { id: 'SK', text: 'Slovakia (+421)', value: '+421'},
                { id: 'SI', text: 'Slovenia (+386)', value: '+386'},
                { id: 'SB', text: 'Solomon Islands (+677)', value: '+677'},
                { id: 'SO', text: 'Somalia (+252)', value: '+252'},
                { id: 'ZA', text: 'South Africa (+27)', value: '+27'},
                { id: 'GS', text: 'South Georgia And Sandwich Isl. (+500)', value: '+500'},
                { id: 'ES', text: 'Spain (+34)', value: '+34'},
                { id: 'LK', text: 'Sri Lanka (+94)', value: '+94'},
                { id: 'SD', text: 'Sudan (+249)', value: '+249'},
                { id: 'SR', text: 'Suriname (+597)', value: '+597'},
                { id: 'SJ', text: 'Svalbard And Jan Mayen (+47)', value: '+47'},
                { id: 'SZ', text: 'Swaziland (+268)', value: '+268'},
                { id: 'SE', text: 'Sweden (+46)', value: '+46'},
                { id: 'CH', text: 'Switzerland (+41)', value: '+41'},
                { id: 'SY', text: 'Syrian Arab Republic (+963)', value: '+963'},
                { id: 'TW', text: 'Taiwan (+886)', value: '+886'},
                { id: 'TJ', text: 'Tajikistan (+992)', value: '+992'},
                { id: 'TZ', text: 'Tanzania (+255)', value: '+255'},
                { id: 'TH', text: 'Thailand (+66)', value: '+66'},
                { id: 'TL', text: 'Timor-Leste (+670)', value: '+670'},
                { id: 'TG', text: 'Togo (+228)', value: '+228'},
                { id: 'TK', text: 'Tokelau (+690)', value: '+690'},
                { id: 'TO', text: 'Tonga (+676)', value: '+676'},
                { id: 'TT', text: 'Trinidad And Tobago (+1868)', value: '+1868'},
                { id: 'TN', text: 'Tunisia (+216)', value: '+216'},
                { id: 'TR', text: 'Turkey (+90)', value: '+90'},
                { id: 'TM', text: 'Turkmenistan (+993)', value: '+993'},
                { id: 'TC', text: 'Turks And Caicos Islands (+1649)', value: '+1649'},
                { id: 'TV', text: 'Tuvalu (+688)', value: '+668'},
                { id: 'UG', text: 'Uganda (+256)', value: '+256'},
                { id: 'UA', text: 'Ukraine (+380)', value: '+380'},
                { id: 'AE', text: 'United Arab Emirates (+971)', value: '+971'},
                { id: 'GB', text: 'United Kingdom (+44)', value: '+44'},
                { id: 'US', text: 'United States (+1)', value: '+1'},
                { id: 'UM', text: 'United States Outlying Islands (+1-340)', value: '+1-340'},
                { id: 'UY', text: 'Uruguay (+598)', value: '+598'},
                { id: 'UZ', text: 'Uzbekistan (+998)', value: '+998'},
                { id: 'VU', text: 'Vanuatu (+678)', value: '+678'},
                { id: 'VE', text: 'Venezuela (+58)', value: '+58'},
                { id: 'VN', text: 'Vietnam (+84)', value: '+84'},
                { id: 'VG', text: 'Virgin Islands, British (+1)', value: '+1'},
                { id: 'VI', text: 'Virgin Islands, U.S. (+1)', value: '+1'},
                { id: 'WF', text: 'Wallis And Futuna (+681)', value: '+681'},
                { id: 'EH', text: 'Western Sahara (+212)', value: '+212'},
                { id: 'YE', text: 'Yemen (North)(+969)', value: '+969'},
                { id: 'YE', text: 'Yemen (South)(+967)', value: '+967'},
                { id: 'ZM', text: 'Zambia (+260)', value: '+260'},
                { id: 'ZW', text: 'Zimbabwe (+263)', value: '+263'}
            ];
            $.ajax({
                url: "/hr/public/getUserLocation",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                complete: function(resp){
                    $.each(isoCountries, function(index, value) {
                        if(resp.responseJSON.countryCode != undefined && resp.responseJSON.countryCode == value.id){
                            $('.select2-chosen')[0].innerHTML = '<span class="flag-icon flag-icon-'+ value.id.toLowerCase() +' flag-icon-squared"></span>' + '<span class="flag-text" style="margin-left: 5px;">'+ value.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"")+"</span>";
                            $('.select2-chosen')[0].title = value.text;
                            var country = $('input[name=country]');
                            country.val(value.text);
                            var phone = $('#countryCustom');
                            phone.value = value.value.replace("+","");
                            localStorage.setItem("phone",  phone.value);
                        }
                    });
                }
            });
        }, 0);

        var userLang = navigator.language || navigator.userLanguage;
        var lST = userLang.substring(0, 2);
    })
    .controller('PublicVacancyController', ["$rootScope", "$scope", "$filter", "$location", "$routeParams", "$sce" , "$translate", "Service",
        "notificationService", "FileInit", "serverAddress", "$window", "Company", "$uibModal" ,
        function($rootScope, $scope, $filter, $location, $routeParams, $sce , $translate, Service,
                 notificationService, FileInit, serverAddress, $window, Company, $uibModal) {


            $rootScope.closeModal = function(){
                $scope.modalInstance.close();
                $('body').removeClass('modal-open-public-vacancy-form');
            };

        if($location.$$absUrl.indexOf('/pv/') >= 0){
            var string = $location.$$path;
            string = string.replace("/pv/", "vacancy-");
            console.log(string);
            $window.location.replace('/i#/' + string);
        }
        $("#signUpButtonDiv").hide();
        $("#signInButtonDiv").hide();
        $scope.message = 'def';
        $rootScope.header = "two";
        $scope.serverAddress = serverAddress;
        $scope.request = {
            name: null,
            lastName: null,
            phone: null,
            message: null,
            vacancyId: $scope.vacancyId,
            fileId: null
        };

            $.getScript("https://platform.linkedin.com/in.js?async=true", function success() {
                IN.init({
                    api_key: apiKey.linkedIn.api_key,
                    scope: "r_emailaddress w_share"
                });
            });
            $.getScript('//connect.facebook.net/en_UK/all.js', function () {
                FB.init({
                    appId: apiKey.facebook.appId,
                    version: 'v2.9'
                });
            });

            $(window).scroll(function(){
                if($('.vacancy-info').offset() && $(window).scrollTop() >= $('.vacancy-info').offset().top - 10) {
                    $('.apply-buttons').addClass("fixed")
                } else {
                    if($('.apply-buttons').hasClass("fixed")) {
                        $('.apply-buttons').removeClass("fixed");
                    }
                }
            });


            $scope.share = function (sourse) {
                if ($scope.companyLogo != undefined && $scope.companyLogo !== '') {
                    $scope.publicImgLink = $location.$$protocol + "://" + $location.$$host + $scope.serverAddress + '/getlogo?id=' + $scope.companyLogo;
                } else {
                    $scope.publicImgLink = "https://cleverstaff.net/images/sprite/icon_128_128_png.png";
                }
                $scope.publicDescr = '';
                var link = $location.$$protocol + "://" + $location.$$host + "/i#/pv/" + $scope.vacancy.localId;
                angular.forEach(angular.element($scope.vacancy.descr).text().replace("\r\n", "\n").split("\n"), function (val) {
                    if (val !== undefined && val !== '') {
                        $scope.publicDescr += val + " ";
                    }
                });

                if ($scope.serverAddress === '/hrdemo') {
                    link = $location.$$protocol + "://" + $location.$$host + "/di#/pv/" + $scope.vacancy.localId;
                }
                if (sourse === 'linkedin') {
                    if (!IN.User.isAuthorized()) {
                        IN.User.authorize(function () {
                            IN.API.Raw("/people/~/shares")
                                .method("POST")
                                .body(JSON.stringify({
                                    "content": {
                                        "title": $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                        "description": $scope.publicDescr,
                                        "submitted-url": link,
                                        "submitted-image-url": $scope.publicImgLink
                                    },
                                    "visibility": {
                                        "code": "anyone"
                                    },
                                    "comment": ''
                                }))
                                .result(function (r) {
                                    notificationService.success($filter('translate')('Vacancy posted on your LinkedIn'));
                                })
                                .error(function (r) {
                                    notificationService.error(r.message);
                                });
                        }, "w_share");
                    } else {
                        IN.API.Raw("/people/~/shares")
                            .method("POST")
                            .body(JSON.stringify({
                                "content": {
                                    "title": $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                    "description": $scope.publicDescr,
                                    "submitted-url": link,
                                    "submitted-image-url": $scope.publicImgLink
                                },
                                "visibility": {
                                    "code": "anyone"
                                },
                                "comment": ""
                            }))
                            .result(function (r) {
                                notificationService.success($filter('translate')('Vacancy posted on your LinkedIn'));
                            })
                            .error(function (r) {
                                notificationService.error(r.message);
                            });
                    }
                }
                if (sourse === 'facebook') {

                    FB.getLoginStatus(function (response) {
                        if (response.status === 'connected') {
                            FB.ui({
                                    method: 'feed',
                                    name: $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                    caption: '',
                                    description: $scope.publicDescr,
                                    link: link,
                                    picture: $scope.publicImgLink
                                },
                                function (response) {
                                    if (response && response.post_id) {
                                        notificationService.success($filter('translate')('Vacancy posted on your Facebook'));
                                    } else {
                                        notificationService.error($filter('translate')('Vacancy hasn\'t shared'));
                                    }
                                });
                        }
                        else {
                            FB.login(function () {
                                FB.ui({
                                        method: 'feed',
                                        name: $filter('translate')('Vacancy') + ' ' + $scope.vacancy.position,
                                        caption: '',
                                        description: $scope.publicDescr,
                                        link: link,
                                        picture: $scope.publicImgLink
                                    },
                                    function (response) {
                                        if (response && response.post_id) {
                                            a;
                                            notificationSecvice.success($filter('translate')('Vacancy posted on your Facebook'));
                                        } else {
                                            notificationService.error($filter('translate')('Vacancy hasn\'t shared'));
                                        }
                                    });
                            });
                        }
                    });
                }
            };

            $scope.addRecallFromLinkedIn = function () {
                IN.User.authorize(function () {
                    IN.API.Profile("me").fields(["site-standard-profile-request", "public-profile-url", "first-name", "last-name", "email-address", "phone-numbers", "bound-account-types", "headline", "summary", "specialties", "positions", "educations"]).result(function (me) {
                        parseLinkedInInformationForRecall(me, $scope);
                        $scope.showRecallFromModal();
                    });
                });
            };
            $scope.show = true;
            FileInit.initFileOption($scope, "public", {
                allowedType: ["docx", "doc", "pdf", "odt"],
                maxSize: 5242880
            }, $filter);
            $scope.filesForRecall = [];
            $scope.callbackFile = function (var1, var2) {
                $scope.message = 'def';
                $scope.filesForRecall.push({name: var2, attId: var1})
            };

            $scope.callbackFileError = function () {
                $scope.message = 'error_file';
            };
            var vacancyId = null;
            if ($routeParams.vacancyId.indexOf("#") != -1) {
                vacancyId = $routeParams.vacancyId.split("#")[0];
            } else {
                vacancyId = $routeParams.vacancyId;
            }
            $scope.getCompanyParams = function(){
                Company.getParams(function(resp){
                    $scope.companyParams = resp.object;
                    $rootScope.publicLink = $location.$$protocol + "://" + $location.$$host + ":8080/i#/" + $scope.companyParams.nameAlias + "-vacancies";
                });
            };
            // $scope.getCompanyParams();
            $scope.orgName = null;
            $scope.loadStatusForPublicVacancy = false;
            Service.publicVacancy({id: vacancyId, host: document.referrer}, function (resp) {
                console.log(resp);
                if (resp.status && resp.status === 'error' && resp.message) {
                    $scope.vacancyFound = false;
                } else {
                    $scope.vacancyId = resp.object.vacancyId;
                    $scope.request.vacancyId = resp.object.vacancyId;
                    $rootScope.title = resp.object.position + " - " + $filter('translate')('vacancy_in') + " CleverStaff";
                    $rootScope.vacancyName = resp.object.position;
                    if (resp.object.region != undefined) {
                        $rootScope.region = resp.object.region.fullName;
                    }
                    $scope.vacancy = resp.object;
                    $scope.companyPublicInfo = {};
                    $scope.companyPublicInfo.fb = $scope.vacancy.linkToCompanyFaceBookPage;
                    $scope.companyPublicInfo.companyWebSite = $scope.vacancy.linkToCompanySite;
                    $scope.companyPublicInfo.orgName = $scope.vacancy.orgName;
                    $scope.vacancyFound = true;
                    //$location.hash('');
                    $location.search($filter('transliteration')(resp.object.position.replace(/\W+/g, '_'))).replace();
                    $scope.loadStatusForPublicVacancy = true;
                    //setTimeout(function(){
                    //    if (performance.navigation.type == 1) {
                    //        $location.$$absUrl
                    //    } else {
                    //        history.pushState(null, "", $rootScope.publicLink);
                    //    }
                    //    if($location.$$host == '127.0.0.1'){
                    //        history.pushState(null, "", $location.$$protocol + "://" + $location.$$host + ":8080/i#" + $location.$$path + "?" + deleteTenSpaces);
                    //    }else{
                    //        history.pushState(null, "", $location.$$protocol + "://" + $location.$$host + "/i#" + $location.$$path + "?" + deleteTenSpaces);
                    //    }
                    //}, 1000);
                    // Service.getOrgLogoId({orgId: resp.object.orgId}, function (logoResp) {
                    //     if (logoResp.status && logoResp.status === 'ok') {
                    //         $scope.companyLogo = logoResp.object;
                    //     }
                    // });
                }
            }, function () {
            });
            $scope.to_trusted = function (html_code) {
                return $sce.trustAsHtml(html_code);
            };
            $scope.removeFile = function (id) {
                angular.forEach($scope.filesForRecall, function (val, ind) {
                    if (val.attId == id) {
                        $scope.filesForRecall.splice(ind, 1);
                    }
                });
            };
            $scope.showErrorEmailMessage = false;
            $scope.incorrectPhoneNumber = false;
            $('#email2').on('input', function () {
                $scope.request.email = $(this).val();
                $scope.changeEmail();
                $scope.$apply();
            });
            $rootScope.changeEmail = function(email){
                if(email.length > 0){
                    $scope.showErrorEmailMessage = false;
                }
            };
            $scope.showErrorPhoneMessage = false;
            $('#phone').on('input', function () {
                $scope.showErrorPhoneMessage = false;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
            $scope.changeEmail = function () {
                if ($scope.request.email == undefined) {
                    $scope.showErrorEmailMessage = true;
                } else $scope.showErrorEmailMessage = $scope.request.email.length == 0;
            };
            $scope.enterPhoneNumber = false;
            $scope.changePhone = function (phone) {
                //$scope.recallForm.phone.$invalid = false;
                if(phone == undefined){
                    $scope.enterPhoneNumber = true;
                    $scope.incorrectPhoneNumber = false;
                    $scope.showErrorPhoneMessage = true;
                }else if(phone.length > 0){
                    $scope.showErrorPhoneMessage = false;
                }
            };
            $scope.$watch('request.phone', function (newVal, oldVal) {
                if(newVal != undefined && oldVal != newVal){
                    $scope.showErrorPhoneMessage = false;
                }
            });

            $scope.showModalInfoAboutVacancy = function() {
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/vacancy-added-response.html',
                    size: '',
                    resolve: {

                    }
                });
            };

            $scope.showRecallFromModal = function() {
                $scope.showErrorEmailMessage = false;
                $scope.showErrorPhoneMessage = false;
                $scope.showErrorCvFileMessage = false;
                $('body').addClass('modal-open-public-vacancy-form');
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../partials/modal/public-vacancy-form.html?b=10',
                    size: '',
                    scope: $scope,
                    resolve: {

                }
            });
        };
            $scope.accessPreson = false;
        $scope.sendRequest = function (recallForm, accessPreson) {
            $scope.recallForm = recallForm;
            $scope.showErrorCvFileMessage = true;
          if ($scope.recallForm.$valid) {
                if ($scope.request.email != undefined && $scope.request.email.length == 0) {
                    $scope.request.email = "";
                }
                if (validEmail($scope.request.email)) {
                    $scope.showErrorEmailMessage = true;
                    return;
                }else{
                    $scope.showErrorEmailMessage = false;
                }

                if ($scope.filesForRecall.length != 0) {
                    angular.forEach($scope.filesForRecall, function (resp) {
                        delete resp.$$hashKey;
                    });
                    $scope.request.fileId = JSON.stringify($scope.filesForRecall);
                }
                if ($scope.request.message != undefined && $scope.request.message.length == 0) {
                    $scope.request.message = "";
                } else if ($scope.request.message == undefined) {
                    $scope.request.message = "";
                }

                $scope.request.lang = $translate.use();
                $scope.request.email = $('#email2').val();
                $scope.request.phone = String($scope.request.phone);
                if ($scope.request.phone == undefined || $scope.request.phone.match(/^[\(\)\s\-\+\d]{9,20}$/) == null) {
                    $scope.showErrorPhoneMessage = true;
                    $scope.enterPhoneNumber = false;
                    $scope.incorrectPhoneNumber = true;
                    return false;
                }else{
                    $scope.showErrorPhoneMessage = false;
                }
                if($scope.filesForRecall.length == 0){
                    $scope.showErrorCvFileMessage = true;
                }else{
                    Service.addCandidate($scope.request, function (resp) {
                        if (resp.status && resp.status === 'error' && resp.message) {
                            $scope.message = "error";
                        } else {
                            $scope.message = "success";
                            $scope.request = {
                                name: "",
                                lastName: "",
                                phone: "",
                                message: "",
                                vacancyId: $scope.vacancyId,
                                fileId: null
                            };
                            // $("#email2").val("");
                            $scope.filesForRecall = [];
                            $scope.recallForm.name.$pristine = true;
                            $scope.recallForm.last_name.$pristine = true;
                            $scope.recallForm.phone.$pristine = true;
                            $scope.recallForm.phone.$invalid = false;
                            $scope.recallForm.email2.$invalid = false;
                            $scope.recallForm.email2.$pristine = false;
                            $scope.showErrorEmailMessage = false;
                            $('body').removeClass('modal-open-public-vacancy-form');
                            $rootScope.closeModal();
                            $scope.showModalInfoAboutVacancy();
                        }

                    }, function (resp) {
                        $scope.message = "error";
                    });
                }
            } else {

              if(!accessPreson) notificationService.error($translate.instant("You need to give your consent for your personal data to processing proceed"));

              $scope.recallForm.name.$pristine = false;
                $scope.recallForm.last_name.$pristine = false;
                if (validEmail($scope.request.email)) {
                    $scope.showErrorEmailMessage = true;
                }
                $scope.recallForm.phone.$pristine = false;
                if($scope.request.phone == null || $scope.request.phone.length == 0){
                    $scope.enterPhoneNumber = true;
                }else if($scope.request.phone.length < 9 || $scope.request.phone.length > 20){
                    $scope.showErrorPhoneMessage = true;
                    $scope.incorrectPhoneNumber = true;
                    $scope.enterPhoneNumber = false;
                }else{
                    $scope.incorrectPhoneNumber = true;
                    $scope.enterPhoneNumber = false;
                }
            }
        };
    }])
    .controller('PublicVacancyAddController', function($rootScope, $scope, $filter, $location, $translate, Service, notificationService) {
            $rootScope.hasJS = true;
            $scope.orgId = 'c0f3bac6a94e4c2290618907e8dba636';
            Service.saveAccessLogEntry({value: $scope.orgId, host: document.referrer, type: "public_add_vacancy"});


            $rootScope.title = "Форма додавання вакансії";
            $translate.use("ua");

            var google_url = "https://accounts.google.com/o/oauth2/auth" +
                "?client_id=" + apiKey.google.client_id +
                "&scope=email%20profile" +
                "&state=/profile" +
                "&redirect_uri=" + location.protocol + "//" + document.domain + "/white.html" +
                "&response_type=code%20token" +
                "&approval_prompt=auto";

            $scope.employmentType = Service.employmentType();
            Service.genderTwo($scope);
            $scope.currency = Service.currency();
            $scope.langs = ["Англійський розмовний",
                "Англійський професійний",
                "Англійський середній",
                "Англійський починаючий",
                "Російський розмовний",
                "Російський професійний",
                "Російський середній",
                "Російський починаючий",
                "Український розмовний",
                "Український професійний",
                "Український середній",
                "Український починаючий",
                "Білоруський розмовний",
                "Білоруський професійний",
                "Білоруський середній",
                "Білоруський починаючий",
                "Казахський розмовний",
                "Казахський професійний",
                "Казахський середній",
                "Казахський починаючий",
                "Молдавський розмовний",
                "Молдавський професійний",
                "Молдавський середній",
                "Молдавський починаючий"];
            $scope.industries = Service.getIndustries();

            $('.select2-lang').select2({
                tags: $scope.langs,
                tokenSeparators: [",", " "]
            });

            $scope.errorMessage = {
                show: false,
                message: ""
            };
            $scope.map = {
                center: {
                    latitude: 48.379433,
                    longitude: 31.165579999999977
                },
                zoom: 5,
                options: {
                    panControl: true,
                    zoomControl: true,
                    scaleControl: true,
                    mapTypeControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
            };
            $scope.marker = {
                id: 1,
                title: "",
                coords: {
                    latitude: null,
                    longitude: null
                }
            };
            $scope.companyData = {
                input: "",
                inputFocused: false,
                clients: [],
                clientsAfterSearch: [],
                wrongName: false
            };
            $scope.company = {
                name: "",
                firstName: "",
                phone: "",
                email: "",
                industry: "",
                site: "",
                descr: ""
            };

            $scope.focusOffCompany = function() {
                var checkName = false;
                angular.forEach($scope.companyData.clients, function(val) {
                    if (val == $scope.companyData.input) {
                        checkName = true;
                    }
                });
                if (checkName) {
                    $scope.companyData.wrongName = false;
                } else {
                    $scope.companyData.wrongName = $scope.companyData.input && $scope.companyData.input.length != 0;
                }
                $scope.companyData.inputFocused = true;
            };


            Service.getClientNames({orgId: $scope.orgId}, function(resp) {
                $scope.companyData.clients = resp.object;
                var arr = [];
                angular.forEach($scope.companyData.clients, function(val) {
                    arr.push({id: val, text: val})
                });

                $(".search-client-name").select2({
                    data: arr,
                    minimumInputLength: 2,
                    selectOnBlur: true,
                    formatInputTooShort: function() {
                        return "";
                    },
                    createSearchChoice: function(term, data) {
                        if ($(data).filter(function() {
                            return this.text.localeCompare(term) === 0;
                        }).length === 0) {
                            return {id: term, text: term};
                        }
                    }
                }).on("select2-close", function(e) {
                    $scope.companyData.input = $(this).select2('data').id;
                    var valueExist = false;
                    angular.forEach($scope.companyData.clients, function(resp) {
                        if (resp == $scope.companyData.input) {
                            valueExist = true;
                        }
                    });
                    if (valueExist) {
                        $scope.companyData.wrongName = false;
                        $scope.goToStepTwo();

                    } else {
                        $scope.companyData.wrongName = $scope.companyData.input && $scope.companyData.input.length != 0;
                    }
                    $scope.companyData.inputFocused = true;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });

            });

            $scope.goToStepTwo = function(withoutContacts) {
                if (!withoutContacts) {
                    $("#pac-input").wrap('<div class="ui labeled input">');
                    $("#pac-input").after('<div class="ui corner label"><i class="asterisk icon"></i></div>');
                }
                if ($scope.companyData.wrongName && !$scope.companyForm.$valid) {
                    $scope.companyForm.email.$pristine = false;
                    $scope.companyForm.phone.$pristine = false;
                    $scope.companyForm.firstName.$pristine = false;
                    return;
                }
                if ($scope.validCompanyData()) {
                    $scope.company.name = $scope.companyData.input;
                    $scope.client = {
                        name: $scope.companyData.input,
                        industry: $scope.company.industry,
                        site: $scope.company.site,
                        descr: $scope.company.descr
                    };
                    if ($scope.companyData.wrongName && !withoutContacts) {
                        $scope.contacts = [
                            {
                                firstName: $scope.company.firstName,
                                contacts: [
                                    {
                                        type: "mphone",
                                        value: $scope.company.phone
                                    },
                                    {
                                        type: "email",
                                        value: $scope.company.email
                                    }
                                ]
                            }
                        ]
                    } else {
                        $scope.contacts = [];
                    }
                    $scope.step = 2;
                    $scope.companyForm2.position.$pristine = true;
                } else {

                }
            };

            $scope.goToStepThree = function() {
                $scope.vacancy = {};
                $('.select2-lang').select2('data', null);
                $("#pac-input").val("");
                $scope.region = {};
                $scope.step = 3;
                $scope.companyForm2.position.$pristine = true;
            };

            $scope.changeStep = function(step) {
                if ($scope.step > step) {
                    $scope.step = step;
                }
            };

            $scope.validCompanyData = function() {
                if ($scope.companyData.wrongName == false && $scope.companyData.input.length > 0) {
                    return true;
                }
                if ($scope.company.firstName.length > 0 && $scope.company.phone.length > 0 && $scope.company.email.length > 0) {
                    return true;
                }
                return false;
            };

            $("#pac-input").on("change", function() {
                if ($(this).val().length == 0) {
                    $("#pac-input").parent().parent().parent().addClass("error");
                    $("#pac-input").css("border-color", "#E7BEBE");
                    $("#pac-input").css("box-shadow", ".3em 0 0 0 #D95C5C inset");
                } else {
                    $("#pac-input").parent().parent().parent().removeClass("error");
                    $("#pac-input").css("border-color", "");
                    $("#pac-input").css("box-shadow", "");
                }
            });

            $scope.$watch('regionInput', function(newValue, oldValue) {
                if (newValue && newValue.length == 0) {
                    $("#pac-input").parent().parent().parent().addClass("error");
                    $("#pac-input").css("border-color", "#E7BEBE");
                    $("#pac-input").css("box-shadow", ".3em 0 0 0 #D95C5C inset");
                } else {
                    $("#pac-input").parent().parent().parent().removeClass("error");
                    $("#pac-input").css("border-color", "");
                    $("#pac-input").css("box-shadow", "");
                }
            });

            $scope.saveFacebook = function() {
                var r = false;
                if (!$scope.companyForm2.$valid) {
                    $scope.companyForm2.position.$pristine = false;
                    notificationService.error("Будь-ласка, заповніть назву вакансії");
                    r = true;
                }
                if ($("#pac-input").val().length == 0) {
                    $("#pac-input").parent().parent().parent().addClass("error");
                    $("#pac-input").css("border-color", "#E7BEBE");
                    $("#pac-input").css("box-shadow", ".3em 0 0 0 #D95C5C inset");
                    notificationService.error("Будь-ласка, заповніть регіон");
                    r = true;
                }
                if (r) return;
                FB.login(function(response) {
                    if (response.authResponse) {
                        var code = response.authResponse.accessToken; //get access token
                        FB.api('/me', function(u) {
                            var user = {
                                id: u.id,
                                name: u.name,
                                email: u.email,
                                source: "facebook"
                            };
                            save(user)

                        });
                    }
                }, {
                    scope: 'email'
                });

            };

            $scope.saveGoogle = function() {
                var r = false;
                if (!$scope.companyForm2.$valid) {
                    $scope.companyForm2.position.$pristine = false;
                    notificationService.error("Будь-ласка, заповніть назву вакансії");
                    r = true;
                }
                if ($("#pac-input").val().length == 0) {
                    $("#pac-input").parent().parent().parent().addClass("error");
                    $("#pac-input").css("border-color", "#E7BEBE");
                    $("#pac-input").css("box-shadow", ".3em 0 0 0 #D95C5C inset");
                    notificationService.error("Будь-ласка, заповніть регіон");
                    r = true;
                }
                if (r) return;
                var win = window.open(google_url, "windowname3", getPopupParams());
                var pollTimer = window.setInterval(function() {
                    try {
                        if (win.document.URL.indexOf(gup(google_url, 'redirect_uri')) !== -1) {
                            window.clearInterval(pollTimer);
                            var url = win.document.URL;
                            var code = gup(url, 'code');
                            var access_token = gup(url, 'access_token');
                            win.close();
                            $.ajax({
                                url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + access_token,
                                data: null,
                                success: function(u) {
                                    var user = {
                                        id: u.id,
                                        name: u.name,
                                        email: u.email,
                                        source: "googleplus"
                                    };
                                    save(user)
                                },
                                dataType: "jsonp"
                            });
                        }
                    } catch (e) {
                    }
                }, 500);

            };

            function save(user) {
                if ($("#pac-input").val().length == 0) {
                    $scope.vacancy.region = null;
                } else if ($("#pac-input").val().length > 0) {
                    $scope.vacancy.region = $scope.region;
                }
                $scope.vacancy.langs = $('.select2-lang').select2('val').toString();
                var saveObject = {
                    history: user,
                    orgId: $scope.orgId,
                    client: $scope.client,
                    contacts: $scope.contacts,
                    vacancies: [
                        $scope.vacancy
                    ]
                };
                Service.addVacancyPackage(saveObject,
                    function(resp) {
                        if (resp && resp.status == "ok") {
                            $scope.goToStepThree();
                        }
                    }, function(resp) {
                    }
                );

            }

            window.fbAsyncInit = function() {
                FB.init({
                    appId: apiKey.facebook.appId,
                    oauth: true,
                    status: true, // check login status
                    cookie: true, // enable cookies to allow the server to access the session
                    xfbml: true, // parse XFBML
                    version: 'v2.9'
                });
            };
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id))
                    return;
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=" + apiKey.facebook.appId + "&version=v2.9";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    );


function validEmail(email, notificationService) {
    if (email == undefined) return true;
    var r = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;
    return !email.match(r);
}

function gup(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    if (results === null)
        return "";
    else
        return results[1];
}
function getPopupParams() {
    var w = 650;
    var h = 550;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    return 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left;
}
controller.controller('PublicCandidateController', ['$scope', 'Service', '$routeParams', '$rootScope', 'serverAddress', function($scope, Service, $routeParams, $rootScope, serverAddress) {
        $scope.pageObject = {
            loading: true,
            showInformation: true
        };
        $scope.error = { show: false, notFound: false };
        Service.publicCandidate({id: $routeParams.candidateId}, function(resp) {
            if (resp.status == "ok") {
                $scope.pageObject.loading = false;
                $scope.candidate = resp.object;
                if (resp.object.coreSkills != undefined) {
                    $("#candidateCoreSkills").html(resp.object.coreSkills)
                }

                if (resp.object.education != undefined) {
                    $("#candidateEducation").html(resp.object.education)
                }
                $rootScope.title = resp.object.fullName + " | CleverStaff";
                if (resp.object.region != undefined && resp.object.region.lat != undefined && resp.object.region.lng != undefined) {
                    $scope.map.center.latitude = resp.object.region.lat;
                    $scope.map.center.longitude = resp.object.region.lng;

                    $scope.marker.coords.latitude = resp.object.region.lat;
                    $scope.marker.coords.longitude = resp.object.region.lng;
                }

                Service.getOrgLogoId({orgId : resp.object.orgId}, function(logoResp) {
                    if (logoResp.status === 'ok') {
                        $scope.companyLogo = logoResp.object;
                        if (serverAddress === '/hr') {
                            $scope.logoLink = '/hr/getlogo?id=' + $scope.companyLogo + '';
                        } else {
                            $scope.logoLink = '/hrdemo/getlogo?id=' + $scope.companyLogo + '';
                        }
                    }
                });
            } else {
                if(resp.code === 'notFound') {
                    $scope.error = {
                        show: true,
                        notFound: true
                    }
                }
                $scope.pageObject.showInformation = false;
                $scope.pageObject.loading = false;
            }
        }, function(respError) {
            $scope.pageObject.showInformation = false;
            $scope.pageObject.loading = false;
        });
        $scope.serverAddress = serverAddress;


        $scope.map = {
            center: {
                latitude: 48.379433,
                longitude: 31.165579999999977
            },
            zoom: 5,
            options: {
                panControl: true,
                zoomControl: true,
                scaleControl: true,
                mapTypeControl: true
                //mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        };
        $scope.showHideMap = function() {
            $scope.showRegion2Map = !$scope.showRegion2Map;
        };
        $scope.marker = {
            id: 1,
            title: "",
            coords: {
                latitude: null,
                longitude: null
            }
        };


    }]
);
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

controller.controller('PublicTestController', ['$scope', '$rootScope', 'serverAddress', 'Service', 'Company',
    'notificationService', '$routeParams', 'Test', "$interval", "$timeout", "$localStorage", "$location", "$filter", "$translate", "$window",
    function ($scope, $rootScope, serverAddress, Service, Company, notificationService, $routeParams, Test, $interval, $timeout, $localStorage, $location, $filter, $translate, $window) {
        $scope.loaded = false;
        $scope.showStartTest = true;
        $scope.showStartTest2 = true;
        $scope.showFirstTest = false;
        $scope.currentTab = 'start_test';
        $scope.hideTest = true;
        $scope.showEndMessage = false;
        $scope.saveAnswersTest = false;
        $scope.endTestMsg = null;
        $scope.serverAddress = serverAddress;
        $scope.checkPreviousAnswers = false;
        $scope.inHover = function(){
            $scope.showHover = true;
        };
        $scope.outHover = function(){
            $scope.showHover = false;
        };
        $timeout(function() {
            $scope.getTestFunc();
        });

        function getOrgLogo(orgId) {
            console.log('hello',orgId);
            Service.getOrgLogoId({orgId: orgId}, function (resp) {
                console.log(serverAddress);
                console.log(resp);
                if (resp.status && resp.status === 'ok') {
                    $scope.companyInfo.logo = resp.object;
                }
            });
        }

        $scope.getTestFunc = function () {
            Test.openTest({
                appointmentId: $routeParams.id
            },function(resp){
                $scope.startTestFunc();
                $scope.showFirstTest = true;
                $scope.loaded = true;
                if(resp.message == 'This test is already passed. If you want to pass it one more time, please contact the recruiter who sent you the test link.'){
                    // $('.publicTest2, .publicTest3').hide();
                    $scope.showStartTest = true;
                    $scope.showStartTest2 = false;
                    $scope.endTestMsg = resp.message;
                    $scope.showEndMessage = true;
                }
                if(resp.message == 'This test is inactive now. Please contact the rectuiter if you want to pass the test.'){
                    // $('.publicTest2, .publicTest3').hide();
                    $scope.showStartTest = false;
                    $scope.showStartTest2 = true;
                    $scope.endTestMsg = resp.message;
                    $scope.showEndMessage = true;
                }
                if(resp.status == 'ok'){
                    getOrgLogo(resp.object.orgId);
                    if($localStorage.get("currentTab") == 'first_test'){
                        if (performance.navigation.type == 1) {
                            setTimeout(function(){
                                $scope.startTestFunc('first_test');
                            }, 500);
                        } else {
                            console.info( "This page is not reloaded");
                        }
                    }
                    $scope.showEndMessage = false;
                    $scope.showStartTest = false;
                    $scope.showStartTest2 = false;
                    $rootScope.title = resp.object.testName;
                    $scope.companyInfo = {
                        name : resp.companyName,
                        fb : resp.companyFacebookPage,
                        website : resp.companyWebSite
                    };
                    $scope.getTestCandidate = resp.object;
                    $scope.currentLang = $translate.use();
                    if($scope.currentLang == undefined){
                        console.log('lang');
                    }
                    if($scope.getTestCandidate.timeLimit == '3600' || $scope.getTestCandidate.timeLimit == '7200' || $scope.getTestCandidate.timeLimit == '10800' || $scope.getTestCandidate.timeLimit == '14400' || $scope.getTestCandidate.timeLimit == '18000' || $scope.getTestCandidate.timeLimit == '21600' || $scope.getTestCandidate.timeLimit == '25200' || $scope.getTestCandidate.timeLimit == '28800'|| $scope.getTestCandidate.timeLimit == '32400' || $scope.getTestCandidate.timeLimit == '36000' || $scope.getTestCandidate.timeLimit == '39600' || $scope.getTestCandidate.timeLimit == '43200' || $scope.getTestCandidate.timeLimit == '46800' || $scope.getTestCandidate.timeLimit == '54000' || $scope.getTestCandidate.timeLimit == '57600' || $scope.getTestCandidate.timeLimit == '61200' || $scope.getTestCandidate.timeLimit == '64800' || $scope.getTestCandidate.timeLimit == '68400' || $scope.getTestCandidate.timeLimit == '72000' || $scope.getTestCandidate.timeLimit == '75600' || $scope.getTestCandidate.timeLimit == '79200' || $scope.getTestCandidate.timeLimit == '82800' || $scope.getTestCandidate.timeLimit == '86400'){
                        $('.min').hide();
                        $('.allTime').hide();
                    }else if($scope.getTestCandidate.timeLimit > '3600' && ($scope.getTestCandidate.timeLimit != '3600' || $scope.getTestCandidate.timeLimit != '7200' || $scope.getTestCandidate.timeLimit != '10800' || $scope.getTestCandidate.timeLimit != '14400' || $scope.getTestCandidate.timeLimit != '18000' || $scope.getTestCandidate.timeLimit != '21600' || $scope.getTestCandidate.timeLimit != '25200' || $scope.getTestCandidate.timeLimit != '28800'|| $scope.getTestCandidate.timeLimit != '32400' || $scope.getTestCandidate.timeLimit != '36000' || $scope.getTestCandidate.timeLimit != '39600' || $scope.getTestCandidate.timeLimit != '43200' || $scope.getTestCandidate.timeLimit != '46800' || $scope.getTestCandidate.timeLimit != '54000' || $scope.getTestCandidate.timeLimit != '57600' || $scope.getTestCandidate.timeLimit != '61200' || $scope.getTestCandidate.timeLimit != '64800' || $scope.getTestCandidate.timeLimit != '68400' || $scope.getTestCandidate.timeLimit != '72000' || $scope.getTestCandidate.timeLimit != '75600' || $scope.getTestCandidate.timeLimit != '79200' || $scope.getTestCandidate.timeLimit != '82800' || $scope.getTestCandidate.timeLimit != '86400')){
                        $('.min').hide();
                        $('.hour').hide();
                        $('.allTime').show();
                    }else if($scope.getTestCandidate.timeLimit < '3600'){
                        $('.allTime').hide();
                        $('.min').show();
                        $('.hour').hide();
                    }
                }else{
                    getOrgLogo(resp.object.orgId);
                    $rootScope.title = resp.object.testName;
                    $scope.companyInfo = {
                        name : resp.companyName,
                        fb : resp.companyFacebookPage,
                        website : resp.companyWebSite
                    };
                    $scope.getTestCandidate = resp.object;
                    $scope.currentLang = $translate.use();
                    if($scope.currentLang == undefined){
                        $window.location.reload();
                    }
                    if($scope.getTestCandidate.timeLimit == '3600' || $scope.getTestCandidate.timeLimit == '7200' || $scope.getTestCandidate.timeLimit == '10800' || $scope.getTestCandidate.timeLimit == '14400' || $scope.getTestCandidate.timeLimit == '18000' || $scope.getTestCandidate.timeLimit == '21600' || $scope.getTestCandidate.timeLimit == '25200' || $scope.getTestCandidate.timeLimit == '28800'|| $scope.getTestCandidate.timeLimit == '32400' || $scope.getTestCandidate.timeLimit == '36000' || $scope.getTestCandidate.timeLimit == '39600' || $scope.getTestCandidate.timeLimit == '43200' || $scope.getTestCandidate.timeLimit == '46800' || $scope.getTestCandidate.timeLimit == '54000' || $scope.getTestCandidate.timeLimit == '57600' || $scope.getTestCandidate.timeLimit == '61200' || $scope.getTestCandidate.timeLimit == '64800' || $scope.getTestCandidate.timeLimit == '68400' || $scope.getTestCandidate.timeLimit == '72000' || $scope.getTestCandidate.timeLimit == '75600' || $scope.getTestCandidate.timeLimit == '79200' || $scope.getTestCandidate.timeLimit == '82800' || $scope.getTestCandidate.timeLimit == '86400'){
                        $('.min').hide();
                        $('.allTime').hide();
                    }else if($scope.getTestCandidate.timeLimit > '3600' && ($scope.getTestCandidate.timeLimit != '3600' || $scope.getTestCandidate.timeLimit != '7200' || $scope.getTestCandidate.timeLimit != '10800' || $scope.getTestCandidate.timeLimit != '14400' || $scope.getTestCandidate.timeLimit != '18000' || $scope.getTestCandidate.timeLimit != '21600' || $scope.getTestCandidate.timeLimit != '25200' || $scope.getTestCandidate.timeLimit != '28800'|| $scope.getTestCandidate.timeLimit != '32400' || $scope.getTestCandidate.timeLimit != '36000' || $scope.getTestCandidate.timeLimit != '39600' || $scope.getTestCandidate.timeLimit != '43200' || $scope.getTestCandidate.timeLimit != '46800' || $scope.getTestCandidate.timeLimit != '54000' || $scope.getTestCandidate.timeLimit != '57600' || $scope.getTestCandidate.timeLimit != '61200' || $scope.getTestCandidate.timeLimit != '64800' || $scope.getTestCandidate.timeLimit != '68400' || $scope.getTestCandidate.timeLimit != '72000' || $scope.getTestCandidate.timeLimit != '75600' || $scope.getTestCandidate.timeLimit != '79200' || $scope.getTestCandidate.timeLimit != '82800' || $scope.getTestCandidate.timeLimit != '86400')){
                        $('.allTime').show();
                        $('.min').hide();
                        $('.hour').hide();
                    } else if($scope.getTestCandidate.timeLimit < '3600'){
                        $('.allTime').hide();
                        $('.min').show();
                        $('.hour').hide();
                    }
                    //notificationService.error(resp.message);
                }
            })
        };

        var intervalId;

        $scope.counter = 0;

        $scope.countdown = $scope.initialCountdown;
        $scope.timer = function(){
            var startTime = new Date();
            intervalId = $interval(function(){
                var actualTime = new Date();
                $scope.counter = Math.floor((actualTime - startTime) / 1000);
                $scope.countdown = $scope.initialCountdown - $scope.counter;
            }, 500);
        };

        $scope.$watch('countdown', function(countdown){
            if (countdown === 0 || countdown < 0){
                $scope.stopTimer();
                // $scope.nextTestQuestion();
                // $scope.getNextQuestion();
                $scope.endTestTimeOrSubmit();
            }
        });
        $scope.stopTimer = function(){
            $interval.cancel(intervalId);
            intervalId = null;
        };
        $scope.startTimer = function(){
            if (intervalId === null) {
                $interval(function(){
                    $scope.countdown--;
                }, 1000);
            }
        };
        $scope.startTestFunc = function (tab) {
            $scope.currentTab = tab || "start_test";
            Test.startTest({
                appointmentId: $routeParams.id
            },function(resp){
                if(resp.status == 'ok'){
                    if(!tab) {
                        if(resp.object.question.num > 1 || resp.object.answer) {
                            $scope.startTestFunc('first_test');
                            return;
                        }
                        $scope.checkPreviousAnswers = true;
                        return;
                    }

                    if(resp.object.answer) setRightAnswer(resp);

                    $scope.firstTestQuestion = resp;
                    if(resp.object.question.imageId != undefined){
                        $scope.imageId = serverAddress + "/getPublicFile/" + resp.object.question.imageId;
                    }
                    $scope.initialCountdown = $scope.firstTestQuestion.timeLeft;
                    if($scope.initialCountdown > 0){
                        $scope.timer();
                    }
                    $scope.firstPage = resp.object.question.num;
                    $scope.checkPreviousAnswers = true;
                }else{
                    if(resp.message = 'No such appointmentId.') {
                        $scope.currentTab = 'first_test';
                        $scope.checkPreviousAnswers = true;
                        $scope.showEndMessage = true;
                        $scope.endTestMsg = $filter('translate')('No such appointmentId.');
                    }
                    // notificationService.error(resp.message);
                }
            })
        };
        $scope.variantsAnswer = [];
        $scope.checkFewAnswer = function (text) {
            if ($scope.variantsAnswer.indexOf(text) === -1) {
                $scope.variantsAnswer.push(text);
            } else {
                $scope.variantsAnswer.splice($scope.variantsAnswer.indexOf(text), 1);
            }
        };
        $scope.checkOneAnswer = function (text) {
            $scope.checkAnswerText = text;
        };
        $scope.textAnswer = function (text) {
            $scope.textAnswers = text;
        };
        $scope.nextTestQuestion = function(next){
            if($scope.textAnswers != undefined){
                Test.saveAnswer({
                    questionId: $scope.firstTestQuestion.object.question.id,
                    appointmentId: $routeParams.id,
                    text: $scope.textAnswers
                },function(resp){
                    $scope.variantsAnswer = [];
                    $scope.checkAnswerText = null;
                    $scope.textAnswers = null;
                    if(next == 'next'){
                        $scope.getNextQuestion();
                    }else if(next == 'prev'){
                        $scope.previousTestQuestion();
                    }
                })
            }else if($scope.variantsAnswer != undefined && $scope.variantsAnswer.length > 0){
                Test.saveAnswer({
                    questionId: $scope.firstTestQuestion.object.question.id,
                    appointmentId: $routeParams.id,
                    variantsArray: $scope.variantsAnswer
                },function(resp){
                    $scope.variantsAnswer = [];
                    $scope.checkAnswerText = undefined;
                    $scope.textAnswers = undefined;
                    if(next == 'next'){
                        $scope.getNextQuestion();
                    }else if(next == 'prev'){
                        $scope.previousTestQuestion();
                    }
                })
            }else if( $scope.checkAnswerText != undefined){
                Test.saveAnswer({
                    questionId: $scope.firstTestQuestion.object.question.id,
                    appointmentId: $routeParams.id,
                    variantsArray: [$scope.checkAnswerText]
                },function(resp){
                    $scope.variantsAnswer = [];
                    $scope.checkAnswerText = undefined;
                    $scope.textAnswers = undefined;
                    if(next == 'next'){
                        $scope.getNextQuestion();
                    }else if(next == 'prev'){
                        $scope.previousTestQuestion();
                    }
                })
            } else if(next == 'prev') {
                $scope.variantsAnswer = [];
                $scope.checkAnswerText = undefined;
                $scope.textAnswers = undefined;
                $scope.previousTestQuestion();
            } else{
                if($scope.firstTestQuestion.object.question.answerType === 'task_question') {
                    notificationService.error($filter('translate')('Enter your answer first text'));
                } else {
                    notificationService.error($filter('translate')('Enter your answer first'));
                }
            }
        };
        $scope.previousTestQuestion = function(){
            Test.getTestsQuestion({
                testId: $scope.getTestCandidate.id,
                questionNumber: --$scope.firstPage,
                appointmentId: $routeParams.id
            },function(resp){
                if(resp.status == 'ok'){
                    $scope.firstTestQuestion = resp;
                    $scope.imageId = serverAddress + "/getPublicFile/" + resp.object.question.imageId;
                    -$scope.firstPage;
                    setRightAnswer(resp);
                    $scope.hideTest = true;
                    $scope.saveAnswersTest = false;
                }else{
                    notificationService.error(resp.message);
                }
            })
        };
        $scope.endTestTimeOrSubmit = function(done){
            $('.publicTest3').hide();
            $scope.hideTest = false;
            $scope.showEndMessage = true;
            $scope.saveAnswersTest = false;
            Test.endAppointment({
                status: 'partly_done' ? done : 'partly_done',
                appointmentId: $routeParams.id
            },function(resp){
                if(resp.status == 'ok'){

                }else{
                }
            })
        };
        $scope.getNextQuestion = function(){
            Test.getTestsQuestion({
                testId: $scope.getTestCandidate.id,
                questionNumber: ++$scope.firstPage,
                appointmentId: $routeParams.id
            },function(resp){
                if(resp.message == 'There is no question with such number.'){
                    $scope.hideTest = false;
                    $scope.saveAnswersTest = true;
                }
                if(resp.status == 'ok'){
                    $scope.firstTestQuestion = resp;
                    $scope.imageId = serverAddress + "/getPublicFile/" + resp.object.question.imageId;
                    +$scope.firstPage;
                    $('#answersText').val('');
                    var rightAnswer = {};
                    angular.copy(resp.object.answer, rightAnswer);
                    if(rightAnswer != null){
                        if(rightAnswer.variantsArray != undefined){
                            var answer = {};
                            angular.copy(resp.object.question, answer);
                            if(answer.answerType == 'few_answers'){
                                $scope.variantsAnswer = [];
                                angular.forEach(rightAnswer.variantsArray, function (val) {
                                    $scope.variantsAnswer.push(val);
                                    $scope.checkAnswerText = null;
                                    $scope.textAnswers = undefined;
                                });
                            }else if(answer.answerType == 'one_answer'){
                                $scope.checkAnswerText = null;
                                angular.forEach(rightAnswer.variantsArray, function (val) {
                                    $scope.checkAnswerText = val;
                                    $scope.variantsAnswer = undefined;
                                    $scope.textAnswers = undefined;
                                });
                            }
                        }else if(rightAnswer.text != undefined){
                            $scope.textAnswers = rightAnswer.text;
                            $scope.variantsAnswer = undefined;
                            $scope.checkAnswerText = undefined;
                            $('#answersText').val($scope.textAnswers);
                        } else {
                        }
                    } else {
                        $scope.checkAnswerText = null;
                    }
                }else{
                    notificationService.error(resp.message);
                }
            })
        };

        function setRightAnswer(resp) {
            var rightAnswer = {};
            angular.copy(resp.object.answer, rightAnswer);
            if(rightAnswer != null){
                if(rightAnswer.variantsArray != undefined){
                    $scope.variantsAnswer = [];
                    angular.forEach(rightAnswer.variantsArray, function (val) {
                        var answer = {};
                        angular.copy(resp.object.question, answer);
                        if(answer.answerType == 'few_answers'){
                            $scope.variantsAnswer = [];
                            angular.forEach(rightAnswer.variantsArray, function (val) {
                                $scope.variantsAnswer.push(val);
                                $scope.checkAnswerText = undefined;
                                $scope.textAnswers = undefined;
                            });
                        }else if(answer.answerType == 'one_answer'){
                            $scope.checkAnswerText = [];
                            angular.forEach(rightAnswer.variantsArray, function (val) {
                                $scope.checkAnswerText = val;
                                $scope.variantsAnswer = undefined;
                                $scope.textAnswers = undefined;
                            });
                        }
                    });
                }else if(rightAnswer.text != undefined){
                    $scope.textAnswers = rightAnswer.text;
                    $('#answersText').val($scope.textAnswers);
                }
            }
        }
        $scope.showModalImage = function() {
            $('#question-modal').removeClass('hidden');
            $('#question-modal').addClass('visible');
        };
        $scope.closeModalImage = function() {
            $('#question-modal').removeClass('visible');
            $('#question-modal').addClass('hidden');
        };

    }]
);
/*** Created by вик on 31.05.2017.*/

'use strict';

/* Filters */


angular.module('RecruitingAppStart.filters', []).
    filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }]).filter('salaryFormat', function($filter) {
        return function(salaryFrom, salaryTo) {
            var res = "";
            if (salaryFrom && salaryTo) {
                res = salaryFrom + "-" + salaryTo;
            } else if (salaryFrom && !salaryTo) {
                res = salaryFrom + "+";
            } else if (!salaryFrom && salaryTo) {
                res = $filter('translate')('up to') + " " + salaryTo;
            } else if (!salaryFrom && !salaryTo) {
                // res = $filter('translate')('on the interview results');
                return res;
            }
            return res;
        };
    }).filter('transliteration', function(transliteration) {
        return function (value) {
            var transl = transliteration.getArray();
            var result = "";
            for (var i = 0; i < value.length; i++) {
                if (transl[value[i]] != undefined) {
                    result += transl[value[i]];
                } else {
                    if (value[i].match(/\w/)) {
                        result += value[i];
                    } else if(value[i] == '#'){
                        result += '-sharp'
                    }else if(value[i] == '/'){
                        result += '|'
                    } else {
                        result += '_';
                    }
                }
            }
            return result;
        }
    }).filter('ageDisplay', function($filter) {
        return function(ageFrom, ageTo) {
            if (ageFrom != undefined && ageTo == undefined) {
                return $filter('translate')('from') + " " + ageFrom
            } else if (ageTo != undefined && ageFrom == undefined) {
                return $filter('translate')('to') + " " + ageTo
            } else if (ageTo != undefined && ageFrom != undefined) {
                return ageFrom + "-" + ageTo;
            }
        }
    }).filter('cut', function() {
        return function(value, wordwise, max, tail) {
            var endExtension = "";
            if (!value)
                return '';
            if (value.split('.').length === 2) {
                endExtension = value.split('.')[1];
                value = value.split('.')[0];
            }
            max = parseInt(max, 10);
            if (!max)
                return value;
            if (value.length + value.split(' ').length <= max)
                return value + "." + endExtension;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                    value = value.substr(0, lastspace);
                }
            }
            return value + (tail || '...') + endExtension;
        };
    }).filter('dateFormat', ["$filter", "$translate", function($filter, $translate) {
        return function(date, withHour, withUTC) {

            function createDateAsUTC(datLong) {
                if (datLong != undefined) {
                    var date = new Date(datLong);
                    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
                }
            }

            if (withUTC == true) {
                date = createDateAsUTC(date);
            }
            var hour = "";
            var dateToday = new Date().getTime();
            var lang = $translate.use();
            var dateMD = "";
            var dateMDY = "";
            if (lang == 'ru' || lang == 'ua') {
                dateMD = "d MMM ";
                dateMDY = "d MMM y ";
            } else if (lang == 'en') {
                dateMD = "MMM d ";
                dateMDY = "MMM d, y ";
            }
            if (withHour === true) {
                hour = "H:mm";
            }
            if (angular.equals($filter('date')(dateToday, 'y'), $filter('date')(date, 'y'))) {
                return $filter('date')(date, dateMD + hour);
            } else {
                return $filter('date')(date, dateMDY + hour);
            }
        };
    }]).filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
    }]).filter('ageOfDate', ['$filter', function($filter) {
        return function(dateString) {
            if (dateString != undefined) {
                var today = new Date();
                var birthDate = new Date(dateString);
                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                var cases = [2, 0, 1, 1, 1, 2];
                var translate = $filter('translate');
                return age + " " + [translate('year'), translate('years'),  translate('age_1')][(age % 100 > 4 && age % 100 < 20) ? 2 : cases[(age % 10 < 5) ? age % 10 : 5]];

            }
        };
    }]).filter('registrationRole' , ['$filter' , function($filter) {
          return function(roleID) {
            if(!roleID) {
                return false;
            }
            var UpperLetter = roleID.charAt(3).toUpperCase();
            var role = UpperLetter + roleID.substring(4);
            if(role == 'Client') {
              return "Hiring Manager";
            } else if (role == 'Salesmanager') {
              return "Sales Manager"
            } else {
              return role;
            }
          }
    }]).filter('employmentType' , ['$filter' , function($filter) {
        return function(empType) {
            return empType === "Project" ? "PR" : empType === "Remote" ? "RM" :
                   empType === "Temporary" ? "TM" : empType === "Relocate" ? "RL" : empType[0] + empType[empType.indexOf(" ")+1];
        }
    }]).filter('parseFacebookUrl' , [function() {
        return function(url) {
            if(!url) return '';
            let start = url.indexOf('.com/') + 4;
            return url.substr(start, url.length);
        }
    }]);



'use strict';

/* Directives */


angular.module('RecruitingAppStart.directives', [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keypress", function(event) {
                if (event.which === 13) {
                    scope.authClick();
                }
            });
        };
    }).directive('intTelNumber', function() {
        return {
            // Restrict it to being an attribute
            restrict: 'A',
            // responsible for registering DOM listeners as well as updating the DOM
            link: function(scope, element, attrs) {
                scope.$watch('loaded', function() {
                    if (scope.loaded == true) {
                        // apply plugin
                        element.intlTelInput(scope.options);
                        //validate loaded number
                        var countryCode = element[0].nextSibling.children[0].children[0].className.split(" ")[1];
                        scope.validateTelephoneNumber(element[0].value, countryCode);

                    }
                });
            }
        }
    })
    .directive('googleplace', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, model) {
                var options = {
                    types: ['(regions)']
                };
                var gPlace = new google.maps.places.Autocomplete(element[0], options);
                google.maps.event.addListener(gPlace, 'place_changed', function(val) {
                    var place = gPlace.getPlace();
                    if (place) {
                        place.formatted_address = $('#pac-input').val();
                        var fullNameAr = place.formatted_address.split(',');

                        if (similar_text(fullNameAr[1], fullNameAr[0]) == fullNameAr[0].length || (similar_text(fullNameAr[0], fullNameAr[1]) / fullNameAr[0].length) * 100 > 80) {
                            place.formatted_address = fullNameAr[0] + "," + fullNameAr[2];
                        }
                        var lat = place.geometry.location.k;
                        var lng = place.geometry.location.D;
                        if (scope.mapObject != null) {
                            var location = new google.maps.LatLng(lat, lng);
                            scope.mapObject.marker.setPosition(location);
                            scope.mapObject.map.setCenter(location);
                        }
                        scope.$apply(function() {
                            scope.region = convertToRegionObject(place, scope);
                            if (scope.region != undefined && scope.region.country == null) {
                                scope.region.country = scope.region.city != null ? scope.region.city : scope.region.area != null ? scope.region.area : " ";
                                if (scope.region.fullName != undefined) {
                                    scope.region.fullName = scope.region.fullName.replace(",undefined", "");
                                }
                            }
                            model.$setViewValue(place.formatted_address);
                        });
                        if (scope.progressUpdate != undefined) {
                            scope.progressUpdate();
                        }

                    } else {
                        scope.regionInputOk = false;
                        scope.region = null;
                    }
                });
            }
        };
    })
    .directive('googleplacerelocate', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, model) {
                var options = {
                    types: ['(regions)']
                };
                var gPlace = new google.maps.places.Autocomplete(element[0], options);
                google.maps.event.addListener(gPlace, 'place_changed', function(val) {
                    var place = gPlace.getPlace();
                    place.formatted_address = $('#pac-input2').val();
                    var fullNameAr = place.formatted_address.split(',');
                    if (similar_text(fullNameAr[1], fullNameAr[0]) == fullNameAr[0].length || (similar_text(fullNameAr[0], fullNameAr[1]) / fullNameAr[0].length) * 100 > 80) {
                        place.formatted_address = fullNameAr[0] + "," + fullNameAr[2];
                    }
                    scope.$apply(function() {
                        scope.regionToRelocate.push(convertToRegionObject(place, scope));
                        model.$setViewValue("");
                        $('#pac-input2').val("");
                    });
                });
            }
        };
    })
    .directive('googlePlaces', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {location: '='},
            template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level"/>',
            link: function($scope, elm, attrs) {
                var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
                google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    var place = autocomplete.getPlace();
                    $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                    $scope.$apply();
                });
            }
        }
    }).directive('keyboardPoster', ['$timeout', function($timeout) {
        var DELAY_TIME_BEFORE_POSTING = 200;
        return function(scope, elem, attrs) {
            var element = angular.element(elem)[0];
            var currentTimeout = null;

            element.oninput = function() {
                var poster = scope[attrs.postFunction];

                if (currentTimeout) {
                    $timeout.cancel(currentTimeout)
                }

                currentTimeout = $timeout(function() {
                    poster(angular.element(element).val());
                }, DELAY_TIME_BEFORE_POSTING);
            }
        }
    }]).directive('descriptionTreatment', [function() {
        return {
            restrict: 'EA',
            scope: {
                description: "="
            },
            link: function(scope, element, attrs) {
                var watch = scope.$watch('description', function(newval, oldval) {
                    if (newval) {
                        console.log("TRUE!");
                        element.html(scope.description);
                        $(element).linkify();
                        watch();
                    }
                });

            }
        }
    }]
).directive('checkPassword',['$filter', function($filter){
        return {
            restrict: 'EA',
            scope: {
                password: "="
            },
            link: function(scope, element, attrs) {
              scope.$watch('password',function(newVal,oldVal){
                  var password1 = /^[a-zA-Z0-9!,.?%$#@*_\-+=\\|/[\]{}()]{0,99}$/;
                  var password2 = /.*[a-zA-Z].*/;
                  var password3 = /.*\d.*/;
                  var checkpassword1 = password1.test(newVal);
                  var checkpassword2 = password2.test(newVal);
                  var checkpassword3 = password3.test(newVal);
                  if(newVal != undefined){
                      var checkpassword4 = newVal.length > 7 && newVal.length < 31;
                  }
                  if((!checkpassword1 || !checkpassword2 || !checkpassword3 || !checkpassword4) && scope.$parent.restoreForm.password.$dirty){
                      scope.$parent.showError = true;
                      if(!checkpassword1){
                          scope.$parent.errorMessage = $filter('translate')('Password should contain only numbers and latin letters, allowed characters: !,.?%$#@*_-+=\\|/[]{}()')
                      } else if(!checkpassword2){
                          scope.$parent.errorMessage = $filter('translate')('Password should contain at least one latin letter')
                      } else if(!checkpassword3){
                          scope.$parent.errorMessage = $filter('translate')('Password should contain at least one number')
                      } else if(!checkpassword4){
                          scope.$parent.errorMessage = $filter('translate')('Password must be 8-30 characters long')
                      }
                  }else{
                      scope.$parent.showError = false;
                  }
              })
            }
        }
    }]).directive('select2PhoneCode', ["$filter", "serverAddress", "Service", "notificationService", "$window", function($filter, serverAddress, Service, notificationService, $window) {
        return {
            restrict: 'EA',
            replace: true,
            link: function($scope, element) {
                function formatCountry (country) {
                    if (!country.id) { return country.text; }
                    var $country = $(
                        '<span class="flag-icon flag-icon-'+ country.id.toLowerCase() +' flag-icon-squared"></span>' +
                        '<span class="flag-text" style="margin-left: 5px;">'+ country.text+"</span>"
                    );
                    return $country;
                }
                function format(state) {
                    if(state != undefined && state.value != undefined){
                        var phone = state.value.replace("+","");
                        localStorage.setItem("phone", phone);
                    }
                    if (!state.id) return state.text;
                    var $state = $(
                        '<span class="flag-icon flag-icon-'+ state.id.toLowerCase() +' flag-icon-squared"></span>' +
                        '<span class="flag-text" style="margin-left: 5px;">'+ state.text.replace(/[A-z]/g, "").replace(/\(*\)*\.*\-*\s*/g,"").replace(/,/g,"").replace(/'/g,"").replace(/&/g,"")+"</span>");
                    return $state;
                }
                var isoCountries = [
                    { id: 'AF', text: 'Afghanistan (+93)', value: '+93'},
                    { id: 'AX', text: 'Aland Islands (+358)', value: '+358'},
                    { id: 'AL', text: 'Albania (+355)', value: '+355'},
                    { id: 'DZ', text: 'Algeria (+213)', value: '+213'},
                    { id: 'AS', text: 'American Samoa (+1)', value: '+1'},
                    { id: 'AD', text: 'Andorra (+376)', value: '+376'},
                    { id: 'AO', text: 'Angola (+244)', value: '+244'},
                    { id: 'AI', text: 'Anguilla (+1264)', value: '+1264'},
                    { id: 'AQ', text: 'Antarctica (+672)', value: '+672'},
                    { id: 'AG', text: 'Antigua And Barbuda (+1268)', value: '+1268'},
                    { id: 'AR', text: 'Argentina (+54)', value: '+54'},
                    { id: 'AM', text: 'Armenia (+374)', value: '+374'},
                    { id: 'AW', text: 'Aruba (+297)', value: '+297'},
                    { id: 'AU', text: 'Australia (+61)', value: '+61'},
                    { id: 'AT', text: 'Austria (+43)', value: '+43'},
                    { id: 'AZ', text: 'Azerbaijan (+994)', value: '+994'},
                    { id: 'BS', text: 'Bahamas (+1242)', value: '+1242'},
                    { id: 'BH', text: 'Bahrain (+973)', value: '+973'},
                    { id: 'BD', text: 'Bangladesh (+880)', value: '+880'},
                    { id: 'BB', text: 'Barbados (+1246)', value: '+1246'},
                    { id: 'BY', text: 'Belarus (+375)', value: '+375'},
                    { id: 'BE', text: 'Belgium (+32)', value: '+32'},
                    { id: 'BZ', text: 'Belize (+501)', value: '+501'},
                    { id: 'BJ', text: 'Benin (+229)', value: '+229'},
                    { id: 'BM', text: 'Bermuda (+1441)', value: '+1441'},
                    { id: 'BT', text: 'Bhutan (+975)', value: '+975'},
                    { id: 'BO', text: 'Bolivia (+591)', value: '+591'},
                    { id: 'BA', text: 'Bosnia And Herzegovina (+387)', value: '+387'},
                    { id: 'BW', text: 'Botswana (+267)', value: '+267'},
                    { id: 'BV', text: 'Bouvet Island (+47)', value: '+47'},
                    { id: 'BR', text: 'Brazil (+55)', value: '+55'},
                    { id: 'IO', text: 'British Indian Ocean Territory (+246)', value: '+246'},
                    { id: 'BN', text: 'Brunei Darussalam (+673)', value: '+673'},
                    { id: 'BG', text: 'Bulgaria (+359)', value: '+359'},
                    { id: 'BF', text: 'Burkina Faso (+226)', value: '+226'},
                    { id: 'BI', text: 'Burundi (+257)', value: '+257'},
                    { id: 'KH', text: 'Cambodia (+855)', value: '+855'},
                    { id: 'CM', text: 'Cameroon (+237)', value: '+237'},
                    { id: 'CA', text: 'Canada (+1)', value: '+1'},
                    { id: 'CV', text: 'Cape Verde Islands (+238)', value: '+238'},
                    { id: 'KY', text: 'Cayman Islands (+1345)', value: '+1345'},
                    { id: 'CF', text: 'Central African Republic (+236)', value: '+236'},
                    { id: 'TD', text: 'Chad (+235)', value: '+235'},
                    { id: 'CL', text: 'Chile (+56)', value: '+56'},
                    { id: 'CN', text: 'China (+86)', value: '+86'},
                    { id: 'CX', text: 'Christmas Island (+672)', value: '+672'},
                    { id: 'CC', text: 'Cocos (Keeling) Islands (+225)', value: '+225'},
                    { id: 'CO', text: 'Colombia (+57)', value: '+57'},
                    { id: 'KM', text: 'Comoros (+269)', value: '+269'},
                    { id: 'CG', text: 'Congo (+242)', value: '+242'},
                    { id: 'CD', text: 'Congo, Democratic Republic (+243)', value: '+243'},
                    { id: 'CK', text: 'Cook Islands (+682)', value: '+682'},
                    { id: 'CR', text: 'Costa Rica (+506)', value: '+506'},
                    { id: 'CI', text: 'Cote D\'Ivoire (+225)', value: '+225'},
                    { id: 'HR', text: 'Croatia (+385)', value: '+385'},
                    { id: 'CU', text: 'Cuba (+53)', value: '+53'},
                    { id: 'CY', text: 'Cyprus (+90)', value: '+90'},
                    { id: 'CZ', text: 'Czech Republic (+420)', value: '+420'},
                    { id: 'DK', text: 'Denmark (+45)', value: '+45'},
                    { id: 'DJ', text: 'Djibouti (+253)', value: '+253'},
                    { id: 'DM', text: 'Dominica (+1809)', value: '+1809'},
                    { id: 'DO', text: 'Dominican Republic (+1809)', value: '+1809'},
                    { id: 'EC', text: 'Ecuador (+593)', value: '+593'},
                    { id: 'EG', text: 'Egypt (+20)', value: '+20'},
                    { id: 'SV', text: 'El Salvador (+503)', value: '+503'},
                    { id: 'GQ', text: 'Equatorial Guinea (+240)', value: '+240'},
                    { id: 'ER', text: 'Eritrea (+291)', value: '+291'},
                    { id: 'EE', text: 'Estonia (+372)', value: '+372'},
                    { id: 'ET', text: 'Ethiopia (+251)', value: '+251'},
                    { id: 'FK', text: 'Falkland Islands (Malvinas) (+500)', value: '+500'},
                    { id: 'FO', text: 'Faroe Islands (+298)', value: '+298'},
                    { id: 'FJ', text: 'Fiji (+679)', value: '+679'},
                    { id: 'FI', text: 'Finland (+358)', value: '+358'},
                    { id: 'FR', text: 'France (+33)', value: '+33'},
                    { id: 'GF', text: 'French Guiana (+594)', value: '+594'},
                    { id: 'PF', text: 'French Polynesia (+689)', value: '+689'},
                    { id: 'TF', text: 'French Southern Territories (+689)', value: '+689'},
                    { id: 'GA', text: 'Gabon (+241)', value: '+241'},
                    { id: 'GM', text: 'Gambia (+220)', value: '+220'},
                    { id: 'GE', text: 'Georgia (+7880)', value: '+7880'},
                    { id: 'DE', text: 'Germany (+49)', value: '+49'},
                    { id: 'GH', text: 'Ghana (+233)', value: '+233'},
                    { id: 'GI', text: 'Gibraltar (+350)', value: '+350'},
                    { id: 'GR', text: 'Greece (+30)', value: '+30'},
                    { id: 'GL', text: 'Greenland (+299)', value: '+299'},
                    { id: 'GD', text: 'Grenada (+1473)', value: '+1473'},
                    { id: 'GP', text: 'Guadeloupe (+590)', value: '+590'},
                    { id: 'GU', text: 'Guam (+671)', value: '+671'},
                    { id: 'GT', text: 'Guatemala (+502)', value: '+502'},
                    { id: 'GG', text: 'Guernsey (+44)', value: '+44'},
                    { id: 'GN', text: 'Guinea (+224)', value: '+224'},
                    { id: 'GW', text: 'Guinea-Bissau (+245)', value: '+245'},
                    { id: 'GY', text: 'Guyana (+592)', value: '+592'},
                    { id: 'HT', text: 'Haiti (+509)', value: '+509'},
                    { id: 'HM', text: 'Heard Island & Mcdonald Islands (+61)', value: '+61'},
                    { id: 'VA', text: 'Holy See (Vatican City State) (+39)', value: '+39'},
                    { id: 'HN', text: 'Honduras (+504)', value: '+504'},
                    { id: 'HK', text: 'Hong Kong (+852)', value: '+852'},
                    { id: 'HU', text: 'Hungary (+36)', value: '+36'},
                    { id: 'IS', text: 'Iceland (+354)', value: '+354'},
                    { id: 'IN', text: 'India(+91)', value: '+91'},
                    { id: 'ID', text: 'Indonesia (+62)', value: '+62'},
                    { id: 'IR', text: 'Iran, Islamic Republic Of (+98)', value: '+98'},
                    { id: 'IQ', text: 'Iraq (+964)', value: '+964'},
                    { id: 'IE', text: 'Ireland (+353)', value: '+353'},
                    { id: 'IM', text: 'Isle Of Man (+44)', value: '+44'},
                    { id: 'IL', text: 'Israel (+972)', value: '+975'},
                    { id: 'IT', text: 'Italy (+39)', value: '+39'},
                    { id: 'JM', text: 'Jamaica (+1876)', value: '+1876'},
                    { id: 'JP', text: 'Japan (+81)', value: '+81'},
                    { id: 'JE', text: 'Jersey (+44-1534)', value: '+44-1534'},
                    { id: 'JO', text: 'Jordan (+962)', value: '+962'},
                    { id: 'KZ', text: 'Kazakhstan (+7)', value: '+7'},
                    { id: 'KE', text: 'Kenya (+254)', value: '+254'},
                    { id: 'KI', text: 'Kiribati (+686)', value: '+686'},
                    { id: 'KP', text: 'Korea - North (+850)', value: '+850'},
                    { id: 'KR', text: 'Korea - South (+82)', value: '+82'},
                    { id: 'KW', text: 'Kuwait (+965)', value: '+965'},
                    { id: 'KG', text: 'Kyrgyzstan (+996)', value: '+996'},
                    { id: 'LA', text: 'Lao People\'s Democratic Republic (+856)', value: '+856'},
                    { id: 'LV', text: 'Latvia (+371)', value: '+371'},
                    { id: 'LB', text: 'Lebanon (+961)', value: '+961'},
                    { id: 'LS', text: 'Lesotho (+266)', value: '+266'},
                    { id: 'LR', text: 'Liberia (+231)', value: '+231'},
                    { id: 'LY', text: 'Libyan Arab Jamahiriya (+218)', value: '+218'},
                    { id: 'LI', text: 'Liechtenstein (+417)', value: '+417'},
                    { id: 'LT', text: 'Lithuania (+370)', value: '+370'},
                    { id: 'LU', text: 'Luxembourg (+352)', value: '+352'},
                    { id: 'MO', text: 'Macao (+853)', value: '+853'},
                    { id: 'MK', text: 'Macedonia (+389)', value: '+389'},
                    { id: 'MG', text: 'Madagascar (+261)', value: '+261'},
                    { id: 'MW', text: 'Malawi (+265)', value: '+265'},
                    { id: 'MY', text: 'Malaysia (+60)', value: '+60'},
                    { id: 'MV', text: 'Maldives (+960)', value: '+960'},
                    { id: 'ML', text: 'Mali (+223)', value: '+223'},
                    { id: 'MT', text: 'Malta (+356)', value: '+356'},
                    { id: 'MH', text: 'Marshall Islands (+692)', value: '+692'},
                    { id: 'MQ', text: 'Martinique (+596)', value: '+596'},
                    { id: 'MR', text: 'Mauritania (+222)', value: '+222'},
                    { id: 'MU', text: 'Mauritius (+230)', value: '+230'},
                    { id: 'YT', text: 'Mayotte (+269)', value: '+269'},
                    { id: 'MX', text: 'Mexico (+52)', value: '+52'},
                    { id: 'FM', text: 'Micronesia, Federated States Of (+691)', value: '+691'},
                    { id: 'MD', text: 'Moldova (+373)', value: '+373'},
                    { id: 'MC', text: 'Monaco (+377)', value: '+377'},
                    { id: 'MN', text: 'Mongolia (+976)', value: '+976'},
                    { id: 'ME', text: 'Montenegro (+382)', value: '+382'},
                    { id: 'MS', text: 'Montserrat (+1664)', value: '+1664'},
                    { id: 'MA', text: 'Morocco (+212)', value: '+212'},
                    { id: 'MZ', text: 'Mozambique (+258)', value: '+258'},
                    { id: 'MM', text: 'Myanmar (+95)', value: '+95'},
                    { id: 'NA', text: 'Namibia (+264)', value: '+264'},
                    { id: 'NR', text: 'Nauru (+674)', value: '+674'},
                    { id: 'NP', text: 'Nepal (+977)', value: '+977'},
                    { id: 'NL', text: 'Netherlands (+31)', value: '+31'},
                    { id: 'AN', text: 'Netherlands Antilles (+599)', value: '+599'},
                    { id: 'NC', text: 'New Caledonia (+687)', value: '+687'},
                    { id: 'NZ', text: 'New Zealand (+64)', value: '+64'},
                    { id: 'NI', text: 'Nicaragua (+505)', value: '+505'},
                    { id: 'NE', text: 'Niger (+227)', value: '+227'},
                    { id: 'NG', text: 'Nigeria (+234)', value: '+234'},
                    { id: 'NU', text: 'Niue (+683)', value: '+683'},
                    { id: 'NF', text: 'Norfolk Island (+672)', value: '+672'},
                    { id: 'MP', text: 'Northern Mariana Islands (+670)', value: '+670'},
                    { id: 'NO', text: 'Norway (+47)', value: '+47'},
                    { id: 'OM', text: 'Oman (+968)', value: '+968'},
                    { id: 'PK', text: 'Pakistan (+92)', value: '+92'},
                    { id: 'PW', text: 'Palau (+680)', value: '+680'},
                    { id: 'PS', text: 'Palestinian Territory (+970)', value: '+970'},
                    { id: 'PA', text: 'Panama (+507)', value: '+507'},
                    { id: 'PG', text: 'Papua New Guinea (+675)', value: '+675'},
                    { id: 'PY', text: 'Paraguay (+595)', value: '+595'},
                    { id: 'PE', text: 'Peru (+51)', value: '+51'},
                    { id: 'PH', text: 'Philippines (+63)', value: '+63'},
                    { id: 'PN', text: 'Pitcairn (+64)', value: '+64'},
                    { id: 'PL', text: 'Poland (+48)', value: '+48'},
                    { id: 'PT', text: 'Portugal (+351)', value: '+351'},
                    { id: 'PR', text: 'Puerto Rico (+1787)', value: '+1787'},
                    { id: 'QA', text: 'Qatar (+974)', value: '+974'},
                    { id: 'RE', text: 'Reunion (+262)', value: '+262'},
                    { id: 'RO', text: 'Romania (+40)', value: '+40'},
                    { id: 'RU', text: 'Russian Federation (+7)', value: '+7'},
                    { id: 'RW', text: 'Rwanda (+250)', value: '+250'},
                    { id: 'BL', text: 'Saint Barthelemy (+590)', value: '+590'},
                    { id: 'SH', text: 'Saint Helena (+290)', value: '+94'},
                    { id: 'KN', text: 'Saint Kitts And Nevis (+1869)', value: '+94'},
                    { id: 'LC', text: 'Saint Lucia (+1758)', value: '+94'},
                    { id: 'MF', text: 'Saint Martin (+590)', value: '+590'},
                    { id: 'PM', text: 'Saint Pierre And Miquelon (+508)', value: '+508'},
                    { id: 'VC', text: 'Saint Vincent And Grenadines (+1-784)', value: '+1-784'},
                    { id: 'WS', text: 'Samoa (+685)', value: '+685'},
                    { id: 'SM', text: 'San Marino (+378)', value: '+378'},
                    { id: 'ST', text: 'Sao Tome And Principe (+239)', value: '+239'},
                    { id: 'SA', text: 'Saudi Arabia (+966)', value: '+966'},
                    { id: 'SN', text: 'Senegal (+221)', value: '+221'},
                    { id: 'RS', text: 'Serbia (+381)', value: '+381'},
                    { id: 'SC', text: 'Seychelles (+248)', value: '+248'},
                    { id: 'SL', text: 'Sierra Leone (+232)', value: '+232'},
                    { id: 'SG', text: 'Singapore (+65)', value: '+65'},
                    { id: 'SK', text: 'Slovakia (+421)', value: '+421'},
                    { id: 'SI', text: 'Slovenia (+386)', value: '+386'},
                    { id: 'SB', text: 'Solomon Islands (+677)', value: '+677'},
                    { id: 'SO', text: 'Somalia (+252)', value: '+252'},
                    { id: 'ZA', text: 'South Africa (+27)', value: '+27'},
                    { id: 'GS', text: 'South Georgia And Sandwich Isl. (+500)', value: '+500'},
                    { id: 'ES', text: 'Spain (+34)', value: '+34'},
                    { id: 'LK', text: 'Sri Lanka (+94)', value: '+94'},
                    { id: 'SD', text: 'Sudan (+249)', value: '+249'},
                    { id: 'SR', text: 'Suriname (+597)', value: '+597'},
                    { id: 'SJ', text: 'Svalbard And Jan Mayen (+47)', value: '+47'},
                    { id: 'SZ', text: 'Swaziland (+268)', value: '+268'},
                    { id: 'SE', text: 'Sweden (+46)', value: '+46'},
                    { id: 'CH', text: 'Switzerland (+41)', value: '+41'},
                    { id: 'SY', text: 'Syrian Arab Republic (+963)', value: '+963'},
                    { id: 'TW', text: 'Taiwan (+886)', value: '+886'},
                    { id: 'TJ', text: 'Tajikistan (+992)', value: '+992'},
                    { id: 'TZ', text: 'Tanzania (+255)', value: '+255'},
                    { id: 'TH', text: 'Thailand (+66)', value: '+66'},
                    { id: 'TL', text: 'Timor-Leste (+670)', value: '+670'},
                    { id: 'TG', text: 'Togo (+228)', value: '+228'},
                    { id: 'TK', text: 'Tokelau (+690)', value: '+690'},
                    { id: 'TO', text: 'Tonga (+676)', value: '+676'},
                    { id: 'TT', text: 'Trinidad And Tobago (+1868)', value: '+1868'},
                    { id: 'TN', text: 'Tunisia (+216)', value: '+216'},
                    { id: 'TR', text: 'Turkey (+90)', value: '+90'},
                    { id: 'TM', text: 'Turkmenistan (+993)', value: '+993'},
                    { id: 'TC', text: 'Turks And Caicos Islands (+1649)', value: '+1649'},
                    { id: 'TV', text: 'Tuvalu (+688)', value: '+668'},
                    { id: 'UG', text: 'Uganda (+256)', value: '+256'},
                    { id: 'UA', text: 'Ukraine (+380)', value: '+380'},
                    { id: 'AE', text: 'United Arab Emirates (+971)', value: '+971'},
                    { id: 'GB', text: 'United Kingdom (+44)', value: '+44'},
                    { id: 'US', text: 'United States (+1)', value: '+1'},
                    { id: 'UM', text: 'United States Outlying Islands (+1-340)', value: '+1-340'},
                    { id: 'UY', text: 'Uruguay (+598)', value: '+598'},
                    { id: 'UZ', text: 'Uzbekistan (+998)', value: '+998'},
                    { id: 'VU', text: 'Vanuatu (+678)', value: '+678'},
                    { id: 'VE', text: 'Venezuela (+58)', value: '+58'},
                    { id: 'VN', text: 'Vietnam (+84)', value: '+84'},
                    { id: 'VG', text: 'Virgin Islands, British (+1)', value: '+1'},
                    { id: 'VI', text: 'Virgin Islands, U.S. (+1)', value: '+1'},
                    { id: 'WF', text: 'Wallis And Futuna (+681)', value: '+681'},
                    { id: 'EH', text: 'Western Sahara (+212)', value: '+212'},
                    { id: 'YE', text: 'Yemen (North)(+969)', value: '+969'},
                    { id: 'YE', text: 'Yemen (South)(+967)', value: '+967'},
                    { id: 'ZM', text: 'Zambia (+260)', value: '+260'},
                    { id: 'ZW', text: 'Zimbabwe (+263)', value: '+263'}
                ];

                $(element[0]).select2({
                        data:{
                            results:  isoCountries,
                            text: function(item) { return item.text; }
                        },
                        formatSelection: format,
                        formatResult: formatCountry
                    }
                ).on("change", function(e) {

                });
            }
        }
    }]).directive('customScrollbar',function() {
            return function(scope, element, attrs) {
                $(element).mCustomScrollbar({
                    theme: 'dark',
                    scrollInertia:600
                });
            }
    }).directive('customTooltip', ['$filter',function($filter) {
       return {
           restrict: 'A',
           scope: {
               tooltipText: "=",
               tooltipClass: "=",
               tooltipHover: "=",
               tooltipShow: "="
           },
           link: function(scope, element) {
               let tooltip = $('<span></span>');

               console.log(scope);

               console.log(scope.tooltipShow);

               $(element).css('position','relative');
               $(element).append(tooltip);

               tooltip.text(scope.tooltipText);
               tooltip.addClass(scope.tooltipClass);
               tooltip.addClass('custom-tooltip');
               tooltip.css('top', -(tooltip.height()*1.5)+ "px");

               console.log(scope.$parent.errorHandler.vacanciesFilter.error.show);

               scope.$watch(scope.$parent.errorHandler.vacanciesFilter.error.show, function() {
                  if(scope.$parent.errorHandler.vacanciesFilter.error.show) {
                      tooltip.addClass('visible')
                  } else {
                      tooltip.removeClass('visible')
                  }
               },true);

               if(!scope.tooltipShow) {
                   tooltip.addClass('visible');
               }

               element.on({
                   mouseover: () => showToolTip(),
                   mouseleave: () => tooltip.removeClass('visible')
               });


               function showToolTip() {
                   if(scope.tooltipHover === 'true') {
                       tooltip.addClass('visible')
                   }
               }
               console.log(tooltip);
           }
       }
    }]).directive('passThroughList', [function() {
        return {
            restrict: "A",
            scope: {
              onSelect: "="
            },
            link: function(scope,element,attrs) {
                let list = document.getElementById(attrs.id).getElementsByTagName('li'),
                    selectedItemIndex = -1;

                $(element).parent().on(
                    {
                        keydown: () => checkForArrows(event),
                        blur: () => reset(),
                        click: function(event) {
                            if(event.target.tagName.toLowerCase() === 'input') {
                                $(event.target).focus();
                                $(event.target).unbind('blur').on('blur', reset());
                            } else {
                                $(this).attr('tabindex','0');
                                $(this).focus();
                            }
                        }
                    }
                );

                function checkForArrows(e) {
                    if(e.target.tagName.toLowerCase() !== 'input') e.preventDefault();
                    if(e.keyCode === 38) {
                        goUp();
                        scrollElement();
                    } else if(e.keyCode === 40){
                        goDown();
                        scrollElement();
                    } else if(e.keyCode === 13) {
                        selectItem();
                    }
                }

                function goUp() {
                    selectedItemIndex = list[selectedItemIndex - 1] ? --selectedItemIndex : selectedItemIndex;

                    $(list[selectedItemIndex]).addClass('selected');
                    $(list[selectedItemIndex + 1]).removeClass('selected');
                }

                function goDown() {
                    selectedItemIndex = list[selectedItemIndex + 1] ? ++selectedItemIndex : selectedItemIndex;

                    $(list[selectedItemIndex]).addClass('selected');
                    $(list[selectedItemIndex - 1]).removeClass('selected');
                }

                function selectItem() {
                    if($(list[selectedItemIndex]).text().trim()) {
                        scope.$parent[scope.onSelect]($(list[selectedItemIndex]).text().trim());
                        scope.$apply();
                    }
                }

                function scrollElement() {
                    let parentHeight = $(element).height(),
                        currentItemHeight = $(list[selectedItemIndex]).outerHeight(),
                        currentItemPosition = $(list[selectedItemIndex]).position().top,
                        relativePosition = ((currentItemPosition + 1) % parentHeight),
                        scrollPosition = $('#' + attrs.id + ' .mCSB_container').position().top;


                    if(parentHeight - relativePosition - currentItemHeight < currentItemHeight / 3 || Math.abs(+(scrollPosition)) > currentItemPosition) {
                        $(element).mCustomScrollbar("scrollTo", $(list[selectedItemIndex]));
                    }
                }

                function reset() {
                    selectedItemIndex = -1;
                }
            }
        }
    }]).directive('toggleCompanyBlock', ['$timeout', function($timeout){
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                let logo, nameWrap, linksWrap, name, siteLink, fbLink,
                    id = '#' + attrs.id,
                    timeout;

                $timeout(() => {
                    nameWrap = $(id + ' .name_wrap');
                    name = $(id +  ' .name_wrap h2');

                    linksWrap = $(id + ' .info--site:eq(0)');
                    siteLink = $(id + ' .info--site .site-link');
                    fbLink = $(id + ' .info--site .fb-link');

                    console.log($(id));
                    console.log(logo);
                });

                element.on({
                    mouseenter: () => showBlock(),
                    mouseleave: () => hideBlock()
                });

                function showBlock() {
                    logo = $(id + ' .logo');

                    clearTimeout(timeout);

                    if(linksWrap.width() - siteLink.width() <= 44.64 || linksWrap.width() - fbLink.width() <= 44.64 || nameWrap.width() <= name.width()) {
                        let adaptiveImgWidth = logo.height();
                        logo.height(adaptiveImgWidth);
                        timeout = setTimeout(() => nameWrap.css('white-space', 'normal'),300);
                        element.addClass('hovered');
                    }
                }

                function hideBlock() {
                    nameWrap.css('white-space', 'nowrap');
                    element.removeClass('hovered');
                    clearTimeout(timeout);
                }
            }
        }
    }]);

function similar_text(first, second, percent) {
    if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
        return 0;
    }
    first += '';
    second += '';
    var pos1 = 0,
        pos2 = 0,
        max = 0,
        firstLength = first.length,
        secondLength = second.length,
        p, q, l, sum;
    max = 0;
    for (p = 0; p < firstLength; p++) {
        for (q = 0; q < secondLength; q++) {
            for (l = 0;
                 (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++)
                ;
            if (l > max) {
                max = l;
                pos1 = p;
                pos2 = q;
            }
        }
    }
    sum = max;
    if (sum) {
        if (pos1 && pos2) {
            sum += similar_text(first.substr(0, pos1), second.substr(0, pos2));
        }
        if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
            sum += similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max,
                secondLength - pos2 - max));
        }
    }
    if (!percent) {
        return sum;
    } else {
        return (sum * 200) / (firstLength + secondLength);
    }
}

function convertToRegionObject(place, scope) {
    var object = {
        country: null,
        area: null,
        city: null,
        lat: null,
        lng: null,
        lang: "ru",
        regionId: null,
        fullName: "full"
    };
    if (place != null) {
        angular.forEach(place.address_components, function(val) {
            angular.forEach(val.types, function(valT) {
                switch (valT) {
                    case "country":
                        object.country = val.long_name;
                        break;
                    case "administrative_area_level_1":
                        object.area = val.long_name;
                        break;
                    case "locality":
                        object.city = val.long_name;
                        break;
                }
            });
        });
        object.regionId = place.id;
        object.googlePlaceId = {googlePlaceId: place.place_id};
        if (scope) {
            if (scope.map != undefined) {
                scope.map.center.latitude = place.geometry.location.k;
                scope.map.center.longitude = place.geometry.location.D;
            }
            if (scope.marker != undefined) {
                scope.marker.coords.latitude = place.geometry.location.k;
                scope.marker.coords.longitude = place.geometry.location.D;
            }
        }
        if (place.geometry != null) {
            object.lat = place.geometry.location.k;
            object.lng = place.geometry.location.D;
        } else {
            object.lat = 48.379433;
            object.lng = 31.165579999999977
        }
        object.fullName = place.formatted_address;
        return object;
    } else {
        return null;
    }
}

angular.module('services.candidate', [
    'ngResource',
    'ngCookies'
]).factory('Candidate', ['$resource', 'serverAddress', '$filter', '$localStorage',"notificationService","$rootScope","$translate", function($resource, serverAddress, $filter, $localStorage,notificationService, $rootScope, $translate ) {
    var options;

    var candidate = $resource(serverAddress + '/candidate/:param', {param: "@param"}
            , {
            all: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "get"
                }
            },
            getLangInOrg: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getLangInOrg"
                }
            },
            createExcel: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "createExcel"
                }
            },
            getExternal: {
                method: "POST",
                params: {
                    param: "getExternal"
                }
            },
            add: {
                method: "PUT",
                params: {
                    param: "add"
                }
            },
            edit: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "edit"
                }
            },
            sendToMail: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "sendToMail"
                }
            },
            one: {
                method: "GET",
                params: {
                    param: "get"
                }
            },
            changeState: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "changeState"
                }

            },
            setResponsible: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "setResponsible"
                }
            },
            removeFile: {
                method: "GET",
                params: {
                    param: "removeFile"
                }
            },
            setMessage: {
                method: "POST",
                params: {
                    param: "setMessage"
                }
            },
            addFile: {
                method: "GET",
                params: {
                    param: "addFile"
                }
            },
            addFromRecall: {
                method: "GET",
                params: {
                    param: "addFromRecall"
                }
            },
            "mathRecallWithCandidate": {
                method: "GET",
                params: {
                    param: "mathRecallWithCandidate"
                }
            },
            mergeCandidates: {
                method: "PUT",
                params: {
                    param: "mergeCandidates"
                }

            },
            getAdvices: {
                method: "GET",
                params: {
                    param: "getAdvices"
                }
            },
            fromLinkFile: {
                method: "POST",
                params: {
                    param: "fromLinkFile"
                }
            },
            fromLinkSite: {
                method: "POST",
                params: {
                    param: "fromLinkSite"
                }
            },
            fromText: {
                method: "POST",
                params: {
                    param: "fromText"
                }
            },
            getContacts: {
                method: "GET",
                params: {
                    param: "getContacts"
                }
            },
            getDuplicates: {
                method: "POST",
                params: {
                    param: "getDuplicates"
                }
            },
            getDuplicatesByName: {
                method: "POST",
                params: {
                    param: "getDuplicatesByName"
                }
            },
            getDuplicatesByNameAndContacts: {
                method: "POST",
                params: {
                    param: "getDuplicatesByNameAndContacts"
                }
            },
            addToParserQueue: {
                method: "POST",
                params: {
                    param: "addToParserQueue"
                }
            },
            removeFromParserQueue: {
                method: "POST",
                params: {
                    param: "removeFromParserQueue"
                }
            },
            getParseEmailData: {
                method: "GET",
                params: {
                    param: "getParseEmailData"
                }
            },
            getMessages: {
                method: "GET",
                params: {
                    param: "getMessages"
                }
            },
            getParseEmailHistory: {
                method: "POST",
                params: {
                    param: "getParseEmailHistory"
                }
            },
            saveSearchFilter: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "saveSearchFilter"
                }
            },
            getSearchHistory: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getSearchHistory"
                }
            },
            getSearchHistoryAdmin: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getSearchHistoryAdmin"
                }
            },
            checkMailbox: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "checkMailbox"
                }
            },
            addLink: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "addLink"
                }
            },
            getCandidateLinks: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getCandidateLinks"
                }
            },
            removeCandidateLink: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "removeCandidateLink"
                }
            },
            autocompleteSkill: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "autocompleteSkill"
                }
            },
            updateFromFile: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "updateFromFile"
                }
            },
            getCV: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getCV"
                }
            },
            addEmailAccess: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "addEmailAccess"
                }
            },
            editEmailAccess: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "editEmailAccess"
                }
            },
            editOriginAll: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "editOriginAll"
                }
            },
            removeOriginAll: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "removeOriginAll"
                }
            },
            getCandidateProperties: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getCandidateProperties"
                }
            },
            setPreferableContact: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "setPreferableContact"
                }
            },
            deleteCandidate: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "deleteCandidate"
                }
            }
        });



    function unCheckFavoriteContact(checkElement, $scope){
        checkElement.classList.remove('fa-star');
        checkElement.classList.add('fa-star-o');
        $scope.contactType = null;
        $scope.candidate.preferableContact = '';
    }

    function checkFavoriteContact(contacts, checkElement, $scope, type){
        $scope.contactType = type;
        contacts.forEach(elem => {
            if(elem.classList.contains('fa-star')){
                elem.classList.remove('fa-star');
                elem.classList.add('fa-star-o');
            }
        });

        checkElement.classList.add('fa-star');
        checkElement.classList.remove('fa-star-o');
    }

    function restAngularContext($scope){
        if($rootScope.loading){
            $rootScope.loading = false;
        }
        $scope.$apply();
    }

    function selectFavoriteContact(checkElement, $scope, type){
        let contacts = document.querySelectorAll('.contactCandidate .fa');

        if(checkElement.classList.contains('fa-star')){
            unCheckFavoriteContact(checkElement, $scope);
        }else{
            checkFavoriteContact(contacts, checkElement, $scope, type);
        }
    }

    candidate.setSelectFavoriteContacts = function($scope, type, event){
        $scope.candidate.preferableContact = type;
        selectFavoriteContact(event.target, $scope, type);
    };

    candidate.getSearchHistoryUniqueLink = function(callback) {
        candidate.getSearchHistory({type: 'linkedin'}, function(resp) {
            var history = [];
            angular.forEach(resp.objects, function(val, key) {
                if (history.length < 8) {
                    var has = false;
                    angular.forEach(history, function(valHistory, keyHistory) {
                        if (
                            (
                                valHistory.company === val.company ||
                                (
                                    valHistory.company && val.company &&
                                    $.trim(valHistory.company.toUpperCase()) === $.trim(val.company.toUpperCase())
                                )
                            )
                            &&
                            (
                                valHistory.position === val.position ||
                                (
                                    valHistory.position && val.position &&
                                    $.trim(valHistory.position.toUpperCase()) === $.trim(val.position.toUpperCase())
                                )
                            )
                            &&
                            (
                                valHistory.words === val.words ||
                                (
                                    valHistory.words && val.words &&
                                    $.trim(valHistory.words.toUpperCase()) === $.trim(val.words.toUpperCase())
                                )
                            )
                            && valHistory.countryCode == val.countryCode) {
                            has = true;
                        }
                    });
                    if (!has) {
                        history.push(val);
                    }
                }
            });
            if (callback != undefined)
                callback(history);
        });
    };
    candidate.searchOptions = function() {
        return options;
    };
    candidate.setOptions = function(name, value) {
        if(name === "dateTo" || name === "dateFrom") {
            setAgeRange(name, value);
        } else {
            options[name] = value;
        }

    };
    candidate.init = function() {
        options = {
            "state": null,
            "id": null,
            "personId": null,
            "regions": null,
            "employmentType": null,
            "industry": null,
            "sort": null,
            "sortOrder": "DESC",
            "org": null,
            "origin": null,
            "city": null,
            "country": null,
            "responsibleId": null,
            "ids": null,
            "page": {"number": 0, "count": 100},
            "words": null,
            "name": null,
            "position": null,
            "salary": null,
            "sex": null,
            "candidateGroupId" : null
        };
    };

    candidate.getStatus = function() {
        return [
            {value: "active_search", name: "active search", text:"active search"},
            {value: "not_searching", name: "not searching", text:"not searching"},
            {value: "passive_search", name: "passive search", text:"passive search"},
            {value: "employed", name: "employed", text: "employed"},
            {value: "freelancer", name: "freelancer", text: "freelancer"},
            {value: "archived", name: "archived", text: "archived"},
            {value: "our employee", name: "our employee", text: "our employee"},
            {value: "only_remote", name: "Only remote", text: "Only remote"},
            {value: "only_relocation_abroad", name: "Only relocation abroad", text: "Only relocation abroad"}
        ];
    };
    candidate.getStatusAssociative = function() {
        return {
            "active_search": "active search",
            "not_searching": "not searching",
            "passive_search": "passive search",
            "employed": "employed"
        };
    };

    candidate.fromFile = function($scope, $rootScope, $location) {
        $scope.optionsForResumeFile = {
            change: function(file) {
                $rootScope.loading = true;
                $scope.fastCandLoading = true;
                file.$preview(file).then(function(data) {
                    $scope.newImgSrc = data.item.thumb;
                    $scope.ngShowNewImage = true;
                });
                file.$upload(serverAddress + '/candidate/fromFile', file).then(function(data) {
                    //candidate.convert($scope, data.data.object);
                    //$scope.candidate.source = 'cvfile';
                    //if (data.data.object.position) {
                    //    $scope.setPositionAutocompleterValue(data.data.object.position);
                    //}
                    //$scope.callbackFile(data.data.objects[0], file.filename);
                    $rootScope.file = file;
                    $rootScope.resumeToSave = data;
                    $scope.fastCandLoading = false;
                    $rootScope.loading = false;
                    setTimeout(function(){
                        $scope.imgWidthFunc(file.object.photo);
                    }, 3000);
                    if(data.data.status != 'error' ){
                        $location.path("candidate/add");
                    } else {
                        $scope.callbackErr(data.data.message);
                        $scope.fastCandLoading = false;
                    }

                }).catch(function(data) {
                    $scope.callbackErr(data.statusText);
                    $scope.fastCandLoading = false;
                });
            },
            setError: function(err, data) {
                $scope.callbackErr(data.statusText);
                $scope.fastCandLoading = false;
            }
        };
    };
    candidate.setPhoto = function($scope, error) {
        $scope.file = {}; //Model
        $scope.optionsForPhoto = {
            change: function(file) {
                file.$preview(file).then(function(data) {
                    $scope.newImgSrc = data.item.thumb;
                    $scope.ngShowNewImage = true;
                });
                file.$upload(serverAddress + '/candidate/addPhoto', file).then(function(data) {
                    $scope.callbackAddPhoto(data.data.objects[0]);
                    setTimeout(function(){
                        $scope.imgWidthFunc(data.data.objects[0]);
                    }, 2000);
                });
            },
            setError: function(err, data) {
                $scope.callbackErr(data.statusText);
            }
        };
    };

    var duplicatesByNameAndContacts = false;
    candidate.checkDuplicatesByNameAndContacts = function($scope) {
        //console.log(duplicatesByNameAndContacts);
        $scope.dublicetesTypeName = '';
        $scope.dublicetesTypeMphone = '';
        $scope.dublicetesTypeEmail = '';
        $scope.dublicetesTypeSkype = '';
        $scope.dublicetesTypeLinkedin = '';
        if ((!duplicatesByNameAndContacts && $scope.contacts && $scope.contacts.email && $scope.contacts.email.length > 4) || (!duplicatesByNameAndContacts && $scope.contacts && $scope.contacts.skype && $scope.contacts.skype.length > 4) || (!duplicatesByNameAndContacts && $scope.contacts && $scope.contacts.linkedin && $scope.contacts.linkedin.length > 4) || (!duplicatesByNameAndContacts && $scope.contacts && ($scope.contacts.mphone || $scope.contacts.mphone2 || $scope.contacts.mphone3 )) || (!duplicatesByNameAndContacts && $scope.candidate.fullName && $scope.candidate.fullName.length > 3)) {
        //if (!duplicatesByNameAndContacts && $scope.contacts && $scope.contacts.email && $scope.contacts.email.length > 4 && $scope.contacts.skype && $scope.contacts.skype.length > 4 && $scope.contacts.linkedin && $scope.contacts.linkedin.length > 4 && $scope.contacts.mphone && $scope.contacts.mphone.length > 4 && $scope.candidate.fullName && $scope.candidate.fullName.length > 3) {
        //    $rootScope.loading = true;
            duplicatesByNameAndContacts = true;
            setTimeout(function(){
                $scope.addPhone = '';
                if ($scope.contacts.mphone && ($scope.contacts.mphone2 == undefined || $scope.contacts.mphone2 == '') && ($scope.contacts.mphone3 == undefined || $scope.contacts.mphone3 == '')) {
                    $scope.addPhone = $scope.contacts.mphone;
                }
                if (($scope.contacts.mphone == undefined || $scope.contacts.mphone == '') && $scope.contacts.mphone2 && $scope.contacts.mphone3) {
                    $scope.addPhone = $scope.contacts.mphone2.concat(", ", $scope.contacts.mphone3);
                }
                if (($scope.contacts.mphone == undefined || $scope.contacts.mphone == '') && ($scope.contacts.mphone2 == undefined || $scope.contacts.mphone2 == '') && $scope.contacts.mphone3) {
                    $scope.addPhone = $scope.contacts.mphone3;
                }
                if (($scope.contacts.mphone == undefined || $scope.contacts.mphone == '') && $scope.contacts.mphone2 && ($scope.contacts.mphone3 == undefined || $scope.contacts.mphone3 == '')) {
                    $scope.addPhone = $scope.contacts.mphone2;
                }
                if($scope.contacts.mphone && $scope.contacts.mphone2 && ($scope.contacts.mphone3 == undefined || $scope.contacts.mphone3 == '')){
                    $scope.addPhone = $scope.contacts.mphone.concat(", ", $scope.contacts.mphone2);
                }
                if($scope.contacts.mphone3 && $scope.contacts.mphone && ($scope.contacts.mphone2 == undefined || $scope.contacts.mphone2 == '')){
                    $scope.addPhone = $scope.contacts.mphone.concat(", ", $scope.contacts.mphone3);
                }
                if($scope.contacts.mphone && $scope.contacts.mphone2 && $scope.contacts.mphone3){
                    $scope.addPhone = $scope.contacts.mphone.concat(", ", $scope.contacts.mphone2).concat(", ", $scope.contacts.mphone3);
                }
                candidate.getDuplicatesByNameAndContacts({
                    email: $scope.contacts.email,
                    skype: $scope.contacts.skype,
                    linkedInUrl: $scope.contacts.linkedin,
                    phone: $scope.addPhone,
                    fullName: $scope.candidate.fullName
                }, function (res) {
                    $scope.duplicatesByNameAndContacts = [];
                    //$rootScope.loading = false;
                    if (res.status === "ok" && res.objects != undefined && res.objects.length > 0) {
                        angular.forEach(res.objects, function (c, i) {
                            //console.log(c.candidateId != $scope.candidate.candidateId, ' candID');
                            if (c.candidateId != $scope.candidate.candidateId) {
                                $scope.duplicatesByNameAndContacts.push(c);
                                if (c.type == "name") {
                                    $scope.dublicetesTypeName = c.type;
                                }
                                if (c.type == "mphone") {
                                    $scope.dublicetesTypeMphone = c.type;
                                }
                                if (c.type == "email") {
                                    $scope.dublicetesTypeEmail = c.type;
                                }
                                if (c.type == "skype") {
                                    $scope.dublicetesTypeSkype = c.type;
                                }
                                if (c.type == "linkedin") {
                                    $scope.dublicetesTypeLinkedin = c.type;
                                }
                            }
                        });
                    } else {
                        $scope.duplicatesByNameAndContacts = [];
                    }
                    duplicatesByNameAndContacts = false;
                }, function (resp) {
                    $scope.duplicatesByNameAndContacts = [];
                    duplicatesByNameAndContacts = false;
                });
            }, 2000);
        } else {
            $scope.duplicatesByNameAndContacts = [];
        }
    };

    //var duplicatesByEmailGO = false;
    //candidate.checkDuplicatesByEmail = function($scope) {
    //    if (!duplicatesByEmailGO && $scope.contacts && $scope.contacts.email && $scope.contacts.email.length > 4) {
    //        duplicatesByEmailGO = true;
    //        candidate.getDuplicates({email: $scope.contacts.email, phone: ""}, function(res) {
    //            $scope.duplicatesByEmail = [];
    //            if (res.status === "ok" && res.objects != undefined && res.objects.length > 0) {
    //                angular.forEach(res.objects, function(c, i) {
    //                    if (c.candidateId != $scope.candidate.candidateId) {
    //                        $scope.duplicatesByEmail.push(c);
    //                    }
    //                });
    //                //$scope.duplicatesByEmail = res.objects;
    //            } else {
    //                $scope.duplicatesByEmail = [];
    //            }
    //            duplicatesByEmailGO = false;
    //        }, function(resp) {
    //            $scope.duplicatesByEmail = [];
    //            duplicatesByEmailGO = false;
    //        });
    //    } else {
    //        $scope.duplicatesByEmail = [];
    //    }
    //};
    //
    //var duplicatesBySkypeGO = false;
    //candidate.checkDuplicatesBySkype = function($scope) {
    //    if (!duplicatesBySkypeGO && $scope.contacts && $scope.contacts.skype && $scope.contacts.skype.length > 4) {
    //        duplicatesBySkypeGO = true;
    //        candidate.getDuplicates({skype: $scope.contacts.skype, phone: ""}, function(res) {
    //            $scope.duplicatesBySkype = [];
    //            if (res.status === "ok" && res.objects != undefined && res.objects.length > 0) {
    //                angular.forEach(res.objects, function(c, i) {
    //                    if (c.candidateId != $scope.candidate.candidateId) {
    //                        $scope.duplicatesBySkype.push(c);
    //                    }
    //                });
    //                //$scope.duplicatesByEmail = res.objects;
    //            } else {
    //                $scope.duplicatesBySkype = [];
    //            }
    //            duplicatesBySkypeGO = false;
    //        }, function(resp) {
    //            $scope.duplicatesBySkype = [];
    //            duplicatesBySkypeGO = false;
    //        });
    //    } else {
    //        $scope.duplicatesBySkype = [];
    //    }
    //};
    //var duplicatesByLinkedinGO = false;
    //candidate.checkDuplicatesByLinkedin = function($scope) {
    //    if (!duplicatesByLinkedinGO && $scope.contacts && $scope.contacts.linkedin && $scope.contacts.linkedin.length > 4) {
    //        duplicatesByLinkedinGO = true;
    //        candidate.getDuplicates({ linkedInUrl: $scope.contacts.linkedin, phone: ""}, function(res) {
    //            $scope.duplicatesByLinkedin = [];
    //            if (res.status === "ok" && res.objects != undefined && res.objects.length > 0) {
    //                angular.forEach(res.objects, function(c, i) {
    //                    if (c.candidateId != $scope.candidate.candidateId) {
    //                        $scope.duplicatesByLinkedin.push(c);
    //                    }
    //                });
    //                //$scope.duplicatesByEmail = res.objects;
    //            } else {
    //                $scope.duplicatesByLinkedin = [];
    //            }
    //            duplicatesByLinkedinGO = false;
    //        }, function(resp) {
    //            $scope.duplicatesByLinkedin = [];
    //            duplicatesByLinkedinGO = false;
    //        });
    //    } else {
    //        $scope.duplicatesByLinkedin = [];
    //    }
    //};
    //
    //var duplicatesByPhoneGO = false;
    //candidate.checkDuplicatesByPhone = function($scope) {
    //    if (!duplicatesByPhoneGO && $scope.contacts && $scope.contacts.mphone && $scope.contacts.mphone.length > 4) {
    //        duplicatesByPhoneGO = true;
    //        candidate.getDuplicates({email: "", phone: $scope.contacts.mphone}, function(res) {
    //            $scope.duplicatesByPhone = [];
    //            if (res.status === "ok" && res.objects != undefined && res.objects.length > 0) {
    //                angular.forEach(res.objects, function(c, i) {
    //                    if (c.candidateId != $scope.candidate.candidateId) {
    //                        $scope.duplicatesByPhone.push(c);
    //                    }
    //                });
    //                //$scope.duplicatesByPhone = res.objects;
    //            } else {
    //                $scope.duplicatesByPhone = [];
    //            }
    //            duplicatesByPhoneGO = false;
    //        }, function(resp) {
    //            $scope.duplicatesByPhone = [];
    //            duplicatesByPhoneGO = false;
    //        });
    //    } else {
    //        $scope.duplicatesByPhone = [];
    //    }
    //};
    //
    //var duplicatesByNameGO = false;C
    //var fullNamePattern = "/^[A-Za-zА-Яа-яёЁІіЇїЄєҐґ’'`\-]+(\s+[A-Za-zА-Яа-яёЁІіЇїЄєҐґ’'`\-]+)+(\s+[A-Za-zА-Яа-яёЁІіЇїЄєҐґ’'`\-]+)*$/";
    //candidate.checkDuplicatesByName = function($scope) {
    //    console.log(duplicatesByNameGO);
    //    console.log($scope.candidate.fullName);
    //    console.log($scope.candidate.fullName.match(fullNamePattern));
    //    if (!duplicatesByNameGO && $scope.candidate.fullName && $scope.candidate.fullName.length > 3) {
    //        duplicatesByNameGO = true;
    //        candidate.getDuplicatesByName({fullName: $scope.candidate.fullName}, function(res) {
    //            $scope.duplicatesByName = [];
    //            if (res.status === "ok" && res.objects != undefined && res.objects.length > 0) {
    //                angular.forEach(res.objects, function(c, i) {
    //                    if (c.candidateId != $scope.candidate.candidateId) {
    //                        $scope.duplicatesByName.push(c);
    //                    }
    //                });
    //            } else {
    //                $scope.duplicatesByName = [];
    //            }
    //            duplicatesByNameGO = false;
    //        }, function(resp) {
    //            $scope.duplicatesByName = [];
    //            duplicatesByNameGO = false;
    //        });
    //    } else {
    //        $scope.duplicatesByName = [];
    //    }
    //};

    function countCandProperties($scope, candidate) {
        var allPuncts = 15;
        var allPuncts3 = allPuncts / 100 * 3;
        var allPuncts5 = allPuncts / 100 * 5;
        var allPuncts50 = allPuncts / 100 * 50;
        var progressMessage = [];
        var count = 0;
        if (candidate) {
            if (candidate.fullName) {
                count = count + allPuncts5;
            } else {
                progressMessage.push($filter('translate')("full_name"));
            }
            if (candidate.contacts !== undefined && candidate.contacts !== null && candidate.contacts.length !== 0) {
                var i = 0;
                angular.forEach(candidate.contacts, function(val) {
                    if (angular.equals(val.type, "email" || val.type, "skype")) {
                        count = count + allPuncts5;
                        i++
                    }
                    if (angular.equals(val.type, "linkedin")) {
                        count = count + allPuncts5;
                        i++
                    }
                    if (angular.equals(val.type, "mphone")) {
                        count = count + allPuncts5;
                        i++
                    }
                });
                if(i < 3){
                    progressMessage.push($filter('translate')("contacts") + "(" + $filter('translate')("Phone, email, linkedin") + ")");
                }
            } else {
                progressMessage.push($filter('translate')("contacts") + "(" + $filter('translate')("Phone, email, linkedin") + ")");
            }
            if (candidate.coreSkills) {
                if(candidate.coreSkills.length > 30){
                    count = count + allPuncts3;
                }else{
                    progressMessage.push($filter('translate')("Skills with text"));
                }
            } else {
                progressMessage.push($filter('translate')("Skills with text"));
            }
            if (candidate.db) {
                count = count + allPuncts3;
            } else {
                progressMessage.push($filter('translate')("date_of_birth"));
            }
            if (candidate.descr || candidate.files || ($scope.fileForSave !== undefined && $scope.fileForSave !== null && $scope.fileForSave.length !== 0)) {
                if(candidate.descr.length > 500){
                    count = count + allPuncts50;
                } else if(candidate.files.length > 0 || ($scope.fileForSave !== undefined && $scope.fileForSave !== null && $scope.fileForSave.length !== 0)){
                    count = count + allPuncts50;
                }
            } else{
                if(!candidate.descr <= 500){
                    progressMessage.push($filter('translate')("description"));
                }
                if(!candidate.files || ($scope.fileForSave == undefined && $scope.fileForSave == null)){
                    progressMessage.push($filter('translate')("files"));
                }
            }

            //if (!candidate.descr || !candidate.files || ($scope.fileForSave == undefined && $scope.fileForSave == null && $scope.fileForSave.length == 0)) {
            //
            //}
            //if (candidate.education) {
            //    count++;
            //} else {
            //    progressMessage.push($filter('translate')("education"));
            //}
            //if (candidate.employmentType) {
            //    count++;
            //} else {
            //    progressMessage.push($filter('translate')("employment_type"));
            //}
            if (candidate.expirence) {
                count = count + allPuncts3;
            } else {
                progressMessage.push($filter('translate')("experience"));
            }
            //if (candidate.files || ($scope.fileForSave !== undefined && $scope.fileForSave !== null && $scope.fileForSave.length !== 0)) {
            //    count++;
            //} else {
            //    progressMessage.push($filter('translate')("files"));
            //}
            //if (candidate.industry) {
            //    count++;
            //} else {
            //    progressMessage.push($filter('translate')("industry"));
            //}
            if (candidate.languages) {
                count = count + allPuncts3;
            } else {
                progressMessage.push($filter('translate')("languages"));
            }
            if (candidate.photo) {
                count = count + allPuncts5;
            } else {
                progressMessage.push($filter('translate')("photo"));
            }
            if (candidate.position) {
                count = count + allPuncts5;
            } else {
                progressMessage.push($filter('translate')("position"));
            }
            if (candidate.region) {
                count = count + allPuncts5;
            } else {
                progressMessage.push($filter('translate')("lives_in"));
            }
            if (candidate.salary) {
                count = count + allPuncts3;
            } else {
                progressMessage.push($filter('translate')("desired_salary"));
            }
        }
        $scope.progressMessage = $filter('translate')("empty_fields") + "(" + progressMessage.length + "): ";
        $.each(progressMessage, function(i, p) {
            $scope.progressMessage += "" + p + "; ";
        });
        return count;
    }
    candidate.externalSource = function() {
        if ($localStorage.isExist("search_external") && JSON.parse($localStorage.get("search_external")).version != undefined && JSON.parse($localStorage.get("search_external")).version == 6) {
            return JSON.parse($localStorage.get("search_external"))
        } else {
            return {
                openSettingsMenu: false,
                externalToSearch: ["rabota", "hhUa", "work", "djinni", "superJobUa"],
                visibleUa: "none",
                visibleRu: "none",
                version: 6,
                visibleKz: "none",
                visibleBy: "none",
                sourcesUa: [
                    {
                        value: "rabota",
                        name: "rabota.ua",
                        check: false
                    },
                    {
                        value: "hhUa",
                        check: false,
                        name: "hh.ua"
                    },
                    {
                        value: "work",
                        check: false,
                        name: "work.ua"
                    },
                    {
                        value: "djinni",
                        check: false,
                        name: "djinni.co"
                    },
                    {
                        value: "superJobUa",
                        check: false,
                        name: "superjob.ua"
                    }
                ],
                sourcesRu: [
                    {
                        value: "hhRu",
                        check: false,
                        name: "hh.ru"
                    },
                    {
                        value: "superJobRu",
                        check: false,
                        name: "superjob.ru"
                    },
                    {
                        value: "djinni",
                        check: false,
                        name: "djinni.co"
                    }

                ],
                sourcesKz: [
                    {
                        value: "hhKz",
                        check: false,
                        name: "hh.kz"
                    }
                ],
                sourcesBy: [
                    {
                        value: "hhBy",
                        check: false,
                        name: "jobs.tut.by"
                    },
                    {
                        value: "superJobBy",
                        check: false,
                        name: "by.superjob.ru"
                    },
                    {
                        value: "djinni",
                        check: false,
                        name: "djinni.co"
                    },

                ]
            }
        }
    };

    candidate.progressUpdate = function($scope, isEdit) {
        var cand = angular.copy($scope.candidate);
        if (isEdit) {
            //candidate.checkDuplicatesByName($scope);
            cand.languages = $scope.getSelect2Lang();
            if(cand.languages && $scope.candidate.languages) {
                if (!cand.languages.length && !$scope.candidate.languages.length){
                    cand.languages = '';
                }
            } else {
                cand.languages = '';
            }
            cand.employmentType = $scope.getSelect2EmploymentType();
            cand.db = $('.datepickerOfBirth').datetimepicker();
            //console.log( cand.db, ' cand.db');
            if ($("#pac-input").val() && $("#pac-input").val().length == 0) {
                cand.region = null;
            } else if ($("#pac-input").val() && $("#pac-input").val().length > 0) {
                cand.region = $scope.region == undefined ? cand.region : $scope.region;
            }
            cand.contacts = [];
            if ($scope.contacts !== undefined) {
                if ($scope.contacts.email) {
                    cand.contacts.push({type: "email", value: $scope.contacts.email});
                }
                //candidate.checkDuplicatesByEmail($scope);
                if ($scope.contacts.mphone) {
                    cand.contacts.push({type: "mphone", value: $scope.contacts.mphone});
                }
                //candidate.checkDuplicatesByPhone($scope);
                if ($scope.contacts.skype) {
                    cand.contacts.push({type: "skype", value: $scope.contacts.skype});
                }
                //candidate.checkDuplicatesBySkype($scope);
                if ($scope.contacts.linkedin) {
                    cand.contacts.push({type: "linkedin", value: $scope.contacts.linkedin});
                }
                if ($scope.contacts.facebook) {
                    cand.contacts.push({type: "facebook", value: $scope.contacts.facebook});
                }
                if ($scope.contacts.googleplus) {
                    cand.contacts.push({type: "googleplus", value: $scope.contacts.googleplus});
                }
                if ($scope.contacts.homepage) {
                    cand.contacts.push({type: "homepage", value: $scope.contacts.homepage});
                }
            }
        } else {
            //candidate.checkDuplicatesByEmail($scope);
            //candidate.checkDuplicatesByPhone($scope);
            //candidate.checkDuplicatesByName($scope);
        }
        var c = countCandProperties($scope, cand);
        $scope.progressPct = c / 15 * 100 < 100 ? Math.round(c / 15 * 100) : 100;
        if ($scope.progressPct < 40) {
            color = '#C5393A'; //red
        } else if ($scope.progressPct >= 40 && $scope.progressPct < 85) {
            color = '#E78409'; //orange
        } else if ($scope.progressPct >= 85) {
            color = '#74B830'; //green
        } else {
            var color = '#CCCCCC'; //grey
        }
        $scope.progress = {width: $scope.progressPct + '%', 'background-color': color};
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };


    candidate.convert = function($scope, object) {
        if (!object.fullName && !object.photo && !object.education && !object.position && !object.expirence && !object.languages && !object.coreSkills && !object.contacts && !object.db) {
            new PNotify({
                styling: 'jqueryui',
                type: "error",
                text: $filter('translate')("We found small amount of data, it doesn't look like resume.")
            });
        } else {
            $scope.candidate = null;
            $scope.candidate = object;
            if ($scope.candidate.salary == 0) {
                $scope.candidate.salary = '';
            }
            if (object.city) {
                getPlaceInfo(object.city + ' ' + object.country, function(resp) {
                    var reg = convertToRegionObject(resp);
                    $scope.regionInput = reg.fullName;
                    $("#pac-input").val(reg.fullName);
                    $scope.candidate.region = reg;
                    $scope.region = reg

                });
            }
            if (object.country && !object.city) {
                getPlaceInfo(object.country, function(resp) {
                    var reg = convertToRegionObject(resp);
                    $scope.regionInput = reg.fullName;
                    $("#pac-input").val(reg.fullName);
                    $scope.candidate.region = reg;
                    $scope.region = reg

                });
            }
            if ($scope.candidate.currency == undefined) {
                $scope.candidate.currency = 'USD';
            }
            if ($scope.candidate.status == undefined) {
                $scope.candidate.status = 'active_search';
            }
            $(".datepickerOfBirth").val('');
            if (object.db != undefined) {
                $(".datepickerOfBirth").datetimepicker("setDate", new Date(object.db));
            }
            $scope.photoLink = $scope.serverAddress + "/getapp?id=" + $scope.candidate.photo + "&d=true";
            $scope.fileForSave = [];
            $scope.contacts = [];
            console.log(object.contacts);
            if (object.contacts != undefined) {
                $.each(object.contacts, function(i, c) {
                    if (angular.equals(c.type, "email")) {
                        $scope.contacts.email = c.value;
                    }
                    if (angular.equals(c.type, "skype")) {
                        $scope.contacts.skype = c.value;
                    }
                    if (angular.equals(c.type, "mphone")) {
                        var arr = c.value.split(",");
                        if(arr[0] != undefined){
                            $scope.contacts.mphone = arr[0].trim();
                        }
                        if(arr[1] != undefined){
                            $scope.contacts.mphone2 = arr[1].trim();
                            $scope.secondPhoneInput = true;
                        }
                        if(arr[2] != undefined){
                            $scope.contacts.mphone3 = arr[2].trim();
                            $scope.btnToAddPhone = false;
                            $scope.thirdPhoneInput = true;
                        }
                        console.log($scope.contacts);
                    }
                    if (angular.equals(c.type, "homepage")) {
                        $scope.contacts.homepage = c.value;
                    }
                    if (angular.equals(c.type, "linkedin")) {
                        $scope.contacts.linkedin = c.value;
                    }
                });
            }
        }
    };

    candidate.ZIP = function($scope, $interval) {
        $scope.file = {}; //Model
        $scope.optionsForZIP = {
            change: function(file) {
                file.$upload(serverAddress + '/uploadZipFile', file).then(function(resp){
                    if (resp.status && angular.equals(resp.status, "error")) {
                        notificationService.error(resp.message);
                    } else {
                        $scope.zipInfo = function () {
                            //$scope.zipType = $('#zipType').val();
                            var fullPath = $('#zip').val();
                            if (fullPath) {
                                if($scope.zipBrowser == 'Firefox'){
                                    $scope.filename = fullPath;
                                }
                                else{
                                    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                                    var filename = fullPath.substring(startIndex);
                                    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                                        $scope.filename = filename.substring(1);
                                    }
                                }
                            }
                            if($('#zipButton1').prop('checked')){
                                $scope.zipType =$('#zipButton1').val()
                            }
                            if($('#zipButton2').prop('checked')){
                                $scope.zipType =$('#zipButton2').val()
                            }
                            if($('#zipButton3').prop('checked')){
                                $scope.zipType =$('#zipButton3').val()
                            }

                            if($('#noFiles').prop('checked')){
                                $scope.zipTypeFiles = true;
                            }
                            if($('#hasFiles').prop('checked')){
                                $scope.zipTypeFiles = false;
                            }
                        };
                        $scope.zipInfo();
                        $scope.response = JSON.parse(resp.response);
                        if($scope.response.status == 'ok'){
                            notificationService.success($filter('translate')('Your archive successfully loaded'));
                            if($scope.regionzip.length <=1){
                                $.ajax({
                                    url: "/hr/setZipFileParams",
                                    type: "POST",
                                    data:'{"fileName":"'+$scope.filename+'","type":"'+$scope.zipType+'","countries":"'+$scope.regionzip[0].country+'","countryIds":"'+$scope.regionzip[0].googlePlaceId.googlePlaceId+'","onlyResume":"'+$scope.zipTypeFiles+'"}',
                                    dataType: "json",
                                    contentType: "application/json"
                                });
                            }
                            else if($scope.regionzip.length <=2){
                                $.ajax({
                                    url: "/hr/setZipFileParams",
                                    type: "POST",
                                    data:'{"fileName":"'+$scope.filename+'","type":"'+$scope.zipType+'","countries":"'+$scope.regionzip[0].country+','+$scope.regionzip[1].country+'","countryIds":"'+$scope.regionzip[0].googlePlaceId.googlePlaceId+','+$scope.regionzip[1].googlePlaceId.googlePlaceId+'","onlyResume":"'+$scope.zipTypeFiles+'"}',
                                    dataType: "json",
                                    contentType: "application/json"
                                });
                            }
                            else{
                                $.ajax({
                                    url: "/hr/setZipFileParams",
                                    type: "POST",
                                    data:'{"fileName":"'+$scope.filename+'","type":"'+$scope.zipType+'","countries":"'+$scope.regionzip[0].country+','+$scope.regionzip[1].country+','+$scope.regionzip[2].country+'","countryIds":"'+$scope.regionzip[0].googlePlaceId.googlePlaceId+','+$scope.regionzip[1].googlePlaceId.googlePlaceId+','+$scope.regionzip[2].googlePlaceId.googlePlaceId+'","onlyResume":"'+$scope.zipTypeFiles+'"}',
                                    dataType: "json",
                                    contentType: "application/json"
                                });
                            }
                        }else{
                            notificationService.error($scope.response.message);
                        }
                        $scope.updateZipList();
                        var stopRefreshing = false;
                        var start = $interval(function(){
                            $scope.updateZipList();
                            angular.forEach($scope.zipUploads, function(data){
                                if($scope.response.object.uplId == data.uplId){
                                    if(data.status == 'finished'){
                                        stopRefreshing = true;
                                    }
                                }
                            });
                            if(stopRefreshing){
                                $interval.cancel(start);
                            }
                        }, 5000);
                    }
                });
            }
        };
    };

    candidate.convert2 = function($scope, object, toSave) {
        var updateText = '';
        if ($('.datepickerOfBirth').datetimepicker('getDate') == null && object.db) {
            $(".datepickerOfBirth").datetimepicker("setDate", new Date(object.db));
            updateText += ' ' + $filter('translate')("date_of_birth");
        }
        if (!$scope.candidate.fullName && object.fullName) {
            $scope.candidate.fullName = object.fullName;
            if (updateText) {
                updateText += ',';
            }
            updateText += ' ' + $filter('translate')("full_name");
        }
        if (!$scope.candidate.position && object.position) {
            $scope.candidate.position=$scope.setPositionAutocompleterValue(object.position);
            //$scope.candidate.position = object.position;
            if (updateText) {
                updateText += ',';
            }
            updateText += ' ' + $filter('translate')("position");
        }
        if (!$scope.candidate.photo && object.photo) {
            $scope.candidate.photo = object.photo;
            if (updateText) {
                updateText += ',';
            }
            updateText += ' ' + $filter('translate')("photo");
        }
        if($scope.candidate.photo){
            $scope.photoLink = $scope.serverAddress + "/getapp?id=" + $scope.candidate.photo + "&d=true"
        }
        if (!$scope.regionInput && object.city) {
            $scope.regionInput = object.city;
            if (updateText) {
                updateText += ',';
            }
            updateText += ' ' + $filter('translate')("city");
        }
        if (!toSave && object.contacts != undefined) {
            $.each(object.contacts, function(i, c) {
                if (angular.equals(c.type, "email") && !$scope.contacts.email && c.value) {
                    $scope.contacts.email = c.value;
                    if (updateText) {
                        updateText += ',';
                    }
                    updateText += ' ' + $filter('translate')("Email");
                }
                candidate.checkDuplicatesByNameAndContacts($scope);
                //candidate.checkDuplicatesByEmail($scope);
                if (angular.equals(c.type, "skype") && !$scope.contacts.skype && c.value) {
                    $scope.contacts.skype = c.value;
                    if (updateText) {
                        updateText += ',';
                    }
                    updateText += ' ' + $filter('translate')("Skype");
                }
                if (angular.equals(c.type, "mphone") && !$scope.contacts.mphone && c.value) {
                    $scope.contacts.mphone = c.value;
                    if (updateText) {
                        updateText += ',';
                    }
                    updateText += ' ' + $filter('translate')("phone");
                }
                //candidate.checkDuplicatesByNameAndContacts($scope);
                //candidate.checkDuplicatesByPhone($scope);
                if (angular.equals(c.type, "homepage") && !$scope.contacts.homepage && c.value) {
                    $scope.contacts.homepage = c.value;
                    if (updateText) {
                        updateText += ',';
                    }
                    updateText += ' ' + $filter('translate')("home_page");
                }
            });
            $scope.candidate.position=$scope.getPositionAutocompleterValue();
        }
        if (toSave && object.contacts != undefined && false) {
            $.each(object.contacts, function(i, c) {
                if (angular.equals(c.type, "email") && c.value) {
                    var needContact = true;
                    $.each($scope.candidate.contacts, function(j, cOld) {
                        if (angular.equals(cOld.type, "email") && cOld.value) {
                            needContact = false;
                        }
                    });
                    if (needContact) {
                        $scope.candidate.contacts.push({type: "email", value: c.value});
                        if (updateText) {
                            updateText += ',';
                        }
                        updateText += ' ' + $filter('translate')("Email");
                    }
                }
                candidate.checkDuplicatesByNameAndContacts($scope);
                //candidate.checkDuplicatesByEmail($scope);
                if (angular.equals(c.type, "skype") && c.value) {
                    var needContact = true;
                    $.each($scope.candidate.contacts, function(j, cOld) {
                        if (angular.equals(cOld.type, "skype") && cOld.value) {
                            needContact = false;
                        }
                    });
                    if (needContact) {
                        $scope.candidate.contacts.push({type: "skype", value: c.value});
                        if (updateText) {
                            updateText += ',';
                        }
                        updateText += ' ' + $filter('translate')("Skype");
                    }
                }
                //candidate.checkDuplicatesByNameAndContacts($scope);
                //candidate.checkDuplicatesBySkype($scope);
                if (angular.equals(c.type, "mphone") && c.value) {
                    var needContact = true;
                    $.each($scope.candidate.contacts, function(j, cOld) {
                        if (angular.equals(cOld.type, "mphone") && cOld.value) {
                            needContact = false;
                        }
                    });
                    if (needContact) {
                        $scope.candidate.contacts.push({type: "mphone", value: c.value});
                        if (updateText) {
                            updateText += ',';
                        }
                        updateText += ' ' + $filter('translate')("phone");
                    }
                }
                //candidate.checkDuplicatesByNameAndContacts($scope);
                //candidate.checkDuplicatesByPhone($scope);
            });
        }
        if (!$scope.candidate.descr && object.descr && updateText !== '') {
            $scope.candidate.descr = object.descr;
            if (updateText) {
                updateText += ',';
            }
            updateText += ' ' + $filter('translate')("description");
        }
        if (updateText) {
            new PNotify({
                styling: 'jqueryui',
                type: "success",
                text: $filter('translate')("Added new data") + ":<br/>" + updateText
            });
        }
    };
    //////////////////////////////////////////////////////////////////////// Search params

    var searchParams = null;
    candidate.getSearchParams = function(){
        return searchParams;
    };
    candidate.setSearchParams = function(data){
        searchParams = data;
    };

    candidate.init();

    candidate.getAllCandidates = function (params) {
        candidate.candidateLastRequestParams = params;
        localStorage.setItem('candidateLastRequestParams', JSON.stringify(params));
        return new Promise((resolve, reject) => {
            let data;
            $rootScope.loading = true;
            candidate.all(params, (response) => {
                if(!response.objects) {
                    $rootScope.loading = false;
                    resolve(response, params);
                    return;
                }
                candidate.getCandidate = response.objects.map(item => item.localId);
                data = candidate.getCandidate;
                localStorage.setItem('getAllCandidates', JSON.stringify(data));
                $rootScope.flag = true;
                resolve(response, params);
            },() =>{
                reject();
            });
        });
    };

    candidate.deleteCandidateFromSystem = function(params) {
      return new Promise((resolve, reject) => {
         candidate.deleteCandidate(params, resp => {
             if(resp.status === 'ok') {
                 resolve(resp);
             } else {
                 reject(resp)
             }
         }, error => reject(error));
      });
    };

    function setAgeRange(name, value) {
        if(typeof (value) !== "number") {
            options[name] = null;
        } else {
            if(name === "dateTo") {
                if(typeof(options["dateFrom"]) === "number") {
                    options["dateFrom"] = ageRangeToMs(value + 1) + 86400000;
                }
                options["dateTo"] = ageRangeToMs(value);
            } else {
                options["dateFrom"] = ageRangeToMs(value + 1) + 86400000;
            }
        }
    }

    function ageRangeToMs(years) {
        return years ? (new Date(new Date().setFullYear(new Date().getFullYear() - years)).getTime()) : years;
    }

    function ageRangeToYears(ms) {
        return ms ? (new Date().getFullYear() - new Date(ms).getFullYear()) : ms;
    }

    return candidate;
}]);

 angular.module('services.fileinit', [
        'services.candidate'
    ]
).factory('FileInit', ['serverAddress', '$http', 'Candidate', 'notificationService', '$rootScope', function(serverAddress, $http, Candidate, notificationService, $rootScope) {
    return {
        initFileOption: function($scope, path, setings, $filter) {
            $scope.file = {}; //Model
            $scope.options = {
                change: function(file) {
                    $rootScope.loading = true;
                    var uri = serverAddress;
                    if (path != undefined)
                        uri = uri + "/" + path;
                    uri = uri + '/addFile';
                    if ($scope.objectId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        /** @namespace data.item.thumb */
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $scope.loading = false;
                        $rootScope.loading = false;
                        var resp = JSON.parse(data.response);

                        if (data.statusText == 'OK' && resp.status != 'error') {
                            if ($scope.callbackFile != undefined) {
                                $scope.callbackFile(data.data.objects[0], $scope.file.filename);
                                if(path == 'candidate'){
                                    $scope.updateCandidate();
                                }else {
                                    $scope.updateClient();
                                }
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "success",
                                    text: ($filter('translate')('history_info.added_file'))
                                });
                            }
                        } else if (resp.status == 'error') {
                            notificationService.error(resp.message);
                            if ($scope.callbackFileError != undefined) {
                                $scope.callbackFileError("error");
                            }
                        }
                    }).catch(function(data) {

                        $scope.loading = false;

//                            data.response= JSON.parse(data.response);
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: $filter('translate')('Allowed file formats') + ": " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initFileVacancy: function($scope, path, $filter, setings) {
            $scope.fileForVacancy = {}; //Model
            $scope.optionsForVacancy = {
                change: function(file) {
                    $rootScope.loading = true;
                    var uri = serverAddress;
                    if (path != undefined)
                        uri = uri + "/" + path;
                    uri = uri + '/addFile';
                    if ($scope.objectId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        /** @namespace data.item.thumb */
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.fileForVacancy, setings, $scope).then(function(data) {
                        $scope.loading = false;
                        var resp = JSON.parse(data.response);

                        if (data.statusText == 'OK' && resp.status != 'error') {
                            if ($scope.callbackFile != undefined) {
                                $scope.callbackFile(data.data.objects[0], $scope.fileForVacancy.filename);
                                $scope.updateVacancy();
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "success",
                                    text: ($filter('translate')('history_info.added_file'))
                                });
                            }
                        } else if (resp.status == 'error') {
                            notificationService.error(resp.message);
                            if ($scope.callbackFileError != undefined) {
                                $scope.callbackFileError("error");
                            }
                        }
                    }).catch(function(data) {

                        $scope.loading = false;

//                            data.response= JSON.parse(data.response);
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: $filter('translate')('Allowed file formats') + ": " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initCandFileOption: function($scope, path, setings, toSave, $filter) {
            $scope.file = {}; //Model
            $scope.options = {
                change: function(file) {
                    var uri = serverAddress;
                    if (path != undefined)
                        uri = uri + "/" + path;
                    uri = uri + '/addFile';
                    if ($scope.objectId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $scope.loading = false;
                        console.log(data);
                        if (data.data.status == 'ok') {
                            if ($scope.callbackFile != undefined) {
                                $scope.callbackFile(data.data.objects[0], $scope.file.filename);
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "success",
                                    text: ($filter('translate')('history_info.added_file'))
                                });
                            }
                            $scope.fastCandAttachProcessId = data.data.objects[0];
                            $scope.fastCandAttachProcess = true;
                            //file.$upload(serverAddress + '/candidate/fromFile', file).then(function(data) {
                            //    console.log(data);
                            //    Candidate.convert2($scope, data.data.object, toSave);
                            //    if (toSave) {
                            //    }
                            //    $scope.fastCandAttachProcess = false;
                            //}).catch(function(data) {
                            //    console.log(data);
                            //    //$scope.callbackErr(data.statusText);
                            //    $scope.fastCandAttachProcess = false;
                            //});
                        }else{
                            console.log(2);
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "error",
                                    text: data.data.message
                                });
                        }
                    }).catch(function(data) {
                        $scope.loading = false;
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Возможные форматы файла: " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initVacancyTemplateInCandidateFileOption: function($scope, $rootScope, path, setings, toSave, $filter) {
            $scope.file = {}; //Model
            $rootScope.optionsTemplate = {
                change: function(file) {
                    var uri = serverAddress;
                    //if (path != undefined)
                    //    uri = uri + "/" + path;
                    uri = uri + '/addFile';
                    console.log(uri);
                    console.log(12321);
                    if ($scope.fileId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $scope.loading = false;
                        console.log(data);
                        if (data.data.status == 'ok') {
                            if ($scope.callbackFileTemplateInCandidate != undefined) {
                                $scope.callbackFileTemplateInCandidate(data.data.objects[0], $scope.file.filename);
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "success",
                                    text: ($filter('translate')('history_info.added_file'))
                                });
                            }
                            $scope.fastCandAttachProcessId = data.data.objects[0];
                            $scope.fastCandAttachProcess = true;
                            //file.$upload(serverAddress + '/candidate/fromFile', file).then(function(data) {
                            //    console.log(data);
                            //    Candidate.convert2($scope, data.data.object, toSave);
                            //    if (toSave) {
                            //    }
                            //    $scope.fastCandAttachProcess = false;
                            //}).catch(function(data) {
                            //    console.log(data);
                            //    //$scope.callbackErr(data.statusText);
                            //    $scope.fastCandAttachProcess = false;
                            //});
                        }else{
                            console.log(2);
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: data.data.message
                            });
                        }
                    }).catch(function(data) {
                        $scope.loading = false;
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Возможные форматы файла: " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initVacancyTemplateFileOption: function($scope, path, setings, toSave, $filter) {
            $scope.file = {}; //Model
            $scope.optionsForTemplate = {
                change: function(file) {
                    var uri = serverAddress;
                    if (path != undefined)
                        uri = uri + "/" + path;
                    uri = uri + '/addFile';
                    if ($scope.fileId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    $rootScope.loading = true;
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $rootScope.loading = false;
                        console.log(data);
                        if (data.data.status == 'ok') {
                            if ($scope.callbackFileForTemplate != undefined) {
                                $scope.callbackFileForTemplate(data.data.objects[0], $scope.file.filename);
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "success",
                                    text: ($filter('translate')('history_info.added_file'))
                                });
                            }
                            $scope.fastCandAttachProcessId = data.data.objects[0];
                            $scope.fastCandAttachProcess = true;
                            //file.$upload(serverAddress + '/candidate/fromFile', file).then(function(data) {
                            //    console.log(data);
                            //    Candidate.convert2($scope, data.data.object, toSave);
                            //    if (toSave) {
                            //    }
                            //    $scope.fastCandAttachProcess = false;
                            //}).catch(function(data) {
                            //    console.log(data);
                            //    //$scope.callbackErr(data.statusText);
                            //    $scope.fastCandAttachProcess = false;
                            //});
                        }else{
                            console.log(2);
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: data.data.message
                            });
                        }
                    }).catch(function(data) {
                        $scope.loading = false;
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Возможные форматы файла: " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initVacancyTemplateInCandidateFileOption: function($scope, $rootScope, path, setings, toSave, $filter) {
            $scope.file = {}; //Model
            $rootScope.optionsTemplate = {
                change: function(file) {
                    var uri = serverAddress;
                    //if (path != undefined)
                    //    uri = uri + "/" + path;
                    uri = uri + '/addFile';
                    console.log(uri);
                    console.log(12321);
                    if ($scope.fileId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $scope.loading = false;
                        console.log(data);
                        if (data.data.status == 'ok') {
                            if ($scope.callbackFileTemplateInCandidate != undefined) {
                                $scope.callbackFileTemplateInCandidate(data.data.objects[0], $scope.file.filename);
                                new PNotify({
                                    styling: 'jqueryui',
                                    type: "success",
                                    text: ($filter('translate')('history_info.added_file'))
                                });
                            }
                            $scope.fastCandAttachProcessId = data.data.objects[0];
                            $scope.fastCandAttachProcess = true;
                            //file.$upload(serverAddress + '/candidate/fromFile', file).then(function(data) {
                            //    console.log(data);
                            //    Candidate.convert2($scope, data.data.object, toSave);
                            //    if (toSave) {
                            //    }
                            //    $scope.fastCandAttachProcess = false;
                            //}).catch(function(data) {
                            //    console.log(data);
                            //    //$scope.callbackErr(data.statusText);
                            //    $scope.fastCandAttachProcess = false;
                            //});
                        }else{
                            console.log(2);
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: data.data.message
                            });
                        }
                    }).catch(function(data) {
                        $scope.loading = false;
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Возможные форматы файла: " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initFileOptionForEditFromResume: function($scope, path, setings) {
            $scope.file = {}; //Model
            $scope.optionsForEditFromResume = {
                change: function(file) {
                    var uri = serverAddress;
                    if (path != undefined)
                        uri = uri + "/" + path;
                    uri = uri + '/updateFromFile';
                    if ($scope.objectId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        /** @namespace data.item.thumb */
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $scope.loading = false;
                        var resp = JSON.parse(data.response);

                        if (data.statusText == 'OK' && resp.status != 'error') {
                            if ($scope.callbackFile != undefined) {
                                $scope.updateCandidate();
                            }
                        } else if (resp.status == 'error') {
                            notificationService.error(resp.message);
                            if ($scope.callbackFileError != undefined) {
                                $scope.callbackFileError("error");
                            }
                        }
                        $('.confirmationResumeUpdate.modal').modal('hide');
                    }).catch(function(data) {

                        $scope.loading = false;

//                            data.response= JSON.parse(data.response);
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Возможные форматы файла: " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        initFileExcellUpload: function($rootScope, $scope, path, setings, $filter) {
            $scope.file = {}; //Model
            $scope.options = {
                change: function(file) {
                    $rootScope.loading = true;
                    console.log('hereeeeeeeeeee');
                    var uri = serverAddress;
                    if (path != undefined)
                        uri = uri + "/" + path;
                    uri = uri + '/uploadExcelFile';
                    if ($scope.objectId != undefined)
                        uri = uri + "/" + $scope.objectId;
                    $scope.fileIsSelected = true;
                    $scope.ngShowOldFile = false;
                    file.$preview(file).then(function(data) {
                        /** @namespace data.item.thumb */
                        $scope.newImgSrc = data.item.thumb;
                        $scope.fileName = data.item.filename;
                        $scope.ngShowNewImage = true;
                    });
                    file.$upload(uri, $scope.file, setings, $scope).then(function(data) {
                        $('#file').val('');
                        var resp = JSON.parse(data.response);

                        if (data.statusText == 'OK' && resp.status != 'error') {
                            //if ($scope.callbackFile != undefined) {
                            //    $scope.callbackFile(data.data.objects[0], $scope.file.filename);
                            //}
                            $rootScope.loading = false;
                            new PNotify({
                                styling: 'jqueryui',
                                type: "success",
                                text: ($filter('translate')('history_info.added_file'))
                            });
                        } else if (resp.status == 'error') {
                            $rootScope.loading = false;
                            notificationService.error(resp.message);
                            if ($scope.callbackFileError != undefined) {
                                $scope.callbackFileError("error");
                            }
                        }
                    }).catch(function(data) {

                        $('#file').val('');
                        $rootScope.loading = false;
//                            data.response= JSON.parse(data.response);
                        if (data.response[0].code == 'type') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: $filter('translate')('Allowed file formats') + ": " + setings.allowedType.join(", ")
                            });
                        }
                        if (data.response[0].code == 'upload') {
                            console.log("upload===");
                        }
                        if (data.response[0].code == 'size') {
                            new PNotify({
                                styling: 'jqueryui',
                                type: "error",
                                text: "Большой размер файла"
                            });
                        }
                    });

                }
            };
        },
        addPhotoByReference: function(url, callback) {
            console.log('in serv', url)
            $http({
                url: serverAddress + '/addPhotoByReference',
                method: "GET",
                params: {reference: url}
            }).success(function(data) {
                if (data.status == "ok") {
                    callback(data.object);
                } else if (data.status == "error") {
                    callback('error')
                    notificationService.error(data.message)
                }
            });
        }
    };
     var FileInit = $resource(serverAddress + '/action/:param', {param: "@param"}, {
             changeFileName: {
                 method : "POST",
                 headers: {'Content-type':'application/json; charset=UTF-8'},
                 params: {
                     param: 'changeFileName'
                 }
             }


         });

     return FileInit;
}]);

angular.module('services.globalService', [
        'ngResource',
        'pascalprecht.translate',
        'services.notice'
    ]
).factory('Service', ['$resource', 'serverAddress', '$filter', '$translate', '$location', 'notificationService', '$rootScope', function($resource, serverAddress, $filter, $translate, $location, notificationService, $rootScope) {
    var service = $resource(serverAddress + '/:service/:action', {service: "@service", action: "@action"}, {
        getRegions: {
            method: "GET",
            params: {
                service: "region",
                action: "get"
            }
        },
        getRegionsTwo: {
            method: "GET",
            params: {
                service: "region",
                action: "get2"
            }
        },
        history: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "action",
                action: "get"
            }
        },
        notice: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "notice",
                action: "get"
            }
        },
        readNotice: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "notice",
                action: "read"
            }
        },
        publicVacancy: {
            method: "GET",
            params: {
                service: "public",
                action: "getVacancy"
            }
        },
        publicCandidate:{
          method:"GET",
            params: {
                service: "public",
                action: "getCandidate"
            }
        },
        saveAccessLogEntry: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "public",
                action: "saveAccessLogEntry"
            }
        },
        addCandidate: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "public",
                action: "addRecall"
            }
        },
        getEvaluation: {
            method: "GET",
            params: {
                service: "public",
                action: "getEvaluation"
            }
        },
        sendDailyReportExample: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "public",
                action: "sendDailyReportExample"
            }
        },
        getClientNames: {
            method: "GET",
            params: {
                service: "public",
                action: "getClientNames"
            }
        },
        addVacancyPackage: {
            method: "POST",
            params: {
                service: "public",
                action: "addVacancyPackage"
            }
        },
        saveBrowserWithPlugin: {
            method: "GET",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params : {
                service: "person",
                action: "saveBrowserWithPlugin"
            }
        },
        getOrgLogoId: {
            method: "GET",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params : {
                service : "company",
                action : "getOrgLogoId"
            }
        },
        removeLogo: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params: {
                service: "company",
                action: "removeLogo"
            }
        },
        readAt: {
            method: "POST",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params : {
                service : "at",
                action : "read"
            }
        },
        getGroups: {
            method: "GET",
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            params : {
                service : "candidateGroup",
                action : "getGroups"
            }
        },
        getAllOpenVacancy: {
            method: "GET",
            params: {
                service: "public",
                action: "getAllOpenVacancy"
            }
        }

    });
    service.regions = function(callbacl) {

    };
    service.getRegions2 = function(callback) {
        service.getRegionsTwo(function(resp) {
            var country = [];
            var cities = [];
            var sortArrayCountry = [];
            var sortArrayCities = [];
            var sortObjectCountry = {};
            var sortObjectCities = {};
            angular.forEach(resp.object, function(valC, keyC) {
                country.push({id:keyC,value: keyC, name: keyC, type: "country", showName: keyC, country: keyC, nameRu: keyC});
                angular.forEach(valC, function(val, key) {
                    if (val.type == 'country') {
                        country.push({
                            id:val.displayCity+keyC,
                            value: val.regionId,
                            name: val.displayCity,
                            type: "country",
                            showName: val.displayCity,
                            nameRu: (val.googlePlaceId == undefined || val.googlePlaceId.cityRu == undefined) ? val.city : val.googlePlaceId.cityRu,
                            nameEn: (val.googlePlaceId == undefined || val.googlePlaceId.cityEn == undefined) ? val.city : val.googlePlaceId.cityEn,
                            country: keyC,
                            countryRu: (val.googlePlaceId == undefined || val.googlePlaceId.countryRu == undefined) ? val.country : val.googlePlaceId.countryRu
                        });
                    }else{
                        cities.push({
                            id:val.displayCity+keyC,
                            value: val.regionId,
                            name: val.displayCity,
                            type: "city",
                            showName: val.displayCity,
                            nameRu: (val.googlePlaceId == undefined || val.googlePlaceId.cityRu == undefined) ? val.city : val.googlePlaceId.cityRu,
                            nameEn: (val.googlePlaceId == undefined || val.googlePlaceId.cityEn == undefined) ? val.city : val.googlePlaceId.cityEn,
                            country: keyC,
                            countryRu: (val.googlePlaceId == undefined || val.googlePlaceId.countryRu == undefined) ? val.country : val.googlePlaceId.countryRu
                        });
                    }
                    angular.forEach(country, function(valIn, keyIn) {
                        if (valIn.value == val.country) {
                            valIn.name = val.displayCountry;
                            valIn.showName = val.displayCountry;
                            valIn.nameRu = (val.googlePlaceId == undefined || val.googlePlaceId.countryRu == undefined) ? val.country : val.googlePlaceId.countryRu;
                        }
                    })
                });
            });
            angular.forEach(country,function(data){
                sortArrayCountry.push(data.id)
            });
            angular.forEach(cities,function(data){
                sortArrayCities.push(data.id)
            });
            sortArrayCountry = sortArrayCountry.sort();
            sortArrayCities = sortArrayCities.sort();

            angular.forEach(sortArrayCountry,function(name,key){
                    angular.forEach(country,function(obj){
                        if(name == obj.id){
                            sortObjectCountry[key] = obj;
                        }
                    })
            });
            angular.forEach(sortArrayCities,function(name,key){
                angular.forEach(cities,function(obj){
                    if(name == obj.id){
                        sortObjectCities[key] = obj;
                    }
                })
            });
            //angular.forEach(sortObjectCities,function(obj){
            //    if(obj.name == 'Одесса'){
            //        console.log(obj)
            //    }
            //});
            if (callback != undefined)
                callback(sortObjectCountry, sortObjectCities);
        });
    };
    service.getIndustries = function() {
        return [
            {value: "Accounting, Auditing"},
            {value: "Agriculture, agribusiness"},
            {value: "Automotive"},
            {value: "Aviation & Aerospace"},
            {value: "Beauty, fitness and sports"},
            {value: "Charity & NGO"},
            {value: "Chemicals"},
            {value: "Construction and architecture"},
            {value: "Consulting"},
            {value: "Consumer Goods"},
            {value: "Culture, music, show business"},
            {value: "Design, creativity"},
            {value: "Energy industry"},
            {value: "E-Commerce"},
            {value: "Education"},
            {value: "Engineering"},
            {value: "Engineering Consulting"},
            {value: "Engineering Services"},
            {value: "Finance, bank"},
            {value: "FMCG"},
            {value: "Government"},
            {value: "Healthcare, hospital"},
            {value: "HR Management, HR"},
            {value: "Hotel and restaurant business, tourism"},
            {value: "Insurance"},
            {value: "IT, computers, the Internet"},
            {value: "IT Consulting"},
            {value: "Logistics, warehouse, Foreign Trade"},
            {value: "Legal"},
            {value: "Manufacturing"},
            {value: "Marketing, Advertising, PR"},
            {value: "Media, publishing, printing"},
            {value: "Medicine, pharmacy"},
            {value: "Mining"},
            {value: "Network Marketing and MLM"},
            {value: "Oil & Gas"},
            {value: "Real Estate"},
            {value: "Retail"},
            {value: "Sales Jobs"},
            {value: "Secretariat, outsourcing, ACS"},
            {value: "Security, Safety"},
            {value: "Service industries"},
            {value: "Telecommunications"},
            {value: "Top management, senior management"},
            {value: "Transport, Telecom"},
            {value: "Travel & Tourism"},
            {value: "Work at home"},
            {value: "Work for students, early career"},
            {value: "Work without special training"},
            {value: "Other areas of activity"}
        ];
    };

    service.getSalary = function() {
        return [
            {name: "up to 500", salaryFrom: "0", salaryTo: "500"},
            {name: "500-1500", salaryFrom: "500", salaryTo: "1500"},
            {name: "1500-2500", salaryFrom: "1500", salaryTo: "2500"},
            {name: "2500-3500", salaryFrom: "2500", salaryTo: "3500"},
            {name: "3500-4500", salaryFrom: "3500", salaryTo: "4500"},
            {name: "more", salaryFrom: "4500", salaryTo: ""}
        ];
    };

    service.currency = function() {
        return [
            {value: "USD"},
            {value: "EUR"},
            {value: "ARS"},
            {value: "AUD"},
            {value: "BRL"},
            {value: "BYN"},
            {value: "CAD"},   
            {value: "CNY"},
            {value: "GBP"},    
            {value: "HKD"},
            {value: "IDR"},
            {value: "INR"},
            {value: "JPY"},
            {value: "KZT"},
            {value: "LKR"},
            {value: "MXN"},
            {value: "MYR"},
            {value: "PHP"},
            {value: "PLN"},
            {value: "RMB"},
            {value: "RUB"},            
            {value: "SGD"},
            {value: "THB"},
            {value: "UAH"},
            {value: "ZAR"}
        ];
    };
    service.positionLevel = function() {
        return [
            {value: "specialty workers"},
            {value: "specialist  (entry level)"},
            {value: "specialist"},
            {value: "Senior Specialist / Team Leader"},
            {value: "middle manager / head of department"},
            {value: "top manager / CEO / President"}
        ];
    };

    service.employmentType = function() {
        return [
            {value: "full employment"},
            {value: "underemployment"},
            {value: "telework"},
            {value: "training_practice"},
            {value: "project work"},
            {value: "seasonal_temporary_work"},
            {value: "Relocate"}
        ];

    };
    service.numberPosition = function() {
        return [
            {value: "1"},
            {value: "2"},
            {value: "3"},
            {value: "4"},
            {value: "5"},
            {value: "6"},
            {value: "7"},
            {value: "8"},
            {value: "9"},
            {value: "10"}
        ];
    };
    service.employmentTypeTwo = function() {
        if ($translate.use() == 'ua') {
            return [
                {text: "повна зайнятість", id: "full employment"},
                {text: "неповна зайнятість ", id: "underemployment"},
                {text: "Віддалена робота ", id: "telework"},
                {text: "навчання, практика", id: "training_practice"},
                {text: "проектна робота", id: "project work"},
                {text: "сезонна, тимчасова робота", id: "seasonal_temporary_work"}
            ];
        } else if ($translate.use() == 'ru') {
            return [
                {text: "полная занятость", id: "full employment"},
                {text: "неполная занятость ", id: "underemployment"},
                {text: "удаленная работа ", id: "telework"},
                {text: "обучение, практика", id: "training_practice"},
                {text: "проектная работа", id: "project work"},
                {text: "сезонная, временная работа", id: "seasonal_temporary_work"},
                {text: "переезд", id: "Relocate"}
            ];
        } else {
            return [
                {text: "Full Time", id: "full employment"},
                {text: "Part Time", id: "underemployment"},
                {text: "Remote", id: "telework"},
                {text: "Training, Practice", id: "training_practice"},
                {text: "Project", id: "project work"},
                {text: "Temporary", id: "seasonal_temporary_work"},
                {text: "Relocate", id: "Relocate"}
            ];
        }
    };
    service.createArrayByEmploymentType = function(arrayOfName) {
        var array = service.employmentTypeTwo();
        var respArray = [];
        angular.forEach(arrayOfName, function(valueOfName) {
            angular.forEach(array, function(vlOfArr) {
                if (valueOfName == vlOfArr.id) {
                    respArray.push(vlOfArr);
                }
            });
        });
        return respArray;
    };

    service.experience = function() {
        return [
            {value: "no experience"},
            {value: "least a year"},
            {value: "1-2 years"},
            {value: "2-3 years"},
            {value: "3-4 years"},
            {value: "4-5 years"},
            {value: "5-10 years"},
            {value: "over 10 years"}
        ];
    };
    var UALang = [
        "Англійська розмовна",
        "Англійська професійна",
        "Англійська середня",
        "Англійська початківець",
        "Білоруська розмовна",
        "Білоруська професійна",
        "Білоруська середня",
        "Білоруська початківець",
        "Іспанська розмовна",
        "Іспанська професійна",
        "Іспанська середня",
        "Іспанська початківець",
        "Італійська розмовна",
        "Італійська професійна",
        "Італійська середня",
        "Італійська початківець",
        "Казахська розмовна",
        "Казахська професійна",
        "Казахська середня",
        "Казахська початківець",
        "Китайська розмовна",
        "Китайська професійна",
        "Китайська середня",
        "Китайська початківець",
        "Малайська розмовна",
        "Малайська професійна",
        "Малайська середня",
        "Малайська початківець",
        "Мандаринська розмовна",
        "Мандаринська професійна",
        "Мандаринська середня",
        "Мандаринська початківець",
        "Молдавська розмовна",
        "Молдавська професійна",
        "Молдавська середня",
        "Молдавська початківець",
        "Німецька розмовна",
        "Німецька професійна",
        "Німецька середня",
        "Німецька початківець",
        "Португальська розмовна",
        "Португальська професійна",
        "Португальська середня",
        "Португальська початківець",
        "Російська розмовна",
        "Російська професійна",
        "Російська середня",
        "Російська початківець",
        "Тамільська розмовна",
        "Тамільська професійна",
        "Тамільська середня",
        "Тамільська початківець",
        "Українська розмовна",
        "Українська професійна",
        "Українська середня",
        "Українська початківець",
        "Французька розмовна",
        "Французька професійна",
        "Французька середня",
        "Французька початківець",
        "Гінді розмовна",
        "Гінді професійна",
        "Гінді середня",
        "Гінді початківець",
        "Японська розмовна",
        "Японська професійна",
        "Японська середня",
        "Японська початківець",
     ];

    var RULang = ["Английский разговорный",
        "Английский профессиональный",
        "Английский средний",
        "Английский начинающий",
        "Белорусский разговорный",
        "Белорусский профессиональный",
        "Белорусский средний",
        "Белорусский начинающий",
        "Испанский разговорный",
        "Испанский профессиональный",
        "Испанский средний",
        "Испанский начинающий",
        "Итальянский разговорный",
        "Итальянский профессиональный",
        "Итальянский средний",
        "Итальянский начинающий",
        "Казахский разговорный",
        "Казахский профессиональный",
        "Казахский средний",
        "Казахский начинающий",
        "Китайский разговорный",
        "Китайский профессиональный",
        "Китайский средний",
        "Китайский начинающий",
        "Малайский разговорный",
        "Малайский профессиональный",
        "Малайский средний",
        "Малайский начинающий",
        "Мандаринский разговорный",
        "Мандаринский профессиональный",
        "Мандаринский средний",
        "Мандаринский начинающий",
        "Молдавский разговорный",
        "Молдавский профессиональный",
        "Молдавский средний",
        "Молдавский начинающий",
        "Немецкий разговорный",
        "Немецкий профессиональный",
        "Немецкий средний",
        "Немецкий начинающий",
        "Португальский разговорный",
        "Португальский профессиональный",
        "Португальский средний",
        "Португальский начинающий",
        "Русский разговорный",
        "Русский профессиональный",
        "Русский средний",
        "Русский начинающий",
        "Тамильский разговорный",
        "Тамильский профессиональный",
        "Тамильский средний",
        "Тамильский начинающий",
        "Украинский разговорный",
        "Украинский профессиональный",
        "Украинский средний",
        "Украинский начинающий",
        "Французский разговорный",
        "Французский профессиональный",
        "Французский средний",
        "Французский начинающий",
        "Хинди разговорный",
        "Хинди профессиональный",
        "Хинди средний",
        "Хинди начинающий",
        "Японский разговорный",
        "Японский профессиональный",
        "Японский средний",
        "Японский начинающий"

    ];
    var ENLang = [
        "English Oral",
        "English Professional",
        "English Intermediate",
        "English Elementary",
        "Belarusian Oral",
        "Belarusian Professional",
        "Belarusian Intermediate",
        "Belarusian Elementary",
        "Spanish Oral",
        "Spanish Professional",
        "Spanish Intermediate",
        "Spanish Elementary",
        "Italian Oral",
        "Italian Professional",
        "Italian Intermediate",
        "Italian Elementary",
        "Kazakh Oral",
        "Kazakh Professional",
        "Kazakh Intermediate",
        "Kazakh Elementary",
        "Chinese Oral",
        "Chinese Professional",
        "Chinese Intermediate",
        "Chinese Elementary",
        "Malay Oral",
        "Malay Professional",
        "Malay Intermediate",
        "Malay Elementary",
        "Mandarin Oral",
        "Mandarin Professional",
        "Mandarin Intermediate",
        "Mandarin Elementary",
        "Moldovan Oral",
        "Moldovan Professional",
        "Moldovan Intermediate",
        "Moldovan Elementary",
        "German Oral",
        "German Professional",
        "German Intermediate",
        "German Elementary",
        "Portuguese Oral",
        "Portuguese Professional",
        "Portuguese Intermediate",
        "Portuguese Elementary",
        "Russian Oral",
        "Russian Professional",
        "Russian Intermediate",
        "Russian Elementary",
        "Tamil Oral",
        "Tamil Professional",
        "Tamil Intermediate",
        "Tamil Elementary",
        "Ukrainian Oral",
        "Ukrainian Professional",
        "Ukrainian Intermediate",
        "Ukrainian Elementary",
        "French Oral",
        "French Professional",
        "French Intermediate",
        "French Elementary",
        "Hindi Oral",
        "Hindi Professional",
        "Hindi Intermediate",
        "Hindi Elementary",
        "Japanese Oral",
        "Japanese Professional",
        "Japanese Intermediate",
        "Japanese Elementary",
    ];

        service.lang = function() {
        if ($translate.use() == 'ua') {
            return UALang;
        } else if ($translate.use() == 'ru') {
            return RULang;
        } else {
            return ENLang;
        }
    };
    service.langTranslator = function(currentLang) {
        if (!currentLang || currentLang.length == 0) {
            return currentLang;
        }
        currentLang = currentLang.replace(/,/g, ', ');
        for (var i = 0; i < ENLang.length; i++) {
            if ($translate.use() == 'ua') {
                currentLang = currentLang.replace(ENLang[i], UALang[i]).replace(RULang[i], UALang[i]);
            }
            if ($translate.use() == 'en') {
                currentLang = currentLang.replace(UALang[i], ENLang[i]).replace(RULang[i], ENLang[i]);
            }
            if ($translate.use() == 'ru') {
                currentLang = currentLang.replace(ENLang[i], RULang[i]).replace(UALang[i], RULang[i]);
            }
        }
        return currentLang;
    };

    service.gender = function($scope) {
        $scope.sexObjectRU = [
            {name: "Мужчина", value: true},
            {name: "Женщина", value: false}
        ];
        $scope.sexObject = [
            {name: "Male", value: true},
            {name: "Female", value: false}
        ];
        $scope.sexObjectUA = [
            {name: "Чоловік", value: true},
            {name: "Жінка", value: false}
        ];
    };


    service.genderTwo = function($scope) {
        $scope.sexObjectRU = [
            {name: "Мужчина", value: true},
            {name: "Женщина", value: false},
            {name: "Не имеет значения", value: null}
        ];
        $scope.sexObject = [
            {name: "Male", value: true},
            {name: "Female", value: false},
            {name: "Doesn't matter", value: null}
        ];
        $scope.sexObjectUA = [
            {name: "Чоловік", value: true},
            {name: "Жінка", value: false},
            {name: "Не має значення", value: null}
        ];
    };

    service.toAddCandidate = function(path) {
        if ($rootScope && $rootScope.me && angular.equals($rootScope.me.recrutRole, "salesmanager")) {
            if (path) {
                $location.path(path);
            }
            notificationService.error($filter('translate')("Sales Manager cannot add candidates"));
        } else {
            $location.path("candidate/add/");
        }
    };
    service.toEditCandidate = function(id, path) {
        if ($rootScope && $rootScope.me && angular.equals($rootScope.me.recrutRole, "salesmanager")) {
            if (path) {
                $location.path(path);
            }
            notificationService.error($filter('translate')("Sales Manager cannot edit candidates"));
        } else {
            $location.path("candidate/edit/" + id);
        }
    };
    service.toMergeCandidate = function(id, path) {
        if ($rootScope && $rootScope.me && angular.equals($rootScope.me.recrutRole, "salesmanager")) {
            if (path) {
                $location.path(path);
            }
            notificationService.error($filter('translate')("Sales Manager cannot edit candidates"));
        } else {
            $location.path("candidate/merge/" + id);
        }
    };

    service.getCountryLinkedIn = function() {
        return [
            {key: "ru", value: "Россия"},
            {key: "au", value: "Австралия"},
            {key: "at", value: "Австрия"},
            {key: "az", value: "Азербайджан"},
            {key: "ax", value: "Аландские о-ва"},
            {key: "al", value: "Албания"},
            {key: "dz", value: "Алжир"},
            {key: "as", value: "Американское Самоа"},
            {key: "ai", value: "Ангилья"},
            {key: "ao", value: "Ангола"},
            {key: "ad", value: "Андорра"},
            {key: "aq", value: "Антарктида"},
            {key: "ag", value: "Антигуа и Барбуда"},
            {key: "ar", value: "Аргентина"},
            {key: "am", value: "Армения"},
            {key: "aw", value: "Аруба"},
            {key: "af", value: "Афганистан"},
            {key: "bs", value: "Багамские о-ва"},
            {key: "bd", value: "Бангладеш"},
            {key: "bb", value: "Барбадос"},
            {key: "bh", value: "Бахрейн"},
            {key: "by", value: "Беларусь"},
            {key: "bz", value: "Белиз"},
            {key: "be", value: "Бельгия"},
            {key: "bj", value: "Бенин"},
            {key: "bm", value: "Бермудские о-ва"},
            {key: "bg", value: "Болгария"},
            {key: "bo", value: "Боливия"},
            {key: "ba", value: "Босния и Герцеговина"},
            {key: "bw", value: "Ботсвана"},
            {key: "br", value: "Бразилия"},
            {key: "io", value: "Британская территория в Индийском океане"},
            {key: "bn", value: "Бруней-Даруссалам"},
            {key: "bf", value: "Буркина-Фасо"},
            {key: "bi", value: "Бурунди"},
            {key: "bt", value: "Бутан"},
            {key: "vu", value: "Вануату"},
            {key: "va", value: "Ватикан"},
            {key: "gb", value: "Великобритания"},
            {key: "hu", value: "Венгрия"},
            {key: "ve", value: "Венесуэла"},
            {key: "vg", value: "Виргинские о-ва (Британские)"},
            {key: "vi", value: "Виргинские о-ва (США)"},
            {key: "tl", value: "Восточный Тимор"},
            {key: "tp", value: "Восточный Тимор"},
            {key: "tl", value: "Восточный Тимор"},
            {key: "tp", value: "Восточный Тимор"},
            {key: "vn", value: "Вьетнама"},
            {key: "ga", value: "Габон"},
            {key: "ht", value: "Гаити"},
            {key: "gy", value: "Гайана"},
            {key: "gm", value: "Гамбия"},
            {key: "gh", value: "Гана"},
            {key: "gp", value: "Гваделупа"},
            {key: "gt", value: "Гватемала"},
            {key: "gn", value: "Гвинея"},
            {key: "gw", value: "Гвинея-Бисау"},
            {key: "de", value: "Германия"},
            {key: "gg", value: "Гернси"},
            {key: "gi", value: "Гибралтар"},
            {key: "hn", value: "Гондурас"},
            {key: "hk", value: "Гонконг"},
            {key: "gd", value: "Гренада"},
            {key: "gl", value: "Гренландия"},
            {key: "gr", value: "Греция"},
            {key: "ge", value: "Грузия"},
            {key: "gu", value: "Гуам"},
            {key: "dk", value: "Дания"},
            {key: "cd", value: "Демократическая Республика Конго"},
            {key: "je", value: "Джерси"},
            {key: "dj", value: "Джибути"},
            {key: "dm", value: "Доминика"},
            {key: "do", value: "Доминиканская Республика"},
            {key: "eg", value: "Египет"},
            {key: "zm", value: "Замбия"},
            {key: "eh", value: "Западная Сахара"},
            {key: "zw", value: "Зимбабве"},
            {key: "il", value: "Израиль"},
            {key: "in", value: "Индия"},
            {key: "id", value: "Индонезия"},
            {key: "jo", value: "Иордания"},
            {key: "iq", value: "Ирак"},
            {key: "ir", value: "Иран"},
            {key: "ie", value: "Ирландия"},
            {key: "is", value: "Исландия"},
            {key: "es", value: "Испания"},
            {key: "it", value: "Италия"},
            {key: "ye", value: "Йемен"},
            {key: "cv", value: "Кабо-Верде"},
            {key: "kz", value: "Казахстан"},
            {key: "ky", value: "Каймановы о-ва"},
            {key: "kh", value: "Камбоджа"},
            {key: "cm", value: "Камерун"},
            {key: "ca", value: "Канада"},
            {key: "cb", value: "Карибский бассейн (страны и территории)"},
            {key: "qa", value: "Катар"},
            {key: "ke", value: "Кения"},
            {key: "cy", value: "Кипр"},
            {key: "kg", value: "Киргизия"},
            {key: "ki", value: "Кирибати"},
            {key: "cn", value: "Китай"},
            {key: "cc", value: "Кокосовые о-ва (о-ва Килинг)"},
            {key: "co", value: "Колумбия"},
            {key: "km", value: "Коморские о-ва"},
            {key: "cg", value: "Конго"},
            {key: "ko", value: "Косово"},
            {key: "cr", value: "Коста-Рика"},
            {key: "ci", value: "Кот-д'Ивуар"},
            {key: "cu", value: "Куба"},
            {key: "kw", value: "Кувейт"},
            {key: "la", value: "Лаос"},
            {key: "lv", value: "Латвия"},
            {key: "ls", value: "Лесото"},
            {key: "lr", value: "Либерия"},
            {key: "lb", value: "Ливан"},
            {key: "ly", value: "Ливия"},
            {key: "lt", value: "Литва"},
            {key: "li", value: "Лихтенштейн"},
            {key: "lu", value: "Люксембург"},
            {key: "mu", value: "Маврикий"},
            {key: "mr", value: "Мавритания"},
            {key: "mg", value: "Мадагаскар"},
            {key: "yt", value: "Майотта"},
            {key: "mo", value: "Макао"},
            {key: "mk", value: "Македония"},
            {key: "mw", value: "Малави"},
            {key: "my", value: "Малайзия"},
            {key: "ml", value: "Мали"},
            {key: "mv", value: "Мальдивские о-ва"},
            {key: "mt", value: "Мальта"},
            {key: "ma", value: "Марокко"},
            {key: "mq", value: "Мартиника"},
            {key: "mh", value: "Маршалловы о-ва"},
            {key: "mx", value: "Мексика"},
            {key: "mz", value: "Мозамбик"},
            {key: "md", value: "Молдова"},
            {key: "mc", value: "Монако"},
            {key: "mn", value: "Монголия"},
            {key: "ms", value: "Монтсеррат"},
            {key: "mm", value: "Мьянма"},
            {key: "na", value: "Намибия"},
            {key: "nr", value: "Науру"},
            {key: "np", value: "Непал"},
            {key: "ne", value: "Нигер"},
            {key: "ng", value: "Нигерия"},
            {key: "an", value: "Нидерландские Антильские о-ва"},
            {key: "nl", value: "Нидерланды"},
            {key: "ni", value: "Никарагуа"},
            {key: "nu", value: "Ниуэ"},
            {key: "nz", value: "Новая Зеландия"},
            {key: "nc", value: "Новая Каледония"},
            {key: "no", value: "Норвегия"},
            {key: "nf", value: "Норфолк (о-в)"},
            {key: "ae", value: "ОАЭ"},
            {key: "om", value: "Оман"},
            {key: "ck", value: "Острова Кука"},
            {key: "im", value: "Остров Мэн"},
            {key: "cx", value: "Остров Рождества"},
            {key: "pk", value: "Пакистан"},
            {key: "pw", value: "Палау"},
            {key: "ps", value: "Палестинская территория"},
            {key: "pa", value: "Панама"},
            {key: "pg", value: "Папуа-Новая Гвинея"},
            {key: "py", value: "Парагвай"},
            {key: "pe", value: "Перу"},
            {key: "pn", value: "Питкэрн"},
            {key: "pl", value: "Польша"},
            {key: "pt", value: "Португалия"},
            {key: "pr", value: "Пуэрто-Рико"},
            {key: "re", value: "Реюньон"},
            {key: "rw", value: "Руанда"},
            {key: "ro", value: "Румыния"},
            {key: "sv", value: "Сальвадор"},
            {key: "ws", value: "Самоа"},
            {key: "sm", value: "Сан-Марино"},
            {key: "st", value: "Сан-Томе и Принсипи"},
            {key: "sa", value: "Саудовская Аравия"},
            {key: "sz", value: "Свазиленд"},
            {key: "sj", value: "Свальбард и Ян-Майен (о-ва)"},
            {key: "sh", value: "Святая Елена (о-в)"},
            {key: "kp", value: "Северная Корея"},
            {key: "mp", value: "Северные Марианские о-ва"},
            {key: "sc", value: "Сейшельские о-ва"},
            {key: "sn", value: "Сенегал"},
            {key: "pm", value: "Сен-Пьер и Микелон"},
            {key: "vc", value: "Сент-Винсент и Гренадины"},
            {key: "kn", value: "Сент-Китс и Невис"},
            {key: "lc", value: "Сент-Люсия"},
            {key: "rs", value: "Сербия"},
            {key: "sg", value: "Сингапур"},
            {key: "sy", value: "Сирия"},
            {key: "sk", value: "Словацкая Республика"},
            {key: "si", value: "Словения"},
            {key: "sb", value: "Соломоновы о-ва"},
            {key: "so", value: "Сомали"},
            {key: "sd", value: "Судан"},
            {key: "sr", value: "Суринам"},
            {key: "us", value: "США"},
            {key: "sl", value: "Сьерра-Леоне"},
            {key: "tj", value: "Таджикистан"},
            {key: "th", value: "Таиланд"},
            {key: "tw", value: "Тайвань"},
            {key: "tz", value: "Танзания"},
            {key: "tc", value: "Теркс и Кайкос (о-ва)"},
            {key: "tg", value: "Того"},
            {key: "tk", value: "Токелау"},
            {key: "to", value: "Тонга"},
            {key: "tt", value: "Тринидад и Тобаго"},
            {key: "tv", value: "Тувалу"},
            {key: "tn", value: "Тунис"},
            {key: "tm", value: "Туркменистан"},
            {key: "tr", value: "Турция"},
            {key: "ug", value: "Уганда"},
            {key: "uz", value: "Узбекистан"},
            {key: "ua", value: "Украина"},
            {key: "wf", value: "Уоллис и Футуна"},
            {key: "uy", value: "Уругвай"},
            {key: "fo", value: "Фарерские о-ва"},
            {key: "fm", value: "Федеративные Штаты Микронезии"},
            {key: "fj", value: "Фиджи"},
            {key: "ph", value: "Филиппины"},
            {key: "fi", value: "Финляндия"},
            {key: "fk", value: "Фолклендские о-ва (Мальвинские о-ва)"},
            {key: "fr", value: "Франция"},
            {key: "gf", value: "Французская Гвиана"},
            {key: "pf", value: "Французская Полинезия"},
            {key: "tf", value: "Французские Южные Территории"},
            {key: "hr", value: "Хорватия"},
            {key: "cf", value: "Центральноафриканская Республика"},
            {key: "td", value: "Чад"},
            {key: "me", value: "Черногория"},
            {key: "cz", value: "Чешская Республика"},
            {key: "cl", value: "Чили"},
            {key: "ch", value: "Швейцария"},
            {key: "se", value: "Швеция"},
            {key: "lk", value: "Шри-Ланка"},
            {key: "ec", value: "Эквадор"},
            {key: "gq", value: "Экваториальная Гвинея"},
            {key: "er", value: "Эритрея"},
            {key: "ee", value: "Эстония"},
            {key: "et", value: "Эфиопия"},
            {key: "za", value: "ЮАР"},
            {key: "kr", value: "Южная Корея"},
            {key: "ss", value: "Южный Судан"},
            {key: "jm", value: "Ямайка"},
            {key: "jp", value: "Япония"},
            {key: "oo", value: "Другое"},
            {key: "us", value: "United States"},
            {key: "af", value: "Afghanistan"},
            {key: "ax", value: "Aland Islands"},
            {key: "al", value: "Albania"},
            {key: "dz", value: "Algeria"},
            {key: "as", value: "American Samoa"},
            {key: "ad", value: "Andorra"},
            {key: "ao", value: "Angola"},
            {key: "ai", value: "Anguilla"},
            {key: "aq", value: "Antarctica"},
            {key: "ag", value: "Antigua and Barbuda"},
            {key: "ar", value: "Argentina"},
            {key: "am", value: "Armenia"},
            {key: "aw", value: "Aruba"},
            {key: "au", value: "Australia"},
            {key: "at", value: "Austria"},
            {key: "az", value: "Azerbaijan"},
            {key: "bs", value: "Bahamas"},
            {key: "bh", value: "Bahrain"},
            {key: "bd", value: "Bangladesh"},
            {key: "bb", value: "Barbados"},
            {key: "by", value: "Belarus"},
            {key: "be", value: "Belgium"},
            {key: "bz", value: "Belize"},
            {key: "bj", value: "Benin"},
            {key: "bm", value: "Bermuda"},
            {key: "bt", value: "Bhutan"},
            {key: "bo", value: "Bolivia"},
            {key: "ba", value: "Bosnia and Herzegovina"},
            {key: "bw", value: "Botswana"},
            {key: "br", value: "Brazil"},
            {key: "io", value: "British Indian Ocean Territory"},
            {key: "bn", value: "Brunei Darussalam"},
            {key: "bg", value: "Bulgaria"},
            {key: "bf", value: "Burkina Faso"},
            {key: "bi", value: "Burundi"},
            {key: "kh", value: "Cambodia"},
            {key: "cm", value: "Cameroon"},
            {key: "ca", value: "Canada"},
            {key: "cv", value: "Cape Verde"},
            {key: "cb", value: "Caribbean Nations"},
            {key: "ky", value: "Cayman Islands"},
            {key: "cf", value: "Central African Republic"},
            {key: "td", value: "Chad"},
            {key: "cl", value: "Chile"},
            {key: "cn", value: "China"},
            {key: "cx", value: "Christmas Island"},
            {key: "cc", value: "Cocos (Keeling) Islands"},
            {key: "co", value: "Colombia"},
            {key: "km", value: "Comoros"},
            {key: "cg", value: "Congo"},
            {key: "ck", value: "Cook Islands"},
            {key: "cr", value: "Costa Rica"},
            {key: "ci", value: "Cote D\"Ivoire (Ivory Coast)"},
            {key: "hr", value: "Croatia"},
            {key: "cu", value: "Cuba"},
            {key: "cy", value: "Cyprus"},
            {key: "cz", value: "Czech Republic"},
            {key: "cd", value: "Democratic Republic of the Congo"},
            {key: "dk", value: "Denmark"},
            {key: "dj", value: "Djibouti"},
            {key: "dm", value: "Dominica"},
            {key: "do", value: "Dominican Republic"},
            {key: "tp", value: "East Timor"},
            {key: "ec", value: "Ecuador"},
            {key: "eg", value: "Egypt"},
            {key: "sv", value: "El Salvador"},
            {key: "gq", value: "Equatorial Guinea"},
            {key: "er", value: "Eritrea"},
            {key: "ee", value: "Estonia"},
            {key: "et", value: "Ethiopia"},
            {key: "fk", value: "Falkland Islands (Malvinas)"},
            {key: "fo", value: "Faroe Islands"},
            {key: "fm", value: "Federated States of Micronesia"},
            {key: "fj", value: "Fiji"},
            {key: "fi", value: "Finland"},
            {key: "fr", value: "France"},
            {key: "gf", value: "French Guiana"},
            {key: "pf", value: "French Polynesia"},
            {key: "tf", value: "French Southern Territories"},
            {key: "ga", value: "Gabon"},
            {key: "gm", value: "Gambia"},
            {key: "ge", value: "Georgia"},
            {key: "de", value: "Germany"},
            {key: "gh", value: "Ghana"},
            {key: "gi", value: "Gibraltar"},
            {key: "gr", value: "Greece"},
            {key: "gl", value: "Greenland"},
            {key: "gd", value: "Grenada"},
            {key: "gp", value: "Guadeloupe"},
            {key: "gu", value: "Guam"},
            {key: "gt", value: "Guatemala"},
            {key: "gg", value: "Guernsey"},
            {key: "gn", value: "Guinea"},
            {key: "gw", value: "Guinea-Bissau"},
            {key: "gy", value: "Guyana"},
            {key: "ht", value: "Haiti"},
            {key: "hn", value: "Honduras"},
            {key: "hk", value: "Hong Kong"},
            {key: "hu", value: "Hungary"},
            {key: "is", value: "Iceland"},
            {key: "in", value: "India"},
            {key: "id", value: "Indonesia"},
            {key: "ir", value: "Iran"},
            {key: "iq", value: "Iraq"},
            {key: "ie", value: "Ireland"},
            {key: "im", value: "Isle of Man"},
            {key: "il", value: "Israel"},
            {key: "it", value: "Italy"},
            {key: "jm", value: "Jamaica"},
            {key: "jp", value: "Japan"},
            {key: "je", value: "Jersey"},
            {key: "jo", value: "Jordan"},
            {key: "kz", value: "Kazakhstan"},
            {key: "ke", value: "Kenya"},
            {key: "ki", value: "Kiribati"},
            {key: "kr", value: "Korea"},
            {key: "kp", value: "Korea (North)"},
            {key: "ko", value: "Kosovo"},
            {key: "kw", value: "Kuwait"},
            {key: "kg", value: "Kyrgyzstan"},
            {key: "la", value: "Laos"},
            {key: "lv", value: "Latvia"},
            {key: "lb", value: "Lebanon"},
            {key: "ls", value: "Lesotho"},
            {key: "lr", value: "Liberia"},
            {key: "ly", value: "Libya"},
            {key: "li", value: "Liechtenstein"},
            {key: "lt", value: "Lithuania"},
            {key: "lu", value: "Luxembourg"},
            {key: "mo", value: "Macao"},
            {key: "mk", value: "Macedonia"},
            {key: "mg", value: "Madagascar"},
            {key: "mw", value: "Malawi"},
            {key: "my", value: "Malaysia"},
            {key: "mv", value: "Maldives"},
            {key: "ml", value: "Mali"},
            {key: "mt", value: "Malta"},
            {key: "mh", value: "Marshall Islands"},
            {key: "mq", value: "Martinique"},
            {key: "mr", value: "Mauritania"},
            {key: "mu", value: "Mauritius"},
            {key: "yt", value: "Mayotte"},
            {key: "mx", value: "Mexico"},
            {key: "md", value: "Moldova"},
            {key: "mc", value: "Monaco"},
            {key: "mn", value: "Mongolia"},
            {key: "me", value: "Montenegro"},
            {key: "ms", value: "Montserrat"},
            {key: "ma", value: "Morocco"},
            {key: "mz", value: "Mozambique"},
            {key: "mm", value: "Myanmar"},
            {key: "na", value: "Namibia"},
            {key: "nr", value: "Nauru"},
            {key: "np", value: "Nepal"},
            {key: "nl", value: "Netherlands"},
            {key: "an", value: "Netherlands Antilles"},
            {key: "nc", value: "New Caledonia"},
            {key: "nz", value: "New Zealand"},
            {key: "ni", value: "Nicaragua"},
            {key: "ne", value: "Niger"},
            {key: "ng", value: "Nigeria"},
            {key: "nu", value: "Niue"},
            {key: "nf", value: "Norfolk Island"},
            {key: "mp", value: "Northern Mariana Islands"},
            {key: "no", value: "Norway"},
            {key: "pk", value: "Pakistan"},
            {key: "pw", value: "Palau"},
            {key: "ps", value: "Palestinian Territory"},
            {key: "pa", value: "Panama"},
            {key: "pg", value: "Papua New Guinea"},
            {key: "py", value: "Paraguay"},
            {key: "pe", value: "Peru"},
            {key: "ph", value: "Philippines"},
            {key: "pn", value: "Pitcairn"},
            {key: "pl", value: "Poland"},
            {key: "pt", value: "Portugal"},
            {key: "pr", value: "Puerto Rico"},
            {key: "qa", value: "Qatar"},
            {key: "re", value: "Reunion"},
            {key: "ro", value: "Romania"},
            {key: "ru", value: "Russian Federation"},
            {key: "ru", value: "Russia"},
            {key: "rw", value: "Rwanda"},
            {key: "sh", value: "Saint Helena"},
            {key: "kn", value: "Saint Kitts and Nevis"},
            {key: "lc", value: "Saint Lucia"},
            {key: "pm", value: "Saint Pierre and Miquelon"},
            {key: "vc", value: "Saint Vincent and the Grenadines"},
            {key: "ws", value: "Samoa"},
            {key: "sm", value: "San Marino"},
            {key: "st", value: "Sao Tome and Principe"},
            {key: "sa", value: "Saudi Arabia"},
            {key: "sn", value: "Senegal"},
            {key: "rs", value: "Serbia"},
            {key: "sc", value: "Seychelles"},
            {key: "sl", value: "Sierra Leone"},
            {key: "sg", value: "Singapore"},
            {key: "sk", value: "Slovak Republic"},
            {key: "si", value: "Slovenia"},
            {key: "sb", value: "Solomon Islands"},
            {key: "so", value: "Somalia"},
            {key: "za", value: "South Africa"},
            {key: "ss", value: "South Sudan"},
            {key: "es", value: "Spain"},
            {key: "lk", value: "Sri Lanka"},
            {key: "sd", value: "Sudan"},
            {key: "om", value: "Sultanate of Oman"},
            {key: "sr", value: "Suriname"},
            {key: "sj", value: "Svalbard and Jan Mayen"},
            {key: "sz", value: "Swaziland"},
            {key: "se", value: "Sweden"},
            {key: "ch", value: "Switzerland"},
            {key: "sy", value: "Syria"},
            {key: "tw", value: "Taiwan"},
            {key: "tj", value: "Tajikistan"},
            {key: "tz", value: "Tanzania"},
            {key: "th", value: "Thailand"},
            {key: "tl", value: "Timor-Leste"},
            {key: "tg", value: "Togo"},
            {key: "tk", value: "Tokelau"},
            {key: "to", value: "Tonga"},
            {key: "tt", value: "Trinidad and Tobago"},
            {key: "tn", value: "Tunisia"},
            {key: "tr", value: "Turkey"},
            {key: "tm", value: "Turkmenistan"},
            {key: "tc", value: "Turks and Caicos Islands"},
            {key: "tv", value: "Tuvalu"},
            {key: "ug", value: "Uganda"},
            {key: "ua", value: "Ukraine"},
            {key: "ae", value: "United Arab Emirates"},
            {key: "gb", value: "United Kingdom"},
            {key: "uy", value: "Uruguay"},
            {key: "uz", value: "Uzbekistan"},
            {key: "vu", value: "Vanuatu"},
            {key: "va", value: "Vatican City State (Holy See)"},
            {key: "ve", value: "Venezuela"},
            {key: "vn", value: "Vietnam"},
            {key: "vg", value: "Virgin Islands (British)"},
            {key: "vi", value: "Virgin Islands (U.S.)"},
            {key: "wf", value: "Wallis and Futuna"},
            {key: "eh", value: "Western Sahara"},
            {key: "ye", value: "Yemen"},
            {key: "zm", value: "Zambia"},
            {key: "zw", value: "Zimbabwe"},
            {key: "oo", value: "Other"}
        ];
    };

    service.getAllCounties = function(lang) {
        const countries =  {
            en : {"AF":"Afghanistan","AX":"\u00c5land Islands","AL":"Albania","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua & Barbuda","AR":"Argentina","AM":"Armenia","AW":"Aruba","AC":"Ascension Island","AU":"Australia","AT":"Austria","AZ":"Azerbaijan","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Belarus","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BA":"Bosnia & Herzegovina","BW":"Botswana","BR":"Brazil","IO":"British Indian Ocean Territory","VG":"British Virgin Islands","BN":"Brunei","BG":"Bulgaria","BF":"Burkina Faso","BI":"Burundi","KH":"Cambodia","CM":"Cameroon","CA":"Canada","IC":"Canary Islands","CV":"Cape Verde","BQ":"Caribbean Netherlands","KY":"Cayman Islands","CF":"Central African Republic","EA":"Ceuta & Melilla","TD":"Chad","CL":"Chile","CN":"China","CX":"Christmas Island","CC":"Cocos (Keeling) Islands","CO":"Colombia","KM":"Comoros","CG":"Congo - Brazzaville","CD":"Congo - Kinshasa","CK":"Cook Islands","CR":"Costa Rica","CI":"C\u00f4te d\u2019Ivoire","HR":"Croatia","CU":"Cuba","CW":"Cura\u00e7ao","CY":"Cyprus","CZ":"Czechia","DK":"Denmark","DG":"Diego Garcia","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","ET":"Ethiopia","FK":"Falkland Islands","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","TF":"French Southern Territories","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HN":"Honduras","HK":"Hong Kong SAR China","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":"Iran","IQ":"Iraq","IE":"Ireland","IM":"Isle of Man","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JE":"Jersey","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","XK":"Kosovo","KW":"Kuwait","KG":"Kyrgyzstan","LA":"Laos","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macau SAR China","MK":"Macedonia","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Micronesia","MD":"Moldova","MC":"Monaco","MN":"Mongolia","ME":"Montenegro","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar (Burma)","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk Island","KP":"North Korea","MP":"Northern Mariana Islands","NO":"Norway","OM":"Oman","PK":"Pakistan","PW":"Palau","PS":"Palestinian Territories","PA":"Panama","PG":"Papua New Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PN":"Pitcairn Islands","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RE":"R\u00e9union","RO":"Romania","RU":"Russia","RW":"Rwanda","WS":"Samoa","SM":"San Marino","ST":"S\u00e3o Tom\u00e9 & Pr\u00edncipe","SA":"Saudi Arabia","SN":"Senegal","RS":"Serbia","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SX":"Sint Maarten","SK":"Slovakia","SI":"Slovenia","SB":"Solomon Islands","SO":"Somalia","ZA":"South Africa","GS":"South Georgia & South Sandwich Islands","KR":"South Korea","SS":"South Sudan","ES":"Spain","LK":"Sri Lanka","BL":"St. Barth\u00e9lemy","SH":"St. Helena","KN":"St. Kitts & Nevis","LC":"St. Lucia","MF":"St. Martin","PM":"St. Pierre & Miquelon","VC":"St. Vincent & Grenadines","SD":"Sudan","SR":"Suriname","SJ":"Svalbard & Jan Mayen","SZ":"Swaziland","SE":"Sweden","CH":"Switzerland","SY":"Syria","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad & Tobago","TA":"Tristan da Cunha","TN":"Tunisia","TR":"Turkey","TM":"Turkmenistan","TC":"Turks & Caicos Islands","TV":"Tuvalu","UM":"U.S. Outlying Islands","VI":"U.S. Virgin Islands","UG":"Uganda","UA":"Ukraine","AE":"United Arab Emirates","GB":"United Kingdom","US":"United States","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VA":"Vatican City","VE":"Venezuela","VN":"Vietnam","WF":"Wallis & Futuna","EH":"Western Sahara","YE":"Yemen","ZM":"Zambia","ZW":"Zimbabwe"},
            ru : {"AU":"\u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u044f","AT":"\u0410\u0432\u0441\u0442\u0440\u0438\u044f","AZ":"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d","AX":"\u0410\u043b\u0430\u043d\u0434\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","AL":"\u0410\u043b\u0431\u0430\u043d\u0438\u044f","DZ":"\u0410\u043b\u0436\u0438\u0440","AS":"\u0410\u043c\u0435\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u043e\u0435 \u0421\u0430\u043c\u043e\u0430","AI":"\u0410\u043d\u0433\u0438\u043b\u044c\u044f","AO":"\u0410\u043d\u0433\u043e\u043b\u0430","AD":"\u0410\u043d\u0434\u043e\u0440\u0440\u0430","AQ":"\u0410\u043d\u0442\u0430\u0440\u043a\u0442\u0438\u0434\u0430","AG":"\u0410\u043d\u0442\u0438\u0433\u0443\u0430 \u0438 \u0411\u0430\u0440\u0431\u0443\u0434\u0430","AR":"\u0410\u0440\u0433\u0435\u043d\u0442\u0438\u043d\u0430","AM":"\u0410\u0440\u043c\u0435\u043d\u0438\u044f","AW":"\u0410\u0440\u0443\u0431\u0430","AF":"\u0410\u0444\u0433\u0430\u043d\u0438\u0441\u0442\u0430\u043d","BS":"\u0411\u0430\u0433\u0430\u043c\u044b","BD":"\u0411\u0430\u043d\u0433\u043b\u0430\u0434\u0435\u0448","BB":"\u0411\u0430\u0440\u0431\u0430\u0434\u043e\u0441","BH":"\u0411\u0430\u0445\u0440\u0435\u0439\u043d","BY":"\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u044c","BZ":"\u0411\u0435\u043b\u0438\u0437","BE":"\u0411\u0435\u043b\u044c\u0433\u0438\u044f","BJ":"\u0411\u0435\u043d\u0438\u043d","BM":"\u0411\u0435\u0440\u043c\u0443\u0434\u044b","BG":"\u0411\u043e\u043b\u0433\u0430\u0440\u0438\u044f","BO":"\u0411\u043e\u043b\u0438\u0432\u0438\u044f","BQ":"\u0411\u043e\u043d\u044d\u0439\u0440, \u0421\u0438\u043d\u0442-\u042d\u0441\u0442\u0430\u0442\u0438\u0443\u0441 \u0438 \u0421\u0430\u0431\u0430","BA":"\u0411\u043e\u0441\u043d\u0438\u044f \u0438 \u0413\u0435\u0440\u0446\u0435\u0433\u043e\u0432\u0438\u043d\u0430","BW":"\u0411\u043e\u0442\u0441\u0432\u0430\u043d\u0430","BR":"\u0411\u0440\u0430\u0437\u0438\u043b\u0438\u044f","IO":"\u0411\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u044f \u0432 \u0418\u043d\u0434\u0438\u0439\u0441\u043a\u043e\u043c \u043e\u043a\u0435\u0430\u043d\u0435","BN":"\u0411\u0440\u0443\u043d\u0435\u0439-\u0414\u0430\u0440\u0443\u0441\u0441\u0430\u043b\u0430\u043c","BF":"\u0411\u0443\u0440\u043a\u0438\u043d\u0430-\u0424\u0430\u0441\u043e","BI":"\u0411\u0443\u0440\u0443\u043d\u0434\u0438","BT":"\u0411\u0443\u0442\u0430\u043d","VU":"\u0412\u0430\u043d\u0443\u0430\u0442\u0443","VA":"\u0412\u0430\u0442\u0438\u043a\u0430\u043d","GB":"\u0412\u0435\u043b\u0438\u043a\u043e\u0431\u0440\u0438\u0442\u0430\u043d\u0438\u044f","HU":"\u0412\u0435\u043d\u0433\u0440\u0438\u044f","VE":"\u0412\u0435\u043d\u0435\u0441\u0443\u044d\u043b\u0430","VG":"\u0412\u0438\u0440\u0433\u0438\u043d\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430 (\u0411\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0438\u0435)","VI":"\u0412\u0438\u0440\u0433\u0438\u043d\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430 (\u0421\u0428\u0410)","UM":"\u0412\u043d\u0435\u0448\u043d\u0438\u0435 \u043c\u0430\u043b\u044b\u0435 \u043e-\u0432\u0430 (\u0421\u0428\u0410)","TL":"\u0412\u043e\u0441\u0442\u043e\u0447\u043d\u044b\u0439 \u0422\u0438\u043c\u043e\u0440","VN":"\u0412\u044c\u0435\u0442\u043d\u0430\u043c","GA":"\u0413\u0430\u0431\u043e\u043d","HT":"\u0413\u0430\u0438\u0442\u0438","GY":"\u0413\u0430\u0439\u0430\u043d\u0430","GM":"\u0413\u0430\u043c\u0431\u0438\u044f","GH":"\u0413\u0430\u043d\u0430","GP":"\u0413\u0432\u0430\u0434\u0435\u043b\u0443\u043f\u0430","GT":"\u0413\u0432\u0430\u0442\u0435\u043c\u0430\u043b\u0430","GN":"\u0413\u0432\u0438\u043d\u0435\u044f","GW":"\u0413\u0432\u0438\u043d\u0435\u044f-\u0411\u0438\u0441\u0430\u0443","DE":"\u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f","GG":"\u0413\u0435\u0440\u043d\u0441\u0438","GI":"\u0413\u0438\u0431\u0440\u0430\u043b\u0442\u0430\u0440","HN":"\u0413\u043e\u043d\u0434\u0443\u0440\u0430\u0441","HK":"\u0413\u043e\u043d\u043a\u043e\u043d\u0433 (\u0441\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0439 \u0440\u0430\u0439\u043e\u043d)","GD":"\u0413\u0440\u0435\u043d\u0430\u0434\u0430","GL":"\u0413\u0440\u0435\u043d\u043b\u0430\u043d\u0434\u0438\u044f","GR":"\u0413\u0440\u0435\u0446\u0438\u044f","GE":"\u0413\u0440\u0443\u0437\u0438\u044f","GU":"\u0413\u0443\u0430\u043c","DK":"\u0414\u0430\u043d\u0438\u044f","JE":"\u0414\u0436\u0435\u0440\u0441\u0438","DJ":"\u0414\u0436\u0438\u0431\u0443\u0442\u0438","DG":"\u0414\u0438\u0435\u0433\u043e-\u0413\u0430\u0440\u0441\u0438\u044f","DM":"\u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430","DO":"\u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","EG":"\u0415\u0433\u0438\u043f\u0435\u0442","ZM":"\u0417\u0430\u043c\u0431\u0438\u044f","EH":"\u0417\u0430\u043f\u0430\u0434\u043d\u0430\u044f \u0421\u0430\u0445\u0430\u0440\u0430","ZW":"\u0417\u0438\u043c\u0431\u0430\u0431\u0432\u0435","IL":"\u0418\u0437\u0440\u0430\u0438\u043b\u044c","IN":"\u0418\u043d\u0434\u0438\u044f","ID":"\u0418\u043d\u0434\u043e\u043d\u0435\u0437\u0438\u044f","JO":"\u0418\u043e\u0440\u0434\u0430\u043d\u0438\u044f","IQ":"\u0418\u0440\u0430\u043a","IR":"\u0418\u0440\u0430\u043d","IE":"\u0418\u0440\u043b\u0430\u043d\u0434\u0438\u044f","IS":"\u0418\u0441\u043b\u0430\u043d\u0434\u0438\u044f","ES":"\u0418\u0441\u043f\u0430\u043d\u0438\u044f","IT":"\u0418\u0442\u0430\u043b\u0438\u044f","YE":"\u0419\u0435\u043c\u0435\u043d","CV":"\u041a\u0430\u0431\u043e-\u0412\u0435\u0440\u0434\u0435","KZ":"\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d","KY":"\u041a\u0430\u0439\u043c\u0430\u043d\u043e\u0432\u044b \u043e-\u0432\u0430","KH":"\u041a\u0430\u043c\u0431\u043e\u0434\u0436\u0430","CM":"\u041a\u0430\u043c\u0435\u0440\u0443\u043d","CA":"\u041a\u0430\u043d\u0430\u0434\u0430","IC":"\u041a\u0430\u043d\u0430\u0440\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","QA":"\u041a\u0430\u0442\u0430\u0440","KE":"\u041a\u0435\u043d\u0438\u044f","CY":"\u041a\u0438\u043f\u0440","KG":"\u041a\u0438\u0440\u0433\u0438\u0437\u0438\u044f","KI":"\u041a\u0438\u0440\u0438\u0431\u0430\u0442\u0438","CN":"\u041a\u0438\u0442\u0430\u0439","KP":"\u041a\u041d\u0414\u0420","CC":"\u041a\u043e\u043a\u043e\u0441\u043e\u0432\u044b\u0435 \u043e-\u0432\u0430","CO":"\u041a\u043e\u043b\u0443\u043c\u0431\u0438\u044f","KM":"\u041a\u043e\u043c\u043e\u0440\u044b","CG":"\u041a\u043e\u043d\u0433\u043e - \u0411\u0440\u0430\u0437\u0437\u0430\u0432\u0438\u043b\u044c","CD":"\u041a\u043e\u043d\u0433\u043e - \u041a\u0438\u043d\u0448\u0430\u0441\u0430","XK":"\u041a\u043e\u0441\u043e\u0432\u043e","CR":"\u041a\u043e\u0441\u0442\u0430-\u0420\u0438\u043a\u0430","CI":"\u041a\u043e\u0442-\u0434\u2019\u0418\u0432\u0443\u0430\u0440","CU":"\u041a\u0443\u0431\u0430","KW":"\u041a\u0443\u0432\u0435\u0439\u0442","CW":"\u041a\u044e\u0440\u0430\u0441\u0430\u043e","LA":"\u041b\u0430\u043e\u0441","LV":"\u041b\u0430\u0442\u0432\u0438\u044f","LS":"\u041b\u0435\u0441\u043e\u0442\u043e","LR":"\u041b\u0438\u0431\u0435\u0440\u0438\u044f","LB":"\u041b\u0438\u0432\u0430\u043d","LY":"\u041b\u0438\u0432\u0438\u044f","LT":"\u041b\u0438\u0442\u0432\u0430","LI":"\u041b\u0438\u0445\u0442\u0435\u043d\u0448\u0442\u0435\u0439\u043d","LU":"\u041b\u044e\u043a\u0441\u0435\u043c\u0431\u0443\u0440\u0433","MU":"\u041c\u0430\u0432\u0440\u0438\u043a\u0438\u0439","MR":"\u041c\u0430\u0432\u0440\u0438\u0442\u0430\u043d\u0438\u044f","MG":"\u041c\u0430\u0434\u0430\u0433\u0430\u0441\u043a\u0430\u0440","YT":"\u041c\u0430\u0439\u043e\u0442\u0442\u0430","MO":"\u041c\u0430\u043a\u0430\u043e (\u0441\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0439 \u0440\u0430\u0439\u043e\u043d)","MK":"\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0438\u044f","MW":"\u041c\u0430\u043b\u0430\u0432\u0438","MY":"\u041c\u0430\u043b\u0430\u0439\u0437\u0438\u044f","ML":"\u041c\u0430\u043b\u0438","MV":"\u041c\u0430\u043b\u044c\u0434\u0438\u0432\u044b","MT":"\u041c\u0430\u043b\u044c\u0442\u0430","MA":"\u041c\u0430\u0440\u043e\u043a\u043a\u043e","MQ":"\u041c\u0430\u0440\u0442\u0438\u043d\u0438\u043a\u0430","MH":"\u041c\u0430\u0440\u0448\u0430\u043b\u043b\u043e\u0432\u044b \u041e\u0441\u0442\u0440\u043e\u0432\u0430","MX":"\u041c\u0435\u043a\u0441\u0438\u043a\u0430","MZ":"\u041c\u043e\u0437\u0430\u043c\u0431\u0438\u043a","MD":"\u041c\u043e\u043b\u0434\u043e\u0432\u0430","MC":"\u041c\u043e\u043d\u0430\u043a\u043e","MN":"\u041c\u043e\u043d\u0433\u043e\u043b\u0438\u044f","MS":"\u041c\u043e\u043d\u0442\u0441\u0435\u0440\u0440\u0430\u0442","MM":"\u041c\u044c\u044f\u043d\u043c\u0430 (\u0411\u0438\u0440\u043c\u0430)","NA":"\u041d\u0430\u043c\u0438\u0431\u0438\u044f","NR":"\u041d\u0430\u0443\u0440\u0443","NP":"\u041d\u0435\u043f\u0430\u043b","NE":"\u041d\u0438\u0433\u0435\u0440","NG":"\u041d\u0438\u0433\u0435\u0440\u0438\u044f","NL":"\u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u044b","NI":"\u041d\u0438\u043a\u0430\u0440\u0430\u0433\u0443\u0430","NU":"\u041d\u0438\u0443\u044d","NZ":"\u041d\u043e\u0432\u0430\u044f \u0417\u0435\u043b\u0430\u043d\u0434\u0438\u044f","NC":"\u041d\u043e\u0432\u0430\u044f \u041a\u0430\u043b\u0435\u0434\u043e\u043d\u0438\u044f","NO":"\u041d\u043e\u0440\u0432\u0435\u0433\u0438\u044f","AC":"\u043e-\u0432 \u0412\u043e\u0437\u043d\u0435\u0441\u0435\u043d\u0438\u044f","IM":"\u043e-\u0432 \u041c\u044d\u043d","NF":"\u043e-\u0432 \u041d\u043e\u0440\u0444\u043e\u043b\u043a","CX":"\u043e-\u0432 \u0420\u043e\u0436\u0434\u0435\u0441\u0442\u0432\u0430","SH":"\u043e-\u0432 \u0421\u0432. \u0415\u043b\u0435\u043d\u044b","TC":"\u043e-\u0432\u0430 \u0422\u0451\u0440\u043a\u0441 \u0438 \u041a\u0430\u0439\u043a\u043e\u0441","AE":"\u041e\u0410\u042d","OM":"\u041e\u043c\u0430\u043d","CK":"\u041e\u0441\u0442\u0440\u043e\u0432\u0430 \u041a\u0443\u043a\u0430","PN":"\u043e\u0441\u0442\u0440\u043e\u0432\u0430 \u041f\u0438\u0442\u043a\u044d\u0440\u043d","PK":"\u041f\u0430\u043a\u0438\u0441\u0442\u0430\u043d","PW":"\u041f\u0430\u043b\u0430\u0443","PS":"\u041f\u0430\u043b\u0435\u0441\u0442\u0438\u043d\u0441\u043a\u0438\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u0438","PA":"\u041f\u0430\u043d\u0430\u043c\u0430","PG":"\u041f\u0430\u043f\u0443\u0430 \u2013 \u041d\u043e\u0432\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f","PY":"\u041f\u0430\u0440\u0430\u0433\u0432\u0430\u0439","PE":"\u041f\u0435\u0440\u0443","PL":"\u041f\u043e\u043b\u044c\u0448\u0430","PT":"\u041f\u043e\u0440\u0442\u0443\u0433\u0430\u043b\u0438\u044f","PR":"\u041f\u0443\u044d\u0440\u0442\u043e-\u0420\u0438\u043a\u043e","KR":"\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041a\u043e\u0440\u0435\u044f","RE":"\u0420\u0435\u044e\u043d\u044c\u043e\u043d","RU":"\u0420\u043e\u0441\u0441\u0438\u044f","RW":"\u0420\u0443\u0430\u043d\u0434\u0430","RO":"\u0420\u0443\u043c\u044b\u043d\u0438\u044f","SV":"\u0421\u0430\u043b\u044c\u0432\u0430\u0434\u043e\u0440","WS":"\u0421\u0430\u043c\u043e\u0430","SM":"\u0421\u0430\u043d-\u041c\u0430\u0440\u0438\u043d\u043e","ST":"\u0421\u0430\u043d-\u0422\u043e\u043c\u0435 \u0438 \u041f\u0440\u0438\u043d\u0441\u0438\u043f\u0438","SA":"\u0421\u0430\u0443\u0434\u043e\u0432\u0441\u043a\u0430\u044f \u0410\u0440\u0430\u0432\u0438\u044f","SZ":"\u0421\u0432\u0430\u0437\u0438\u043b\u0435\u043d\u0434","MP":"\u0421\u0435\u0432\u0435\u0440\u043d\u044b\u0435 \u041c\u0430\u0440\u0438\u0430\u043d\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","SC":"\u0421\u0435\u0439\u0448\u0435\u043b\u044c\u0441\u043a\u0438\u0435 \u041e\u0441\u0442\u0440\u043e\u0432\u0430","BL":"\u0421\u0435\u043d-\u0411\u0430\u0440\u0442\u0435\u043b\u0435\u043c\u0438","MF":"\u0421\u0435\u043d-\u041c\u0430\u0440\u0442\u0435\u043d","PM":"\u0421\u0435\u043d-\u041f\u044c\u0435\u0440 \u0438 \u041c\u0438\u043a\u0435\u043b\u043e\u043d","SN":"\u0421\u0435\u043d\u0435\u0433\u0430\u043b","VC":"\u0421\u0435\u043d\u0442-\u0412\u0438\u043d\u0441\u0435\u043d\u0442 \u0438 \u0413\u0440\u0435\u043d\u0430\u0434\u0438\u043d\u044b","KN":"\u0421\u0435\u043d\u0442-\u041a\u0438\u0442\u0441 \u0438 \u041d\u0435\u0432\u0438\u0441","LC":"\u0421\u0435\u043d\u0442-\u041b\u044e\u0441\u0438\u044f","RS":"\u0421\u0435\u0440\u0431\u0438\u044f","EA":"\u0421\u0435\u0443\u0442\u0430 \u0438 \u041c\u0435\u043b\u0438\u043b\u044c\u044f","SG":"\u0421\u0438\u043d\u0433\u0430\u043f\u0443\u0440","SX":"\u0421\u0438\u043d\u0442-\u041c\u0430\u0440\u0442\u0435\u043d","SY":"\u0421\u0438\u0440\u0438\u044f","SK":"\u0421\u043b\u043e\u0432\u0430\u043a\u0438\u044f","SI":"\u0421\u043b\u043e\u0432\u0435\u043d\u0438\u044f","US":"\u0421\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u043d\u044b\u0435 \u0428\u0442\u0430\u0442\u044b","SB":"\u0421\u043e\u043b\u043e\u043c\u043e\u043d\u043e\u0432\u044b \u041e\u0441\u0442\u0440\u043e\u0432\u0430","SO":"\u0421\u043e\u043c\u0430\u043b\u0438","SD":"\u0421\u0443\u0434\u0430\u043d","SR":"\u0421\u0443\u0440\u0438\u043d\u0430\u043c","SL":"\u0421\u044c\u0435\u0440\u0440\u0430-\u041b\u0435\u043e\u043d\u0435","TJ":"\u0422\u0430\u0434\u0436\u0438\u043a\u0438\u0441\u0442\u0430\u043d","TH":"\u0422\u0430\u0438\u043b\u0430\u043d\u0434","TW":"\u0422\u0430\u0439\u0432\u0430\u043d\u044c","TZ":"\u0422\u0430\u043d\u0437\u0430\u043d\u0438\u044f","TG":"\u0422\u043e\u0433\u043e","TK":"\u0422\u043e\u043a\u0435\u043b\u0430\u0443","TO":"\u0422\u043e\u043d\u0433\u0430","TT":"\u0422\u0440\u0438\u043d\u0438\u0434\u0430\u0434 \u0438 \u0422\u043e\u0431\u0430\u0433\u043e","TA":"\u0422\u0440\u0438\u0441\u0442\u0430\u043d-\u0434\u0430-\u041a\u0443\u043d\u044c\u044f","TV":"\u0422\u0443\u0432\u0430\u043b\u0443","TN":"\u0422\u0443\u043d\u0438\u0441","TM":"\u0422\u0443\u0440\u043a\u043c\u0435\u043d\u0438\u0441\u0442\u0430\u043d","TR":"\u0422\u0443\u0440\u0446\u0438\u044f","UG":"\u0423\u0433\u0430\u043d\u0434\u0430","UZ":"\u0423\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u0430\u043d","UA":"\u0423\u043a\u0440\u0430\u0438\u043d\u0430","WF":"\u0423\u043e\u043b\u043b\u0438\u0441 \u0438 \u0424\u0443\u0442\u0443\u043d\u0430","UY":"\u0423\u0440\u0443\u0433\u0432\u0430\u0439","FO":"\u0424\u0430\u0440\u0435\u0440\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","FM":"\u0424\u0435\u0434\u0435\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0435 \u0428\u0442\u0430\u0442\u044b \u041c\u0438\u043a\u0440\u043e\u043d\u0435\u0437\u0438\u0438","FJ":"\u0424\u0438\u0434\u0436\u0438","PH":"\u0424\u0438\u043b\u0438\u043f\u043f\u0438\u043d\u044b","FI":"\u0424\u0438\u043d\u043b\u044f\u043d\u0434\u0438\u044f","FK":"\u0424\u043e\u043b\u043a\u043b\u0435\u043d\u0434\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","FR":"\u0424\u0440\u0430\u043d\u0446\u0438\u044f","GF":"\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0430\u044f \u0413\u0432\u0438\u0430\u043d\u0430","PF":"\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0430\u044f \u041f\u043e\u043b\u0438\u043d\u0435\u0437\u0438\u044f","TF":"\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0438\u0435 \u042e\u0436\u043d\u044b\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u0438","HR":"\u0425\u043e\u0440\u0432\u0430\u0442\u0438\u044f","CF":"\u0426\u0410\u0420","TD":"\u0427\u0430\u0434","ME":"\u0427\u0435\u0440\u043d\u043e\u0433\u043e\u0440\u0438\u044f","CZ":"\u0427\u0435\u0445\u0438\u044f","CL":"\u0427\u0438\u043b\u0438","CH":"\u0428\u0432\u0435\u0439\u0446\u0430\u0440\u0438\u044f","SE":"\u0428\u0432\u0435\u0446\u0438\u044f","SJ":"\u0428\u043f\u0438\u0446\u0431\u0435\u0440\u0433\u0435\u043d \u0438 \u042f\u043d-\u041c\u0430\u0439\u0435\u043d","LK":"\u0428\u0440\u0438-\u041b\u0430\u043d\u043a\u0430","EC":"\u042d\u043a\u0432\u0430\u0434\u043e\u0440","GQ":"\u042d\u043a\u0432\u0430\u0442\u043e\u0440\u0438\u0430\u043b\u044c\u043d\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f","ER":"\u042d\u0440\u0438\u0442\u0440\u0435\u044f","EE":"\u042d\u0441\u0442\u043e\u043d\u0438\u044f","ET":"\u042d\u0444\u0438\u043e\u043f\u0438\u044f","ZA":"\u042e\u0410\u0420","GS":"\u042e\u0436\u043d\u0430\u044f \u0413\u0435\u043e\u0440\u0433\u0438\u044f \u0438 \u042e\u0436\u043d\u044b\u0435 \u0421\u0430\u043d\u0434\u0432\u0438\u0447\u0435\u0432\u044b \u043e-\u0432\u0430","SS":"\u042e\u0436\u043d\u044b\u0439 \u0421\u0443\u0434\u0430\u043d","JM":"\u042f\u043c\u0430\u0439\u043a\u0430","JP":"\u042f\u043f\u043e\u043d\u0438\u044f"}
        };

        return countries[lang];
    };

    service.dynamicTableLoading = function (total, page, count, getDataFunction) {
        let rocketElement = document.getElementById('scrollup');
        let pagesPerOneLoad = count,
            currentPage = page,
            pagesCount = Math.ceil(total/pagesPerOneLoad);
                if(currentPage < pagesCount - 1) {
                    $rootScope.loading = true;
                    currentPage++;
                    updateData(currentPage);
                }

        function updateData(pageNext) {
            if(getDataFunction) {
                if(rocketElement) {
                    moveUpFunc();
                }
                getDataFunction(pageNext, pagesPerOneLoad);
            }
        }
        function moveUpFunc(){
            let scrollUp = rocketElement; // найти элемент
            scrollUp.style.display = 'block';
            scrollUp.style.position = 'fixed';
            scrollUp.style.bottom = '20px';
            scrollUp.style.left = '0px';
            scrollUp.onmouseover = function() { // добавить прозрачность
                scrollUp.style.opacity=0.3;
                scrollUp.style.filter  = 'alpha(opacity=30)';
            };

            scrollUp.onmouseout = function() { //убрать прозрачность
                scrollUp.style.opacity = 0.5;
                scrollUp.style.filter  = 'alpha(opacity=50)';
            };

            scrollUp.onclick = function() { //обработка клика
                window.scrollTo(0,0);
            };
        }
    };

    service.cookiesConsent = function() {
        var bodyElement = $("body");
        var translatedText = setTranslates();

        if(getCookie("consentCookies") !== "yes") {
            appendCockiesBlock();
        }


        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }


        function appendCockiesBlock() {
            var cookieElementText = "<div class='cookie-wrapper' id='cookie-block'>" +
                "<span class='inner-text'>" +
                "<span class='first-sentence'>" +
                "<span>" + translatedText.bestExp +  "</span>" +
                "</span>" +
                "<span class='second-sentence'>" +
                "<span>" + translatedText.findMore +  "</span>" +
                "<a href='https://cleverstaff.net/privacy.html' target='_blank'>" + translatedText.findMoreLink +  "</a>" +
                "</span>" +
                "</span>" +
                "</div>";
            var closeIconElement = $("<i class='close-icon'>" +
                "<svg aria-hidden=\"true\" data-prefix=\"far\" data-icon=\"times\" role=\"img\" width=\"12px\" height=\"12px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 384 512\" class=\"svg-inline--fa fa-times fa-w-12 fa-2x\"><path fill=\"currentColor\" d=\"M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z\" class=\"\"></path></svg>" +
                "</i>");
            closeIconElement.on("click", function() {
                console.log("click close");
                cookieElement.remove();
            });
            var cookieElement = $(cookieElementText);
            var agreeButtonElement = $("<button>" + translatedText.iAgree + "</button>");
            agreeButtonElement.on("click", function () {
                setCookies("consentCookies", "yes");
                cookieElement.remove();
            });
            cookieElement.append(closeIconElement);
            cookieElement.find(".first-sentence").append(agreeButtonElement);
            bodyElement.append(cookieElement);
        }


        function setTranslates() {
            var textsEn = {
                iAgree: "I agree",
                bestExp: "To give you the best possible experience, this site uses cookies. If you agree with cookie usage, press ",
                findMore: "Should you want to find out more about our cookie policy - press ",
                findMoreLink: "read more"
            };
            var textsRu = {
                iAgree: "Согласен",
                bestExp: "Чтобы предоставить вам наилучший опыт, на этом сайте используются cookie. Если вы согласны с использованием cookie, нажмите кнопку ",
                findMore: "Если вы хотите ознакомиться с  нашей политикой cookie, нажмите ",
                findMoreLink: "узнать больше"
            };
            if($rootScope.currentLang == 'ru'){
                return textsRu;
            } else {
                return textsEn;
            }
        }

        function setCookies(key, value) {
            document.cookie = key + "=" + value + "; expires=Thu, 18 Dec 2033 12:00:00 UTC; path=/";
        }
    };

    return service;
}]);

angular.module('services.localStorage', []
).factory('$localStorage', ['$window', function($window) {
    return (function() {
        return {
            isExist: function(name) {
                return $window.localStorage.getItem(name) != undefined;
            },
            get: function(name) {
                if (name == undefined || name == null)
                    return null;
                return $window.localStorage.getItem(name);
            },
            set: function(name, value) {
                if (angular.isObject(value)) {
                    value = JSON.stringify(value);
                }
                $window.localStorage.setItem(name, value);
            },
            remove: function(name) {
                $window.localStorage.removeItem(name);
            }
        };
    }());
}]);

angular.module('services.notice', [
        'ngResource'
    ]
).factory('Notice', ['$resource', 'serverAddress', function($resource, serverAddress) {
    var service = $resource(serverAddress + '/notice/:param', {param: "@param"},
        {
            all: {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "get"
                }
            },
            notice: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    service: "notice",
                    action: "get"
                }
            },
            readNotice: {
                method: "POST",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    service: "notice",
                    action: "read"
                }
            },
            readAll: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                   param: "readAll"
                }
            },
            getMy: {
                method: "GET",
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                params: {
                    param: "getMy"
                }
            }
        });
    var forUpdateNoticesView = [];

    service.registerNoticeView = function(val, name) {
        forUpdateNoticesView.push({name: name, funct: val});
    };
    service.updateNoticesView = function(noticeId, nameNoticeView) {
        angular.forEach(forUpdateNoticesView, function(val) {
            if (val.name != nameNoticeView) {
                val.funct(noticeId);
            }
        })
    };
    return service;
}]);
 angular.module('services.person', [
    'ngResource'
 ]).factory('Person', ['$resource', 'serverAddress','$rootScope', function($resource, serverAddress, $rootScope) {
     var person = $resource(serverAddress + '/person/:param', {param: "@param"},
            {
                authorization: {
                    method: 'POST',
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    params: {
                        param: "auth"
                    }
                },
                in: {
                    method: "GET",
                    params: {
                        param: "in"
                    }
                },
                changeUserParam:{
                  method:"GET",
                    params:{
                        param:"changeUserParam"
                    }
                },
                registration: {
                    method: "POST",
                    params: {
                        param: "registration"
                    }
                },
                joinInvited: {
                    method: "POST",
                    params: {
                        param: "joinInvited"
                    }
                },
                inviteUser: {
                    method: "GET",
                    params: {
                        param: "inviteUser"
                    }
                },
                finishReg: {
                    method: "GET",
                    params: {
                        param: "finishReg"
                    }
                },
                logout: {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                    params: {
                        param: "logout"
                    }
                },
                getMe: {
                    withCredentials: true,
                    method: 'GET',
                    params: {
                        param: "getMe"
                    }
                },
                changeOrg: {
                    method: "GET",
                    params: {
                        param: "changeOrg"
                    }
                },
                getAllPersons: {
                    method: "GET",
                    params: {
                        param: "getAllPersons"
                    }
                },
                getAllPersonsWithDetails: {
                    method: "GET",
                    params: {
                        param: "getAllPersonsWithDetails"
                    }
                },
                getPerson: {
                    method: "GET",
                    params: {
                        param: "getPerson"
                    }
                },
                getInvited: {
                    method: "GET",
                    params: {
                        param: "getInvited"
                    },
                    isArray: true
                },
                inviteInfo: {
                    method: "GET",
                    params: {
                        param: "inviteInfo"
                    }
                },
                changeUserRole: {
                    method: "GET",
                    params: {
                        param: "changeUserRole"
                    }

                },
                changeUserRegion: {
                    method: "GET",
                    params: {
                        param: "changeUserRegion"
                    }
                },
                setSocial: {
                    method: "GET",
                    params: {
                        param: "setSocial"
                    }
                },
                personEmails:{
                    method:"GET",
                    params:{
                        param:"personEmails"
                    }
                },

                addEmail:{
                    method:"POST",
                    params:{
                        param:"addEmail"
                    }
                },

                deleteEmail:{
                    method:"GET",
                    params:{
                        param:"deleteEmail"
                    }
                },




                resetSocial: {
                    method: "GET",
                    params: {
                        param: "resetSocial"
                    }
                },
                setLang: {
                    method: "GET",
                    params: {
                        param: "setLang"
                    }
                },
                changePassword: {
                    method: "POST",
                    params: {
                        param: "changePassword"
                    }
                },
                changePasswordByKey: {
                    method: "POST",
                    params: {
                        param: "changePasswordByKey"
                    }
                },
                updateContacts: {
                    method: "POST",
                    params: {
                        param: "updateContacts"
                    }
                },
                changeOrgName: {
                    method: "POST",
                    params: {
                        param: "changeOrgName"
                    }
                },
                createPaymentUsage: {
                    method: "GET",
                    params: {
                        param: "createPaymentUsage"
                    }
                },
                getPayments: {
                    method: "GET",
                    params: {
                        param: "getPayments"
                    },
                    isArray: true
                },
                deletePayment: {
                    method: "GET",
                    params: {
                        param: "deletePayment"
                    }
                },
                changeRegion: {
                    method: "POST",
                    params: {
                        param: "changeRegion"
                    }
                },
                disableUser: {
                    method: "GET",
                    params: {
                        param: "disableUser"
                    }
                },
                enableUser: {
                    method: "GET",
                    params: {
                        param: "enableUser"
                    }
                },
                getActivePersonCount: {
                    method: "GET",
                    params: {
                        param: "getActivePersonCount"
                    }
                },
                checkKey: {
                    method: "GET",
                    params: {
                        param: "checkKey"
                    }
                },
                getAchieves:{
                    method:"POST",
                    params:{
                        param:"getAchieves"
                    }
                },
                authPing:{
                    method:"GET",
                    params:{
                        param:"authping"
                    }
                },
                getUserParam: {
                    method: "GET",
                    params: {
                        param: "getUserParam"
                    }
                },
                editEmail:{
                    method:"POST",
                    params:{
                        param:"editEmail"
                    }
                },
                removePersonEmail:{
                    method:"GET",
                    params:{
                        param:"removePersonEmail"
                    }
                },
                changeFirstName:{
                    method:"POST",
                    params:{
                        param:"changeFirstName"
                    }
                },
                addGoogleCalendar:{
                    method:"POST",
                    params:{
                        param:"addGoogleCalendar"
                    }
                },
                getGoogleCalendar:{
                    method:"GET",
                    params:{
                        param:"getGoogleCalendar"
                    }
                },
                deleteGoogleCalendar:{
                    method:"DELETE",
                    params:{
                        param:"deleteGoogleCalendar"
                    }
                },
                unInviteUser:{
                    method:"GET",
                    params:{
                        param:"unInviteUser"
                    }
                },
                getUserPopup: {
                    method: "GET",
                    params: {
                        param: "getUserPopup"
                    }
                },
                addOutlookCalendar:{
                    method:"POST",
                    params:{
                        param:"addOutlookCalendar"
                    }
                },
                getOutlookCalendar: {
                    method: "GET",
                    params: {
                        param: "getOutlookCalendar"
                    }
                },
                deleteOutlookCalendar: {
                    method: "DELETE",
                    params: {
                        param: "deleteOutlookCalendar"
                    }
                }

            });
     person.requestGetAllPersons = function () {
         return new Promise((resolve, reject) => {
             person.getAllPersons(resp => resolve(resp, resp['request'] = 'AllPersons'),error => reject(error));
         });
     };

     person.getPersonEmails = function(params) {
        return new Promise((resolve, reject) => {
            person.personEmails(params, resp => {
                if(resp.status === 'ok') {
                    resolve(resp);
                } else {
                    reject(resp);
                }
            }, error => reject(error));
        })
     };

     return person;
 }]);
 angular.module('services.transliteration', []).factory('transliteration', function() {
    var transl = [];
    transl['А'] = 'A';
    transl['а'] = 'a';
    transl['Б'] = 'B';
    transl['б'] = 'b';
    transl['В'] = 'V';
    transl['в'] = 'v';
    transl['Г'] = 'G';
    transl['г'] = 'g';
    transl['Д'] = 'D';
    transl['д'] = 'd';
    transl['Е'] = 'E';
    transl['е'] = 'e';
    transl['Ё'] = 'Yo';
    transl['ё'] = 'yo';
    transl['Ж'] = 'Zh';
    transl['ж'] = 'zh';
    transl['З'] = 'Z';
    transl['з'] = 'z';
    transl['И'] = 'I';
    transl['и'] = 'i';
    transl['Й'] = 'J';
    transl['й'] = 'j';
    transl['К'] = 'K';
    transl['к'] = 'k';
    transl['Л'] = 'L';
    transl['л'] = 'l';
    transl['М'] = 'M';
    transl['м'] = 'm';
    transl['Н'] = 'N';
    transl['н'] = 'n';
    transl['О'] = 'O';
    transl['о'] = 'o';
    transl['П'] = 'P';
    transl['п'] = 'p';
    transl['Р'] = 'R';
    transl['р'] = 'r';
    transl['С'] = 'S';
    transl['с'] = 's';
    transl['Т'] = 'T';
    transl['т'] = 't';
    transl['У'] = 'U';
    transl['у'] = 'u';
    transl['Ф'] = 'F';
    transl['ф'] = 'f';
    transl['Х'] = 'X';
    transl['х'] = 'x';
    transl['Ц'] = 'C';
    transl['ц'] = 'c';
    transl['Ч'] = 'Ch';
    transl['ч'] = 'ch';
    transl['Ш'] = 'Sh';
    transl['ш'] = 'sh';
    transl['Щ'] = 'Shh';
    transl['щ'] = 'shh';
    transl['Ъ'] = '"';
    transl['ъ'] = '"';
    transl['Ы'] = 'Y\'';
    transl['ы'] = 'y\'';
    transl['Ь'] = '\'';
    transl['ь'] = '\'';
    transl['Э'] = 'E\'';
    transl['э'] = 'e\'';
    transl['Ю'] = 'Yu';
    transl['ю'] = 'yu';
    transl['Я'] = 'Ya';
    transl['я'] = 'ya';
    transl['І'] = 'I';
    transl['і'] = 'i';
    transl['Ї'] = 'I';
    transl['ї'] = 'I';
    transl['\\'] = '_';
    transl['/'] = '_';
    return {
        getArray: function() {
            return transl;
        }
    };
});
angular.module('services', [
        'services.candidate',
        'services.file',
        'services.globalService',
        'services.localStorage',
        'services.notice',
        'services.person',
        'services.transliteration'
    ]
);

function parseLinkedInInformationForRecall(me, $scope) {
        var user = {
                education: me.values[0].educations,
                firstName: me.values[0].firstName,
                lastName: me.values[0].lastName,
                headline: me.values[0].headline,
                positions: me.values[0].positions,
                email: me.values[0].emailAddress

        };
        if (me.values[0].siteStandardProfileRequest && me.values[0].siteStandardProfileRequest.url) {
                user.link = me.values[0].siteStandardProfileRequest.url.split("&authType=")[0];
                var split = me.values[0].siteStandardProfileRequest.url.split("id=");
                if (split.length == 2) {
                        var splitChildOne = split[1];
                        if (splitChildOne.length > 1) {
                                var splitChildTwo = splitChildOne.split("&");
                                if (splitChildTwo.length > 0) {
                                        user.id = splitChildTwo[0];

                                }
                        }
                }
        }
        var phone = null;
        if (me.values[0].phoneNumbers != undefined) {
                angular.forEach(me.values[0].phoneNumbers.values, function(val) {
                        if (val.phoneType == 'mobile') {
                                user.phone = val.phoneNumber.replace(/[`~!@#$%^&*()\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s+/g, "");
                        }
                })
        }
        var info;
        if (user.firstName) {
                info = user.firstName + " "
        }
        if (user.lastName) {
                info = user.lastName + '\n';
        }
        if (user.headline) {
                info = info + user.headline + '\n';
        }
        if (user.email) {
                info = info + user.email + '\n';
        }
        if (user.positions) {
                info = info + '------------------- \n';
                info = info + 'Experience \n';
                info = info + '------------------- \n';
                angular.forEach(user.positions.values, function(pos, iter) {
                        var j = iter > 0 ? "--------- \n" : "";
                        info = info + j;
                        var posI = "";
                        if (pos.title) {
                                posI = posI + pos.title;
                        }
                        if (pos.company.name) {
                                posI = posI + " at " + pos.company.name + '\n';
                        }
                        if (pos.startDate) {
                                posI = posI + pos.startDate.month + '/' + pos.startDate.year;
                        }
                        if (pos.endDate) {
                                posI = posI + " to " + pos.endDate.month + '/' + pos.endDate.year;
                        } else {
                                posI = posI + " to Present";
                        }
                        info = info + posI + "\n";
                })

        }
        if (user.education) {
                info = info + '------------------- \n';
                info = info + 'Education \n';
                info = info + '------------------- \n';
                angular.forEach(user.education.values, function(ed, iter) {
                        var j = iter > 0 ? "--------- \n" : "";
                        info = info + j;
                        var edI = "";
                        if (ed.schoolName) {
                                edI = edI + ed.schoolName + "\n";
                        }
                        if (ed.startDate) {
                                edI = edI + ed.startDate.year;
                        }
                        if (ed.endDate) {
                                edI = edI + " to " + ed.endDate.year;
                        }
                        info = info + edI + "\n";
                        info = info + "\n";
                });
        }
        $scope.request.name = user.firstName;
        $scope.request.phone = user.phone;
        $scope.request.lastName = user.lastName;
        $scope.request.linkedinId = user.id;
        $scope.request.linkedinLink = user.link;
        console.log($scope.request);
        $('#email2').val(user.email);
        $scope.request.email = user.email;
        $scope.request.message = info;
        if (!$scope.$$phase) {
                $scope.$apply();
        }
}