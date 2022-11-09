var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');

var AuthorSchema = new mongoose.Schema({
    name: String,
    country: String,
    birthDate: { type: Date, default: Date.now }
}, { timestamps: true });

AuthorSchema.plugin(uniqueValidator, { message: 'is already taken' });

AuthorSchema.pre('validate', function (next) {
    if (!this.slug) {
        this.slugify();
    }

    next();
});

AuthorSchema.methods.slugify = function () {
    this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

AuthorSchema.methods.toJSONFor = function () {
    return {
        name: this.name,
        country: this.country,
        birthDate: this.birthDate
    };
};

mongoose.model('Authors', AuthorSchema);