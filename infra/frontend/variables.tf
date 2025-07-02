variable "region" {
  default = "us-east-1"
}

variable "image_url" {
  description = "Full image URL in ECR"
  type        = string
}