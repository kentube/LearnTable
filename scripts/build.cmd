@echo off
@REM cmd /c babel --presets react,es2015 js\source -d js\build
@REM cmd /c browserify js\build\app.js -o bundle.js
@REM cmd /c browserify js\build\discover.js -o discover-bundle.js
cmd /c .\node_modules\.bin\babel js\source -d js\build
cmd /c .\node_modules\.bin\browserify js\build\app.js -o bundle.js
cmd /c .\node_modules\.bin\browserify js\build\discover.js -o discover-bundle.js
type css\components\* css\* > bundle.css 2>NUL
powershell -command "(Get-Content bundle.css).replace('../../images', 'images') | Set-Content bundle.css"

cmd /c eslint js/source
@REM flow
REM npm test

echo %date% %time%
@echo on



