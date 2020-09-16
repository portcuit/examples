import server from '@pkit/next/server'
export default {...server, params:{server:{listen: [8080]}, pages: __dirname}}