//@ts-expect-error
import { DisplayConfigurationRepository } from "../modules/display-configuration/display-configuration.repository"
import { Request } from "express"

export const disPlayConfigindex = async(req: Request): Promise<any> => {
    let {query, query: {displayConfig}, body: {loggedInUser: {companyId, roleId, _id}}} = req as any
    let data = [], page = 0, tempFilters: any[] = []

    if(displayConfig) {
        // displayConfig = JSON.parse(displayConfig)
        tempFilters = [...displayConfig]
        displayConfig = [...displayConfig, {key: 'userId', "value": _id}]
        query.filters = await JSON.stringify(displayConfig)
    }

    const data1: any = await new DisplayConfigurationRepository().index(query)
    // console.log(data1,'..........................................')
    if(data1?.data?.length) {
        data = data1.data
        page = data1.page
    }

    if(!data?.length) {
        displayConfig = []
        displayConfig = [...tempFilters, {key: 'companyId', "value": companyId}, {key: 'roleId', "value": roleId}]//userId is here also
        query.filters = JSON.stringify(displayConfig)
        const data2: any = await new DisplayConfigurationRepository().index(query)
        // console.log(data2,'..........................................')
        if(data2?.data?.length) {
            data = data2?.data
            page = data2?.page
        }
        if(!data?.length) data.push({config: await new DisplayConfigurationRepository().defaultConfiguration(query)})
    }
    // console.log(data,'..........................................')
    return data
}
