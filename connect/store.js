const mongoose = require("mongoose");
const { createClient } = require("redis");
const defaultUrl = "mongodb://127.0.0.1:27017/model-runner";
const redis = createClient();

async function connectRedic() {
    await redis.connect();
    console.log("------------连接redis成功---------");
}

async function connectDB(url) {
    await mongoose.connect(url || defaultUrl);
    console.log("------------连接数据库成功---------");
}

async function disconnectDB() {
    await mongoose.connection.close();
    console.log("------------断开数据库成功---------");
}
class SqlClass {
    schema = {};
    url = "";
    collectionName = "";
    model = {};
    /**
     *
     * @param {*} param0
     */
    constructor({ schema = {}, collectionName = "" }) {
        this.schema = schema;
        this.collectionName = collectionName;
        this.model = mongoose.model(this.collectionName, this.schema);
    }
    /**
     * 插入一条记录
     * @param {Object} info
     * @returns
     */
    async insert(info) {
        try {
            const Model = this.model;
            const newInfo = new Model(info);
            await newInfo.save();
            return { ...newInfo, code: "success", msg: "添加成功" };
        } catch (error) {
            console.log("mongoose-insert-error");
            return { msg: `${error}`, code: "error" };
        }
    }
    /**
     *  插入数组中的多条记录
     * @param {Array} arr
     */
    async insertMany(arr) {
        try {
            const data = await this.model.insertMany(arr);
            return { code: "success", msg: "添加成功", data };
        } catch (error) {
            console.log("mongoose-insertmany-error");
            console.log(error);
            return { msg: `${error}`, code: "error" };
        }
    }
    /**
     * 查找到所有满足条件的记录
     * @param {Object} filter
     * @param {Number} pageSize
     * @param {Number} currentPage
     * @param {Object} projection
     * @param {Object} sort
     * @returns
     */
    async find(filter = {}, pageSize = 10, currentPage = 0, projection = {}, sort = {}) {
        try {
            const pro1 = this.model
                .find(filter, projection)
                .sort(sort)
                .limit(pageSize)
                .skip(currentPage * pageSize);
            const pro2 = this.model.countDocuments(filter);
            const [data, total] = await Promise.all([pro1, pro2]);
            return {
                data,
                total,
                code: "success",
                msg: "查找成功",
            };
        } catch (error) {
            console.log("mongoose-find-error", error);
            return { msg: `${error}`, code: "error" };
        }
    }
    /**
     * 查询一条记录
     * @param {Object} filter
     * @returns
     */
    async findOne(filter = {}) {
        try {
            const data = await this.model.findOne(filter);
            return {
                data,
                msg: "查找成功",
                code: "success",
            };
        } catch (error) {
            console.log("mongoose-findone-error", error);
            return { msg: `${error}`, code: "error" };
        }
    }
    /**
     * 更新一条记录
     * @param {Object} filter
     * @param {Object} doc
     * @param {Object} options
     * @returns
     */
    async updateOne(filter, doc, options = { new: true }) {
        try {
            if (!filter || !doc) throw new Error("请确保数据完整");
            const data = await this.model.findOneAndUpdate(filter, doc, options);
            return {
                data,
                code: "success",
                msg: "修改成功",
            };
        } catch (error) {
            console.log("mongoose-update-one-error", error);
            return { msg: `${error}`, code: "error" };
        }
    }
    /**
     * 删除多条记录
     * @param {object} filter
     * @returns
     */
    async removeMany(filter) {
        try {
            if (!filter) throw new Error("请确保数据完整");
            const res = await this.model.deleteMany(filter);
            return res;
        } catch (error) {
            console.log("mongoose-removeMany-error", error);
            return { msg: `${error}`, code: "error" };
        }
    }
    /**
     * 删除一条记录
     * @param {object} filter
     * @returns
     */
    async removeOne(filter) {
        try {
            if (!filter) throw new Error("请确保数据完整");
            const { deletedCount } = await this.model.deleteOne(filter);
            return deletedCount === 1
                ? { code: "success", msg: "删除成功" }
                : { code: "error", msg: "删除失败: 数据可能不存在" };
        } catch (error) {
            console.log("mongoose-removeOne-error", error);
            return { msg: `${error}`, code: "error" };
        }
    }
    /**
     * 聚合查询，自动收集传入参数
     * @returns
     */
    async aggregate() {
        try {
            const data = await this.model.aggregate(...arguments);
            return {
                msg: "查找成功",
                data,
                code: "success",
            };
        } catch (error) {
            console.log("mongoose-aggregate-error", error);
            return { msg: `${error}`, code: "error" };
        }
    }
}

const Sql = options => new SqlClass(options);

module.exports = {
    Sql,
    connectDB,
    connectRedic,
    disconnectDB,
    redis,
    Schema: mongoose.Schema,
};
