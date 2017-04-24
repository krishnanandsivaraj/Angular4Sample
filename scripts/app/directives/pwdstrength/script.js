app.directive('checkStrength', function () {
    return {
        replace: false,
        restrict: 'EACM',
        link: function (scope, iElement, iAttrs) {
            var strength = {
                colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
                mesureStrength: function (p) {
                    var _force = 0;                                                         
                    var _lowerLetters = /[a-z]+/.test(p);                    
                    var _upperLetters = /[A-Z]+/.test(p);
                    var _numbers = /[0-9]+/.test(p);
                    var _flags = [_lowerLetters, _upperLetters, _numbers];                    
                    var _passedMatches = $.grep(_flags, function (el) { return el === true; }).length;                                          
                    
                    _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
                    _force += _passedMatches * 10;
                        
                    // penality (short password)
                    _force = (p.length <= 6) ? Math.min(_force, 10) : _force;                                      
                    
                    // penality (poor variety of characters)
                    _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
                    _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
                    _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;
                    
                    return _force;

                },
                getColor: function (s) {
                    var idx = 0;
                    if (s <= 10) { idx = 0; }
                    else if (s <= 20) { idx = 1; }
                    else if (s <= 30) { idx = 2; }
                    else if (s <= 40) { idx = 3; }
                    else { idx = 4; }
                    return { idx: idx + 1, col: this.colors[idx] };
                }
            };

            scope.$watch(iAttrs.checkStrength, function () {
                if (scope.users.password === '') {
                    scope.strength = "";
                } else {
                    var c = strength.getColor(strength.mesureStrength(scope.users.password));
                    if (c.idx == 4) {
                        scope.strength = "<span class='strong'>Strong</span>";
                    } else if (c.idx == 2) {
                        scope.strength = "<span class='good'>Good</span>";
                    } else if (c.idx == 1) {
                        scope.strength = "<span class='weak'>Weak</span>";
                    } 
                }
            });
        },
    };

});