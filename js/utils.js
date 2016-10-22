var Utils = function(){
    this.createSelect = function( name, options ){
        var select = document.createElement("select");
        select.setAttribute("name", name);
        select.setAttribute("class", "select");
        
        if( !_.isUndefined(options) ){
            options.forEach( function( item ){
                var option = document.createElement("option");
                option.setAttribute("value", item.id);
                option.textContent = item.caption;
                select.appendChild(option);
            })
        }
        return select;
    }
    
    this.createParagraph = function( content ){
        var row = document.createElement("p");
        row.innerHTML = content;
        row.setAttribute("class", "paragraph");
        return row;
    }
    
    this.createHeading = function( content ){
        var row = document.createElement("h1");
        row.innerHTML = content;
        return row;
    }
    
    this.getChildWithName = function( element, name ){
        for( var i = 0; i < element.childNodes.length; i++) {
            if( element.childNodes[i].getAttribute("name") === name ){
                return element.childNodes[i];
            }
        }
        return void 0;
    }
    
    this.getSelectedOption = function( select ){
        return select.options[select.selectedIndex];
    }
    
    this.loadJSON = function( path ){
        return new Promise( function( success, reject ){
            var xhr = new XMLHttpRequest();
            xhr.open('GET', path, true);
            xhr.send();

            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    console.log("Incorrect json path: ", path);
                } else {
                    try {
                        if( !_.isUndefined(success) ) success( JSON.parse( xhr.responseText ) );
                    } catch( e ){
                        console.log("Can't parse json: ", e);
                        reject(e);
                    }
                }
                
            }            
        })
    }
    
    this.loadResources = function( resources ){
        var promises = resources.map( this.loadJSON );
        return Promise.all( promises );
    }
}

