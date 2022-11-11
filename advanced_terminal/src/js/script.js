var port,
  textEncoder,
  writableStreamClosed,
  writer,
  historyIndex = -1;
const lineHistory = [];
var termPrompt = localStorage.prompt;
//const textDecoder = new TextDecoderStream();
//var readableStreamClosed, reader;
var version = "v0.1.0";


var neofetch_data = `@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(@@\/(@@@&#@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/@@@@@@\/@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/@@@@@@#\/@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@(@@@@@@@@@(@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(\/@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@\/@@@@@@\/@@\/@\/(@%\/@\/@@\/@@@@@\/@@\/@@\/@@@@@@@(@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@#@@\/#@@&@@@@\/@@#&%\/&\/@@@@\/@@@\/%(((@%@@@@@@@@@@@@@#@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@\/&\/\/&\/\/@@@@&@@@@@@\/@@(\/\/&\/@@@@\/@@@%@&(@@(@@@@#@@@@%\/@@@@@@@@@@@@@@@\r\n@@@#\/%@@@@@@@@@#@@%(@\/@@@@@@#@@@\/@\/@@@\/%@(\/&#@@@@@\/@@@\/%#@@@&\/\/\/\/\/@@\/\/@@@@@@@@@@\r\n@@@@@@@@#\/\/\/\/\/&\/@@\/@@@\/@@\/@@@\/@@@\/(@@@@\/@@@@@@\/#\/\/\/\/@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@\r\n@@@@@@@@@@\/\/\/@@(\/\/\/\/\/\/\/\/\/\/\/(\/#\/\/\/\/\/\/\/\/\/\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@\r\n@@@@@@@@@@@@\/\/%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/%@@@@@@@@@@@@\r\n@@@@@@@@@@@@@#\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@\/\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(\/@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@\/\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(\/\/@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@\/\/\/\/\/\/\/\/\/\/@@@@@@@@@@@@@@@@@@@(\/\/&@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@@@@@@@@\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\/\/\/\/\/\/\/\/\/(%@@@@@@@@@\/\/@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@%@@&%@#%#&%@&%@@#@@@@(((@%@&&####@#@(#@@%@@#@@@@@@@@@@@@@@\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`;
var contributors = [
  `                      _                     _ \r\n                     (_)                   | |\r\n  _ __ ___  _ __ ___  _ ___  ___ ___   ___ | |\r\n | \'_ \` _ \\| \'_ \` _ \\| \/ __|\/ __\/ _ \\ \/ _ \\| |\r\n | | | | | | | | | | | \\__ \\ (_| (_) | (_) | |\r\n |_| |_| |_|_| |_| |_|_|___\/\\___\\___\/ \\___\/|_|\r\n                                             `,
  `  ______                  _______ _    _ ______ _                \r\n |___  \/                 |__   __| |  | |  ____| |               \r\n    \/ \/ __ _ _ __  _____   _| |  | |__| | |__  | |__   __ _ _ __ \r\n   \/ \/ \/ _\` | \'_ \\|_  \/ | | | |  |  __  |  __| | \'_ \\ \/ _\` | \'__|\r\n  \/ \/_| (_| | | | |\/ \/| |_| | |  | |  | | |____| |_) | (_| | |   \r\n \/_____\\__,_|_| |_\/___|\\__, |_|  |_|  |_|______|_.__\/ \\__,_|_|   \r\n                        __\/ |                                    \r\n                       |___\/                                    `
];

//var entries = [];
//var currPos = 0;
//var pos = 0;

var curr_line = "";

const terminal = new Terminal({
  theme: {
    background: "#202225",
    cursor: "#ffffff",
    selection: "#ffffff"
  },
  cursorBlink: true,
  cursorStyle: "underline",
  disableStdin: false,
  fontFamily: "monospace",
  fontSize: 14,
  fontWeight: "normal",
  fontWeightBold: "bold",
  renderType: "canvas"
});
terminal.open(document.getElementById("terminal"));
terminal.prompt = () => {
  if (localStorage.prompt > 0) {
    terminal.write(`\r\n\x1B[1;3;32m${termPrompt}\x1B[0m`);
  } else {
    terminal.write("\r\n\x1B[0;3;34m $ \x1B[0m ");
  }
};
terminal.writeln("Welcome to the Advanced Browser-based Cereal Terminal.");
terminal.prompt();
terminal.onKey((e) => {
  console.log(e.key);
  const code = e.key.charCodeAt(0);
  const printable =
    !e.key.altKey && !e.key.altGraphKey && !e.key.ctrlKey && !e.key.metaKey;
  printToConsole(e.key, "36", false);
  if (code == 127) {
    //Backspace
    terminal.write("\b \b");
  }
  // enter
  if (code == 13) {
    if (curr_line.length > 0) {
      lineHistory.push(curr_line);
      historyIndex = lineHistory.length;
      terminalCommands(curr_line);
      terminal.prompt();
      console.log(curr_line);
    } else {
      terminal.clear();
      terminal.prompt();
    }
    curr_line = "";
  } else if (code == 8) {
    // Do not delete the prompt
    if (terminal.prompt() > 2) {
      curr_line = curr_line.slice(0, -1);
      terminal.write("\b \b");
    }
  } else if (printable) {
    curr_line += e.key;
  }
});
terminal.attachCustomKeyEventHandler((arg) => {
  if (arg.ctrlKey && arg.code === "KeyV" && arg.type === "keydown") {
    navigator.clipboard.readText().then((text) => {
      printToConsole(text);
    });
  }
  return true;
});
terminal.attachCustomKeyEventHandler((arg) => {
  if (arg.ctrlKey && arg.code === "KeyC" && arg.type === "keydown") {
    const selection = terminal.getSelection();
    if (selection) {
      copyText(selection);
      return false;
    }
  }
  return true;
});

async function connectSerial() {
  try {
    if ("serial" in navigator) {
      let portSettings = {};

      portSettings.flowControl = "none";
      portSettings.rtsCts = true;
      portSettings.dtrDsr = true;
      portSettings.dataBits = "0";
      portSettings.stopBits = "0";
      portSettings.parity = "none";
      portSettings.bufferSize = "0";

      // The Web Serial API is supported.
      // Prompt user to select any serial port.
      if (Object.keys(portSettings).length > 0) {
        port = await port.open({
          baudRate: document.getElementById("baud").value,
          portSettings
        });
      } else {
        port = await navigator.serial.requestPort();
        // await port.open({ baudRate: document.getElementById("baud").value });
        await port.open({ baudRate: 115200 });
        let settings = {};

        if (localStorage.dtrOn == "true") settings.dataTerminalReady = true;
        if (localStorage.rtsOn == "true") settings.requestToSend = true;
        if (Object.keys(settings).length > 0) {
          await port.setSignals(settings);
          const signals = await port.getSignals();
          console.log(`Clear To Send:       ${signals.clearToSend}`);
          console.log(`Data Carrier Detect: ${signals.dataCarrierDetect}`);
          console.log(`Data Set Ready:      ${signals.dataSetReady}`);
          console.log(`Ring Indicator:      ${signals.ringIndicator}`);
        }
        textEncoder = new TextEncoderStream();
        writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
        writer = textEncoder.writable.getWriter();
        await listenToPort();
        // readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        // reader = textDecoder.readable.getReader();
      }
    } else {
      // The Web Serial API is not supported.
      if (
        window.confirm(
          "The Web Serial API is not supported by your browser. Please use a better one. Do you want to continue?"
        )
      )
        window.open("https://www.google.com/chrome/", "_blank");
    }
  } catch (e) {
    alert("Serial Connection Failed" + e);
  }
}
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
    }
  });
}
async function terminalCommands(curr_line) {
  if (localStorage.serialOnlyState == "true") {
    sendCMD(curr_line);
  } else {
    try {
      if (curr_line.trim().startsWith("/clear")) {
        if (document.getElementById("echoOn").checked == true) terminal.clear();
      }
      if (
        curr_line.trim().startsWith("/help") ||
        curr_line.trim().startsWith("?")
      ) {
        await showHelp();
      }
      if (curr_line.trim().startsWith("/contributors")) {
        terminal.writeln("");
        terminal.writeln("");
        printToConsoleln(contributors, "33", true);
      }
      if (curr_line.trim().startsWith("/version")) {
        terminal.writeln("");
        terminal.writeln("");
        await showVersion();
      }
      if (curr_line.trim().startsWith("/refresh")) {
        terminal.writeln("Exiting...");
        terminal.prompt();
        terminal.writeln("Exited.");
        terminal.prompt();
        terminal.writeln("");
        terminal.clear();
        window.location.reload();
      }
      if (curr_line.trim().startsWith("/connect")) {
        await connectSerial();
      }
      if (curr_line.trim().startsWith("/send")) {
        sendCMD(curr_line);
      }
      if (curr_line.trim().startsWith("/sendline")) {
        sendCMD(curr_line, true);
      }
      if (curr_line.trim().startsWith("/sendfile")) {
        sendFile();
      }
      if (curr_line.trim().startsWith("/neofetch")) {
        terminal.writeln("");
        terminal.writeln("");
        printToConsoleln(neofetch_data, 32, false);
      }
      if (curr_line.trim().startsWith("/prompt")) {
        setPrompt(curr_line);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
function showVersion() {
  printToConsoleln(version, "32", false);
}
function showHelp() {
  terminal.writeln("");
  terminal.writeln("");
  printToConsole("/help - ", "32", false);
  printToConsoleln("Show this help, you can also use `?`", "36", false);
  printToConsole("/clear - ", "32", false);
  printToConsoleln("Clear the terminal", "36", false);
  printToConsole("/contributors - ", "32", false);
  printToConsoleln("Show the contributors", "36", false);
  printToConsole("/version - ", "32", false);
  printToConsoleln("Show the version", "36", false);
  printToConsole("/refresh - ", "32", false);
  printToConsoleln("Refresh the page", "36", false);
  printToConsole("/connect - ", "32", false);
  printToConsoleln("Connect to a serial port", "36", false);
  printToConsole("/send - ", "32", false);
  printToConsoleln("Send data to the serial port", "36", false);
  printToConsole("/sendline - ", "32", false);
  printToConsoleln(
    "Send data to the serial port and add a new line",
    "36",
    false
  );
  printToConsole("/sendfile - ", "32", false);
  printToConsoleln("Send a file to the serial port", "36", false);
  printToConsole("/neofetch - ", "32", false);
  printToConsoleln("Show the neofetch data", "36", false);
}
async function sendCharacterNumber() {
  document.getElementById("lineToSend").value = String.fromCharCode(
    document.getElementById("lineToSend").value
  );
}
async function sendSerialLine(str) {
  // dataToSend = document.getElementById("lineToSend").value;
  dataToSend = str;
  lineHistory.unshift(dataToSend);
  historyIndex = -1; // No history entry selected
  // if (document.getElementById("carriageReturn").checked == true)
  dataToSend = dataToSend + "\r";
  // if (document.getElementById("addLine").checked == true)
  dataToSend = dataToSend + "\n";
  // if (document.getElementById("echoOn").checked == true)
  if (dataToSend.trim().startsWith("/clear")) terminal.clear();
  else printToConsole(dataToSend, "36", false);
  if (dataToSend.trim().startsWith("/clear")) terminal.clear();
  if (dataToSend.trim().startsWith("/neofetch"))
    printToConsoleln(neofetch_data, 32, false);
  if (dataToSend.trim().startsWith("/contributors"))
    printToConsoleln(contributors, "33", true);
  if (dataToSend.trim().startsWith("/version")) showVersion();
  if (dataToSend.trim().startsWith("/refresh")) window.location.reload();
  if (dataToSend.trim().startsWith("/connect")) await connectSerial();
  if (dataToSend.trim().startsWith("/send")) sendCMD(dataToSend);
  if (dataToSend.trim().startsWith("/sendline")) sendCMD(dataToSend, true);
  if (dataToSend.trim().startsWith("/sendfile")) sendFile(dataToSend);
  if (dataToSend.trim().startsWith("/prompt")) setPrompt(dataToSend);
  if (dataToSend.trim().startsWith("/help")) showHelp();
  if (dataToSend.trim().startsWith("/")) {
    printToConsoleln("Unknown command", "31", false);
  }
  if (dataToSend.trim().startsWith("\x03")) echo(false);
  if (port) {
    await writer.write(dataToSend);
  }
  document.getElementById("lineToSend").value = "";
}
function setPrompt(data) {
  let data_split = data.split(" ");
  if (data_split.length > 1) {
    let str = data_split[1];
    str = str.substring(0);
    for (let i = 2; i < data_split.length; i++) {
      str += " " + data_split[i];
    }
    localStorage.setItem("prompt", str);
    window.location.reload();
  }
}
function sendFile(data) {
  let data_split = data.split(" ");
  if (data_split.length > 1) {
    let str = data_split[1];
    str = str.substring(0);
    for (let i = 2; i < data_split.length; i++) {
      str += " " + data_split[i];
    }
    let file = new File([str], str, { type: "text/plain" });
    let reader = new FileReader();
    reader.onload = function () {
      if (port) {
        writer.write(reader.result);
      }
    };
    reader.readAsText(file);
  }
}
function sendCMD(data, newLine = false) {
  let data_split = data.split(" ");
  if (data_split.length > 1) {
    let str = data_split[1];
    str = str.substring(0);
    for (let i = 2; i < data_split.length; i++) {
      str += " " + data_split[i];
    }
    if (newLine) {
      str += "\n";
    }
    if (port) {
      writer.write(str);
    }
  }
}
function printToConsoleln(data, color, array) {
  if (array == true) {
    for (var i = 0; i < data.length; i++) {
      terminal.writeln(`\x1B[0;3;${color}m${data[i]}\x1B[0m`);
    }
  } else {
    terminal.writeln(`\x1B[0;3;${color}m${data}\x1B[0m`);
  }
}
function printToConsole(data, color, array) {
  if (array == true) {
    for (var i = 0; i < data.length; i++) {
      terminal.write(`\x1B[0;3;${color}m${data[i]}\x1B[0m`);
    }
  } else {
    terminal.write(`\x1B[0;3;${color}m${data}\x1B[0m`);
  }
}

/*function readFromPort() {
  if(port.readable) {    
    const { value, done } = reader.read();
    if (value) {
      //log.textContent += value + "\n";
    }
    if (done) {
      reader.releaseLock();
      // Allow the serial port to be closed later.
      console.log("[readLoop] DONE", done);
      
    }
    return value;    
  }
      
}*/
async function listenToPort() {
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();
  while (port.readable) {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (value) {
          //log.textContent += value + "\n";
        }
        if (done) {
          // Allow the serial port to be closed later.
          console.log("[readLoop] DONE", done);
          reader.releaseLock();
          break;
        }
        // value is a string.

        printToConsole(value, 36, false);
        htmlReadFromPort(value);
      }
    } catch (error) {
      //! TODO: Handle non-fatal read error.
      console.log("[readLoop] ERROR", error);
    }
  }
}
async function appendToAdvancedTerminal(newStuff) {
  terminal.write(newStuff);
}
async function advancedTerminalClear() {
  terminal.clear();
  terminal.prompt();
}
function scrollHistory(direction) {
  historyIndex = Math.max(
    Math.min(historyIndex + direction, lineHistory.length - 1),
    -1
  );
  if (historyIndex >= 0) {
    document.getElementById("lineToSend").value = lineHistory[historyIndex];
    appendToAdvancedTerminal(lineHistory[historyIndex]);
  } else {
    document.getElementById("lineToSend").value = "";
    terminal.clear();
  }
}

async function forgetPort() {
  if (port) {
    if ("serial" in navigator && "forget" in SerialPort.prototype) {
      // forget() is supported.
      if (localStorage.forgetDevice == "true") {
        await port.forget();
        console.log("Forgot device");
        alert("Device forgotten\nForget Deactivated");
        localStorage.forgetDevice = "false";
      }
    } else {
      // forget() is not supported.
      alert(
        "Your browser does not support the SerialPort API. Please upgrade to a newer browser."
      );
    }
  } else {
    if (localStorage.forgetDevice == "true") {
      alert("No device connected, cannot forget\nForget Deactivated");
      localStorage.forgetDevice = "false";
    }
  }
}


window.onload = async function () {
  await forgetPort();
};
