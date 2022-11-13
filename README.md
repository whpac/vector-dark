# Gadget for Dark mode in Polish Wikipedia


## Tests

To run tests locally use:

```
CYPRESS_WIKI_PASSWORD=<password> npx cypress open
```

to run in interactive mode.

use:

```
CYPRESS_WIKI_PASSWORD=<password> npm run test-ci
```

To run automated tests in headless mode


If snapshot different and if you confirm that the code works fine you can update snapshots with this code:

```
CYPRESS_WIKI_PASSWORD=<password> npm run test-ci --env updateSnapshots=true
```

