# System General Information

This script will generate System information report (win/linux/mac) in HTML and JSON formats

### Run

```bash
npm install

npm start
```

### Build

```bash
# Make sure pkg is installed
npm install -g pkg
# To create .exe
pkg index.js --targets node16-win-x64 --output system-summary.exe

# OR
npm run build

```
