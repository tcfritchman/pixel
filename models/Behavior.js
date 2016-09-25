var keystone = require('keystone');
var Types = keystone.Field.Types;

/* Behavior Model */

var Behavior = new keystone.List('Behavior', {
  autokey: { path: 'slug', from: 'title', unique: true },
  map: { name: 'title' },
  defaultSort: '-createdAt'
});

Behavior.add({
  title: { type: Types.Text, required: true, initial: true },
  author: { type: Types.Relationship, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  isFeatured: { type: Types.Boolean, label: 'Featured?' },
  dependencies: { type: Types.Text, required: false },
  code: { type: Types.Code, height: 180, language: 'js' },
  description: { type: Types.Markdown, height: 90 },
  tags: { type: Types.Relationship, ref: 'Tag', many: true }
});

//Behavior.model.findOne().populate('author tags');

Behavior.defaultColumns = 'title, isFeatured, author, createdAt';
Behavior.register();
