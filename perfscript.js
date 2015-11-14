// Just select all, and paste into a buffer
// no promises that this will work in every
// browser or situation, but give it a shot...
(function(window, console, angular) {
    'use strict';

    // this function came from https://gist.github.com/weikinhuang/6b7f11b59d4a08e35f83#file-gistfile1-js
    angular.element(document).ready(function() {
        var slice = [].slice;
        window.ngWatchCount = function(base) {
            var elems;
            if (base && typeof base !== 'string') {
                elems = slice.call(base.querySelectorAll('*'));
                elems.unshift(base);
            } else if (typeof base === 'string') {
                elems = slice.call(document.querySelectorAll(base + ', ' + base + ' *'));
            } else {
                elems = slice.call(document.querySelectorAll('*'));
            }
            return elems.map(function(elem) {
                var data = angular.element(elem).data();
                //if (data.$scope && data.$scope.$$watchers && data.$scope.$$watchers.length) {
                //  elem.setAttribute('angular-watch-count', data.$scope.$$watchers.length);
                //}
                return data.$scope || null;
            }).filter(function(scope) {
                return scope && scope.$$watchers;
            }).reduce(function(tmp, scope) {
                if (tmp.cache[scope.$id]) {
                    return tmp;
                }
                tmp.cache[scope.$id] = true;
                tmp.count += scope.$$watchers.length;
                return tmp;
            }, {
                count: 0,
                cache: {}
            }).count;
        };
    });
})(window, window.console, window.angular);

// riff on function above - using it to count scopes
(function(window, console, angular) {
    'use strict';
    window.ngScopeCount = function() {
        var elems = Array.prototype.slice.call(document.querySelectorAll('*'));
        return elems.reduce(function(prev, current) {
            var data = angular.element(current).data();
            if (data.$scope && data.hasOwnProperty('$scope')) {
                prev.push({
                    id: data.$scope.$id,
                    scope: data.$scope
                });
            }
            return prev;
        }, []).length;
    };

})(window, window.console, window.angular);

// stats function wired to $rootScope
(function(angular, document, console) {
    'use strict';
    angular.element('document').ready(function() {
        var $body = angular.element('body'); // 1
        var rootScope = $body.injector().get('$rootScope');
        // move reference to digest over to new function
        rootScope.$digest2 = rootScope.$digest;
        var timings = window.timings = {
            longestDigest: 0,
            longestDigestTime: '',
            largestScopeCount: 0,
            largestScopeCountTime: '',
            largestWatchCount: 0,
            largestWatchCountTime: '',
            log: [],
            enableLog: false,
            clear: function() {
                this.longestDigest = 0;
                this.longestDigestTime = '';
                this.largestScopeCount = 0;
                this.largestScopeCountTime = '';
                this.largestWatchCount = 0;
                this.largestWatchCountTime = '';
            },
            record: function(duration, startTime, endTime, scopeCount, watchCount) {
                if (this.enableLog) {
                    this.log.push({ duration: duration, 
                                    startTime: startTime, 
                                    endTime: endTime,
                                    scopeCount: scopeCount,
                                    watchCount: watchCount});
                }
                if (duration > timings.longestDigest) {
                    this.longestDigest = duration;
                    this.longestDigestTime = startTime;
                }
                if (scopeCount > timings.largestScopeCount) {
                    this.largestScopeCount = scopeCount;
                    this.largestScopeCountTime = startTime;
                }
                if (watchCount > timings.largestWatchCount) {
                    this.largestWatchCount = watchCount;
                    this.largestWatchCountTime = startTime;
                }
            },
            getLogData: function() {
                return this.log;
            },
            clearLog: function() {
                this.log.length = 0;
            }
        };

        rootScope.$digest = function() {
            // wrap digest with timings

            // get counts before digesting
            var scopeCount = window.ngScopeCount();
            var watchCount = window.ngWatchCount();            
            var startTime = new Date().toLocaleString();
            var now = Date.now();

            // do digest
            var result = rootScope.$digest2();

            // capture end times
            var duration = Date.now() - now;
            var endTime = new Date().toLocaleString();
            
            timings.record(duration, startTime, endTime, scopeCount, watchCount);
            console.log('------------ DIGEST ------------');
            console.log('-   started at: ', startTime);
            console.log('-   completed at: ', endTime);
            console.log('-   duration: ', duration, ' ms');
            console.log('-   # scopes: ', scopeCount);
            console.log('-   # watches: ', watchCount);
            console.log('-   largest # scopes', timings.largestScopeCount, 'at', timings.largestScopeCountTime);
            console.log('-   largest # watches', timings.largestWatchCount, 'at', timings.largestWatchCountTime);
            console.log('-   longest digest time: ', timings.longestDigest, 'at', timings.longestDigestTime);
            console.log('--------- DIGEST END -----------');

            if (result) {
                return result;
            }
        };
    });
})(window.angular, window.document, window.console);
