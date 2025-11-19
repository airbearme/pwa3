#!/bin/bash
echo "🔐 Secure deployment to IonOS..."

# Build production app
npm run build

# Create deployment package
mkdir -p airbear-deploy
cp -r dist/public/* airbear-deploy/
cp package.json airbear-deploy/

# Create proper package.json for deployment
cat > airbear-deploy/package.json << 'PKG'
{
  "name": "airbear-pwa-prod",
  "version": "1.0.0",
  "description": "Solar-powered AirBear PWA",
  "main": "index.html",
  "scripts": {
    "start": "python3 -m http.server 3000"
  },
  "dependencies": {}
}
PKG

# Create startup files
cat > airbear-deploy/.htaccess << 'HT'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

<Files *.js>
  Header set Cache-Control "max-age=31536000, immutable"
</Files>
<Files *.css>
  Header set Cache-Control "max-age=31536000, immutable"  
</Files>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 1 month"
  ExpiresByType application/json "access plus 1 month"
</IfModule>
HT

echo "📦 Files ready for upload. Use FTP client or IonOS web interface."
find airbear-deploy -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "index.html" | head -10
