var http = require('http');
var url = require('url');
var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');

// Indicates whether Arduino is ready to receive a command on serial port
var arduinoCanAcceptCommand = true;
// This is an array of commands from browser waiting their turn to be sent to Arduini
var commandsForArduino = [];
// This is the command currently being sent to the ArduinoYEs, 
var commandBeingSent = "";

// Saves messages from serial port, so they can be sent up to browser
var serialPortMsgs = "";
// Saves messages from executive, so they can be sent up to browser
var executiveMsgs = "";

// Print initiation message
console.log(new Date().toJSON() + " EXECUTIVE_TURNOUTS Version 1.2 beginning execution.");

// Construct new SerialPort object
//readline = new SerialPort.parsers.Readline();
port = new SerialPort('COM3', {baudRate: 9600}); 

// Listen for data from Arduino
// parse the raw byte stream into a line-delimited string
var parser = port.pipe(new Readline({ delimiter: '\n'}));

// NOTE: the data event returns a "chunk" object, which is either a buffer or a string.  
// In my case, it is a string
parser.on('data', (chunk) => {
    // If Arduino sends back "READY_FOR_NEXT_COMMAND", we can send any queued commands
    // First see if there are any queued commands waiting to be sent to Arduino
    // We know that any commands on the queue have already been validated, so we can just send them
    if( String(chunk).startsWith("READY_FOR_NEXT_COMMAND") ) {  // startsWith() lets me ignore EOL chars
        arduinoCanAcceptCommand = true;
        if( commandsForArduino.length > 0 ) {
            arduinoCanAcceptCommand = false;
            commandBeingSent = commandsForArduino.shift();  // Take the first item off the array of waiting commands
            port.write(commandBeingSent);
        }

        // Now see if an Executive Log message is wanted for the command we just sent (This is INFO level)
        var commandSplit = commandBeingSent.split(",");
        if( commandSplit[5] > 2 ) {
            // INFO level logging
            nowExecutive = new Date().toJSON();
            // append in case there are other messages waiting in executive Msg
            executiveMsgs += "\n" + nowExecutive + ",INFO,EXECUTIVE_TURNOUTS,Sent command to controller: '" + commandBeingSent + "'"; 
            console.log(nowExecutive + ",INFO,EXECUTIVE_TURNOUTS,Sent command to controller: '" + commandBeingSent + "'");
        
        commandBeingSent = "";
        }
    } else {    // Arduino is not ready for a new command, but has sent us a message for the log
        // Log the message returned from Arduino
        // Arduino doesn't know what time it is, so add date_time.
        // Also save the message so I can send it up to the browser when I get a request
        // Create a new Date object so serialPortMsg and console log will have the same value
        nowSerial = new Date().toJSON();
        serialPortMsgs += "\n" + nowSerial + "," + chunk; // append in case there are other messages waiting in serialPortMsg
        console.log(nowSerial + "," + chunk);   
    }
});

// Create an http server that will listen for incoming commands from browser UI
http.createServer(function (req, res) {

    // These headers permit cross-origin resource sharing (CORS)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
    };

    // Copied this from example CORS code... not sure if it is needed
    // I think this is some kind of pre-flight request
    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    // This is necessary because the browser makes a separate call here in order to get the favicon
    if (req.url == '/favicon.ico') {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    // At this point, I have a meaningful call from the browser
    // Now prepare to write a command to Arduino (unless this is a command for the Executive to handle)
    // The command is a CSV string
    var queryParsed = url.parse(req.url, true).query;
     var commandString = 
        queryParsed.bom + "," + 
        queryParsed.system + "," + 
        queryParsed.unit + "," +  
        queryParsed.command + "," +
        queryParsed.command_param + ","  +
        queryParsed.log_level + "," +
        queryParsed.eom;

    // I can only handle commands for System 0 (myself) and System 1 (turnouts)
    if( queryParsed.system < 0 || queryParsed.system > 1 ) {
        nowExecutive = new Date().toJSON();
        // append in case there are other messages waiting in executive Msg
       executiveMsgs += "\n" + nowExecutive + ",ERROR,EXECUTIVE_TURNOUTS,Command for invalid system: '" + commandString + "'"; 
       console.log(nowExecutive + ",ERROR,EXECUTIVE_TURNOUTS,Command for invalid system: '" + commandString + "'");
    }

    // If this is a command for the executive to handle, do it here
    if( queryParsed.system == 0) {
        // no errors found yet
        var cmd_hard_error = false;

        // Validate command to executive
        //
        // First check for a valid log_level, to know what to report
        // Log levels:
        // -- 1 = ERROR (always logged)
        // -- 2 = WARN
        // -- 3 = INFO
        // -- 4 = DEBUG
        if( queryParsed.log_level < 1 || queryParsed.log_level > 4 ) {
            cmd_hard_error = true;
            nowExecutive = new Date().toJSON();
            // append in case there are other messages waiting in executiveMsgs
            executiveMsgs += "\n" + nowExecutive + ",ERROR,EXECUTIVE_TURNOUTS,Invalid log level: '" + queryParsed.log_level +  
                                "' - MUST BE 1-4.  OVERRIDING TO REPORT ALL LOG LEVELS.";
            console.log(nowExecutive + ",ERROR,EXECUTIVE_TURNOUTS,Invalid log level: '" + queryParsed.log_level + 
                        "' - MUST BE 1-4.  OVERRIDING TO REPORT ALL LOG LEVELS.");
            // override log level
            queryParsed.log_level = 4;
        }
        if( queryParsed.bom != 888 ) {
            cmd_hard_error = true;
            nowExecutive = new Date().toJSON();
            // append in case there are other messages waiting in executiveMsgs
            executiveMsgs += "\n" + nowExecutive + ",ERROR,EXECUTIVE_TURNOUTS,Invalid bom: '" + queryParsed.bom +  "' - MUST BE 888";
            console.log(nowExecutive + ",ERROR,EXECUTIVE_TURNOUTS,Invalid bom: '" + queryParsed.bom + "' - MUST BE 888");
        }
        if( queryParsed.unit != 0 ) {
            cmd_hard_error = true;
            nowExecutive = new Date().toJSON();
            // append in case there are other messages waiting in executiveMsgs
            executiveMsgs += "\n" + nowExecutive + ",ERROR,EXECUTIVE_TURNOUTS,Invalid unit: '" + queryParsed.unit +  "' - MUST BE 0";
            console.log(nowExecutive + ",ERROR,EXECUTIVE_TURNOUTS,Invalid unit: '" + queryParsed.unit + "' - MUST BE 0");
        }
        if( queryParsed.command != 0 ) {
            cmd_hard_error = true;
            nowExecutive = new Date().toJSON();
            // append in case there are other messages waiting in executiveMsgs
            executiveMsgs += "\n" + nowExecutive + ",ERROR,EXECUTIVE_TURNOUTS,Invalid command: '" + queryParsed.command +  "' - MUST BE 0";
            console.log(nowExecutive + ",ERROR,EXECUTIVE_TURNOUTS,Invalid command: '" + queryParsed.command + "' - MUST BE 0");
        }
        if( queryParsed.command_param != 0 ) {
            // This is a warning-level message (log level 2)
            if( queryParsed.log_level > 1) {
                nowExecutive = new Date().toJSON();
                // append in case there are other messages waiting in executiveMsgs
                executiveMsgs += "\n" + nowExecutive + ",WARN,EXECUTIVE_TURNOUTS,Invalid command parameter: '" + queryParsed.command_param +  "' - SHOULD BE 0";
                console.log(nowExecutive + ",ERROR,EXECUTIVE_TURNOUTS,Invalid command parameter: '" + queryParsed.command_param + "' - SHOULD BE 0");
            }
        }
        if( queryParsed.eom != 999 ) {
            cmd_hard_error = true;
            nowExecutive = new Date().toJSON();
            // append in case there are other messages waiting in executiveMsgs
            executiveMsgs += "\n" + nowExecutive + ",ERROR,EXECUTIVE_TURNOUTS,Invalid eom: '" + queryParsed.bom +  "' - MUST BE 999";
            console.log(nowExecutive + ",ERROR,EXECUTIVE_TURNOUTS,Invalid eom: '" + queryParsed.bom + "' - MUST BE 999");
        }

        // At this point, the command has passed validation.  Handle it.
        if( !cmd_hard_error ) {
            if ( queryParsed.unit == 0 ) {
                // Command 0 means drain log (there are usually messages waiting in the (slow) Arduino log)
                // Just log and move on... the drain will happen automatically when we format the http response
                if ( queryParsed.command == 0 ) {
                    if( queryParsed.log_level > 2 ) {
                        // Info level logging
                        nowExecutive = new Date().toJSON();
                        executiveMsgs += "\n" + nowExecutive + ",INFO,EXECUTIVE_TURNOUTS,Received log drain request: '" + commandString + "'";
                        console.log(nowExecutive + ",INFO,EXECUTIVE_TURNOUTS,Received log drain request: '" + commandString + "'");
                    }
                }
            }
        }
    }

    // The command is not for system 0 (Executive), so send the command to Arduino
    if(queryParsed.system == 1) {

        // First we push the command onto the array of commands waiting to be sent to the Arduino
        commandsForArduino.push(commandString);  // Add this command to end of the array of waiting commands
        if( arduinoCanAcceptCommand ) {
            arduinoCanAcceptCommand = false;
            commandBeingSent = commandsForArduino.shift();  // Take first item off array of waiting commands
            port.write(commandBeingSent);

            if( queryParsed.log_level > 2 ) {
                // INFO level logging
                nowExecutive = new Date().toJSON();
                // append in case there are other messages waiting in executive Msg
                executiveMsgs += "\n" + nowExecutive + ",INFO,EXECUTIVE_TURNOUTS,Sent command to controller: '" + commandBeingSent + "'"; 
                console.log(nowExecutive + ",INFO,EXECUTIVE_TURNOUTS,Sent command to controller: '" + commandBeingSent + "'");
            }
            commandBeingSent = "";
        }
    }

    // Return to caller, passing back all available log messages
    if( queryParsed.log_level > 2 ) {
        // INFO level logging
        nowExecutive = new Date().toJSON();
         // append in case there are other messages waiting in executive Msg
        executiveMsgs += "\n" + nowExecutive + ",INFO,EXECUTIVE_TURNOUTS,Request complete."; 
        console.log(nowExecutive + ",INFO,EXECUTIVE_TURNOUTS,Request complete.");
    }

    res.writeHead(200, headers);

    // These are messages from the executive (me)
    if ( executiveMsgs.length > 0 ) {
        res.write(executiveMsgs);
        executiveMsgs = "";
    }
    // These are log messages from the Arduino
    if ( serialPortMsgs.length > 0 ) {
        res.write(serialPortMsgs);
        serialPortMsgs = "";
    }
    res.end();
    return;

}).listen(8089);   // Listen for incoming data from browser on port 8089