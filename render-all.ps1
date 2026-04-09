$compositions = @("SalaryArrow", "SalaryArrow2", "SalaryArrow3")
$outputDir = "H:\Shared drives\Scratch Disk\3. Videos\Iran Protest Columbus Circle\Claude AI"

foreach ($comp in $compositions) {
    Write-Host "Rendering $comp..." -ForegroundColor Cyan
    npx remotion render --composition=$comp --codec=prores --pixel-format=yuva444p10le --image-format=png
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to render $comp" -ForegroundColor Red
        exit 1
    }
    Move-Item -Path "out\$comp.mov" -Destination "$outputDir\$comp.mov" -Force
    Write-Host "Moved to $outputDir\$comp.mov" -ForegroundColor Green
}

Write-Host "All renders complete!" -ForegroundColor Green
