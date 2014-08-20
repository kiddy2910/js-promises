jsQ
===========

Simulate an utility like [$q](https://docs.angularjs.org/api/ng/service/$q) or [Q](http://documentup.com/kriskowal/q/).
It will be an alias for them if they're available.
Prior to [$q](https://docs.angularjs.org/api/ng/service/$q) > [Q](http://documentup.com/kriskowal/q/) > jsQ.

---
Global namespace: **jsQ** or **hQ**

Features:
- Reuse [$q](https://docs.angularjs.org/api/ng/service/$q) or [Q](http://documentup.com/kriskowal/q/) if they're available
- jsQ defer with 2 methods: resolve, reject
- jsQ promise: then, catch (fail), finally (fin)
- jsQ finally clause doesn't return a promise like $q or Q. It should be last clause in chaining promises