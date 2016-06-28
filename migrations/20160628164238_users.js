
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments('id').primary();
    table.integer('account_id').unsigned().index().references('id').inTable('accounts').onDelete('CASCADE');
    table.string('username', 15).unique().notNullable();
    table.string('avatar');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
