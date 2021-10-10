"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const apollo_datasource_1 = require("apollo-datasource");
class Store extends apollo_datasource_1.DataSource {
    constructor(db) {
        super();
        this.store = db;
    }
    initialize(config) {
        this.context = config.context;
        this.cache = config.cache;
    }
}
exports.Store = Store;
//# sourceMappingURL=index.js.map