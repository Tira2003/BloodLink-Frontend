# BloodLink Backend - Deployment Guide

## Prerequisites
- Docker & Docker Compose installed
- Java 17+ for local development
- Maven 3.8+
- Supabase PostgreSQL instance
- SMTP server credentials (Gmail or other provider)

## Local Development with Docker

### 1. Set Environment Variables
Create a `.env` file in the backend directory:
```bash
POSTGRES_URL=jdbc:postgresql://postgres:5432/bloodlink
POSTGRES_USER=bloodlink_user
POSTGRES_PASSWORD=bloodlink_password
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
```

### 2. Start Services with Docker Compose
```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Auth Service: `http://localhost:8081`
- Core Service: `http://localhost:8082`
- Notification Service: `http://localhost:8083`
- PostgreSQL: `localhost:5432`

## Production Deployment

### Option 1: Kubernetes Deployment

#### Prerequisites
- Kubernetes cluster
- kubectl configured

#### Steps
1. **Build Docker Images**
```bash
docker build -t bloodlink/auth-service:1.0.0 ./auth-service
docker build -t bloodlink/core-service:1.0.0 ./core-service
docker build -t bloodlink/notification-service:1.0.0 ./notification-service
```

2. **Push to Registry**
```bash
docker tag bloodlink/auth-service:1.0.0 your-registry/auth-service:1.0.0
docker push your-registry/auth-service:1.0.0
```

3. **Create ConfigMap for Environment**
```bash
kubectl create configmap bloodlink-env \
  --from-literal=POSTGRES_URL=jdbc:postgresql://supabase-host:5432/bloodlink \
  --from-literal=POSTGRES_USER=your_user \
  --from-literal=JWT_SECRET=your-secret-key
```

4. **Deploy Services**
```bash
kubectl apply -f k8s/auth-service-deployment.yaml
kubectl apply -f k8s/core-service-deployment.yaml
kubectl apply -f k8s/notification-service-deployment.yaml
```

### Option 2: Cloud Platform Deployment (AWS, GCP, Azure)

#### AWS ECS
1. Create ECR repositories for each service
2. Push Docker images to ECR
3. Create ECS task definitions
4. Create ECS services with load balancing
5. Configure RDS for PostgreSQL (or use Supabase)

#### Google Cloud Run
```bash
# Build and deploy Auth Service
gcloud run deploy auth-service \
  --source ./auth-service \
  --platform managed \
  --region us-central1 \
  --set-env-vars POSTGRES_URL=your-url,JWT_SECRET=your-secret
```

#### Azure App Service
```bash
# Create resource group
az group create --name bloodlink-rg --location eastus

# Create App Service Plan
az appservice plan create --name bloodlink-plan --resource-group bloodlink-rg --sku B2

# Deploy Auth Service
az webapp deployment source config-zip --resource-group bloodlink-rg --name auth-service --src auth-service.jar
```

### Option 3: Traditional VM Deployment

1. **Install Java 17**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

2. **Copy JAR Files**
```bash
mkdir -p /opt/bloodlink
cp auth-service/target/auth-service.jar /opt/bloodlink/
cp core-service/target/core-service.jar /opt/bloodlink/
cp notification-service/target/notification-service.jar /opt/bloodlink/
```

3. **Create Systemd Services**
Create `/etc/systemd/system/auth-service.service`:
```ini
[Unit]
Description=BloodLink Auth Service
After=network.target

[Service]
Type=simple
User=bloodlink
WorkingDirectory=/opt/bloodlink
Environment="POSTGRES_URL=your-db-url"
Environment="JWT_SECRET=your-secret"
ExecStart=/usr/bin/java -jar auth-service.jar
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

4. **Enable and Start Services**
```bash
sudo systemctl daemon-reload
sudo systemctl enable auth-service
sudo systemctl start auth-service
```

## Database Initialization

### Using Supabase
1. Go to Supabase Dashboard
2. Open SQL Editor
3. Copy contents of `db/schema.sql`
4. Execute in SQL Editor
5. Verify tables are created

### Local PostgreSQL
```bash
psql -h localhost -U bloodlink_user -d bloodlink -f db/schema.sql
```

## Environment Variables Configuration

### Auth Service
```
POSTGRES_URL=jdbc:postgresql://host:5432/db
POSTGRES_USER=username
POSTGRES_PASSWORD=password
JWT_SECRET=min-32-character-secret-key
```

### Core Service
```
POSTGRES_URL=jdbc:postgresql://host:5432/db
POSTGRES_USER=username
POSTGRES_PASSWORD=password
```

### Notification Service
```
POSTGRES_URL=jdbc:postgresql://host:5432/db
POSTGRES_USER=username
POSTGRES_PASSWORD=password
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=email@gmail.com
MAIL_PASSWORD=app-specific-password
```

## Health Checks

### Verify Services
```bash
# Auth Service
curl http://localhost:8081/api/auth/health

# Core Service
curl http://localhost:8082/api/core/health

# Notification Service
curl http://localhost:8083/api/notification/health
```

## Monitoring

### Log Aggregation
- Use ELK Stack, Datadog, or CloudWatch
- Configure log shipping in application.yml

### Metrics
- Use Prometheus + Grafana for monitoring
- Add Spring Boot Actuator for metrics

```yml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
```

## Scaling

### Horizontal Scaling
- Deploy multiple instances of each service
- Use load balancer (Nginx, AWS ALB, GCP LB)
- Connection pooling configured in DataSource

### Database Optimization
- Add indexes on frequently queried fields
- Enable Read Replicas for scaling
- Use connection pooling (HikariCP)

## Security Checklist

- [ ] JWT Secret is strong (32+ characters)
- [ ] HTTPS/SSL configured
- [ ] Database credentials in secure vault
- [ ] CORS configured for frontend domain
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] SQL injection prevention (using JPA)
- [ ] CSRF tokens enabled
- [ ] Secrets not in version control

## Rollback Procedures

### Docker Compose
```bash
# List running containers
docker ps

# Stop specific service
docker-compose stop auth-service

# Restart with previous image
docker-compose up -d auth-service
```

### Kubernetes
```bash
# View rollout history
kubectl rollout history deployment/auth-service

# Rollback to previous version
kubectl rollout undo deployment/auth-service
```

## Troubleshooting

### Connection Issues
```bash
# Test database connection
psql -h your-host -U your-user -d bloodlink

# Check service logs
docker-compose logs auth-service
```

### Performance Issues
- Check database query performance
- Monitor resource usage (CPU, Memory)
- Review slow query logs

## Backup & Recovery

### Database Backup
```bash
# Backup
pg_dump -h host -U user -d bloodlink > backup.sql

# Restore
psql -h host -U user -d bloodlink < backup.sql
```

### Disaster Recovery Plan
1. Regular automated backups
2. Test recovery procedures monthly
3. Maintain backup in different region
4. Document RTO and RPO

## Post-Deployment Checklist

- [ ] All services running and responding
- [ ] Database connections established
- [ ] Authentication tokens generating correctly
- [ ] Email notifications sending
- [ ] Monitoring and alerts configured
- [ ] Backups automated
- [ ] Documentation updated
- [ ] Team trained on deployment process
