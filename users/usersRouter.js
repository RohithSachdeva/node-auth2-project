const router = require("express").Router();
const User = require("./usersModel.js");

const restricted = require("../auth/restricted.js");

const { isValid } = require("./usersService.js");

router.use(restricted);

router.get("/", (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json({ users, jwt: req.jwt })
        })
        .catch(err =>{
            res.status(500).json({ message: err.message })
        })
})

router.post("/", checkRoles(["admin"]), (req, res) => {
    const user = req.body;

    if(isValid(user)) {
        User.add(user)
            .then(saved => {
                res.status(201).json({ data: saved });
            })
            .catch(err => {
                res.status(500).json({ error: err.message })
            })
    } else {
        res.status(400).json({ message: "Provide Credentials" })
    }
})

function checkRoles(roles) {
    return function (req, res, next) {
      const role = req.jwt.role;
  
      if (req.jwt && req.jwt.role && roles.includes(role)) {
        next();
      } else {
        res.status(403).json({ you: "Not authorized" });
      }
    };
  }
  
  module.exports = router;


//TUESDAY GUIDED
//   const router = require("express").Router();

// const Users = require("./users-model.js");
// const restricted = require("../auth/restricted-middleware.js");

// router.get("/", restricted, (req, res) => {
//     Users.find()
//         .then(users => {
//             res.status(200).json({ data: users });
//         })
//         .catch(err => res.send(err));
// });

// router.put("/:id", restricted, checkRole(["hr", "admin"]), (req, res) => {
//     // use req.decodedToken data to restrict access by checking the role
//     res.status(200).json({ hello: "you made it!" });
// });

// function checkRole(roles) {
//     return function (req, res, next) {
//         if (roles.includes(req.decodedToken.role)) {
//             next();
//         } else {
//             res.status(403).json({ you: "can't touch this!" });
//         }
//     };
// }