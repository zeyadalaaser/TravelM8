
export const adminOnly = (req, res, next) => {
  console.log("User role:", req.user.role);
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  try {
      // Check if user exists and has role property
      if (!req.user || !req.user.role) {
          return res.status(403).json({ message: "No user role found" });
      }

      // Check if user is admin
      if (req.user.role.toLowerCase() !== 'admin') {
          return res.status(403).json({ message: "Admin access required" });
      }

      next();
  } catch (error) {
      console.error("Error in admin middleware:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
};