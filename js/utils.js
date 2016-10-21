var utils = {
    createSelect: function( name, options ){
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
    },
    
    createParagraph: function( content ){
        var row = document.createElement("p");
        row.innerHTML = content;
        row.setAttribute("class", "paragraph");
        return row;
    },
    
    getChildWithName: function( element, name ){
        for( var i = 0; i < element.childNodes.length; i++) {
            if( element.childNodes[i].getAttribute("name") === name ){
                return element.childNodes[i];
            }
        }
        return void 0;
    },
    
    getSelectedOption: function( select ){
        return select.options[select.selectedIndex];
    },
    
    validateOutcome: function( outcome ){
        return outcome;
    },
    
    validateEvent: function( event ){
        return event;
    },
    
    validateItem: function( item ){
        return item;
    },
    
    validateAction: function( action ){
        return action;
    }
}

