const si = require("systeminformation");
const fs = require("fs");

// Function to generate system summary
async function generateSystemSummary() {
  try {
    // Get system information
    const [cpu, memory, os, disk, network, battery] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.osInfo(),
      si.diskLayout(),
      si.networkInterfaces(),
      si.battery(),
    ]);

    // Create HTML content
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>System Information Summary</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            h1 {
                color: #2c3e50;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th, td {
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <h1>System Information Summary</h1>

        <h2>OS Information</h2>
        <table>
            <tr><th>Platform</th><td>${os.platform}</td></tr>
            <tr><th>Distro</th><td>${os.distro}</td></tr>
            <tr><th>Release</th><td>${os.release}</td></tr>
            <tr><th>kernel</th><td>${os.kernel}</td></tr>
            <tr><th>Architecture</th><td>${os.arch}</td></tr>
            <tr><th>Hostname</th><td>${os.hostname}</td></tr>
            <tr><th>Platform</th><td>${os.platform}</td></tr>
            <tr><th>Serial</th><td>${os.serial}</td></tr>
            <tr><th>Build</th><td>${os.build}</td></tr>
            <tr><th>Uefi</th><td>${String(os.uefi)}</td></tr>
            <tr><th>Hypervisor</th><td>${String(os.hypervisor)}</td></tr>
        </table>

        <h2>CPU Information</h2>
        <table>
            <tr><th>CPU Manufacturer</th><td>${cpu.manufacturer}</td></tr>
            <tr><th>CPU Brand</th><td>${cpu.brand}</td></tr>
            <tr><th>CPU Vendor</th><td>${cpu.vendor}</td></tr>
            <tr><th>CPU Family</th><td>${cpu.family}</td></tr>
            <tr><th>CPU Stepping</th><td>${cpu.stepping}</td></tr>
            <tr><th>CPU Speed</th><td>${cpu.speed} GHz</td></tr>
            <tr><th>CPU Speed Min</th><td>${cpu.speedMin} GHz</td></tr>
            <tr><th>CPU Speed Max</th><td>${cpu.speedMax} GHz</td></tr>
            <tr><th>CPU Cores</th><td>${cpu.cores}</td></tr>
            <tr><th>CPU Physical Cores</th><td>${cpu.physicalCores}</td></tr>
            <tr><th>CPU Performance Cores</th><td>${
              cpu.performanceCores
            }</td></tr>
            <tr><th>CPU Efficiency Cores</th><td>${
              cpu.efficiencyCores
            }</td></tr>
            <tr><th>Processors</th><td>${cpu.processors}</td></tr>
            <tr><th>CPU Socket</th><td>${cpu.socket}</td></tr>
            <tr><th>CPU Flags</th><td>${cpu.flags}</td></tr>
            <tr><th>CPU Virtualization</th><td>${String(
              cpu.virtualization
            )}</td></tr>
            <tr><th>CPU Cache</th><td>${JSON.stringify(cpu.cache)}</td></tr>
        </table>

        <h2>Memory Information</h2>
        <table>
            <tr><th>Total Memory</th><td>${(memory.total / 1024 ** 3).toFixed(
              2
            )} GB</td></tr>
            <tr><th>Free Memory</th><td>${(memory.free / 1024 ** 3).toFixed(
              2
            )} GB</td></tr>
            <tr><th>Used Memory</th><td>${(memory.used / 1024 ** 3).toFixed(
              2
            )} GB</td></tr>
        </table>

        <h2>Disk Information</h2>
        <table>
            ${disk
              .map(
                (diskInfo) => `
            <tr><th>Disk Model</th><td>${diskInfo.model}</td></tr>
            <tr><th>Disk Size</th><td>${(diskInfo.size / 1024 ** 3).toFixed(
              2
            )} GB</td></tr>
            `
              )
              .join("")}
        </table>

        <h2>Network Information</h2>
        <table>
            ${network
              .map(
                (networkInfo) => `
            <tr><th>Interface</th><td>${networkInfo.iface}</td></tr>
            <tr><th>IP Address</th><td>${networkInfo.ip4}</td></tr>
            `
              )
              .join("")}
        </table>

        <h2>Battery Information</h2>
        <table>
            <tr><th>Battery Is Charging</th><td>${
              battery.ischarging ? "Yes" : "No"
            }</td></tr>
            <tr><th>Battery Percentage</th><td>${battery.percent}%</td></tr>
        </table>
    </body>
    </html>
    `;

    // Save the HTML file
    fs.writeFileSync("system_summary.html", htmlContent, "utf-8");
    console.log('System summary HTML file created as "system_summary.html"');
  } catch (error) {
    console.error("Error generating system summary:", error);
  }
}

// Generate system summary
generateSystemSummary();
