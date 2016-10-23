var Utils = function(){
    this.createSelect = function( name, options ){
        var select = document.createElement("div");        
        select.setAttribute("class", "radio-select");
        select.setAttribute("name", name);
        
        if( !_.isUndefined(options) ){
            options.forEach( function( item, index ){
                var id = name + item.id;
                
                var option = document.createElement("input");
                if( index === 0 ) option.setAttribute("checked", "checked");
                option.setAttribute("value", item.id);
                option.setAttribute("class", "radio-option");
                option.setAttribute("id", id);
                option.setAttribute("name", name);
                option.setAttribute("type", "radio");
                select.appendChild(option);
                
                var label = document.createElement("label");
                label.setAttribute("for", id);                
                label.textContent = item.caption;
                select.appendChild(label);                
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
        row.setAttribute("class", "heading");
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
        for( var i = 0; i < select.childNodes.length; i++) {
            if( select.childNodes[i].checked ){
                return select.childNodes[i];
            }
        }
        return {};
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
    
    this.capitalize = function( string ){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }        
    
    this.capitalizeParagraph = function( string ){
        return string
            .split(".")
            .map( function( s ){ return this.capitalize(s.trim()) }.bind(this) )
            .join(". ");
    }
}

