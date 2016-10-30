var fs = require("fs");

var file = process.argv[2];
var target = process.argv[3];
var type = process.argv[4];

var csv = "";

function getPosition(str, m, i) {
   return str.split(m, i).join(m).length;
}

try{
    csv = fs.readFileSync(file, 'utf8');
}catch(e){
    console.error(e);
}

var events = [];
switch( type ){
    case "events": 
        events = csv
            .split("\r\n")
            .map( function( row, index ){
                return {
                    id: index + 1,
                    description: row.replace(/^\"|\"$/g, "").trim(),
                    initial: false,
                    heading: false,
                    ending: false,
                    prolog: false,
                    noSubjects: false
                }
            } );
        break;
    case "items": 
        events = csv
            .split("\r\n")
            .map( function( row, index ){
                return {
                    id: index + 1,
                    name: row.trim(),
                    initial: false
                }
            } );
        break;
    default: break;
}

try{
    fs.writeFileSync( target, JSON.stringify( events, null, '    ' ));
}catch(e){
    console.error(e);
}