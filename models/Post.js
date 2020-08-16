const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const PostSchema = new Schema({

   
    title : {

        type: String,
        required: true

    },

    status : {

        type: String,
        default: 'public'

    },

    allowComments : {

        type: Boolean,
        required: true,

    },

    body : {

        type: String,
        required: true

    },

    file : {

        type: String
        
    },

    date : {

        type: Date,
        default: Date.now()
        
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    }
// categories 스키마의 id값을 필드값으로 받는다


});


module.exports = mongoose.model('posts',PostSchema);
//스키마 모듈화