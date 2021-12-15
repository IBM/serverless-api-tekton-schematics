variable "ibmcloud_api_key" {
  
}

variable "basename" {
    description = "basename for the services"
}

variable "resource_group" {
    description = "resource group for the resources"
}

variable "namespace" {
    description = "namespace for the functions"
}

variable "region" {
    description = "region of the resources"
}

variable "cloudant_plan" {
    description = "cloudant plan"
}

variable "package_name" {
    description = "package of the functions"
}

variable "organization" {
    description = "cloud foundry organization"
}

variable "space" {
    description = "cloud foundry space"
}