import userModel from "../../../../DB/dbModels/userModel.js";
import { asyncErrorHandler } from "../../../utlis/errorHandling.js";
import { compareHash, generatHash } from "../../../utlis/hashAndcompare.js";
import sendMail from "../../../utlis/sendMail.js";
import { genrateToken, verfiToken } from "../../../utlis/token.js";
import { customAlphabet } from "nanoid";

export const signUp = asyncErrorHandler(async (req, res, next) => {
  const { userName, email, password, address } = req.body;
  if (await userModel.findOne({ email })) {
    return next(new Error("this email existing", { cause: 409 }));
  }
  /**====send email===== */

  const token = genrateToken({ payload: { email }, expireTime: 60 * 30 });
  const refreshToken = genrateToken({
    payload: { email },
    expireTime: 60 * 60 * 24,
  });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const refreshLink = `${req.protocol}://${req.headers.host}/auth/ReConfirmEmail/${refreshToken}`;

  const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    
    <tr>
    <td>
    
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    <tr>
    <td>
    <br>
    <br>
    
    <br>
    <br>
    <a href="${refreshLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">reconfirm Email address</a>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    
    </table>
    </body>
    </html>`;
  if (!sendMail({ to: `${email}`, subject: "confirmEmail", html })) {
    return next(new Error("this email rejected", { cause: 409 }));
  }
  /** hash password */
  const hashPassword = generatHash({ plaintext: password });

  const user = await userModel.create({
    userName,
    address,
    email,
    password: hashPassword,
  });
  if (!user) {
    return next(new Error("failed signUp process", { cause: 400 }));
  }

  res.status(201).json({ message: "singUp Done 👌", user });
});
/**=====confirm email============== */
export const confirmEmail = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = verfiToken({ payload: token });
  if (!decoded) {
    return next(new Error("token is In_Valid", { cause: 409 }));
  }
  const user = await userModel.findOneAndUpdate(
    { email: decoded.email },
    { confirmEmail: true },
    { new: true }
  );
  res.status(200).redirect(`${process.env.loginAdress}`);
});
/**===re confirm email ========== */
export const reConfirmEmail = asyncErrorHandler(async (req, res, next) => {
  const { refreshToken } = req.params;
  const { email } = verfiToken({ payload: refreshToken });
  if (!email) {
    return next(new Error("token is In_Valid", { cause: 400 }));
  }
  const user = await userModel.findOne({ email });
  if (user?.confirmEmail) {
    res.status(200).redirect(`${process.env.loginAdress}`);
  }
  const token = genrateToken({ payload: { email }, expireTime: 60 * 5 });

  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;

  const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    
    <tr>
    <td>
    
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    
    </table>
    </td>
    </tr>
    
    </table>
    </body>
    </html>`;
  if (!sendMail({ to: `${email}`, subject: "reConfirmEmail", html })) {
    return next(new Error("this email rejected", { cause: 409 }));
  }

  res
    .status(200)
    .send(`<p> send new confirm email done "please check you mail"</p>`);
});
/**===== login=========== */
export const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("this email is not exist", { cause: 400 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("this email is not confirmed", { cause: 400 }));
  }
  const comparePassword = compareHash({
    plaintext: password,
    encrypted: user.password,
  });
  if (!comparePassword) {
    return next(new Error("In-valid password", { cause: 400 }));
  }
  const access_token = genrateToken({
    payload: { id: user._id, role: user.role },
    expireTime: 60 * 30,
  });
  const refresh_token = genrateToken({
    payload: { id: user._id, role: user.role },
    expireTime: 60 * 60 * 24 * 365,
  });

  res.status(200).json({ message: "Done 👌", access_token, refresh_token });
});
/**==================send forget code=========
 */
export const sendCode = asyncErrorHandler(async (req, res, next) => {
  const forget = customAlphabet("123456789", 4);
  const code = forget();
  const { email } = req.body;
  const user = await userModel.findOneAndUpdate(
    { email },
    { forgetCode: code },
    { new: true }
  );
  if (!user?.forgetCode == null) {
    return next(new Error("this email not exist", { cause: 404 }));
  }
  const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
        <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">update password code</h1>
    </td>
    </tr>
        <tr>
    <td>
        <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${code}</p>
    </td>
    </tr>
       </table>
    </td>
    </tr>
        </table>
    </body>
    </html>`;
  if (!sendMail({ to: `${email}`, subject: "confirmEmail", html })) {
    return next(new Error("this email rejected", { cause: 409 }));
  }
  return res.status(200).json({ message: "done", user });
});
/**=====update password================== */
export const updatePassword = asyncErrorHandler(async (req, res, next) => {
  const { email, forgetCode, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("this email not exist", { cause: 404 }));
  }
  if (user.forgetCode != forgetCode || user.forgetCode == null) {
    return next(new Error("In_Valid code", { cause: 400 }));
  }
  if (compareHash({ plaintext: password, encrypted: user.password })) {
    return next(
      new Error("you can not update by same password", { cause: 400 })
    );
  }
  const hasspassword = generatHash({ plaintext: password });
  user.password = hasspassword;
  user.forgetCode = null;
  user.changePasswordTime = Date.now();
  await user.save();

  return res.status(200).json({ message: "done", user });
});
