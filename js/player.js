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
    
    this.pullById = function( array, id ){
        var event = _.find( array, function( e ){ return e.id === id; } );
        if( !_.isUndefined( event )){
            _.remove( array, function( e ){ return e.id === id; } );
        }
        return event;
    }
    
    this.pullEventById = this.pullById.bind(this, this.events);
    this.pullActionById = this.pullById.bind(this, this.actions);
    
    this.addHero = function( item ){
        if( _.isUndefined( item ) ) return;
        this.squad.push( item );
    }
    
    this.removeHeroById = function( itemId ){
        _.remove(this.squad, function( item ){ return item.id === itemId });
    }
}

