# winappdriver-controller
Starts and stops WinAppDriver in the background programmatically.

## Usage
### From Node/JS

```
  let wadController = require('winappdriver-controller')

  //start WinAppDriver with options
  wadController.startWinAppDriver({
    port:'4724'
  });

  //or with default host:127.0.0.1, port:4723
  wadController.startWinAppDriver();

  //shutdown with options
  wadController.stopWinAppDriver({
    port:'4724'
  });

  //or with default port:4723
  wadController.stopWinAppDriver();

```

### From CLI
```
  winappdriver-controller --start
  winappdriver-controller --start -p 4724
  winappdriver-controller --stop
  winappdriver-controller --stop -p 4724

```


Run 'winappdriver-controller --help' for full list of options.
