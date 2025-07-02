provider "aws" {
    region = var.region 
}

module "vpc" {
    source = "terraform-aws-modules/vpc/aws"
    version = "4.0.2"
    name = "frontend-vpc"
    cidr = "10.0.0.0/16"

    azs = ["${var.region}a", "${var.region}b"]
    public_subnets = ["10.0.1.0/24", "10.0.2.0/24"]

    enable_dns_hostnames = true
    enable_dns_support   = true
}

resource "aws_security_group" "frontend_sg" {
  name        = "frontend-sg"
  description = "Allow HTTP"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }


  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_cluster" "frontend_cluster" {
  name = "frontend-cluster"
}

resource "aws_ecs_task_definition" "frontend" {
  family = "frontend-task"
  requires_compatibilities = ["FARGATE"]
  cpu = "256"
  memory = "512"
  network_mode = "awsvpc"
  execution_role_arn = aws_iam_role.aws_ecs_task_definition.arb

  container_definitions = jsondecode([
    {
        name  = "frontend"
        image = var.image_url
        essential = true
              portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
    }
  ])
}