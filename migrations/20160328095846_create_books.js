exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function(table){
    table.increments();
    table.string('title');
    table.string('genre');
    table.string('description');
    table.string('cover_url');
    table.integer('author_one');
    table.foreign('author_one').references('author.id');
    table.integer('author_two');
    table.foreign('author_two').references('author.id');
    table.integer('author_three');
    table.foreign('author_three').references('author.id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};
