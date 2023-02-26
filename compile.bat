@echo off
call sass scss/dark:css/dark scss/light:css/light --no-source-map
call python scripts/compactify.py css