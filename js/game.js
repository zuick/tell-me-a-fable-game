var Game = function(){
    this.resources = [
        "configs/settings.json",
        "configs/events.json",
        "configs/items.json",
        "configs/actions.json",        
        "configs/outcomes.json"
    ];
    
    this.loadResources = function( onComplete ){
        if( typeof require === "function" && require("fs")){
            var fs = require("fs");
            
            this.settings = JSON.parse( fs.readFileSync(this.resources[0], 'utf8') );
            this.events = JSON.parse( fs.readFileSync(this.resources[1], 'utf8') );
            this.items = JSON.parse( fs.readFileSync(this.resources[2], 'utf8') ).map( function( item ){
                var splited = item.name.split(",");
                var name = splited[0].trim();
                var nameAcc = splited.length > 1 
                    ? splited[1].trim()
                    : name;

                item.name = name;
                item.nameAcc = nameAcc;                
                return item;
            });
            this.actions = JSON.parse( fs.readFileSync(this.resources[3], 'utf8') );
            this.outcomes = JSON.parse( fs.readFileSync(this.resources[4], 'utf8') );

            if( typeof( onComplete ) === "function" ) onComplete();
            
        }else{
            utils.loadResources( this.resources ).then(function( jsons ){
                this.settings = jsons[0];
                this.events = jsons[1];
                this.items = jsons[2].map( function( item ){
                    var splited = item.name.split(",");
                    var name = splited[0].trim();
                    var nameAcc = splited.length > 1 
                        ? splited[1].trim()
                        : name;

                    item.name = name;
                    item.nameAcc = nameAcc;                
                    return item;
                });
                this.actions = jsons[3];
                this.outcomes = jsons[4];

                if( typeof( onComplete ) === "function" ) onComplete();            
            }.bind(this));            
        }
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
                    .map( function( i, index ){ return _.isUndefined(i) ? "incorrect item " + index : i.name } )
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
            var prologsTable = utils.createTable();
            var actionsTable = utils.createTable();
            var itemsTable = utils.createTable();
            
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
                
            this.events
                .filter( function( e ){ return e.prolog; } )
                .forEach( function( e ){
                    prologsTable.tBodies[0].appendChild(
                        utils.createTableRow( e.id, e.description )
                    );
                }.bind(this));
                
            this.items                
                .forEach( function( e ){
                    itemsTable.tBodies[0].appendChild(
                        utils.createTableRow( e.id, e.name, e.nameAcc )
                    );
                }.bind(this));
                
            this.actions                
                .forEach( function( e ){
                    actionsTable.tBodies[0].appendChild(
                        utils.createTableRow( e.id, e.name )
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
            
            page.appendChild( utils.createHeading( "Items" ) );
            page.appendChild( itemsTable );
            page.appendChild( utils.createHeading( "Actions" ) );
            page.appendChild( actionsTable );
            page.appendChild( utils.createHeading( "Headings" ) );
            page.appendChild( headingsTable );
            page.appendChild( utils.createHeading( "Prologs" ) );
            page.appendChild( prologsTable );
            page.appendChild( utils.createHeading( "Initial events" ) );
            page.appendChild( initialsTable );
            page.appendChild( utils.createHeading( "Endings" ) );
            page.appendChild( endingsTable );
            page.appendChild( utils.createHeading( "No subjects" ) );
            page.appendChild( noSubjectsTable );
            page.appendChild( utils.createHeading( "Outcomes" ) );
            page.appendChild( outcomesTable );
            
            document.body.appendChild(page);
        }.bind(this));
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

            this.currentEvent = this.player.pullEventById( events[ index ].id );
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
        var getOptionSetting = function( item, isAcc ){                    
            return { id: item.id, caption: isAcc ? item.nameAcc : item.name };
        }
    
        var actionsScope = this.settings.randomizeActions.enable
            ? this.getRandomItems( this.player.actions, this.settings.randomizeActions.limit )
            : this.player.actions;
        
        this.selectors.appendChild( 
            utils.createSelect( 
                "subject", 
                this.player.squad
                    .map( function( i ){ return getOptionSetting(i) } )
                    .map( function( option ){
                        return { id: option.id, caption: utils.capitalize( option.caption )}; 
                    })
            )
        );
        this.selectors.appendChild( 
            utils.createSelect( 
                "action", 
                actionsScope
                    .map( function( i ){ return getOptionSetting(i) } )
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
                    .map( function( i ){ return getOptionSetting(i,true) } )
            )
        );
    }
    
    this.getTurnString = function( turn ){
        var result = "";
        result += this.getById( this.items, turn.subjectId ).name + " ";
        result += this.getById( this.actions, turn.actionId ).name + " ";
        result += this.getById( this.items, turn.objectId ).nameAcc;
        
        return utils.capitalize( result );
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
        this.addRow( this.getSpecialEvents("prolog") );
        this.popEvent( true );
    }
    
    this.endStory = function(){
        if( this.player.squad.length > 0 ){
            this.addRow( this.getSpecialEvents("ending" ) );
        }else{
            this.showCurrentEvent();
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
    
    this.applyOutcomes = function( lastTurn ){
        var passedOutcomes = this.outcomes.filter( this.checkEventOutcomeCondition.bind( this, this.lastTurn ) );        
        var concreteSubjectActionObject = passedOutcomes
            .filter( function( o ){ 
                return !_.isUndefined( o.condition.subjectIds ) && !_.isUndefined( o.condition.actionIds ) && !_.isUndefined( o.condition.objectIds )
            })
            
        var concreteSubjectObject = passedOutcomes
            .filter( function( o ){ 
                return !_.isUndefined( o.condition.subjectIds ) && !_.isUndefined( o.condition.objectIds )
            })
            
        var concreteActionObject = passedOutcomes
            .filter( function( o ){ 
                return !_.isUndefined( o.condition.actionIds ) && !_.isUndefined( o.condition.objectIds )
            });
        
        // apply by priority
        if( concreteSubjectActionObject.length > 0 ){
            concreteSubjectActionObject.forEach( this.applyOutcome.bind( this ) );
        }else if( concreteSubjectObject.length > 0 ){
            concreteSubjectObject.forEach( this.applyOutcome.bind( this ) );
        }else{
            concreteActionObject.forEach( this.applyOutcome.bind( this ) );
        }
    }
    
    this.replaceVariables = function( text, generateNext ){
        if( generateNext ) this.setCurrentVariables();
        
        if( !_.isUndefined( this.currentVariables.lastSubject ) ) text = text.replace(/%lastSubject%/g, this.currentVariables.lastSubject.name);
        if( !_.isUndefined( this.currentVariables.lastAction ) ) text = text.replace(/%lastAction%/g, this.currentVariables.lastAction.name);
        if( !_.isUndefined( this.currentVariables.lastObject ) ) text = text.replace(/%lastObject%/g, this.currentVariables.lastObject.name);
        if( !_.isUndefined( this.currentVariables.randomItem ) ) text = text.replace(/%randomItem%/g, this.currentVariables.randomItem.name);
        if( !_.isUndefined( this.currentVariables.randomPlayerSubject ) ) text = text.replace(/%randomPlayerSubject%/g, this.currentVariables.randomPlayerSubject.name);
        text = text.replace(/%playerSubjects%/g, this.player.getSquadString());
        return text;
    }
    
    this.onPlayerSubmit = function( e ){
        e.preventDefault();
        
        this.lastTurn = this.getPlayerTurn();
        this.applyOutcomes( this.lastTurn );
        this.addRow( "<b>" + this.getTurnString( this.lastTurn ) + "</b>");
		this.popEvent();

		utils.scrollIt(500000, 1200, 'easeOutQuad');
    }
    
    this.getSpecialEvents = function( category ){
        var events = this.events.filter( function( e ){ return e[category]; } );
        if( _.isUndefined( events ) || events.length <= 0 ) return "";
        return this.replaceVariables( events[ _.random( 0, events.length - 1 ) ].description, true );
    }
    
    this.setCurrentVariables = function(){
        this.currentVariables = {
            lastSubject: this.getById(this.items, this.lastTurn.subjectId ),
            lastAction: this.getById(this.actions, this.lastTurn.actionId ),
            lastObject: this.getById(this.items, this.lastTurn.objectId ),
            randomItem: this.items[_.random( 0, this.items.length - 1)],
            randomPlayerSubject: this.player.squad[_.random( 0, this.player.squad - 1)]
        }
    }
    
    this.applyEventOutcome = function(){
        if( !_.isUndefined( this.currentEvent.removeRandomSubject ) ){            
            this.player.removeHeroById( this.currentVariables.randomPlayerSubject.id );
        }
    }
    
    this.popEvent = function( firstPop ){
        var nextEventExists = this.nextEvent( firstPop );
        
        this.setCurrentVariables();
        this.applyEventOutcome();
            
        var playerHasSubjects = this.player.squad.length > 0;
        
        if( nextEventExists && playerHasSubjects ){            
            this.showCurrentEvent();
            if( _.isUndefined( this.currentEvent.objects ) ){
                this.popEvent();
            }else{
                this.updateSelectors();
                if( this.settings.autoScrollPage ) window.scrollTo(0, document.body.scrollHeight);
            }
        } else {
            this.endStory();
        }
    }
    
}
