# BBjRouter Plugin

<p>
  <a href="http://www.basis.cloud/downloads">
    <img src="https://img.shields.io/badge/BBj-v21.14-blue" alt="BBj v21.14" />
  </a>
  <a href="http://www.basis.cloud/downloads">
    <img src="https://img.shields.io/badge/Client-DWC-blue" alt="Client DWC" />
  </a>  
  <a href="https://github.com/BBj-Plugins/BBjRouter/blob/master/README.md">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="BBjRouter is released under the MIT license." />
  </a>
  <a href="https://github.com/necolas/issue-guidelines/blob/master/CONTRIBUTING.md#pull-requests">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>  
</p>

A simple yet powerfully BBj Router for your DWC application.

?> **Note:** A DWC application can have one and only one BBjRouter instance. Having multi router instances is not supported and it does not have a valid use case.


## Installation

* Clone the [project](https://github.com/BBj-Plugins/BBjRouter) locally , then add BBjRouter to your BBj paths
* Or [Use the plugins manager](https://www.bbj-plugins.com/en/get-started)

## Features

- Based on History API so it does update the URL of the page
- Supports hash based routing too
- Simple mapping of route to a callback
- Parameterized routes
- Navigating between routes
- Easy integration

And much more !

## The gist

```BBj
use ::BBjRouter/BBjRouter.bbj::BBjRouter
use ::BBjRouter/BBjRouter.bbj::BBjRouterEvent

wnd! = BBjAPI().openSysGui("X0").addWindow(10, 10, 200, 200, "BBjRouter",$$)
wnd!.setCallback(BBjAPI.ON_CLOSE, "eoj")

router! = new BBjRouter(wnd!)
router!.register("/dashboard", "onMatch")
router!.resolve()
router!.navigate("/dashboard")

process_events

onMatch:
  declare auto BBjRouterEvent payload!

  ev! = BBjAPI().getLastEvent()
  payload! = ev!.getObject()

  let x= msgbox(payload!.getPath(), 0, "Matched Route")
return

eoj:
release
```

## Routes

### Register Routes

Routes can be registered using the `BBjRouter.register` method. The method accepts as parameters the route's pattern 
and the route's callback:

Signatures : 

- `BBjRouter register(BBjString path!, BBjString callback!)`
- `BBjRouter register(BBjString path!, CustomObject obj!, BBjString method!)`

### Unregister Routes

To unregister the route , you can use the `BBjRouter.unregister` method. The method accepts only one parameter which is the route's pattern you want to unregister

### Patterns

BBjRouter relies on regular expressions to match strings against location paths. This logic is abstracted. Here are couple of examples:


```BBj
rem matches specifically "/dashboard"
router!.register("/dashboard", "onMatch")

rem matches "/dashboard/any-page"
router!.register("/dashboard/:page", "onMatch")

rem matches "/any-page"
router!.register(":page", "onMatch")

rem matches "/dashboard/a/b/c"
router!.register("dashboard/*", "onMatch")

rem matches "anything"
router!.register("*", "onMatch")

rem matches "/dashboard/product/20/save" and also "/dashboard/product/20"
router!.register("/dashboard/product/:id/?", "onMatch")
```

### Parameterized routes

The parameterized routes have paths that contain dynamic parts. For example:

```BBj
router!.register("/user/:id/:action", "onMatch")
```

`"/user/2f79ddd0-a911-11ec/save"` matches the defined route. `"2f79ddd0-a911-11ec"` maps to id and `"save"` to action. You can access the matched parts from the the matched event's payload.

```BBj
use ::BBjRouter/BBjRouter.bbj::BBjRouter
use ::BBjRouter/BBjRouter.bbj::BBjRouterEvent

wnd! = BBjAPI().openSysGui("X0").addWindow(10, 10, 200, 200, "BBjRouter",$$)
wnd!.setCallback(BBjAPI.ON_CLOSE, "eoj")

router! = new BBjRouter(wnd!)
router!.register("/user/:id/:action", "onMatch")
router!.resolve()
router!.navigate("/user/2f79ddd0-a911-11ec/save")

process_events

onMatch:
  declare auto BBjRouterEvent payload!

  ev! = BBjAPI().getLastEvent()
  payload! = ev!.getObject()

  message! = "<b>Route</b>: " + payload!.getPath() + "<br>"
  message! =  message! + "<b>Action</b>: " + payload!.getData().get("action") + "<br>"
  message! =  message! + "<b>User ID</b>: " + payload!.getData().get("id") + "<br>"

  let x= msgbox(message!, 0, "Matched Route")
return

eoj:
release
```

### Query Parameters

Beside dynamic parts, BBjRouter provides also access to the query parameters in the URL. You can access the query parameters from the the matched event's payload.


```BBj
use ::BBjRouter/BBjRouter.bbj::BBjRouter
use ::BBjRouter/BBjRouter.bbj::BBjRouterEvent

wnd! = BBjAPI().openSysGui("X0").addWindow(10, 10, 200, 200, "BBjRouter",$$)
wnd!.setCallback(BBjAPI.ON_CLOSE, "eoj")

router! = new BBjRouter(wnd!)
router!.register("/user/:id", "onMatch")
router!.resolve()
router!.navigate("/user/2f79ddd0-a911-11ec?action=save")

process_events

onMatch:
  declare auto BBjRouterEvent payload!
  ev! = BBjAPI().getLastEvent()
  payload! = ev!.getObject()

  message! = "<b>Route</b>: " + payload!.getPath() + "<br>"
  message! =  message! + "<b>Action</b>: " + payload!.getParams().get("action") + "<br>"
  message! =  message! + "<b>User ID</b>: " + payload!.getData().get("id") + "<br>"

  let x= msgbox(message!, 0, "Matched Route")
return

eoj:
release
```

### Resolving routes

By default, BBjRouter will not resolve your registered routes. You must at least once call `BBjRouter.resolve` method to start the process

### Navigating between routes

To navigate to a specific route. You have to call the `BBjRouter.navigate` method. The method accepts the route's pattern you want to navigate to.

The navigate method by default:

- Checks if there is a match. And if the answer is "yes" then ...
- Updates the internal state of the router.
- Updates the browser URL.

## Hash based routing

BBjRouter supports hash based routing. Which means that it uses the hash string as path for routing. For example `/webapp/my-app/#/about/team` is treated as `/about/team`. To enable this mode you have to pass `hash: true` when creating the router.

```BBj
router! = new BBjRouter(wnd!, BBjAPI.TRUE)
```

## Handling a not-found page

BBjRouter offers a special handler for the cases where a no route match is found.

```BBj
use ::BBjRouter/BBjRouter.bbj::BBjRouter
use ::BBjRouter/BBjRouter.bbj::BBjRouterEvent

wnd! = BBjAPI().openSysGui("X0").addWindow(10, 10, 200, 200, "BBjRouter",$$)
wnd!.setCallback(BBjAPI.ON_CLOSE, "eoj")

router! = new BBjRouter(wnd!)
router!.register("/", "onMatch")
router!.setCallback(BBjRouter.ON_NOT_FOUND, "onNotFound")
router!.resolve()
router!.navigate("/this-route-does-not-exist")

process_events

onMatch:
  let x= msgbox("Welcome Home", 0, "Matched Route")
return

onNotFound:
  declare auto BBjRouterEvent payload!

  ev! = BBjAPI().getLastEvent()
  payload! = ev!.getObject()

  let x= msgbox("The URL """ + str(payload!.getPath()) + """ your requested does not exist. You will redirected to the home page", 0, "Not Found")
  payload!.getControl().navigate("/")
return

eoj:
release
```