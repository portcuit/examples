import server from './'
export default {...server, params:{server:{listen: [8080]}, pages: `${__dirname}/../../`}}