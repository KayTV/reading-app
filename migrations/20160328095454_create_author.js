exports.up = function(knex, Promise) {
  return knex.schema.createTable('author', function(table){
    table.increments();
    table.string('first_name');
    table.string('last_name');
    table.string('image_url');
    table.text('biography');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('author');
};
