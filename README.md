# Teacher-Student Registration Service 


### To troubleshoot having multiple node versions installed and not using the correct version
- install `nvm`
- to access `nvm` from console, sometimes need to export the part:
```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

## High Level Design
![design](./design.png)

## TypeORM
- We are using the `Many-to-many relationship` functionality in `typeorm` to simplify cascading addition/removal of entities. https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations
