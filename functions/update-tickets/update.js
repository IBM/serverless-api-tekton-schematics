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
    const { title, price,id,db } = params

    if(!title || !price || !id) {
      return {body:{ message: 'Missing parameter, make sure you include title, price and id'} , statusCode: 400}
    } 

    const {result: { docs }} = await cloudant.postFind({
        db,
        selector: {
            _id: {
                '$eq':id
            }
        },
        fields: ['_id','_rev','title','price'],
        limit: 1
    })

    if(docs.length < 1)
    {
        return {body: {message: 'No Tickets to show'},statusCode: 200}
    }

    const new_doc = {
        title,
        price
    }

    const { result } = await cloudant.putDocument({
        db,
        docId: docs[0]._id,
        rev: docs[0]._rev,
        document: new_doc
    })

    if(result.ok) {
      return {body: new_doc, statusCode: 200}
    }    
  } catch (error) {
      return {body: {error},statusCode: 500}
  }
}

global.main = main


