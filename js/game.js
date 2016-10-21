var Game = function(){
    this.init = function(){
        this.content = document.getElementById("story");
        this.playerAction = document.getElementById("playerAction");
        this.selectors = document.getElementById("selectors");
        this.restartBtn = document.getElementById("restartBtn");
        
        this.events = events.map(utils.validateEvent);
        this.items = items.map(utils.validateItem);
        this.actions = actions.map(utils.validateAction);
        this.outcomes = outcomes.map(utils.validateOutcome);
        
        this.playerAction.addEventListener("submit", this.onPlayerSubmit.bind(this));
        this.restartBtn.addEventListener("click", this.onRestart.bind(this));
        
        this.startStory();
    }
    
    this.loadEvent = function( eventId ){
        this.currentEvent = this.player.pullEventById( eventId );
    }
    
    this.nextEvent = function(){
        if( !_.isUndefined( this.nextEventId ) ){
            this.currentEvent = this.getById( this.events, this.nextEventId );
            this.nextEventId = void 0;
            return true;
        }else{
            if( this.player.events.length == 0 ) return false;

            var index = ( this.player.events.length > 1 )
                ? _.random( 0, this.player.events.length - 1 )
                : 0;

            this.loadEvent( this.player.events[ index ].id );
            return true;
        }
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
                this.currentEvent.objects
                    .map( this.getById.bind( this, this.items ) )
                    .map( this.getOptionSetting )
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
    
    this.getById = function( array, id ){ 
        return _.find( array, function( item ){ return item.id === id } );
    }

    this.showCurrentEvent = function(){
        this.addRow( this.replaceVariables( this.currentEvent.description ) );
    }
    
    this.getRandomItems = function( array, count ){
        return _.shuffle( array ).slice( 0, count );
    }
    
    this.startStory = function(){
        this.content.textContent = "";
        this.nextEventId = void 0;
        this.lastTurn = {
            subjectId: "",
            actionId: "",
            objectId: ""
        }
        
        this.player = new Player(
            this.getRandomItems( 
                this.items.filter( function( i ){ return i.initial; } ), 
                globalSettings.playerInitialSubjectsMax 
            ),
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
    
    this.checkEventOutcomeCondition = function( turn, outcome ){
        var subjectPassed =  
            _.isUndefined( outcome.condition.subjectIds ) || 
            _.indexOf( outcome.condition.subjectIds, turn.subjectId ) !== -1;
    
        var actionPassed =  
            _.isUndefined( outcome.condition.actionIds ) || 
            _.indexOf( outcome.condition.actionIds, turn.actionId ) !== -1;
    
        var objectPassed =  
            _.isUndefined( outcome.condition.objectIds ) || 
            _.indexOf( outcome.condition.objectIds, turn.objectId ) !== -1;
            
        return subjectPassed && actionPassed && objectPassed;
    }
    
    this.applyOutcome = function( outcome ){
        switch( outcome.type ){
            case "newSubject":
                this.player.addHero( this.getById( this.items, outcome.subjectId ) );
                break;
            case "removeSubject":
                this.player.removeHeroById( outcome.subjectId );
                break;
            case "nextEvent":
                this.nextEventId = outcome.eventId;
                break;
            default: break;
        }
    }
    
    this.replaceVariables = function( text ){
        var lastSubject = this.getById(this.items, this.lastTurn.subjectId );
        var lastAction = this.getById(this.actions, this.lastTurn.actionId );
        var lastObject = this.getById(this.items, this.lastTurn.objectId );
        var randomItem = this.items[_.random( 0, this.items.length - 1)];
        var randomPlayerSubject = this.player.squad[_.random( 0, this.player.squad - 1)];
        
        if( !_.isUndefined( lastSubject ) ) text = text.replace(/%lastSubject%/g, lastSubject.name);
        if( !_.isUndefined( lastAction ) ) text = text.replace(/%lastAction%/g, lastAction.name);
        if( !_.isUndefined( lastObject ) ) text = text.replace(/%lastObject%/g, lastObject.name);
        text = text.replace(/%randomItem%/g, randomItem.name);
        text = text.replace(/%randomPlayerSubject%/g, randomPlayerSubject.name);
        return text;
    }
    
    this.onPlayerSubmit = function( e ){
        e.preventDefault();
        
        this.lastTurn = this.getPlayerTurn();
                
        this.outcomes
            .filter( this.checkEventOutcomeCondition.bind( this, this.lastTurn ) )
            .forEach( this.applyOutcome.bind( this ) );            
                
        this.player.pullActionById( this.lastTurn.actionId );
        this.addRow( this.getSelectorsContent() );
        this.popEvent();
    }
    
    this.popEvent = function(){
        if( this.nextEvent() ){
            this.showCurrentEvent();
            if( _.isUndefined( this.currentEvent.objects ) ){
                this.popEvent();
            }else{
                this.updateSelectors();
            }
        } else {
            this.endStory();
        }
    }
    
}
