
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('author').del(),

    // Inserts seed entries
    knex('author').insert({
      id: 1,
      first_name: 'rowValue',
      last_name: '',
      image_url: '',
      biography: ''
    }),
    knex('author').insert({id: 2, colName: 'rowValue2'}),
    knex('author').insert({id: 3, colName: 'rowValue3'})
  );
};
