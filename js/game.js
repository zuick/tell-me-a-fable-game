var Game = function(){
    this.resources = [
        "configs/settings.json",
        "configs/events.json",
        "configs/items.json",
        "configs/actions.json",        
        "configs/outcomes.json"
    ];
    
    this.loadResources = function( onComplete ){
        utils.loadResources( this.resources ).then(function( jsons ){
            this.settings = jsons[0];
            this.events = jsons[1];
            this.items = jsons[2];
            this.actions = jsons[3];
            this.outcomes = jsons[4];
            
            if( typeof( onComplete ) === "function" ) onComplete();            
        }.bind(this));
    }
    
    this.init = function(){        
        this.content = document.getElementById("story");
        this.playerAction = document.getElementById("playerAction");
        this.selectors = document.getElementById("selectors");
        this.restartBtn = document.getElementById("restartBtn");
        
        this.playerAction.addEventListener("submit", this.onPlayerSubmit.bind(this));
        this.restartBtn.addEventListener("click", this.onRestart.bind(this));
        
        this.loadResources( this.startStory.bind(this) );
    }
    
    
    this.debug = function(){
        var getConditionStr = function( outcomes, array, category ){
            if( !_.isUndefined( outcomes.condition[category] ) ){
                var a = this.getByIds( array, outcomes.condition[category] );
                
                return this.getByIds( array, outcomes.condition[category] )
                    .map( function( i ){ return i.name } )
                    .join(", ")
            }
            return false;
        }.bind(this)
        
        this.loadResources( function(){
            var page = document.getElementById("page");
            utils.clearElement(page);
            page.setAttribute("class", "debug-page");
            
            var outcomesTable = utils.createTable();
            var headingsTable = utils.createTable();
            var initialsTable = utils.createTable();
            var noSubjectsTable = utils.createTable();
            var endingsTable = utils.createTable();

            this.events
                .filter( function( e ){ return e.heading; } )
                .forEach( function( e ){
                    headingsTable.tBodies[0].appendChild( 
                        utils.createTableRow( e.id, e.description )
                    );
                }.bind(this));
                
            this.events
                .filter( function( e ){ return e.initial; } )
                .forEach( function( e ){
                    initialsTable.tBodies[0].appendChild(
                        utils.createTableRow( e.id, e.description )
                    );
                }.bind(this));
                
            this.events
                .filter( function( e ){ return e.ending; } )
                .forEach( function( e ){
                    endingsTable.tBodies[0].appendChild(
                        utils.createTableRow( e.id, e.description )
                    );
                }.bind(this));
                
            this.events
                .filter( function( e ){ return e.noSubjects; } )
                .forEach( function( e ){
                    noSubjectsTable.tBodies[0].appendChild(
                        utils.createTableRow( e.id, e.description )
                    );
                }.bind(this));
            
            this.outcomes.forEach( function( outcome ){
                var conditions = [];
                
                var subject = getConditionStr(outcome, this.items, "subjectIds");
                var action = getConditionStr(outcome, this.actions, "actionIds");
                var object = getConditionStr(outcome, this.items, "objectIds");
                
                if( subject ) conditions.push( subject );
                if( action ) conditions.push( action );
                if( object ) conditions.push( object );
                
                var result = "";
                switch( outcome.type ){
                    case "newSubject":
                        result = "new subject: " + this.getById( this.items, outcome.subjectId ).name;
                        break;
                    case "removeLastSubject": 
                        result = "remove last subject"
                        break;
                    case "removeSubject":
                        result = "remove subject: " + this.getById( this.items, outcome.subjectId ).name;
                        break;
                    case "nextEvent":
                        result = this.getById( this.events, outcome.eventId ).description.slice(0,1000);
                        break;
                    default: break;
                }
                
                
                outcomesTable.tBodies[0].appendChild( 
                    utils.createTableRow( conditions.join(" - "), result )
                );
                
            }.bind(this));
            
            page.appendChild( utils.createHeading( "Headings" ) );
            page.appendChild( headingsTable );
            page.appendChild( utils.createHeading( "Endings" ) );
            page.appendChild( endingsTable );
            page.appendChild( utils.createHeading( "No subjects" ) );
            page.appendChild( noSubjectsTable );
            page.appendChild( utils.createHeading( "Initial events" ) );
            page.appendChild( initialsTable );
            page.appendChild( utils.createHeading( "Outcomes" ) );
            page.appendChild( outcomesTable );
            
            document.body.appendChild(page);
        }.bind(this));
    }
    
    this.loadEvent = function( eventId ){
        this.currentEvent = this.player.pullEventById( eventId );        
    }
    
    this.nextEvent = function( firstPop ){
        if( !_.isUndefined( this.currentEvent ) && !_.isUndefined( this.currentEvent.nextEventId ) ){
            this.currentEvent = this.getById( this.events, this.currentEvent.nextEventId );
            this.nextEventId = void 0;
            return true;
        } else if( !_.isUndefined( this.nextEventId ) ){
            this.currentEvent = this.getById( this.events, this.nextEventId );
            this.nextEventId = void 0;
            return true;
        }else{
            // if first event, filter for dependency free events
            var events = ( firstPop )            
                ? this.player.events.filter( 
                        function( e ){ 
                            return !/%last/g.test(e.description);
                        }
                    )
                : this.player.events;
                
            if( events.length == 0 ) return false;

            var index = ( events.length > 1 )
                ? _.random( 0, events.length - 1 )
                : 0;

            this.loadEvent( events[ index ].id );
            return true;
        }
    }
    
    this.addRow = function( content ){
        this.content.appendChild( utils.createParagraph( content ) );
    }
    
    this.addHeading = function( content ){
        this.content.appendChild( utils.createHeading( content ) );
    }
    
    this.updateSelectors = function(){        
        utils.clearElement(this.selectors);
        
        var actionsScope = this.settings.randomizeActions.enable
            ? this.getRandomItems( this.player.actions, this.settings.randomizeActions.limit )
            : this.player.actions;
        
        this.selectors.appendChild( 
            utils.createSelect( 
                "subject", 
                this.player.squad
                    .map( this.getOptionSetting )
                    .map( function( option ){
                        return { id: option.id, caption: utils.capitalize( option.caption )}; 
                    })
            )
        );
        this.selectors.appendChild( 
            utils.createSelect( 
                "action", 
                actionsScope
                    .map( this.getOptionSetting )
                    .map( function( option ){
                        return { id: option.id, caption: option.caption.toLowerCase() }; 
                    })
                        
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
    
    this.getTurnString = function( turn ){
        var result = "";
        result += this.getById( this.items, turn.subjectId ).name + " ";
        result += this.getById( this.actions, turn.actionId ).name + " ";
        result += this.getById( this.items, turn.objectId ).name;
        
        return utils.capitalize( result );
    }
    
    this.getOptionSetting = function( item ){
        return { id: item.id, caption: item.name };
    }
    
    this.getById = function( array, id ){ 
        return _.find( array, function( item ){ return item.id === id } );
    }
    
    this.getByIds = function( array, ids ){
        return ids.map( function( id ){ return this.getById( array, id ) }.bind(this) );
    }

    this.showCurrentEvent = function(){
        this.addRow( 
            utils.capitalizeParagraph( 
                this.replaceVariables( 
                    this.currentEvent.description 
                )
            ) 
        );
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
                this.settings.playerInitialSubjectsMax 
            ),
            this.actions.filter( function( i ){ return i.initial; } ),
            this.events.filter( function( i ){ return i.initial; } )
        );
        
        this.addHeading( this.getSpecialEvents("heading") );
        this.popEvent( true );
    }
    
    this.endStory = function(){
        if( this.player.squad.length > 0 ){
            this.addRow( this.getSpecialEvents("ending" ) );
        }else{
            this.addRow( this.getSpecialEvents("noSubjects" ) );
        }
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
            case "removeLastSubject": 
                this.player.removeHeroById( this.lastTurn.subjectId );
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
        if( !_.isUndefined( randomItem ) ) text = text.replace(/%randomItem%/g, randomItem.name);
        if( !_.isUndefined( randomPlayerSubject ) ) text = text.replace(/%randomPlayerSubject%/g, randomPlayerSubject.name);
        text = text.replace(/%playerSubjects%/g, this.player.getSquadString());
        return text;
    }
    
    this.onPlayerSubmit = function( e ){
        e.preventDefault();
        
        this.lastTurn = this.getPlayerTurn();
                
        this.outcomes
            .filter( this.checkEventOutcomeCondition.bind( this, this.lastTurn ) )
            .forEach( this.applyOutcome.bind( this ) );            
                        
        this.addRow( "<b>" + this.getTurnString( this.lastTurn ) + "</b>");
        this.popEvent();
    }
    
    this.getSpecialEvents = function( category ){
        var headings = this.events.filter( function( e ){ return e[category]; } );
        if( _.isUndefined( headings ) ) return "";
        return this.replaceVariables( headings[ _.random( 0, headings.length - 1 ) ].description );
    }
    
    this.popEvent = function( firstPop ){
        if( this.nextEvent( firstPop ) && this.player.squad.length > 0 ){
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
