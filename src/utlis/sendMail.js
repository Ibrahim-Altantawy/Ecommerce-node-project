import nodemailer from 'nodemailer'


async function sendMail({ to,
    cc,
    bcc,
    subject,
    html,
    attachments=[]}={}) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.email_password,
        },
    })
    let info = await transporter.sendMail({

        from:`"${process.env.App_Name}"<${process.env.email}>`,
        to,
        cc,
        bcc,
        subject,
        html,
        attachments
    })
    return info.rejected.length ? false : true


}
export default sendMail;
