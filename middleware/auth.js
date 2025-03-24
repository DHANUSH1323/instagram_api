// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({message: "Access Denied"});

//     try{
//         const verified = jwt.verify(token, process.env.SECRET_KEY);
//         req.user = verified;
//         next();
//     }catch (err)
//     {
//         res.status(400).json({message: "Invalid Token"});
//     }
// };





const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log("👉 Received Header:", authHeader);

  if (!authHeader) return res.status(401).json({ message: "Access Denied - No Token" });

  try {
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    console.log("👉 Extracted Token:", token);

    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified; // Save user ID into req
    next();
  } catch (err) {
    console.error("❌ Token Verification Failed:", err.message);
    res.status(400).json({ message: "Invalid Token" });
  }
};