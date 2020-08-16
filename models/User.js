const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const UserSchema = new Schema({


    firstName : {

        type: String,
        required: true
    },
   
    lastName : {

        type: String,
        required: true
    },

    email : {

        type: String,
        required: true
    },

    password : {

        type: String,
        required: true
    }

    
});


module.exports = mongoose.model('users',UserSchema);
