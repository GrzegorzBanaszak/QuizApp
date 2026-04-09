param(
    [string]$Source = "backend/QuizApp.Api/wwwroot/images/avatars",
    [string]$Destination = "assets/avatars",
    [int]$MaxDimension = 1024
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path -LiteralPath $Source)) {
    throw "Source directory not found: $Source"
}

New-Item -ItemType Directory -Force -Path $Destination | Out-Null

Get-ChildItem -LiteralPath $Source -File -Filter *.png | ForEach-Object {
    $inputFile = $_.FullName
    $outputFile = Join-Path $Destination $_.Name

    $image = [System.Drawing.Image]::FromFile($inputFile)
    try {
        $scale = [Math]::Min(1.0, $MaxDimension / [Math]::Max($image.Width, $image.Height))
        $width = [int][Math]::Round($image.Width * $scale)
        $height = [int][Math]::Round($image.Height * $scale)

        $bitmap = New-Object System.Drawing.Bitmap $width, $height
        try {
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
            try {
                $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $graphics.Clear([System.Drawing.Color]::Transparent)
                $graphics.DrawImage($image, 0, 0, $width, $height)
            }
            finally {
                $graphics.Dispose()
            }

            $bitmap.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)
        }
        finally {
            $bitmap.Dispose()
        }
    }
    finally {
        $image.Dispose()
    }
}

Get-ChildItem -LiteralPath $Destination -File | Sort-Object Length -Descending | Select-Object Name, Length
