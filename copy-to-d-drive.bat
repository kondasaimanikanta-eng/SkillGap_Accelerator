@echo off
echo ========================================================
echo Copying SkillGap-to-Action to D:\SkillGap-to-Action ...
echo ========================================================

if not exist "D:\SkillGap-to-Action" (
    mkdir "D:\SkillGap-to-Action"
)

xcopy "%~dp0*" "D:\SkillGap-to-Action\" /E /I /Y /H /Exclude:%~dp0.copyignore 2>nul
if %errorlevel% neq 0 (
    echo Performing robocopy mirror...
    robocopy "%~dp0" "D:\SkillGap-to-Action" /E /XD node_modules .git
)

echo.
echo ========================================================
echo SUCCESS: Project files copied to D:\SkillGap-to-Action!
echo You can now open D:\SkillGap-to-Action in VS Code or Antigravity IDE!
echo ========================================================
pause
