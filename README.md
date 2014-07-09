fbsearch
========

A simple web app to search the facebook pages. It also provides the ability to favorite a particular search result page.
It uses the Facebook graph search api.

### Architecture
The fbsearch app is written in vanilla JavaScript without using any external libraries. It is designed and coded in the MVC methodology with the following key aspects
* Namespaced under a single global object thereby minimizing the global footprint
* Modularized libraries with public apis
* Provision to refresh the Facebook access tokens
* No server side code

### Catch
* Since the latest version of the Facebook graph api does not support anonymous access, access tokens are passed in the service calls. The user access tokens generated have a short validity of 2 hours. Thus it needs to be refreshed frequently. However a kind of 'admin' page is provided which can be accessed when the token has expired. The token can be refreshed from this admin page by using your Facebook account.
* Since there is no server side code, I have completely resorted to client-side storage to save the Favorites. Hence these values would get cleared when the browser storage is cleared.

### Demo
Check http://darshan-raj.github.io/fbsearch for a live demo
