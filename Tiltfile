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

docker_build("hani221b/proshop-auth-service", "auth-service", 
    live_update=[
        sync('./auth-service/src', '/app/src'),
        sync('./auth-service/package.json', '/app/package.json'),
        run('npm install', trigger=['./auth-service/package.json']),
    ]
)

docker_build("hani221b/proshop-orders-service", "orders-service", 
    live_update=[
        sync('orders-service/src', '/app/src'),
        
        sync('orders-service/package.json', '/app/package.json'),
        
        run('npm install', trigger=['orders-service/package.json']),
    ]
)

docker_build("hani221b/proshop-products-service", "products-service", 
    live_update=[
        sync('./products-service/src', '/app/src'),
        sync('./products-service/package.json', '/app/package.json'),
        run('npm install', trigger=['./products-service/package.json']),
    ]
)

docker_build("hani221b/proshop-frontend", "frontend", 
    live_update=[
        sync('./frontend/src', '/app/src'),
        sync('./frontend/package.json', '/app/package.json'),
        run('npm install', trigger=['./frontend/package.json']),
    ]
)

k8s_resource("auth-service", port_forwards=8001)
k8s_resource("orders-service", port_forwards=8002)
k8s_resource("products-service", port_forwards=8003)
k8s_resource("frontend", port_forwards=3000)

k8s_resource("orders-service", resource_deps=["orders-db"])
k8s_resource("auth-service", resource_deps=["auth-db"])
k8s_resource("products-service", resource_deps=["products-db"])