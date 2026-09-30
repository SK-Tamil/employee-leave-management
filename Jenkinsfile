pipeline {

    agent any

    environment {

        FRONTEND_IMAGE = 'employee-frontend'
        BACKEND_IMAGE  = 'employee-backend'

        COMPOSE_FILE = 'docker-compose.yml'

        TRIVY_SEVERITY = 'HIGH,CRITICAL'

        PREVIOUS_TAG_FILE = '.previous_build'
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

                    cd frontend
                    npm ci

                    cd ..

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
                        echo "No backend tests found. Skipping."
                    fi


                    echo "Running frontend tests..."

                    cd frontend

                    if grep -q '"test"' package.json; then
                        npm test -- --run
                    else
                        echo "No frontend test script found. Skipping."
                    fi
                '''
            }
        }


        // ==========================================
        // 4. DOCKER BUILD
        // ==========================================

        stage('Docker Build') {
            steps {

                echo 'Building Docker images...'

                sh '''
                    set -e

                    docker build \
                        -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                        -t ${FRONTEND_IMAGE}:latest \
                        ./frontend

                    docker build \
                        -t ${BACKEND_IMAGE}:${BUILD_NUMBER} \
                        -t ${BACKEND_IMAGE}:latest \
                        ./backend

                    echo "Images created:"

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


                    echo "===== FRONTEND TRIVY REPORT =====" \
                        > reports/frontend-trivy.txt

                    trivy image \
                        --severity ${TRIVY_SEVERITY} \
                        --format table \
                        ${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                        >> reports/frontend-trivy.txt


                    echo "===== BACKEND TRIVY REPORT =====" \
                        > reports/backend-trivy.txt

                    trivy image \
                        --severity ${TRIVY_SEVERITY} \
                        --format table \
                        ${BACKEND_IMAGE}:${BUILD_NUMBER} \
                        >> reports/backend-trivy.txt


                    echo "Frontend report:"
                    cat reports/frontend-trivy.txt


                    echo "Backend report:"
                    cat reports/backend-trivy.txt
                '''
            }

            post {
                always {
                    archiveArtifacts artifacts: 'reports/*.txt',
                                     allowEmptyArchive: true
                }
            }
        }


        // ==========================================
        // 6. SAVE PREVIOUS VERSION
        // ==========================================

        stage('Save Previous Version') {
            steps {

                echo 'Checking current deployed version...'

                sh '''
                    set +e

                    CURRENT_TAG=$(docker inspect \
                        leave-backend \
                        --format='{{.Config.Image}}' \
                        2>/dev/null)

                    if [ -n "$CURRENT_TAG" ]; then

                        echo "Current backend image: $CURRENT_TAG"

                        PREVIOUS_TAG=$(echo "$CURRENT_TAG" | cut -d: -f2)

                        echo "$PREVIOUS_TAG" > ${PREVIOUS_TAG_FILE}

                        echo "Previous version: $PREVIOUS_TAG"

                    else

                        echo "No previous deployment found."

                        rm -f ${PREVIOUS_TAG_FILE}
                    fi
                '''
            }
        }


        // ==========================================
        // 7. DEPLOY
        // ==========================================

        stage('Docker Compose Deploy') {
            steps {

                echo 'Deploying application...'

                sh '''
                    set -e

                    echo "Stopping old application..."

                    docker compose \
                        -f ${COMPOSE_FILE} \
                        down


                    echo "Deploying version: ${BUILD_NUMBER}"

                    IMAGE_TAG=${BUILD_NUMBER} \
                    docker compose \
                        -f ${COMPOSE_FILE} \
                        up -d


                    echo "Current containers:"

                    docker compose \
                        -f ${COMPOSE_FILE} \
                        ps
                '''
            }
        }


        // ==========================================
        // 8. HEALTH CHECK
        // ==========================================

        stage('Health Check') {
            steps {

                echo 'Checking application health...'

                sh '''
                    set -e

                    sleep 20


                    MYSQL_STATUS=$(docker inspect \
                        --format='{{.State.Health.Status}}' \
                        leave-mysql)

                    BACKEND_STATUS=$(docker inspect \
                        --format='{{.State.Health.Status}}' \
                        leave-backend)


                    echo "MySQL   : ${MYSQL_STATUS}"
                    echo "Backend : ${BACKEND_STATUS}"


                    if [ "$MYSQL_STATUS" != "healthy" ] || \
                       [ "$BACKEND_STATUS" != "healthy" ]; then

                        echo "Health check failed."

                        exit 1
                    fi


                    echo "Health checks passed."
                '''
            }
        }


        // ==========================================
        // 9. DEPLOYMENT VERIFICATION
        // ==========================================

        stage('Deployment Verification') {
            steps {

                echo 'Verifying application endpoint...'

                sh '''
                    set -e

                    curl --fail \
                        --retry 5 \
                        --retry-delay 5 \
                        http://localhost:5000/api/health

                    echo ""

                    echo "Application deployment verified successfully."
                '''
            }
        }


        // ==========================================
        // 10. CLEANUP
        // ==========================================

        stage('Docker Cleanup') {
            steps {

                echo 'Cleaning unused Docker resources...'

                sh '''
                    docker image prune -f

                    docker builder prune -f

                    echo "Docker cleanup completed."
                '''
            }
        }
    }


    // ==============================================
    // POST ACTIONS
    // ==============================================

    post {

        success {

            echo """
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
"""
        }


        failure {

            echo """
========================================
        PIPELINE FAILED
========================================

Starting rollback...
========================================
"""

            sh '''
                set +e

                if [ -f "${PREVIOUS_TAG_FILE}" ]; then

                    PREVIOUS_TAG=$(cat ${PREVIOUS_TAG_FILE})

                    echo "Rolling back to version: ${PREVIOUS_TAG}"


                    docker compose \
                        -f ${COMPOSE_FILE} \
                        down


                    IMAGE_TAG=${PREVIOUS_TAG} \
                    docker compose \
                        -f ${COMPOSE_FILE} \
                        up -d


                    echo "Rollback completed."


                    echo "Rollback containers:"

                    docker compose \
                        -f ${COMPOSE_FILE} \
                        ps

                else

                    echo "No previous version available."

                    echo "Rollback skipped."

                fi
            '''
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
