
$option=$args[0]
$version=$args[1]

if ([string]::IsNullOrEmpty($version))
{
  $version="patch"
}

Switch ($option)
{
  "standalone" {
    Write-Output "bumping standalone version"
    Push-Location
    Set-Location standalone
    npm version $version
    npm i --package-lock-only
    Pop-Location
  }
  "lambda" {
    Write-Output "bumping lambda version"
    Push-Location
    Set-Location lambda
    npm version ${VERSION}
    npm i --package-lock-only
    Pop-Location
  }
  "core" {
    Write-Output "bumping core version"
    Push-Location
    Set-Location core
    npm version ${VERSION}
    npm i --package-lock-only
    Pop-Location
  }
  default {
    Write-Output "unkown option"
  }
}
