Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Copying SkillGap-to-Action to D:\SkillGap-to-Action ..." -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$dest = "D:\SkillGap-to-Action"
if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
}

$source = $PSScriptRoot
Copy-Item -Path "$source\*" -Destination $dest -Recurse -Force -Exclude "node_modules", ".git"

Write-Host "`nSUCCESS: SkillGap-to-Action copied to D:\SkillGap-to-Action successfully!" -ForegroundColor Green
Write-Host "Open D:\SkillGap-to-Action via File -> Open Folder in Antigravity or VS Code." -ForegroundColor White
