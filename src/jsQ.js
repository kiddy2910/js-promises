"use strict";

(function (w) {
    var JsQ = function () {
    };

    var Defer = function () {
        this.promise = new Promise();
    };

    var Promise = function () {
        this.__thenList = [];
        this.__finallyCallback = null;
    };

    w['jsQ'] = w['hQ'] = new JsQ();

    /**
     * Create a defer to get promise.
     * If <a href="https://docs.angularjs.org/api/ng/service/$q"><code>$q</code></a> is available, it's an alias for <code>$q.defer()</code>.
     * If <a href="http://documentup.com/kriskowal/q/"><code>Q<code></a> is available, it's an alias for <code>Q.defer()</code>.
     * Otherwise, it's a built-in <code>q</code>.
     *
     * @returns {Defer}
     */
    JsQ.prototype.defer = function () {
        if (w['angular'] != null) {
            var q = __get$q();
            if (q != null) {
                return q.defer();
            }
        }

        if (w['Q'] != null) {
            return w['Q'].defer();
        }

        return new Defer();
    };

    /**
     * Resolve a promise with a specific data.
     *
     * @param data
     */
    Defer.prototype.resolve = function (data) {
        var self = this;
        var promise = self.promise;
        resolve(promise, data);
    };

    /**
     * Reject a promise with a reason.
     *
     * @param reason
     */
    Defer.prototype.reject = function (reason) {
        var self = this;
        var promise = self.promise;
        reject(promise, reason);
    };

    /**
     * Provide callbacks are invoked if promise is fulfilled or rejected.
     *
     * @param successCallback Fn has an argument is data is resolved
     * @param errorCallback Fn has an argument is reason why to reject
     * @returns {Promise}
     */
    Promise.prototype.then = function (successCallback, errorCallback) {
        var self = this;
        self.__thenList.push({
            resolvedCallback: successCallback,
            rejectedCallback: errorCallback
        });
        return self;
    };

    /**
     * Shorthand for promise.then(null, errorCallback).
     * It is used for ES5 browsers or later.
     *
     * @param errorCallback Fn has an argument is reason why to reject
     * @returns {Promise}
     */
    Promise.prototype.catch = function (errorCallback) {
        return this.fail(errorCallback);
    };

    /**
     * Alias for promise.catch(errorCallback).
     * It is used for non-ES5 browsers like IE8, Safari 5, Android 2.2, or PhantomJS 1.8.
     *
     * @param errorCallback Fn has an argument is reason why to reject
     * @returns {Promise}
     */
    Promise.prototype.fail = function (errorCallback) {
        var self = this;
        self.__thenList.push({
            resolvedCallback: null,
            rejectedCallback: errorCallback
        });
        return self;
    };

    /**
     * Allows you to observe either the fulfillment or rejection of a promise.
     * Finally clause should be last clause in chaining promises.
     * Currently, not support to return a promise like $q of AngularJS.
     *
     * It is used for ES5 browsers or later.
     *
     * @param callback Fn has no argument
     */
    Promise.prototype.finally = function (callback) {
        this.fin(callback);
    };

    /**
     * Alias for promise.finally(callback).
     * It is used for non-ES5 browsers like IE8, Safari 5, Android 2.2, or PhantomJS 1.8.
     *
     * @param callback Fn has no argument
     */
    Promise.prototype.fin = function (callback) {
        this.__finallyCallback = callback;
    };

    function resolve(promise, data) {
        __resolveOrReject(promise, data, true);
    }

    function reject(promise, reason) {
        __resolveOrReject(promise, reason, false);
    }

    function __resolveOrReject(promise, dataOrReason, resolved) {
        // get the first then clause
        var thenArray = promise.__thenList.splice(0, 1);
        if (thenArray == null || thenArray.length === 0) {
            // invoke finally clause if then clause is no longer
            if (promise.__finallyCallback != null) {
                promise.__finallyCallback();
            }
            return;
        }

        var then = thenArray[0];
        if (dataOrReason instanceof Promise) {
            // if the previous result is a promise, register to listener it.
            dataOrReason.then(
                function (subData) {
                    __resolveSafely(promise, then, subData);
                },
                function (subReason) {
                    __rejectSafely(promise, then, subReason);
                }
            );

        } else {
            // propagate to the next resolve or rejection
            if (resolved) {
                __resolveSafely(promise, then, dataOrReason);
            } else {
                __rejectSafely(promise, then, dataOrReason);
            }
        }
    }

    function __resolveSafely(promise, then, data) {
        if (then.resolvedCallback != null) {
            try {
                // invoke resolvedCallback to get new modified data
                // to propagate to the next resolve
                resolve(promise, then.resolvedCallback(data));
            } catch (err) {
                // propagate error to the next rejection
                // if resolvedCallback cause an exception
                reject(promise, err);
            }
        } else {
            // propagate the current data to the next resolve
            resolve(promise, data);
        }
    }

    function __rejectSafely(promise, then, reason) {
        if (then.rejectedCallback != null) {
            try {
                // invoke rejectedCallback to get new modified reason
                // to propagate to the next rejection
                reject(promise, then.rejectedCallback(reason));
            } catch (err) {
                // propagate error to the next rejection instead of current reason
                // if rejectedCallback cause an exception
                reject(promise, err);
            }
        } else {
            // propagate the current reason to the next rejection
            reject(promise, reason);
        }
    }

    function __get$q() {
        if (w['angular'] == null) return null;
        var injector = w['angular']['injector'](['ng']);
        return injector != null ? injector['get']('$q') : null;
    }
})(window);