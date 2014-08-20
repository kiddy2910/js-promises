(function() {
    makeRequest()
        .then(function (d) {
            d = '1.Start [' + d + ']';
            console.log(d);
            return 'return from 1';
        })

        .then(function (d) {
            d = '2.[' + d + ']';
            console.log(d);
            var defer = hQ.defer();
            setTimeout(function () {
                defer.resolve('resolve from 2');
            }, 1000);
            return defer.promise;
        })

        .then(function (d) {
            d = '3.[' + d + ']';
            console.log(d);
            var defer = hQ.defer();
            setTimeout(function () {
                defer.reject('reject from 3');
            }, 1000);
            return defer.promise;
        })

        .catch(function(r) {
            r = '4.[' + r + ']';
            console.log(r);
            return 'return from 4';
        })

        .finally(function(){
            console.log('5.End');
        });
})();