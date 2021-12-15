
terraform {
    required_providers {
        ibm = {
            source = "IBM-Cloud/ibm"
            version = "~> 1.12.0"
        }             
    }
}

provider "ibm" {
  ibmcloud_api_key = var.ibmcloud_api_key
  region           = var.region
 # ibmcloud_timeout = var.ibmcloud_timeout
}