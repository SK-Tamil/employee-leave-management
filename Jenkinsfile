pipeline {

    agent any

    environment {

        PROJECT_NAME = 'employee-management'

        FRONTEND_IMAGE = 'employee-frontend'
        BACKEND_IMAGE  = 'employee-backend'

        COMPOSE_FILE = 'docker-compose.yml'

        TRIVY_SEVERITY = 'HIGH,CRITICAL'
    }

    stages {

        // ==========================================
        // 1. CHECKOUT
        // ==========================================

        stage('Checkout') {
            steps {

                echo 'Checking out source code from GitHub...'

                checkout scm

                sh '''
                    echo "Current commit:"
                    git rev-parse --short HEAD

                    echo "Current branch:"
                    git branch --show-current
                '''
            }
        }


        // ==========================================
        // 2. INSTALL DEPENDENCIES
        // ==========================================

        stage('Install Dependencies') {
            steps {

                echo 'Installing application dependencies...'

                sh '''
                    set -e

                    echo "Installing frontend dependencies..."

                    cd frontend

                    npm ci

                    cd ..

                    echo "Installing backend dependencies..."

                    python3 -m venv .ci-venv

                    . .ci-venv/bin/activate

                    pip install --upgrade pip

                    pip install -r backend/requirements.txt
                '''
            }
        }


        // ==========================================
        // 3. APPLICATION TEST
        // ==========================================

        stage('Application Test') {
            steps {

                echo 'Running application tests...'

                sh '''
                    set -e

                    echo "Running backend tests..."

                    if [ -d "backend/tests" ]; then

                        . .ci-venv/bin/activate

                        pytest backend/tests -v

                    else

                        echo "No backend tests directory found."
                        echo "Skipping backend tests."

                    fi


                    echo "Running frontend tests..."

                    cd frontend

                    if grep -q '"test"' package.json; then

                        npm test -- --run

                    else

                        echo "No frontend test script found."
                        echo "Skipping frontend tests."

                    fi
                '''
            }
        }


        // ==========================================
        // 4. BUILD DOCKER IMAGES
        // ==========================================

        stage('Docker Build') {
            steps {

                echo 'Building Docker images...'

                sh '''
                    set -e

                    echo "Building frontend image..."

                    docker build \
                        -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                        -t ${FRONTEND_IMAGE}:latest \
                        ./frontend


                    echo "Building backend image..."

                    docker build \
                        -t ${BACKEND_IMAGE}:${BUILD_NUMBER} \
                        -t ${BACKEND_IMAGE}:latest \
                        ./backend


                    echo "Docker images created:"

                    docker images | grep -E \
                        "${FRONTEND_IMAGE}|${BACKEND_IMAGE}"
                '''
            }
        }


        // ==========================================
        // 5. TRIVY SECURITY SCAN
        // ==========================================

        stage('Trivy Security Scan') {
            steps {

                echo 'Scanning Docker images using Trivy...'

                sh '''
                    set -e

                    mkdir -p reports


                    echo "Scanning frontend image..."

                    trivy image \
                        --severity ${TRIVY_SEVERITY} \
                        --format table \
                        --output reports/frontend-trivy.txt \
                        ${FRONTEND_IMAGE}:${BUILD_NUMBER}


                    echo "Scanning backend image..."

                    trivy image \
                        --severity ${TRIVY_SEVERITY} \
                        --format table \
                        --output reports/backend-trivy.txt \
                        ${BACKEND_IMAGE}:${BUILD_NUMBER}


                    echo "Frontend Trivy report:"
                    cat reports/frontend-trivy.txt


                    echo "Backend Trivy report:"
                    cat reports/backend-trivy.txt
                '''
            }

            post {
                always {

                    archiveArtifacts artifacts:
                        'reports/*.txt',
                        allowEmptyArchive: true
                }
            }
        }


        // ==========================================
        // 6. DEPLOY WITH DOCKER COMPOSE
        // ==========================================

        stage('Docker Compose Deploy') {
            steps {

                echo 'Deploying application using Docker Compose...'

                sh '''
                    set -e

                    echo "Stopping old application containers..."

                    docker compose -f ${COMPOSE_FILE} down


                    echo "Starting new application..."

                    docker compose \
                        -f ${COMPOSE_FILE} \
                        up -d --build


                    echo "Current containers:"

                    docker compose \
                        -f ${COMPOSE_FILE} \
                        ps
                '''
            }
        }


        // ==========================================
        // 7. HEALTH CHECK
        // ==========================================

        stage('Health Check') {
            steps {

                echo 'Waiting for services to become healthy...'

                sh '''
                    set -e

                    echo "Waiting for containers..."

                    sleep 20


                    echo "Docker Compose status:"

                    docker compose \
                        -f ${COMPOSE_FILE} \
                        ps


                    echo "Checking MySQL..."

                    MYSQL_STATUS=$(docker inspect \
                        --format='{{.State.Health.Status}}' \
                        employee-mysql)


                    echo "MySQL status: ${MYSQL_STATUS}"


                    if [ "$MYSQL_STATUS" != "healthy" ]; then

                        echo "MySQL health check failed."

                        exit 1

                    fi


                    echo "Checking backend..."

                    BACKEND_STATUS=$(docker inspect \
                        --format='{{.State.Health.Status}}' \
                        employee-backend)


                    echo "Backend status: ${BACKEND_STATUS}"


                    if [ "$BACKEND_STATUS" != "healthy" ]; then

                        echo "Backend health check failed."

                        exit 1

                    fi


                    echo "Health checks passed."
                '''
            }
        }


        // ==========================================
        // 8. DEPLOYMENT VERIFICATION
        // ==========================================

        stage('Deployment Verification') {
            steps {

                echo 'Verifying application endpoint...'

                sh '''
                    set -e

                    echo "Testing backend health endpoint..."

                    curl --fail \
                        --retry 5 \
                        --retry-delay 5 \
                        http://localhost:5000/health


                    echo ""

                    echo "Application deployment verified successfully."
                '''
            }
        }


        // ==========================================
        // 9. CLEANUP
        // ==========================================

        stage('Docker Cleanup') {
            steps {

                echo 'Cleaning unused Docker resources...'

                sh '''
                    echo "Removing dangling images..."

                    docker image prune -f


                    echo "Removing unused build cache..."

                    docker builder prune -f


                    echo "Cleanup completed."

                    docker images
                '''
            }
        }
    }


    // ==============================================
    // POST ACTIONS
    // ==============================================

    post {

        success {

            echo '''
========================================
   CI/CD PIPELINE SUCCESSFUL
========================================
Application deployed successfully.

Build Number:
${BUILD_NUMBER}

Frontend:
${FRONTEND_IMAGE}:${BUILD_NUMBER}

Backend:
${BACKEND_IMAGE}:${BUILD_NUMBER}
========================================
'''
        }


        failure {

            echo '''
========================================
   CI/CD PIPELINE FAILED
========================================

Deployment or validation failed.

Rollback process should be executed here.
========================================
'''

            // Rollback logic will be added
            // after the basic pipeline is tested.
        }


        always {

            echo 'Pipeline execution completed.'

            sh '''
                echo "Final Docker Compose status:"

                docker compose \
                    -f ${COMPOSE_FILE} \
                    ps || true
            '''
        }
    }
}
