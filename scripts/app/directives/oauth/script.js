//facebook
app.directive('fbButton', ['utilityService',  function (utilityService) {
    return {
        restrict: 'E',
        transclude: true,
        template: '<input type="image" data-ng-click="fblogin()" src="../../../../img/admin-widget/fb-button.png"class="add-account-form-input" data-ng-required="connector.name==\'facebook\' && account.connectionType == \'api\'"  data-ng-model="account.accessToken"  name="accessToken"/>',
        controller: function ($scope, $element) {
            (function (d, s, id) {
                if (d.getElementById(id)) d.getElementById(id).remove();
                var js, fjs = d.getElementsByTagName(s)[0];
                js = d.createElement(s); js.id = id; js.async = true;
                js.src = "./scripts/lib/facebook.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
            $scope.fblogin = function () {
                FB.init({
                    appId: $scope.account.appId,
                    cookie: false,  // enable cookies to allow the server to access
                    status: false,
                    xfbml: false,  // parse social plugins on this page
                    version: 'v2.5' // use graph api version 2.5
                });
                FB.login(function (response) {
                    if (response && response.authResponse)
                    {
                        $scope.account.accessToken = response.authResponse.accessToken;
                        utilityService.statusMessage('success', 'Facebook verification succeed');
                        FB.logout();
                    } else
                    {
                        utilityService.statusMessage('error', 'Connection verification failed');
                    }
                }, { scope: $scope.connector.credential.scope, auth_type: 'reauthenticate' });
            }
        }
    };
}]);