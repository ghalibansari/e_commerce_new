"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disPlayConfigindex = void 0;
const display_configuration_repository_1 = require("../modules/display-configuration/display-configuration.repository");
const disPlayConfigindex = async (req) => {
    let { query, query: { displayConfig }, body: { loggedInUser: { companyId, roleId, _id } } } = req;
    let data = [], page = 0, tempFilters = [];
    if (displayConfig) {
        tempFilters = [...displayConfig];
        displayConfig = [...displayConfig, { key: 'userId', "value": _id }];
        query.filters = await JSON.stringify(displayConfig);
    }
    const data1 = await new display_configuration_repository_1.DisplayConfigurationRepository().index(query);
    if (data1?.data?.length) {
        data = data1.data;
        page = data1.page;
    }
    if (!data?.length) {
        displayConfig = [];
        displayConfig = [...tempFilters, { key: 'companyId', "value": companyId }, { key: 'roleId', "value": roleId }];
        query.filters = JSON.stringify(displayConfig);
        const data2 = await new display_configuration_repository_1.DisplayConfigurationRepository().index(query);
        if (data2?.data?.length) {
            data = data2?.data;
            page = data2?.page;
        }
        if (!data?.length)
            data.push({ config: await new display_configuration_repository_1.DisplayConfigurationRepository().defaultConfiguration(query) });
    }
    return data;
};
exports.disPlayConfigindex = disPlayConfigindex;
//# sourceMappingURL=displayConfigData.js.map