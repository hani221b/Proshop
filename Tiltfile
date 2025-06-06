k8s_yaml([
    "k8s/auth/deployment.yml",
    "k8s/auth/service.yml",
    "k8s/auth/secret.yml",

    "k8s/auth-db/deployment.yml",
    "k8s/auth-db/pv.yml",
    "k8s/auth-db/pvc.yml",
    "k8s/auth-db/secret.yml",
    "k8s/auth-db/service.yml",

    "k8s/frontend/deployment.yml",
    "k8s/frontend/service.yml",

    "k8s/orders/deployment.yml",
    "k8s/orders/secret.yml",
    "k8s/orders/service.yml",

   "k8s/orders-db/deployment.yml",
    "k8s/orders-db/pv.yml",
    "k8s/orders-db/pvc.yml",
    "k8s/orders-db/secret.yml",
    "k8s/orders-db/service.yml",

    "k8s/products/deployment.yml",
    "k8s/products/secret.yml",
    "k8s/products/service.yml",

   "k8s/products-db/deployment.yml",
    "k8s/products-db/pv.yml",
    "k8s/products-db/pvc.yml",
    "k8s/products-db/secret.yml",
    "k8s/products-db/service.yml",

    "k8s/ingress.yml",

])

docker_build("auth-service", "auth-service")
docker_build("orders-service", "orders-service")
docker_build("products-service", "products-service")
docker_build("frontend", "frontend")

k8s_resource("auth-service", port_forwards=8001)
k8s_resource("orders-service", port_forwards=8002)
k8s_resource("products-service", port_forwards=8003)
k8s_resource("frontend", port_forwards=3000)