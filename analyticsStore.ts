[build]
  command = "npm install && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

# ВАЖНО: добавь свой Gemini API ключ в Netlify → Site Settings → Environment Variables
# Название переменной: VITE_API_KEY
# Значение: твой ключ с aistudio.google.com/apikey

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
