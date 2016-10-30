var fs = require("fs");
var JSONH = require('json-human-buffer');

var file = process.argv[2];
var target = process.argv[3];
var csv = "";

function getPosition(str, m, i) {
   return str.split(m, i).join(m).length;
}

try{
    csv = fs.readFileSync(file, 'utf8');
}catch(e){
    console.error(e);
}

var events = csv
    .split("\r\n")
    .map( function( row, index ){        
        return {
            id: index,
            description: row.replace(/^\"|\"$/g, "").trim()
        }
    } );

try{
    fs.writeFileSync( target, JSONH.stringify( events, null, 2 ));
}catch(e){
    console.error(e);
}