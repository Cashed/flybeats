
exports.up = function(knex, Promise) {
  return knex.schema.createTable('accounts', function(table){
    table.increments('id').primary();
    table.string('username', 15).unique().notNullable();
    table.string('password_digest');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.boolean('admin').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('accounts');
};
