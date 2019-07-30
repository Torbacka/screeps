##  Screeps
### [What is Screeps?](https://screeps.com/)

> Screeps means “scripting creeps.” It’s an open-source sandbox MMO RTS game for programmers, wherein the core mechanic is programming your units’ AI. You control your colony by writing JavaScript which operate 24/7 in the single persistent real-time world filled by other players on par with you.

### Prerequisites
To be able to package and deploy the code you will need to have grunt and grunt-cli node_modules installed.


### How to install and deploy the code

Create a file called screeps.json
```
{
    "branch": "default",
    "email": "YOUR_EMAIL_HERE",
    "password": "YOUR_PASSWORD_HERE"
}
```

1. run `yarn install`
2. run `grunt`