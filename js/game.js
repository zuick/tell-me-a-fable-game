var Game = function(){
    this.init = function(){
        this.content = document.getElementById("story");
        this.playerAction = document.getElementById("playerAction");
        this.selectors = document.getElementById("selectors");
        this.restartBtn = document.getElementById("restartBtn");
        
        this.events = events.map(utils.validateEvent);
        this.items = items.map(utils.validateItem);
        this.actions = actions.map(utils.validateAction);
        
        this.playerAction.addEventListener("submit", this.onPlayerSubmit.bind(this));
        this.restartBtn.addEventListener("click", this.onRestart.bind(this));
        
        this.startStory();
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
        this.content.appendChild( utils.createParagraph( content ) );
    }
    
    this.updateSelectors = function(){
        while (this.selectors.firstChild) {
            this.selectors.removeChild(this.selectors.firstChild);
        }
        
        this.selectors.appendChild( 
            utils.createSelect( 
                "subject", 
                this.player.squad.map( this.getOptionSetting )
            )
        );
    
        this.selectors.appendChild( 
            utils.createSelect( 
                "action", 
                this.player.actions.map( this.getOptionSetting )
            )
        );

        this.selectors.appendChild( 
            utils.createSelect( 
                "object", 
                this.currentEvent.objects.map( this.getItemById ).map( this.getOptionSetting )
            )
        );
    }
    
    this.getSelectorsContent = function(){
        var result = "";
        for( var i = 0; i < this.selectors.childNodes.length; i++) {
            var select = this.selectors.childNodes[i];
            result += utils.getSelectedOption( select ).textContent + " ";
        }
        return result.charAt(0).toUpperCase() + result.slice(1);
    }
    
    this.getOptionSetting = function( item ){
        return { id: item.id, caption: item.name.toLowerCase() };
    }
    
    this.getItemById = function( id ){ 
        return _.find( this.items, function( item ){ return item.id === id } );
    }

    this.showCurrentEvent = function(){
        this.addRow( this.currentEvent.description );
    }
    
    this.startStory = function(){
        this.content.textContent = "";
        
        this.player = new Player(
            this.items.filter( function( i ){ return i.initial; } ),
            this.actions.filter( function( i ){ return i.initial; } ),
            this.events.filter( function( i ){ return i.initial; } )
        );

        this.popEvent();
    }
    
    this.endStory = function(){
        this.addRow( "Вот и сказочки конец." );
        this.playerAction.classList.toggle("hidden");
        this.restartBtn.classList.toggle("hidden");
    }
    
    this.onRestart = function(){
        this.playerAction.classList.toggle("hidden");
        this.restartBtn.classList.toggle("hidden");
        this.startStory();
    }
    
    this.getSelectorValue = function( name ){
        return parseInt( utils.getSelectedOption( utils.getChildWithName( this.selectors, name ) ).value )
    }
    
    this.getPlayerTurn = function(){
        return {
            subjectId: this.getSelectorValue( "subject" ),
            actionId: this.getSelectorValue( "action" ),
            objectId: this.getSelectorValue( "object" )
        }
    }
    
    this.onPlayerSubmit = function( e ){
        e.preventDefault();
        
        var turn = this.getPlayerTurn();
        this.player.pullActionById( turn.actionId );
        this.addRow( this.getSelectorsContent() );
        this.popEvent();
    }
    
    this.popEvent = function(){
        if( this.nextEvent() ){
            this.updateSelectors();
            this.showCurrentEvent();
        } else {
            this.endStory();
        }
    }
    
}
