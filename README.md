Inspired by
(https://gist.github.com/weikinhuang/6b7f11b59d4a08e35f83#file-gistfile1-js)[This
GIST].

This script is meant to be pasted into a browser console window to
gather performance metrics on a running application.

It is not perfect, and I may be missing some use cases, but it should
help you trace the complexity of your application when you can't get the
Angular Batarang installed.

When installed, I monkeypatch $rootScope.$digest, wrapping it with
timing and statistics gathering processes. The console then begins to
recieve output every time a digest is incurred.

I have bigger plans for this script in the future and additional commits
will enhance the system. For now, you can use:

- `ngScopeCount()` - returns the # of scopes counted downward from the
  Root Scope
- `ngWatchCount()` - returns the total # of watches
- `timings` - a property that we use to collect and show statistics
  * `clear()` - clears the maximum digest, watch and scope counts
  * `enableLog = true` - starts logging detailed stats to a log object
  * `enableLog  =false` (default) - stops logging to the log object
  * `getLogData()` - return the array of log results

This is licensed under the MIT license (see license file). Give me a
thumbs up by watching or starring the repository if you like the script,
or feel free to tweet a thank you at `@krimple` or `@ChariotSolution`.

Ken Rimple
Chariot Solutions
November 2015

