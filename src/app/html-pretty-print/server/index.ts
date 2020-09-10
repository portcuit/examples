import server from '../../shared/server/'



export default {...server, params:{server: {listen: [8080]}, ui: `${__dirname}/../ui`}}
