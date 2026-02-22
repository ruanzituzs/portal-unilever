Add-Type -AssemblyName System.Drawing

$sourceFile = "public\logo.png"
$outputDir = "src\assets\icons"

# Criar diretório se não existir
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "Pasta criada: $outputDir"
}

# Tamanhos de ícone para PWA
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

# Carregar imagem original
$originalImage = [System.Drawing.Image]::FromFile((Resolve-Path $sourceFile))
Write-Host "Imagem original: $($originalImage.Width)x$($originalImage.Height)"

foreach ($size in $sizes) {
    $outputFile = "$outputDir\icon-${size}x${size}.png"
    
    # Criar bitmap redimensionado
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Alta qualidade
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    # Desenhar imagem redimensionada
    $graphics.DrawImage($originalImage, 0, 0, $size, $size)
    
    # Salvar
    $bitmap.Save((Resolve-Path ".").Path + "\" + $outputFile, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Gerado: icon-${size}x${size}.png"
}

$originalImage.Dispose()
Write-Host ""
Write-Host "Todos os icones foram gerados com sucesso em: $outputDir"
