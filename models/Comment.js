const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const CommentSchema = new Schema({

   
    user : {

        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    body : {

        type: String,
        required : true
        
    }

    
});


module.exports = mongoose.model('categories',CommentSchema);
