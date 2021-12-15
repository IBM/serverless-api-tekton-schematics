const { CloudantV1, IamAuthenticator } = require('@ibm-cloud/cloudant')

main = async(params) => {
  
  try {
    
    const auth = new IamAuthenticator({
      apikey: params.__bx_creds.cloudantnosqldb.apikey
    });
  
    const cloudant = CloudantV1.newInstance({
      authenticator: auth,
      serviceUrl: 'https://' + params.__bx_creds.cloudantnosqldb.host
    })

    const { result: {rows} } = await cloudant.postAllDocs({
      db: params.db,
      includeDocs: true,
    })

    return {body: {rows},statusCode: 200}
    
  } catch (error) {
      return {body: {error},statusCode: 500}
  }
}

global.main = main


