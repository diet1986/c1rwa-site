param(
    [Parameter(Mandatory=$true)]
    [string]$Source,

    [string]$Prefix="gallery-photo",

    [switch]$ClearExisting
)

$projectRoot=Split-Path -Parent $PSScriptRoot
$galleryDir=Join-Path $projectRoot "assets\gallery"
$extensions=@(".jpg",".jpeg",".png",".webp",".gif",".svg")

if(!(Test-Path -LiteralPath $Source)){
    throw "Source folder does not exist: $Source"
}

if(!(Test-Path -LiteralPath $galleryDir)){
    New-Item -ItemType Directory -Path $galleryDir | Out-Null
}

if($ClearExisting){
    Get-ChildItem -LiteralPath $galleryDir -File |
        Where-Object { $extensions -contains $_.Extension.ToLower() } |
        Remove-Item -Force
}

$safePrefix=$Prefix.ToLower() -replace "[^a-z0-9]+","-"
$safePrefix=$safePrefix.Trim("-")
if(!$safePrefix){
    $safePrefix="gallery-photo"
}

$images=Get-ChildItem -LiteralPath $Source -File |
    Where-Object { $extensions -contains $_.Extension.ToLower() } |
    Sort-Object Name

$counter=1
foreach($image in $images){
    $extension=$image.Extension.ToLower()
    $targetName="{0}-{1:D2}{2}" -f $safePrefix,$counter,$extension
    $targetPath=Join-Path $galleryDir $targetName
    Copy-Item -LiteralPath $image.FullName -Destination $targetPath -Force
    $counter++
}

& (Join-Path $PSScriptRoot "update-gallery.ps1")

Write-Output "Imported $($images.Count) image(s) into $galleryDir"
