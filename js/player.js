var Player = function( initialSquad, initialActions, initialEvents ){
    this.squad = [];
    this.actions = [];
    this.specialEvents = [];
    this.events = [];
    
    if(!_.isUndefined(initialSquad)){
        this.squad = _.clone(initialSquad);
    }
    
    if(!_.isUndefined(initialActions)){
        this.actions = _.clone(initialActions);
    }
    
    if(!_.isUndefined(initialEvents)){
        this.events = _.clone(initialEvents);
    }
    
    this.pullEventById = function( eventId ){
        var event = _.find( this.events, function( e ){ return e.id === eventId; } );
        if( !_.isUndefined( event )){
            _.remove( this.events, function( e ){ return e.id === eventId; } );
        }
        return event;
    }
}

