export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

// src/IT/middlewares/role.middleware.js

export const onlyTestingManager = (req, res, next) => {
  try {
    // protect middleware req.user set karta hai
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // token me role kis key me aa raha hai? (role / userType / designation etc)
    // yaha common keys check kar rahe:
    const role =
      req.user.role ||
      req.user.userRole ||
      req.user.userType ||
      req.user.designation;

    if (!role) {
      return res.status(403).json({ message: "Role not found in token" });
    }

    // ✅ allowed roles (tum apne project ke hisaab se edit kar sakte ho)
    const allowed = ["TESTING_MANAGER", "TEST_MANAGER", "QA_MANAGER", "ADMIN"];

    if (!allowed.includes(String(role).toUpperCase())) {
      return res.status(403).json({ message: "Access denied (Testing Manager only)" });
    }

    next();
  } catch (err) {
    console.log("onlyTestingManager error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
