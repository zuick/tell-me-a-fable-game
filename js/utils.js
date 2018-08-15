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
    
    this.clearElement = function( element ){
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    
    this.createTable = function(){
        var table = document.createElement("table");
        var tbody = document.createElement("tbody");
        table.appendChild(tbody);
        return table;
    }
    
    this.createTableRow = function(){
        var row = document.createElement("tr");
        for( var i = 0; i < arguments.length; i++ ){
            var column = document.createElement("td");
            column.textContent = arguments[i];
            row.appendChild(column);            
        }

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
	
	this.scrollIt = function(destination, duration, easing, callback) {
		duration = duration || 200;
		easing = easing || 'linear';

		const easings = {
		  linear(t) {
			return t;
		  },
		  easeInQuad(t) {
			return t * t;
		  },
		  easeOutQuad(t) {
			return t * (2 - t);
		  },
		  easeInOutQuad(t) {
			return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
		  },
		  easeInCubic(t) {
			return t * t * t;
		  },
		  easeOutCubic(t) {
			return (--t) * t * t + 1;
		  },
		  easeInOutCubic(t) {
			return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
		  },
		  easeInQuart(t) {
			return t * t * t * t;
		  },
		  easeOutQuart(t) {
			return 1 - (--t) * t * t * t;
		  },
		  easeInOutQuart(t) {
			return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
		  },
		  easeInQuint(t) {
			return t * t * t * t * t;
		  },
		  easeOutQuint(t) {
			return 1 + (--t) * t * t * t * t;
		  },
		  easeInOutQuint(t) {
			return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
		  }
		};
	  
		const start = window.pageYOffset;
		const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
	  
		const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
		const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
		const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
		const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
	  
		if ('requestAnimationFrame' in window === false) {
		  window.scroll(0, destinationOffsetToScroll);
		  if (callback) {
			callback();
		  }
		  return;
		}
	  
		function scroll() {
		  const now = 'now' in window.performance ? performance.now() : new Date().getTime();
		  const time = Math.min(1, ((now - startTime) / duration));
		  const timeFunction = easings[easing](time);
		  window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
	  
		  if (window.pageYOffset === destinationOffsetToScroll) {
			if (callback) {
			  callback();
			}
			return;
		  }
	  
		  requestAnimationFrame(scroll);
		}
	  
		scroll();
	  }
}

