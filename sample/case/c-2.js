(function() {
    makeRequest()
        .then(function(d) {
            var defer = HQ.defer();
            setTimeout(function() {
                defer.reject(d + ' - reject');
            }, 1000);
            return defer.promise;
        })
        .then(function(d) {
            // Ignore
        })
        .catch(function(r) {
            console.log(r);
        })
})();