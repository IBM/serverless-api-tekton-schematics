data "ibm_resource_group" "development" {
   name = var.resource_group
}

resource "ibm_resource_instance" "cloudant" {
  name              = "${var.basename}-cloudant"
  service           = "cloudantnosqldb"
  plan              = var.cloudant_plan
  location          = var.region
  resource_group_id = data.ibm_resource_group.development.id
}

# service access key for Cloudant with Writer privilege for app usage
resource "ibm_resource_key" "writer-cloudant" {
  name                 = "${var.basename}-key-cloudant-writer"
  role                 = "Writer"
  resource_instance_id = ibm_resource_instance.cloudant.id
}

# service access key for Cloudant with Manager privilege (to create a database)
resource "ibm_resource_key" "manager-cloudant" {
  name                 = "${var.basename}-key-cloudant-manager"
  role                 = "Manager"
  resource_instance_id = ibm_resource_instance.cloudant.id

  # create the database
  provisioner "local-exec" {
    command = "curl -X PUT ${ibm_resource_key.manager-cloudant.credentials.url}/ecommerce-db"
  }
}

resource "ibm_function_package" "package" {
  name      = var.package_name
  namespace = var.namespace

  provisioner "local-exec" {
    command = "ibmcloud login -a cloud.ibm.com -r ${var.region} -o ${var.organization} -s ${var.space} -g ${var.resource_group} --apikey ${var.ibmcloud_api_key}"
  }

  provisioner "local-exec" {
    command = "ibmcloud fn service bind cloudantnosqldb ${var.package_name} --instance ${ibm_resource_instance.cloudant.name} --keyname ${ibm_resource_key.writer-cloudant.name}"
  }
}