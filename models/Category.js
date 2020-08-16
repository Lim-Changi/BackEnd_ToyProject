const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const CategorySchema = new Schema({

   
    name : {

        type: String,
        required: true
    },

    date : {

        type: Date,
        default: Date.now()
        
    }

    
});


module.exports = mongoose.model('categories',CategorySchema);
