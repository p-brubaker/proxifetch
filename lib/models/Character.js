const pool = require('../utils/pool.js');

module.exports = class Character {
    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.url = row.url;
    }

    static async create({ name, url }) {
        const { rows } = await pool.query(
            'INSERT INTO characters (name, url) VALUES ($1, $2) RETURNING *',
            [name, url]
        );
        return new Character(rows[0]);
    }
    static async getAll() {
        const { rows } = await pool.query('SELECT * FROM characters');
        return rows.map((row) => new Character(row));
    }
};
