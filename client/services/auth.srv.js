angular.module('myApp').factory('AuthService', ['$q', '$timeout', '$http',
    function ($q, $timeout, $http) {

        // create user variable
        var user = null;

        // return available functions for use in the controllers
        return ({
            isLoggedIn: isLoggedIn,
            getUserStatus: getUserStatus,
            login: login,
            logout: logout,
            register: register,
            getUser: getUser
        });

        function isLoggedIn() {
            if (user.status) {
                return true;
            } else {
                return false;
            }
        }

        function getUserStatus() {
            return $http.get('/status')
            // handle success
                .success(function (data) {
                    if (data.status) {
                        user = {status: true, user: data.user};
                    } else {
                        user = {status: false};
                    }
                })
                // handle error
                .error(function (data) {
                    user = {status: false};
                });
        }

        function getUser() {
            return user.user;
        }

        function login(username, password) {

            // create a new instance of deferred
            var deferred = $q.defer();

            // send a post request to the server
            $http.post('/login',
                {username: username, password: password})
            // handle success
                .success(function (data, status) {
                    if (status === 200 && data.status) {
                        getUserStatus();
                        deferred.resolve();
                    } else {
                        etUserStatus();
                        deferred.reject();
                    }
                })
                // handle error
                .error(function (data) {
                    user = {status: false};
                    deferred.reject();
                });

            // return promise object
            return deferred.promise;

        }

        function logout() {

            // create a new instance of deferred
            var deferred = $q.defer();

            // send a get request to the server
            $http.get('/logout')
            // handle success
                .success(function (data) {
                    user = {status: false};
                    deferred.resolve();
                })
                // handle error
                .error(function (data) {
                    user = {status: false};
                    deferred.reject();
                });

            // return promise object
            return deferred.promise;

        }

        function register(username, password, confirm_pass) {

            // create a new instance of deferred
            var deferred = $q.defer();

            if (password === confirm_pass) {

                $http.post('/register',
                    {username: username, password: password})
                    .success(function (data, status) {
                        if (status === 200 && data.status) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    })
                    .error(function (data) {
                        deferred.reject();
                    });
            } else {
                deferred.reject();
            }      
            
            return deferred.promise;
        }

    }]);