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

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_policy" {
    role = aws_iam_role.ecs_task_execution_role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_lb" "frontend-alb" {
    name = "frontend-alb"
    internal = false
    load_balancer_type = "application"
    security_groups = [aws_security_group.frontend_sg]
    subnets = module.vpc.public_subnets
}

resource "aws_lb_target_group" "frontend_tg" {
  name = "frontend-tg"
  port = 80
  protocol = "HTTP"
  vpc_id = module.vpc.vpc_id


  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "frontend_listener" {
  load_balancer_arn = aws_lb.frontend_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }
}

resource "aws_ecs_service" "frontend_service" {
  name = "frontend-service"
  cluster = aws_ecs_cluster.frontend_cluster.id
  task_definition = aws_ecs_task_definition.frontend
  launch_type = "FARGATE"
  desired_count = 1

  network_configuration {
    subnets = module.vpc.public_subnets
    security_groups = [aws_security_group.frontend_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend_tg.arn
    container_name = "frontend"
    container_port = 80
  }

  depends_on = [aws_lb_listener.frontend_listener]

}