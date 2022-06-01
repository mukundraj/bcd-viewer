## Brain Cell Data Viewer

### Docker commands:

```
docker builder prune
docker-compose -f docker-compose-prod.yml up -d --build
docker-compose -f docker-compose-prod.yml down
docker-compose -f docker-compose-prod.yml up -d
```

### Special fixes:

- React routes with docker - https://stackoverflow.com/questions/43555282/react-js-application-showing-404-not-found-in-nginx-server
