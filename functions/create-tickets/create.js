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

    const { title, price, db } = params

    if(!title || !price) {
      return { body:{message: 'Missing parameter, make sure you include title and price'},statusCode:400}
    } 

    const ticket = {
        title,
        price
    }

    const { result: {id} } = await cloudant.postDocument({
      db,
      document: ticket
    })

    if(id) {
      return {body: {id}, statusCode: 201}
    }
  } catch (error) {
      return {body: {error},statusCode: 500}
  }
}

global.main = main
