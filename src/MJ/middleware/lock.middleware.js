// src/MJ/middlewares/lock.middleware.js
export const worklogLock = (req, res, next) => {
  const now = new Date();
  const lockTime = new Date();

  lockTime.setHours(17, 30, 0, 0); // 5:30 PM

  if (now > lockTime) {
    return res
      .status(403)
      .json({ message: "Worklog submission locked after 5:30 PM" });
  }

  next();
};
