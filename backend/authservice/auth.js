import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (token) {
      let decodedData = jwt.verify(token,"zalak");
      req.userId = decodedData?.id;
    }

    next();
  } catch (error) {}
};

export const validateUserAdd = [
  body("name", "Enter valid  name.").exists(),

  body("email", "Enter valid email").exists().isEmail(),

  body("password", "Password is invalid.")
    .exists()
    .isLength({ min: 8, max: 16 }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

export const validateUser = [
  body("email", "Enter a valid email").isEmail().normalizeEmail(),
  body("password", "Enter a password").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
    }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    next();
  },
];

export const validateArtical = [
  body("username", "Enter valid  name.").exists().contains(),

  body("title", "Enter valid  title.").exists().contains(),

  body("artical_desc", "Enter valid  artical_desc.").exists().contains(),

  

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    next();
  },
];
export default auth;
