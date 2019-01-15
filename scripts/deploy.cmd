REM cleanup last version
REM rm -rf __deployme
md ..\ReleaseTable 2>NUL
md ..\ReleaseTable\images 2>NUL
del /q ..\ReleaseTable\images\*.*
del /q ..\ReleaseTable\*.js
del /q ..\ReleaseTable\*.css
del /q ..\ReleaseTable\*.html

REM build
call scripts\build.cmd

REM minify js
REM cmd /c .\node_modules\.bin\uglify -s bundle.js -o ..\ReleaseTable\bundle.js
REM uglify -s C:\Users\Public\Documents\Kenneth\LearnTable\bundle.js -o C:\Users\Public\Documents\Kenneth\LearnTable\bundle.u.js
REM npm install --save-dev javascript-obfuscator
cmd /c .\node_modules\.bin\javascript-obfuscator bundle.js --output ..\ReleaseTable\bundle.js --compact true --self-defending false

REM minify css
REM npm install --save-dev cssshrink
REM cmd /c .\node_modules\.bin\cssshrink bundle.css > ..\ReleaseTable\bundle.css
REM npm install uglifycss -g
REM uglifycss [options] [filename] [...] > output
REM npm install uglifycss -save-dev
cmd /c .\node_modules\.bin\uglifycss bundle.css --output ..\ReleaseTable\bundle.css

REM copy html and images
copy /y index.html ..\ReleaseTable\index.html
copy /y images\ ..\ReleaseTable\images\
copy /y server.js ..\ReleaseTable

echo %date% %time%
@echo on
