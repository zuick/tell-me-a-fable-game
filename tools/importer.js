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

var objects = [];
switch( type ){
    case "events": 
        objects = csv
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
        objects = csv
            .split("\r\n")
            .map( function( row, index ){
                return {
                    id: index + 1,
                    name: row.trim(),
                    initial: false
                }
            } );
        break;
    case "outcomes":
        objects = csv
            .split("\r\n")
            .map( function( row, index ){
                var h = row.split("|")[0];
                var c = row.split("|")[1].split(",").map( function( i ){ return i.trim() } );
        
                var type = h.split(",")[0].trim();
                var oid = parseInt(h.split(",")[1].trim());
                
                var out = {
                    type: type,
                    condition: {
                        subjectIds: parseInt(c[0]) !== -1 ? [parseInt(c[0])] : void 0,
                        actionIds: parseInt(c[1]) !== -1 ? [parseInt(c[1])] : void 0,
                        objectIds: parseInt(c[2]) !== -1 ? [parseInt(c[2])] : void 0
                    }
                };
                
                switch( type ){
                    case "newSubject":
                        out.subjectId = oid;
                        break;
                    case "removeLastSubject": 
                        
                        break;
                    case "removeSubject":
                        out.subjectId = oid;
                        break;
                    case "nextEvent":
                        out.eventId = oid;
                        break;
                    default: break;
                }
                
                return out;
            } );
        break;
    default: break;
}

try{
    fs.writeFileSync( target, JSON.stringify( objects, null, '    ' ));
}catch(e){
    console.error(e);
}