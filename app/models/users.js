var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	local            : {
        username     : String,
        password     : String,
    },
	polls: [{ type:Schema.ObjectId, ref:"Poll" }],
	avatarURL: { type: String, default: 'https://res.cloudinary.com/dkldedq8v/image/upload/v1473265444/Screen_Shot_2016-09-07_at_11.27.57_AM_mqsppm.png' }
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