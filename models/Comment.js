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

    post: {

        type: Schema.Types.ObjectId,
        ref: 'posts'

    },

    body : {

        type: String,
        required : true
        
    },

    approveComment : {

        type : Boolean,
        default : true

    },

    date : {
        type: Date,
        default : Date.now()
    }

    
});


module.exports = mongoose.model('comments',CommentSchema);
