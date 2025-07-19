const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    }
});

const Stats = mongoose.model('Stats', statsSchema, 'web_stats');
module.exports = Stats;