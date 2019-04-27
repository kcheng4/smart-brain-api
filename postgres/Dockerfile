FROM postgres:10.3

# COPY /docker-entrypoint-initdb.d/ /docker-entrypoint-initdb.d/
ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD /seed/ /docker-entrypoint-initdb.d/seed/
ADD deploy_schemas.sql /docker-entrypoint-initdb.d/



