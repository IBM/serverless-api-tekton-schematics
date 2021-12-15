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
    
    const { id,db } = params

    if(!id) {
      return {body: {message: 'Missing id parameter'},statusCode: 400}
    } 

    const { result: { docs } } = await cloudant.postFind({
      db,
      selector: {
          _id: {
              '$eq': id
          }
      },
      fields: ['_id','_rev'],
      limit: 1
    })

    if(docs.length < 1) {
      return {body: {message: 'Ticket not found'},statusCode: 404}
    }

    const { result } = await cloudant.deleteDocument({
        db,
        docId: id,
        rev:  docs[0]._rev
    })

    if(result.ok)
    {
      return {body: {message: 'Ticket deleted'}, statusCode: 200}
    } 

  } catch (error) {
    return {body: {error},statusCode: 500}
  }
}

global.main = main


