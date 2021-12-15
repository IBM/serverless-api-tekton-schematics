#!/bin/bash
echo "Verifying package $PACKAGE_NAME......"

if ibmcloud fn package list | awk 'BEGIN {FS="/"} {print $3}' | uniq | grep -qw $PACKAGE_NAME; then
    echo "Package already exist, initiating deployment"  
else
    echo "Package doesnt exist, creating it...."
    ibmcloud fn package create $PACKAGE_NAME 
fi

ibmcloud fn action update $PACKAGE_NAME/$FUNCTION_NAME $APP_BASE/$APP_FOLDER/dist/bundle.js --web yes --kind nodejs:12
ibmcloud fn api create /tickets /$ENDPOINT $METHOD /$NAMESPACE/$PACKAGE_NAME/$FUNCTION_NAME --response-type json