var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	local            : {
        username     : String,
        password     : String,
    },
	polls: [{ type:Schema.ObjectId, ref:"Poll" }],
	avatarURL: { type: String, default: 'http://res.cloudinary.com/dkldedq8v/image/upload/v1473799069/orange_bars_tonigx.png' }
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);