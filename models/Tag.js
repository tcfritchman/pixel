var keystone = require('keystone');
var Types = keystone.Field.Types;

/* Tag Model */

var Tag = new keystone.List('Tag');

Tag.add({
  name: { type: Types.Text }
});

// Relationship Definitions
Tag.relationship({ path: 'behaviors', ref: 'Behavior', refPath: 'tags'});

Tag.defaultColumns = 'name';
Tag.register();
