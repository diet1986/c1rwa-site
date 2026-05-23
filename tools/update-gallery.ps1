$projectRoot=Split-Path -Parent $PSScriptRoot
$galleryDir=Join-Path $projectRoot "assets\gallery"
$outputFile=Join-Path $projectRoot "js\gallery-images.js"
$extensions=@(".jpg",".jpeg",".png",".webp",".gif",".svg")

if(!(Test-Path -LiteralPath $galleryDir)){
    New-Item -ItemType Directory -Path $galleryDir | Out-Null
}

$images=Get-ChildItem -LiteralPath $galleryDir -File |
    Where-Object { $extensions -contains $_.Extension.ToLower() } |
    Sort-Object Name |
    ForEach-Object {
        $name=$_.BaseName -replace "[-_]"," "
        $alt=(Get-Culture).TextInfo.ToTitleCase($name)
        "    {src:`"assets/gallery/$($_.Name)`",alt:`"$alt`"}"
    }

if($images.Count -eq 0){
    $images=@(
        "    {src:`"https://img1.wsimg.com/isteam/getty/874225190`",alt:`"Community park`"}",
        "    {src:`"assets/images/banner1.svg`",alt:`"C1 RWA entrance illustration`"}",
        "    {src:`"assets/images/banner2.svg`",alt:`"C1 RWA green space illustration`"}",
        "    {src:`"assets/images/banner3.svg`",alt:`"C1 RWA evening neighborhood illustration`"}"
    )
}

$content="const galleryImages=[`n$($images -join ",`n")`n];`n"
Set-Content -LiteralPath $outputFile -Value $content -Encoding UTF8
