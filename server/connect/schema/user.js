const { Sql, Schema } = require("../store");

const schema = new Schema(
    {
        username: String,
        password: String,
        registerTime: Number,
    },
    { minimize: false, versionKey: false }
);

module.exports = Sql({
    schema,
    collectionName: "user",
});
