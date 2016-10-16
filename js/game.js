var Game = function(){
    this.init = function(){
        this.content = document.getElementById("story");
        this.playerAction = document.getElementById("playerAction");
        
        this.events = events.map(this.validateEvent);
        this.items = items.map(this.validateItem);
        this.actions = actions.map(this.validateAction);
        
        this.playerAction.addEventListener("submit", this.onPlayerSubmit.bind(this));
        
        this.player = new Player(
            this.items.filter( function( i ){ return i.initial; } ),
            this.actions.filter( function( i ){ return i.initial; } ),
            this.events.filter( function( i ){ return i.initial; } )
        );

        console.log(this.player);
    }
    
    this.validateEvent = function( event ){
        return event;
    }
    
    this.validateItem = function( item ){
        return item;
    }
    
    this.validateAction = function( action ){
        return action;
    }
    
    this.checkSolution = function(){
        return true;
    }
    
    this.loadEvent = function( eventId ){
        this.currentEvent = this.player.pullEventById( eventId );
    }
    
    this.nextEvent = function(){
        if( this.player.events.length == 0 ) return false;
        
        var index = ( this.player.events.length > 1 )
            ? _.random( 0, this.player.events.length - 1 )
            : 0;
            
        this.loadEvent( this.player.events[ index ].id );
        return true;
    }
    
    this.addRow = function( content ){
        var row = document.createElement("div");
        row.textContent = content;
        this.content.appendChild( row );
    }
    
    this.showCurrentEvent = function(){
        this.addRow( this.currentEvent.description );
    }
    
    this.endOfStory = function(){
        this.addRow( "События закончились" );
    }
    
    this.onPlayerSubmit = function( e ){
        e.preventDefault();
        
        this.checkSolution();
        if( this.nextEvent() ){
            this.showCurrentEvent();
        } else {
            this.endOfStory();
        }
    }
    
}
