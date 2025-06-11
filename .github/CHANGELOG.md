# Changelog

All notable changes to this project will be documented in this file.

## [v4.5.0](https://github.com/agusmgarcia/react-core/tree/v4.5.0)

> June 11, 2025

### Features ✅

- **StorageCache**: add maxErrorTime parameter
- **Cache**: add maxErrorTime parameter
- **CHANGELOG.md**: group commits by scope
- **deploy**: add --no-tag flag
- **tsconfig.json**: output es format
- **StorageCache**: add version
- **StorageCache**: add set value
- **Cache**: add set value
- **store**: add regenerate method
- support node packages
- **packageJSON**: keep author, description and name when regenerating with force

### Fixes 🎯

- **Cache**: reduce test execution time
- adjust vulnerable dependencies
- update dependencies
- use typeof function instead of instanceOf
- **createServerSlice**: add missing types
- **packageJSON**: replace main and types by exports
- **packageJSON**: unset main for node
- **webpack**: exclude react in case it is not listed under peer deps
- **webpack**: ignore all node modules
- **webpack**: exclude dependencies when building node
- **webpack**: start using MiniCSSExtractPlugin
- **webpack**: add code splitting
- consider ignore flag when deleting files
- encapsulate npm inside a module
- sort properties recursively
- **README.commands.md**: update file

## [v4.4.5](https://github.com/agusmgarcia/react-core/tree/v4.4.5)

> May 24, 2025

### Fixes 🎯

- **createServerSlice**: add reload and loadMore in context

## [v4.4.4](https://github.com/agusmgarcia/react-core/tree/v4.4.4)

> May 18, 2025

### Fixes 🎯

- **store**: adjust SubscribeContext typings
- **createGlobalSlice**: adjust setState type

## [v4.4.3](https://github.com/agusmgarcia/react-core/tree/v4.4.3)

> May 17, 2025

### Fixes 🎯

- **store**: add SubscribeContext
- **catchError**: add module
- **store**: add support for middlewares
- **store**: ignore **internal** everywhere
- **OmitProperty**: add TRecursive parameter
- **AddArgumentToObject**: add TRecursive parameter
- **OmitFuncs**: add TRecursive parameter
- **store**: rename ctx by context
- **store**: forward functions for other states

## [v4.4.2](https://github.com/agusmgarcia/react-core/tree/v4.4.2)

> May 9, 2025

### Fixes 🎯

- **Cache**: prevent caching error if signal is aborted
- **store**: clear timeout if listener is executed first
- **store**: provide a reason to the signal
- **store**: adjust some instructions order

## [v4.4.1](https://github.com/agusmgarcia/react-core/tree/v4.4.1)

> May 9, 2025

### Fixes 🎯

- **Merge**: adjust type implementation
- **AddArgumentToObject**: adjust type implementation
- **OmitFuncs**: adjust type implementation
- **start**: add production flag for nodejs apps
- make node apps to mimic web apps env vars behavior
- **.eslint.config.js**: adjust ignore list for app
- **start**: build before starting
- **createServerSlice**: avoid fetcher to response with undefined
- **store**: adjust AbortController usage
- **createServerSlice**: force selector when TSelected is not an empty object
- **store**: let subscribe to receive current state
- **store**: adjust doc

## [v4.4.0](https://github.com/agusmgarcia/react-core/tree/v4.4.0)

> April 29, 2025

### Features ✅

- **github.middleware**: add ability to merge workflows
- **children**: add isOfType function
- **children**: add mapOfType function
- **merges**: change the options shape
- **throwError**: add utility
- add node support
- **regenerate**: add force argument

### Fixes 🎯

- **package.json**: stop regenerating regenerate script
- **filters**: make distinct to include strict comparison
- **\_app.tsx**: consider base path when locating favicon
- **sortProperties**: add support for arrays
- use latest dependencies versions
- add documentation
- improve testing cases
- **getChildrenOfType**: include components without children
- **filters**: deprecate options
- remove pages on start
- **build**: add command for libraries
- **httpTrigger1.ts**: adjust path of the initial function
- **.gitignore**: stop ignoring .next for non apps
- **tsconfig.json**: adjust excludes
- **eslint.config.js**: adjust ignore list for libs
- **eslint.config.js**: avoid ignoring bin for azure-functions
- **eslint.config.js**: remove react from azure functions
- **next.config.js**: adjust base path env name
- **package.json**: adjust name template
- **package.json**: adjust author template
- **package.json**: install before regenerating file
- **package.json**: add engines support
- **package.json**: use node instead of ts-node
- **README.commands**: adjust documentation

## [v4.3.9](https://github.com/agusmgarcia/react-core/tree/v4.3.9)

> April 16, 2025

### Fixes 🎯

- prevent fails when no git repository found

## [v4.3.8](https://github.com/agusmgarcia/react-core/tree/v4.3.8)

> April 12, 2025

### Fixes 🎯

- **createServerSlice**: reset error and loading on data set

## [v4.3.7](https://github.com/agusmgarcia/react-core/tree/v4.3.7)

> April 11, 2025

### Fixes 🎯

- **local.settings.json**: add isEncrypted flag

## [v4.3.6](https://github.com/agusmgarcia/react-core/tree/v4.3.6)

> April 11, 2025

### Fixes 🎯

- **local.settings.json**: adjust creation process

## [v4.3.5](https://github.com/agusmgarcia/react-core/tree/v4.3.5)

> April 11, 2025

### Fixes 🎯

- **createObjectWithPropertiesSorted**: delete module
- **azureFunction.middleware**: allow custom values for localSettings and funcignore
- **sortProperties**: move it into its own file
- **packageJSON**: enforce main and types for lib
- **getCore**: adjust the way of getting the value
- **merge**: sort properties in all the cases
- **store**: adjust extra methods context
- **AddArgumentToObject**: add type
- **store**: stop receiving selected state on subscribe
- **.gitignore**: adjust ignored list for app
- **.env.local**: allow custom properties
- **.env**: stop creating the file
- **tsconfig.json**: allow custom properties
- **.npmignore**: allow custom ignored files
- **.gitignore**: allow custom ignored files
- **merges**: add ability to concat, filter and sort arrays
- **filters**: add ability to set custom comparator
- **deploy**: add interactive mode
- **question**: add utility
- **regenerate**: stop using echo in favor of console.log
- stop using fixed versions
- allow the usage of path from tsconfig

## [v4.3.4](https://github.com/agusmgarcia/react-core/tree/v4.3.4)

> April 6, 2025

### Fixes 🎯

- **github.middleware**: move some properties to vars
- **azureFunction.middleware**: adjust local.settings.json data
- update README's files

## [v4.3.3](https://github.com/agusmgarcia/react-core/tree/v4.3.3)

> April 5, 2025

### Fixes 🎯

- adjust libraries dependencies

## [v4.3.2](https://github.com/agusmgarcia/react-core/tree/v4.3.2)

> April 5, 2025

### Fixes 🎯

- **github.middleware**: add missing app settings for azure functions
- **packageJSON.middleware**: remove unwanted character

## [v4.3.1](https://github.com/agusmgarcia/react-core/tree/v4.3.1)

> April 4, 2025

### Fixes 🎯

- **github.middleware**: remove dev deps before deploying azure function
- **azureFunction.middleware**: adjust funcignore

## [v4.3.0](https://github.com/agusmgarcia/react-core/tree/v4.3.0)

> April 4, 2025

### Features ✅

- add azure-function support
- **folders**: add isEmpty method
- **folders**: add readFolder method

### Fixes 🎯

- **files**: move readFile method into a separated file
- **getCore**: adjust return type
- **createObjectWithPropertiesSorted**: move it into a separated file
- **node.middleware**: rewrite condition
- **README.commands**: adjust order of regenerated files
- **packageJSON.middleware**: read file inside method

## [v4.2.6](https://github.com/agusmgarcia/react-core/tree/v4.2.6)

> April 4, 2025

### Fixes 🎯

- **webpack.middleware**: make jsx-runtime external

## [v4.2.5](https://github.com/agusmgarcia/react-core/tree/v4.2.5)

> April 3, 2025

### Fixes 🎯

- **test**: include the --pattern argument

## [v4.2.4](https://github.com/agusmgarcia/react-core/tree/v4.2.4)

> April 1, 2025

### Fixes 🎯

- **git**: remove quotes from commit msg

## [v4.2.3](https://github.com/agusmgarcia/react-core/tree/v4.2.3)

> April 1, 2025

### Fixes 🎯

- **github.middleware**: adjust logic to create changelog file
- **git**: adjust the way commits are being extracted
- **execute**: adjust the command and args resolution strategy

## [v4.2.2](https://github.com/agusmgarcia/react-core/tree/v4.2.2)

> March 31, 2025

### Fixes 🎯

- **git**: stop using quotes for commit message
- **github.middleware**: aggregate server calls when creating changelog
- **git**: add --no-verify flag when deleting branch
- **webpack**: let script decide whether deleting output project

## [v4.2.1](https://github.com/agusmgarcia/react-core/tree/v4.2.1)

> March 29, 2025

### Fixes 🎯

- **webpack.middleware**: add getCustomTransformers

## [v4.2.0](https://github.com/agusmgarcia/react-core/tree/v4.2.0)

> March 28, 2025

### Features ✅

- add core property under package.json file
- regenerate package.json
- **git**: add getRepositoryDetails function
- remove files from the other type of app

### Fixes 🎯

- **eslint.config.js**: ignore d.ts files
- adjust libraries dependencies
- **deploy.ts**: stop using ??

## [v4.1.4](https://github.com/agusmgarcia/react-core/tree/v4.1.4)

> March 28, 2025

### Fixes 🎯

- stop importing React for libraries

## [v4.1.3](https://github.com/agusmgarcia/react-core/tree/v4.1.3)

> March 28, 2025

### Fixes 🎯

- **github.middleware**: regenerate changelog file using remote url

## [v4.1.2](https://github.com/agusmgarcia/react-core/tree/v4.1.2)

> March 28, 2025

### Fixes 🎯

- **isLibrary**: consider private property as string
- remove @eslint/compat peers
- remove react-dom peer

## [v4.1.1](https://github.com/agusmgarcia/react-core/tree/v4.1.1)

> March 22, 2025

### Fixes 🎯

- **createServerSlice**: remove set method from type

## [v4.1.0](https://github.com/agusmgarcia/react-core/tree/v4.1.0)

> March 22, 2025

### Features ✅

- **createServerSlice**: add ability to support extra methods
- **Merge**: add type
- **createServerSlice**: make prevData available in fetcher
- **nextjs.middleware**: start creating \_app files
- **nextjs.middleware**: omit devIndicators

### Fixes 🎯

- **createServerSlice**: readjust methods order
- **createGlobalSlice**: adjust types

## [v4.0.2](https://github.com/agusmgarcia/react-core/tree/v4.0.2)

> March 20, 2025

### Fixes 🎯

- adjust peer dependencies

## [v4.0.1](https://github.com/agusmgarcia/react-core/tree/v4.0.1)

> March 20, 2025

### Fixes 🎯

- **useElementAtBottom**: adjust compatibility with useRef
- **useElementAtTop**: adjust compatibility with useRef
- **useDimensions**: adjust compatibility with useRef

## [v4.0.0](https://github.com/agusmgarcia/react-core/tree/v4.0.0)

> March 19, 2025

### Breaking changes ❗️

- change prettier config
- bump to nextjs 15, react 19 and eslint 9
- **deploy**: propagate release
- **deploy**: validate tag position before publishing
- **postpack**: stop using simulated flag

### Features ✅

- **useDimensions**: add hook
- **useDevicePixelRatio**: add hook

### Fixes 🎯

- start using node 22.14
- **useElementAtBottom**: handle scenarios where element is initially null
- **useElementAtTop**: handle scenarios where element is initially null
- **README.md**: update file
- bump dependencies

## [v3.9.1](https://github.com/agusmgarcia/react-core/tree/v3.9.1)

> March 9, 2025

### Fixes 🎯

- **github.middleware**: regenerate it using UTC time
- **git**: adjust the way of getting creationg date

## [v3.9.0](https://github.com/agusmgarcia/react-core/tree/v3.9.0)

> March 8, 2025

### Features ✅

- **merges**: add utility
- **github.middleware**: delete release on error
- **git**: add isCurrentBranchSynced method

### Fixes 🎯

- **store**: start using merge utility
- **github.middleware**: stop enable pages automatically
- **deploy**: check whether branch is synced and tag doesn't exist
- **execute**: make the wildcard complex to be detected
- **tailwind.middleware**: adjust tailwind.config file
- **README**: update files

## [v3.8.0](https://github.com/agusmgarcia/react-core/tree/v3.8.0)

> March 2, 2025

### Features ✅

- **test**: add watch flag

### Fixes 🎯

- **github.middleware**: stop forcing GitHub NPM registry
- **webpack.middleware**: handle scenario for no-peers
- **README.md**: add more details to the getting started section
- **node.middleware**: omit tests definitions when packaging
- **eslint.middleware**: make react in jsx scope
- add a method to get process args
- **test**: remove .swc folder on error too
- add test cases
- rename utilities to utils
- replace null, undefined and string empty

## [v3.7.0](https://github.com/agusmgarcia/react-core/tree/v3.7.0)

> February 26, 2025

### Features ✅

- run scripts in sequence
- **getChildrenOfType**: add utility
- **Tuple**: add type
- **UnionToTuple**: add type
- **TupleToUnion**: add type
- **UnionToIntersection**: add type

### Fixes 🎯

- call scripts directly
- **github.middleware**: stop scaping markdown in CHANGELOG file
- **github.middleware**: display a message when no commits have been included in changelog
- **start**: use available port if not specified

## [v3.6.0](https://github.com/agusmgarcia/react-core/tree/v3.6.0)

> February 16, 2025

### Features ✅

- **start**: add port argument
- **Cache**: handle errors properly
- **createServer**: add loadMore function

### Fixes 🎯

- move instructions into the git module
- **postpack**: adjust arguments structure
- **nextjs.middleware**: start regenerating next.config.js

## [v3.5.0](https://github.com/agusmgarcia/react-core/tree/v3.5.0)

> February 12, 2025

### Features ✅

- add tailwind in the library

### Fixes 🎯

- **github.middleware**: escape markdown
- **nextjs.middleware**: prevent regenerating next.config.js
- **typescript.middleware**: adjust tsconfig
- **github.middleware**: enable pages automatically

## [v3.4.0](https://github.com/agusmgarcia/react-core/tree/v3.4.0)

> February 7, 2025

### Features ✅

- **store**: add initial state

### Fixes 🎯

- **store**: prevent subscribing in SSR context

## [v3.3.1](https://github.com/agusmgarcia/react-core/tree/v3.3.1)

> February 7, 2025

### Fixes 🎯

- **deploy**: adjust naming convention

## [v3.3.0](https://github.com/agusmgarcia/react-core/tree/v3.3.0)

> February 7, 2025

### Features ✅

- **deploy**: add deploy cli

### Fixes 🎯

- reorganize imports
- **dates**: adjust calculation to get first date of the month
- **execute**: adjust the way of getting parameters

## [v3.2.2](https://github.com/agusmgarcia/react-core/tree/v3.2.2)

> February 5, 2025

### Fixes 🎯

- **store**: adjust typings
- **prettier.middleware**: stop finding prettier config
- segregate between create and update phase while regenerating
- **github.middleware**: segregate concurrency by tag

## [v3.2.1](https://github.com/agusmgarcia/react-core/tree/v3.2.1)

> February 4, 2025

### Fixes 🎯

- **OmitFuncs**: ignore arrays and functions

## [v3.2.0](https://github.com/agusmgarcia/react-core/tree/v3.2.0)

> February 4, 2025

### Features ✅

- **filters**: add paginate function
- **Cache**: add ability to set custom expiration per key

### Fixes 🎯

- **dates**: allow receiving number in the toString method
- **createServerSlice**: adjust input typings

## [v3.1.0](https://github.com/agusmgarcia/react-core/tree/v3.1.0)

> February 3, 2025

### Features ✅

- **store**: add ability to set up the initial pagination
- **store**: add pagination to the reload method
- **store**: add load more functionality
- **OmitFuncs**: add utility
- **filters**: add utility
- **dates**: export toString method

### Fixes 🎯

- **store**: prevent accessing functions inside store

## [v3.0.2](https://github.com/agusmgarcia/react-core/tree/v3.0.2)

> January 31, 2025

### Fixes 🎯

- **store**: make run the first time
- **README.md**: adjust store doc
- **github.middleware**: create CHANGELOG.md file when no git context available

## [v3.0.1](https://github.com/agusmgarcia/react-core/tree/v3.0.1)

> January 29, 2025

### Fixes 🎯

- **eslint.middleware**: encapsulate functions outside the module
- **getPackageJSON**: create a method to get the object
- re-order commands
- **eslint.middleware**: stop using eslint-plugin-boundaries
- **github.middleware**: adjust CHANGELOG file regeneration

## [v3.0.0](https://github.com/agusmgarcia/react-core/tree/v3.0.0)

> January 18, 2025

### Breaking changes ❗️

- **github.middleware**: regenerate CHANGELOG file
- **store**: separate store
- **currencies**: remove it
- **dates**: remove formatDate
- **useValueTracker**: remove it
- **useFocusTracker**: remove it
- **useCheckedTracker**: remove it
- **replaceString**: change shape of the model
- **Func.types**: remove the old-way

### Features ✅

- **getProjectName**: add utility

### Fixes 🎯

- **StorageCache**: remove uneeded casts

## [v2.12.2](https://github.com/agusmgarcia/react-core/tree/v2.12.2)

> January 11, 2025

### Fixes 🎯

- **prettier.middleware**: start using EOL
- prevent dependecy error

## [v2.12.1](https://github.com/agusmgarcia/react-core/tree/v2.12.1)

> January 9, 2025

### Fixes 🎯

- bump vulnerable dependencies

## [v2.12.0](https://github.com/agusmgarcia/react-core/tree/v2.12.0)

> November 28, 2024

### Features ✅

- add simulated flag when packing the library

### Fixes 🎯

- **StorageCache**: adjust typings
- **Cache**: adjust typings

## [v2.11.1](https://github.com/agusmgarcia/react-core/tree/v2.11.1)

> November 23, 2024

### Fixes 🎯

- **StorageCache**: adjust types
- **Cache**: adjust types

## [v2.11.0](https://github.com/agusmgarcia/react-core/tree/v2.11.0)

> November 23, 2024

### Features ✅

- **StorageCache**: add utility
- **Cache**: add utility

### Fixes 🎯

- bump vulnerable dependencies
- **package.json**: adjust scripts

## [v2.10.0](https://github.com/agusmgarcia/react-core/tree/v2.10.0)

> November 2, 2024

### Features ✅

- **replaceString**: add ability to introduce conditions
- **isOnlyId**: add utils
- **finds**: add singleOrDefault method

### Fixes 🎯

- **README.md**: prepare it for the next major version
- **replaceString**: handle scenarios for undefined message

## [v2.9.0](https://github.com/agusmgarcia/react-core/tree/v2.9.0)

> October 31, 2024

### Features ✅

- **github.middleware**: remove scope
- **eslint.middleware**: add eslint-plugin-boundaries for app
- **eslint.middleware**: add eslint-plugin-tailwindcss

### Fixes 🎯

- adjust README.md paths
- update packages
- **tailwindcss.middleware**: adjust tailwind config file
- **nextjs.middleware**: adjust nextjs config file

## [v2.8.1](https://github.com/agusmgarcia/react-core/tree/v2.8.1)

> October 16, 2024

### Fixes 🎯

- adjust engine compatibility to minimum

## [v2.8.0](https://github.com/agusmgarcia/react-core/tree/v2.8.0)

> October 14, 2024

### Features ✅

- **finds**: add utility
- **dates**: add validate feature

### Fixes 🎯

- **useElementAtTop**: use devicePixelRatio as unit
- **useElementAtBottom**: use devicePixelRatio as unit

## [v2.7.0](https://github.com/agusmgarcia/react-core/tree/v2.7.0)

> September 21, 2024

### Features ✅

- **useMediaQuery**: add initialValue

### Fixes 🎯

- **useValueTracker**: track change events
- **README.md**: update file
- **useValueTracker**: deprecate it
- **useFocusTracker**: deprecate it
- **useElementAtTop**: rename initialValue
- **useElementAtBottom**: rename initialValue
- bump vulnerable dependencies

## [v2.6.1](https://github.com/agusmgarcia/react-core/tree/v2.6.1)

> August 29, 2024

### Fixes 🎯

- **useFocusTracker**: separate focusin vs focusout handlers
- **useValueTracker**: use input instead of change event
- **useElementAtTop**: consider element beign resized
- **useElementAtBottom**: consider element beign resized
- bump vulnerable dependencies

## [v2.6.0](https://github.com/agusmgarcia/react-core/tree/v2.6.0)

> August 24, 2024

### Features ✅

- **dates**: add ability to get date, month and year
- **dates**: add toDateString
- **useValueTracker**: add utility
- **useFocusTracker**: add utility
- **mergeRefs**: add utility

### Fixes 🎯

- bump vulnerable dependencies
- **README.utilities**: adjust documentation
- **getCurrentDate**: add timeZoneName parameter
- **getCurrentDate**: consider timeZone
- **useElementAtBottom**: adjust logic to detect scenario
- **useElementAtTop**: adjust documentation
- **useElementAtBottom**: adjust documentation

## [v2.5.0](https://github.com/agusmgarcia/react-core/tree/v2.5.0)

> August 14, 2024

### Features ✅

- **capitalize**: add utility
- **isChildOf**: add utility
- **isParentOf**: add utility

### Fixes 🎯

- **jest.middleware**: adjust jest config file generation

## [v2.4.2](https://github.com/agusmgarcia/react-core/tree/v2.4.2)

> July 20, 2024

### Fixes 🎯

- **github.middleware**: adjust deployment steps

## [v2.4.1](https://github.com/agusmgarcia/react-core/tree/v2.4.1)

> July 20, 2024

### Fixes 🎯

- **github.middleware**: adjust deployment steps

## [v2.4.0](https://github.com/agusmgarcia/react-core/tree/v2.4.0)

> July 19, 2024

### Features ✅

- **eslint.middleware**: add consistent type import rule

### Fixes 🎯

- adjust paths resolver for libraries

## [v2.3.0](https://github.com/agusmgarcia/react-core/tree/v2.3.0)

> July 18, 2024

### Features ✅

- separate workflows in two
- add tsconfig-paths resolver
- add test command
- **blockUntil**: add utility

### Fixes 🎯

- **useElementAtBottom**: add some margins
- **useElementAtTop**: add some margins
- **github.middleware**: re-organize steps
- **github.middleware**: bump actions versions
- **github.middleware**: rename lint by check
- use node v20
- use Func type
- **Func.types**: make typescript compatible
- **README.commands.md**: include tailwindcss
- **README.utilities.md**: fix documentation

## [v2.2.0](https://github.com/agusmgarcia/react-core/tree/v2.2.0)

> June 22, 2024

### Features ✅

- **webpack.middleware**: add support for commands

### Fixes 🎯

- **tailwindcss.middleware**: prevent overriding tailwind.config.js file

## [v2.1.1](https://github.com/agusmgarcia/react-core/tree/v2.1.1)

> June 19, 2024

### Fixes 🎯

- **prettier.middleware**: adjust .prettierrc file
- **README.utilities.md**: adjust Func documentation
- **.prettierrc**: ignore eslintrc file

## [v2.1.0](https://github.com/agusmgarcia/react-core/tree/v2.1.0)

> June 19, 2024

### Features ✅

- **tailwindcss.middleware**: add tailwind support
- **useElementAtBottom**: add utility
- **useElementAtTop**: add utility
- **AsyncFunc.types**: add utility
- **Func.types**: move result and args positions
- **delay**: add utility

### Fixes 🎯

- **prettier.middleware**: adjust eslintrc format
- **currencies**: add return type
- **useMediaQuery**: add return type
- **replaceString**: add return type
- **README.utilities.md**: adjust useMediaQuery doc
- **README.utilities.md**: adjust OnlyId doc

## [v2.0.2](https://github.com/agusmgarcia/react-core/tree/v2.0.2)

> June 10, 2024

### Fixes 🎯

- stop regenerating .env and .env.local
- **OnlyId**: mark rest of props to partial

## [v2.0.1](https://github.com/agusmgarcia/react-core/tree/v2.0.1)

> June 10, 2024

### Fixes 🎯

- **.gitignore**: exclude .next folder

## [v2.0.0](https://github.com/agusmgarcia/react-core/tree/v2.0.0)

> June 8, 2024

### Breaking changes ❗️

- rename commands

### Features ✅

- include .npmignore generation
- include .gitignore generation
- add store
- **regenerate**: add command
- add utilities
- **withContext.core**: start creating .nvmrc file

### Fixes 🎯

- **useSWR**: adjust input and outputs
- store global variables in globalThis
- include sub README files
- stop regenerating README and CHANGELOG
- start using its own commands
- **README.md**: update file
- restructure commands module
- **withContext.webpack**: modify getting absolute paths
- prettify content
- move commands inside a folder

## [v1.3.3](https://github.com/agusmgarcia/react-core/tree/v1.3.3)

> June 1, 2024

### Fixes 🎯

- **withContext.github**: use node version 20

## [v1.3.2](https://github.com/agusmgarcia/react-core/tree/v1.3.2)

> May 23, 2024

### Fixes 🎯

- bump peer dependencies

## [v1.3.1](https://github.com/agusmgarcia/react-core/tree/v1.3.1)

> February 23, 2024

### Fixes 🎯

- **withContext.github**: remove empty space
- **.nvmrc**: add file

## [v1.3.0](https://github.com/agusmgarcia/react-core/tree/v1.3.0)

> December 22, 2023

### Features ✅

- **withContext.github**: check whether package matches tag

### Fixes 🎯

- check package matches tag

## [v1.2.1](https://github.com/agusmgarcia/react-core/tree/v1.2.1)

> November 30, 2023

### Fixes 🎯

- **execute**: make compatible with windows

## [v1.2.0](https://github.com/agusmgarcia/react-core/tree/v1.2.0)

> November 27, 2023

### Features ✅

- **withContext.github**: add support to trigger workflows

### Fixes 🎯

- restrict to use node 16

## [v1.1.1](https://github.com/agusmgarcia/react-core/tree/v1.1.1)

> October 31, 2023

### Fixes 🎯

- change force by skip

## [v1.1.0](https://github.com/agusmgarcia/react-core/tree/v1.1.0)

> October 30, 2023

### Features ✅

- add force flag

### Fixes 🎯

- bump pakcage version
- delete bin folder after pack

## [v1.0.3](https://github.com/agusmgarcia/react-core/tree/v1.0.3)

> October 27, 2023

### Fixes 🎯

- **CHANGELOG.md**: update file
- ignore more files
- **withContext.typescript**: adjust ignore files
- **withContext.prettier**: adjust ignore files
- **withContext.eslint**: adjust ignore files

## [v1.0.2](https://github.com/agusmgarcia/react-core/tree/v1.0.2)

> October 27, 2023

### Fixes 🎯

- bum package version
- **withContext.prettier**: adjust ignore file
- **withContext.eslint**: adjust ignore file

## [v1.0.1](https://github.com/agusmgarcia/react-core/tree/v1.0.1)

> October 27, 2023

### Fixes 🎯

- start ignoring more files
- **withContext.prettier**: ignore more files
- **withContext.eslint**: ignore more files
- **build.core**: split commands

## [v1.0.0](https://github.com/agusmgarcia/react-core/tree/v1.0.0)

> October 27, 2023

### Features ✅

- export commands
- **core**: add commands
- **github**: add commands
- **webpack**: add commands
- **typescript**: add commands
- **eslint**: add commands
- **prettier**: add commands
- **writeFile**: add utils
- **remove**: add utils
- **isLibrary**: add utils
- **readFile**: add utils
- **execute**: add utils
- **IgnorableError**: add class
- **exists**: add utils
- **createFolder**: add utils

### Fixes 🎯

- setup project
