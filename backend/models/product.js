const mongoose = require("mongoose")
const {Schema} = mongoose;

const productSchema = new Schema ({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ["accessories","clothing","sportswear","mens","womens"],
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    image: {
        url: String,
        filename: String,
        required: true,
    }

},
{timestamps: true}
);
