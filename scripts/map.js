var Map = function(game, group, mapName) {
  var map = game.add.tilemap(mapName);
  map.addTilesetImage('Tiles', 'tiles');
  var layerBack = map.createLayer('Background');
  layerBack.scale = {x:2, y:2};
  group.add(layerBack);
  
  this.walls = map.createLayer('Walls');
  this.walls.scale = {x:2, y:2};
  group.add(this.walls);
  
  map.addTilesetImage('Good', 'tiles_before');
  this.before = map.createLayer('Good');
  this.before.scale = {x:2, y:2};
  group.add(this.before);
  
  map.addTilesetImage('Broken', 'tiles_after');
  this.after = map.createLayer('Broken');
  this.after.scale = {x:2, y:2};
  group.add(this.after);
  
  this.shelves = map.createLayer('Shelf');
  this.shelves.scale = {x:2, y:2};
  group.add(this.shelves);
  
  map.addTilesetImage('Bed', 'tiles_bed');
  this.bed = map.createLayer('Bed');
  this.bed.scale = {x:2, y:2};
  group.add(this.bed);
  
  map.addTilesetImage('Objects', 'objects');
  var objects = map.createLayer('Objects');
  objects.scale = {x:2, y:2};
  group.add(objects);
  
  // Set all "before" tiles to invisible
  for (var y = 0; y < SCREEN_HEIGHT / TILE_SIZE; y++) {
    for (var x = 0; x < SCREEN_WIDTH / TILE_SIZE; x++) {
      var tilePos = {x:x * TILE_SIZE / 2, y:y * TILE_SIZE / 2};
      var objectsBefore = this.before.getTiles(tilePos.x, tilePos.y, 0, 0);
      objectsBefore[0].alpha = 0;
    }
  }
  this.before.dirty = true;
};

// Get the position of the bed
// So we can place the player here
Map.prototype.getBed = function() {
  for (var y = 0; y < SCREEN_HEIGHT / TILE_SIZE; y++) {
    for (var x = 0; x < SCREEN_WIDTH / TILE_SIZE; x++) {
      var tilePos = {x:x * TILE_SIZE / 2, y:y * TILE_SIZE / 2};
      var beds = this.bed.getTiles(tilePos.x, tilePos.y, 0, 0);
      if (beds[0].index >= 0) {
        return {x:x, y:y};
      }
    }
  }
  assert(false);
  return null;
};

Map.prototype.isWall = function(grid) {
  var pos = g2p(grid);
  var tilePos = {x:pos.x / 2, y:pos.y / 2};
  var walls = this.walls.getTiles(tilePos.x, tilePos.y, 0, 0);
  if (walls[0].index >= 0) {
    return true;
  }
  
  // Also check already-unbroken items
  // These shouldn't be broken again
  var unbrokens = this.before.getTiles(tilePos.x, tilePos.y, 0, 0);
  if (unbrokens[0].index >= 0 && unbrokens[0].alpha > 0) {
    return true;
  }
  
  return false;
};

// Returns tile indices for before, after
Map.prototype.destroyAt = function(grid, dir) {
  var pos = g2p(grid);
  var tilePos = {x:pos.x / 2, y:pos.y / 2};
  var objects = this.after.getTiles(tilePos.x, tilePos.y, 0, 0);
  var destroy = function(objectsAfter, after, before, tilePos) {
    var indexAfter = objectsAfter.index;
    objectsAfter.index = -1;
    objectsAfter.alpha = 0;
    after.dirty = true;
    var objectsBefore = before.getTiles(tilePos.x, tilePos.y, 0, 0);
    objectsBefore[0].alpha = 1;
    before.dirty = true;
    var indexBefore = objectsBefore[0].index;
    console.log('destroy ' + indexBefore + ':' + indexAfter);
    return [indexBefore, indexAfter];
  };
  if (objects[0].index >= 0) {
    return destroy(objects[0], this.after, this.before, tilePos);
  } else {
    // Check if there's a shelf destruction
    var shelves = this.shelves.getTiles(tilePos.x, tilePos.y, 0, 0);
    // Can only destroy shelves from below
    if (shelves[0].index >= 0 && dir == 'up') {
      return destroy(shelves[0], this.shelves, this.before, tilePos);
    }
  }
  return [-1, -1];
};