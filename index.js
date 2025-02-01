const si = require("systeminformation");
const fs = require("fs");
const ora = require("ora");

const spinner = ora("Scanning System...").start();

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

function separator() {
  return "<tr><th>---------------------------------------</th><td>---------------------------------------</td></tr>";
}

// Function to generate system summary
async function generateSystemSummary() {
  try {
    // Get system information
    const [
      cpu,
      memory,
      os,
      disk,
      network,
      battery,
      graphics,
      printer,
      audio,
      bluetooth,
    ] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.osInfo(),
      si.diskLayout(),
      si.networkInterfaces(),
      si.battery(),
      si.graphics(),
      si.printer(),
      si.audio(),
      si.bluetoothDevices(),
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
            <tr><th>Total Memory</th><td>${formatBytes(memory.total)}</td></tr>
            <tr><th>Free Memory</th><td>${formatBytes(memory.free)}</td></tr>
            <tr><th>Used Memory</th><td>${formatBytes(memory.used)}</td></tr>
            <tr><th>Active Memory</th><td>${formatBytes(
              memory.active
            )}</td></tr>
            <tr><th>Active Available</th><td>${formatBytes(
              memory.available
            )}</td></tr>
            <tr><th>Buffers</th><td>${memory.buffers}</td></tr>
            <tr><th>Cached</th><td>${memory.cached}</td></tr>
            <tr><th>Slab</th><td>${memory.slab}</td></tr>
            <tr><th>Buffers</th><td>${memory.buffers}</td></tr>
            <tr><th>Swap Total</th><td>${formatBytes(
              memory.swaptotal
            )}</td></tr>
            <tr><th>Swap Used</th><td>${formatBytes(memory.swapused)}</td></tr>
            <tr><th>Swap Free</th><td>${formatBytes(memory.swapfree)}</td></tr>
            <tr><th>Writeback</th><td>${memory.writeback}</td></tr>
            <tr><th>Dirty</th><td>${memory.dirty}</td></tr>
        </table>

        <h2>Disk Information</h2>
        <table>
            ${disk
              .map(
                (diskInfo, idx) => `
                ${idx !== 0 ? separator() : ""}
            <tr><th>Device</th><td><b>${diskInfo.device}</b></td></tr>
            <tr><th>Disk Name</th><td>${diskInfo.name}</td></tr>
            <tr><th>Disk Vendor</th><td>${diskInfo.vendor}</td></tr>
            <tr><th>Disk Size</th><td>${formatBytes(diskInfo.size)}</td></tr>
            <tr><th>Disk Bytes per Sector</th><td>${
              diskInfo.bytesPerSector
            }</td></tr>
            <tr><th>Disk Total Cylinders</th><td>${
              diskInfo.totalCylinders
            }</td></tr>
            <tr><th>Disk Total Heads</th><td>${diskInfo.totalHeads}</td></tr>
            <tr><th>Disk Total Sectors</th><td>${
              diskInfo.totalSectors
            }</td></tr>
            <tr><th>Disk Total Tracks</th><td>${diskInfo.totalTracks}</td></tr>
            <tr><th>Disk Track per Cylinder</th><td>${
              diskInfo.tracksPerCylinder
            }</td></tr>
            <tr><th>Disk Sectors per Track</th><td>${
              diskInfo.sectorsPerTrack
            }</td></tr>
            <tr><th>Disk Firmware Revision</th><td>${
              diskInfo.firmwareRevision
            }</td></tr>
            <tr><th>Disk Serial Number</th><td>${diskInfo.serialNum}</td></tr>
            <tr><th>Disk Interface Type</th><td>${
              diskInfo.interfaceType
            }</td></tr>
            <tr><th>Disk Smart Status</th><td>${diskInfo.smartStatus}</td></tr>
            <tr><th>Disk Temperature</th><td>${diskInfo.temperature}</td></tr>
            `
              )
              .join("")}
        </table>

        <h2>Network Information</h2>
        <table>
            ${network
              .map(
                (networkInfo, idx) => `
            ${idx !== 0 ? separator() : ""}
            <tr><th>Interface</th><td>${networkInfo.iface}</td></tr>
            <tr><th>Interface Name</th><td>${networkInfo.ifaceName}</td></tr>
            <tr><th>Default</th><td>${networkInfo.default}</td></tr>
            <tr><th>IP Address (IPv4)</th><td>${networkInfo.ip4}</td></tr>
            <tr><th>IPv4 Subnet</th><td>${networkInfo.ip4subnet}</td></tr>
            <tr><th>IP Address (IPv6)</th><td>${networkInfo.ip6}</td></tr>
            <tr><th>IPv6 Subnet</th><td>${networkInfo.ip6subnet}</td></tr>
            <tr><th>MAC Address</th><td>${networkInfo.mac}</td></tr>
            <tr><th>Internal</th><td>${networkInfo.internal}</td></tr>
            <tr><th>Virtual</th><td>${networkInfo.virtual}</td></tr>
            <tr><th>Operational State</th><td>${networkInfo.operstate}</td></tr>
            <tr><th>Type</th><td>${networkInfo.type}</td></tr>
            <tr><th>Duplex</th><td>${networkInfo.duplex}</td></tr>
            <tr><th>MTU</th><td>${networkInfo.mtu}</td></tr>
            <tr><th>Speed</th><td>${networkInfo.speed}</td></tr>
            <tr><th>DHCP</th><td>${networkInfo.dhcp}</td></tr>
            <tr><th>DNS Suffix</th><td>${networkInfo.dnsSuffix}</td></tr>
            <tr><th>IEEE 802.1X Authentication</th><td>${
              networkInfo.ieee8021xAuth
            }</td></tr>
            <tr><th>IEEE 802.1X State</th><td>${
              networkInfo.ieee8021xState
            }</td></tr>
            <tr><th>Carrier Changes</th><td>${
              networkInfo.carrierChanges
            }</td></tr>

            `
              )
              .join("")}
        </table>


        <h2>Battery Information</h2>
        <table>
           <tr><th>Has Battery</th><td>${
             battery.hasBattery ? "Yes" : "No"
           }</td></tr>
        <tr><th>Cycle Count</th><td>${battery.cycleCount}</td></tr>
        <tr><th>Is Charging</th><td>${
          battery.isCharging ? "Yes" : "No"
        }</td></tr>
        <tr><th>Designed Capacity</th><td>${battery.designedCapacity}</td></tr>
        <tr><th>Max Capacity</th><td>${battery.maxCapacity}</td></tr>
        <tr><th>Current Capacity</th><td>${battery.currentCapacity}</td></tr>
        <tr><th>Voltage</th><td>${battery.voltage}</td></tr>
        <tr><th>Capacity Unit</th><td>${battery.capacityUnit}</td></tr>
        <tr><th>Battery Percentage</th><td>${battery.percent}</td></tr>
        <tr><th>Time Remaining (in seconds)</th><td>${
          battery.timeRemaining
        }</td></tr>
        <tr><th>AC Connected</th><td>${
          battery.acConnected ? "Yes" : "No"
        }</td></tr>
        <tr><th>Battery Type</th><td>${battery.type}</td></tr>
        <tr><th>Model</th><td>${battery.model}</td></tr>
        <tr><th>Manufacturer</th><td>${battery.manufacturer}</td></tr>
        <tr><th>Serial Number</th><td>${battery.serial}</td></tr>

        </table>

        
          <h2>Graphics Controllers</h2>
          <table>
          ${graphics.controllers
            .map(
              (controller, idx) => `
              ${idx !== 0 ? separator() : ""}
  <tr><th>Controller Vendor</th><td>${controller.vendor}</td></tr>
  <tr><th>Controller Sub-Vendor</th><td>${controller.subVendor}</td></tr>
  <tr><th>Controller Model</th><td>${controller.model}</td></tr>
  <tr><th>Bus</th><td>${controller.bus}</td></tr>
  <tr><th>Bus Address</th><td>${controller.busAddress}</td></tr>
  <tr><th>VRAM</th><td>${controller.vram} MB</td></tr>
  <tr><th>Dynamic VRAM</th><td>${
    controller.vramDynamic ? "Yes" : "No"
  }</td></tr>
  <tr><th>PCI ID</th><td>${controller.pciID || "N/A"}</td></tr>
`
            )
            .join("")}
          </table>


          <h2>Display</h2>
          <table>
          ${graphics.displays
            .map(
              (display, idx) => `
                ${idx !== 0 ? separator() : ""}
                <tr><th>Display Vendor</th><td>${
                  display.vendor || "N/A"
                }</td></tr>
                <tr><th>Display Model</th><td>${display.model}</td></tr>
                <tr><th>Main Display</th><td>${
                  display.main ? "Yes" : "No"
                }</td></tr>
                <tr><th>Built-in Display</th><td>${
                  display.builtin ? "Yes" : "No"
                }</td></tr>
                <tr><th>Connection Type</th><td>${display.connection}</td></tr>
                <tr><th>Display Size (X)</th><td>${
                  display.sizeX || "N/A"
                }</td></tr>
                <tr><th>Display Size (Y)</th><td>${
                  display.sizeY || "N/A"
                }</td></tr>
                <tr><th>Pixel Depth</th><td>${display.pixelDepth}</td></tr>
                <tr><th>Resolution (X)</th><td>${display.resolutionX}</td></tr>
                <tr><th>Resolution (Y)</th><td>${display.resolutionY}</td></tr>
                <tr><th>Current Resolution (X)</th><td>${
                  display.currentResX
                }</td></tr>
                <tr><th>Current Resolution (Y)</th><td>${
                  display.currentResY
                }</td></tr>
                <tr><th>Position (X)</th><td>${display.positionX}</td></tr>
                <tr><th>Position (Y)</th><td>${display.positionY}</td></tr>
                <tr><th>Current Refresh Rate</th><td>${
                  display.currentRefreshRate || "N/A"
                }</td></tr>
`
            )
            .join("")}
</table>

<h2>Printer</h2>
<table>
${printer
  .map(
    (printerItem, idx) => `
       ${idx !== 0 ? separator() : ""}
  <tr><th>Printer ID</th><td>${printerItem.id}</td></tr>
  <tr><th>Printer Name</th><td>${printerItem.name}</td></tr>
  <tr><th>Printer Model</th><td>${printerItem.model}</td></tr>
  <tr><th>URI</th><td>${printerItem.uri || "N/A"}</td></tr>
  <tr><th>UUID</th><td>${printerItem.uuid || "N/A"}</td></tr>
  <tr><th>Status</th><td>${printerItem.status}</td></tr>
  <tr><th>Local</th><td>${printerItem.local ? "Yes" : "No"}</td></tr>
  <tr><th>Default</th><td>${printerItem.default ? "Yes" : "No"}</td></tr>
  <tr><th>Shared</th><td>${printerItem.shared ? "Yes" : "No"}</td></tr>
`
  )
  .join("")}
</table>

        <h2>Audio</h2>
        <table>
        ${audio
          .map(
            (audioItem, idx) => `
               ${idx !== 0 ? separator() : ""}
  <tr><th>Audio Device ID</th><td>${audioItem.id}</td></tr>
  <tr><th>Audio Device Name</th><td>${audioItem.name}</td></tr>
  <tr><th>Manufacturer</th><td>${audioItem.manufacturer}</td></tr>
  <tr><th>Revision</th><td>${audioItem.revision || "N/A"}</td></tr>
  <tr><th>Driver</th><td>${audioItem.driver || "N/A"}</td></tr>
  <tr><th>Default</th><td>${audioItem.default ? "Yes" : "No"}</td></tr>
  <tr><th>Channel</th><td>${audioItem.channel}</td></tr>
  <tr><th>Type</th><td>${audioItem.type}</td></tr>
  <tr><th>Input</th><td>${audioItem.in ? "Yes" : "No"}</td></tr>
  <tr><th>Output</th><td>${audioItem.out ? "Yes" : "No"}</td></tr>
  <tr><th>Status</th><td>${audioItem.status}</td></tr>
`
          )
          .join("")}
        </table>


        <h2>Bluetooth</h2>
        <table>
        ${bluetooth
          .map(
            (bluetoothItem, idx) => `
               ${idx !== 0 ? separator() : ""}
                <tr><th>Device</th><td>${bluetoothItem.device}</td></tr>
                <tr><th>Name</th><td>${bluetoothItem.name}</td></tr>
                <tr><th>Manufacturer</th><td>${
                  bluetoothItem.manufacturer
                }</td></tr>
                <tr><th>MAC Address (Device)</th><td>${
                  bluetoothItem.macDevice
                }</td></tr>
                <tr><th>MAC Address (Host)</th><td>${
                  bluetoothItem.macHost
                }</td></tr>
                <tr><th>Battery Percentage</th><td>${
                  bluetoothItem.batteryPercent
                }</td></tr>
                <tr><th>Type</th><td>${bluetoothItem.type}</td></tr>
                <tr><th>Connected</th><td>${
                  bluetoothItem.connected ? "Yes" : "No"
                }</td></tr>
                `
          )
          .join("")}
          </table>


    </body>
    </html>
    `;

    spinner.text = "Generating summary...";

    // Save the HTML file
    const fileName = `${cpu.brand}_system_summary.html`;
    fs.writeFileSync(fileName, htmlContent, "utf-8");
    spinner.stop();
    console.log(`System summary HTML file created as ${fileName}`);
  } catch (error) {
    console.error("Error generating system summary:", error);
  }
}

// Generate system summary
generateSystemSummary();
