'use strict';
const lodash = require('lodash');
const { ObjectId } = require('mongodb');
const MongoDBConnector = require('./../connectors/MongoDBConnector');

class MongoDBDAO {
    constructor(tableName, databaseName,host,user,password) {
        this.tableName = tableName;
        this.databaseName = databaseName;
        this.host = host;
        this.user = user;
        this.password = password;
    }

    async intertOrUpdateItems(items) {
        let dbConn = await MongoDBConnector.getConnection(this.databaseName,this.host,this.user,this.password);
        let collection = dbConn.collection(this.tableName);
        let bulkWriteReqArray = lodash.map(items, (item) => {
            item['_id'] = item['_id'] ? item['_id'] : ObjectId().toString();
            return {
                updateOne: {
                    filter: { _id: ObjectId(item['_id']) },
                    update: {
                        $set: lodash.omit(item, '_id')
                    },
                    upsert: true
                }
            }
        });
        return collection.bulkWrite(bulkWriteReqArray);
    }
}

module.exports = MongoDBDAO;